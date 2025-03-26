import { signupHandler, signinHandler, emailVerificationHandler, forgotPasswordHandler, resendOTPHandler } from "../controllers/authController.js";
import { Router } from "express";
const authRouter = Router();


authRouter.post("/signup",signupHandler);
authRouter.post("/emailverification",emailVerificationHandler);
authRouter.post("/resendotp",resendOTPHandler);
authRouter.post("/signin",signinHandler);
authRouter.post("/forgotpassword",forgotPasswordHandler);

export default authRouter;