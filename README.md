# Santhium - Plateforme sécurisée de transfert de documents médicaux

## 🚀 Démarrage rapide

### Prérequis
- Docker Desktop installé
- Node.js 18+ (pour le développement local)
- Python 3.11+ (pour le développement local)

### Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd santhium
```

2. **Créer le fichier .env**
```bash
cp .env.example .env
# Éditer .env et modifier les valeurs sensibles
```

3. **Lancer avec Docker Compose**
```bash
docker-compose up -d
```

L'application sera accessible à :
- Frontend : http://localhost
- Backend API : http://localhost:8000
- Documentation API : http://localhost:8000/docs

### Commandes utiles

**Démarrer les services**
```bash
docker-compose up -d
```

**Voir les logs**
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Arrêter les services**
```bash
docker-compose down
```

**Rebuild après modification**
```bash
docker-compose up -d --build
```

**Arrêter et supprimer les volumes**
```bash
docker-compose down -v
```

## 📁 Structure du projet

```
santhium/
├── frontend/                 # Application React
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
├── backend/                  # API Python
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── models/
│       ├── routes/
│       └── utils/
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔒 Sécurité

- Chiffrement AES pour les fichiers
- HTTPS/TLS en production
- Authentification JWT
- Conformité RGPD/HDS
- Headers de sécurité configurés

## 🔧 Développement

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

### Backend (Python)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📝 Variables d'environnement importantes

Consultez `.env.example` pour la liste complète.

Variables critiques :
- `DB_PASSWORD` : Mot de passe PostgreSQL
- `SECRET_KEY` : Clé secrète pour JWT
- `ENCRYPTION_KEY` : Clé de chiffrement des fichiers
- `DATA_RETENTION_DAYS` : Durée de conservation des données

## 🧪 Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## 📦 Production

Pour le déploiement en production :

1. Utiliser des secrets managers pour les variables sensibles
2. Activer HTTPS avec un reverse proxy (Nginx, Traefik)
3. Configurer les backups automatiques de la base de données
4. Mettre en place une solution de monitoring
5. Obtenir la certification HDS


## 📄 Licence

Propriétaire - Groupe 07 ENSIBS 2025