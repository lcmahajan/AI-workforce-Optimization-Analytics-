import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  salary: Number,
  experience: Number,
  softskills: String,
  performance: String,
  location: String,
});

export default mongoose.model("Employee", employeeSchema);
