import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "~~/server/models/User";

const config = useRuntimeConfig()

export default defineEventHandler( async (event) => {


  const body = await readBody(event)

  const userFound = await User.findOne({ email: body.email }).exec()
  if (!userFound) return { message: 'User not found', userfound: userFound }

  const matchPassword = await bcryptjs.compare(body.password, userFound.password)
  if(!matchPassword) return { token: null, message: 'Invalid Password' }

  const accessToken = jwt.sign({ id: userFound._id }, config.authSecret, { expiresIn: '30d' })

  return {
    token: {
      accessToken,
      userFound
    }
  }
})