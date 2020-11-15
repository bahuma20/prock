const express = require('express')
const app = express()
const {MongoClient, ObjectId} = require('mongodb');

const DB_URL = process.env.DB_URL || 'mongodb://prock.apps.bahuma.io:27017';
const DB_NAME = process.env.DB_NAME || 'formio';
const PORT = 8080;
const HOST = '0.0.0.0';

const client = new MongoClient(DB_URL);
let database;

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
  }

})


app.listen(PORT, HOST, () => {
  console.log(`Example app listening at http://${HOST}:${PORT}`)
});


client.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Connected to mongodb');

  database = client.db(DB_NAME);
});
