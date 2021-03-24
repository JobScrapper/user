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
    console.log(req.body);
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
  static async getUserByUsername(req, res) {
    try {
      let username = req.params.username;
      const data = await User.findByUsername(username);
      console.log(data);
      res.status(200).json(data);
    } catch(err) {
      res.status(500).json(err);
    }
  }
  static async updateUser(req, res) {
    try {
      let id = req.params.id
      const { phoneNumber, location, experience } = req.body
      const data = await User.updateUser(id, phoneNumber, location, experience)
      res.status(200).json(data.value)
    } catch (err) {
      res.status(500).json(err)
    }
  }
  static async addJobToUser(req, res) {
    try {
      const username = req.params.username;
      const { id, title, type, company, location, createdAt, company_photo, source_logo, salary } = req.body;
      const data = await User.addJob(username, id, title, type, company, location, createdAt, company_photo, source_logo, salary);
      res.status(200).json(data); 
    } catch(err) {
      console.log(err);
    }
  }
  static async deleteJobFromUser(req, res) {
    try {
      const username = req.params.username;
      const { id } = req.body;
      const data = await User.deleteJob(username, id);
      res.status(200).json(data);
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = UserController;
