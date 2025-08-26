import mongoose from 'mongoose';
import User from './User'

const roleSchema = new mongoose.Schema({
  name: String,
  color: String,
  createdBy: { ref: "User", type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

const Role = mongoose.models.Role || mongoose.model( 'Role', roleSchema )

export default Role
