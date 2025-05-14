<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    /**
     * Récupérer tous les quiz
     */
    public function index()
    {
        $quizzes = Quiz::all();
        return response()->json($quizzes);
    }

    /**
     * Récupérer un quiz spécifique avec ses questions et réponses
     */
    public function show($id)
    {
        $quiz = Quiz::with(['questions.answers'])->findOrFail($id);
        return response()->json($quiz);
    }

    /**
     * Récupérer le quiz associé à une leçon spécifique
     * Cette méthode est essentielle pour votre fonctionnalité
     */
   // app/Http/Controllers/QuizController.php
// app/Http/Controllers/QuizController.php
public function getQuizByLesson($lessonId)
{
    // Ajouter des logs pour déboguer
    \Log::info('Recherche de quiz pour leçon: ' . $lessonId);
    
    $quiz = Quiz::with(['questions.answers'])->where('lesson_id', $lessonId)->first();
    
    if (!$quiz) {
        \Log::warning('Aucun quiz trouvé pour la leçon: ' . $lessonId);
        return response()->json(['message' => 'Quiz non trouvé'], 404);
    }
    
    \Log::info('Quiz trouvé: ' . $quiz->id . ', Nombre de questions: ' . $quiz->questions->count());
    
    return response()->json($quiz);
}
    /**
     * Créer un nouveau quiz (pour l'administration)
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'nullable|integer',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.question_type' => 'required|string',
            'questions.*.points' => 'required|integer',
            'questions.*.answers' => 'required|array|min:2',
            'questions.*.answers.*.answer_text' => 'required|string',
            'questions.*.answers.*.is_correct' => 'required|boolean',
        ]);

        // Utiliser une transaction pour s'assurer que tout est enregistré correctement
        return DB::transaction(function () use ($validatedData) {
            // Créer le quiz
            $quiz = Quiz::create([
                'lesson_id' => $validatedData['lesson_id'],
                'title' => $validatedData['title'],
                'description' => $validatedData['description'] ?? null,
                'time_limit' => $validatedData['time_limit'] ?? null,
            ]);

            // Créer les questions avec leurs réponses
            foreach ($validatedData['questions'] as $questionData) {
                $question = Question::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $questionData['question_text'],
                    'question_type' => $questionData['question_type'],
                    'points' => $questionData['points'],
                ]);

                // Créer les réponses pour cette question
                foreach ($questionData['answers'] as $answerData) {
                    Answer::create([
                        'question_id' => $question->id,
                        'answer_text' => $answerData['answer_text'],
                        'is_correct' => $answerData['is_correct'],
                    ]);
                }
            }

            // Retourner le quiz créé avec toutes ses relations
            return response()->json(
                Quiz::with(['questions.answers'])->find($quiz->id), 
                201
            );
        });
    }

    /**
     * Mettre à jour un quiz existant
     */
    public function update(Request $request, $id)
    {
        $quiz = Quiz::findOrFail($id);
        
        $validatedData = $request->validate([
            'lesson_id' => 'sometimes|exists:lessons,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'nullable|integer',
        ]);

        $quiz->update($validatedData);
        return response()->json($quiz);
    }

    /**
     * Supprimer un quiz
     */
    public function destroy($id)
    {
        $quiz = Quiz::findOrFail($id);
        $quiz->delete();
        return response()->json(null, 204);
    }
}