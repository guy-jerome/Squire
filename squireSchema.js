import mongoose from 'mongoose'

const squireSchema = new mongoose.Schema({
  name: String,
  background: String,
  description: String,
  info: [String]
});

export default squireSchema