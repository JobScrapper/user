const User = require('../models/User');
const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const validateInput = require('../helpers/registerValidation');

class UserController {
  static async register(req, res, next) {
    let { username, email, password } = req.body;
    try {
      validateInput(email, password, username);
      const emailInput = await User.findByEmail(email);
      const usernameInput = await User.findByUsername(username);
      if (emailInput) throw {
        name: 'CustomError',
        msg: 'Email is already registered!',
        status: 400
      }
      if (usernameInput) throw {
        name: 'CustomError',
        msg: 'Username is already registered!',
        status: 400 
      }
      password = hashPassword(password);
      const newUser = await User.register({ username, email, password });
      const user = newUser.ops[0];
      console.log(newUser);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email
      })
    } catch(err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      validateInput(email, password, "default");
      console.log(req.body);
      const user = await User.findByEmail(email);
      if (!user) throw {
        name: 'CustomError',
        msg: 'Email or password is incorrect!',
        status: 400
      }
      const comparedPassword = comparePassword(password, user.password);
      if (!comparedPassword) throw {
          name: 'CustomError',
          msg: 'Email or password is incorrect!',
          status: 400
        }
      
      const access_token = generateToken({
        id: user.id,
        username: user.username,
        email: user.email
      })
      console.log(access_token);
      res.status(200).json({
        access_token: access_token,
        email: user.email,
        username: user.username
      })
    } catch(err) {
      next(err);
    }
  }
}

module.exports = UserController;