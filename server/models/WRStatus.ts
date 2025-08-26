import mongoose, { Schema, model, models } from 'mongoose'

const wrStatusSchema = new Schema({
  name: String,
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

const WRStatus = models.WRStatus || model( 'WRStatus', wrStatusSchema )

export default WRStatus