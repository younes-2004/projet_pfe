import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
});

const fetchLivres = async () => {
    try {
        const response = await axios.get('/api/bibliotheque'); // Utilisez le proxy
        console.log('Réponse de l\'API:', response.data); // Vérifiez les données reçues
        setLivres(response.data);
    } catch (error) {
        console.error('Erreur lors du chargement des livres:', error);
    }
};
