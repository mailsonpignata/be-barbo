const Service = require('../../services/enterprise')

const express = require('express')
const router = express.Router()


router.post('/add', async (req, res) => {
  console.log("Entrou", req.body)
  try {
    const result = await Service.addEnterprise(req.body)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).json({ message: 'Error', data: null })
  }
})

router.put('/update/:id', async (req, res) => {
  try {
    const result = await Service.updateEnterprise(req, res)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).json({ message: 'Error', data: null })
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await Service.deleteEnterprise(req.params.id)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.get('/getall', async (req, res) => {
  try {
    const result = await Service.getEnterprise()
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.get('/getById/:id', async (req, res) => {
  try {
    const result = await Service.getEnterpriseById(req.params.id)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.get('/getAllFilter/:city/:type', async (req, res) => {
  try {
    const result = await Service.getEnterpriseFilter(req.params.city, req.params.type)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

module.exports = router
