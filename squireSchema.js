import mongoose from 'mongoose'

//BASIC SQUIRE SCHEMA FOR MONGODB
const squireSchema = new mongoose.Schema({
  name: String,
  background: String,
  description: String,
  info: [String]
});

export default squireSchema