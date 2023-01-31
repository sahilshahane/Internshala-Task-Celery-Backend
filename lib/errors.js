class CUSTOM_ERROR extends Error {
  constructor(message = 'Something went Wrong', code = 500) {
    super(message)
    this.code = code
    this.message = message
    Object.setPrototypeOf(this, CUSTOM_ERROR.prototype)
  }
}

module.exports = { CUSTOM_ERROR }
