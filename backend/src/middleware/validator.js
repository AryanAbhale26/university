// Request validation middleware
export const validateStudentPayload = (req, res, next) => {
  const { roll_number, first_name, last_name, email, department_id, class_id } = req.body;
  if (!roll_number || !first_name || !last_name || !email) {
    return res.status(400).json({ success: false, message: 'All student basic fields are required.' });
  }
  if (!department_id || !class_id) {
    return res.status(400).json({ success: false, message: 'Department and Class allotment required.' });
  }
  next();
};

export const validateEmailFormat = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
