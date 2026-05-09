exports.forgotPassword = async (req, res) => {

  try {

    console.log("BODY:", req.body);

    const email = req.body.email
      .trim()
      .toLowerCase();

    console.log("SEARCH EMAIL:", email);

    const user = await User.findOne({
      email: email
    });

    console.log("FOUND USER:", user);

    if (!user) {

      return res.status(404).json({
        message: "Email not found"
      });
    }

    // GENERATE OTP

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.resetOtp = otp;

    user.resetOtpExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    // SEND EMAIL

    await sendEmail(
      user.email,
      otp,
      "https://lost-found-api-q597.onrender.com/"
    );

    res.status(200).json({
      message: "Reset OTP sent"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};