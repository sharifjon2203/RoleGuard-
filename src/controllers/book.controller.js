import Book from "../models/book.model.js"
import User from '../models/user.model.js';

import { bookValidator } from "../utils/book.validator.js"

import { catchError } from '../utils/error-response.js';


export class bookController {
    async createBook(req, res) {
        // console.log(req.user)
        // const { username }


        try {
            const { id, role } = req.user;
            const user = await User.findOne({ _id: id });
            if (!user) {
                catchError(res, 404, 'User not found');
            }
            if (role != "user") {
                catchError(res, 404, 'Only Users can create new book!');
            }


            const { error, value } = bookValidator(req.body)

            if (error) {
                throw new Error(`Error while creating book error: ${error}`)
            }

            const { title, author, year, genre } = value

            const newBook = await Book.create({ title, author, year, genre, user_id: id })

            return res.status(201).json({
                message: 'success',
                data: newBook
            })



        } catch (e) {
            return res.status(500).json({
                error: e.message
            })
        }

    }

    async getAllBooks(req, res) {
        try {
            const { id, role } = req.user;

            const books = await Book.find({ user_id: id })
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: books
            })

        } catch (e) {
            catchError(e, res)
        }
    }

}



