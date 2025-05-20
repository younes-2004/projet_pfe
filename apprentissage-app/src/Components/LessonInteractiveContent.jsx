import React, { useState } from 'react';

const LessonInteractiveContent = ({ content }) => {
  // État pour les exercices de type "trou à combler"
  const [fillInBlanks, setFillInBlanks] = useState({});
  const [fillInBlanksChecked, setFillInBlanksChecked] = useState(false);
  
  // État pour les quiz
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizChecked, setQuizChecked] = useState(false);
  
  // État pour la prononciation
  const [playingAudio, setPlayingAudio] = useState(null);
  
  // Composant pour les mots de vocabulaire
  const VocabularyItem = ({ term, definition, pronunciation }) => {
    const handlePlay = () => {
      if (playingAudio) {
        playingAudio.pause();
        if (playingAudio.src === pronunciation) {
          setPlayingAudio(null);
          return;
        }
      }
      
      const audio = new Audio(pronunciation);
      audio.play();
      audio.onended = () => setPlayingAudio(null);
      setPlayingAudio(audio);
    };
    
    return (
      <div className="vocabulary-item">
        <div className="term">
          {term}
          {pronunciation && (
            <button 
              className="pronunciation-button" 
              onClick={handlePlay}
              title="Écouter la prononciation"
            >
              🔊
            </button>
          )}
        </div>
        <div className="definition">{definition}</div>
      </div>
    );
  };
  
  // Composant pour les exercices de type "trou à combler"
  const FillInBlankExercise = ({ id, text, answer }) => {
    const handleChange = (e) => {
      setFillInBlanks({
        ...fillInBlanks,
        [id]: e.target.value
      });
    };
    
    const isCorrect = fillInBlanksChecked && fillInBlanks[id]?.toLowerCase() === answer.toLowerCase();
    const isWrong = fillInBlanksChecked && fillInBlanks[id] && !isCorrect;
    
    return (
      <div className="fill-in-blank-exercise">
        {text}
        <input 
          type="text" 
          value={fillInBlanks[id] || ''}
          onChange={handleChange}
          className={`fill-in-blank-input ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
        />
        {fillInBlanksChecked && (
          isCorrect ? (
            <span className="feedback correct">✓ Correct</span>
          ) : (
            isWrong && <span className="feedback wrong">✗ Incorrect. La réponse correcte est: {answer}</span>
          )
        )}
      </div>
    );
  };
  
  // Composant pour les quiz
  const QuizQuestion = ({ id, question, options, correctAnswer }) => {
    const handleSelectAnswer = (optionId) => {
      setQuizAnswers({
        ...quizAnswers,
        [id]: optionId
      });
    };
    
    return (
      <div className="quiz-question">
        <h4>{question}</h4>
        <div className="quiz-options">
          {options.map((option) => (
            <div 
              key={option.id} 
              className={`quiz-option ${quizAnswers[id] === option.id ? 'selected' : ''} ${
                quizChecked ? (
                  option.id === correctAnswer ? 'correct' : 
                  quizAnswers[id] === option.id && option.id !== correctAnswer ? 'wrong' : ''
                ) : ''
              }`}
              onClick={() => !quizChecked && handleSelectAnswer(option.id)}
            >
              {option.text}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Exemple de données pour un quiz
  const sampleQuiz = {
    id: 'quiz1',
    questions: [
      {
        id: 'q1',
        question: 'Comment dit-on "Bonjour" en français?',
        options: [
          { id: 'a', text: 'Hello' },
          { id: 'b', text: 'Bonjour' },
          { id: 'c', text: 'Ciao' },
          { id: 'd', text: 'Hola' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 'q2',
        question: 'Quelle est la bonne façon de demander le prix en français?',
        options: [
          { id: 'a', text: 'How much is it?' },
          { id: 'b', text: 'Quanto costa?' },
          { id: 'c', text: 'C\'est combien?' },
          { id: 'd', text: '¿Cuánto cuesta?' }
        ],
        correctAnswer: 'c'
      }
    ]
  };
  
  // Exemple de données pour des exercices "trou à combler"
  const fillInBlankExercises = [
    {
      id: 'ex1',
      text: 'Je m\'appelle Pierre et j\'ai ',
      answer: 'vingt-cinq'
    },
    {
      id: 'ex2',
      text: 'Nous habitons à ',
      answer: 'Paris'
    }
  ];
  
  // Calcul des scores pour le quiz
  const calculateQuizScore = () => {
    let correctCount = 0;
    sampleQuiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    return {
      score: correctCount,
      total: sampleQuiz.questions.length,
      percentage: Math.round((correctCount / sampleQuiz.questions.length) * 100)
    };
  };
  
  const handleCheckQuiz = () => {
    setQuizChecked(true);
  };
  
  const handleCheckFillInBlanks = () => {
    setFillInBlanksChecked(true);
  };
  
  // Exemple de contenu formaté en HTML
  const lessonContent = content || `
    <h3>Introduction à la langue française</h3>
    <p>Dans cette leçon, nous allons apprendre les bases pour se présenter en français.</p>
    
    <h3>Se présenter</h3>
    <p>Pour se présenter en français, on peut utiliser les expressions suivantes:</p>
    <ul>
      <li>"Je m'appelle..." (Je m'appelle Marie)</li>
      <li>"J'ai ... ans" (J'ai 25 ans)</li>
      <li>"Je suis de..." (Je suis de France)</li>
      <li>"J'habite à..." (J'habite à Paris)</li>
    </ul>
    
    <p>Écoutez l'audio suivant pour entendre la prononciation correcte:</p>
  `;
  
  return (
    <div className="lesson-interactive-content">
      {/* Contenu HTML de la leçon */}
      <div dangerouslySetInnerHTML={{ __html: lessonContent }} />
      
      {/* Section de vocabulaire */}
      <h3>Vocabulaire clé</h3>
      <div className="vocabulary-section">
        <VocabularyItem 
          term="Bonjour" 
          definition="Salutation utilisée pendant la journée" 
          pronunciation="/audio/bonjour.mp3" 
        />
        <VocabularyItem 
          term="Je m'appelle" 
          definition="Expression utilisée pour dire son nom" 
          pronunciation="/audio/je-mappelle.mp3" 
        />
        <VocabularyItem 
          term="Enchanté(e)" 
          definition="Expression utilisée quand on rencontre quelqu'un pour la première fois" 
          pronunciation="/audio/enchante.mp3" 
        />
      </div>
      
      {/* Exercices de type "trou à combler" */}
      <h3>Exercices: Complétez les phrases</h3>
      <div className="fill-in-blank-section">
        {fillInBlankExercises.map((exercise) => (
          <FillInBlankExercise 
            key={exercise.id}
            id={exercise.id}
            text={exercise.text}
            answer={exercise.answer}
          />
        ))}
        
        {!fillInBlanksChecked && (
          <button 
            className="btn-check" 
            onClick={handleCheckFillInBlanks}
          >
            Vérifier mes réponses
          </button>
        )}
      </div>
      
      {/* Section de quiz */}
      <div className="lesson-quiz-section">
        <h3>Quiz: Testons vos connaissances</h3>
        
        {sampleQuiz.questions.map((question) => (
          <QuizQuestion 
            key={question.id}
            id={question.id}
            question={question.question}
            options={question.options}
            correctAnswer={question.correctAnswer}
          />
        ))}
        
        {!quizChecked ? (
          <button 
            className="btn-check-quiz" 
            onClick={handleCheckQuiz}
            disabled={Object.keys(quizAnswers).length !== sampleQuiz.questions.length}
          >
            Vérifier mes réponses
          </button>
        ) : (
          <div className="quiz-result">
            <h4>Résultat</h4>
            <p>Vous avez obtenu {calculateQuizScore().score} sur {calculateQuizScore().total} ({calculateQuizScore().percentage}%)</p>
            <div className="lesson-progress-bar">
              <div 
                className="lesson-progress-value" 
                style={{ width: `${calculateQuizScore().percentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonInteractiveContent;