const jwt = require('jsonwebtoken');
const UserModel = require("../../models/UserModel");

const { generateUUID, generateOtp, generateFiveCharOtp } = require("../utils/generator");
const { hashData, compareHashData } = require("../utils/hash-class");
const { sendOtp } = require('../send-email');

const userRegistration = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if(user) {
            return res.status(401).json({ success : false,  message: 'email-already-registered' });
        }
    
        const id = generateUUID();        
        const newUser = new UserModel(req.body);

        newUser.userId = id;
        newUser.profilePic = `https://ui-avatars.com/api/?name=${req.body.firstName}+${req.body.lastName}&background=random&color=fff&bold=true&size=128`;
        newUser.password = await hashData(req.body.password);
        
        await newUser.save();
        const tokenObject = {
            id : newUser.userId,
            firstName : newUser.firstName,
            lastName : newUser.lastName,
            email : newUser.email,
            profilePic: newUser.profilePic,
            tvDetails: newUser.tvDetails,
            createdAt: newUser.createdAt,    
        };

        const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {expiresIn : '1d'});
        const refreshToken = jwt.sign(tokenObject, process.env.REFRESH_SECRET, {expiresIn: '30d'});
        
        const refreshTokenExpiration = new Date();
        refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 30);
        
        newUser.refreshToken = refreshToken;
        newUser.refreshTokenExpiration = refreshTokenExpiration;
        
        const response = await newUser.save();
        if(response.isModified) {
            return res.status(201).json({ success : true, jwtToken, refreshToken, tokenObject });
        } else {
            return res.status(500).json({success : false, message: 'database-update-error'});
        }

    } catch (error) {
        return res.status(500).json({ success : false, data: error.message  });
    }

};

const userLogin = async (req, res) => {
    try {
        
        const user = await UserModel.findOne({email: req.body.email});
        if(!user) {
            return res.status(401).json({ success : false, message: 'user-not-found'  });  
        }
        const isPassEqual = await compareHashData(req.body.password, user.password);
        
        if(!isPassEqual) {
            return res.status(401).json({ success : false,  message: 'wrong-password' });
        }

        const tokenObject = {
            id : user.userId,
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            profilePic: user.profilePic,
            tvDetails: user.tvDetails,
            createdAt: user.createdAt,    
        };
        
        const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {expiresIn : '1d'});
        const refreshToken = jwt.sign(tokenObject, process.env.REFRESH_SECRET, {expiresIn: '30d'});
        
        const refreshTokenExpiration = new Date();
        refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 30);
        
        user.refreshToken = refreshToken;
        user.refreshTokenExpiration = refreshTokenExpiration;
        
        const response = await user.save();
        if(response.isModified) {
            return res.status(201).json({ success : true, jwtToken, refreshToken, tokenObject });
        } else {
            return res.status(500).json({success : false, message: 'database-update-error'});
        }

    } catch (error) {
        return res.status(500).json({ success : false, data: error.message  });
        
    }
}

const forgotPassword = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if(!user) {
            return res.status(401).json({ success : false, message: 'user-not-found'  });  
        }
        
        const otp = await generateOtp();
        user.otpCode = await hashData(otp);

        const response = await user.save();
        if(response.isModified) {
            await sendOtp({ email: req.body.email, firstName: user.email, otpCode: otp });
            return res.status(201).json({ success : true, message: "otp-sent", data: user.email });
        } else {
            return res.status(500).json({success : false, message: 'database-update-error'});
        }
    } catch (error) {
        return res.status(500).json({ success : false, data: error.message  });
        
    }
}


const verifyOtp = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if(!user) {
            return res.status(401).json({success : false,  message: 'email-not-found'});
        }
        
        // const tokenObject = {
        //     email: user.email,
        // };
        // const jwtToken = jwt.sign(tokenObject, process.env.CHANGE_PASS_SECRET, {expiresIn : '8m'});

        // return res.status(201).json({ success : true,  jwtToken, tokenObject });

        const isOtpEqual = await compareHashData(req.body.otpCode, user.otpCode);
        if(!isOtpEqual) {
            return res.status(401).json({ success : false, message: 'wrong-otp'});
        }
        
        user.otpCode = await generateFiveCharOtp();
        const tokenObject = {
            email: user.email,
        };
        const jwtToken = jwt.sign(tokenObject, process.env.CHANGE_PASS_SECRET, {expiresIn : '8m'});

        const response = await user.save();
        if(response.isModified) { 
            return res.status(201).json({ success : true,  jwtToken, tokenObject });
        } else {
            return res.status(500).json({success : false, message: 'updating-refresh-token-error'});
        }
        
    } catch (error) {
        return res.status(500).json({ success : false, data: error.message  });
    }
}

const changeForgottenPassword = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if(!user) {
            return res.status(401).json({success : false,  message: 'email-not-found'});
        }

        const isPassEqual = await compareHashData(req.body.newPassword, user.password);
        if(isPassEqual) {
            return res.status(401).json({ success : false,  message: 'used-previous-password' });
        }
        
        user.password = await hashData(req.body.newPassword);

        const response = await user.save();
        if(response.isModified) {
            return res.status(201).json({ success : true, message: 'password-changed-successful' });
        } else {
            return res.status(500).json({success : false, data: 'database-update-error'});
        }   
    } catch (error) {
        return res.status(500).json({ success : false, data: error.message  });
    }
}


const completeTvData = async (req, res) => {
    try {
        console.log(req.body);
    
      // Find the user document that has a TV with the given tvId
      const user = await UserModel.findOne({
        email: req.body.email,
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'user-not-found' });
      }
      
      console.log(`User TV: ${user.tvDetails}`);

     // Check if tvDetails exists and find the specific TV
     const tvFound = user.tvDetails.find(tv => (tv.tvSerial === req.body.tvSerial && tv.manufacturer === req.body.manufacturer));
    
     // If no matching TV is found
     if (tvFound) {
        tvFound.tvId = req.body.tvDetails.tvId;
        tvFound.tvName = req.body.tvName;
        tvFound.tvLocation = req.body.tvLocation;
        const response = await user.save();
      // If the save was successful, return the updated TV details
      if (response.isModified) {
        console.log("done");
        return res.status(200).json({ success: true, data: user.tvDetails });
      } else {
        return res.status(500).json({ success: false, message: 'database-update-error' });
      }
     }

     user.tvDetails = {
         "tvId": req.body.tvId,
         "tvName": req.body.tvName,
         "tvLocation": req.body.tvLocation,
        "device": req.body.device,
        "model": req.body.model,
        "brand": req.body.brand,
        "tvSerial": req.body.serialNumber,
        "product": req.body.product,
        "manufacturer": req.body.manufacturer,
    }
      
  
      // Save the user document after updating the tvDetails array
      const response = await user.save();
  
      // If the save was successful, return the updated TV details
      if (response.isModified) {
        console.log("full tv done");
        return res.status(200).json({ success: true, data: user.tvDetails });
      } else {
        return res.status(500).json({ success: false, message: 'database-update-error' });
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error completing TV data:', error);
      res.status(500).json({ success: false, message: 'server-error' });
    }
  };
  


module.exports = {
    userRegistration,
    userLogin,
    forgotPassword,
    verifyOtp,
    changeForgottenPassword,
    completeTvData
}