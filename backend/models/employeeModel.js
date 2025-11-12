import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide employee name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Please provide department"],
      enum: ["IT", "HR", "Finance", "Operations", "Marketing", "Sales"],
    },
    role: {
      type: String,
      required: true,
    },
    fitmentScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    productivity: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    utilization: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    softskills: {
      communication: { type: Number, default: 0 },
      teamwork: { type: Number, default: 0 },
      leadership: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
    },
    fatigueLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
