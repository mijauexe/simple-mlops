const router = require("express").Router();
const User = require("../models/user.model");
const EmailVerifyToken = require("../models/token.model")

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/email");

router.post("/", async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;
    console.log(req.body)
    if (!email || !password || !passwordVerify)
      return res
        .status(400)
        .json({ message: "Please enter all required fields." });

    if (password.length < 6)
      return res.status(400).json({
        message: "Please enter a password of at least 6 characters.",
      });

    if (password !== passwordVerify)
      return res.status(400).json({
        message: "Please enter the same password twice.",
      });

    const existingUser = await User.findOne({ email: email });
    if (existingUser && !existingUser.verified)
      return res.status(400).json({
        message: "You haven't verified your email address.",
      });

    if (existingUser && existingUser.verified)
      return res.status(400).json({
        message: "An account with this email already exists.",
      });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: req.body.email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      {
        user: savedUser._id
      },
      process.env.JWT_SECRET
    );

    const emailToken = await new EmailVerifyToken({
      userId: savedUser._id,
      token: token,
    }).save();

    const url = `${process.env.BASE_URL}/verify?id=${savedUser.id}&token=${emailToken.token}`;
    console.log(url)
    await sendMail(savedUser.email, "Verify Email", process.env.BLOB + " " + url);

    return res
      .status(201)
      .send({ message: "An email was sent to your account. Please verify your account before logging in." });

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;
    console.log(req.body)

    if (!email || !password || !passwordVerify)
      return res
        .status(400)
        .json({ message: "Please enter all required fields." });

    if (password.length < 6)
      return res.status(400).json({
        message: "Please enter a password of at least 6 characters.",
      });

    if (password !== passwordVerify)
      return res.status(400).json({
        message: "Please enter the same password twice.",
      });

    const existingUser = await User.findOne({ email: email });
    if (!existingUser)
      return res.status(400).json({
        message: "An account with this email doesn't exist.",
      });
    console.log(password)
    console.log(existingUser.password)

    const passwordIsTheSame = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (passwordIsTheSame)
      return res.status(400).json({
        message: "You entered the same password you currently use. What?",
      });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const updateData = {
      password: passwordHash,
      verified: false
    };

    await User.findByIdAndUpdate(existingUser.id, updateData, { new: true })
      .then(updatedUser => {
        if (updatedUser) {
          console.log("Uspio")
        } else {
          console.log("NEUspio")
          return res.status(404).json({ message: 'User not found' });
        }
      })

    const token = jwt.sign(
      {
        user: existingUser._id
      },
      process.env.JWT_SECRET
    );

    const emailToken = await new EmailVerifyToken({
      userId: existingUser._id,
      token: token,
    }).save();

    const url = `${process.env.BASE_URL}/verify?id=${existingUser.id}&token=${emailToken.token}`;
    console.log(url)
    await sendMail(existingUser.email, "Verify Email", process.env.BLOB + " " + url);

    return res
      .status(201)
      .send({ message: "An email was sent to your account. Verify your email and then you can log in with your new password." });

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/verify", async (req, res) => {
  try {
    console.log("Dosao u verify")
    console.log(req.body)
    const user = await User.findById(req.body.id);

    if (!user) return res.status(400).send({ message: process.env.INVALID });
    console.log("s1")

    const token = await EmailVerifyToken.findOne({
      userId: user._id,
      token: req.body.token,
    });
    console.log("s2")

    if (!token) return res.status(400).send({ message: process.env.INVALID });

    const updateData = {
      verified: true
    };

    await User.findByIdAndUpdate(user.id, updateData, { new: true })
      .then(updatedUser => {
        if (updatedUser) {
          console.log("Uspio")
        } else {
          console.log("NEUspio")
          return res.status(404).json({ message: 'User not found' });
        }
      })

    //.catch(error => {
    //  console.log(error)
    // return res.status(500).json({ message: 'Error updating user by ID' });
    //});

    await token.deleteOne({
      userId: user._id,
      token: req.body.token,
    });
    console.log("svencek2")

    const cookieToken = jwt.sign(
      {
        user: user._id
      },
      process.env.JWT_SECRET
    );

    return res.status(200)
      .cookie("token", cookieToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send({ message: "Email verified successfully" });

  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: "Internal Server Error" });
  }
});


// log in



router.post("/login", async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.params)
    const { email, password } = req.body;

    // validate

    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json({ errorMessage: "There is no account associated with that email. You might want to register first." });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    if (!existingUser.verified)
      return res.status(401).json({ errorMessage: "Please verify your email address first." });

    const token = jwt.sign(
      {
        user: existingUser._id
      },
      process.env.JWT_SECRET
    );

    res.status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .send();
});

router.get("/loggedIn", (req, res) => {
  try {
    console.log("token: " + req.cookies.token)
    const token = req.cookies.token;

    if (!token || token === undefined) return res.send(false);

    jwt.verify(token, process.env.JWT_SECRET);

    return res.send(true);
  } catch (err) {
    return res.send(false);
  }
});

module.exports = router;
