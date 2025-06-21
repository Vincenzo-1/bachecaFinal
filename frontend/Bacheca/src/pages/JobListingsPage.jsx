// src/pages/JobListingsPage.jsx

// Importa React e gli hook useState, useEffect, useCallback per la gestione dello stato e del ciclo di vita.
import React, { useState, useEffect, useCallback } from 'react';
// Importa Link da react-router-dom per la navigazione.
import { Link } from 'react-router-dom';
// Importa la funzione API per ottenere tutti gli annunci di lavoro.
import { getAllJobs } from '../services/api/jobService';
// Importa la funzione API per creare una nuova candidatura.
import { createApplication } from '../services/api/applicationService';
// Importa l'hook useAuth per accedere allo stato di autenticazione e ai dati dell'utente.
import useAuth from '../hooks/useAuth';
// Importa i componenti Modal, Button, Form, Alert da react-bootstrap per creare la modale di candidatura.
import { Modal, Button, Form, Alert } from 'react-bootstrap';

// Definizione del componente funzionale JobListingsPage.
// Questa pagina visualizza tutti gli annunci di lavoro disponibili pubblicamente.
const JobListingsPage = () => {
  // Stato per memorizzare la lista di tutti gli annunci di lavoro.
  const [jobs, setJobs] = useState([]);
  // Stato per indicare se i dati sono in fase di caricamento.
  const [isLoading, setIsLoading] = useState(true);
  // Stato per memorizzare eventuali messaggi di errore relativi al caricamento degli annunci.
  const [error, setError] = useState('');
  // Estrae lo stato di autenticazione (isAuthenticated) e i dati dell'utente (user) dal contesto Auth.
  const { isAuthenticated, user } = useAuth();

  // Stati specifici per la gestione della modale di candidatura:
  // - showApplyModal: booleano per controllare la visibilità della modale.
  const [showApplyModal, setShowApplyModal] = useState(false);
  // - selectedJobId: memorizza l'ID dell'annuncio per cui l'utente sta per candidarsi.
  const [selectedJobId, setSelectedJobId] = useState(null);
  // - applicationDescription: memorizza il testo inserito dall'utente nella textarea della modale.
  const [applicationDescription, setApplicationDescription] = useState('');
  // - applicationError: memorizza eventuali messaggi di errore relativi all'invio della candidatura.
  const [applicationError, setApplicationError] = useState('');
  // - isSubmittingApplication: booleano per indicare se la candidatura è in fase di invio.
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  // Funzione memoizzata (useCallback) per recuperare tutti gli annunci dal backend.
  const fetchAllJobs = useCallback(async () => {
    setIsLoading(true); setError(''); // Inizia caricamento, resetta errori.
    try {
      const response = await getAllJobs(); // Chiama API.
      setJobs(response.data || []);     // Imposta annunci o array vuoto.
    } catch (err) {
      console.error('Errore nel caricamento di tutti gli annunci:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Errore nel caricamento degli annunci.');
      if (err.response?.status === 404) setJobs([]); // Se 404 (nessun annuncio), imposta array vuoto.
    }
    setIsLoading(false); // Termina caricamento.
  }, []); // Array dipendenze vuoto: creata una volta.

  // Hook useEffect per chiamare fetchAllJobs al montaggio del componente.
  useEffect(() => { fetchAllJobs(); }, [fetchAllJobs]);

  // Funzione per mostrare la modale di candidatura.
  // Imposta l'ID dell'annuncio selezionato e resetta i campi della modale.
  const handleShowApplyModal = (jobId) => {
    setSelectedJobId(jobId);
    setApplicationDescription('');
    setApplicationError('');
    setShowApplyModal(true);
  };

  // Funzione per chiudere la modale di candidatura.
  // Resetta l'ID dell'annuncio selezionato.
  const handleCloseApplyModal = () => {
    setShowApplyModal(false);
    setSelectedJobId(null);
  };

  // Funzione per gestire l'invio del form di candidatura.
  const handleApplicationSubmit = async (e) => {
    e.preventDefault(); // Previene ricaricamento pagina.
    // Validazione semplice: la descrizione non deve essere vuota.
    if (!applicationDescription.trim()) {
      setApplicationError('La descrizione della candidatura è obbligatoria.');
      return;
    }
    setApplicationError(''); // Resetta errori.
    setIsSubmittingApplication(true); // Inizia sottomissione.
    try {
      // Chiama la funzione API createApplication con l'ID dell'annuncio e la descrizione.
      await createApplication({
        postAnnunciId: selectedJobId,
        descrizioneCandidato: applicationDescription
      });
      handleCloseApplyModal(); // Chiude la modale.
      alert('Candidatura inviata con successo!'); // Messaggio di successo.
      // TODO: Si potrebbe disabilitare il pulsante "Candidati Ora" per questo specifico annuncio
      //       dopo una candidatura andata a buon fine, per evitare candidature multiple.
    } catch (err) {
      console.error('Errore invio candidatura:', err.response?.data || err.message);
      setApplicationError(err.response?.data?.message || 'Errore durante l_invio della candidatura.');
    }
    setIsSubmittingApplication(false); // Termina sottomissione.
  };

  // Se i dati sono in caricamento, mostra uno spinner.
  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Caricamento annunci...</span>
        </div>
        <p>Caricamento annunci di lavoro...</p>
      </div>
    );
  }
  // Se c'è un errore e non ci sono annunci caricati, mostra solo l'errore.
  if (error && jobs.length === 0) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
   }

  // Struttura JSX principale della pagina.
  return (
    <div className="container mt-4">
      <h2>Tutti gli Annunci di Lavoro</h2>
      <p>Esplora le opportunità disponibili e candidati al ruolo che fa per te.</p>
      <hr />
      {/* Mostra un messaggio di errore se presente (anche se ci sono annunci già caricati). */}
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Se non ci sono annunci e non ci sono errori, mostra un messaggio informativo. */}
      {jobs.length === 0 && !error && (
        <div className="alert alert-info">Al momento non ci sono annunci di lavoro disponibili. Riprova più tardi!</div>
      )}
      {/* Se ci sono annunci, li visualizza in una griglia. */}
      {jobs.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 lg-row-cols-3 g-4"> {/* Griglia responsiva Bootstrap. */}
          {jobs.map((job) => ( // Itera sugli annunci.
            <div key={job._id} className="col"> {/* Colonna per ogni annuncio. */}
              <div className="card h-100 shadow-sm"> {/* Card Bootstrap. */}
                <div className="card-body d-flex flex-column"> {/* Corpo della card flex per layout. */}
                  <h5 className="card-title text-primary">{job.titolo}</h5> {/* Titolo annuncio. */}
                  <h6 className="card-subtitle mb-2 text-muted"> {/* Sottotitolo con azienda e località. */}
                    <i className="bi bi-building me-1"></i>{job.createdBy?.displayName || job.azienda} -
                    <i className="bi bi-geo-alt-fill ms-2 me-1"></i>{job.località}
                  </h6>
                  {/* Descrizione troncata. */}
                  <p className="card-text flex-grow-1">{job.descrizione.substring(0, 150)}{job.descrizione.length > 150 ? '...' : ''}</p>
                  <p className="card-text">
                    <small className="text-muted"> {/* Data pubblicazione. */}
                      Pubblicato il: {new Date(job.dataPubblicazione).toLocaleDateString()}
                    </small>
                  </p>
                  {/* Se l'utente è autenticato e di tipo 'applier', mostra il pulsante "Candidati Ora". */}
                  {isAuthenticated && user?.userType === 'applier' && (
                    <button onClick={() => handleShowApplyModal(job._id)} className="btn btn-success mt-auto align-self-start">
                      <i className="bi bi-send-check-fill me-2"></i>Candidati Ora
                    </button>
                  )}
                  {/* Se l'utente non è autenticato o non è 'applier', mostra un link per fare login. */}
                  {(!isAuthenticated || (isAuthenticated && user?.userType !== 'applier')) && (
                     <Link to="/login" className="btn btn-outline-primary mt-auto align-self-start">
                        <i className="bi bi-box-arrow-in-right me-2"></i>Accedi per Candidarti
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Definizione della Modale Bootstrap per la candidatura. */}
      <Modal show={showApplyModal} onHide={handleCloseApplyModal} centered>
        <Modal.Header closeButton> {/* Intestazione della modale con pulsante di chiusura. */}
          <Modal.Title>Candidati per l'Annuncio</Modal.Title>
        </Modal.Header>
        {/* Form interno alla modale, gestito da handleApplicationSubmit. */}
        <Form onSubmit={handleApplicationSubmit}>
          <Modal.Body> {/* Corpo della modale. */}
            {/* Visualizza eventuali errori specifici della sottomissione della candidatura. */}
            {applicationError && <Alert variant="danger">{applicationError}</Alert>}
            <Form.Group className="mb-3"> {/* Gruppo di controlli del form Bootstrap. */}
              <Form.Label>Messaggio/Descrizione Candidatura</Form.Label>
              <Form.Control
                as="textarea" // Tipo di input: textarea.
                rows={5}      // Numero di righe visibili.
                placeholder="Inserisci una breve presentazione o perché sei interessato/a..."
                value={applicationDescription} // Valore legato allo stato.
                onChange={(e) => setApplicationDescription(e.target.value)} // Aggiorna stato al cambio.
                required // Campo obbligatorio.
                disabled={isSubmittingApplication} // Disabilitato durante l'invio.
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer> {/* Piè di pagina della modale. */}
            {/* Pulsante per annullare/chiudere la modale. */}
            <Button variant="secondary" onClick={handleCloseApplyModal} disabled={isSubmittingApplication}>
              Annulla
            </Button>
            {/* Pulsante per inviare la candidatura. */}
            <Button variant="primary" type="submit" disabled={isSubmittingApplication}>
              {isSubmittingApplication ? ( // Testo condizionale con spinner durante l'invio.
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Inviando...</>
              ) : 'Invia Candidatura'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

// Esporta il componente JobListingsPage.
export default JobListingsPage;
