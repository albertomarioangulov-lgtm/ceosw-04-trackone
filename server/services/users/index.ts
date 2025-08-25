import User from "~~/server/models/User"

const userService = () => {

  const getUserById = async (event:any) => {
    const id = event.context.params!.id
    const data = await User.findById( id )
      .populate({ path: 'roles', select: 'name color' })
      .populate({ path: 'createdBy', select: 'name initials color' })
      .exec()
    return data
  }

  return {
    getUserById
  }
}

export default userService