import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["student", "admin"],  // You can modify these roles as per your requirements
      default: "student", // Default role is 'student'
    },
    profile: {
      bio: { type: String, default: "" },
      skills: { type: [String], default: [] },
      resume: { type: String },
      resumeOriginalName: { type: String },
    },
  },
  { timestamps: true }
);

// Export the User model
export const User = mongoose.model("User", userSchema);
