import jwt from "jsonwebtoken"

import User from '../models/user.model.js';

import { catchError } from '../utils/error-response.js';
import { adminValidator } from '../utils/admin.validation.js';
import { decode, encode } from '../utils/bcrypt-encrypt.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generate-token.js';
import { transporter } from "../utils/mailer.js"

export class UserController {



    async loginUser(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                catchError(res, 404, 'User not found');
            }
            const isMatchPassword = await encode(password, user.hashedPassword);
            if (!isMatchPassword) {
                catchError(res, 400, 'Invalid password');
            }
            const payload = { id: user._id, role: "user" };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });


            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                accessToken
            });


        } catch (error) {
            console.log(error)
            catchError(res, 500, error.message);
        }
    }


    async signOut(req, res) {
        try {

            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                catchError(res, 401, "Refresh token not found")
            }
            const decodeToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)
            if (!decodeToken) {
                catchError(res, 401, "refresh token expired")
            }

            res.clearCookie("refreshToken")
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: {}
            })
        } catch (e) {
            catchError(res, 500, e)
        }
    }

    async createUser(req, res) {
        try {
            const { error, value } = adminValidator(req.body);
            if (error) {
                catchError(res, 400, error);
            }
            const { username, password } = value;
            const hashedPassword = await decode(password, 7);
            const user = await User.create({
                username, hashedPassword,
            });
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: user
            });
        } catch (error) {
            console.log(error)
            if (error.code === 11000) {
                return catchError(res, 409, "User already exists!");
            }
            catchError(res, 500, error);
        }
    }


}


