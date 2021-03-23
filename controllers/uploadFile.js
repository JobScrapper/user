const User = require("../models/User");
const { Storage } = require('@google-cloud/storage')
const formidable = require('formidable')
const UUID = require('uuid-v4') // unique string (new Date + etc code)
let uuid = UUID()

class Upload {
  static async uploadFile(req, res) {
    let id = req.params.id
    const storage = new Storage({
      projectId: 'jobseeker-123',
      keyFilename: 'firabaseUpload.json'
    })
    const bucket = storage.bucket('jobseeker-123.appspot.com')
    try {
      const form = formidable({ multiples: true })
      form.parse(req, async (err, fields, files) => {
        let pdf_result
        let photo_result
        let banner_result
        let validation = []
        if (err) {
          return err // bisa juga di next kalo ada middleware
        }
        console.log('start pdf')
        if (files.pdf.size > 0) {
          // console.log(files.pdf.type) // application/pdf
          if (files.pdf.type !== 'application/pdf') {
            validation.push('Type file must be pdf')
          }
          if (files.pdf.size > 5000000) {
            validation.push('Pdf size over 5 mb')
          }
          const file_name = `cv${Date.now()}`
          const data = await bucket.upload(files.pdf.path, {
            destination: `cv/${file_name}`, //destinasi di firebase
            metadata: {
              contentType: files.pdf.type,
              metadata: {
                firebaseStorageDownloadTokens: uuid
              }
            }
          })
          const url_pdf = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(data[0].name)}?alt=media&token=${uuid}`
          pdf_result = url_pdf // setelah ini bisa return update user prifile
          console.log(validation)
        }
        console.log('start image')
        if (files.image.size > 0) {
          // console.log(files.image.type) // image/jpeg
          if (files.image.type != 'image/jpeg') {
            console.log('di type')
            validation.push('Type file must be image/jpeg')
          }
          if (files.image.size > 3000000) {
            validation.push('Image Profile size over 3 mb')
          }
          const photo_name = `Photo${Date.now()}`
          const imageData = await bucket.upload(files.image.path, {
            destination: `images/${photo_name}`, //destinasi di firebase
            metadata: {
              contentType: files.image.type,
              metadata: {
                firebaseStorageDownloadTokens: uuid
              }
            }
          })
          const url_photoProfile = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imageData[0].name)}?alt=media&token=${uuid}`
          photo_result = url_photoProfile // setelah ini bisa return update user prifile
          console.log(validation)
        }
        console.log('start banner')
        if (files.banner.size > 0) {
          console.log(files.banner.size)
          if (files.banner.type !== 'image/jpeg') {
            validation.push('Banner type file must be image/jpeg')
          } else if (files.banner.size > 3000000) {
            console.log('lewat type')
            validation.push('Banner Profile size over 3 mb')
          }
          console.log('lewat size')
          const banner_name = `Banner${Date.now()}`
          const data = await bucket.upload(files.banner.path, {
            destination: `banners/${banner_name}`, //destinasi di firebase
            metadata: {
              contentType: files.banner.type,
              metadata: {
                firebaseStorageDownloadTokens: uuid
              }
            }
          })
          const url_banner = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(data[0].name)}?alt=media&token=${uuid}`
          banner_result = url_banner
          console.log(validation)
        }
        console.log(validation, 'terakhir')
        if (validation.length > 0) {
          return res.status(400).json({ validation })
        } else {
          let result = await User.updateData(id, pdf_result, photo_result, banner_result)
          return res.status(200).json(result.value)
        }
      })
    } catch (err) {
      return err
    }
  }
}

module.exports = Upload