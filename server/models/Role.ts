import mongoose, { Schema, model } from 'mongoose';
import './User'

const roleSchema = new Schema({
  name: String,
  color: String,
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

const Role = mongoose.models.Role || model( 'Role', roleSchema )

export default Role
