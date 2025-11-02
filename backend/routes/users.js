const router = require('express').Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Company = require('../models/Company');

const createEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.post('/employees', auth('owner'), async (req, res) => {
  try {
    const { name, email, password } = await createEmployeeSchema.validateAsync(req.body);

    const owner = await User.findById(req.user.id);
    const company = await Company.findOne({ ownerId: owner._id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const canAdd = await company.canAddEmployee();
    if (!canAdd) return res.status(403).json({ message: 'Employee limit reached for plan' });

    const employee = new User({
      email,
      password,
      role: 'employee',
      companyId: company._id,
      profile: { name }
    });
    await employee.save();

    res.status(201).json(employee);
  } catch (err) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    if (err.code === 11000) return res.status(409).json({ message: 'Email already exists' });
    res.status(500).json({ message: err.message });
  }
});

router.get('/employees', auth('owner'), async (req, res) => {
  try {
    const owner = await User.findById(req.user.id);
    const company = await Company.findOne({ ownerId: owner._id });
    const employees = await User.find({ companyId: company._id, role: 'employee' }).select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;