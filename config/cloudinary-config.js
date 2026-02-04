const cloudinary = require('cloudinary').v2;
const config = require('./dot-env');

cloudinary.config({ 
  cloud_name: config.cloudinary.name , 
  api_key: config.cloudinary.apiKey, 
  api_secret: config.cloudinary.apiSecret 
});

module.exports = { cloudinary }