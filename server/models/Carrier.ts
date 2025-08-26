import mongoose from 'mongoose'
import './User';

const carrierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },

  createdBy: { ref: 'User', type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

const Carrier = mongoose.models.Carrier || mongoose.model('Carrier', carrierSchema);

export default Carrier;