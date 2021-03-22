const { getDatabase } = require('../config/mongodb');

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
}

module.exports = User;