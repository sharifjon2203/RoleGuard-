import { Router } from "express";

import { UserGuard } from "../middleware/user.guard.js"
import { JwtAuthGuard } from "../middleware/jwt-auth.guard.js"
import { UserController } from "../controllers/user.controller.js"
import { bookController } from "../controllers/book.controller.js"
import { AdminController } from '../controllers/admin.controller.js';
import { guard } from "../middleware/admins.users.guard.js"

const router = Router()
const controller = new UserController()

const BookController = new bookController()
const adminController = new AdminController()

router
    .post("/register", controller.createUser)
    .post("/login", controller.loginUser)
    .post("/signout", JwtAuthGuard, UserGuard, controller.signOut)
    .post("/token", adminController.accessToken)
    .post("/books/create", JwtAuthGuard, guard, BookController.createBook)
    .get("/books/", JwtAuthGuard, guard, BookController.getAllBooks)


export default router;


