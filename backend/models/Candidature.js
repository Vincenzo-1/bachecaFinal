import mongoose from "mongoose";

const candidatureSchema = new mongoose.Schema({
    postAnnunci : {
        type: mongoose.Schema.Types.ObjectId, //prendo l'id dell'annuncio
        ref: "PostAnnunci", //ref al modello postAnnunci
        required: true
    },
    emailCandidato: {
        type: String,
        required: [true, "Inserire email"]
    },
    descrizioneCandidato : {
        type : String, 
        required : [true, "Inserire descrizione"]
    },
    dataCandidatura: {
        type: Date,
        default: Date.now //data di candidatura, se non specificata prende la data attuale
    }
    //Aggiungere statoCandidaura
 });
 

 const Candidature = mongoose.model("Candidature", candidatureSchema);
 export default Candidature;

 //IMPORTANTE >> FARE IL COLLEGAMENTO CON ATLAS 