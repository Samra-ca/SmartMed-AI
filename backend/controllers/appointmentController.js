const { db } = require('../config/firebase');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, date, time, type, problem } = req.body;

    const ref = await db.collection('appointments').add({
      patientId:   req.user.id,
      patientName: patientName || '',
      doctorId,
      date, time,
      type:    type || 'Online',
      problem: problem || '',
      status:  'pending',
      createdAt: new Date().toISOString()
    });

    const created = await ref.get();
    res.status(201).json({ _id: ref.id, ...created.data() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const snapshot = await db.collection('appointments')
      .where('patientId', '==', req.user.id)
      .get();

    const appointments = await Promise.all(
      snapshot.docs.map(async d => {
        const data = { _id: d.id, ...d.data() };
        // Populate doctor info
        try {
          const docSnap = await db.collection('doctors').doc(data.doctorId).get();
          if (docSnap.exists) {
            data.doctorId = { _id: docSnap.id, ...docSnap.data() };
          }
        } catch {}
        return data;
      })
    );

    appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const snapshot = await db.collection('appointments')
      .where('doctorId', '==', req.user.id)
      .get();

    const appointments = snapshot.docs
      .map(d => ({ _id: d.id, ...d.data() }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const ref = db.collection('appointments').doc(req.params.id);
    await ref.update({ status: req.body.status });
    const updated = await ref.get();
    res.json({ _id: updated.id, ...updated.data() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};