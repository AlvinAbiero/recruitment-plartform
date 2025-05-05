import nodemailer from "nodemailer";
import config from "../config/config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async (options: EmailOptions) => {
  // transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD,
    },
  });

  // define email options
  const mailOptions = {
    from: `Ajiri <${config.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  // send the email
  await transporter.sendMail(mailOptions);
};

export { sendEmail };
