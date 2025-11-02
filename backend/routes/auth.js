const router = require('express').Router();
const Joi = require('joi');
const User = require('../models/User');
const Company = require('../models/Company');
const { signToken } = require('../utils/jwt');

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  companyName: Joi.string().min(2).max(100).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

router.post('/owner/signup', async (req, res) => {
  try {
    const { name, email, password, companyName } = await signupSchema.validateAsync(req.body);

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const owner = new User({
      email,
      password,
      role: 'owner',
      profile: { name }
    });
    await owner.save();

    const company = new Company({ name: companyName, ownerId: owner._id });
    await company.save();

    const token = signToken(owner);
    res.status(201).json({ token, owner: owner.toJSON(), company });
  } catch (err) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = await loginSchema.validateAsync(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    await user.updateLastSeen();
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;