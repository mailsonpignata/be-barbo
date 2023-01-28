const Service = require('../../services/blog')

const express = require('express')
const router = express.Router()


router.post('/add', async (req, res) => {
  console.log("Entrou", req.body)
  try {
    const result = await Service.addBlog(req.body)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).json({ message: 'Error', data: null })
  }
})

router.put('/update/:id', async (req, res) => {
  try {
    const result = await Service.updateBlog(req, res)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).json({ message: 'Error', data: null })
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await Service.deleteBlog(req.params.id)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.get('/getall', async (req, res) => {
  try {
    const result = await Service.getBlog()
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.get('/getById/:id', async (req, res) => {
  try {
    const result = await Service.getBlogById(req.params.id)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

// Commentários

router.post('/comment/add', async (req, res) => {
  console.log("Entrou", req.body)
  try {
    const result = await Service.addBlogComment(req.body)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).json({ message: 'Error', data: null })
  }
})

router.put('/comment/update/:id', async (req, res) => {
  try {
    const result = await Service.updateBlogComment(req, res)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).json({ message: 'Error', data: null })
  }
})

router.delete('/comment/delete/:id', async (req, res) => {
  try {
    const result = await Service.deleteBlogComment(req.params.id)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.get('/comment/getall/:postId', async (req, res) => {
  try {
    const result = await Service.getBlogComment(req.params.postId)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

module.exports = router
