const autoReply = (msg) => {
  const m = msg.toLowerCase();
  if (m.includes('appointment')) return 'Doctor is unavailable. Please book an appointment using the booking form.';
  if (m.includes('fee') || m.includes('cost')) return 'Please book an appointment and doctor will confirm charges.';
  if (m.includes('online')) return 'Yes, online consultations are available. Please book an appointment.';
  if (m.includes('timing') || m.includes('available')) return 'Doctor is busy. Your message has been saved.';
  return 'Thank you for reaching out. Doctor is unavailable right now. Your details have been saved.';
};

module.exports = { autoReply };