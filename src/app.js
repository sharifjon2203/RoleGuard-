import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import morgan from 'morgan'
import fs from 'fs'

import path from "path"

import { connectDB } from './db/index.js';

import adminRouter from './routes/admin.routes.js';
import userRouter from './routes/user.routes.js';

config();

const app = express();
const PORT = +process.env.PORT;



const _dirname = path.resolve()
// console.log(_dirname)


const filePath = fs.createWriteStream(path.join(_dirname, "logs.log"), { flags: "a" })




app.use(morgan("dev", { stream: filePath }))

app.use(express.json());
app.use(cookieParser());
await connectDB();

app.use('/admin', adminRouter);
app.use('/user', userRouter);


app.listen(PORT, () => console.log('Server running on port', PORT));
