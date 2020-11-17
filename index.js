const express = require('express')
const basicAuth = require('basic-auth');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express()
const {MongoClient, ObjectId} = require('mongodb');
const request = require("request-promise-native");
const fs = require('fs');
const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();


const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME || 'formio';
const PORT = 8080;
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

const mongoClient = new MongoClient(DB_URL);
let database;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));


// Add Basic authentication to our API.
app.use((req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials || credentials.name !== BASIC_AUTH_USERNAME || credentials.pass !== BASIC_AUTH_PASSWORD) {
    return res.status(401).json('Access denied');
  }

  next();
});


app.use('/viewer/node_modules', express.static(__dirname + '/node_modules'));
app.use('/viewer', express.static(__dirname + '/viewer'));

app.get('/api/get-submission/:form/:submission', async (req, res) => {
  try {
    const formId = req.params.form;
    const submissionId = req.params.submission;

    let submissionCollection = database.collection('submissions');

    const submission = await submissionCollection.findOne(ObjectId(submissionId));

    let formCollection = database.collection('forms');

    const form = await formCollection.findOne(ObjectId(formId));
    res.json({
      form,
      submission,
    })
  } catch (e) {
    res.sendStatus(400);
    res.json({
      status: 'error',
      message: e.toString(),
    });
  }

});

app.post('/api/webhook', async (req, res) => {
  if (!database.isConnected()) {
    res.sendStatus(500);
    res.json({
      status: 'error',
      message: 'Database not available',
    });
    return;
  }

  const formId = req.body.submission.form;
  const submissionId = req.body.submission._id;

  // Download PDF file
  let backendUrl = `${BACKEND_SERVER_URL}/viewer?form=${formId}&submission=${submissionId}`;

  let pdfUrl = `${PDF_SERVER_URL}/api/render?url=${encodeURIComponent(backendUrl)}&pdf.margin.top=2cm&pdf.margin.right=2cm&pdf.margin.bottom=2cm&pdf.margin.left=2cm`;

  let pdfBuffer = await request.get({uri: pdfUrl, encoding: null});

  let filename = submissionId + '.pdf';

  fs.writeFileSync('./files/' + filename, pdfBuffer);


  // Upload via FTP to somewhere
  // TODO: Set file name to submission creation time.
  try {
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

    res.sendStatus(400);
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
});

app.listen(PORT, HOST, () => {
  console.log(`Example app listening at http://${HOST}:${PORT}`)
});


mongoClient.connect((err) => {
  if (err) {
    console.error(err);
    app.close();
    return;
  }

  console.log('Connected to mongodb');

  database = mongoClient.db(DB_NAME);

  mongoClient.on('close', () => {
    app.close();
  });

  database.on('close', () => {
    // We lost the connection, so exit the script so that the docker container restarts.
    app.close();
  });
});

