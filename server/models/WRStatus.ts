import mongoose from 'mongoose'
import './User'

const wrStatusSchema = new mongoose.Schema({
  name: String,
  createdBy: { ref: "User", type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

const WRStatus = mongoose.models.WRStatus || mongoose.model( 'WRStatus', wrStatusSchema )

export default WRStatus