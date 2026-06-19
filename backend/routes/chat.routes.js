const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth.middleware');
const { sendMessage, getDoctorMessages } = require('../controllers/chatController');

router.post('/',          sendMessage);
router.get('/messages',   auth, getDoctorMessages);

module.exports = router;