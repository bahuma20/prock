import fs from 'fs';
import csv from 'csv-parser';
import mongoose from "mongoose";
import _ from "lodash";
import config from "./config.js";
import LeistungsverzeichnisInfo from "../../models/LeistungsverzeichnisInfo.js";
import Submission from "../../models/Submission.js";

const uri = config.mongodbUri;

mongoose.Promise = global.Promise;
mongoose.set('debug', true);


const objectId = (id) => {
  try {
    return _.isObject(id)
      ? id
      : mongoose.Types.ObjectId(id);
  } catch (e) {
    return id;
  }
};

(async function() {

  try {
    const conn = await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

    console.log('connected');

    // Delete old submissions
    console.log("Delete old submissions");
    await Submission.remove({
      form: "61002812a123bd2627c8cf9e",
      'data.verzeichnis': config.verzeichnisKey,
    }).exec();
    console.log("Deleted");


    await new Promise((resolve,reject) => {

      let buffer = [],
        counter = 0;


      console.log("Starting import");

      let stream = fs.createReadStream('source.csv')
        .pipe(csv({
          separator: ";",
          skipLines: 2,
          mapHeaders: ({header, index}) => header.toLowerCase(),
        }))
        .on("error", reject)
        .on("data", async data => {
          if (data.typ !== "Gruppe" && data.typ !== "Position") {
            return;
          }

          const submissionData = {
            verzeichnis: config.verzeichnisKey,
            typ: data.typ.toLowerCase(),
            ordnungszahl: data.ordnungszahl,
            kurztext: data.kurztext,
            langtext: data.langtext,
            einheit: data.einheit,
            einheitspreis: data.einheitspreis,
            mwst: data['mwst.'],
          };

          const doc = {
            owner: objectId('5fb3d73170a2f9bc828686a4'),
            deleted: null,
            // roles: [],
            data: submissionData,
            // access: [],
            form: objectId(config.formId),
            externalIds: [],
          };

          stream.pause();
          buffer.push(doc);
          counter++;
          // log(doc);
          try {
            if ( counter > 1000 ) {
              console.log("Inserting 1000 submissions");
              await Submission.insertMany(buffer);
              buffer = [];
              counter = 0;
            }
          } catch(e) {
            stream.destroy(e);
          }

          stream.resume();

        })
        .on("end", async () => {
          try {
            if ( counter > 0 ) {
              console.log(`Inserting ${counter} submissions`);
              await Submission.insertMany(buffer);
              buffer = [];
              counter = 0;
              resolve();
            }
          } catch(e) {
            stream.destroy(e);
          }
        });

    });


    // Increase LeistungsverzeichnisInfo VersionNumber
    let verzeichnisInfo = await LeistungsverzeichnisInfo.findOne({
      key: config.verzeichnisKey,
    }).exec();

    if (!verzeichnisInfo) {
      verzeichnisInfo = new LeistungsverzeichnisInfo({
        key: config.verzeichnisKey,
        version: 0,
      });
    }

    verzeichnisInfo.set('version', verzeichnisInfo.get('version') + 1);
    verzeichnisInfo.set('name', config.verzeichnisName);

    await verzeichnisInfo.save();

    console.log("Import finished");


  } catch(e) {
    console.error(e)
  } finally {
    process.exit()
  }


})()
