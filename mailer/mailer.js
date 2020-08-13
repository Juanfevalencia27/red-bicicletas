const nodemailer = require('nodemailer');
const config = require('./../config/config');

module.exports = nodemailer.createTransport(config.configMail);
