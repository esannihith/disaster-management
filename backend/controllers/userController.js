const sanitize = require("sanitize-html");
const bcrypt = require("bcrypt"); // Ensure bcrypt is imported
const jwt = require("jsonwebtoken"); // Ensure jwt is imported
const User = require("../models/User");
exports.registerUser = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    fullName,
    city,
    area,
    profession,
    mobileNumber,
    availabilityDropdown,
  } = req.body;

  try {
    // Validate role
    const validRoles = ["none", "volunteer", "coordinator", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // Basic validation for required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Sanitize input
    const sanitizedEmail = sanitize(email.trim());
    const sanitizedUsername = sanitize(username.trim());

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword,
      role,
    };

    if (role !== "none") {
      if (!fullName || !city || !area || !profession || !mobileNumber || !availabilityDropdown) {
        return res.status(400).json({ message: "All additional fields must be filled for selected role" });
      }
      userData.additionalDetails = { fullName, city, area, profession, mobileNumber, availabilityDropdown };
    }

    // Save user
    const newUser = await User.create(userData);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        additionalDetails: newUser.additionalDetails,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};


// src/controllers/authController.js

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sanitize input
    const sanitizedEmail = sanitize(email.trim());

    // Check if user exists
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      // Use 401 Unauthorized instead of 404 Not Found
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Keep response consistent
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send successful response with token and user details
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};
