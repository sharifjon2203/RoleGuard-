import jwt from "jsonwebtoken"
import { generateOtp, verifyOtp } from "../utils/generate.otp.js"
import { getCache, setCache } from "../utils/cache.js"


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

            const otp = await generateOtp()

            const mailMessage = {
                from: process.env.SMTP_USER,
                to: 'sharifjoncodm@gmail.com',
                subject: 'OTP Code:',
                text: `OTP Code: ${otp}`,
            };

            transporter.sendMail(mailMessage, function (err, info) {
                if (err) {
                    console.log(`Error on sending to mail: ${err}`)
                    catchError(res, 400, err);
                } else {
                    // console.log(info);
                    setCache(user.username, otp)

                }
            });



            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {}
            });


            // const payload = { id: user._id, role: "user" };
            // const accessToken = generateAccessToken(payload);
            // const refreshToken = generateRefreshToken(payload);
            // res.cookie('refreshToken', refreshToken, {
            //     httpOnly: true,
            //     secure: true,
            //     maxAge: 30 * 24 * 60 * 60 * 1000
            // });


            // return res.status(200).json({
            //     statusCode: 200,
            //     message: 'success',
            //     accessToken
            // });


        } catch (error) {
            console.log(error)
            catchError(res, 500, error.message);
        }
    }

    async confirmLoginUser(req, res) {
        try {
            const { username, otp } = req.body
            const user = await User.findOne({ username })

            if (!user) {
                catchError(res, 404, "User not found")
            }

            const otpCache = getCache(username)
            if (!otpCache || otp != otpCache) {
                catchError(res, 500, "OTP expired")
            }

            const payload = { id: user._id, role: user.role };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: accessToken
            })


        } catch (e) {
            catchError(res, 500, e.message)
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
                return catchError(res, 400, error);
            }
            const { username, password, email } = value;
            const hashedPassword = await decode(password, 7);

            const otp = await generateOtp()

            if (!otp) {
                return catchError(res, 500, "Error while creating OTP Code");
            }


            const mailMessage = {
                from: process.env.SMTP_USER,
                to: email,
                subject: "OTP Code",
                text: `OTP Code: ${otp}`
            }

            transporter.sendMail(mailMessage, (err, info) => {
                if (err) {
                    // console.log(err)
                    return catchError(res, 400, "error while sending mail")
                } else {
                    console.log(info)
                }

            })

            const user = await User.create({
                username, hashedPassword, email
            });
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: user
            });
        } catch (error) {
            // console.log(error)
            if (error.code === 11000) {
                return catchError(res, 409, "User already exists!");
            } else {
                return catchError(res, 500, error);
            }

        }
    }


}


