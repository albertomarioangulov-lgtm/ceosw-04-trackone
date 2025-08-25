import { Schema, model } from 'mongoose'

const roleSchema = new Schema({
  name: String,
  color: String,
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

export default model( 'Role', roleSchema )
