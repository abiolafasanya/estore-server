import dotenv from 'dotenv';
import ejs from 'ejs';
import { createTransport } from 'nodemailer';
import config from '../config';
import path from 'path';

interface MailService {
  name?: string;
  email: string;
  view: string;
  subject: string;
  code?: string;
  link?: any;
  sender?: string;
}

dotenv.config();

let { email, email_pwd, smtp_port, smtp_secure } = config;
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
export async function mailService(object: MailService) {
  const templatesPath = path.join(__dirname, `../views/${object.view}`)
  const data = await ejs.renderFile(templatesPath, {
    name: object.name,
    otp: object.code ? object.code.split('') : null,
    link: object.link,
    sender: object.sender ? object.sender : ""
  });

  const mailOptions = {
    from: `"Porchplus" <${process.env.EMAIL_USER}>`, // sender address
    to: object.email, // recipient address// list of receivers
    subject: object.subject,
    html: data, //`${object.body}`,
  };

  transporter.sendMail(mailOptions, async (err, info) => {
    if (!err) {
      console.log('Message sent: ' + info.response);
    } else {
      console.log(err);
    }
  });
}
