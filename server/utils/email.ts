import nodemailer from "nodemailer";
import config from "../config/config";

const sendEmail = async (options) => {
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
    from: "Alvin Abiero <alvinabiero966@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // send the email
  await transporter.sendMail(mailOptions);
};

export { sendEmail };
