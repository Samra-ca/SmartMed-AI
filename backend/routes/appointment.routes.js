const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth.middleware');
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateStatus
} = require('../controllers/appointmentController');

router.post('/',          auth, bookAppointment);
router.get('/patient',    auth, getPatientAppointments);
router.get('/doctor',     auth, getDoctorAppointments);
router.patch('/:id',      auth, updateStatus);

module.exports = router;