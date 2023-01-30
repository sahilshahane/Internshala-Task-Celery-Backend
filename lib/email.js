const Mailjet = require('node-mailjet')

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
)

const sendEmail = (To, Name, Subject, Message) => {
  // const request = mailjet.post('send', { version: 'v3.1' }).request({
  //   Messages: [
  //     {
  //       From: {
  //         Email: process.env.EMAIL_SENDER_ID,
  //         Name: process.env.EMAIL_SENDER_NAME,
  //       },
  //       To: [
  //         {
  //           Email: To,
  //           Name,
  //         },
  //       ],
  //       Subject: Subject,
  //       TextPart: Message,
  //       HTMLPart: Message,
  //     },
  //   ],
  // })
  // return request

  return true
}

module.exports = {
  sendEmail,
}
