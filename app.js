const env = process.env.NODE_ENV;
if (env != 'production') {
  require('dotenv').config();
}
const express = require('express');
const { connect } = require('./config/mongodb');
const app = express();
const PORT = process.env.PORT || 3002;
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connect()
.then(async (db) => {
  console.log('MongoDB successfully connected!');

    app.use(router);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}...`);
    })
  })

module.exports = app;