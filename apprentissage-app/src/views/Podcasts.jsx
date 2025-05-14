import React from 'react';
import '../index.css';
import { useStateContext } from "../contexts/contextprovider";

const Podcasts = () => {
  const { user, token, onLogout } = useStateContext();
  if (!token) {
    return <Navigate to='/login' replace />;
  }

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
  };

  // Données des podcasts ajoutées manuellement
  const podcasts = [
    {
      title: 'Podcast 1',
      description: 'Dans ce podcast 100% en français, on vous présente un thème qui fait l’actualité en France ou ailleurs, on vous donne notre opinion et on vous invite à partager la vôtre !',
      audio: 'podcast1.mp3',
      listens: 120, // Nombre d'écoutes
      likes: 45,
    },
    {
      title: 'Podcast 2',
      description: 'Un autre podcast captivant pour apprendre et découvrir de nouveaux sujets passionnants.',
      audio: 'podcast2.mp3',
      listens: 95, // Nombre d'écoutes
      likes: 30,
    },
  ];

  return (
    <div className="podcasts-page-container">
      <header className="header">
        <div className="logo gradient-text">FH-LEARN.</div>
        <nav className="nav-links">
          <a href="/">Accueil</a>
          <a href="tous-les-livres">Livres</a>
          <a href="/podcasts">Podcasts</a>
        </nav>
        <button 
          className="btn-logout" 
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </header>
      <h1 className="gradient-text">Podcasts</h1>
      <div className="podcasts-list">
        {Array.isArray(podcasts) && podcasts.length > 0 ? (
          podcasts.map((podcast, index) => (
            <div key={index} className="podcast-row">
              <div className="podcast-info">
                <h3 className="podcast-title">{podcast.title}</h3>
                <p className="podcast-description">{podcast.description}</p>
                <div className="podcast-stats">
                  <span className="podcast-listens">Écoutes : {podcast.listens}</span>
                  <span className="podcast-likes">Likes : {podcast.likes}</span>
                </div>
              </div>
              <audio controls className="podcast-audio">
                <source
                  src={`/audios/${podcast.audio}`}
                  type="audio/mpeg"
                />
                Votre navigateur ne supporte pas l'élément audio.
              </audio>
            </div>
          ))
        ) : (
          <p className="aucun-podcast">Aucun podcast disponible.</p>
        )}
      </div>
    </div>
  );
};

export default Podcasts;