const { getDatabase } = require('../config/mongodb');
const { ObjectID } = require('mongodb')

class User {
  static register(user) {
    return getDatabase().collection('users').insertOne(user);
  }

  static findByEmail(email) {
    return getDatabase().collection('users').findOne({ email })
  }

  static findByUsername(username) {
    return getDatabase().collection('users').findOne({ username }) 
  }

  static deleteRow(row) {
    return getDatabase().collection('users').deleteOne(row);
  }

  static updateData(id, pdf, image, banner) {
    return getDatabase().collection('users').findOneAndUpdate(
      {
        _id: ObjectID(id),
      },
      {
        $set: {
          cvFile: !pdf ? 'https://image.flaticon.com/icons/png/512/337/337946.png' : pdf,
          photoProfile: !image ? 'https://www.freeiconspng.com/uploads/profile-icon-9.png' : image,
          bannerProfile: !banner ? 'https://www.freeiconspng.com/uploads/profile-icon-9.png' : banner
        }
      },
      {
        returnOriginal: false
      },
    )
  }
}

module.exports = User;