<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
     // database/migrations/xxxx_create_answers_table.php
Schema::create('answers', function (Blueprint $table) {
    $table->id();
    $table->foreignId('question_id')->constrained()->onDelete('cascade');
    $table->text('answer_text');
    $table->boolean('is_correct');
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
        Schema::dropIfExists('answers');
    }
};
