<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        
        if(!Auth::attempt($data)){
            return response([
                'message' => 'email or password are wrong'
            ], 401); // Code 401 pour authentification échouée
        }
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed'
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        // CORRECTION: Vérification que l'utilisateur existe
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response('',204);
    }

    public function updateLanguage(Request $request)
    {
        $request->validate([
            'languechoisie' => 'required|string',
        ]);

        // CORRECTION: Vérification que l'utilisateur existe
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        $user->languechoisie = $request->languechoisie;
        $user->save();

        return response()->json([
            'message' => 'Langue mise à jour avec succès !',
            'user' => $user,
        ]);
    }

    /**
     * Récupère les informations de l'utilisateur connecté
     */
    public function getUser(Request $request)
    {
        // CORRECTION: Vérification que l'utilisateur existe
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }
        
        return response()->json($user);
    }

    /**
     * Met à jour le profil de l'utilisateur
     */
    public function updateProfile(Request $request)
    {
        // CORRECTION: Vérification que l'utilisateur existe
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        // Validation avec vérification d'unicité d'email en ignorant l'utilisateur actuel
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'languechoisie' => 'nullable|string|max:50',
        ], [
            'name.required' => 'Le nom est obligatoire.',
            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email' => 'Veuillez entrer une adresse email valide.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'languechoisie' => $data['languechoisie'] ?? $user->languechoisie,
        ]);

        return response()->json([
            'message' => 'Profil mis à jour avec succès !',
            'user' => $user,
        ]);
    }

    /**
     * Met à jour le mot de passe de l'utilisateur
     */
    public function updatePassword(Request $request)
    {
        // CORRECTION: Vérification que l'utilisateur existe
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        // Validation
        $data = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'current_password.required' => 'Le mot de passe actuel est obligatoire.',
            'password.required' => 'Le nouveau mot de passe est obligatoire.',
            'password.min' => 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        // Vérifier si le mot de passe actuel est correct
        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($data['password']),
        ]);

        return response()->json([
            'message' => 'Mot de passe mis à jour avec succès !',
        ]);
    }
}