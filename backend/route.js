import express from "express";
import OTP from "../models/OTP.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Generate OTP (Teacher)
router.post("/generate", async (req, res) => {
  try {
    const { teacherId, latitude, longitude, accuracy } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    const otp = await OTP.create({ code, teacherId, latitude, longitude, accuracy, expiresAt });
    res.json({ otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate OTP (Student)
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;
    const otp = await OTP.findOne({ code });

    if (!otp) return res.status(404).json({ error: "Invalid OTP" });
    if (otp.expiresAt < new Date()) return res.status(400).json({ error: "OTP expired" });

    res.json({ message: "OTP valid", otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark attendance
router.post("/mark", async (req, res) => {
    try {
      const { studentId, teacherId, period, status, latitude, longitude } = req.body;
      const date = new Date().toDateString();
  
      const attendance = await Attendance.findOneAndUpdate(
        { studentId, teacherId, date, period },
        { status, location: { latitude, longitude } },
        { new: true, upsert: true }
      );
  
      res.json({ message: "Attendance marked", attendance });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Get student attendance
  router.get("/student/:id", async (req, res) => {
    try {
      const records = await Attendance.find({ studentId: req.params.id });
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
export default router;
