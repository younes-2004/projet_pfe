import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import "../index.css"; // Assurez-vous que le chemin est correct

const Quiz = () => {
  const { lessonTitle } = useParams();
  const navigate = useNavigate();
  const { token } = useStateContext();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

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
    return lessonMap[decodeURIComponent(title)] || 1;
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadQuiz = async () => {
      try {
        setLoading(true);
        const lessonId = getLessonIdFromTitle(lessonTitle);
        console.log("Demande de quiz pour la leçon:", lessonTitle, "avec ID:", lessonId);
        
        const response = await axiosClient.get(`/lessons/${lessonId}/quiz`);
        console.log("Réponse complète:", response);
        
        if (response.data) {
          console.log("Quiz trouvé:", response.data);
          console.log("Présence de questions:", !!response.data.questions);
          if (response.data.questions) {
            console.log("Nombre de questions:", response.data.questions.length);
            if (response.data.questions.length > 0) {
              console.log("Première question:", response.data.questions[0]);
              console.log("Réponses pour la première question:", response.data.questions[0].answers);
              
              // IMPORTANT: Mise à jour de l'état quiz
              setQuiz(response.data);
            } else {
              setError("Ce quiz ne contient pas de questions.");
            }
          } else {
            setError("Structure de quiz invalide.");
          }
        } else {
          setError("Réponse vide de l'API.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du quiz:", error);
        setError(`Impossible de charger le quiz: ${error.message}`);
      } finally {
        // IMPORTANT: Mise à jour de l'état de chargement
        setLoading(false);
      }
    };

    loadQuiz();
  }, [lessonTitle, token, navigate]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId
    });
  };

  const handleNextQuestion = () => {
    if (quiz && quiz.questions && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Fonction pour sauvegarder le score localement en cas d'échec de l'API
  const saveScoreLocally = (quizData, finalScore) => {
    try {
      const savedScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
      const scoreData = {
        quiz_id: quizData.id,
        quiz_title: quizData.title,
        score: finalScore,
        date: new Date().toISOString()
      };
      savedScores.push(scoreData);
      localStorage.setItem('quizScores', JSON.stringify(savedScores));
      console.log("Score sauvegardé localement:", scoreData);
      return true;
    } catch (e) {
      console.error("Erreur lors de la sauvegarde locale:", e);
      return false;
    }
  };

  // Modifiez la partie handleSubmitQuiz du composant Quiz
 // Dans la fonction handleSubmitQuiz du composant Quiz.jsx
const handleSubmitQuiz = async () => {
    if (!quiz || !quiz.questions) return;
    
    setIsSubmitting(true);
    setSaveError(null);
  
    // Calculer le score
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      const correctAnswer = question.answers.find(a => a.is_correct);
      if (correctAnswer && selectedAnswers[question.id] === correctAnswer.id) {
        correctAnswers++;
      }
    });
  
    const finalScore = (correctAnswers / quiz.questions.length) * 100;
    
    // Envoyer le score au backend
    try {
      console.log("Envoi du score au backend:", {
        quiz_id: quiz.id,
        score: finalScore
      });
      
      const response = await axiosClient.post('/quiz-results', {
        quiz_id: quiz.id,
        score: finalScore
      });
      
      console.log("Réponse de l'API:", response.data);
      setScoreSaved(true);
      // Dans handleSubmitQuiz du composant Quiz.jsx, après setScoreSaved(true)
// Vérifier si l'utilisateur a débloqué une médaille
const checkAchievements = (response) => {
    const achievements = [];
    
    // Premier quiz complété
    if (response.data.total_quizzes === 1) {
      achievements.push({
        title: "Premier pas",
        description: "Vous avez complété votre premier quiz !",
        icon: "🎯"
      });
    }
    
    // Score excellent
    if (finalScore >= 80) {
      achievements.push({
        title: "Excellent",
        description: "Vous avez obtenu un score supérieur à 80% !",
        icon: "🌟"
      });
    }
    
    // Afficher les médailles débloquées
    if (achievements.length > 0) {
      setUnlockedAchievements(achievements);
    }
  };
  
  // Optionnellement, ajouter à la réponse de l'API
  if (response.data && response.data.new_achievements) {
    setUnlockedAchievements(response.data.new_achievements);
  }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du score:", error);
      if (error.response) {
        console.error("Statut de l'erreur:", error.response.status);
        console.error("Données d'erreur:", error.response.data);
      }
      setSaveError("Impossible d'enregistrer votre score dans la base de données.");
    } finally {
      // Toujours afficher le résultat
      setScore(finalScore);
      setQuizCompleted(true);
      setIsSubmitting(false);
    }
    // Dans handleSubmitQuiz du composant Quiz.jsx, après setScoreSaved(true)
// Vérifier si l'utilisateur a débloqué une médaille
const checkAchievements = (response) => {
  const achievements = [];
  
  // Premier quiz complété
  if (response.data.total_quizzes === 1) {
    achievements.push({
      title: "Premier pas",
      description: "Vous avez complété votre premier quiz !",
      icon: "🎯"
    });
  }
  
  // Score excellent
  if (finalScore >= 80) {
    achievements.push({
      title: "Excellent",
      description: "Vous avez obtenu un score supérieur à 80% !",
      icon: "🌟"
    });
  }
  
  // Afficher les médailles débloquées
  if (achievements.length > 0) {
    setUnlockedAchievements(achievements);
  }
};

// Optionnellement, ajouter à la réponse de l'API
if (response.data && response.data.new_achievements) {
  setUnlockedAchievements(response.data.new_achievements);
}
  };

  // Logs de débogage pour mieux comprendre l'état
  console.log("État actuel:", { loading, error, quiz, currentQuestion, selectedAnswers });

  if (loading) {
    return <div className="quiz-loading">Chargement du quiz...</div>;
  }

  if (error) {
    return (
      <div className="quiz-error">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button className="btn-return" onClick={() => navigate('/access-lesson')}>
          Retour aux leçons
        </button>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="quiz-error">
        <h2>Quiz non disponible</h2>
        <p>Ce quiz ne contient pas de questions ou n'est pas disponible pour le moment.</p>
        <button className="btn-return" onClick={() => navigate('/access-lesson')}>
          Retour aux leçons
        </button>
      </div>
    );
  }

  // Dans la section quizCompleted du composant Quiz.jsx
