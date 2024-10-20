const  mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userId: {
        type: String,
        required: true, 
        index: true,
        unique: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
    }, 
    otpCode: {
        type: String,
    },
    country: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    tvDetails: [{
        "tvId": String,
        "tvName": String, 
        "tvLocation": String,
        "device": String,
        "model": String,
        "brand": String,
        "tvSerial": String,
        "product": String,
        "manufacturer": String,
    }],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    refreshToken :{
        type: String,
        default: "",
    },
    refreshTokenExpiration : {
        type: Date,
        default: Date.now,
    }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;


