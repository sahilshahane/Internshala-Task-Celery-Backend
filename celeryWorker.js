const celery = require('celery-node')
const dotenv = require('dotenv')
const validator = require('validator').default

const celeryTasks = require('./lib/celery-tasks')

// load .env / Environment Variables
dotenv.config()

const celeryWorker = celery.createWorker(
  process.env.BROKER_URL,
  process.env.BACKEND_URL
)

const validatePhoneno = (phoneno) => {
  // REGEX + Named Capturing  | requires EcmaScript / JavaScript
  // ^(?<country_code>((\+\d{1,}\s+)|()))(?<phoneno>(\d{10}))$
  const phoneDetails = String(phoneno)
    .trim()
    .match(/^(?<countryCode>((\+\d{1,}\s+)|()))(?<number>(\d{10}))$/)

  if (!phoneDetails) return null
  return {
    countryCode: phoneDetails.groups['countryCode'],
    number: Number(phoneDetails.groups['number']),
  }
}

const validateEmail = (email) => {
  return validator.isEmail(email)
}

// REGISTER TASKS
celeryWorker.register(celeryTasks.VALIDATE_PHONE_NO, validatePhoneno)
celeryWorker.register(celeryTasks.VALIDATE_EMAIL, validateEmail)

// START WORKER
celeryWorker.start()

module.exports = { validatePhoneno, validateEmail }
