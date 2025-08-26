import mongoose, { Schema, model } from 'mongoose';

const roleSchema = new Schema({
  name: String,
  color: String,
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

export default mongoose.models.Role || model( 'Role', roleSchema )
