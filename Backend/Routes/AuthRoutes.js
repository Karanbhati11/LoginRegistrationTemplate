import express from "express";
import dotenv from "dotenv";
import { ExpressAuth } from "@auth/express";
import GoogleProvider from "@auth/express/providers/google";
import FacebookProvider from "@auth/express/providers/facebook";
import { validateLogin, validateSignup } from "../middleware/validator.js";
import { loginController } from "../controllers/LoginController.js";
import { signupController } from "../controllers/SignUpController.js";
import {
  googleSignIn,
  facebookSignIn,
} from "../Controllers/SocialLoginController.js";

dotenv.config();

const router = express.Router();

// Google Authentication Route
router.use(
  "/google/*",
  ExpressAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
      signIn: googleSignIn,
      redirect: async (url, baseUrl) => "http://localhost:3000/dashboard",
    },
  })
);

// Facebook Authentication Route
router.use(
  "/facebook/*",
  ExpressAuth({
    providers: [
      FacebookProvider({
        clientId: process.env.AUTH_FACEBOOK_ID,
        clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
      signIn: facebookSignIn,
      redirect: async (url, baseUrl) => "http://localhost:3000/dashboard",
    },
  })
);

// Login Route
router.post("/login", validateLogin, loginController);

// Signup Route
router.post("/signup", validateSignup, signupController);

export default router;
