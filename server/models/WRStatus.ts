import mongoose, { Schema, model } from 'mongoose'

const wrStatusesSchema = new Schema({
  name: String,
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

export default mongoose.models.WRStatus || model( 'WRStatus', wrStatusesSchema )