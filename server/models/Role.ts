import mongoose, { Schema, model, models } from 'mongoose';

const roleSchema = new Schema({
  name: String,
  color: String,
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

const Role = models.Role || model( 'Role', roleSchema )

export default Role
