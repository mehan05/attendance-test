import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
  department: String,
  year: Number,
}, { timestamps: true });

export default mongoose.model("User", userSchema);

const otpSchema = new mongoose.Schema({
  code: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  expiresAt: { type: Date, required: true },
}, { timestamps: true });


const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  period: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
  location: {
    latitude: Number,
    longitude: Number,
  },
}, { timestamps: true });

