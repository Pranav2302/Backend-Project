import express from "express"
import cookieParser from "cookie-parser"
import session from "express-session";
import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})
const app=express();

//middleware
app.use(cookieParser());
app.use(
  session({
    secret: process.env.googleClientSecret,
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}
  })
);