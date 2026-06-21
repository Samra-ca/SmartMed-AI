const { db } = require('../config/firebase');

exports.createProfile = async (req, res) => {
  try {
    const { name, specialization, city, consultationType, experience, bio, phone } = req.body;

    let profilePicData = null;
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      profilePicData = `data:${req.file.mimetype};base64,${base64}`;
    }

    const docRef = db.collection('doctors').doc(req.user.id);
    const existing = await docRef.get();

    const data = {
      userId: req.user.id,
      name, specialization, city,
      consultationType: consultationType || 'Both',
      experience: Number(experience) || 0,
      bio: bio || '',
      phone: phone || '',
      isAvailable: existing.exists ? existing.data().isAvailable : true,
      rating: existing.exists ? existing.data().rating || 0 : 0,
      updatedAt: new Date().toISOString()
    };

    if (profilePicData) {
      data.profilePic = profilePicData;
    }

    if (existing.exists) {
      await docRef.update(data);
    } else {
      await docRef.set({ ...data, createdAt: new Date().toISOString() });
    }

    const updated = await docRef.get();
    res.status(201).json({ _id: updated.id, ...updated.data() });

  } catch (err) {
    console.error('Create profile error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.searchDoctors = async (req, res) => {
  try {
    const { q, city } = req.query;

    const symptomMap = {
      'back pain':  'Orthopedic',    'skin rash':  'Dermatologist',
      'skin':       'Dermatologist', 'heart':      'Cardiologist',
      'chest pain': 'Cardiologist',  'eye':        'Ophthalmologist',
      'teeth':      'Dentist',       'tooth':      'Dentist',
      'child':      'Pediatrician',  'fever':      'General Physician',
      'diabetes':   'Endocrinologist','mental':    'Psychiatrist',
      'anxiety':    'Psychiatrist',  'depression': 'Psychiatrist',
      'bone':       'Orthopedic',    'stomach':    'Gastroenterologist',
      'kidney':     'Nephrologist',  'ear':        'ENT Specialist',
      'nose':       'ENT Specialist','throat':     'ENT Specialist',
    };

    let specialization = q || '';
    if (q) {
      const lower = q.toLowerCase();
      for (const [kw, spec] of Object.entries(symptomMap)) {
        if (lower.includes(kw)) { specialization = spec; break; }
      }
    }

    let snapshot = await db.collection('doctors').get();
    let doctors = snapshot.docs.map(d => ({ _id: d.id, ...d.data() }));

    if (specialization) {
      doctors = doctors.filter(d =>
        d.specialization?.toLowerCase().includes(specialization.toLowerCase())
      );
    }
    if (city) {
      doctors = doctors.filter(d =>
        d.city?.toLowerCase().includes(city.toLowerCase())
      );
    }

    doctors.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doc = await db.collection('doctors').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ _id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const doc = await db.collection('doctors').doc(req.user.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Profile not found' });
    res.json({ _id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const docRef = db.collection('doctors').doc(req.user.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Profile not found' });

    const newStatus = !doc.data().isAvailable;
    await docRef.update({ isAvailable: newStatus });
    res.json({ isAvailable: newStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};