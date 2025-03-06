import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../modals/User.js";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "vinit";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER || "vinitkukadiya.work1@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "ejyi pniz momh wwju",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || "vinitkukadiya1@gmail.com",
      to: email,
      subject: "Email Verification",
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Register a new user
export const registerUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

   
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: role || "user",
      emailVerificationOTP: otp,
      otpExpiresAt,
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, otp);

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      emailVerificationSent: emailSent,
      token,
      user: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: false,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (user.isDeleted)
      return res.status(403).json({ message: "Account is deactivated" });

    if (!user.isEmailVerified)
      return res.status(403).json({
        message:
          "Email is not verified. Please verify your email before logging in.",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "365d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Verify email with OTP
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    if (!user.emailVerificationOTP || !user.otpExpiresAt) {
      return res.status(400).json({ message: "No verification OTP found" });
    }

    const now = new Date();
    if (now > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isEmailVerified: true,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Resend verification OTP
export const resendVerificationOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

  
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    user.emailVerificationOTP = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

   
    const emailSent = await sendVerificationEmail(email, otp);

    if (emailSent) {
      return res
        .status(200)
        .json({ message: "Verification OTP sent successfully" });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
