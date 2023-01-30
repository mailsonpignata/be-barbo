const Service = require('../../services')
const { returnError } = require('../../utils')
//const { requireAuth } = require('../../services/auth')

const express = require('express')
const router = express.Router()

const fs = require('fs')
const path = require('path')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require('../../config/Upload')
// const unlinkFile = util.promisify(fs.unlink)


router.get('/file/:file', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})

router.get('/id/:id/:type', async (req, res) => {
  try {
    const result = await Service.Upload.getContentById(
      req.params.id,
      req.params.type,
    )
    console.log('result', result)
    return res.status(200).json({ message: 'OK', data: result })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.post('/image/:type/:enterpriseId/:statusId', upload.single('file'), async (req, res) => {
  const file = req.file
  console.log('file', file)

  const _file = file.originalname.split('.')
  const filename = `${file.filename}.${_file[_file.length - 1]}`
  const currentPath = path.resolve('uploads/', file.filename)
  const destinationPath = path.resolve('uploads/', filename)

  fs.rename(currentPath, destinationPath, function (err) {
    if (err) {
      return res.status(500).send(returnError(err))
    } else {
      console.log('File moved!')
    }
  })

  console.log('params', req.params, filename)

  const data = {
    type: req.params.type,
    enterprise_id: req.params.enterpriseId,
    status: req.params.statusId,
    link: filename,
  }

  try {
    const result = await Service.Upload.addImage(data)
    console.log('result add', result)
    return res.status(200).json({
      message: 'OK',
      url: filename,
      id: result,
    })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.post('/s3/:type/:id', upload.single('file'), async (req, res) => {
  const file = req.file
  console.log('file', file)

  const result_upload = await uploadFile(file)
  await unlinkFile(file.path)
  console.log('upload', result_upload)

  console.log('params', req.params, result_upload.key)

  const data = {
    ativo: true,
    id_usuario: req.params.type === 'usuario' ? req.params.id : null,
    id_exercicio: req.params.type === 'exercicio' ? req.params.id : null,
    id_modalidade: req.params.type === 'modalidades' ? req.params.id : null,
    id_conteudo: req.params.type === 'conteudo' ? req.params.id : null,
    arquivo: result_upload.key,
    data: new Date(),
  }

  try {
    const result = await Service.Upload.addContent(data)
    console.log('result add', result)
    return res.status(200).json({
      message: 'OK',
      url: result_upload.key,
      id: result,
    })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.post('/picture/:id', upload.single('file'), async (req, res) => {
  const file = req.file
  console.log('file', file)

  const _file = file.originalname.split('.')
  const filename = `${file.filename}.${_file[_file.length - 1]}`
  const currentPath = path.resolve('uploads/', file.filename)
  const destinationPath = path.resolve('uploads/', filename)

  fs.rename(currentPath, destinationPath, function (err) {
    if (err) {
      return res.status(500).send(returnError(err))
    } else {
      console.log('File moved!')
    }
  })

  console.log('params', req.params, filename)

  await Service.Upload.deletePicture(req.params.id)

  const data = {
    ativo: true,
    id_usuario: req.params.id,
    id_exercicio: null,
    id_modalidade: null,
    id_conteudo: null,
    arquivo: filename,
    data: new Date(),
  }

  try {
    const result = await Service.Upload.addContent(data)
    console.log('result add', result)
    return res.status(200).json({
      message: 'OK',
      url: filename,
      id: result,
    })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.post('/picture-s3/:id', upload.single('file'), async (req, res) => {
  const file = req.file
  console.log('file', file)

  const result_upload = await uploadFile(file)
  await unlinkFile(file.path)
  console.log('upload', result_upload)

  await Service.Upload.deletePicture(req.params.id)

  const data = {
    ativo: true,
    id_usuario: req.params.id,
    id_exercicio: null,
    id_modalidade: null,
    id_conteudo: null,
    arquivo: result_upload.key,
    data: new Date(),
  }

  try {
    const result = await Service.Upload.addContent(data)
    console.log('result add', result)
    return res.status(200).json({
      message: 'OK',
      url: result_upload.key,
      id: result,
    })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.delete('/:id', async (req, res) => {
  try {
    try {
      const file = await Service.Upload.getById(req.params.id)
      console.log('delete arquivo', file)
      const filePath = path.resolve('uploads/', file[0].arquivo)
      fs.unlinkSync(filePath)
    } catch (error) {
      console.error('não foi possível remover o arquivo: ', error)
    }
    await Service.Upload.deleteContent(req.params.id)
    return res.status(200).json({ message: 'OK' })
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.get('/image/:key', async (req, res) => {
  try {
    console.log(req.params)
    const file = path.resolve('uploads/', req.params.key)
    res.sendFile(file)
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

router.get('/image-s3/:key', async (req, res) => {
  try {
    console.log(req.params.key)
    if (req.params.key && req.params.key !== 'null') {
      const key = req.params.key
      const readStream = getFileStream(key)
        .on('error', (e) => {
          return res.status(500).send({ message: 'ERRO', data: e })
        })
        .pipe(res)
        .on('data', (data) => {
          console.log('data', data)
        })
    } else {
      return res.status(500).send({ message: 'ERRO' })
    }
  } catch (error) {
    return res.status(500).send(returnError(error))
  }
})

module.exports = router
