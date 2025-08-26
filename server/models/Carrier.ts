import mongoose, { Schema, model } from 'mongoose'

const carrierSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },

  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

export default mongoose.models.Carrier || model( 'Carrier', carrierSchema )