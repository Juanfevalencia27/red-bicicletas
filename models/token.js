const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definicion de objetos schema con indice
const objTokenSchema = new Schema({
  dateCreated: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 43200
  },
  token: {
      type: String,
      required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, //Referencia a objeto
    ref: "Usuario",
    required: true
  },
});

module.exports = mongoose.model("Token", objTokenSchema);
