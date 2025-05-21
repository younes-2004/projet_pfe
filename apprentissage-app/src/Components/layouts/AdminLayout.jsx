import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../Components/admin/AdminNav';
import axiosClient from "../../axiosClient";

const AdminLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et est administrateur
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Faire une requête pour vérifier si l'utilisateur est administrateur
        const response = await axiosClient.get('/user');
        if (response.data && response.data.is_admin) {
          setIsAdmin(true);
        } else {
          // Si l'utilisateur n'est pas administrateur, le rediriger
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut admin:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Ne rien afficher si l'utilisateur n'est pas administrateur
  }

  return (
    <div>
      <AdminNav />
      <div className="container-fluid py-4">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;