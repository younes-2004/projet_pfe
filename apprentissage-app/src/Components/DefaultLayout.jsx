import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useStateContext } from "../contexts/contextprovider";
import "../index.css";

export default function DefaultLayout() {
  const { user, token, onLogout } = useStateContext();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
  };

  return (
    <div id="defaultLayout">
      {/* Header */}
      <header className="header">
        <div className="logo gradient-text">FH-LEARN.</div>
        <nav className="nav-links">
          <a href="/">Accueil</a>
          <a href="/access-lesson">Leçons</a> {/* Lien vers la nouvelle page */}
          <a href="/mes-statistiques">Progression</a>
          <a href="/mes-tests">Mes tests</a>
          <a href="/tous-les-livres">bibliothèque</a>
          <a href="/mon-profil">Mon profil</a>
         
         
        </nav>
        <button 
          className="btn-logout" 
          onClick={handleLogout}
        >
         Déconnexion
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-text">
            <h1>Maîtrisez <span>les langues</span>, conquérez <span>demain.</span></h1>
            <p>"Que vous soyez débutant ou avancé, FHLearn s’adapte à votre rythme pour vous faire progresser efficacement."</p>
            <button 
              className="btn-contact" 
              onClick={() => navigate('/access-lesson')}
            >
              Commencer l'apprentissage
            </button>
          </div>
          <div className="hero-image">
            <img src="/images/caracter.png" alt="Student" />
          </div>
        </section>

        {/* Cards Section */}
        <section className="courses-section">
          <h2>Découvrez une nouvelle façon d'apprendre les langues</h2>
          <div className="courses">
            <div className="course-card">📖<br></br> Apprentissage personnalisé</div>
            <div className="course-card">📈 <br></br>Statistiques de progression</div>
            <div className="course-card">📚 <br></br>Banque de ressources illimitée</div>
            <div className="course-card">✏️<br></br> correction instantanée</div>
          </div>
          <button 
            className="btn btn-block" 
            onClick={() => navigate('/access-lesson')}
          >
            C’est parti
          </button>
        </section>
      </main>
    </div>
  );
}