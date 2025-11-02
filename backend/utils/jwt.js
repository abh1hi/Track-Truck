const jwt = require('jsonwebtoken');

exports.signToken = (user) => {
  return jwt.sign({
    id: user._id,
    email: user.email,
    role: user.role,
    companyId: user.companyId || null
  }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};
