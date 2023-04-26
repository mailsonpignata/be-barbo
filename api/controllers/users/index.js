const Service = require('../../services')
const {
  encrypt,
  returnError,
  makeHash,
  sendEmail,
  compare,
} = require('../../utils')

const express = require('express')
const router = express.Router()

router.post('/validate', async (req, res) => {
  try {
    // console.log('req.body', await encrypt(`hash:${req.body.usuario}:${req.body.password}`))
    const validate_user = await compare(`hash:${req.body.usuario}:${process.env.SECRET_KEY}`, req.body.token)
    console.log('VALIDATE: ', req.body)
    console.log('VALIDATE: ')

    return res.status(200).json({ message: 'OK', logged: validate_user })
  } catch (error) {
    return res.status(500).json({ message: 'Error', data: null })
  }
})

router.post('/login', async (req, res) => {
  try {
    let data = null;
    
    const pass = await encrypt(req.body.usuario)
    const result = await Service.Users.getUserByUser(req.body.usuario)
    console.log('result', result)
    const validatePass = await compare(req.body.password, result[0].password)
    if(result.length > 0){
      const token = await encrypt(`hash:${req.body.usuario}:${process.env.SECRET_KEY}`)
      data = { ...result[0], token }
    }
    return res.status(200).json({ message: 'OK', data })
  } catch (error) {
    return res.status(500).json({ message: 'Error', data: null })
  }
})

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
