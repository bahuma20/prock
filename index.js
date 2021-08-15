import express from 'express'
import basicAuth from "express-basic-auth";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import request from "request-promise-native";
import SftpClient from "ssh2-sftp-client";
import moment from "moment-timezone";
import LeistungsverzeichnisInfo from "./models/LeistungsverzeichnisInfo.js";
import fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import Submission from "./models/Submission.js";
import Form from "./models/Form.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

mongoose.Promise = global.Promise;
mongoose.set('debug', true);


(async () => {
  const app = express();
  let sftp = new SftpClient();


  const DB_URL = process.env.DB_URL;
  const PORT = process.env.PORT || 8080;
  const HOST = '0.0.0.0';

  const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME || 'admin';
  const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || 'admin';

  const PDF_SERVER_URL = process.env.PDF_SERVER_URL;
  const BACKEND_SERVER_URL = process.env.BACKEND_SERVER_URL;

  const SFTP_HOST = process.env.SFTP_HOST;
  const SFTP_PORT = process.env.SFTP_PORT;
  const SFTP_USER = process.env.SFTP_USER;
  const SFTP_PASSWORD = process.env.SFTP_PASSWORD;
  const SFTP_DIRECTORY = process.env.SFTP_DIRECTORY;

  await mongoose.connect(DB_URL, {reconnectTries: 3, reconnectInterval: 500});


  console.log('connected to mongodb');

  app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));
  app.use(bodyParser.json({limit: '100mb'}));
  app.use(methodOverride('X-HTTP-Method-Override'));

// Public endpoints
  app.get('/api/leistungsverzeichnis', async (req, res) => {
    const infos = await LeistungsverzeichnisInfo.find().exec();
    res.json(infos)
  });

// Add Basic authentication to all following routes.
  app.use(basicAuth( {
    challenge: true,
    authorizer: myAuthorizer
  }));

  function myAuthorizer(username, password) {
    const userMatches = basicAuth.safeCompare(username, BASIC_AUTH_USERNAME)
    const passwordMatches = basicAuth.safeCompare(password, BASIC_AUTH_PASSWORD)

    return userMatches & passwordMatches
  }


  app.use('/viewer/node_modules', express.static(__dirname + '/node_modules'));
  app.use('/viewer', express.static(__dirname + '/viewer'));

  app.get('/api/get-submission/:form/:submission', async (req, res) => {
    try {
      const formId = req.params.form;
      const submissionId = req.params.submission;

      const submission = await Submission.findById(submissionId).exec();
      const form = await Form.findById(formId).exec();

      res.json({
        form,
        submission,
      })
    } catch (e) {
      console.error(e);
      res.status(400)
      res.json({
        status: 'error',
        message: e.toString(),
      });
      return;
    }

  });

  const handleWebhook = async (req, res) => {
    const formId = req.body.submission.form;
    const submissionId = req.body.submission._id;

    const submission = await Submission.findById(submissionId).exec();
    const form = await Form.findById(formId).exec();


    // Check if signed
    if (form.tags.indexOf('signing') !== -1 && !submission.data.signed) {
      res.json({
        status: 'error',
        message: 'Submission not yet signed, so no pdf generation.'
      });
      return;
    }


    // Download PDF file
    let backendUrl = `${BACKEND_SERVER_URL}/viewer?form=${formId}&submission=${submissionId}`;

    let pdfUrl = `${PDF_SERVER_URL}/api/render?url=${encodeURIComponent(backendUrl)}&authenticate.username=${BASIC_AUTH_USERNAME}&authenticate.password=${BASIC_AUTH_PASSWORD}&pdf.margin.top=1cm&pdf.margin.right=1cm&pdf.margin.bottom=1cm&pdf.margin.left=2cm`;

    let pdfBuffer = await request.get({uri: pdfUrl, encoding: null});

    let filename = `${form.path}_${moment(submission.data.created).tz("Europe/Berlin").format('yyyy-MM-DD_HH-mm-ss')}.pdf`;

    fs.writeFileSync('./files/' + filename, pdfBuffer);


    // Upload via SFTP to storage
    try {
      if (sftp.sftp) {
        await sftp.end();
      }

      await sftp.connect({
        host: SFTP_HOST,
        port: SFTP_PORT,
        username: SFTP_USER,
        password: SFTP_PASSWORD,
      });

      await sftp.put(fs.createReadStream('./files/' + filename), SFTP_DIRECTORY + filename);
      await sftp.end();
      console.log('uploaded');
    } catch (e) {
      console.error(e);

      res.status(400);
      res.json({
        status: 'error',
        message: e.toString(),
      });
      return;
    }


    // Delete the file from the server
    fs.unlinkSync('./files/' + filename);

    res.json({
      status: 'success',
      message: 'uploaded as PDF to ftp server',
    });
  }

  app.post('/api/webhook', async (req, res) => {
    return await handleWebhook(req, res);
  });

  app.put('/api/webhook', async (req, res) => {
    return await handleWebhook(req, res);
  });

  app.patch('/api/webhook', async (req, res) => {
    return await handleWebhook(req, res);
  });

  const server = app.listen(PORT, HOST, () => {
    console.log(`Example app listening at http://${HOST}:${PORT}`)
  });

  mongoose.connection.on('disconnected', () => {
    console.error('Connection to mongodb lost. Shutting down.')
    server.close();
  });

})();
