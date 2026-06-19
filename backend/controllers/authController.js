const { auth, db } = require('../config/firebase');

const firebaseFetch = async (url, body) => {
  const https = require('https');
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'identitytoolkit.googleapis.com',
      path: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    await auth.setCustomUserClaims(userRecord.uid, { role });

    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    });

    const signInData = await firebaseFetch(
      `/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    if (signInData.error) {
      return res.status(400).json({ message: signInData.error.message });
    }

    res.status(201).json({
      token: signInData.idToken,
      user: { id: userRecord.uid, name, email, role }
    });

  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 'auth/email-already-exists') {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const signInData = await firebaseFetch(
      `/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    if (signInData.error) {
      return res.status(400).json({ message: 'Wrong email or password' });
    }

    const userRecord = await auth.getUserByEmail(email);
    const userDoc    = await db.collection('users').doc(userRecord.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    const userData = userDoc.data();

    res.json({
      token: signInData.idToken,
      user: {
        id:    userRecord.uid,
        name:  userData.name,
        email: userData.email,
        role:  userData.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};