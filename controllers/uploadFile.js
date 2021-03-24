const User = require("../models/User");
const { Storage } = require('@google-cloud/storage')
const formidable = require('formidable')
const UUID = require('uuid-v4') // unique string (new Date + etc code)
let uuid = UUID()
const storage = new Storage({
  projectId: 'jobseeker-123',
  keyFilename: 'firabaseUpload.json'
})
const bucket = storage.bucket('jobseeker-123.appspot.com')

class Upload {
  static async uploadPdf(req, res) {
    let id = req.params.id
    try {
      const form = formidable({ multiples: true })
      form.parse(req, async (err, fields, files) => {
        let url_pdf = 'https://image.flaticon.com/icons/png/512/337/337946.png'
        let validation = []
        if (err) {
          return err // bisa juga di next kalo ada middleware
        }
        if (files.pdf.size > 0) {
          console.log('cek size ok')
          if (files.pdf.type !== 'application/pdf') {
            validation.push('Type file must be pdf')
          }
          console.log('cek type ok')
          if (files.pdf.size > 5000000) {
            validation.push('Pdf size over 5 mb')
          }
          console.log('cek max size ok')
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
          console.log('cek firebase ok')
          url_pdf = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(data[0].name)}?alt=media&token=${uuid}`
          console.log(url_pdf)
        }
        if (validation.length > 0) {
          console.log('error')
          return res.status(400).json({ validation })
        } else {
          console.log('hasil')
          let result = await User.updatePdf(id, url_pdf)
          console.log(result)
          return res.status(200).json(result.value)
        }
      })
    } catch (err) {
      return err
    }
  }
  static async uploadImage(req, res) {
    try {
      let id = req.params.id
      const form = formidable({ multiples: true })
      form.parse(req, async (err, fields, files) => {
        let url_photoProfile = "https://www.freeiconspng.com/uploads/profile-icon-9.png"
        let validation = []
        if (files.image.size > 0) {
          console.log('cek size ok')
          if (files.image.type != 'image/jpeg') {
            console.log('di type')
            validation.push('Type file must be image/jpeg')
          }
          console.log('cek type ok')
          if (files.image.size > 3000000) {
            validation.push('Image Profile size over 3 mb')
          }
          console.log('cek max size ok')
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
          url_photoProfile = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imageData[0].name)}?alt=media&token=${uuid}`
          console.log('cek firebase ok')
        }
        if (validation.length > 0) {
          console.log('error')
          return res.status(400).json({ validation })
        } else {
          console.log('hasil')
          let result = await User.updateImage(id, url_photoProfile)
          console.log(result)
          return res.status(200).json(result.value)
        }
      })
    } catch (err) {
      res.status(500).json(err)
    }
  }
  static async uploadBanner(req, res) {
    try {
      let id = req.params.id
      const form = formidable({ multiples: true })
      form.parse(req, async (err, fields, files) => {
        let url_banner = "https://www.freeiconspng.com/uploads/profile-icon-9.png"
        let validation = []
        if (files.banner.size > 0) {
          if (files.banner.type !== 'image/jpeg') {
            validation.push('Banner type file must be image/jpeg')
          } else if (files.banner.size > 3000000) {
            validation.push('Banner Profile size over 3 mb')
          }
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
          url_banner = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(data[0].name)}?alt=media&token=${uuid}`
        }
        if (validation.length > 0) {
          return res.status(400).json({ validation })
        } else {
          let result = await User.updateBanner(id, url_banner)
          console.log(result)
          return res.status(200).json(result.value)
        }
      })
    } catch (err) {

    }
  }
}

module.exports = Upload