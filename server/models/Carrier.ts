import mongoose, { Schema, model, models } from 'mongoose'

const carrierSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },

  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

const Carrier = models.Carrier || model('Carrier', carrierSchema);

export default Carrier;