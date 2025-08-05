require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (like HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "../")));

// Handle the contact form submission
app.post("/send", (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate input fields
    if (!name || !email || !subject || !message) {
        console.error("Validation error: All fields are required");
        return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Received form data:", { name, email, subject, message });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: "srimanraoch@gmail.com",
        subject: `Portfolio Contact Form - ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        replyTo: email, // Allows replying directly to the sender's email
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: `Failed to send message: ${error.message}` });
        }
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "Message sent successfully" });
    });
});

// Fallback route for 404
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});