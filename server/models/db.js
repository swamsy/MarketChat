const mongoose = require('mongoose');
const start = require('../utilities/populateDatabase');

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
    start();
  })
  .catch((err) => console.error(err));