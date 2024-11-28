import mongoose from 'mongoose'

const driver = new mongoose.Schema({
    surname: String,
    name: String,
    patronymic: String,
    experience: Number,
  });
  
export default mongoose.model('Driver', driver);