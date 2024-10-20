const Joi = require('joi');

const registrationValidate = (req, res, next) => {
    
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(12).required(),
        lastName: Joi.string().min(2).max(12).required(),
        email: Joi.string().required(), 
        password: Joi.string().min(5).alphanum().required(),
    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({success : false, data :  err});
    } 
    next();
}

const loginValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(5).alphanum().required(),
    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({success : false, data : err.message});
    } 
    next();
}

const forgotPassValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({success : false, data : err.message});
    } 
    next();
}

const vOtpValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        otpCode: Joi.string().max(4).required(),
    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({success : false, data : err.message});
    } 
    next();
}

const changePassValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        newPassword: Joi.string().required(),
    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({success : false, data : err.message});
    } 
    next();
}

module.exports = {
    registrationValidate,
    loginValidate,
    forgotPassValidate,
    vOtpValidate,
    changePassValidate,
    
}