const nodemailer = require("nodemailer");

const sendEmail = async (email, otp, to,verifyUrl) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


    const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
      
      <div style="max-width:500px; margin:auto; background:white; border-radius:12px; padding:30px; text-align:center; box-shadow:0 5px 20px rgba(0,0,0,0.1);">

        <h2 style="color:#2c3e50; margin-bottom:10px;">
           Email Verification
        </h2>

        <p style="color:#555; font-size:15px;">
          Welcome to <b>Lost & Found App</b><br>
          Use the OTP below to verify your email
        </p>

        <div style="
          margin:25px 0;
          padding:15px;
          font-size:28px;
          letter-spacing:5px;
          font-weight:bold;
          color:#ffffff;
          background:linear-gradient(135deg,#61c7b8,#bdf2ea);
          border-radius:10px;
        ">
          ${otp}
        </div>

        <p style="color:#777; font-size:13px;">
          This OTP is valid for 10 minutes.<br>
          Do not share it with anyone.
        </p>

        <hr style="margin:25px 0; border:none; border-top:1px solid #eee;">

        <p style="font-size:12px; color:#aaa;">
          If you didn’t request this, you can safely ignore this email.
        </p>

      </div>
        <div style="font-family: Arial; text-align:center;">

        <p>OR</p>

    <h2>Verify Your Email with Link</h2>
    

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
      from: `"Lost & Found App" <your_email@gmail.com>`,
      to: email,
      subject: " Verify Your Email - OTP Inside",
      html: htmlTemplate
    });

    console.log(" Professional OTP email sent");

  } catch (error) {
    console.log(" Email error:", error);
  }
};

module.exports = sendEmail;
