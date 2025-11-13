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