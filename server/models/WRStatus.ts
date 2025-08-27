import mongoose, { Schema, model } from 'mongoose'
import './User'

const wrStatusSchema = new Schema({
  name: String,
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

const WRStatus = mongoose.models.WRStatus || model( 'WRStatus', wrStatusSchema )

export default WRStatus