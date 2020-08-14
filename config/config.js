require('dotenv').config();
const configMongo = {
    urlBdDesa: process.env.MONGO_URI,
    urlBdTest: 'mongodb://localhost/testDb'
}

const configMail = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "ayden.fisher@ethereal.email",
    pass: "NKQ4yDQpbaFg3vWaJT",
  },
};

module.exports = {configMongo, configMail};




