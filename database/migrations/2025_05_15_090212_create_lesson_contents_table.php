// database/migrations/xxxx_xx_xx_create_lesson_contents_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLessonContentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lesson_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->string('video_url')->nullable();
            $table->string('audio_url')->nullable();
            $table->string('image_url')->nullable();
            $table->integer('order')->default(1); // Pour l'ordre des leçons dans un thème
            $table->enum('difficulty', ['débutant', 'intermédiaire', 'avancé'])->default('débutant');
            $table->integer('duration')->nullable(); // Durée en minutes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lesson_contents');
    }
}