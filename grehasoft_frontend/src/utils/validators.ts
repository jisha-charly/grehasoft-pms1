/**
 * Grehasoft Form Validators
 * Standardizes validation logic across CRM and PMS forms.
 */

export const validators = {
  // Email validation (RFC 5322)
  isValidEmail: (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  },

  // Password Strength (Enterprise Standard)
  isStrongPassword: (password: string): boolean => {
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  },

  // Phone Validation
  isValidPhone: (phone: string): boolean => {
    const re = /^\+?[\d\s-]{10,15}$/;
    return re.test(phone);
  },

  // PMS Business Logic: End date must be after Start date
  isValidDateRange: (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) <= new Date(endDate);
  },

  // Requirement for Project Names
  isValidProjectName: (name: string): boolean => {
    return name.trim().length >= 3;
  },

  // File type validation for PMS uploads
  isAllowedFileType: (fileType: string): boolean => {
    const allowed = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed'
    ];
    return allowed.includes(fileType);
  }
};