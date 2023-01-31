// load .env / Environment Variables
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const {
  validateEmailTask,
  validatePhoneNoTask,
} = require('./lib/celery-helpers')
const { sendEmail } = require('./lib/email')
const { connectToDB, addUserDetail, getUserDetails } = require('./lib/database')
const { CUSTOM_ERROR } = require('./lib/errors')

const { validatePhoneno, validateEmail } = require('./celeryWorker') /// REMOVE AT THE END

connectToDB()

const app = express()

app.set('trust proxy', true)
app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/user-form', async (req, res) => {
  const { name, dob, email, phoneNo } = req.body
  try {
    if (!name || !dob || !email || !phoneNo)
      throw new INVALID_DATA(
        'Please provide valid name, date of birth, email, phoneNo'
      )

    // const phoneDetails = await validatePhoneNoTask.applyAsync([phoneNo]).get()
    // const isEmailValid = await validateEmailTask.applyAsync([email])
    const phoneDetails = validatePhoneno(phoneNo)
    const isEmailValid = validateEmail(email)

    if (!phoneDetails)
      throw new CUSTOM_ERROR('Provided Phone no. is invalid', 400)

    if (!isEmailValid) throw new CUSTOM_ERROR('Provided Email is invalid', 400)

    await addUserDetail({
      name,
      dob: Date.parse(dob),
      email,
      phoneno: phoneDetails,
    })

    const isEmailSent = await sendEmail(
      email,
      name,
      'Test Mail from Sahil Shahane',
      'Test Mail'
    )

    if (!isEmailSent) throw new EMAIL_ERROR()

    res.status(200).send(`User Form Submitted | Email sent to ${email}`)
  } catch (err) {
    if (err instanceof CUSTOM_ERROR) res.status(err.code).send(err.message)
    else res.status(500).send(`Something went wrong!`)
  }
})

app.get('/user-form', async (req, res) => {
  const { pageNo, per_page, sortBy } = req.query

  try {
    res.status(200).json(await getUserDetails(pageNo, per_page))
  } catch (err) {
    res.status(500).send('Something went wrong!')
  }
})

app.all('/', (req, res) => {
  res
    .status(200)
    .send(
      `Server is running! Do a POST request on <a href='/user-form'>/user-form</a> to see the action :)`
    )
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server has been started on port http://localhost:${PORT}`)
})
