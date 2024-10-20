const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    if(!req.headers["authorization"]) {
        return res.status(400).json({success : false, message: "token-required"});
    }

    try {
        const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET);
        if(!decoded) {
            return res.status(403).json({ success : false, message: "invalid-token"});
        }

        next();
    } catch (error) {
        return res.status(403).json({ success : false, message: "expired-token", data : error });
    }
}

const ensureChange = (req, res, next) => {
    if(!req.headers["authorization"]) {
        return res.status(400).json({success : false, message: "token-required"});
    }

    try {
        const decoded = jwt.verify(req.headers['authorization'], process.env.CHANGE_PASS_SECRET);
        if(!decoded) {
            return res.status(403).json({ success : false, message: "invalid-token"});
        }

        next();
    } catch (error) {
        return res.status(403).json({ success : false, message: "expired-token", data : error });
    }
}

module.exports = {
    ensureAuthenticated,
    ensureChange,

};