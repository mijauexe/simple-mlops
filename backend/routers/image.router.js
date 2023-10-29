require("dotenv").config();

const router = require("express").Router();
const Image = require("../models/image.model");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { jpg } = req.body;

    const newImage = await new Image({
      jpg,
    }).save();

    res.json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;