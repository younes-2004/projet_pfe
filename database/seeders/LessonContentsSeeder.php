<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LessonContent;
use Illuminate\Support\Facades\DB;

class LessonContentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Supprimer les contenus existants pour le thème "Préparer un voyage" (ID 4)
        DB::table('lesson_contents')->where('lesson_id', 4)->delete();

        // Contenu pour "Préparer un voyage" (lesson_id 4)
        
        // LEÇON 1: Introduction
        LessonContent::create([
            'lesson_id' => 4,
            'title' => 'Introduction',
            'content' => '<h3>Bienvenue au cours "Préparer un voyage"</h3>
                         <p>Dans ce module, vous allez apprendre le vocabulaire et les expressions essentiels pour organiser et parler de vos voyages en français.</p>
                         <p>À la fin de ce cours, vous serez capable de :</p>
                         <ul>
                           <li>Planifier un voyage étape par étape</li>
                           <li>Réserver des billets et un hébergement</li>
                           <li>Comprendre les informations de voyage</li>
                           <li>Poser des questions sur les formalités</li>
                           <li>Faire face aux situations courantes en voyage</li>
                         </ul>
                         <p>Voyager dans un pays francophone est une excellente occasion de pratiquer votre français et de découvrir une nouvelle culture.</p>
                         <div class="lesson-note">
                           <p>Les formalités de voyage peuvent varier selon les pays. Nous mentionnerons les particularités importantes pour les pays francophones.</p>
                         </div>',
            'order' => 1,
            'difficulty' => 'débutant',
            'duration' => 5
        ]);

        // LEÇON 2: Planifier son voyage
        LessonContent::create([
            'lesson_id' => 4,
            'title' => 'Planifier son voyage',
            'content' => '<h3>Les étapes pour planifier un voyage</h3>
                         <p>Voici le vocabulaire et les expressions pour organiser votre voyage.</p>
                         
                         <div class="vocabulary-table">
                           <table>
                             <tr>
                               <th>Français</th>
                               <th>Signification</th>
                               <th>Exemple</th>
                             </tr>
                             <tr>
                               <td><strong>Choisir une destination</strong></td>
                               <td>To choose a destination</td>
                               <td>Nous devons choisir une destination pour nos vacances.</td>
                             </tr>
                             <tr>
                               <td><strong>Fixer des dates</strong></td>
                               <td>To set dates</td>
                               <td>Nous avons fixé nos dates de voyage : du 15 au 30 juillet.</td>
                             </tr>
                             <tr>
                               <td><strong>Établir un itinéraire</strong></td>
                               <td>To plan an itinerary</td>
                               <td>J\'ai établi un itinéraire pour notre tour de France.</td>
                             </tr>
                             <tr>
                               <td><strong>Prévoir un budget</strong></td>
                               <td>To plan a budget</td>
                               <td>Nous avons prévu un budget de 1500 euros pour deux semaines.</td>
                             </tr>
                             <tr>
                               <td><strong>Faire des recherches</strong></td>
                               <td>To do research</td>
                               <td>J\'ai fait des recherches sur les sites à visiter.</td>
                             </tr>
                             <tr>
                               <td><strong>Une agence de voyage</strong></td>
                               <td>A travel agency</td>
                               <td>Nous avons réservé notre voyage par une agence.</td>
                             </tr>
                             <tr>
                               <td><strong>Un guide touristique</strong></td>
                               <td>A travel guide</td>
                               <td>J\'ai acheté un guide touristique sur Paris.</td>
                             </tr>
                             <tr>
                               <td><strong>Une carte</strong></td>
                               <td>A map</td>
                               <td>N\'oubliez pas d\'emporter une carte de la région.</td>
                             </tr>
                           </table>
                         </div>
                         
                         <h4>Questions utiles pour planifier</h4>
                         <ul>
                           <li><strong>"Où voulez-vous aller ?"</strong></li>
                           <li><strong>"Quand partez-vous ?"</strong></li>
                           <li><strong>"Combien de temps durera votre voyage ?"</strong></li>
                           <li><strong>"Quel est votre budget ?"</strong></li>
                           <li><strong>"Quels types d\'activités aimez-vous ?"</strong></li>
                         </ul>
                         
                         <div class="lesson-example">
                           <h4>Dialogue : Planifier un voyage</h4>
                           <p><strong>Marie</strong> : Alors, tu as réfléchi à nos vacances d\'été ?<br>
                           <strong>Pierre</strong> : Oui, je pensais à un voyage en Provence. Qu\'en dis-tu ?<br>
                           <strong>Marie</strong> : Excellente idée ! On pourrait y aller en juillet ?<br>
                           <strong>Pierre</strong> : Parfait. Je propose du 10 au 25 juillet. J\'ai déjà regardé, on peut faire un itinéraire entre Avignon, Aix et Marseille.<br>
                           <strong>Marie</strong> : Super ! Et quel budget faut-il prévoir ?<br>
                           <strong>Pierre</strong> : Environ 2000 euros pour deux semaines, hébergement et transport compris.<br>
                           <strong>Marie</strong> : D\'accord. Je vais faire des recherches sur les sites à visiter.<br>
                           <strong>Pierre</strong> : Moi, je m\'occupe de trouver un bon guide touristique.</p>
                         </div>',
            'order' => 2,
            'difficulty' => 'débutant',
            'duration' => 10
        ]);

        // LEÇON 3: Réserver transport et hébergement
        LessonContent::create([
            'lesson_id' => 4,
            'title' => 'Réserver transport et hébergement',
            'content' => '<h3>Réserver son transport et son hébergement</h3>
                         <p>Apprenez le vocabulaire nécessaire pour organiser les aspects pratiques de votre voyage.</p>
                         
                         <h4>Vocabulaire des transports</h4>
                         <div class="vocabulary-table">
                           <table>
                             <tr>
                               <th>Français</th>
                               <th>Signification</th>
                             </tr>
                             <tr>
                               <td><strong>Un billet d\'avion</strong></td>
                               <td>Plane ticket</td>
                             </tr>
                             <tr>
                               <td><strong>Un aller simple/aller-retour</strong></td>
                               <td>One-way ticket/round trip</td>
                             </tr>
                             <tr>
                               <td><strong>Une compagnie aérienne</strong></td>
                               <td>Airline</td>
                             </tr>
                             <tr>
                               <td><strong>Un billet de train</strong></td>
                               <td>Train ticket</td>
                             </tr>
                             <tr>
                               <td><strong>Une réservation</strong></td>
                               <td>Booking</td>
                             </tr>
                             <tr>
                               <td><strong>Un horaire</strong></td>
                               <td>Schedule</td>
                             </tr>
                             <tr>
                               <td><strong>Un vol direct/avec escale</strong></td>
                               <td>Direct flight/with stopover</td>
                             </tr>
                             <tr>
                               <td><strong>Un bagage à main/en soute</strong></td>
                               <td>Hand luggage/checked luggage</td>
                             </tr>
                           </table>
                         </div>
                         
                         <h4>Vocabulaire de l\'hébergement</h4>
                         <div class="vocabulary-table">
                           <table>
                             <tr>
                               <th>Français</th>
                               <th>Signification</th>
                             </tr>
                             <tr>
                               <td><strong>Un hôtel</strong></td>
                               <td>Hotel</td>
                             </tr>
                             <tr>
                               <td><strong>Un auberge de jeunesse</strong></td>
                               <td>Youth hostel</td>
                             </tr>
                             <tr>
                               <td><strong>Un Airbnb/un logement</strong></td>
                               <td>Airbnb/accommodation</td>
                             </tr>
                             <tr>
                               <td><strong>Une chambre simple/double</strong></td>
                               <td>Single/double room</td>
                             </tr>
                             <tr>
                               <td><strong>Petit déjeuner compris</strong></td>
                               <td>Breakfast included</td>
                             </tr>
                             <tr>
                               <td><strong>Annulation gratuite</strong></td>
                               <td>Free cancellation</td>
                             </tr>
                             <tr>
                               <td><strong>Les équipements</strong></td>
                               <td>Facilities</td>
                             </tr>
                           </table>
                         </div>
                         
                         <h4>Dialogue : Réserver un hôtel</h4>
                         <div class="example-dialogue">
                           <p><strong>Client</strong> : Bonjour, je voudrais réserver une chambre pour deux personnes du 15 au 20 août.<br>
                           <strong>Réceptionniste</strong> : Bien sûr. Nous avons des chambres doubles à 120 euros la nuit, petit déjeuner compris.<br>
                           <strong>Client</strong> : Est-ce qu\'il y a une possibilité d\'annulation gratuite ?<br>
                           <strong>Réceptionniste</strong> : Oui, vous pouvez annuler sans frais jusqu\'à 48 heures avant.<br>
                           <strong>Client</strong> : Parfait. La chambre a une connexion wifi ?<br>
                           <strong>Réceptionniste</strong> : Oui, le wifi est gratuit dans tout l\'hôtel.<br>
                           <strong>Client</strong> : Très bien, je prends la chambre alors.</p>
                         </div>',
            'order' => 3,
            'difficulty' => 'débutant',
            'duration' => 15
        ]);

        // LEÇON 4: Formalités et documents
        LessonContent::create([
            'lesson_id' => 4,
            'title' => 'Formalités et documents',
            'content' => '<h3>Les formalités et documents de voyage</h3>
                         <p>Découvrez les documents nécessaires et le vocabulaire lié aux formalités administratives.</p>
                         
                         <div class="vocabulary-table">
                           <table>
                             <tr>
                               <th>Français</th>
                               <th>Signification</th>
                             </tr>
                             <tr>
                               <td><strong>Un passeport</strong></td>
                               <td>Passport</td>
                             </tr>
                             <tr>
                               <td><strong>Un visa</strong></td>
                               <td>Visa</td>
                             </tr>
                             <tr>
                               <td><strong>Une carte d\'identité</strong></td>
                               <td>ID card</td>
                             </tr>
                             <tr>
                               <td><strong>Une assurance voyage</strong></td>
                               <td>Travel insurance</td>
                             </tr>
                             <tr>
                               <td><strong>Un permis de conduire</strong></td>
                               <td>Driver\'s license</td>
                             </tr>
                             <tr>
                               <td><strong>Une vaccination</strong></td>
                               <td>Vaccination</td>
                             </tr>
                             <tr>
                               <td><strong>La douane</strong></td>
                               <td>Customs</td>
                             </tr>
                             <tr>
                               <td><strong>Un contrôle de sécurité</strong></td>
                               <td>Security check</td>
                             </tr>
                           </table>
                         </div>
                         
                         <h4>Questions aux douanes</h4>
                         <ul>
                           <li><strong>"Avez-vous quelque chose à déclarer ?"</strong></li>
                           <li><strong>"Quel est le but de votre voyage ?"</strong></li>
                           <li><strong>"Combien de temps comptez-vous rester ?"</strong></li>
                           <li><strong>"Où allez-vous loger ?"</strong></li>
                         </ul>
                         
                         <h4>Conseils pour les formalités</h4>
                         <ul>
                           <li>Vérifiez toujours les exigences en matière de visa avant de voyager</li>
                           <li>Faites des photocopies de vos documents importants</li>
                           <li>Enregistrez les numéros d\'urgence de votre pays de destination</li>
                           <li>Vérifiez si des vaccins sont recommandés</li>
                         </ul>',
            'order' => 4,
            'difficulty' => 'intermédiaire',
            'duration' => 15
        ]);

        // LEÇON 5: Situations courantes en voyage
        LessonContent::create([
            'lesson_id' => 4,
            'title' => 'Situations courantes en voyage',
            'content' => '<h3>Faire face aux situations courantes en voyage</h3>
                         <p>Apprenez à gérer les situations typiques que vous pourriez rencontrer pendant votre voyage.</p>
                         
                         <h4>Vocabulaire utile</h4>
                         <div class="vocabulary-table">
                           <table>
                             <tr>
                               <th>Situation</th>
                               <th>Expressions utiles</th>
                             </tr>
                             <tr>
                               <td><strong>Demander son chemin</strong></td>
                               <td>"Excusez-moi, pourriez-vous m\'indiquer... ?"</td>
                             </tr>
                             <tr>
                               <td><strong>Commander au restaurant</strong></td>
                               <td>"Je voudrais..., s\'il vous plaît"</td>
                             </tr>
                             <tr>
                               <td><strong>Acheter des souvenirs</strong></td>
                               <td>"Combien coûte... ?", "Avez-vous... ?"</td>
                             </tr>
                             <tr>
                               <td><strong>Problème d\'hébergement</strong></td>
                               <td>"Il y a un problème avec...", "Pourriez-vous... ?"</td>
                             </tr>
                             <tr>
                               <td><strong>Urgence médicale</strong></td>
                               <td>"J\'ai besoin d\'un médecin", "Où est l\'hôpital ?"</td>
                             </tr>
                           </table>
                         </div>
                         
                         <h4>Dialogue : Demander son chemin</h4>
                         <div class="example-dialogue">
                           <p><strong>Touriste</strong> : Excusez-moi, pourriez-vous m\'indiquer comment aller à la tour Eiffel ?<br>
                           <strong>Passant</strong> : Bien sûr ! Vous pouvez prendre le métro ligne 6 jusqu\'à la station Bir-Hakeim.<br>
                           <strong>Touriste</strong> : C\'est loin à pied d\'ici ?<br>
                           <strong>Passant</strong> : À peu près 30 minutes de marche. Sinon, vous pouvez prendre un bus, le 82.<br>
                           <strong>Touriste</strong> : Merci beaucoup ! Et le musée d\'Orsay, c\'est dans la même direction ?<br>
                           <strong>Passant</strong> : Non, c\'est dans l\'autre sens. Mais vous pouvez y aller après la tour Eiffel en traversant la Seine.</p>
                         </div>',
            'order' => 5,
            'difficulty' => 'intermédiaire',
            'duration' => 15
        ]);

        // LEÇON 6: Exercices pratiques
        LessonContent::create([
            'lesson_id' => 4,
            'title' => 'Exercices pratiques',
            'content' => '<h3>Exercices pratiques sur les voyages</h3>
                         
                         <h4>Exercice 1 : Associez les mots</h4>
                         <p>Associez chaque mot à sa définition :</p>
                         <div class="exercise">
                           <ol type="a">
                             <li>Un passeport</li>
                             <li>Un visa</li>
                             <li>Un aller-retour</li>
                             <li>Une auberge de jeunesse</li>
                             <li>La douane</li>
                           </ol>
                           <ol type="1">
                             <li>Document qui permet d\'entrer dans un pays étranger</li>
                             <li>Service qui contrôle ce qui entre dans un pays</li>
                             <li>Billet pour aller à une destination et en revenir</li>
                             <li>Hébergement économique pour les jeunes</li>
                             <li>Document d\'identité pour voyager à l\'étranger</li>
                           </ol>
                         </div>
                         
                         <h4>Exercice 2 : Planifiez un voyage</h4>
                         <p>Imaginez que vous organisez un voyage dans un pays francophone. Écrivez un court paragraphe sur :</p>
                            <ul>
                            <li>La destination choisie</li>
                            <li>Les dates de voyage</li>
                            <li>Le budget prévu</li>
                            <li>Les activités que vous aimeriez faire</li>
                            </ul>
                            <p>Exemple : "Je vais partir en France du 1er au 15 août. Mon budget est de 2000 euros. Je voudrais visiter Paris, Lyon et Marseille."</p>
                            <h4>Exercice 3 : Dialogue</h4>
                            <p>En binôme, jouez le rôle d\'un touriste et d\'un agent de voyage. Le touriste doit poser des questions sur un voyage en France, et l\'agent de voyage doit répondre.</p>
                            <p>Exemple :<br>
                            <strong>Touriste</strong> : Bonjour, je voudrais des informations sur un voyage à Paris.<br>
                            <strong>Agent</strong> : Bien sûr, quel est votre budget ?</p>
                            <p>Essayez d\'utiliser le vocabulaire appris dans ce module.</p>
                            <h4>Exercice 4 : Vocabulaire</h4>
                            <p>Complétez les phrases suivantes avec le vocabulaire approprié :</p>
                            <ol>
                              <li>Pour aller à la plage, il faut prendre le ________.</li>
                              <li>J\'ai réservé une ________ pour deux personnes.</li>
                              <li>Le ________ est un document essentiel pour voyager à l\'étranger.</li>
                              <li>Nous avons prévu de faire un ________ entre Paris et Lyon.</li>
                              <li>Il faut passer par la ________ avant de sortir de l\'aéroport.</li>
                            </ol>
                            <p>Réponses :<br>
                            1. bus<br>
                            2. chambre<br>
                            3. passeport<br>
                            4. trajet<br>
                            5. douane</p>
                            <h4>Exercice 5 : Quiz</h4>
                            <p>Réalisez le quiz en ligne sur la plateforme pour tester vos connaissances sur le vocabulaire et les expressions de ce module.</p>
                            </div>',
            'order' => 6,
            'difficulty' => 'intermédiaire',
            'duration' => 20
        ]);
    }
}
