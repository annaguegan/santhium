# Guide d'utilisation - Santhium

## Table des matières

- [Introduction](#introduction)
- [Prérequis](#prérequis)
- [Installation et démarrage](#installation-et-démarrage)
- [Guide pharmacien](#guide-pharmacien)
- [Guide patient](#guide-patient)
- [Gestion administrative](#gestion-administrative)
- [Dépannage](#dépannage)
- [FAQ](#faq)
- [Support et contact](#support-et-contact)

---

## Introduction

Santhium est une plateforme sécurisée permettant aux pharmacies de recevoir des documents médicaux (ordonnances, justificatifs, certificats) de manière simple et conforme aux réglementations RGPD et HDS.

### Principaux avantages

**Pour le patient :** Envoi de documents sans création de compte, en quelques clics via un code simple ou un QR code.

**Pour le pharmacien :** Réception centralisée et sécurisée de tous les documents, avec chiffrement automatique et suppression programmée.

**Pour la pharmacie :** Solution conforme aux exigences légales, traçabilité complète et isolation totale des données par établissement.

---

## Prérequis

### Accès à la plateforme

- **URL de production :** `https://santhium.fr` (à définir)
- **URL de développement :** `http://localhost` (installation locale)

### Pour les pharmaciens

- Connexion internet stable
- Navigateur web récent (Chrome, Firefox, Safari, Edge)
- Identifiants de connexion fournis par votre administrateur pharmacie
- Code tenant de votre pharmacie (si vous créez votre compte)

### Pour les patients

- Smartphone ou ordinateur avec connexion internet
- Navigateur web ou application de scan de QR code
- Document médical au format PDF, JPG, JPEG ou PNG (maximum 10 Mo)

---

## Installation et démarrage

### Déploiement local (développeurs uniquement)

#### Étape 1 : Cloner le projet

```bash
git clone https://github.com/votre-organisation/santhium.git
cd santhium
```

#### Étape 2 : Configuration de l'environnement

Créez un fichier `.env` à la racine du projet en copiant le fichier d'exemple :

```bash
cp .env.example .env
```

Modifiez les variables sensibles dans le fichier `.env` :

```env
# Base de données
DB_PASSWORD=votre_mot_de_passe_securise

# Sécurité
SECRET_KEY=votre_cle_secrete_jwt_32_caracteres_minimum
ENCRYPTION_KEY=votre_cle_de_chiffrement_base64

# CORS (si besoin)
CORS_ORIGINS=http://localhost:3000,http://localhost:80
```

**Génération des clés sécurisées :**

```bash
# Génération de SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"

# Génération de ENCRYPTION_KEY
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

#### Étape 3 : Démarrage de l'application

Assurez-vous que Docker Desktop est lancé, puis exécutez :

```bash
docker compose up -d --build
```

Attendez quelques secondes que tous les services démarrent. Vous pouvez suivre les logs avec :

```bash
docker compose logs -f
```

#### Étape 4 : Initialisation de la base de données

Une fois les conteneurs démarrés, initialisez la base de données avec des données de test :

```bash
docker compose exec backend python scripts/init_db.py
```

Ce script crée :
- Deux pharmacies de test (Paris et Lyon)
- Deux comptes utilisateurs associés

**Identifiants de test :**
- Email : `paris@test.fr` | Mot de passe : `test123`
- Email : `lyon@test.fr` | Mot de passe : `test123`

#### Étape 5 : Accès à l'application

- **Frontend :** [http://localhost](http://localhost)
- **API (debug) :** [http://localhost:8000](http://localhost:8000)
- **Documentation API interactive :** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Guide pharmacien

### Première connexion

#### Cas 1 : Votre pharmacie existe déjà

Si votre pharmacie est déjà enregistrée dans Santhium, un administrateur vous a communiqué le code tenant de votre établissement.

1. Rendez-vous sur la page d'accueil de Santhium
2. Cliquez sur **"Je suis pharmacien"**
3. Sélectionnez **"Créer un compte pharmacien"**
4. Remplissez le formulaire :
   - Votre nom complet
   - Votre email professionnel
   - Le code tenant de votre pharmacie (format : `PH-XXXXXX`)
   - Un mot de passe sécurisé (minimum 8 caractères)
   - Confirmation du mot de passe
5. Cliquez sur **"Créer mon compte"**
6. Vous êtes automatiquement connecté et redirigé vers le tableau de bord

#### Cas 2 : Création d'une nouvelle pharmacie

Si votre pharmacie n'est pas encore enregistrée dans Santhium :

1. Rendez-vous sur la page d'accueil
2. Cliquez sur **"Je suis pharmacien"**
3. Sélectionnez **"Créer ma pharmacie"**
4. Remplissez le formulaire en deux sections :

**Informations de la pharmacie :**
- Nom de la pharmacie
- Téléphone (8 à 15 chiffres)
- Ville
- Code postal (4 à 10 chiffres)
- Adresse (optionnel)

**Compte administrateur :**
- Nom du responsable (optionnel)
- Email professionnel (sera votre identifiant de connexion)
- Mot de passe (minimum 8 caractères)
- Confirmation du mot de passe

5. Cliquez sur **"Créer ma pharmacie"**
6. **Important :** Un code tenant unique est généré (format : `PH-XXXXXXXXXXXXXXXX`)
7. **Conservez précieusement ce code** : il permettra à vos collègues de créer leur compte et de rejoindre votre pharmacie
8. Cliquez sur **"Se connecter"** pour accéder au tableau de bord

### Connexion suivante

1. Rendez-vous sur la page d'accueil
2. Cliquez sur **"Je suis pharmacien"**
3. Sélectionnez **"Se connecter"**
4. Saisissez votre email et mot de passe
5. Cliquez sur **"Se connecter"**

### Tableau de bord

Après connexion, vous accédez à votre tableau de bord personnel divisé en deux sections principales.

#### Section 1 : Génération de codes de transfert

Cette section vous permet de créer des codes temporaires pour recevoir des documents.

**Générer un nouveau code :**

1. Cliquez sur le bouton **"Générer un nouveau code"**
2. Un code à 6 caractères alphanumériques est généré instantanément (exemple : `A3K9M2`)
3. Un QR code correspondant est affiché simultanément

**Utilisation du code généré :**

Vous avez deux options pour communiquer le code au patient :

**Option 1 : Communication verbale du code**
- Dictez simplement le code au patient (exemple : "A-3-K-9-M-2")
- Le patient le saisira manuellement sur la page d'upload

**Option 2 : Scan du QR code**
- Montrez le QR code affiché à l'écran au patient
- Le patient scanne le QR code avec son smartphone
- Il est automatiquement redirigé vers la page d'upload avec le code pré-rempli

**Caractéristiques du code :**
- **Durée de validité :** 1 heure à compter de la génération
- **Usage :** 1 seul upload autorisé par code
- **Sécurité :** Le code devient invalide après utilisation ou expiration

**Copier le code :**
- Cliquez sur l'icône de copie à côté du code
- Le code est copié dans votre presse-papier
- Vous pouvez le coller dans un SMS, un email, ou une messagerie

#### Section 2 : Documents reçus

Cette section affiche tous les documents envoyés par les patients via les codes générés.

**Tableau des documents :**

Le tableau présente les colonnes suivantes :
- **Nom du fichier :** Nom original du document envoyé par le patient
- **Taille :** Poids du fichier (en Ko ou Mo)
- **Date d'envoi :** Date et heure de réception
- **Statut :** 
  - Badge **"Nouveau"** (bleu) : Document non encore téléchargé
  - Badge **"Lu"** (vert) : Document déjà consulté
- **Actions :** Boutons de téléchargement et suppression

**Télécharger un document :**

1. Localisez le document dans la liste
2. Cliquez sur l'icône de téléchargement (flèche vers le bas)
3. Le document est automatiquement déchiffré et téléchargé sur votre ordinateur
4. Le statut passe de "Nouveau" à "Lu"

**Supprimer un document :**

1. Cliquez sur l'icône de suppression (poubelle rouge)
2. Une fenêtre de confirmation s'affiche
3. Confirmez la suppression
4. Le document est définitivement supprimé de manière sécurisée

**Actualiser la liste :**
- Cliquez sur le bouton **"Actualiser"** en haut à droite de la section
- La liste se recharge pour afficher les nouveaux documents reçus

#### Profil et informations de la pharmacie

Cliquez sur l'icône de profil en haut à droite de l'écran pour accéder aux informations de votre compte :

**Informations affichées :**
- Nom de la pharmacie
- Code tenant (pour inscription de collègues)
- Email du compte connecté
- Ville de la pharmacie
- Adresse complète
- Numéro de téléphone

**Déconnexion :**
- Cliquez sur le bouton **"Déconnexion"** dans le menu profil
- Vous êtes redirigé vers la page d'accueil

---

## Guide patient

Le processus d'envoi de document a été conçu pour être le plus simple possible, sans nécessiter de création de compte.

### Envoi d'un document

#### Méthode 1 : Via QR code (recommandée)

1. Le pharmacien vous montre un QR code à l'écran de son ordinateur
2. Ouvrez l'appareil photo de votre smartphone ou une application de scan de QR code
3. Scannez le QR code affiché
4. Vous êtes automatiquement redirigé vers la page d'envoi de Santhium
5. Le code de transfert est déjà pré-rempli
6. Passez directement à l'étape de sélection du fichier (voir ci-dessous)

#### Méthode 2 : Via saisie manuelle du code

1. Rendez-vous sur la page d'accueil de Santhium
2. Cliquez sur **"Je suis patient"**
3. Saisissez le code à 6 caractères communiqué par votre pharmacien (exemple : `A3K9M2`)
4. Cliquez sur **"Valider le code"**

#### Sélection et envoi du fichier

1. Une fois le code validé, un formulaire d'upload s'affiche
2. Cliquez sur **"Choisir un fichier"** ou sur la zone de dépôt
3. Sélectionnez votre document médical depuis votre appareil
   - **Formats acceptés :** PDF, JPG, JPEG, PNG
   - **Taille maximale :** 10 Mo
4. Le nom du fichier sélectionné s'affiche
5. Cliquez sur **"Envoyer mon document"**
6. Un message de confirmation apparaît : **"Document envoyé avec succès !"**

**Votre document est :**
- Automatiquement chiffré avec un algorithme AES-256
- Transmis de manière sécurisée à la pharmacie
- Supprimé automatiquement après 30 jours (durée de rétention)

### Sécurité et confidentialité

**Aucune donnée personnelle n'est conservée à votre sujet :**
- Pas de création de compte
- Pas de conservation de votre adresse IP
- Pas de cookies de tracking
- Seul le document médical est stocké temporairement et de manière chiffrée

**Le code de transfert :**
- Expire après 1 heure
- Ne peut être utilisé qu'une seule fois
- Ne peut plus être réutilisé après envoi d'un document

---

## Gestion administrative

### Gestion des utilisateurs de la pharmacie

#### Inviter un nouveau pharmacien

En tant qu'administrateur ou membre de la pharmacie, vous pouvez inviter des collègues à rejoindre la plateforme :

1. Communiquez-leur le **code tenant de votre pharmacie** (visible dans votre profil)
2. Indiquez-leur de se rendre sur la page d'accueil de Santhium
3. Le nouveau pharmacien devra :
   - Cliquer sur **"Je suis pharmacien"** puis **"Créer un compte pharmacien"**
   - Saisir ses informations personnelles et le code tenant
   - Créer son mot de passe

Le nouveau membre aura accès au tableau de bord de la pharmacie et pourra générer des codes et consulter les documents reçus.

### Politique de rétention des données

**Documents patients :**
- Durée de conservation : **30 jours par défaut**
- Suppression automatique après ce délai
- Suppression manuelle possible à tout moment par le pharmacien

**Codes de transfert :**
- Expiration : **1 heure après génération**
- Suppression automatique des codes expirés tous les jours

**Comptes utilisateurs :**
- Conservation tant que le compte est actif
- Suppression sur demande (droit à l'oubli RGPD)

### Conformité RGPD

Santhium respecte strictement le Règlement Général sur la Protection des Données :

- **Minimisation des données :** Seules les données strictement nécessaires sont collectées
- **Chiffrement :** Tous les documents sont chiffrés avec AES-256
- **Traçabilité :** Logs d'audit de toutes les actions sensibles
- **Droit d'accès :** Les patients peuvent demander la suppression de leurs documents
- **Isolation :** Chaque pharmacie est un tenant isolé, aucune pharmacie ne peut accéder aux données d'une autre

---

## Dépannage

### Problèmes de connexion pharmacien

**Je ne parviens pas à me connecter**

- Vérifiez que votre email et mot de passe sont corrects
- Assurez-vous que votre compte a bien été créé (vérifiez votre boîte mail)
- Si vous avez oublié votre mot de passe, contactez l'administrateur de votre pharmacie
- Essayez de vider le cache de votre navigateur et de vous reconnecter

**Message d'erreur : "Code pharmacie invalide"**

- Vérifiez que le code tenant est correct (format : `PH-XXXXXXXXXXXXXXXX`)
- Contactez l'administrateur de votre pharmacie pour obtenir le bon code
- Assurez-vous qu'il n'y a pas d'espaces avant ou après le code

### Problèmes d'envoi de document (patient)

**Message d'erreur : "Code invalide ou expiré"**

- Vérifiez que vous avez saisi le bon code (6 caractères alphanumériques)
- Le code a peut-être expiré (validité de 1 heure). Demandez un nouveau code au pharmacien
- Le code a peut-être déjà été utilisé. Un code ne peut servir qu'une seule fois

**Le fichier ne s'envoie pas**

- Vérifiez que le fichier est au bon format (PDF, JPG, JPEG, PNG)
- Vérifiez que la taille du fichier ne dépasse pas 10 Mo
- Essayez de compresser ou réduire la qualité de votre image si elle est trop lourde
- Vérifiez votre connexion internet

**Message d'erreur : "Fichier trop volumineux"**

- Réduisez la taille de votre fichier :
  - Pour une image : diminuez la résolution ou compressez-la
  - Pour un PDF : utilisez un compresseur en ligne ou divisez-le en plusieurs fichiers
- Demandez plusieurs codes au pharmacien pour envoyer plusieurs documents séparés

### Problèmes de téléchargement de document (pharmacien)

**Le document ne se télécharge pas**

- Vérifiez votre connexion internet
- Essayez de rafraîchir la page et de retélécharger
- Vérifiez que vous avez les autorisations de téléchargement dans votre navigateur
- Essayez avec un autre navigateur

**Le document téléchargé est corrompu ou illisible**

- Cela peut indiquer un problème de chiffrement/déchiffrement
- Contactez le support technique en fournissant l'ID du document

### Problèmes techniques (développeurs)

**Les conteneurs Docker ne démarrent pas**

```bash
# Vérifier l'état des conteneurs
docker compose ps

# Voir les logs d'erreur
docker compose logs backend
docker compose logs frontend
docker compose logs postgres

# Reconstruire complètement
docker compose down -v
docker compose up -d --build
```

**Erreur de connexion à la base de données**

- Vérifiez que PostgreSQL est bien démarré : `docker compose ps`
- Vérifiez les variables d'environnement dans `.env`
- Vérifiez les logs : `docker compose logs postgres`

**Le frontend ne se connecte pas au backend**

- Vérifiez que le backend est accessible : `curl http://localhost:8000/health`
- Vérifiez la configuration Nginx dans `frontend/nginx.conf`
- Vérifiez les logs frontend : `docker compose logs frontend`

---

## FAQ

### Questions générales

**Q : Santhium est-il gratuit ?**

R : Santhium est proposé sous forme d'abonnement mensuel aux pharmacies. Le tarif est d'environ 40€/mois par pharmacie. Les patients ne paient rien.

**Q : Dois-je créer un compte en tant que patient ?**

R : Non, l'un des avantages de Santhium est que vous n'avez besoin d'aucun compte. Il vous suffit d'avoir le code fourni par votre pharmacien.

**Q : Combien de temps mes documents sont-ils conservés ?**

R : Les documents sont conservés pendant 30 jours par défaut, puis automatiquement supprimés. Le pharmacien peut également les supprimer manuellement à tout moment.

**Q : Mes documents sont-ils vraiment sécurisés ?**

R : Oui. Tous les documents sont chiffrés avec l'algorithme AES-256 (même niveau de sécurité que les banques). Les données sont isolées par pharmacie et aucune pharmacie ne peut accéder aux données d'une autre.

**Q : Puis-je envoyer plusieurs documents avec le même code ?**

R : Non, chaque code ne peut être utilisé qu'une seule fois. Si vous devez envoyer plusieurs documents, demandez au pharmacien de générer plusieurs codes.

**Q : Que se passe-t-il si j'envoie le mauvais document ?**

R : Contactez immédiatement votre pharmacien qui pourra supprimer le document erroné. Vous pourrez ensuite envoyer le bon document avec un nouveau code.

### Questions pharmaciens

**Q : Combien de codes puis-je générer ?**

R : Il n'y a pas de limite au nombre de codes que vous pouvez générer. Chaque code expire après 1 heure ou après une utilisation.

**Q : Puis-je voir qui a envoyé un document ?**

R : Non, par respect de la confidentialité, aucune information d'identification du patient n'est conservée. Vous voyez uniquement le nom du fichier, sa taille et la date d'envoi.

**Q : Puis-je personnaliser la durée de rétention des documents ?**

R : Dans la version actuelle, la durée de rétention est fixée à 30 jours. Des options de personnalisation pourront être ajoutées dans les futures versions.

**Q : Combien de pharmaciens peuvent utiliser Santhium dans ma pharmacie ?**

R : Il n'y a pas de limite. Tous les membres de votre équipe peuvent créer un compte avec le code tenant de votre pharmacie.

**Q : Est-ce compatible avec mon logiciel de gestion de pharmacie ?**

R : Santhium fonctionne de manière indépendante et ne nécessite aucune intégration avec votre logiciel existant. Vous téléchargez simplement les documents reçus.

### Questions techniques

**Q : Sur quels navigateurs Santhium fonctionne-t-il ?**

R : Santhium est compatible avec tous les navigateurs modernes : Chrome, Firefox, Safari, Edge (versions récentes).

**Q : Puis-je utiliser Santhium sur mobile ?**

R : Oui, l'interface est responsive et s'adapte automatiquement aux smartphones et tablettes.

**Q : Les documents sont-ils accessibles hors ligne ?**

R : Non, une connexion internet est nécessaire pour générer des codes, envoyer et consulter des documents.

**Q : Qu'arrive-t-il si j'ai un problème technique ?**

R : Contactez le support technique de Santhium à l'adresse : support@santhium.fr (à définir)

---

## Support et contact

Pour toute question, problème technique ou demande d'assistance :

- **Email :** support@santhium.fr (à définir)
- **Documentation :** https://docs.santhium.fr (à définir)
- **Signalement de bug :** https://github.com/votre-organisation/santhium/issues

---

**Version du guide :** 1.0  
**Dernière mise à jour :** Janvier 2025  
**Plateforme :** Santhium v1.0.0