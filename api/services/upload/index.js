const TABLE = 'images'
const Base = new (require('../../database/base'))(TABLE)

const getContentById = function (id, type) {
  return Base.getWhere(`id_${type} = ${id}`);
}

const getById = function (id) {
  return Base.getById(id);
}

const getContent = function () {
  return Base.getAll();
}

const addImage = async (values) => {
  // console.log('addContent VALUES', values);
  return Base.insert(values)
}

const updateContent = async (values) => {
  // console.log('updateContent VALUES', values);
  return Base.update(values)
}

const deleteContent = async (id) => {
  // console.log('deleteContent VALUES', id);
  return Base.remove(id)
}

const deletePicture = async (id) => {
  return Base.removeBy('id_usuario', id);
}

module.exports = {
  getContentById,
  getById,
  getContent,
  addImage,
  updateContent,
  deleteContent,
  deletePicture
}
