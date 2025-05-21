<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Lesson;
use App\Models\QuizResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    /**
     * Récupère les statistiques pour le tableau de bord administrateur
     * 
     * @return \Illuminate\Http\JsonResponse
     */
/**
 * Récupère les statistiques pour le tableau de bord administrateur
 * 
 * @return \Illuminate\Http\JsonResponse
 */
public function getDashboardStats()
{
    try {
        // Initialize return data
        $data = [];
        
        // 1. Total users
        $data['totalUsers'] = User::count();
        
        try {
            // 2. Active users
            $data['activeUsers'] = User::whereHas('quizResults')->count();
        } catch (\Exception $e) {
            \Log::error('Error in activeUsers: ' . $e->getMessage());
            $data['activeUsers'] = 0;
        }
        
        try {
            // 3. Language preferences distribution
            $languageStats = User::whereNotNull('languechoisie')
                ->select('languechoisie', DB::raw('count(*) as total'))
                ->groupBy('languechoisie')
                ->orderByDesc('total')
                ->get();
            
            // Si aucune langue n'est trouvée, retourner des langues par défaut
            if ($languageStats->isEmpty()) {
                $languageStats = collect([
                    ['languechoisie' => 'Français', 'total' => 0],
                    ['languechoisie' => 'Anglais', 'total' => 0],
                    ['languechoisie' => 'Espagnol', 'total' => 0]
                ]);
            }
            
            $data['languageStats'] = $languageStats;
        } catch (\Exception $e) {
            \Log::error('Error in languageStats: ' . $e->getMessage());
            $data['languageStats'] = [];
        }
        
        try {
            // 4. Level preferences distribution
            $levelStats = User::whereNotNull('niveauchoisie')
                ->select('niveauchoisie', DB::raw('count(*) as total'))
                ->groupBy('niveauchoisie')
                ->orderByDesc('total')
                ->get();
            
            // Si aucun niveau n'est trouvé, retourner des niveaux par défaut
            if ($levelStats->isEmpty()) {
                $levelStats = collect([
                    ['niveauchoisie' => 'Débutant', 'total' => 0],
                    ['niveauchoisie' => 'Intermédiaire', 'total' => 0],
                    ['niveauchoisie' => 'Avancé', 'total' => 0]
                ]);
            }
            
            $data['levelStats'] = $levelStats;
        } catch (\Exception $e) {
            \Log::error('Error in levelStats: ' . $e->getMessage());
            $data['levelStats'] = [];
        }
        
        try {
            // 5. Most popular lessons/themes
            $popularLessons = Lesson::withCount('quizzes')
                ->orderBy('id')
                ->take(10)
                ->get();
            
            $data['popularLessons'] = $popularLessons;
        } catch (\Exception $e) {
            \Log::error('Error in popularLessons: ' . $e->getMessage());
            $data['popularLessons'] = [];
        }
        
        try {
            // 6. Average quiz score by lesson
            // Récupérer d'abord toutes les leçons
            $lessons = Lesson::select('id', 'title')->get();
            
            // Puis récupérer les scores moyens si disponibles
            $lessonScores = [];
            foreach ($lessons as $lesson) {
                // Tenter de récupérer le score moyen pour cette leçon
                $averageScore = 0;
                $attemptsCount = 0;
                
                try {
                    $result = DB::table('quizzes')
                        ->join('quiz_results', 'quizzes.id', '=', 'quiz_results.quiz_id')
                        ->where('quizzes.lesson_id', $lesson->id)
                        ->select(
                            DB::raw('AVG(quiz_results.score) as average_score'),
                            DB::raw('COUNT(quiz_results.id) as attempts_count')
                        )
                        ->first();
                    
                    if ($result) {
                        $averageScore = $result->average_score ?: 0;
                        $attemptsCount = $result->attempts_count ?: 0;
                    }
                } catch (\Exception $e) {
                    // Ignorer les erreurs et utiliser les valeurs par défaut
                }
                
                $lessonScores[] = [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'average_score' => $averageScore,
                    'attempts_count' => $attemptsCount
                ];
            }
            
            $data['lessonScores'] = $lessonScores;
        } catch (\Exception $e) {
            \Log::error('Error in lessonScores: ' . $e->getMessage());
            $data['lessonScores'] = [];
        }
        
        try {
            // 7. Recent quiz activity (last 30 days)
            $recentActivity = QuizResult::select(DB::raw('DATE(completed_at) as date'), 
                    DB::raw('COUNT(*) as count'))
                ->whereNotNull('completed_at')
                ->where('completed_at', '>=', now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
            
            // Si aucune activité récente, créer des données vides pour le graphique
            if ($recentActivity->isEmpty()) {
                $dates = [];
                for ($i = 0; $i < 7; $i++) {
                    $date = now()->subDays($i)->toDateString();
                    $dates[] = ['date' => $date, 'count' => 0];
                }
                $recentActivity = collect($dates);
            }
            
            $data['recentActivity'] = $recentActivity;
        } catch (\Exception $e) {
            \Log::error('Error in recentActivity: ' . $e->getMessage());
            $data['recentActivity'] = [];
        }
        
        try {
            // 8. User registration trend (monthly)
            $userRegistrations = User::select(
                    DB::raw('YEAR(created_at) as year'),
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get()
                ->map(function ($item) {
                    return [
                        'month' => $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT),
                        'count' => $item->count
                    ];
                });
            
            // Si aucune inscription, créer des données vides pour le graphique
            if ($userRegistrations->isEmpty()) {
                $months = [];
                for ($i = 0; $i < 6; $i++) {
                    $date = now()->subMonths($i);
                    $month = $date->format('Y-m');
                    $months[] = ['month' => $month, 'count' => 0];
                }
                $userRegistrations = collect($months);
            }
            
            $data['userRegistrations'] = $userRegistrations;
        } catch (\Exception $e) {
            \Log::error('Error in userRegistrations: ' . $e->getMessage());
            $data['userRegistrations'] = [];
        }
        
        return response()->json($data);
    } catch (\Exception $e) {
        \Log::error('Dashboard stats error: ' . $e->getMessage());
        \Log::error('Stack trace: ' . $e->getTraceAsString());
        return response()->json(['error' => 'Error retrieving dashboard stats'], 500);
    }
}
/**
 * Récupère la liste des utilisateurs avec pagination, en excluant les administrateurs
 * 
 * @param Request $request
 * @return \Illuminate\Http\JsonResponse
 */
public function getUsers(Request $request)
{
    try {
        $search = $request->input('search', '');
        
        // Construction de la requête de base
        $query = User::select('id', 'name', 'email', 'languechoisie', 'niveauchoisie', 'created_at')
            ->where('is_admin', '!=', 1); // Exclure les administrateurs
        
        // Ajout du comptage de quiz_results si la relation existe
        try {
            $query->withCount('quizResults')->orderByDesc('quiz_results_count');
        } catch (\Exception $e) {
            \Log::error('Error in quizResults counting: ' . $e->getMessage());
            $query->orderBy('created_at', 'desc'); // Ordre par défaut
        }
        
        // Filtre de recherche
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Pagination
        $users = $query->paginate(20);
        
        return response()->json($users);
    } catch (\Exception $e) {
        \Log::error('Error retrieving users: ' . $e->getMessage());
        \Log::error('Stack trace: ' . $e->getTraceAsString());
        
        // Réponse d'erreur avec détails
        return response()->json([
            'message' => 'Une erreur est survenue lors de la récupération des utilisateurs',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function getLessonPerformance($id, Request $request)
{
    try {
        // Récupérer la leçon
        $lesson = Lesson::findOrFail($id);
        
        // Vérifier si des quiz existent pour cette leçon
        $quizExists = DB::table('quizzes')->where('lesson_id', $id)->exists();
        
        if ($quizExists) {
            // Vérifier si des résultats existent pour ces quiz
            $quizIds = DB::table('quizzes')->where('lesson_id', $id)->pluck('id');
            $resultsExist = DB::table('quiz_results')->whereIn('quiz_id', $quizIds)->exists();
            
            if ($resultsExist) {
                // Exécuter la requête complète uniquement si des résultats existent
                $quizResults = DB::table('quiz_results')
                    ->select(
                        'users.name',
                        'users.email',
                        'quiz_results.score',
                        'quiz_results.completed_at'
                    )
                    ->join('quizzes', 'quiz_results.quiz_id', '=', 'quizzes.id')
                    ->join('users', 'quiz_results.user_id', '=', 'users.id')
                    ->where('quizzes.lesson_id', $id)
                    ->orderByDesc('quiz_results.completed_at')
                    ->paginate(20);
            } else {
                // Aucun résultat trouvé
                $quizResults = new \Illuminate\Pagination\LengthAwarePaginator(
                    [], 0, 20, 1,
                    ['path' => $request->url(), 'query' => $request->query()]
                );
            }
        } else {
            // Aucun quiz trouvé
            $quizResults = new \Illuminate\Pagination\LengthAwarePaginator(
                [], 0, 20, 1,
                ['path' => $request->url(), 'query' => $request->query()]
            );
        }
        
        return response()->json([
            'lesson' => $lesson,
            'quizResults' => $quizResults
        ]);
    } catch (\Exception $e) {
        \Log::error('Error retrieving lesson performance: ' . $e->getMessage());
        
        return response()->json([
            'message' => 'Une erreur est survenue lors de la récupération des performances',
            'error' => $e->getMessage()
        ], 500);
    }
}
}