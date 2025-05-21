<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('admin123'), // Changez ce mot de passe pour la production !
            'is_admin' => true,
        ]);
        
        $this->command->info('Utilisateur administrateur créé !');
        $this->command->info('Email: admin@example.com');
        $this->command->info('Mot de passe: admin123');
    }
}