const User = require('../models/User');

async function authorize(req, res, next) {
  let userEmail = +req.decoded.email;
  try {
    let user = await User.findOne({ where: { email: userEmail } });
    if (user) {
      next();
    } else {
      throw {
        name: 'CustomError',
        msg: 'User not found!',
        status: 404
      }
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  authorize
}