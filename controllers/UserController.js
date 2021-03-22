const User = require("../models/User");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const validateInput = require("../helpers/registerValidation");
const nodemailer = require("nodemailer");

class UserController {
  static async register(req, res, next) {
    let { username, email, password } = req.body;

    var transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "cd93ec98e85139",
        pass: "09277ea5ff78b7"
      }
    });

    try {
      validateInput(email, password, username);
      const emailInput = await User.findByEmail(email);
      const usernameInput = await User.findByUsername(username);
      if (emailInput)
        throw {
          name: "CustomError",
          msg: "Email is already registered!",
          status: 400,
        };
      if (usernameInput)
        throw {
          name: "CustomError",
          msg: "Username is already registered!",
          status: 400,
        };
      password = hashPassword(password);
      const newUser = await User.register({ username, email, password });
      const user = newUser.ops[0];
      console.log(newUser);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
      console.log(user.email, '<<<<<<<<<<<<<<<<<<<<');
      const info = await transporter.sendMail({
        from: '"JobScrapper" <jobscrapper@mail.com>', // sender address
        to: user.email, // list of receivers
        subject: "Register Success", // Subject line
        html: `
        <div>
          <h1 style="color: #F05454; text-align: center; margin: 20px 0;    background-color: #222831;
            padding: 10px;border-radius: 20px;">JobScrapper</h1>
          <p style="text-align: center">congratulations, your account has been successfully registered with Job Scrapper</p>
          <p style="text-align: center;margin-top: 40px;"><a href="https://jobscrapper.vercel.app/login" style="
          text-decoration: none;
          color: #fff;
          background-color: #F05454;
          padding: 10px 20px;
          border-radius: 20px;
          ">Login</a></p>
        </div>`, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      validateInput(email, password, "default");
      console.log(req.body);
      const user = await User.findByEmail(email);
      if (!user) {
        throw {
          name: 'CustomError',
          msg: 'Email or password is incorrect!',
          status: 400
        }
      } else {
        const comparedPassword = comparePassword(password, user.password);
        if (!comparedPassword) {
          throw {
            name: 'CustomError',
            msg: 'Email or password is incorrect!',
            status: 400
          }
        } else {
          const access_token = generateToken({
            id: user.id,
            username: user.username,
            email: user.email
          })
          res.status(200).json({
            access_token: access_token,
            email: user.email,
            username: user.username
          })
        }
      }
    } catch(err) {
      next(err);
    }
  }

  static async updateProfile(req, res) {
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
        // console.log('start pdf')
        if (files.pdf.size > 0) {
          // console.log(files.pdf.type) // application/pdf
          if (files.pdf.type !== 'application/pdf') {
            validation.push('Type file must be pdf')
          }
          if (files.pdf.size > 5000000) {
            validation.push('Pdf size over 5 mb')
          } else {
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
            // console.log(validation)
          }
        }
        // console.log('start image')
        if (files.image.size > 0) {
          // console.log(files.image.type) // image/jpeg
          if (files.image.type != 'image/jpeg') {
            // console.log('di type')
            validation.push('Type file must be image/jpeg')
          }
          if (files.image.size > 3000000) {
            validation.push('Image Profile size over 3 mb')
          } else {
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
            // console.log(validation)
          }
        }
        // console.log('start banner')
        if (files.banner.size > 0) {
          // console.log(files.banner.size)
          if (files.banner.type !== 'image/jpeg') {
            validation.push('Banner type file must be image/jpeg')
          } else if (files.banner.size > 3000000) {
            // console.log('lewat type')
            validation.push('Banner Profile size over 3 mb')
          } else {
            // console.log('lewat size')
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
            // console.log(validation)
          }
        }
        // console.log(validation, 'terakhir')
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

module.exports = UserController;
