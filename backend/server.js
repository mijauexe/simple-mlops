require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const cookieParser = require("cookie-parser")

mongoose.connect('mongodb://localhost:27017/simple-mlops')

app.use(cors({
  origin: [process.env.BASE_URL],
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/auth", require("./routers/user.router"))
app.use("/image", require("./routers/image.router"))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = process.env.PORT

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})