import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import "../index.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, token, setUser } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // "info" ou "password"

  // États pour les formulaires
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    languechoisie: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // Chargement des données utilisateur
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Chargement des données depuis l'API
    const loadUserData = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/user');
        
        setProfileData({
          name: response.data.name || "",
          email: response.data.email || "",
          languechoisie: response.data.languechoisie || "français", // Valeur par défaut
        });
        
        setUser(response.data);
        setError(null);
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
        setError("Impossible de charger vos informations. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [token, navigate, setUser]);

  // Gestion du changement dans les champs du formulaire principal
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  // Gestion du changement dans les champs du formulaire de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Soumission du formulaire de profil
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axiosClient.put('/user/profile', profileData);
      
      // Mise à jour de l'utilisateur dans le contexte
      setUser(response.data.user);
      
      setSuccess("Votre profil a été mis à jour avec succès !");
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Une erreur est survenue lors de la mise à jour de votre profil.");
      }
    }
  };

  // Soumission du formulaire de mot de passe
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Vérification simple que les mots de passe correspondent
    if (passwordData.password !== passwordData.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    try {
      await axiosClient.put('/user/password', passwordData);
      
      setSuccess("Votre mot de passe a été mis à jour avec succès !");
      
      // Réinitialiser le formulaire de mot de passe
      setPasswordData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Une erreur est survenue lors de la mise à jour de votre mot de passe.");
      }
    }
  };

  if (loading) {
    return <div className="profile-loading">Chargement de votre profil...</div>;
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>Mon Profil</h1>
        <p>Gérez vos informations personnelles et paramètres</p>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Informations
        </button>
        <button 
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Mot de passe
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'info' ? (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="languechoisie">Langue préférée</label>
              <select
                id="languechoisie"
                name="languechoisie"
                value={profileData.languechoisie}
                onChange={handleProfileChange}
              >
                <option value="français">Français</option>
                <option value="anglais">Anglais</option>
                <option value="arabe">Arabe</option>
                <option value="espagnol">Espagnol</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="current_password">Mot de passe actuel</label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={passwordData.password}
                onChange={handlePasswordChange}
                required
                minLength="8"
              />
              <small className="form-text">Le mot de passe doit contenir au moins 8 caractères.</small>
            </div>

            <div className="form-group">
              <label htmlFor="password_confirmation">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={passwordData.password_confirmation}
                onChange={handlePasswordChange}
                required
                minLength="8"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="profile-footer">
        <button className="btn-return" onClick={() => navigate('/dashboard')}>
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
};

export default UserProfile;