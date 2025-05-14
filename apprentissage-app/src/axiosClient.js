import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
});

// Intercepteur de requête
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur de réponse
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (!error.response) {
            // Cas où error.response n'existe pas (erreur réseau, etc.)
            console.error("Erreur réseau ou serveur indisponible:", error.message);
            return Promise.reject(error);
        }

        const { status } = error.response;
        
        if (status === 401) {
            localStorage.removeItem("ACCESS_TOKEN");
            // Rediriger vers la page de login si nécessaire
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosClient;