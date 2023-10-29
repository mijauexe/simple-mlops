const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  jpg: { type: String, required: true },
  digit: { type: String }
});

const Image = mongoose.model("image", imageSchema);

module.exports = Image;