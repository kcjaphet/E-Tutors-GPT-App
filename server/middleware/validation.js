const validator = require('validator');

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!validator.isEmail(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }
  
  if (email.length > 254) {
    return { isValid: false, message: 'Email is too long' };
  }
  
  return { isValid: true };
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long' };
  }
  
  // Check for at least one uppercase, one lowercase, one digit, and one special character
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
    };
  }
  
  return { isValid: true };
};

const validateText = (text, maxLength = 10000) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, message: 'Text is required' };
  }
  
  if (text.length > maxLength) {
    return { isValid: false, message: `Text must be less than ${maxLength} characters` };
  }
  
  // Basic XSS prevention - remove script tags and javascript: protocols
  const hasScriptTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(text);
  const hasJavascriptProtocol = /javascript:/gi.test(text);
  
  if (hasScriptTags || hasJavascriptProtocol) {
    return { isValid: false, message: 'Text contains potentially harmful content' };
  }
  
  return { isValid: true };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove null bytes and other dangerous characters
  return input
    .replace(/\0/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateText,
  sanitizeInput
};