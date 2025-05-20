<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LessonContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'title',
        'content',
        'video_url',
        'audio_url',
        'image_url',
        'order',
        'difficulty',
        'duration'
    ];

    /**
     * Relation avec le thème/leçon parent
     */
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}