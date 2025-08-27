import mongoose, { Schema, model } from 'mongoose'
import bcryptjs from 'bcryptjs';

import './Role'

const userSchema = new Schema({
  name: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  initials:{ type: String },
  avatar:{
    icon: { type: String, default: 'account' },
  },
  color: { type: String, default: 'blue' },
  roles: [{ ref: 'Role', type: Schema.Types.ObjectId }],
  permissions: [ String ],
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10)
  return await bcryptjs.hash(password, salt)
}

userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcryptjs.compare(password, receivedPassword)
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

const User = mongoose.models.User || model( 'User', userSchema )

export default User