import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Pour récupérer le titre depuis l'URL
import axiosClient from '../axiosClient'; // Importez axiosClient
import '../index.css'; // Assurez-vous que les styles sont dans index.css

const BibliothequeView = () => {
  const { id } = useParams(); // Récupère le titre formaté depuis l'URL
  const [livre, setLivre] = useState(null); // Détails du livre

  // Charger les détails du livre au montage du composant
  useEffect(() => {
    fetchLivre();
  }, [id]);

  // Fonction pour récupérer les détails du livre depuis l'API
  const fetchLivre = async () => {
    try {
      const response = await axiosClient.get('/bibliotheque'); // Récupère tous les livres
    const livreTrouve = response.data.find(
      (livre) => livre.titre.toLowerCase().replace(/\s+/g, '-') === id
    ); // Recherche le livre par titre formaté
    setLivre(livreTrouve); // Mettre à jour les détails du livre
  } catch (error) {
    console.error('Erreur lors du chargement du livre:', error);
  }
  };

  return (
    <div className="bibliotheque-container">
      {livre ? (
        <>
          <h1 className="gradient-text">{livre.titre}</h1>
          <div className="livre-contenu-container">
            <div className="livre-contenu">
              {livre.contenu.split('\n').map((paragraph, index) => (
                <p key={index} className="livre-paragraphe">
                  <span className="premiere-lettre">{paragraph.charAt(0)}</span>
                  {paragraph.slice(1)}
                </p>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="aucun-livre">Chargement...</p>
      )}
    </div>
  );
};

export default BibliothequeView;