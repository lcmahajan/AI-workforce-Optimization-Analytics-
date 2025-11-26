import Employee from "../models/Employee.js";

export const addEmployee = async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.json({ success: true, data: emp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const data = await Employee.find();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
