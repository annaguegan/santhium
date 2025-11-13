// Constantes de l'application
export const FILE_TYPES = {
  ORDONNANCE: 'ordonnance',
  CERTIFICAT: 'certificat',
  JUSTIFICATIF: 'justificatif',
  AUTRE: 'autre',
};

export const MAX_FILE_SIZE_MB = 10;

export const ALLOWED_FILE_TYPES = ['pdf', 'jpg', 'jpeg', 'png'];

export const CODE_LENGTH = 6;

export const ROUTES = {
  HOME: '/',
  PHARMACY_LOGIN: '/pharmacy/login',
  PHARMACY_DASHBOARD: '/pharmacy/dashboard',
  PATIENT_UPLOAD: '/patient/upload/:code',
  ABOUT: '/about',
};