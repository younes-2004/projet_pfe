import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/admin/dashboard">Administration</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#adminNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`} 
                to="/admin/dashboard"
              >
                Tableau de bord
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`} 
                to="/admin/users"
              >
                Utilisateurs
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;