const {Schema, model} = require("mongoose");

const Role = new Schema({
    value: {type: String, unicode: true, required: true, default: "USER"},
});


module.exports = exports = model("Role", Role);
