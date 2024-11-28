import mongoose from 'mongoose'

const route = new mongoose.Schema({
  name: String,
  distance: Number,
  cost: Number,
});

export default mongoose.model('Route', route);
