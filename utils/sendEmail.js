const axios = require("axios");

const sendEmail = async (email, otp, verifyUrl) => {
  try {

    const htmlTemplate = `
<div style="margin:0; padding:0; background:#f2f5f9; font-family:'Segoe UI', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="450" cellpadding="0" cellspacing="0" 
               style="background:#ffffff; border-radius:16px; padding:30px; box-shadow:0 15px 40px rgba(0,0,0,0.08);">

          <!-- LOGO -->
          <tr>
            <td align="center">
              <img src="https://res.cloudinary.com/dgxlhvkio/image/upload/v1778027959/logo_lost_and_found_pdoxeh.jpg" width="70" style="margin-bottom:10px;" />
              <h2 style="margin:0; color:#1f2d3d;">Lost & Found</h2>
              <p style="margin:5px 0 0; color:#8898aa; font-size:14px;">
                Secure Email Verification
              </p>
            </td>
          </tr>

          <tr><td><hr style="border:none; border-top:1px solid #eee; margin:20px 0;"></td></tr>

          <tr>
            <td align="center">
              <p style="color:#444; font-size:15px;">
                Enter the verification code below to continue
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:25px 0;">
              <div style="
                display:inline-block;
                padding:18px 30px;
                font-size:32px;
                letter-spacing:10px;
                font-weight:bold;
                color:#ffffff;
                background:linear-gradient(135deg,#00c6ff,#0072ff);
                border-radius:12px;
              ">
                ${otp}
              </div>
            </td>
          </tr>

          <tr>
            <td align="center">
              <p style="color:#999; font-size:13px;">
                This code expires in <b>10 minutes</b>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:25px 0;">
              <a href="${verifyUrl}" 
                 style="
                   display:inline-block;
                   padding:14px 28px;
                   background:#009688;
                   color:#ffffff;
                   text-decoration:none;
                   border-radius:8px;
                   font-weight:600;
                 ">
                 Verify Email Instantly
              </a>
            </td>
          </tr>

          <tr>
            <td align="center">
              <p style="font-size:12px; color:#aaa;">
                Or enter the code manually in the app
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:20px;">
              <p style="font-size:11px; color:#bbb;">
                If you didn’t request this, ignore this email.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</div>
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
        htmlContent: htmlTemplate,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent");

  } catch (error) {
    console.log("❌ Email error:", error.response?.data || error.message);
  }
};

module.exports = sendEmail;