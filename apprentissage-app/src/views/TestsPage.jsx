import React from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import "../index.css"; 
import { FaStar } from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa"; // Icône pour indiquer qu'il s'agit d'un test
import { useStateContext } from "../contexts/contextprovider";

const TestsPage = () => {
  // Même contenu que AccessLesson mais adapté pour les tests
  const tests = [
    {
      title: "Faire connaissance",
      image: "/images/faire connaisance.jpg",
      questionsCount: 10,
      rating: 5.1,
      reviews: "6.2k",
      difficulty: "Facile",
      time: "5m",
    },
    {
      title: "Faire des achats",
      image: "/images/Faire des achats.jpg",
      questionsCount: 12,
      rating: 4.7,
      reviews: "6k",
      difficulty: "Moyen",
      time: "8m",
    },
    {
      title: "Parler de la météo",
      image: "/images/parler meteo.jpg",
      questionsCount: 8,
      rating: 3,
      reviews: "2.4k",
      difficulty: "Facile",
      time: "7m",
    },
    {
      title: "Préparer un voyage",
      image: "/images/preparer un voyage.jpg",
      questionsCount: 15,
      rating: 4.7,
      reviews: "6.4k",
      difficulty: "Difficile",
      time: "10m",
    },
    {
      title: "Réserver une activité touristique",
      image: "/images/reserver activite touristique.jpg",
      questionsCount: 14,
      rating: 4.7,
      reviews: "6.4k",
      difficulty: "Difficile",
      time: "12m",
    },
    {
      title: "Parlez des événements Urgent",
      image: "/images/Urgent.jpg",
      questionsCount: 12,
      rating: 4.7,
      reviews: "6.4k",
      difficulty: "Moyen",
      time: "15m",
    },
  ];
  
  const { user, token, onLogout } = useStateContext();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
  };
  
  // Fonction pour naviguer vers le quiz
  const handleTestClick = (lessonTitle) => {
    // Utilise la même route que pour les leçons
    navigate(`/quiz/${encodeURIComponent(lessonTitle)}`);
  };

  return (
    <div className="access-lesson-container tests-page">
      {/* Header */}
      <header className="header">
        <div className="logo gradient-text">FH-TEST.</div>
        <nav className="nav-links">
          <a href="/">Accueil</a>
          <a href="/access-lesson">Leçons</a>
          <a href="/mes-statistiques">Progression</a>
          <a href="/mes-tests" className="active">Mes tests</a>
          <a href="/tous-les-livres">Bibliothèque</a>
        </nav>
        <button 
          className="btn-logout" 
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero-section test-hero">
        <div className="hero-text">
          <h1>
            Évaluez vos <span>connaissances</span>, mesurez <span>votre progrès.</span>
          </h1>
          <p>
            "Nos tests vous permettent de valider votre apprentissage et d'identifier vos points forts et axes d'amélioration."
          </p>
        </div>
        <div className="hero-image">
          <img src="/images/tests.png" alt="Tests" />
        </div>
      </section>

      {/* Tests Grid */}
      <div className="lessons-grid tests-grid">
        {tests.map((test, index) => (
          <div 
            key={index} 
            className="lesson-card test-card"
            onClick={() => handleTestClick(test.title)}
            style={{ cursor: 'pointer' }}
          >
            <div className="test-badge">
              <FaClipboardCheck /> TEST
            </div>
            <div className="lesson-time">
              <span className="time-icon">⏰</span> {test.time}
            </div>
            <img src={test.image} alt={test.title} className="lesson-image" />
            <div className="test-indicator">
              <span className="test-difficulty" style={{
                backgroundColor: 
                  test.difficulty === "Facile" ? "#4CAF50" : 
                  test.difficulty === "Moyen" ? "#FFC107" : "#F44336"
              }}>
                {test.difficulty}
              </span>
            </div>
            <h3>{test.title}</h3>
            <div className="lesson-meta">
              <span>{test.questionsCount} Questions</span>
            </div>
            <div className="lesson-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.floor(test.rating) ? "star-filled" : "star-empty"}
                  />
                ))}
              </div>
              <span className="rating-text">
                {test.rating} ({test.reviews})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestsPage;