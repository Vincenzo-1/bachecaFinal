// src/pages/MyApplicationsPage.jsx

// Importa React e gli hook useState, useEffect, useCallback per la gestione dello stato e del ciclo di vita.
import React, { useState, useEffect, useCallback } from 'react';
// Importa la funzione API per ottenere le candidature inviate dall'utente autenticato.
import { getMyApplications } from '../services/api/applicationService';
// Importa Link da react-router-dom per permettere la navigazione, ad esempio, alla pagina degli annunci.
import { Link } from 'react-router-dom';

// Definizione del componente funzionale MyApplicationsPage.
// Questa pagina mostra all'utente 'applier' la lista delle candidature che ha inviato.
const MyApplicationsPage = () => {
  // Stato per memorizzare l'array delle candidature dell'utente.
  const [applications, setApplications] = useState([]);
  // Stato per indicare se i dati sono in fase di caricamento.
  const [isLoading, setIsLoading] = useState(true);
  // Stato per memorizzare eventuali messaggi di errore.
  const [error, setError] = useState('');

  // Funzione memoizzata (useCallback) per recuperare le candidature dell'utente dal backend.
  const fetchMyApplications = useCallback(async () => {
    setIsLoading(true); // Inizia il caricamento.
    setError('');       // Resetta errori precedenti.
    try {
      // Chiama la funzione getMyApplications del servizio API.
      // L'endpoint backend dovrebbe essere protetto e restituire solo le candidature dell'utente autenticato.
      const response = await getMyApplications();
      // Imposta lo stato 'applications' con i dati ricevuti (o un array vuoto se response.data è null/undefined).
      setApplications(response.data || []);
    } catch (err) {
      // Gestisce gli errori della chiamata API.
      console.error('Errore caricamento mie candidature:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Errore nel caricamento delle tue candidature.');
      // Se l'API restituisce 404 (es. nessuna candidatura trovata, a seconda dell'implementazione backend),
      // si assicura che 'applications' sia un array vuoto.
      if (err.response?.status === 404) setApplications([]);
    }
    setIsLoading(false); // Termina il caricamento.
  }, []); // Array di dipendenze vuoto: la funzione viene creata una sola volta.

  // Hook useEffect per chiamare fetchMyApplications al montaggio del componente.
  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]); // Dipende da fetchMyApplications (che è memoizzata).

  // Se i dati sono in caricamento, mostra uno spinner e un messaggio.
  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
        <p>Caricamento delle tue candidature...</p>
      </div>
    );
  }

  // Struttura JSX del componente.
  return (
    <div className="container mt-4">
      <h2>Le Mie Candidature</h2> {/* Titolo della pagina. */}
      <hr /> {/* Separatore. */}
      {/* Mostra un messaggio di errore se 'error' è presente. */}
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Se il caricamento è terminato, non ci sono errori e non ci sono candidature,
          mostra un messaggio informativo con un link per sfogliare gli annunci. */}
      {!isLoading && applications.length === 0 && !error && (
        <div className="alert alert-info">
          Non hai ancora inviato nessuna candidatura. <Link to="/annunci">Sfoglia gli annunci</Link> per iniziare!
        </div>
      )}
      {/* Se ci sono candidature, le visualizza in una lista. */}
      {applications.length > 0 && (
        // Utilizza list-group di Bootstrap per la lista.
        <div className="list-group">
          {/* Itera sull'array 'applications' e renderizza un elemento per ogni candidatura. */}
          {applications.map(app => (
            // Elemento della lista con chiave univoca.
            <div key={app._id} className="list-group-item mb-3">
              {/* Titolo dell'annuncio a cui si è candidato.
                  Usa optional chaining (?.) per accedere a 'app.postAnnunci.titolo' in modo sicuro,
                  nel caso 'postAnnunci' non fosse popolato o fosse null. */}
              <h5 className="mb-1">Annuncio: {app.postAnnunci?.titolo || 'Titolo non disponibile'}</h5>
              {/* Dettagli dell'azienda e località dell'annuncio. */}
              <p className="mb-1 text-muted">
                Azienda: {app.postAnnunci?.azienda || 'N/D'} - Località: {app.postAnnunci?.località || 'N/D'}
              </p>
              {/* Descrizione/messaggio inviato con la candidatura. */}
              <p className="mb-1"><strong>Tua descrizione:</strong> {app.descrizioneCandidato}</p>
              {/* Data di invio della candidatura, formattata. */}
              <small className="text-muted">Inviata il: {new Date(app.dataCandidatura).toLocaleDateString()}</small>
              {/* TODO: Commento per una futura implementazione dello stato della candidatura (es. Inviata, In Revisione). */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Esporta il componente MyApplicationsPage.
export default MyApplicationsPage;
