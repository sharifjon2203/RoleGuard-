import { Router } from "express";


import { JwtAuthGuard } from "../middleware/jwt-auth.guard.js"
import { UserController } from "../controllers/user.controller.js"
import { bookController } from "../controllers/book.controller.js"
import { AdminController } from '../controllers/admin.controller.js';


const router = Router()
const controller = new UserController()

const BookController = new bookController()
const adminController = new AdminController()

router
    .post("/register", controller.createUser)
    .post("/login", controller.loginUser)
    .post("/signout", JwtAuthGuard, controller.signOut)
    .post("/token", adminController.accessToken)
    .post("/books/create", JwtAuthGuard, BookController.createBook)
    .get("/books/", JwtAuthGuard, BookController.getAllBooks)  


export default router;


