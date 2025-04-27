import { Schema, model } from "mongoose"
import pkg from "joi";
// const { string } = pkg;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },

    author: {
        type: String,
        required: true,

    },
    year: {
        type: Number,

    },
    genre: {
        type: String,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true })



const Book = model('Book', bookSchema)
export default Book;