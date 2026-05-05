const nodemailer = require("nodemailer");

const sendEmail = async (email, otp, verifyUrl) => {
  try {

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",   // ✅ BREVO SMTP
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
    });

    const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
      
      <div style="max-width:500px; margin:auto; background:white; border-radius:12px; padding:30px; text-align:center; box-shadow:0 5px 20px rgba(0,0,0,0.1);">

        <h2 style="color:#2c3e50;">Email Verification</h2>

        <p style="color:#555;">
          Welcome to <b>Lost & Found App</b><br>
          Use the OTP below:
        </p>

        <div style="
          margin:25px 0;
          padding:15px;
          font-size:28px;
          letter-spacing:5px;
          font-weight:bold;
          color:#fff;
          background:linear-gradient(135deg,#61c7b8,#bdf2ea);
          border-radius:10px;">
          ${otp}
        </div>

        <p style="color:#777; font-size:13px;">
          Valid for 10 minutes
        </p>

        <hr>

        <p>OR</p>

        <a href="${verifyUrl}" 
           style="
             display:inline-block;
             padding:12px 20px;
             background:#009688;
             color:white;
             text-decoration:none;
             border-radius:6px;
             font-weight:bold;">
             Verify Email
        </a>

        <p style="margin-top:20px; color:gray;">
          Link expires in 10 minutes
        </p>

      </div>
    </div>
    `;

    await transporter.sendMail({
      from: `"Lost & Found App" <${process.env.EMAIL_USER}>`, // ✅ FIXED
      to: email,
      subject: "Verify Your Email - OTP Inside",
      html: htmlTemplate,
    });

    console.log("✅ Email sent successfully");

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error.message);
  }
};

module.exports = sendEmail;
