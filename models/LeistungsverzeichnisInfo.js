import mongoose from "mongoose";

const leistungsverzeichnisInfoSchema = new mongoose.Schema({
  key: String,
  name: String,
  version: Number,
});

const LeistungsverzeichnisInfo = mongoose.model('LeistungsverzeichnisInfo', leistungsverzeichnisInfoSchema);


export default LeistungsverzeichnisInfo;
