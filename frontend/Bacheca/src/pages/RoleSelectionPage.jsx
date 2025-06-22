// src/pages/RoleSelectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { setUserRole } from '../services/api/authService';

const RoleSelectionPage = () => {
  const { user, isAuthenticated, isLoading, refreshAuthStatus } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If loading auth status, wait.
    if (isLoading) {
      return;
    }
    // If not authenticated, redirect to home (which has login).
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    // If authenticated and user type is already set, redirect to appropriate dashboard.
    if (user && user.tipoUtente) {
      if (user.tipoUtente === 'azienda') {
        navigate('/dashboard-azienda');
      } else if (user.tipoUtente === 'candidato') {
        navigate('/dashboard-applier');
      } else {
        // Should not happen if tipoUtente is only 'azienda' or 'candidato'
        navigate('/');
      }
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  const handleRoleSelection = async (role) => {
    setIsSubmitting(true);
    setError('');
    try {
      await setUserRole(role); // API call
      await refreshAuthStatus(); // Refresh context to get updated user with tipoUtente
      // The useEffect above should handle redirection once refreshAuthStatus updates the user object.
      // However, to be more explicit or if useEffect doesn't catch it immediately:
      if (role === 'azienda') {
        navigate('/dashboard-azienda');
      } else if (role === 'candidato') {
        navigate('/dashboard-applier');
      }
    } catch (err) {
      console.error('Errore selezione ruolo:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Si è verificato un errore durante la selezione del ruolo.');
      setIsSubmitting(false);
    }
    // setIsSubmitting(false); // Already handled by navigation or error
  };

  // Render nothing or a loading indicator if initial checks are still processing
  // or if redirection is about to happen via useEffect.
  if (isLoading || !isAuthenticated || (user && user.tipoUtente)) {
    return (
        <div className="container mt-5 text-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Caricamento...</span>
            </div>
            <p>Verifica informazioni utente...</p>
        </div>
    );
  }

  return (
    <div className="container mt-5 text-center">
      <h2>Completa il Tuo Profilo</h2>
      <p className="lead">Seleziona il tipo di account che desideri creare:</p>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <div className="row mt-4 justify-content-center">
        <div className="col-md-4 mb-3">
          <button
            className="btn btn-primary btn-lg w-100"
            onClick={() => handleRoleSelection('candidato')}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Attendere...' : 'Sono un Candidato'}
          </button>
          <small className="form-text text-muted">Cerca opportunità di lavoro e invia la tua candidatura.</small>
        </div>
        <div className="col-md-4 mb-3">
          <button
            className="btn btn-success btn-lg w-100"
            onClick={() => handleRoleSelection('azienda')}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Attendere...' : 'Sono un\'Azienda'}
          </button>
          <small className="form-text text-muted">Pubblica annunci di lavoro e trova i candidati ideali.</small>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
