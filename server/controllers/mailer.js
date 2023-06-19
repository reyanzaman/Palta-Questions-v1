import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import dotenv from 'dotenv';

dotenv.config();

// https://ethereal.email/create
let nodeConfig = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "IUB QBAN Team",
        link: 'https://mailgen.js'
    }
})

/** POST http://localhost:8080/api/registerMail
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "text": "",
  "subject": "",
}
*/
export const registerMail = async(req, res) => {
    const { username, userEmail, text, subject } = req.body;
    console.log(userEmail);

    // body of the email
    var email = {
        body: {
            name: username,
            intro: text || "Welcome to Query Based Access to Neurons! We\'re very excited to have you on board!",
            outro: "We hope you are enjoying learning through Palta Questions!"
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from : process.env.EMAIL,
        to: userEmail,
        subject: subject || "Signed Up Successfully",
        html: emailBody
    }

    // send mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "You should recieve an email from us soon."})
        })
        .catch(error => res.status(500).send({ error: "Your IUB ID is invalid" }))
}