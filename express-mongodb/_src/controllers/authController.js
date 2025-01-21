const bcrypt = require("bcrypt");

const User = require("../models/user");
const { generateToken } = require("../utils/jwtUtils");
const logger = require("../utils/logger");
const cookieParser = require("cookie-parser");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      logger.warn("Validation failed: Missing required fields");
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Periksa apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(
        `Attempt to register with an already registered email: ${email}`
      );
      return res.status(400).json({
        message: "Email already registered. Please use another email.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Buat user baru
    const newUser = new User({
      name,
      email,
      password_hash,
    });

    await newUser.save();

    logger.info(`New user registered successfully: ${email}`);
    res.status(201).json({
      message: "User registered successfully!",
    });
  } catch (error) {
    // Tangkap error MongoDB untuk duplikasi email
    if (error.code === 11000) {
      logger.error(
        `Duplicate entry error: Email ${req.body.email} is already registered`
      );
      return res.status(400).json({
        message: "Duplicate entry detected. Email is already registered.",
      });
    }

    // Tangkap error lain
    logger.error(`Unexpected error during registration: ${error.message}`, {
      stack: error.stack,
    });

    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      logger.warn("Validation failed: Missing email or password");
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: Email not registered - ${email}`);
      return res.status(400).json({
        message: "Email not registered!",
      });
    }

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      logger.warn(`Login failed: Wrong password for email - ${email}`);
      return res.status(400).json({
        message: "Wrong Password!",
      });
    }

    // Generate token
    const token = generateToken(user);

    // Set token di cookie
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // Gunakan secure hanya di production
      sameSite: 'None',
      // sameSite: 'strict', // Meningkatkan keamanan CSRF
      maxAge: 24 * 60 * 60 * 1000, // Token berlaku selama 1 hari
    });

    logger.info(`User logged in successfully: ${email}`);
    res.status(200).json({
      message: "Login successful",
      // token: token, // Kembalikan token jika dibutuhkan oleh client
    });
  } catch (error) {
    logger.error(`Unexpected error during login: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};
