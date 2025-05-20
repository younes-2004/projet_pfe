<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\LessonContent;
use Illuminate\Http\Request;

class LessonContentController extends Controller
{
    /**
     * Afficher tous les contenus d'une leçon spécifique
     */
    public function index($lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);
        $contents = $lesson->contents;
        return response()->json($contents);
    }

    /**
     * Récupérer un contenu de leçon spécifique
     */
    public function show($id)
    {
        $content = LessonContent::findOrFail($id);
        return response()->json($content);
    }

    /**
     * Créer un nouveau contenu de leçon
     */
    public function store(Request $request, $lessonId)
    {
        // Vérifier que la leçon existe
        $lesson = Lesson::findOrFail($lessonId);

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'video_url' => 'nullable|string',
            'audio_url' => 'nullable|string',
            'image_url' => 'nullable|string',
            'order' => 'nullable|integer',
            'difficulty' => 'nullable|string|in:débutant,intermédiaire,avancé',
            'duration' => 'nullable|integer',
        ]);

        // Ajouter l'ID de la leçon
        $validatedData['lesson_id'] = $lessonId;

        // Si l'ordre n'est pas spécifié, mettre à la fin
        if (!isset($validatedData['order'])) {
            $maxOrder = $lesson->contents()->max('order') ?? 0;
            $validatedData['order'] = $maxOrder + 1;
        }

        $content = LessonContent::create($validatedData);
        
        // Mettre à jour le compteur de leçons dans la table lessons
        $lesson->lessons_count = $lesson->contents()->count();
        $lesson->save();

        return response()->json($content, 201);
    }

    /**
     * Mettre à jour un contenu de leçon existant
     */
    public function update(Request $request, $id)
    {
        $content = LessonContent::findOrFail($id);

        $validatedData = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'video_url' => 'nullable|string',
            'audio_url' => 'nullable|string',
            'image_url' => 'nullable|string',
            'order' => 'nullable|integer',
            'difficulty' => 'nullable|string|in:débutant,intermédiaire,avancé',
            'duration' => 'nullable|integer',
        ]);

        $content->update($validatedData);
        return response()->json($content);
    }

    /**
     * Supprimer un contenu de leçon
     */
    public function destroy($id)
    {
        $content = LessonContent::findOrFail($id);
        $lessonId = $content->lesson_id;
        $content->delete();
        
        // Mettre à jour le compteur de leçons dans la table lessons
        $lesson = Lesson::find($lessonId);
        if ($lesson) {
            $lesson->lessons_count = $lesson->contents()->count();
            $lesson->save();
        }
        
        return response()->json(null, 204);
    }
}