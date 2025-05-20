import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import "../index.css";
import { FaStar } from "react-icons/fa";
import { useStateContext } from "../contexts/contextprovider";
import LessonContentView from './LessonContentView'; // Assurez-vous que cette ligne est présente


const AccessLesson = () => {
  // État pour suivre le thème sélectionné
  const [selectedTheme, setSelectedTheme] = useState(null);
  
  const lessons = [
    {
      title: "Faire connaissance",
      image: "/images/faire connaisance.jpg",
      lessonsCount: 5,
      rating: 5.1,
      reviews: "6.2k",
      price: "Gratuit",
      time: "10m",
    },
    {
      title: "Faire des achats",
      image: "/images/Faire des achats.jpg",
      lessonsCount: 5,
      rating: 4.7,
      reviews: "6k",
      price: "Gratuit",
      time: "12m",
    },
    {
      title: "Parler de la météo",
      image: "/images/parler meteo.jpg",
      lessonsCount: 5,
      rating: 3,
      reviews: "2.4k",
      price: "Gratuit",
      time: "15m",
    },
    {
      title: "Préparer un voyage",
      image: "/images/preparer un voyage.jpg",
      lessonsCount: 5,
      rating: 4.7,
      reviews: "6.4k",
      price: "79.00€",
      time: "17m",
    },
    {
      title: "Réserver une activité touristique",
      image: "/images/reserver activite touristique.jpg",
      lessonsCount: 5,
      rating: 4.7,
      reviews: "6.4k",
      price: "148.00€",
      time: "20m",
    },
    {
      title: "Parlez des événements Urgent",
      image: "/images/Urgent.jpg",
      lessonsCount: 5,
      rating: 4.7,
      reviews: "6.4k",
      price: "Gratuit",
      time: "25m",
    },
  ];
  
  const { user, token, onLogout } = useStateContext();

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
  };
  
  const handleLessonClick = (lessonTitle) => {
    setSelectedTheme(lessonTitle);
  };

  const handleBackToThemes = () => {
    setSelectedTheme(null);
  };

  // Affichage conditionnel en fonction de l'état
  const renderContent = () => {
    if (selectedTheme) {
      // Si un thème est sélectionné, afficher ses contenus
      return (
        <LessonContentView 
          lessonTitle={selectedTheme}
          onBack={handleBackToThemes}
        />
      );
    }

    // Sinon, afficher la grille des thèmes
    return (
      <>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-text">
            <h1>
              Maîtrisez <span>chaque leçon</span>, construisez <span>votre avenir.</span>
            </h1>
            <p>
              "Nos leçons transforment la complexité en simplicité, pour un apprentissage intuitif et engageant."
            </p>
          </div>
          <div className="hero-image">
            <img src="/images/lessons.png" alt="Student" />
          </div>
        </section>

        {/* Lessons Grid */}
        <div className="lessons-grid">
          {lessons.map((lesson, index) => (
            <div 
              key={index} 
              className="lesson-card"
              onClick={() => handleLessonClick(lesson.title)}
              style={{ cursor: 'pointer' }}
            >
              <div className="lesson-time">
                <span className="time-icon">⏰</span> {lesson.time}
              </div>
              <img src={lesson.image} alt={lesson.title} className="lesson-image" />
              <h3>{lesson.title}</h3>
              <div className="lesson-meta">
                <span>{lesson.lessonsCount} Leçons</span>
              </div>
              <div className="lesson-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(lesson.rating) ? "star-filled" : "star-empty"}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {lesson.rating} ({lesson.reviews})
                </span>
              </div>
              <div className="lesson-price">{lesson.price}</div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="access-lesson-container">
      {/* Header */}
      <header className="header">
        <div className="logo gradient-text">FH-LEARN.</div>
        <nav className="nav-links">
          <a href="/">Accueil</a>
          <a href="/access-lesson">Leçons</a>
          <a href="/mes-statistiques">Progression</a>
          <a href="/mes-tests">Mes tests</a>
          <a href="/tous-les-livres">Bibliothèque</a>
        </nav>
        <button 
          className="btn-logout" 
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </header>

      {/* Contenu principal - soit grille des thèmes, soit contenu d'une leçon spécifique */}
      {renderContent()}
    </div>
  );
};

export default AccessLesson;