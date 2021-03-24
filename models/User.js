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
  static updateUser(id, number, location, experience) {
    return getDatabase().collection('users').findOneAndUpdate(
      {
        _id: ObjectID(id)
      },
      {
        $set: { number, location, experience }
      },
      {
        returnOriginal: false
      }
    )
  }
  static updatePdf(id, pdf) {
    return getDatabase().collection('users').findOneAndUpdate(
      {
        _id: ObjectID(id),
      },
      {
        $set: { pdf }
      },
      {
        returnOriginal: false
      },
    )
  }
  static updateImage(id, image) {
    return getDatabase().collection('users').findOneAndUpdate(
      {
        _id: ObjectID(id),
      },
      {
        $set: { image }
      },
      {
        returnOriginal: false
      },
    )
  }
  static updateBanner(id, banner) {
    return getDatabase().collection('users').findOneAndUpdate(
      {
        _id: ObjectID(id),
      },
      {
        $set: { banner }
      },
      {
        returnOriginal: false
      },
    )
  }
  static addJob(username, id, title, type, company, location, createdAt, company_photo, source_logo, salary) {
    return getDatabase().collection('users').update(
      { username },
      {
        $push: {
          jobsApplied: {
            id,
            title,
            type,
            company,
            location,
            createdAt,
            company_photo,
            source_logo,
            salary
          }
        }
      }
    )
  }

  static deleteJob(username, id) {
    return getDatabase().collection('users').update(
      { username },
      {
        $pull: {
          jobsApplied: {
            id
          }
        }
      }
    )
  }
}

module.exports = User;