import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ChartComponent from './ChartComponent';
import adminService from '../../services/adminService';

const LessonPerformance = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 20,
    total: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLessonPerformance(1);
  }, [id]);

  const fetchLessonPerformance = async (page) => {
    try {
      setLoading(true);
      const response = await adminService.getLessonPerformance(id, page);
      setLesson(response.lesson);
      setQuizResults(response.quizResults.data);
      setPagination({
        currentPage: response.quizResults.current_page,
        totalPages: response.quizResults.last_page,
        perPage: response.quizResults.per_page,
        total: response.quizResults.total
      });
    } catch (err) {
      setError(`Erreur lors du chargement des performances pour la leçon ${id}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchLessonPerformance(page);
  };

  if (loading && !lesson) {
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
        <div className="mt-3">
          <Link to="/admin/dashboard" className="btn btn-primary">Retour au tableau de bord</Link>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  // Préparer les données pour le graphique de distribution des scores
  const prepareScoreDistributionData = () => {
    // Compter les scores dans les plages définies
    const ranges = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0
    };
    
    quizResults.forEach(result => {
      const score = parseFloat(result.score);
      if (score <= 20) ranges['0-20']++;
      else if (score <= 40) ranges['21-40']++;
      else if (score <= 60) ranges['41-60']++;
      else if (score <= 80) ranges['61-80']++;
      else ranges['81-100']++;
    });
    
    return {
      labels: Object.keys(ranges),
      datasets: [{
        label: 'Nombre d\'utilisateurs',
        data: Object.values(ranges),
        backgroundColor: [
          '#FF6384', 
          '#FFCE56',
          '#36A2EB',
          '#4BC0C0',
          '#9966FF'
        ]
      }]
    };
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Performance pour: {lesson.title}</h1>
        <Link to="/admin/dashboard" className="btn btn-secondary">Retour au tableau de bord</Link>
      </div>
      
      {/* Détails de la leçon */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Détails du thème</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <p><strong>ID:</strong> {lesson.id}</p>
                  <p><strong>Titre:</strong> {lesson.title}</p>
                  <p><strong>Nombre de leçons:</strong> {lesson.lessons_count}</p>
                </div>
                <div className="col-md-4">
                  <p><strong>Évaluation:</strong> {lesson.rating}</p>
                  <p><strong>Avis:</strong> {lesson.reviews}</p>
                  <p><strong>Prix:</strong> {lesson.price}</p>
                </div>
                <div className="col-md-4">
                  <p><strong>Durée:</strong> {lesson.time}</p>
                  <p><strong>Créé le:</strong> {new Date(lesson.created_at).toLocaleDateString()}</p>
                  <p><strong>Mis à jour le:</strong> {new Date(lesson.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tableau des résultats de quiz */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Résultats des quiz pour ce thème</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Email</th>
                      <th>Score (%)</th>
                      <th>Complété le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizResults.length > 0 ? (
                      quizResults.map((result, index) => (
                        <tr key={index}>
                          <td>{result.name}</td>
                          <td>{result.email}</td>
                          <td>{result.score}</td>
                          <td>{new Date(result.completed_at).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">Aucun résultat trouvé pour ce thème</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                      >
                        Précédent
                      </button>
                    </li>
                    
                    {[...Array(pagination.totalPages).keys()].map(page => (
                      <li 
                        key={page + 1} 
                        className={`page-item ${pagination.currentPage === page + 1 ? 'active' : ''}`}
                      >
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(page + 1)}
                        >
                          {page + 1}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                      >
                        Suivant
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Graphique de distribution des scores */}
      {quizResults.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h5>Distribution des scores</h5>
          </div>
          <div className="card-body">
            <ChartComponent 
              type="bar" 
              data={prepareScoreDistributionData()} 
              title="Distribution des scores pour ce thème"
              options={{
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPerformance;