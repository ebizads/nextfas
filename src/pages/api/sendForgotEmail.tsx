import { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"
import { setForgotEmailData } from "../../lib/emailFunctions"

export default async function sendForgotEmail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get the local dev port + host dynamically from frontend request
  const baseUrl =
    req.headers.origin || process.env.EMAIL_BASE_URL || "http://localhost:3000"

  const { name, code, date, sendTo, cc } = req.body

  try {
    // 1. Create a test SMTP account (Ethereal)
    const testAccount = await nodemailer.createTestAccount()

    // 2. Create a transporter using Ethereal SMTP
    const transporter = nodemailer.createTransport({
      // host: "smtp.ethereal.email",
      // port: 587,
      // secure: false, // true for 465, false for other ports
      // auth: {
      //   user: testAccount.user,
      //   pass: testAccount.pass,
      // },
      port: 465,
      service: "gmail",
      auth: {
        user: process.env.SMTP_SENDER_EMAIL,
        pass: process.env.SMTP_SENDER_PASSWORD,
      },
    })

    // 3. Define the email content
    // const mailOptions = {
    //   from: '"FAS Server" <no-reply@fas.com>', // sender address
    //   to: sendTo,
    //   cc: cc,
    //   subject: "Reset your password",
    //   text: `Hello ${name},\n\nHere is your reset code: ${code}\nRequested on: ${date}\n\nIf you didn't request this, please ignore.`,
    //   html: `<p>Hello <b>${name}</b>,</p>
    //         <p>Here is your reset code: <b>${code}</b></p>
    //         <p>Requested on: ${date}</p>
    //         <p>If you didn't request this, please ignore.</p>`,
    // }

    const otherMailOptions = setForgotEmailData(name, date, code, baseUrl)

    const mailOptions = {
      from: process.env.SMTP_SENDER_EMAIL,
      to: sendTo,
      cc: cc,
      ...otherMailOptions,
    }

    // 4. Send the email
    const info = await transporter.sendMail(mailOptions)

    // 5. Get the preview URL to see the email in browser
    const previewUrl = nodemailer.getTestMessageUrl(info)
    console.log("Preview URL:", previewUrl)

    res.status(200).json({
      success: true,
      message: "Email sent (dev mode) — see preview URL.",
      previewUrl,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}
