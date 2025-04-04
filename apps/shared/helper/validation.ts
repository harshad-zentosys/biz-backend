export const validateMobile = (mobile: string) => {
  return /^[6-9]\d{9}$/.test(mobile);
};

export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
