const config = {
  mongodbUri: 'mongodb://user:pass@prock.apps.bahuma.io:27017/formio', // The mongodb connect string
  formAlias: 'leistungsverzeichnis',                                   // The path of the Leistungsverzeichnis resource form
  formId: '',                                                          // The uuid of the Leistungsverzeichnis resource form
  verzeichnisKey: '',                                                  // A unique identifier for this Leistungsverzeichnis (for example "stadt_ingolstadt")
  verzeichnisName: 'Stadt Ingolstadt',                                 // A human readable lable for this Leistungsverzeichnis
}

export default config;
