const mongoose = require('mongoose');
//const fillLogos = require('../scripts/fillLogos');

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
    //fillLogos();
  })
  .catch((err) => console.error(err));