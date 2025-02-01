const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "Dev@tinder";

// Signup Route
authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body;

        // Hash password asynchronously
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        const savedUser = await user.save();
        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET, { expiresIn: "7d" });

        // Set token in a cookie
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        res.status(201).send({ message: "User added successfully", data: savedUser });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(400).send({ error: "Signup failed", details: err.message });
    }
});

// Login Route
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ error: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        // Securely attach token to a cookie
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        res.status(200).send({ message: "Login successful", user });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).send({ error: "Login failed", details: err.message });
    }
});

// Logout Route
authRouter.post("/logout", (req, res) => {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    res.send({ message: "User logged out successfully" });
});

module.exports = authRouter;
