<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bibliotheque extends Model
{
    use HasFactory;

    // Spécifiez le nom de la table
    protected $table = 'bibliotheque';

    protected $fillable = [
        'titre',
        'contenu'
    ];
}
