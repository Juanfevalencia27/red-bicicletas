const configMongo = {
    urlBdDesa: 'mongodb://localhost/red_bicicletas',
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




