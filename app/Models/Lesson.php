<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image_path',
        'lessons_count',
        'rating',
        'reviews',
        'price',
        'time',
    ];

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
     /**
     * Relation avec les contenus de leçon de ce thème
     */
    public function contents()
    {
        return $this->hasMany(LessonContent::class)->orderBy('order');
    }
}
