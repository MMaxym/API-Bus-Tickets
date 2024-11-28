import mongoose from 'mongoose'

const transport = new mongoose.Schema({
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }],
  startDate: Date,
  endDate: Date,
  bonus: Number,
});

export default mongoose.model('Transport', transport);