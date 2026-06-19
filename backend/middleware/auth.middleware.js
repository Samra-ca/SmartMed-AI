const { auth } = require('../config/firebase');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = await auth.verifyIdToken(token);

    // Get role from Firestore
    const { db } = require('../config/firebase');
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    const role = userDoc.exists ? userDoc.data().role : 'patient';

    req.user = {
      id:    decoded.uid,
      role:  role,
      email: decoded.email
    };
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};