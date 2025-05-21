<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BibliothequeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuizResultController;
use App\Http\Controllers\LessonContentController;
use App\Http\Controllers\AdminController; // Utilisez le contrôleur existant

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('login',[AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function() {
    Route::get('logout',[AuthController::class,'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AuthController::class, 'getUser']);
        Route::put('/user/profile', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'updatePassword']);
        Route::put('/user/language', [AuthController::class, 'updateLanguage']);
    });

    // Routes d'administration - CORRIGÉ
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'getDashboardStats']);
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::get('/lessons/{id}/performance', [AdminController::class, 'getLessonPerformance']);
    });
    Route::get('/admin/test', [AdminController::class, 'test']);

    // Dans routes/api.php
    // Route pour obtenir les informations de l'utilisateur connecté
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::apiResource('/users',UserController::class);

    Route::post('/update-language', function (Request $request) {
        $request->validate([
            'languechoisie' => 'required|string',
        ]);

        $user = $request->user();
        $user->languechoisie = $request->languechoisie;
        $user->save();

        return response()->json(['message' => 'Langue mise à jour avec succès !']);
    });

    Route::post('/update-level', function (Request $request) {
        $request->validate([
            'niveauchoisie' => 'required|string',
        ]);

        $user = $request->user();
        $user->niveauchoisie = $request->niveauchoisie;
        $user->save();

        return response()->json(['message' => 'Niveau enregistré avec succès !']);
    });
});

Route::post('register',[AuthController::class,'register']);

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    // Routes pour les leçons
    Route::get('/lessons', [LessonController::class, 'index']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    
    // Routes pour les quiz
    Route::get('/lessons/{id}/quiz', [QuizController::class, 'getQuizByLesson']);
    
    // Routes pour l'administration (si nécessaire)
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    
    Route::get('/lessons/{lessonId}/contents', [LessonContentController::class, 'index']);
    Route::post('/lessons/{lessonId}/contents', [LessonContentController::class, 'store']);
    Route::get('/lesson-contents/{id}', [LessonContentController::class, 'show']);
    Route::put('/lesson-contents/{id}', [LessonContentController::class, 'update']);
    Route::delete('/lesson-contents/{id}', [LessonContentController::class, 'destroy']);
    
    Route::post('/quizzes', [QuizController::class, 'store']);
    Route::put('/quizzes/{id}', [QuizController::class, 'update']);
    Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']);
});

// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/quiz-results', [QuizResultController::class, 'store']);
    // ... routes existantes
    Route::get('/quiz-results', [QuizResultController::class, 'getUserResults']);
    Route::get('/user-stats', [QuizResultController::class, 'getUserStats']);
});

Route::get('/bibliotheque', [BibliothequeController::class, 'index']); // Récupérer tous les livres