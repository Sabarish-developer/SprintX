import { signupHandler, signinHandler, otpGenerator, forgotPasswordHandler, resendOTPHandler, emailVerificationHandler } from "../controllers/authController.js";
import { Router } from "express";
const authRouter = Router();


authRouter.post("/signup",signupHandler);
authRouter.post("/generateotp",otpGenerator);
authRouter.post("/emailverification",emailVerificationHandler);
authRouter.post("/resendotp",resendOTPHandler);
authRouter.post("/signin",signinHandler);
authRouter.post("/forgotpassword",forgotPasswordHandler);

export default authRouter;