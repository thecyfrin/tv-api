const { v4: uuidv4,} = require('uuid');

module.exports = {
    generateUUID :  () => {
        const id = uuidv4();
        return id;
    },

    generateOtp : async () => {
        const otp = `${Math.floor(1000 +Math.random() * 9000)}`;
        return otp;
    
    }, 
    
    generateFiveCharOtp : async () => {
        const otp = `${Math.floor(10000 +Math.random() * 90000)}`;
        return otp;
    }
}