import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function QuizView() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]); // Initialisé avec tableau vide
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/quizzes/${quizId}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        setQuiz(data.quiz);
        setQuestions(data.questions || []); // Fallback sur tableau vide
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!quiz) return <div>Quiz non trouvé</div>;

  return (
    <div className="quiz-container">
      <h2>{quiz.titre}</h2>
      
      {/* Solution protégée contre undefined */}
      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question.id} className="question-card">
            <h3>{question.contenu}</h3>
            <div className="answers">
              {question.reponses?.map((reponse) => (
                <label key={reponse.id}>
                  <input 
                    type="radio" 
                    name={`question_${question.id}`} 
                    value={reponse.id} 
                  />
                  {reponse.contenu}
                </label>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Aucune question disponible pour ce quiz</p>
      )}
    </div>
  );
}