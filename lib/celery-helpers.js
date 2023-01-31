const celery = require('celery-node')
const celeryTasks = require('./celery-tasks')

const getCeleryClient = () => {
  if (!global.celeryClient)
    global.celeryClient = celery.createClient(
      process.env.BROKER_URL,
      process.env.BACKEND_URL
    )

  return global.celeryClient
}

/** Celery Task : validates phone no
 * @param {String} phoneno
 * @returns {Boolean} Boolean
 */

const validatePhoneNoTask = getCeleryClient().createTask(
  celeryTasks.VALIDATE_PHONE_NO
)

/** Celery Task : validates email
 * @param {String} email
 * @returns {Boolean} Boolean
 */
const validateEmailTask = getCeleryClient().createTask(
  celeryTasks.VALIDATE_EMAIL
)

module.exports = { getCeleryClient, validatePhoneNoTask, validateEmailTask }
