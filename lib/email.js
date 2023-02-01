const nodemailer = require('nodemailer')

const sendEmail = async (To, Name, Subject, Message) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_SENDER_ID, // sender address
      to: To, // list of receivers
      subject: Subject, // Subject line
      text: Message, // plain text body
      html: Message,
    })
  } catch (error) {
    console.error(error)
    return false
  }

  return true
}

module.exports = {
  sendEmail,
}
