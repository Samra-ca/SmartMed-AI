const { db }                        = require('../config/firebase');
const { autoReply }                 = require('../services/chatbotService');
const { sendDoctorNotification }    = require('../services/emailService');

exports.sendMessage = async (req, res) => {
  try {
    const { doctorId, senderName, senderEmail, senderPhone, problem } = req.body;

    const docSnap = await db.collection('doctors').doc(doctorId).get();
    if (!docSnap.exists) return res.status(404).json({ message: 'Doctor not found' });

    const doctor     = docSnap.data();
    const isAIReply  = !doctor.isAvailable;
    const reply      = isAIReply ? autoReply(problem) : '';

    await db.collection('messages').add({
      doctorId,
      senderName,
      senderEmail,
      senderPhone: senderPhone || '',
      problem,
      reply,
      isAIReply,
      createdAt: new Date().toISOString()
    });

    // Get doctor email from users collection
    const userSnap = await db.collection('users').doc(doctorId).get();
    if (userSnap.exists) {
      await sendDoctorNotification(userSnap.data().email, {
        senderName, senderEmail, senderPhone, problem
      });
    }

    res.status(201).json({
      message:  'Message sent',
      aiReply:  isAIReply ? reply : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDoctorMessages = async (req, res) => {
  try {
    const snapshot = await db.collection('messages')
      .where('doctorId', '==', req.user.id)
      .get();

    const messages = snapshot.docs
      .map(d => ({ _id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};