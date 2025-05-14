<?php
namespace App\Http\Controllers;

use App\Models\Bibliotheque;
use Illuminate\Http\Request;

class BibliothequeController extends Controller
{
    public function index()
    {
        // Récupérer uniquement les colonnes 'titre' et 'contenu'
        $livres = Bibliotheque::select('titre', 'contenu')->get();
        return response()->json($livres);
    }

    public function store(Request $request)
    {
        \Log::info($request->all()); // Vérifiez les données reçues ici

        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string'
        ]);

        $livre = Bibliotheque::create($validated);

        return response()->json(['message' => 'Livre ajouté avec succès!', 'livre' => $livre], 201);
    }
}