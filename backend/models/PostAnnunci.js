import mongoose from "mongoose";

const postAnnunciSchema = new mongoose.Schema({
    titolo: {
        type: String,
        required: [true, "Inserire titolo"]
    },
    azienda: {
        type: String,
        required: [true, "Inserire nome azienda"]
    },
    descrizione: {
        type: String,
        required: [true, "Inserire descrizione"]
    },
    località:{
        type: String,
        required: [true, "Inserire località"]
    },
    dataPubblicazione: {
        type: Date,
        default: Date.now
    }
});


const PostAnnunci = mongoose.model("PostAnnunci", postAnnunciSchema);
export default PostAnnunci;