import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import '../index.css';
import { useStateContext } from "../contexts/contextprovider";

const TousLesLivres = () => {
  const [livres, setLivres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLivres();
  }, []);

  const fetchLivres = async () => {
    try {
      const response = await axiosClient.get('/bibliotheque');
      setLivres(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
    }
  };

  const handleLivreClick = (titre) => {
    const formattedTitle = titre.toLowerCase().replace(/\s+/g, '-').replace(/'/g, ''); // Formater le titre pour l'URL
    navigate(`/bibliotheque/${formattedTitle}`);
  };
    const { user, token, onLogout } = useStateContext();
     if (!token) {
      return <Navigate to='/login' replace />;
    }
  
    const handleLogout = (e) => {
      e.preventDefault();
      onLogout();
    };

  return (
    <div className="bibliotheque-container">
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

      {/* Contenu principal */}
      <h1 className="gradient-text">Tous les Livres</h1>
      <div className="livres-container">
        {Array.isArray(livres) && livres.length > 0 ? (
          livres.map((livre, index) => (
            <div key={index} className="livre-card">
              <div className="livre-image-container">
                <img
                  src={
                    livre.titre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 'la cigale et la fourmi'
                      ? '/images/la-cigale-et-la-fourmi.jpg'
                      : livre.titre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 'le petit prince'
                      ? '/images/Le petit prince.jpg'
                      : livre.titre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 'l etranger'
                      ? '/images/l\'etranger.webp'
                      : '/images/le-petit-chaperon-rouge.jpg'
                  }
                  alt={livre.titre}
                  className="story-image"
                />
              </div>
              <div className="livre-details">
                <h2 className="livre-titre-gradient">{livre.titre}</h2>
                <p className="livre-description">{livre.description || "Pas de description disponible."}</p>
                <p className="livre-vues">{livre.vues || 20} vues</p>
                <button 
                  className="btn-details" 
                  onClick={() => handleLivreClick(livre.titre)}
                >
                  Voir les détails
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="aucun-livre">Aucun livre disponible.</p>
        )}
      </div>
    </div>
  );
};

export default TousLesLivres;