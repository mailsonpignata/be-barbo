const uploadConfig = require('../../config/Upload')
const Service = require('../../services')
const { returnError } = require('../../utils')
const { requireAuth } = require('../../services/auth')

const path = require('path')
const fs = require('fs')
const multer = require('multer')
const S3Storage = require('./S3uploud')

const express = require('express')
const router = express.Router()

const access = 30
const FileUpload = multer(uploadConfig.multer)
let Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './api/static/images')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
  }
})

let upload = multer({
  storage: Storage
}).single('file') //Field name and max count

const openFolder = (dirs) => {
  if (fs.existsSync(dirs)) return dirs
  
  let path = dirs.split('/')
  let fold = '.'
  path.shift()
  path.forEach(e => {
    fold = `${fold}/${e}`
    if (!fs.existsSync(fold)) {
      fs.mkdirSync(fold)
    }
  })
  return fold
}

router.get('/id/:id/:type', requireAuth, async (req, res) => {
  try {
    const result = await Service.Upload.getContentById(req.params.id, req.params.type)
    console.log('result', result)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.post('/all/:type/:id', FileUpload.single('file'), async (req, res) => {
  const avatarFilename = req.file.filename
  const s3storage = new S3Storage()
  await s3storage.saveFile(avatarFilename)
  
  console.log('params', req.params, avatarFilename)
  
  const data = {
    ativo: true,
    id_usuario: req.params.type === 'usuario' ? req.params.id : null,
    id_exercicio: req.params.type === 'exercicio' ? req.params.id : null,
    id_modalidade: req.params.type === 'modalidades' ? req.params.id : null,
    id_conteudo: req.params.type === 'conteudo' ? req.params.id : null,
    arquivo: avatarFilename,
    data: new Date(),
  }
  
  try {
    const result = await Service.Upload.addContent(data)
    console.log('result add', result)
    return res.status(200).json({
      message: 'OK',
      url: avatarFilename ? `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${avatarFilename}` : null,
      id: result,
    })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.post('/picture/:id', FileUpload.single('file'), async (req, res) => {
  
  const avatarFilename = req.file.filename
  const s3storage = new S3Storage()
  await s3storage.saveFile(avatarFilename)
  
  console.log('params', req.params, avatarFilename)
  
  await Service.Upload.deletePicture(req.params.id)
  
  const data = {
    ativo: true,
    id_usuario: req.params.id,
    id_exercicio: null,
    id_modalidade: null,
    id_conteudo: null,
    arquivo: avatarFilename,
    data: new Date(),
  }
  
  try {
    const result = await Service.Upload.addContent(data)
    console.log('result add', result)
    return res.status(200).json({
      message: 'OK',
      url: avatarFilename ? `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${avatarFilename}` : null,
      id: result,
    })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Service.Upload.deleteContent(req.params.id);
    return res.status(200).json({ message: 'OK' })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.get('/image/:filename', async (req, res) => {
  const Filename = req.params.file
  return res.status(200).json({ file: `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${Filename}` })
  // res.sendFile(path.resolve(`https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${Filename}`))
})

module.exports = router
