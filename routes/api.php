<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\BibliothequeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->group(function() {
    Route::get('logout',[AuthController::class,'logout']);

    Route::get('/user', function (Request $request) {
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

Route::post('login',[AuthController::class,'login']);
Route::post('register',[AuthController::class,'register']);
Route::get('/courses/{courseId}/quiz', [QuizController::class, 'getQuizByCourse']);
Route::get('/quiz/{quizId}', [QuizController::class, 'getQuizWithQuestions']);
Route::get('/bibliotheque', [BibliothequeController::class, 'index']); // Récupérer tous les livres