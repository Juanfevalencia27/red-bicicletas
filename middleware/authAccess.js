const jwt = require('jsonwebtoken');

module.exports = {
  validarUsuario: function (req, res, next) {
    if (!req.headers['x-access-token']) {
      res.status(400).json({status: 'Error', message: 'No tiene token para acceso', data: null});
    }

    jwt.verify(
      req.headers["x-access-token"],
      req.app.settings["secretKey"],
      function (err, decoded) {
        if (err)
          return res.status(400).json({
            status: "Error",
            message: err.message,
            data: null,
          });
        req.body.userID = decoded.id;
        console.log("jwt verify " + decoded);
        next();
      }
    );
  },

  generateToken: function (id_Usuario, req) {
      return jwt.sign({ id: id_Usuario }, req.app.settings["secretKey"], {
        expiresIn: "1d",
      });
  },
};
