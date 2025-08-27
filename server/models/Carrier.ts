import mongoose from 'mongoose'
import './User';

const carrierSchema = new mongoose.Schema({
  // Add `trim: true` to automatically remove leading/trailing whitespace.
  name: { type: String, required: true, trim: true },
  code: { type: String, unique: true, trim: true },

  createdBy: { ref: 'User', type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
});

const Carrier = mongoose.models.Carrier || mongoose.model('Carrier', carrierSchema);

export default Carrier;