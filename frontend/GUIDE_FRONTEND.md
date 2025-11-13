# Structure Frontend React - Santhium

## 📁 Structure du dossier src/

```
frontend/src/
├── index.js                 # Point d'entrée de l'application
├── App.js                   # Composant racine principal
├── App.css                  # Styles globaux de l'application
│
├── components/              # Composants réutilisables
│   ├── common/             # Composants génériques
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Loader.jsx
│   │   └── Alert.jsx
│   │
│   ├── layout/             # Composants de structure
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   │
│   ├── pharmacy/           # Composants spécifiques pharmacie
│   │   ├── Dashboard.jsx
│   │   ├── CodeGenerator.jsx
│   │   ├── DocumentList.jsx
│   │   └── DocumentViewer.jsx
│   │
│   └── patient/            # Composants spécifiques patient
│       ├── UploadForm.jsx
│       ├── CodeInput.jsx
│       └── SuccessMessage.jsx
│
├── pages/                  # Pages de l'application
│   ├── Home.jsx           # Page d'accueil
│   ├── PharmacyLogin.jsx  # Connexion pharmacien
│   ├── PharmacyDashboard.jsx  # Tableau de bord pharmacien
│   ├── PatientUpload.jsx  # Page d'upload patient
│   ├── NotFound.jsx       # Page 404
│   └── About.jsx          # À propos
│
├── services/              # Communication avec l'API
│   ├── api.js            # Configuration Axios
│   ├── authService.js    # Authentification
│   ├── documentService.js # Gestion documents
│   └── codeService.js    # Gestion codes/QR
│
├── hooks/                # Custom React Hooks
│   ├── useAuth.js       # Hook d'authentification
│   ├── useUpload.js     # Hook d'upload de fichiers
│   └── useDebounce.js   # Hook de debounce
│
├── contexts/             # React Context pour état global
│   ├── AuthContext.jsx  # Contexte authentification
│   └── ThemeContext.jsx # Contexte thème (optionnel)
│
├── utils/                # Fonctions utilitaires
│   ├── formatters.js    # Formatage dates, tailles fichiers, etc.
│   ├── validators.js    # Validation formulaires
│   ├── constants.js     # Constantes de l'app
│   └── helpers.js       # Fonctions helper diverses
│
├── styles/               # Styles CSS/SCSS
│   ├── variables.css    # Variables CSS (couleurs, etc.)
│   ├── global.css       # Styles globaux
│   └── components.css   # Styles des composants
│
├── assets/               # Ressources statiques
│   ├── images/          # Images, logos
│   │   └── logo.svg
│   └── icons/           # Icônes SVG
│
└── config/               # Configuration
    ├── routes.js        # Configuration des routes
    └── constants.js     # Constantes de configuration
```

## 📝 Description détaillée des fichiers clés

### 1. index.js - Point d'entrée
```javascript
// Ce fichier initialise React et monte l'application
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 2. App.js - Composant racine
```javascript
// Gère le routing et les providers globaux
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import PharmacyLogin from './pages/PharmacyLogin';
// ... autres imports

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pharmacy/login" element={<PharmacyLogin />} />
          {/* ... autres routes */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### 3. components/ - Composants réutilisables

**components/common/Button.jsx**
```javascript
// Bouton réutilisable avec différents styles
export const Button = ({ children, variant = 'primary', onClick, disabled }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

**components/pharmacy/CodeGenerator.jsx**
```javascript
// Génère un code/QR code pour une pharmacie
import { useState } from 'react';
import { codeService } from '../../services/codeService';
import QRCode from 'qrcode.react';

export const CodeGenerator = () => {
  const [code, setCode] = useState(null);
  const [qrData, setQrData] = useState(null);

  const generateCode = async () => {
    const result = await codeService.generate();
    setCode(result.code);
    setQrData(result.url);
  };

  return (
    <div>
      <button onClick={generateCode}>Générer un code</button>
      {qrData && <QRCode value={qrData} />}
      {code && <p>Code: {code}</p>}
    </div>
  );
};
```

**components/patient/UploadForm.jsx**
```javascript
// Formulaire d'upload pour le patient
import { useState } from 'react';
import { documentService } from '../../services/documentService';

export const UploadForm = ({ code }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      await documentService.upload(code, file);
      alert('Document envoyé avec succès !');
    } catch (error) {
      alert('Erreur lors de l\'envoi');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <button type="submit" disabled={!file || uploading}>
        {uploading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
};
```

### 4. pages/ - Pages complètes

**pages/Home.jsx**
```javascript
// Page d'accueil avec choix pharmacien/patient
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const Home = () => {
  return (
    <Layout>
      <h1>Bienvenue sur Santhium</h1>
      <div>
        <Link to="/pharmacy/login">
          <button>Je suis pharmacien</button>
        </Link>
        <Link to="/patient/upload">
          <button>Je suis patient</button>
        </Link>
      </div>
    </Layout>
  );
};
```

**pages/PharmacyDashboard.jsx**
```javascript
// Tableau de bord du pharmacien
import { useState, useEffect } from 'react';
import { CodeGenerator } from '../components/pharmacy/CodeGenerator';
import { DocumentList } from '../components/pharmacy/DocumentList';
import { documentService } from '../services/documentService';

const PharmacyDashboard = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const docs = await documentService.getAll();
    setDocuments(docs);
  };

  return (
    <div className="dashboard">
      <h1>Tableau de bord</h1>
      <CodeGenerator />
      <DocumentList documents={documents} onRefresh={loadDocuments} />
    </div>
  );
};
```

### 5. services/ - Communication API

**services/api.js**
```javascript
// Configuration Axios
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**services/authService.js**
```javascript
// Gestion de l'authentification
import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    // Décoder le token JWT pour récupérer l'utilisateur
    return JSON.parse(atob(token.split('.')[1]));
  },
};
```

