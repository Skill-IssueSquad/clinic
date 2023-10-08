require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

//mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }).then(() => {
 //   app.listen(8000, () => console.log('Server Started'))
//}).catch(err => console.log(err))
app.listen(8000, () => console.log('Server Started!'))

app.use(express.json())

//const subscribersRouter = require('./routes/subscribers')
//app.use('/subscribers', subscribersRouter)