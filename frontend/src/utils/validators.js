// Validation des formulaires
export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  fileSize: (file, maxSizeMB = 10) => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
  },

  fileType: (file, allowedTypes = ['pdf', 'jpg', 'jpeg', 'png']) => {
    const extension = file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(extension);
  },

  code: (code) => {
    // Valider le format du code (ex: 6 caractères alphanumériques)
    return /^[A-Z0-9]{6}$/.test(code);
  },
};