if (quizCompleted) {
    return (
      <div className="quiz-results">
        <h2>Quiz terminé !</h2>
        <div className="score-display">
          <h3>Votre score: {score.toFixed(0)}%</h3>
          <p>Vous avez obtenu {Math.round(score * quiz.questions.length / 100)} réponses correctes sur {quiz.questions.length} questions.</p>
          {scoreSaved && <p className="score-saved">✅ Votre score a été enregistré avec succès.</p>}
          {saveError && <p className="score-error">⚠️ {saveError}</p>}
        </div>
        
        <div className="quiz-feedback">
          {score >= 80 && (
            <div className="feedback excellent">
              <h4>Excellent !</h4>
              <p>Vous maîtrisez très bien ce sujet. Continuez comme ça !</p>
            </div>
          )}
          {score >= 60 && score < 80 && (
            <div className="feedback good">
              <h4>Bon travail !</h4>
              <p>Vous avez de bonnes connaissances sur ce sujet, mais il y a encore place à l'amélioration.</p>
            </div>
          )}
          {score >= 40 && score < 60 && (
            <div className="feedback average">
              <h4>Pas mal !</h4>
              <p>Vous avez des connaissances de base sur ce sujet. Continuez à pratiquer pour progresser.</p>
            </div>
          )}
          {score < 40 && (
            <div className="feedback needs-improvement">
              <h4>À améliorer</h4>
              <p>Ce sujet semble difficile pour vous. Nous vous recommandons de revoir la leçon.</p>
            </div>
          )}
        </div>
        
        <div className="result-buttons">
          <button className="btn-retry" onClick={() => {
            setQuizCompleted(false);
            setCurrentQuestion(0);
            setSelectedAnswers({});
            setScore(0);
          }}>
            Réessayer ce quiz
          </button>
          <button className="btn-stats" onClick={() => navigate('/mes-statistiques')}>
            Voir mes statistiques
          </button>
          <button className="btn-return" onClick={() => navigate('/access-lesson')}>
            Retour aux leçons
          </button>
        </div>
      </div>
    );
  }
  const question = quiz.questions[currentQuestion];
  
  // Vérification supplémentaire pour éviter l'erreur
  if (!question) {
    return (
      <div className="quiz-error">
        <h2>Erreur</h2>
        <p>Question non trouvée.</p>
        <button className="btn-return" onClick={() => navigate('/access-lesson')}>
          Retour aux leçons
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1>{quiz.title}</h1>
        <div className="quiz-progress">
          Question {currentQuestion + 1} / {quiz.questions.length}
        </div>
      </header>

      <div className="question-container">
        <h2>{question.question_text}</h2>
        
        <div className="answers-list">
          {question.answers && question.answers.map(answer => (
            <div
              key={answer.id}
              className={`answer-option ${selectedAnswers[question.id] === answer.id ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(question.id, answer.id)}
            >
              {answer.answer_text}
            </div>
          ))}
        </div>

        <div className="navigation-buttons">
          {currentQuestion > 0 && (
            <button className="btn-prev" onClick={handlePrevQuestion}>
              Question précédente
            </button>
          )}
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <button 
              className="btn-next" 
              onClick={handleNextQuestion}
              disabled={!selectedAnswers[question.id]}
            >
              Question suivante
            </button>
          ) : (
            <button 
              className="btn-submit" 
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || Object.keys(selectedAnswers).length !== quiz.questions.length}
            >
              Terminer le quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;