**services/documentService.js**
```javascript
// Gestion des documents
import api from './api';

export const documentService = {
  // Upload d'un document par un patient
  upload: async (code, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('code', code);

    return await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Récupérer tous les documents (pharmacien)
  getAll: async () => {
    const response = await api.get('/documents');
    return response.data;
  },

  // Télécharger un document
  download: async (documentId) => {
    const response = await api.get(`/documents/${documentId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Supprimer un document
  delete: async (documentId) => {
    return await api.delete(`/documents/${documentId}`);
  },
};
```

**services/codeService.js**
```javascript
// Gestion des codes/QR codes
import api from './api';

export const codeService = {
  // Générer un nouveau code (pharmacien)
  generate: async (expirationHours = 24) => {
    const response = await api.post('/codes/generate', {
      expiration_hours: expirationHours,
    });
    return response.data;
  },

  // Valider un code (patient)
  validate: async (code) => {
    const response = await api.post('/codes/validate', { code });
    return response.data;
  },

  // Récupérer tous les codes actifs
  getActive: async () => {
    const response = await api.get('/codes/active');
    return response.data;
  },
};
```

### 6. hooks/ - Custom Hooks

**hooks/useAuth.js**
```javascript
// Hook personnalisé pour l'authentification
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const user = await authService.login(email, password);
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
};
```

**hooks/useUpload.js**
```javascript
// Hook pour gérer l'upload de fichiers
import { useState } from 'react';
import { documentService } from '../services/documentService';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const upload = async (code, file) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      await documentService.upload(code, file);
      setProgress(100);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress, error };
};
```

### 7. contexts/ - Context API

**contexts/AuthContext.jsx**
```javascript
// Context pour partager l'état d'authentification
import { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
```

### 8. utils/ - Utilitaires

**utils/validators.js**
```javascript
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
```

**utils/formatters.js**
```javascript
// Formatage des données
export const formatters = {
  fileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  date: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  relativeTime: (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  },
};
```

**utils/constants.js**
```javascript
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
```

## 🔄 Workflow typique

### Pour le pharmacien :
1. Se connecte via `PharmacyLogin`
2. Arrive sur `PharmacyDashboard`
3. Utilise `CodeGenerator` pour créer un code/QR
4. Partage le code au patient
5. Voit les documents arriver dans `DocumentList`

### Pour le patient :
1. Reçoit un code/QR du pharmacien
2. Accède à `PatientUpload` (via URL ou scan QR)
3. Utilise `UploadForm` pour envoyer son document
4. Reçoit une confirmation

## 🎨 Styling

Utilisez Tailwind CSS, Material-UI, ou CSS modules selon votre préférence.

Exemple avec Tailwind :
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

## 📦 Dépendances recommandées

```bash
npm install react-router-dom axios qrcode.react
npm install react-icons date-fns
npm install @tanstack/react-query  # Pour gestion cache/queries
```

## ✅ À faire ensuite

1. Créer les fichiers manquants dans src/
2. Installer les dépendances nécessaires
3. Configurer les variables d'environnement
4. Tester les services avec le backend
5. Ajouter la gestion d'erreurs
6. Implémenter le chiffrement côté client (optionnel)