# Santhium 🏥

Plateforme sécurisée de transfert de documents médicaux pour les pharmacies.

---

## 📋 Description

Santhium est une solution simple et sécurisée pour la transmission de documents sensibles dans le secteur de la santé. La plateforme permet aux pharmacies de recevoir des ordonnances et documents médicaux de manière conforme RGPD/HDS.

**Documentation complète** : Consultez https://deepwiki.com/annaguegan/santhium pour plus de détails.

---

## 🛠️ Technologies utilisées

### Backend
- **Python 3.11+** avec **FastAPI** (ou Flask selon implémentation)
- **PostgreSQL** (base de données multi-tenant)
- **SQLAlchemy** (ORM)
- **JWT** (authentification)
- **Cryptography** (chiffrement AES des fichiers)

### Frontend
- **React.js 18+**
- **Node.js 18+**
- **Nginx** (serveur web en production)

### Infrastructure & DevOps
- **Docker** & **Docker Compose**
- **Redis** (cache et sessions)
- **GitHub Actions** (CI/CD)

### Sécurité
- HTTPS/TLS
- Chiffrement AES-256 pour les fichiers
- Authentification JWT
- Headers de sécurité (CORS, CSP, etc.)
- Conformité RGPD et orientation HDS

---

## 🚀 Installation et démarrage

### Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé
- Git installé

### 1. Cloner le projet

```bash
git clone <url_du_repository>
cd santhium
```

### 2. Configuration

Créez un fichier `.env` à la racine du projet (copier depuis `.env.example`) :

```bash
cp .env.example .env
```

Modifiez les valeurs sensibles dans `.env` :
```env
DB_PASSWORD=votre_mot_de_passe_securise
SECRET_KEY=votre_cle_secrete_jwt
ENCRYPTION_KEY=votre_cle_de_chiffrement
```

### 3. Lancer l'application avec Docker

**Démarrer tous les services :**
```bash
docker-compose up -d
```

L'application sera accessible à :
- **Frontend** : http://localhost
- **Backend API** : http://localhost:8000
- **Documentation API** : http://localhost:8000/docs

---

## 🐳 Commandes Docker

### Démarrage et arrêt

```bash
# Démarrer les conteneurs en arrière-plan
docker-compose up -d

# Voir les logs en temps réel
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend

# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

### Rebuild et mise à jour

```bash
# Rebuild après modification du code
docker-compose up -d --build

# Rebuild un service spécifique
docker-compose up -d --build backend

# Rebuild complet (force la reconstruction)
docker-compose build --no-cache
docker-compose up -d
```

### Commandes utiles

```bash
# Voir l'état des conteneurs
docker-compose ps

# Accéder au shell d'un conteneur
docker-compose exec backend bash
docker-compose exec frontend sh

# Redémarrer un service
docker-compose restart backend

# Voir les ressources utilisées
docker stats
```

---

## 📁 Structure du projet

```
santhium/
├── backend/                 # API Python (FastAPI)
│   ├── app/
│   │   ├── main.py
│   │   ├── models/         # Modèles de base de données
│   │   ├── routes/         # Endpoints API
│   │   ├── utils/          # Fonctions utilitaires
│   │   └── config.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── .dockerignore
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔧 Développement local (sans Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## ✅ Ce qui fonctionne actuellement

- ✅ Architecture Docker multi-conteneurs
- ✅ Backend API avec FastAPI
- ✅ Frontend React
- ✅ Base de données PostgreSQL multi-tenant
- ✅ Chiffrement AES des fichiers
- ✅ Authentification JWT
- ✅ Fonctionnement en localhost

---

## 🚧 Tâches restantes

### 1. **Connexion aux VMs de production**
- [ ] Configurer les VMs et obtenir les adresses IP
- [ ] Remplacer les URLs `localhost` par les URLs des VMs
- [ ] Mettre à jour les variables d'environnement pour la production
- [ ] Configurer le reverse proxy (Nginx/Traefik) sur les VMs

### 2. **Gestion des comptes**
- [ ] Revoir le système d'inscription des pharmacies
- [ ] Améliorer le workflow de création de compte
- [ ] Ajouter la validation par email
- [ ] Implémenter la gestion des rôles (admin, pharmacien, patient)

### 3. **Interface et branding**
- [ ] Intégrer les logos officiels (Santhium + ENSIBS)
- [ ] Améliorer le design du dashboard
- [ ] Optimiser l'UX du formulaire de dépôt patient
- [ ] Rendre l'interface responsive

### 4. **Sécurité et conformité**
- [ ] Audit de sécurité complet
- [ ] Renforcer la validation des entrées utilisateur
- [ ] Implémenter le rate limiting
- [ ] Ajouter les logs d'audit pour RGPD
- [ ] Configurer HTTPS/TLS en production
- [ ] Mettre en place la surveillance et alertes de sécurité
- [ ] Préparer la certification HDS

### 5. **Tests et qualité**
- [ ] Écrire les tests unitaires (backend)
- [ ] Écrire les tests d'intégration
- [ ] Tests E2E avec Playwright ou Cypress
- [ ] Tests de charge et performance

### 6. **DevOps**
- [ ] Finaliser le pipeline CI/CD avec GitHub Actions
- [ ] Configurer les backups automatiques de la base de données
- [ ] Mettre en place le monitoring (Prometheus, Grafana)
- [ ] Implémenter la rotation des logs

---

## 📚 Documentation

Pour plus d'informations, consultez :
- **Wiki du projet** : https://deepwiki.com/annaguegan/santhium
- **Documentation API** : http://localhost:8000/docs (une fois l'application lancée)


## 📄 Licence

Projet réalisé dans le cadre de la formation ENSIBS 5A - Groupe 07  
© 2025 - Tous droits réservés

---

## 🆘 Support

En cas de problème :
1. Vérifiez que Docker est bien lancé
2. Consultez les logs : `docker-compose logs -f`
3. Vérifiez le fichier `.env`
4. Consultez le wiki : https://deepwiki.com/annaguegan/santhium
5. Contactez l'équipe projet