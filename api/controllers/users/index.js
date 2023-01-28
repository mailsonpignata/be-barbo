const Service = require('../../services')

const express = require('express')
const router = express.Router()


router.post('/add', async (req, res) => {
  try {
    const result = await Service.Users.addUser(req.body)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).json({ message: 'Error', data: null })
  }
})

router.put('/update/:id', async (req, res) => {
  try {
    const result = await Service.Users.updateUser(req, res)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).json({ message: 'Error', error: error })
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await Service.Users.deleteUser(req.params.id)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.get('/getall', async (req, res) => {
  try {
    const result = await Service.Users.getUsers()
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

module.exports = router
