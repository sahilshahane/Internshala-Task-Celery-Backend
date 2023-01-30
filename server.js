// load .env / Environment Variables
require('dotenv').config()

const express = require('express')
const celery = require('celery-node')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const celeryTasks = require('./lib/celery-tasks')
const { sendEmail } = require('./lib/email')

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const celeryClient = celery.createClient(
  process.env.BROKER_URL,
  process.env.BACKEND_URL
)

/** Celery Task : validates phone no
 * @param phoneno - String
 * @returns Boolean
 */

const validatePhoneNoTask = celeryClient.createTask(
  celeryTasks.VALIDATE_PHONE_NO
)

/** Celery Task : validates email
 * @param email - String
 * @returns Boolean
 */
const validateEmailTask = celeryClient.createTask(celeryTasks.VALIDATE_EMAIL)

// name, date of birth, email, phone number

class INVALID_DATA extends Error {}

class EMAIL_ERROR extends Error {
  message = 'Server Error : Failed to send email'
}

app.post('/user-form', async (req, res) => {
  const { name, dob, email, phoneNo } = req.body
  try {
    if (!name || !dob || !email || !phoneNo)
      throw new INVALID_DATA(
        'Please provide valid name, date of birth, email, phoneNo'
      )

    const isPhoneValid = await validatePhoneNoTask.applyAsync([phoneNo]).get()
    const isEmailValid = await validateEmailTask.applyAsync([email])

    if (!isPhoneValid) throw new INVALID_DATA('Invalid : Phone no.')
    if (!isEmailValid) throw new INVALID_DATA('Invalid : Email')

    const isEmailSent = await sendEmail(
      email,
      name,
      'Test Mail from Sahil Shahane',
      'Test Mail'
    )?.Messages[0]

    if (!isEmailSent) throw new EMAIL_ERROR()

    throw new res.status(200).send(
      `User Form Submitted | Email sent to ${email}`
    )
  } catch (error) {
    res.status(500).send(`Something went wrong! ${error}`)
  }
})

const SERVER_PORT = process.env.SERVER_PORT || 3001

app.listen(SERVER_PORT, () => {
  console.log(`Server has been started on port http://localhost:${SERVER_PORT}`)
})
