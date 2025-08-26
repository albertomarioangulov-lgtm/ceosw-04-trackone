import { Schema, model, models } from 'mongoose'

const wrStatusesSchema = new Schema({
  name: String,
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

export default models.WRStatus || model( 'WRStatus', wrStatusesSchema )