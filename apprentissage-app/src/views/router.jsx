// src/views/router.jsx
import { createBrowserRouter } from "react-router-dom";
import Login from "./login.jsx";
import Register from "./register.jsx"; // Import ajouté
import App from "../App.jsx";
import GuestLayout from "../Components/GuestLayout.jsx"; // Import de GuestLayout
import Users from "./users.jsx"; // Import de Users
import DefaultLayout from "../Components/DefaultLayout.jsx";
import LanguageSelection from "./LanguageSelection.jsx";
import LevelSelection from "./LevelSelection.jsx";
import AccessLesson from "../views/AccessLesson"; // Import de AccessLesson
import BibliothequeView from "./bibliothèque.jsx"; // Import de BibliothequeView
import TousLesLivres from "./TousLesLivres.jsx"; // Import de TousLesLivres
import Podcasts from "./Podcasts.jsx"; // Import de Podcasts
import Quiz from "./Quiz.jsx"; // Import de Quiz
import UserStats from "./UserStats.jsx"; // Importez le composant UserStats
import TestsPage from "./TestsPage.jsx"; // Import de TestsPage 
import UserProfile from "./UserProfile.jsx"; // Import de UserProfile
import AdminLayout from "../Components/layouts/AdminLayout.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import AdminLessonPerformancePage from "./pages/AdminLessonPerformancePage.jsx";











const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />, // Nouvelle route pour l'inscription
        children:[
            {
                path: "/users",
                element: <Users />, // Page de connexion
              },

        ]
      },
      {
        path: "/",
        element: <GuestLayout />, // Nouvelle route pour l'inscription
        children:[
            {
                path: "/login",
                element: <Login />, // Page de connexion
              },

        ]
      },
  {
    path: "/register",
    element: <Register />, // Nouvelle route pour l'inscription
  },
  {
    path: "/language-selection",
    element: < LanguageSelection />, // Nouvelle route pour l'inscription
  },
  {
    path: "/level-selection",
    element: < LevelSelection />, // Nouvelle route pour l'inscription
  },
  {
    path: "/access-lesson",
    element: <AccessLesson />, // Nouvelle route pour la page Access Leçon
  },
  {
    path: "/bibliotheque/:id",
    element: <BibliothequeView />, 
  },
  {
    path: '/tous-les-livres',
    element: <TousLesLivres />, // Nouvelle route pour afficher tous les livres
  },
   {
    path: '/Podcasts',
    element: < Podcasts />, 
  },
  {
    path: '/quiz/:lessonTitle', // Ajoutez cette route pour le quiz
    element: <Quiz />, 
  },
  {
    path: '/mes-statistiques', // Ajoutez cette nouvelle route
    element: <UserStats />,
},

{
  path: '/mes-tests',
  element: <TestsPage />
},
{
  path: "/mon-profil", // Nouvelle route pour le profil utilisateur
  element: <UserProfile />,
},


{
  path: "/admin/dashboard",
  element: <AdminLayout><AdminDashboardPage /></AdminLayout>,
},
{
  path: "/admin/users",
  element: <AdminLayout><AdminUsersPage /></AdminLayout>,
},
{
  path: "/admin/lesson/:id/performance",
  element: <AdminLayout><AdminLessonPerformancePage /></AdminLayout>,
},
{
  path: "/admin",
  element: <AdminLayout />,
},
{
  path: "/admin/users/:id",
  element: <AdminLayout><AdminUsersPage /></AdminLayout>,
},
  
]);

export default router;