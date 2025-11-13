# Dockerfile pour le backend Python de Santhium

FROM python:3.11-slim

# Variables d'environnement pour Python
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Créer un utilisateur non-root pour la sécurité
RUN useradd -m -u 1000 santhium && \
    mkdir -p /app && \
    chown -R santhium:santhium /app

WORKDIR /app

# Copier les requirements en premier (pour le cache Docker)
COPY --chown=santhium:santhium requirements.txt .

# Installer les dépendances système nécessaires
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Installer les dépendances Python
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copier le code source
COPY --chown=santhium:santhium . .

# Changer vers l'utilisateur non-root
USER santhium

# Exposer le port de l'application
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Commande de démarrage (à adapter selon votre framework: Flask, FastAPI, etc.)
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]