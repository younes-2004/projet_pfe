<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Insérer la leçon
        $lessonId = DB::table('lessons')->insertGetId([
            'title' => 'Faire connaissance',
            'image_path' => '/images/faire connaisance.jpg',
            'lessons_count' => 20,
            'rating' => 5.1,
            'reviews' => '6.2k',
            'price' => 'Gratuit',
            'time' => '10m',
        ]);

        // Insérer le quiz
        $quizId = DB::table('quizzes')->insertGetId([
            'lesson_id' => $lessonId,
            'title' => 'Quiz: Faire connaissance',
            'description' => 'Testez vos connaissances sur les salutations et les présentations en français',
            'time_limit' => 15,
        ]);

        // Questions pour le quiz
        $questions = [
            'Quelle formule de salutation est la plus formelle en français ?',
            'Comment demande-t-on poliment le nom de quelqu\'un en français ?',
            'Lors d\'une présentation professionnelle, quelle information est appropriée de partager ?',
            'Quelle est la bonne réponse à "Enchanté(e) de faire votre connaissance" ?',
            'En France, quelle est la façon traditionnelle de se saluer entre amis ?',
            'Quel sujet est généralement considéré comme inapproprié lors d\'une première rencontre en contexte formel ?',
            'Comment demander poliment ce que fait une personne dans la vie ?',
            'À quelle heure est-il généralement inapproprié d\'appeler quelqu\'un que vous ne connaissez pas bien ?',
            'Comment répondre correctement quand quelqu\'un vous demande "Comment allez-vous ?" dans un contexte formel ?',
            'Quel geste est approprié lors d\'une présentation professionnelle ?',
            'Comment demander poliment l\'âge de quelqu\'un (si nécessaire) ?',
            'Quelle expression peut-on utiliser pour demander à quelqu\'un d\'où il vient ?',
            'Lors d\'une conversation, comment montrer que vous écoutez activement ?',
            'Quelle est une bonne façon de terminer une première conversation ?',
            'Comment peut-on parler de ses centres d\'intérêt de manière appropriée ?'
        ];

        // Insérer les 15 questions
        for ($i = 0; $i < count($questions); $i++) {
            $questionId = DB::table('questions')->insertGetId([
                'quiz_id' => $quizId,
                'question_text' => $questions[$i],
                'question_type' => 'multiple_choice',
                'points' => 1,
            ]);

            // Insérer les réponses pour chaque question
            // Les réponses et l'indication de la réponse correcte
            switch ($i) {
                case 0: // Question 1
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'Salut !', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Bonjour Madame/Monsieur.', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Coucou !', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Ça va ?', 'is_correct' => false]
                    ]);
                    break;
                case 1: // Question 2
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'Tu t\'appelles comment ?', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'C\'est quoi ton nom ?', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Comment vous appelez-vous ?', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Dis-moi ton prénom.', 'is_correct' => false]
                    ]);
                    break;
                case 2: // Question 3
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'Votre situation amoureuse', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Votre salaire', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Votre poste et votre expérience', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Vos opinions politiques', 'is_correct' => false]
                    ]);
                    break;
                case 3: // Question 4
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'Moi de même.', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Pas moi.', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Je ne suis pas sûr(e).', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'C\'est pas grave.', 'is_correct' => false]
                    ]);
                    break;
                case 4: // Question 5
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'Une poignée de main', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'La bise (un ou plusieurs baisers sur la joue)', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Un câlin', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Un signe de la main', 'is_correct' => false]
                    ]);
                    break;
                case 5: // Question 6
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'La météo', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Vos loisirs', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Votre salaire', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Votre travail', 'is_correct' => false]
                    ]);
                    break;
                case 6: // Question 7
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'Tu fais quoi dans la vie ?', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Quel est votre métier ?', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Tu gagnes combien ?', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Où est-ce que tu travailles ?', 'is_correct' => false]
                    ]);
                    break;
                case 7: // Question 8
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'Entre 9h et 12h', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Entre 14h et 17h', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Entre 12h et 14h', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Après 21h', 'is_correct' => true]
                    ]);
                    break;
                case 8: // Question 9
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'Ça va.', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Je vais bien, merci. Et vous ?', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Bof, comme ci comme ça.', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Super bien !', 'is_correct' => false]
                    ]);
                    break;
                case 9: // Question 10
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'Faire un câlin', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Une poignée de main ferme', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Faire la bise', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Garder les mains dans les poches', 'is_correct' => false]
                    ]);
                    break;
                case 10: // Question 11
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'T\'as quel âge ?', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Vous êtes né(e) en quelle année ?', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Tu es vieux/vieille, n\'est-ce pas ?', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Dis-moi ton âge !', 'is_correct' => false]
                    ]);
                    break;
                case 11: // Question 12
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'D\'où venez-vous ?', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Tu habites où ?', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Où est ta maison ?', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'T\'es de quel quartier ?', 'is_correct' => false]
                    ]);
                    break;
                case 12: // Question 13
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'En regardant votre téléphone', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'En interrompant souvent', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'En faisant des signes de tête et en maintenant un contact visuel', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'En restant silencieux et immobile', 'is_correct' => false]
                    ]);
                    break;
                case 13: // Question 14
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'Bon, je dois y aller !', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'J\'ai été ravi(e) de faire votre connaissance. J\'espère avoir l\'occasion de vous revoir.', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'C\'était ennuyeux.', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Je dois partir maintenant.', 'is_correct' => false]
                    ]);
                    break;
                case 14: // Question 15
                    DB::table('answers')->insert([
                        ['question_id' => $questionId, 'answer_text' => 'J\'aime beaucoup la lecture et le cinéma. Et vous, quels sont vos intérêts ?', 'is_correct' => true],
                        ['question_id' => $questionId, 'answer_text' => 'Je suis passionné par plein de choses, trop pour en parler.', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Je n\'ai pas vraiment d\'intérêts particuliers.', 'is_correct' => false],
                        ['question_id' => $questionId, 'answer_text' => 'Mes intérêts sont trop complexes pour que vous les compreniez.', 'is_correct' => false]
                    ]);
                    break;
            }
        }
    }
}