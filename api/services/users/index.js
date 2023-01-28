const { Secure } = require('../../utils')
const TABLE = 'users'
const Base = new (require('../../database/base'))(TABLE)



const addUser = async (data) => {
  return Base.add(data);
}

const updateUser = async (req, res) => {
  return Base.update({id: req.params.id, ...req.body});
}

const deleteUser = async (id) => {
  return Base.remove(id);
}

const getUsers = async function () {
  return Base.getAll()
}

const getUserByUser = (user) => {
  return Base.getWhereLimit(`login = '${user}'`, 1)
}

exports.addUser = addUser
exports.getUsers = getUsers
exports.updateUser = updateUser
exports.deleteUser = deleteUser
exports.getUserByUser = getUserByUser
