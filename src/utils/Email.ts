import dotenv from 'dotenv';
import ejs from 'ejs';
import { createTransport } from 'nodemailer';
import config from '../config';
import path from 'path'

dotenv.config();

let { email, email_pwd, smtp_port, smtp_secure} = config;
const secure = smtp_secure === 'false' ? false : true;
const PORT = parseInt(smtp_port as string);

/**
 * checking the type and converting from string value to a boolean value
 * this is to prevent error while sending email
 * console.log(typeof secure, secure)  //to test the result
 * console.log(typeof secure)
 * my solution to the error while sending email for local and live
 * */

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function mailService(object: any) {
  const data = await ejs.renderFile(path.dirname + `../view/${object.view}`, {
    name: object.name,
    url: object.link,
    token: object.token,
  });

  const mailOptions = {
    from: `"Easyloan" <${process.env.EMAIL_USER}>`, // sender address
    to: object.email, // recipient address// list of receivers
    subject: 'Easy Loan - ' + object.subject,
    html: data, //`${object.body}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
}
