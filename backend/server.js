const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const connectDB  = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth',         require('./routes/auth.routes'));
app.use('/api/doctors',      require('./routes/doctor.routes'));
app.use('/api/appointments', require('./routes/appointment.routes'));
app.use('/api/chat',         require('./routes/chat.routes'));

app.get('/', (req, res) => res.send('SmartDoctor Firebase API Running ✅'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));