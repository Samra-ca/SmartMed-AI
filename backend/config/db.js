const { db } = require('./firebase');

const connectDB = async () => {
  try {
    // Test Firestore connection
    await db.collection('_ping').doc('test').set({ ping: true });
    console.log('Firebase Firestore connected');
  } catch (err) {
    console.error('Firebase connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;