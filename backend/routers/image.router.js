require("dotenv").config();
const router = require("express").Router();
const Image = require("../models/image.model");
const auth = require("../middleware/auth");
const express = require('express')
const multer = require('multer')
const bent = require('bent')

const fs = require('fs')

router.use(express.static('public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
    return req
  }
})

const upload = multer({ storage });

router.post("/", auth, async (req, res) => {
  try {
    res.json("ok");
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/upload", auth, upload.single('file'), async (req, res) => {
  try {
    let img = fs.readFileSync(req.file.path).toString('base64');

    const post1 = bent('http://localhost:5000/', 'POST', 'json', 200);
    const response = await post1('test-model', { "img": img });

    return res.status(200).json(response);
  } catch (err) {
    
    if(err.code === "ECONNREFUSED") {
      return res.status(400).json({ message: "Couldn't communicate with the ml server." });
    }
    
    return res.status(400).json({ message: err });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;