import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendNotificationEmail = async (
  email: string,
  fullName: string, // You can still pass this in, in case you want to use it manually in `message`
  subject: string,
  message: string
): Promise<string> => {
  try {
    const mailOptions = {
      from: `"YourApp Support" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              color: #333;
            }
            h2 {
              color: #007bff;
            }
            .btn {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 15px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
            .btn:hover {
              background-color: #0056b3;
            }
            .footer {
              font-size: 0.85em;
              color: #999;
              margin-top: 30px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h2>${subject}</h2>
            ${message}
            <p style="margin-top: 20px;">Enjoy our services!</p>
            <div class="footer">
              &copy; ${new Date().getFullYear()} YourApp. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);

    if (result.accepted.length > 0) {
      return "Notification email sent successfully";
    } else if (result.rejected.length > 0) {
      return "Notification email not sent, please try again";
    } else {
      return "Email server error";
    }
  } catch (error) {
    console.error("Email sending error:", error);
    return "Email server error";
  }
};
