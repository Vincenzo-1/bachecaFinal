import mongoose from 'mongoose';
//import bcrypt from 'bcrypt';
//bcrypt serve per proteggere le password degli utenti (trasforma (hasha) le password)
// in una forma sicura e non reversibile prima di salvarle nel database


const utenteSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    mostraNome: {
        type: String, 
        trim: true //fa sì che eventuali spazi vuoti all’inizio o alla fine del valore vengano automaticamente rimossi quando il dato viene salvato nel database.
    },
    creatoIl: {
        type: Date,
        default: Date.now
    },
    
    ultimoLogin: {
        type: Date,
        default: Date.now
    },
    
    tipoUtente: { 
        type: String,
        enum: ['candidato', 'azienda'], 
        required: true 
    }
});

const Utente = mongoose.model("Utente", utenteSchema);
export default Utente;




























 // pre save è un hook nativo che aggiunge allo schema mongoose di un utente
 //Prima di salvare un documento utente nel database:
 //Controlla se il campo password è stato modificato.
 //Se sì, genera un "salt" e cripta la password usando bcrypt.
 //Sostituisce la password in chiaro con quella criptata.
 //Poi salva il documento.
 // Middleware per hashare la password prima di salvare l'utente 
 //PRIMA DI SALVARE (pre (save)) esegui questa funzione
 //normalmente presave si usa per fare operazioni prima di salvare un documento nel database, in questo caso per hashare la password
 

 //viene attivato prima di salvare un documento utente con il metodo save() perchè si trova in questo modello
/*utenteSchema.pre("save", async function (next) {
    if (!this.isModified("password")) { //  La funzione deve essere una funzione tradizionale (non arrow) per preservare il contesto 'this'.
        return next();
    } //next è il dubbio
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    //next();
}); */



/* Perché il salt?
Senza salt, password identiche avrebbero hash identici:
javascript//
// Senza salt (INSICURO)
hash("123456") = "e10adc3949ba59abbe56e057f20f883e"
hash("123456") = "e10adc3949ba59abbe56e057f20f883e" // Stesso hash!

// Con salt (SICURO)
hash("123456" + salt1) = "$2b$10$abc...xyz"
hash("123456" + salt2) = "$2b$10$def...uvw" // Hash diversi!*/


/* [Questa funzione ti serve per verificare se la password inserita dall’utente durante il login è corretta.
//In pratica, ogni oggetto utente (user) che prendi dal database avrà il metodo
//comparePassword e potrai chiamarlo così:
//user.comparePassword('passwordInserita')
//Quando usi userSchema.methods, stai creando tu un nuovo metodo che sarà 
//disponibile su ogni documento (oggetto) creato con quello schema.
userSchema.methods.comparePassword = async function (PasswordCandidata) {
    if (!this.password) 
        return false;
    return
}; ]*/

//PER OAUTH QUESTO COMPAREPASSWORD NON VIENE USATO, L'AUTENTICAZIONE AVVIENE TRAMITE
//PROVIDER ESTERNO E NON C'è BISOGNO DI CONFRONTARE UNA PASSWORD INSERITA DALL'UTENTE
//CON QUELLA SALVATA NEL DATABASE