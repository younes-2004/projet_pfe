<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    /**
     * Afficher toutes les leçons
     */
    public function index()
    {
        $lessons = Lesson::all();
        return response()->json($lessons);
    }

    /**
     * Récupérer une leçon spécifique avec ses détails
     */
    public function show($id)
    {
        $lesson = Lesson::findOrFail($id);
        return response()->json($lesson);
    }

    /**
     * Créer une nouvelle leçon (pour l'administration)
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'image_path' => 'required|string',
            'lessons_count' => 'required|integer',
            'rating' => 'required|numeric',
            'reviews' => 'required|string',
            'price' => 'required|string',
            'time' => 'required|string',
        ]);

        $lesson = Lesson::create($validatedData);
        return response()->json($lesson, 201);
    }

    /**
     * Mettre à jour une leçon existante
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'sometimes|string|max:255',
            'image_path' => 'sometimes|string',
            'lessons_count' => 'sometimes|integer',
            'rating' => 'sometimes|numeric',
            'reviews' => 'sometimes|string',
            'price' => 'sometimes|string',
            'time' => 'sometimes|string',
        ]);

        $lesson = Lesson::findOrFail($id);
        $lesson->update($validatedData);
        return response()->json($lesson);
    }

    /**
     * Supprimer une leçon
     */
    public function destroy($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->delete();
        return response()->json(null, 204);
    }
}