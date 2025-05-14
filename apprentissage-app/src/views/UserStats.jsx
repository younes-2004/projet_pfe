import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/contextprovider";
import { 
  FaTrophy, 
  FaStar, 
  FaChartLine, 
  FaHistory, 
  FaGraduationCap, 
  FaSync 
} from "react-icons/fa";
import axiosClient from "../axiosClient";
import "../index.css";

const UserStats = () => {
  console.log("Initialisation du composant UserStats");
  const navigate = useNavigate();
  const { token } = useStateContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [debug, setDebug] = useState(false); // Activer/désactiver le mode débogage

  // Données de secours en cas de problème avec l'API
  const fallbackStats = {
    total_quizzes: 0,
    average_score: 0,
    best_score: 0,
    recent_quizzes: [],
    progress_by_theme: []
  };

  const loadStats = async () => {
    console.log("Démarrage de loadStats");
    try {
      setLoading(true);
      
      // Récupérer les statistiques depuis l'API
      console.log("Appel à l'API /user-stats");
      const response = await axiosClient.get('/user-stats');
      console.log("Statistiques récupérées:", response.data);
      
      // Analyser et transformer les données si nécessaire
      const apiData = response.data;
      console.log("Type des données:", typeof apiData);
      
      // Vérifier la structure des données
      if (!apiData) {
        console.warn("Les données de l'API sont nulles ou indéfinies");
        setStats(fallbackStats);
        return;
      }
      
      // Normaliser les données pour s'assurer qu'elles ont la structure attendue
      const formattedStats = {
        total_quizzes: Number(apiData.total_quizzes || 0),
        average_score: Number(apiData.average_score || 0),
        best_score: Number(apiData.best_score || 0),
        recent_quizzes: Array.isArray(apiData.recent_quizzes) 
          ? apiData.recent_quizzes.map(quiz => ({
              id: quiz.id || Date.now(),
              score: Number(quiz.score || 0),
              completed_at: quiz.completed_at || new Date().toISOString(),
              quiz: {
                title: quiz.quiz?.title || "Quiz",
                lesson: {
                  title: quiz.quiz?.lesson?.title || "Leçon"
                }
              }
            }))
          : [],
        progress_by_theme: Array.isArray(apiData.progress_by_theme)
          ? apiData.progress_by_theme.map(theme => ({
              lesson_id: theme.lesson_id || Date.now(),
              lesson_title: theme.lesson_title || "Leçon",
              best_score: Number(theme.best_score || 0)
            }))
          : []
      };
      
      console.log("Données formatées:", formattedStats);
      setStats(formattedStats);
      setError(null);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      
      if (error.response) {
        console.error("Réponse d'erreur:", error.response.data);
        setError(`Erreur ${error.response.status}: ${error.response.data.message || 'Erreur de serveur'}`);
      } else if (error.request) {
        console.error("Requête sans réponse:", error.request);
        setError("Le serveur n'a pas répondu à votre requête");
      } else {
        console.error("Erreur:", error.message);
        setError(`Erreur: ${error.message}`);
      }
      
      // En cas d'erreur, utiliser les données de secours
      setStats(fallbackStats);
    } finally {
      console.log("Fin de loadStats");
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("useEffect exécuté, token présent:", !!token);
    
    if (!token) {
      console.log("Pas de token, redirection vers login");
      navigate('/login');
      return;
    }

    console.log("Appel de loadStats");
    loadStats();
  }, [token, navigate]);

  // Fonction pour rafraîchir manuellement les statistiques
  const refreshStats = () => {
    console.log("Rafraîchissement des statistiques");
    setRefreshing(true);
    loadStats();
  };
  
  // Fonction pour activer/désactiver le mode débogage
  const toggleDebug = () => {
    setDebug(!debug);
  };

  console.log("Avant les conditions de rendu:", { loading, error, stats });

  // Fonction utilitaire pour définir la classe de couleur du score
  const getScoreClass = (score) => {
    if (score >= 80) return "score-excellent";
    if (score >= 60) return "score-good";
    if (score >= 40) return "score-average";
    return "score-poor";
  };

  // Afficher l'écran de chargement
  if (loading && !refreshing) {
    console.log("Affichage de l'écran de chargement");
    return <div className="stats-loading">Chargement de vos statistiques...</div>;
  }

  // Version simple pour le débogage
  if (debug) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8f9fa" }}>
        <button onClick={refreshStats} style={{ marginLeft: "1rem" }}>Rafraîchir</button>
        
        <div style={{ marginTop: "2rem" }}>
          <h2>État du composant</h2>
          <pre style={{ backgroundColor: "white", padding: "1rem", borderRadius: "5px", overflow: "auto" }}>
            {JSON.stringify({ loading, error, stats: stats || "null" }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  // Version principale du composant
  return (
    <div className="stats-container">
      <header className="stats-header">
        <h1>Tableau de bord</h1>
        <p>Suivez votre progression et vos performances</p>
        <div className="header-actions">
          <button 
            className={`btn-refresh ${refreshing ? 'refreshing' : ''}`} 
            onClick={refreshStats}
            disabled={refreshing}
          >
            <FaSync className={refreshing ? 'spin' : ''} /> 
            {refreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
          </button>
         
        </div>
      </header>

      {error && (
        <div className="stats-warning">
          <p>{error}</p>
          <button className="btn-retry small" onClick={refreshStats}>
            Réessayer
          </button>
        </div>
      )}

      {/* Cartes de statistiques principales */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FaTrophy />
          </div>
          <div className="stat-content">
            <h3>Quiz complétés</h3>
            <p className="stat-value">
              {stats && stats.total_quizzes !== undefined ? stats.total_quizzes : '0'}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-content">
            <h3>Score moyen</h3>
            <p className="stat-value">
              {stats && stats.average_score !== undefined 
                ? `${Number(stats.average_score).toFixed(1)}%` 
                : '0%'}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Meilleur score</h3>
            <p className="stat-value">
              {stats && stats.best_score !== undefined 
                ? `${Number(stats.best_score).toFixed(0)}%` 
                : '0%'}
            </p>
          </div>
        </div>
      </div>
     
<section className="progress-overview">
  <h2>Progression globale</h2>
  <div className="global-progress">
    <div className="progress-ring-container">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle 
          className="progress-ring-circle-bg" 
          cx="75" 
          cy="75" 
          r="65" 
          strokeWidth="10"
        />
        <circle 
          className="progress-ring-circle" 
          cx="75" 
          cy="75" 
          r="65" 
          strokeWidth="10"
          strokeDasharray={`${2 * Math.PI * 65}`}
          strokeDashoffset={`${2 * Math.PI * 65 * (1 - (stats.total_quizzes / 6))}`}
        />
      </svg>
      <div className="progress-text">
        <span className="progress-percentage">{Math.round((stats.total_quizzes / 6) * 100)}%</span>
        <span className="progress-label">Complété</span>
      </div>
    </div>
    <div className="progress-details">
      <p>Vous avez complété <strong>{stats.total_quizzes}</strong> quiz sur <strong>6</strong> thèmes disponibles.</p>
      <p>Continuez à apprendre pour améliorer vos compétences !</p>
      <button className="btn-primary" onClick={() => navigate('/access-lesson')}>
        Continuer l'apprentissage
      </button>
    </div>
  </div>
</section>

{stats && stats.total_quizzes > 0 && (
  <section className="achievements-section">
    <h2>
      <FaTrophy /> Récompenses
    </h2>
    <div className="achievements-grid">
      <div className={`achievement ${stats.total_quizzes >= 1 ? 'unlocked' : 'locked'}`}>
        <div className="achievement-icon">🎯</div>
        <div className="achievement-details">
          <h3>Premier pas</h3>
          <p>Complétez votre premier quiz</p>
        </div>
      </div>
      
      <div className={`achievement ${stats.best_score >= 80 ? 'unlocked' : 'locked'}`}>
        <div className="achievement-icon">🌟</div>
        <div className="achievement-details">
          <h3>Excellent</h3>
          <p>Obtenez un score supérieur à 80%</p>
        </div>
      </div>
      
      <div className={`achievement ${stats.total_quizzes >= 3 ? 'unlocked' : 'locked'}`}>
        <div className="achievement-icon">🔄</div>
        <div className="achievement-details">
          <h3>Persévérance</h3>
          <p>Complétez 3 quiz ou plus</p>
        </div>
      </div>
      
      <div className={`achievement ${stats.progress_by_theme.length >= 3 ? 'unlocked' : 'locked'}`}>
        <div className="achievement-icon">🌍</div>
        <div className="achievement-details">
          <h3>Explorateur</h3>
          <p>Essayez au moins 3 thèmes différents</p>
        </div>
      </div>
      
      <div className={`achievement ${stats.total_quizzes >= 6 ? 'unlocked' : 'locked'}`}>
        <div className="achievement-icon">🏆</div>
        <div className="achievement-details">
          <h3>Maître</h3>
          <p>Complétez tous les quiz disponibles</p>
        </div>
      </div>
    </div>
  </section>
)}

      {/* Progrès par thème */}
      {stats && stats.progress_by_theme && stats.progress_by_theme.length > 0 && (
        <section className="progress-section">
          <h2>
            <FaGraduationCap /> Progrès par thème
          </h2>
          <div className="progress-bars">
            {stats.progress_by_theme.map((item) => (
              <div key={item.lesson_id} className="progress-item">
                <div className="progress-info">
                  <span className="progress-title">{item.lesson_title}</span>
                  <span className="progress-percentage">{Number(item.best_score).toFixed(0)}%</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${item.best_score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quiz récents */}
      {stats && stats.recent_quizzes && stats.recent_quizzes.length > 0 ? (
        <section className="recent-quiz-section">
          <h2>
            <FaHistory /> Quiz récents
          </h2>
          <div className="recent-quiz-list">
            {stats.recent_quizzes.map((result) => (
              <div key={result.id} className="recent-quiz-item">
                <div className="quiz-info">
                  <h3>{result.quiz?.title || "Quiz"}</h3>
                  <p>Thème: {result.quiz?.lesson?.title || "Leçon"}</p>
                  <p className="quiz-date">
                    {new Date(result.completed_at).toLocaleDateString()} à{" "}
                    {new Date(result.completed_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="quiz-score">
                  <div className={`score-circle ${getScoreClass(Number(result.score))}`}>
                    {Number(result.score).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="empty-section">
          <h2>
            <FaHistory /> Quiz récents
          </h2>
          <p>Vous n'avez pas encore complété de quiz.</p>
        </section>
      )}

      <div className="stats-footer">
        <button className="btn-return" onClick={() => navigate('/access-lesson')}>
          Retour aux leçons
        </button>
      </div>
    </div>
  );
};

export default UserStats;