<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class QuizResultController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Journaliser les données reçues
            Log::info('Données reçues:', $request->all());
            Log::info('Utilisateur connecté:', ['id' => Auth::id()]);
            
            // Validation minimale
            $request->validate([
                'quiz_id' => 'required|numeric',
                'score' => 'required|numeric|min:0|max:100'
            ]);
            
            // Insertion directe avec Query Builder
            $result = DB::table('quiz_results')->insert([
                'user_id' => Auth::id(),
                'quiz_id' => $request->input('quiz_id'),
                'score' => $request->input('score'),
                'completed_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            Log::info('Résultat de l\'insertion:', ['success' => $result]);
            
            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Score enregistré avec succès'
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Échec de l\'enregistrement'
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Erreur dans QuizResultController@store:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false, 
                'message' => 'Erreur lors de l\'enregistrement: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function getUserStats()
    {
        try {
            $userId = Auth::id();
            Log::info('Récupération des statistiques pour l\'utilisateur:', ['id' => $userId]);
            
            // Récupération des résultats
            $results = DB::table('quiz_results as qr')
                ->where('qr.user_id', $userId)
                ->get();
            
            if ($results->isEmpty()) {
                Log::info('Aucun résultat trouvé pour l\'utilisateur');
                return response()->json([
                    'total_quizzes' => 0,
                    'average_score' => 0,
                    'best_score' => 0,
                    'recent_quizzes' => [],
                    'progress_by_theme' => []
                ]);
            }
            
            // Statistiques de base
            $totalQuizzes = $results->count();
            $averageScore = $results->avg('score');
            $bestScore = $results->max('score');
            
            // Quiz récents
            $recentQuizzes = DB::table('quiz_results as qr')
                ->join('quizzes as q', 'qr.quiz_id', '=', 'q.id')
                ->join('lessons as l', 'q.lesson_id', '=', 'l.id')
                ->where('qr.user_id', $userId)
                ->orderBy('qr.completed_at', 'desc')
                ->select(
                    'qr.id',
                    'qr.score',
                    'qr.completed_at',
                    'q.id as quiz_id',
                    'q.title as quiz_title',
                    'l.id as lesson_id',
                    'l.title as lesson_title'
                )
                ->limit(5)
                ->get()
                ->map(function ($result) {
                    return [
                        'id' => $result->id,
                        'score' => $result->score,
                        'completed_at' => $result->completed_at,
                        'quiz' => [
                            'id' => $result->quiz_id,
                            'title' => $result->quiz_title,
                            'lesson' => [
                                'id' => $result->lesson_id,
                                'title' => $result->lesson_title
                            ]
                        ]
                    ];
                });
            
            // Progrès par thème
            $progressByTheme = DB::table('quiz_results as qr')
                ->join('quizzes as q', 'qr.quiz_id', '=', 'q.id')
                ->join('lessons as l', 'q.lesson_id', '=', 'l.id')
                ->where('qr.user_id', $userId)
                ->groupBy('l.id', 'l.title')
                ->select(
                    'l.id as lesson_id',
                    'l.title as lesson_title',
                    DB::raw('MAX(qr.score) as best_score')
                )
                ->get();
            
            return response()->json([
                'total_quizzes' => $totalQuizzes,
                'average_score' => $averageScore,
                'best_score' => $bestScore,
                'recent_quizzes' => $recentQuizzes,
                'progress_by_theme' => $progressByTheme
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur dans QuizResultController@getUserStats:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques: ' . $e->getMessage()
            ], 500);
        }
    }
}