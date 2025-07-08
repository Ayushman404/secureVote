const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretadminjwtkey';

function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token received:', token);
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Admin detials: ', decoded)
    if (decoded.role !== 'admin') {
      console.log('Role check failed:', decoded.role); // 🟡 add this
      throw new Error('Not admin');
    
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Unauthorized' });
  }
}

module.exports = { verifyAdmin };
