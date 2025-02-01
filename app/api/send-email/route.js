import nodemailer from 'nodemailer';
import axios from 'axios';

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, captchaToken } = body;

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

    const verificationResponse = await axios.post(verificationUrl);
    const { success } = verificationResponse.data;

    if (!success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'reCAPTCHA validation failed.',
        }),
        { status: 400 }
      );
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Feedback" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Feedback via dbdkillerperkshuffle`,
      text: message,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error sending email' }),
      { status: 500 }
    );
  }
}

export function GET() {
  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
  });
}
