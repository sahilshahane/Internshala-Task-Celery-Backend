const celery = require('celery-node')
const celeryTasks = require('./celery-tasks')

const celeryClient = celery.createClient(
  process.env.BROKER_URL,
  process.env.BACKEND_URL
)

/** Celery Task : validates phone no
 * @param {String} phoneno
 * @returns {Boolean} Boolean
 */

const validatePhoneNoTask = celeryClient.createTask(
  celeryTasks.VALIDATE_PHONE_NO
)

/** Celery Task : validates email
 * @param {String} email
 * @returns {Boolean} Boolean
 */
const validateEmailTask = celeryClient.createTask(celeryTasks.VALIDATE_EMAIL)

module.exports = { validatePhoneNoTask, validateEmailTask }
