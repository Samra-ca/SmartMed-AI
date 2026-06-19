const express  = require('express');
const router   = express.Router();
const auth     = require('../middleware/auth.middleware');
const upload   = require('../middleware/upload.middleware');
const {
  createProfile,
  searchDoctors,
  getDoctorById,
  getMyProfile,
  toggleAvailability
} = require('../controllers/doctorController');

router.get('/search',         searchDoctors);
router.get('/me',             auth, getMyProfile);
router.get('/:id',            getDoctorById);
router.post('/profile',       auth, upload.single('profilePic'), createProfile);
router.patch('/availability', auth, toggleAvailability);

module.exports = router;