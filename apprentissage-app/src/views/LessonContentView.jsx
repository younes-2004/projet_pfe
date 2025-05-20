import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import "../index.css";

const LessonContentView = ({ lessonTitle, onBack }) => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [userLevel, setUserLevel] = useState("Débutant");
  const { token, user } = useStateContext();
  const navigate = useNavigate();

  // Fonction pour associer titre à ID
  const getLessonIdFromTitle = (title) => {
    const lessonMap = {
      "Faire connaissance": 8,
      "Faire des achats": 2,
      "Parler de la météo": 3,
      "Préparer un voyage": 4,
      "Réserver une activité touristique": 5,
      "Parlez des événements Urgent": 6
    };
    return lessonMap[title] || 8;
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    // Récupérer les informations de l'utilisateur, y compris son niveau
    const getUserInfo = async () => {
      try {
        const response = await axiosClient.get('/user');
        if (response.data && response.data.niveauchoisi) {
          setUserLevel(response.data.niveauchoisi);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des infos utilisateur:", error);
        // Ne pas afficher d'erreur, utiliser le niveau par défaut
      }
    };

    const loadLessonContents = async () => {
      try {
        setLoading(true);
        const lessonId = getLessonIdFromTitle(lessonTitle);
        
        // Charger les contenus depuis l'API
        const response = await axiosClient.get(`/lessons/${lessonId}/contents`);
        
        if (response.data && response.data.length > 0) {
          setContents(response.data);
          setActiveContent(response.data[0]); // Sélectionner la première leçon par défaut
        } else {
          setError("Aucun contenu trouvé pour cette leçon.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des contenus:", error);
        setError(`Impossible de charger les contenus: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Charger les informations utilisateur et les contenus de leçon
    getUserInfo();
    loadLessonContents();
  }, [lessonTitle, token]);

  const handleSelectContent = (content) => {
    setActiveContent(content);
    // Vous pourriez ajouter ici une requête pour marquer la leçon comme vue
  };

  // Fonction pour rediriger vers le test
  const handleGoToTest = () => {
    navigate(`/mes-tests`);
  };

  if (loading) {
    return <div className="lesson-content-loading">Chargement du contenu...</div>;
  }

  if (error) {
    return (
      <div className="lesson-content-error">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button className="btn-return" onClick={onBack}>
          Retour aux thèmes
        </button>
      </div>
    );
  }

  // Vérifier si l'utilisateur est à la dernière leçon
  const isLastLesson = activeContent && 
    contents.findIndex(c => c.id === activeContent.id) === contents.length - 1;

  return (
    <div className="lesson-content-container" style={{ paddingTop: "80px" }}>
      <div className="lesson-content-header">
        <button className="btn-back" onClick={onBack}>
          &larr; Retour aux thèmes
        </button>
        <h1>{lessonTitle}</h1>
        
        {/* Affichage du niveau de l'utilisateur */}
        <div className="user-level-badge">
          Niveau: <span>{userLevel}</span>
        </div>
      </div>

      <div className="lesson-content-main">
        <div className="lesson-sidebar">
          <h3>Contenu du cours</h3>
          <ul className="lesson-list">
            {contents.map((content) => (
              <li 
                key={content.id} 
                className={`lesson-item ${activeContent && activeContent.id === content.id ? 'active' : ''}`}
                onClick={() => handleSelectContent(content)}
              >
                <div className="lesson-item-number">{content.order}</div>
                <div className="lesson-item-details">
                  <h4>{content.title}</h4>
                  <div className="lesson-item-meta">
                    <span className="difficulty">{content.difficulty}</span>
                    {content.duration && <span className="duration">{content.duration} min</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lesson-content-display">
          {activeContent ? (
            <>
              <div className="lesson-content-header">
                <h2>{activeContent.title}</h2>
                <div className="lesson-content-meta">
                  <span className="difficulty">{activeContent.difficulty}</span>
                  {activeContent.duration && <span className="duration">{activeContent.duration} min</span>}
                </div>
              </div>

              {activeContent.image_url && (
                <div className="lesson-image">
                  <img src={activeContent.image_url} alt={activeContent.title} />
                </div>
              )}

              {activeContent.video_url && (
                <div className="lesson-video">
                  <iframe 
                    src={activeContent.video_url} 
                    title={activeContent.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {activeContent.audio_url && (
                <div className="lesson-audio">
                  <audio controls>
                    <source src={activeContent.audio_url} type="audio/mpeg" />
                    Votre navigateur ne supporte pas la lecture audio.
                  </audio>
                </div>
              )}

              {/* Contenu simple en HTML */}
              <div className="lesson-text-content" dangerouslySetInnerHTML={{ __html: activeContent.content }}></div>

              <div className="lesson-navigation">
                {contents.findIndex(c => c.id === activeContent.id) > 0 && (
                  <button 
                    className="btn-prev"
                    onClick={() => {
                      const currentIndex = contents.findIndex(c => c.id === activeContent.id);
                      if (currentIndex > 0) {
                        setActiveContent(contents[currentIndex - 1]);
                      }
                    }}
                  >
                    &larr; Leçon précédente
                  </button>
                )}
                
                {!isLastLesson ? (
                  <button 
                    className="btn-next"
                    onClick={() => {
                      const currentIndex = contents.findIndex(c => c.id === activeContent.id);
                      if (currentIndex < contents.length - 1) {
                        setActiveContent(contents[currentIndex + 1]);
                      }
                    }}
                  >
                    Leçon suivante &rarr;
                  </button>
                ) : (
                  <button 
                    className="btn-test"
                    onClick={handleGoToTest}
                  >
                    Passer au test
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="no-content-selected">
              <p>Sélectionnez une leçon pour commencer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonContentView;