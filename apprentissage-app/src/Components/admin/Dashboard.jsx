import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import ChartComponent from './ChartComponent';
import adminService from '../../services/adminService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboardStats();
        setDashboardData(data);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="alert alert-warning" role="alert">
        Aucune donnée disponible pour le tableau de bord.
      </div>
    );
  }

  // Ensure all data properties exist with default values
  const {
    totalUsers = 0,
    activeUsers = 0,
    languageStats = [],
    levelStats = [],
    popularLessons = [], 
    lessonScores = [],
    recentActivity = [],
    userRegistrations = []
  } = dashboardData;

  // Préparer les données pour le graphique à secteurs (languages)
  const languageChartData = {
    labels: languageStats?.map(item => item.languechoisie) || [],
    datasets: [{
      data: languageStats?.map(item => item.total) || [],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
        '#FF9F40', '#FF6384', '#C9CBCF', '#7BC225', '#B56DB4'
      ]
    }]
  };

  // Préparer les données pour le graphique à barres (levels)
  const levelChartData = {
    labels: levelStats?.map(item => item.niveauchoisie) || [],
    datasets: [{
      label: 'Nombre d\'utilisateurs',
      data: levelStats?.map(item => item.total) || [],
      backgroundColor: '#36A2EB'
    }]
  };

  // Préparer les données pour le graphique de performance par thème
  const lessonPerformanceData = {
    labels: lessonScores?.map(item => item.title) || [],
    datasets: [{
      label: 'Score moyen (%)',
      data: lessonScores?.map(item => item.average_score) || [],
      backgroundColor: '#4BC0C0'
    }]
  };

  // Préparer les données pour le graphique d'activité récente
  const recentActivityData = {
    labels: recentActivity?.map(item => item.date) || [],
    datasets: [{
      label: 'Nombre de quiz complétés',
      data: recentActivity?.map(item => item.count) || [],
      fill: false,
      borderColor: '#FF6384',
      tension: 0.1
    }]
  };

  // Préparer les données pour le graphique d'inscriptions
  const userRegistrationData = {
    labels: userRegistrations?.map(item => item.month) || [],
    datasets: [{
      label: 'Nouvelles inscriptions',
      data: userRegistrations?.map(item => item.count) || [],
      backgroundColor: '#9966FF'
    }]
  };

  return (
    <div>
      <h1 className="mb-4">Tableau de bord administratif</h1>
      
      {/* Cartes d'informations clés */}
      <div className="row mb-4">
        <div className="col-md-3">
          <StatCard 
            title="Utilisateurs totaux" 
            value={totalUsers || 0}
            color="primary" 
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Utilisateurs actifs" 
            value={activeUsers || 0}
            subtitle={`${Math.round(((activeUsers || 0) / Math.max(1, totalUsers || 1)) * 100)}% du total`}
            color="success" 
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Langues sélectionnées" 
            value={languageStats?.length || 0}
            color="info" 
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Niveaux disponibles" 
            value={levelStats?.length || 0}
            color="warning" 
          />
        </div>
      </div>
      
      {/* Distribution des langues et niveaux */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Distribution des langues</h5>
            </div>
            <div className="card-body">
              {languageStats?.length > 0 ? (
                <ChartComponent 
                  type="pie" 
                  data={languageChartData} 
                  title="Langues sélectionnées par les utilisateurs"
                  options={{
                    plugins: {
                      legend: {
                        position: 'right',
                      }
                    }
                  }}
                />
              ) : (
                <p className="text-center text-muted">Aucune donnée disponible sur les langues</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Distribution des niveaux</h5>
            </div>
            <div className="card-body">
              {levelStats?.length > 0 ? (
                <ChartComponent 
                  type="bar" 
                  data={levelChartData} 
                  title="Niveaux choisis par les utilisateurs"
                  options={{
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              ) : (
                <p className="text-center text-muted">Aucune donnée disponible sur les niveaux</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Thèmes populaires et performances */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Thèmes les plus populaires</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Thème</th>
                      <th>Nombre de quiz complétés</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularLessons?.length > 0 ? (
                      popularLessons.map((lesson) => (
                        <tr key={lesson.id}>
                          <td>{lesson.title}</td>
                          <td>{lesson.quizzes_count}</td>
                          <td>
                            <Link 
                              to={`/admin/lesson/${lesson.id}/performance`} 
                              className="btn btn-sm btn-primary"
                            >
                              Détails
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">Aucun thème n'a encore été utilisé</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Performance par thème</h5>
            </div>
            <div className="card-body">
              {lessonScores?.length > 0 ? (
                <ChartComponent 
                  type="bar" 
                  data={lessonPerformanceData} 
                  title="Score moyen par thème"
                  options={{
                    indexAxis: 'y',
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              ) : (
                <p className="text-center text-muted">Aucune donnée de performance disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Activité récente et tendances d'inscription */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Activité récente (30 derniers jours)</h5>
            </div>
            <div className="card-body">
              {recentActivity?.length > 0 ? (
                <ChartComponent 
                  type="line" 
                  data={recentActivityData} 
                  title="Activité quotidienne"
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              ) : (
                <p className="text-center text-muted">Aucune activité récente</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Tendance d'inscription des utilisateurs</h5>
            </div>
            <div className="card-body">
              {userRegistrations?.length > 0 ? (
                <ChartComponent 
                  type="bar" 
                  data={userRegistrationData} 
                  title="Inscriptions mensuelles"
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              ) : (
                <p className="text-center text-muted">Aucune donnée d'inscription disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;