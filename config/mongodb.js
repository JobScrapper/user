const { MongoClient } = require('mongodb');

let database = null;

async function connect() {
  try {
    const uri = 'mongodb+srv://stanly-admin:Sembilan99@jobscrapper.xqsks.mongodb.net/jobScrapper?retryWrites=true&w=majority';
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db('jobScrapperDB');
    database = db;
    return db;
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  connect,
  getDatabase() {
    return database
  }
}