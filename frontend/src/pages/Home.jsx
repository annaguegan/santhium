import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <header className="home-hero">
        <div className="hero-content">
          <p className="badge">Plateforme sécurisée</p>
          <h1>Transférez vos documents médicaux en toute confiance</h1>
          <p className="hero-subtitle">
            Santhium connecte patients et pharmacies grâce à des transferts chiffrés,
            rapides et conformes aux exigences RGPD/HDS.
          </p>

          <div className="hero-actions">
            <Link to={ROUTES.PATIENT_UPLOAD_BASE} className="btn btn-patient">
              Je suis patient
            </Link>
            <Link to={ROUTES.PHARMACY_LOGIN} className="btn btn-pharmacy">
              Je suis pharmacien
            </Link>
            <p className="cta-hint">
              Nouveau partenaire ?{' '}
              <Link to={ROUTES.PHARMACY_CREATE}>Créer ma pharmacie</Link>
            </p>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-header">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="card-body">
            <h2>Comment ça marche ?</h2>
            <ul>
              <li>1. Le pharmacien génère un code sécurisé.</li>
              <li>2. Le patient téléverse ses documents avec ce code.</li>
              <li>3. Les fichiers chiffrés sont disponibles dans l’espace pharmacie.</li>
            </ul>
          </div>
        </div>
      </header>

      <section className="home-grid">
        <div className="grid-card">
          <h3>Sécurité avant tout</h3>
          <p>
            Chiffrement de bout en bout, codes expirant automatiquement et traçabilité
            complète des échanges.
          </p>
        </div>
        <div className="grid-card">
          <h3>Expérience patient simple</h3>
          <p>
            Aucun compte requis : un code suffit pour transmettre une ordonnance ou un justificatif.
          </p>
        </div>
        <div className="grid-card">
          <h3>Multi-pharmacies</h3>
          <p>
            Chaque pharmacie possède son tenant isolé pour un suivi indépendant des équipes.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
