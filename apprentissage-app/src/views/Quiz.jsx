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

  const handleSubmitQuiz = async () => {
    if (!quiz || !quiz.questions) return;
    
    setIsSubmitting(true);

    // Calculer le score
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      const correctAnswer = question.answers.find(a => a.is_correct);
      if (correctAnswer && selectedAnswers[question.id] === correctAnswer.id) {
        correctAnswers++;
      }
    });

    const finalScore = (correctAnswers / quiz.questions.length) * 100;
    setScore(finalScore);
    setQuizCompleted(true);
    setIsSubmitting(false);
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

  if (quizCompleted) {
    return (
      <div className="quiz-results">
        <h2>Quiz terminé !</h2>
        <div className="score-display">
          <h3>Votre score: {score.toFixed(0)}%</h3>
          <p>Vous avez obtenu {Math.round(score * quiz.questions.length / 100)} réponses correctes sur {quiz.questions.length} questions.</p>
        </div>
        <button className="btn-return" onClick={() => navigate('/access-lesson')}>
          Retour aux leçons
        </button>
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