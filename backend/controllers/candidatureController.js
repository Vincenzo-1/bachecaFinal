import Candidature from "../models/Candidature.js";
import PostAnnunci from "../models/PostAnnunci.js";


export const creazioneCandidature = async (req , res) => {
    try{
      
      const { postAnnunciId, emailCandidato, descrizioneCandidato} = req.body; //Estraiamo dal body della richiesta i dati della candidatura:
// - postAnnunciId: è l'ID dell'annuncio di lavoro a cui ci si sta candidando. 
//   Questo ID è stato generato automaticamente da MongoDB quando l'annuncio è stato creato.
//   Viene usato per valorizzare il campo 'postAnnunci' nello schema Candidature.js, 
//   che è un riferimento (_ref_) all'annuncio di lavoro.

      const esistenzaDelLavoro = await PostAnnunci.findById(postAnnunciId);
      if (!esistenzaDelLavoro){
       return res.status(404).json({ message: "Lavoro non trovato"});
      }
      //passo i dati{} di req.body al costruttore Candidature()
      const nuoveCandidature = new Candidature({
        postAnnunci : postAnnunciId, //La candidatura non sarà collegata a nessun annuncio di lavoro. Non potrai sapere per quale annuncio è stata fatta quella candidatura.
                                     //Se il campo non è obbligatorio, la candidatura verrà salvata ma senza riferimento all’annuncio
        emailCandidato, 
        descrizioneCandidato
      });
      const candidaturaSalvata = await nuoveCandidature.save();
      res.status(201).json( candidaturaSalvata ); //è gia un {json}
    } catch(error){
        res.status(500).json({ message: "Errore nella creazione della candidatura" , error: error.message});
    }
};



export const visualizzazioneCandidatureFatte = async (req, res) => {
  try{
    //qua nel caso fare .populate("postAnnunci")
    
    const candidature = await Candidature.find({ emailCandidato : req.params.email}).select("postAnnunci dataCandidatura");
    //restituisce un array( vuoto se non trova nulla), non sarà mai undefined o null
    //conterrà il valore dell’email passato nell’URL del routes
    //Se l'array di candidature è vuoto allora è 0
    if(candidature.length === 0 ){
      res.status(404).json({message: "Nessuna candidatura trovata per questo Candiadato"});
    }
    res.json(candidature);
  } catch(error) {
    res.status(500).json({message: "Errore nella visualizzazione della candidatura" , error: error.message});
  }
};


//ma è più chiaro e manutenibile lasciarla in candidatureController, perché restituisce un elenco di candidature, non di annunci.
export const visualizzaCandidaturePerAnnuncio = async (req, res) => {
  try {
    const { postAnnunciId } = req.params;  // Prima estrai l'ID dall'URL

    // Ora cerca l'annuncio nel database
    const annuncio = await PostAnnunci.findById(postAnnunciId);

    // Controlla se l'annuncio esiste
    if (!annuncio) {
      return res.status(404).json({ message: "Annuncio non trovato" });
    }

    // Cerca tutte le candidature associate a quell'annuncio
    const candidature = await Candidature.find({ postAnnunci: postAnnunciId });

    if (candidature.length === 0) {
      return res.status(404).json({ message: "Nessuna candidatura trovata per questo annuncio" });
    }

    // Se tutto ok, rispondi con i dati dell'annuncio e le candidature
    return res.json({
      annuncio: {
        titolo: annuncio.titolo,
        azienda: annuncio.azienda,
        descrizione: annuncio.descrizione,
      },
      candidature,
    });

  } catch (error) {
    return res.status(500).json({message: "Errore nella visualizzazione delle candidature",
      error: error.message
    });
  }
};
