const express = require("express");
const { registrationValidate, forgotPassValidate, vOtpValidate, changePassValidate, loginValidate } = require("../modules/utils/req-validation");
const { userRegistration, userLogin, forgotPassword, verifyOtp, changeForgottenPassword, completeTvData } = require("../modules/controller/user-controller");
const { ensureAuthenticated, ensureChange } = require("../modules/utils/auth");
const { confirmTvConnection, confirmationFromTv, tvRegister, postFromA, postFromB } = require("../modules/controller/tv-socket-controller");

const userRoute = express.Router();

userRoute.get("/", (req, res) => {
    res.send({message: "App is running.."});
    console.log("it's called");
});

userRoute.post('/logap', loginValidate, userLogin);
userRoute.post('/registration', registrationValidate, userRegistration);

//Forget Password
userRoute.post('/forgot-pass', forgotPassValidate, forgotPassword);
userRoute.post('/verify-otp', vOtpValidate, verifyOtp);
userRoute.post('/change-forgotten-password', ensureChange, changePassValidate, changeForgottenPassword)
userRoute.post('/complete-tv-details', completeTvData);

userRoute.post('/confirm-request', confirmTvConnection); 
userRoute.post('/confirmation-tv', confirmationFromTv);

userRoute.post('/post-mobile', postFromA);
userRoute.post('/post-tv/:userId', postFromB);

module.exports = userRoute;
