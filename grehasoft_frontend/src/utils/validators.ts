// ===============================
// FORM VALIDATION HELPERS
// ===============================

export const isEmailValid = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isPasswordStrong = (password: string): boolean => {
  // Minimum 8 chars, 1 uppercase, 1 number
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const isMinLength = (value: string, length: number): boolean => {
  return value.trim().length >= length;
};

export const isPhoneValid = (phone: string): boolean => {
  const regex = /^[6-9]\d{9}$/; // Indian format
  return regex.test(phone);
};
