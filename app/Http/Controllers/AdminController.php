<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Lesson;
use App\Models\QuizResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Récupère les statistiques pour le tableau de bord administrateur
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    // Ajoutez ces méthodes à votre classe AdminController existante

/**
 * Récupère les statistiques pour le tableau de bord administrateur (version API)
 * 
 * @return \Illuminate\Http\JsonResponse
 */
public function dashboardApi()
{
    // 1. Total users
    $totalUsers = User::count();
    
    // 2. Active users (users who completed at least one quiz)
    $activeUsers = User::whereHas('quizResults')->count();
    
    // 3. Language preferences distribution
    $languageStats = User::whereNotNull('languechoisie')
        ->select('languechoisie', DB::raw('count(*) as total'))
        ->groupBy('languechoisie')
        ->orderByDesc('total')
        ->get();
        
    // 4. Level preferences distribution
    $levelStats = User::whereNotNull('niveauchoisie')
        ->select('niveauchoisie', DB::raw('count(*) as total'))
        ->groupBy('niveauchoisie')
        ->orderByDesc('total')
        ->get();
        
    // 5. Most popular lessons/themes
    $popularLessons = Lesson::withCount(['quizzes' => function($query) {
            $query->whereHas('quizResults');
        }])
        ->orderByDesc('quizzes_count')
        ->take(10)
        ->get();
        
    // 6. Average quiz score by lesson
    $lessonScores = Lesson::select('lessons.id', 'lessons.title', 
            DB::raw('AVG(quiz_results.score) as average_score'), 
            DB::raw('COUNT(quiz_results.id) as attempts_count'))
        ->join('quizzes', 'lessons.id', '=', 'quizzes.lesson_id')
        ->join('quiz_results', 'quizzes.id', '=', 'quiz_results.quiz_id')
        ->groupBy('lessons.id', 'lessons.title')
        ->orderByDesc('attempts_count')
        ->take(10)
        ->get();
        
    // 7. Recent quiz activity (last 30 days)
    $recentActivity = QuizResult::select(DB::raw('DATE(completed_at) as date'), 
            DB::raw('COUNT(*) as count'))
        ->whereNotNull('completed_at')
        ->where('completed_at', '>=', now()->subDays(30))
        ->groupBy('date')
        ->orderBy('date')
        ->get();
        
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
        
    return response()->json([
        'totalUsers' => $totalUsers,
        'activeUsers' => $activeUsers,
        'languageStats' => $languageStats,
        'levelStats' => $levelStats,
        'popularLessons' => $popularLessons,
        'lessonScores' => $lessonScores,
        'recentActivity' => $recentActivity,
        'userRegistrations' => $userRegistrations
    ]);
}

/**
 * Récupère la liste des utilisateurs avec pagination (version API)
 * 
 * @param Request $request
 * @return \Illuminate\Http\JsonResponse
 */
public function userDetailsApi(Request $request)
{
    $search = $request->input('search', '');
    
    $query = User::withCount('quizResults')
        ->orderByDesc('quiz_results_count');
        
    if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }
    
    $users = $query->paginate(20);
        
    return response()->json($users);
}

/**
 * Récupère les performances d'une leçon spécifique (version API)
 * 
 * @param int $id
 * @param Request $request
 * @return \Illuminate\Http\JsonResponse
 */
public function lessonPerformanceApi($id, Request $request)
{
    $lesson = Lesson::findOrFail($id);
    
    $quizResults = QuizResult::select(
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
        
    return response()->json([
        'lesson' => $lesson,
        'quizResults' => $quizResults
    ]);
}
    public function getDashboardStats()
    {
        // 1. Total users
        $totalUsers = User::count();
        
        // 2. Active users (users who completed at least one quiz)
        $activeUsers = User::whereHas('quizResults')->count();
        
        // 3. Language preferences distribution
        $languageStats = User::whereNotNull('languechoisie')
            ->select('languechoisie', DB::raw('count(*) as total'))
            ->groupBy('languechoisie')
            ->orderByDesc('total')
            ->get();
            
        // 4. Level preferences distribution
        $levelStats = User::whereNotNull('niveauchoisie')
            ->select('niveauchoisie', DB::raw('count(*) as total'))
            ->groupBy('niveauchoisie')
            ->orderByDesc('total')
            ->get();
            
        // 5. Most popular lessons/themes
        $popularLessons = Lesson::withCount(['quizzes' => function($query) {
                $query->whereHas('quizResults');
            }])
            ->orderByDesc('quizzes_count')
            ->take(10)
            ->get();
            
        // 6. Average quiz score by lesson
        $lessonScores = Lesson::select('lessons.id', 'lessons.title', 
                DB::raw('AVG(quiz_results.score) as average_score'), 
                DB::raw('COUNT(quiz_results.id) as attempts_count'))
            ->join('quizzes', 'lessons.id', '=', 'quizzes.lesson_id')
            ->join('quiz_results', 'quizzes.id', '=', 'quiz_results.quiz_id')
            ->groupBy('lessons.id', 'lessons.title')
            ->orderByDesc('attempts_count')
            ->take(10)
            ->get();
            
        // 7. Recent quiz activity (last 30 days)
        $recentActivity = QuizResult::select(DB::raw('DATE(completed_at) as date'), 
                DB::raw('COUNT(*) as count'))
            ->whereNotNull('completed_at')
            ->where('completed_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
            
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
            
        return response()->json([
            'totalUsers' => $totalUsers,
            'activeUsers' => $activeUsers,
            'languageStats' => $languageStats,
            'levelStats' => $levelStats,
            'popularLessons' => $popularLessons,
            'lessonScores' => $lessonScores,
            'recentActivity' => $recentActivity,
            'userRegistrations' => $userRegistrations
        ]);
    }
    
    /**
     * Récupère la liste des utilisateurs avec pagination
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsers(Request $request)
    {
        $search = $request->input('search', '');
        
        $query = User::withCount('quizResults')
            ->orderByDesc('quiz_results_count');
            
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        $users = $query->paginate(20);
            
        return response()->json($users);
    }
    
    /**
     * Récupère les performances d'une leçon spécifique
     * 
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLessonPerformance($id, Request $request)
    {
        $lesson = Lesson::findOrFail($id);
        
        $quizResults = QuizResult::select(
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
            
        return response()->json([
            'lesson' => $lesson,
            'quizResults' => $quizResults
        ]);
    }
}
