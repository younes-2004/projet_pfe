// src/services/adminService.js
import axiosClient from '../axiosClient';

const adminService = {
  /**
   * Récupère les statistiques pour le tableau de bord administrateur
   * @returns {Promise} Promesse avec les données du tableau de bord
   */
  getDashboardStats: async () => {
    try {
      const response = await axiosClient.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  /**
   * Récupère la liste des utilisateurs avec pagination
   * @param {number} page - Page courante
   * @param {string} search - Terme de recherche (optionnel)
   * @returns {Promise} Promesse avec les données utilisateurs paginées
   */
  getUsers: async (page = 1, search = '') => {
    try {
      const response = await axiosClient.get('/admin/users', {
        params: {
          page,
          search
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  /**
   * Récupère les performances d'une leçon spécifique
   * @param {number} lessonId - ID de la leçon
   * @param {number} page - Page courante
   * @returns {Promise} Promesse avec les données de performance
   */
  getLessonPerformance: async (lessonId, page = 1) => {
    try {
      const response = await axiosClient.get(`/admin/lessons/${lessonId}/performance`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des performances pour la leçon ${lessonId}:`, error);
      throw error;
    }
  }
};

export default adminService;