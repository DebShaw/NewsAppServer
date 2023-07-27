import bcrypt from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(404).json({ message: "User Already Exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json("Something went wrong...");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await User.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User Doesn't Exists." });
    }
    const isPasswordCrrct = await bcrypt.compare(
      password,
      existinguser.password
    );
    if (!isPasswordCrrct) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existinguser, token });
  } catch (error) {
    res.status(500).json("Something went wrong...");
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const token = randomstring.generate();
    const existinguser = await User.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User Does not exist" });
    }
    existinguser.token = token;
    await existinguser.save();
    sendEmail(existinguser.email, existinguser.name, token);
    res.status(200).json({ message: "Recovery email has been sent" });
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const existinguser = await User.findOne({ token });
    if (!existinguser) {
      return res.status(404).json({ message: "Token has been expired" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    existinguser.password = hashedPassword;
    existinguser.token = "";
    await existinguser.save();
    res.status(200).json({ message: "Password Reset Successful!" });
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

const sendEmail = async (email, name, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: "gmail",
      requireTLS: true,
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASS,
      },
    });
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Reset Newsstudio password",
      html:
        "<p>Hii " +
        name +
        ', To reset the NewsStudio password please <a href="https://news-app-by-ds.netlify.app/auth/reset-password?token=' +
        token +
        '"> click here</a>',
    });
    console.log("Email sent sucessfully");
  } catch (error) {
    console.log(error, "Email not sent");
  }
};
