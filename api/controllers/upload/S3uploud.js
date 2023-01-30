const fs = require('fs')
const path = require('path')
const mime = require('mime')
const aws = require('aws-sdk')
const uploadConfig = require('../../config/Upload')

class S3StorageProvider {
  constructor () {
    this.client = new aws.S3({
      region: 'us-east-2'
    })
  }

  async saveFile (file) {
    try {
      const originalPath = path.resolve(uploadConfig.tmpFolder, file)

      const ContentType = mime.getType(originalPath)

      if (!ContentType) {
        throw new Error('File not found')
      }

      const fileContent = await fs.promises.readFile(originalPath)

      await this.client
        .putObject({
          Bucket: uploadConfig.config.aws.bucket,
          Key: file,
          ACL: 'public-read',
          Body: fileContent,
          ContentType
        })
        .promise()

      await fs.promises.unlink(originalPath)

      return file
    } catch (error) {
      console.log(error)
    }
  }

  async deleteFile (file) {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file
      })
      .promise()
  }
}

module.exports = S3StorageProvider
