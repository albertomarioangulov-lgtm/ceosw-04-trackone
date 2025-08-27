import mongoose, { Schema, model } from 'mongoose'
import './User';

const carrierSchema = new Schema({
  // Add `trim: true` to automatically remove leading/trailing whitespace.
  name: { type: String, required: true, trim: true },
  code: { type: String, unique: true, trim: true },

  createdBy: { ref: 'User', type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
});

const Carrier = mongoose.models.Carrier || model('Carrier', carrierSchema);

export default Carrier;