import nodemailer from "nodemailer"

export async function sendVerificationEmail(
  email: string,
  verificationCode: number,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_SMTP_USER,
      pass: process.env.ZOHO_SMTP_PASS,
    },
  });


  await transporter.sendMail({
    from: `"No Reply" <${process.env.ZOHO_SMTP_USER}>`,
    to: email,
    subject: "Verify your account",
    text: `Your verification code is ${verificationCode}`,
    html: `
      <p>Your verification code is:</p>
      <h2>${verificationCode}</h2>
      <p>This code expires in an hour.</p>
    `,
  });
}
