import axiosClient from "../axiosClient";

export const adminService = {
  // Récupérer les données pour le tableau de bord
  getDashboardStats: async () => {
    try {
      const response = await axiosClient.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },
  
  // Récupérer la liste des utilisateurs avec pagination
  getUsers: async (page = 1, search = '') => {
    try {
      const response = await axiosClient.get('/admin/users', {
        params: { page, search }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },
  
  // Récupérer les détails de performance d'une leçon spécifique
  getLessonPerformance: async (lessonId, page = 1) => {
    try {
      const response = await axiosClient.get(`/admin/lesson/${lessonId}/performance`, {
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