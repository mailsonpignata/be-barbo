const { Secure } = require('../../utils')
const TABLE = 'blog'
const Base = new (require('../../database/base'))(TABLE)
const TABLE_Comment = 'blog_comment'
const Base_Comment = new (require('../../database/base'))(TABLE_Comment)



const addBlog = async (data) => {
  return Base.add(data);
}

const updateBlog = async (req, res) => {
  return Base.update({id: req.params.id, ...req.body});
}

const deleteBlog = async (id) => {
  return Base.remove(id);
}

const getBlog = async function () {
  return Base.getAll()
}

const getBlogById = async function (id) {
  return Base.getById(id)
}

//Blog Commentarios
const addBlogComment = async (data) => {
  return Base_Comment.add(data);
}

const updateBlogComment = async (req, res) => {
  return Base_Comment.update({id: req.params.id, ...req.body});
}

const deleteBlogComment = async (id) => {
  return Base_Comment.remove(id);
}

const getBlogComment = async function (id) {
  return Base_Comment.getByPostId(id)
}



exports.addBlog = addBlog
exports.getBlog = getBlog
exports.updateBlog = updateBlog
exports.deleteBlog = deleteBlog
exports.getBlogById = getBlogById
exports.addBlogComment = addBlogComment
exports.getBlogComment = getBlogComment
exports.updateBlogComment = updateBlogComment
exports.deleteBlogComment = deleteBlogComment
