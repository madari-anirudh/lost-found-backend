const axios = require("axios");

const sendEmail = async (email, otp, verifyUrl) => {
  try {

    const htmlContent = `
      <h2>Email Verification</h2>
      <p>Your OTP is: <b>${otp}</b></p>
      <p>OR</p>
      <a href="${verifyUrl}">Verify Email</a>
    `;

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Lost & Found App",
          email: process.env.EMAIL_USER,
        },
        to: [{ email }],
        subject: "Verify your email",
        htmlContent: htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent via API");

  } catch (error) {
    console.log("❌ EMAIL API ERROR:", error.response?.data || error.message);
  }
};

module.exports = sendEmail;
