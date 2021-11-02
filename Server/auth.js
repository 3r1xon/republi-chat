const jwt = require('jsonwebtoken');

class Auth {

    generateToken = (user) => {
        
        return jwt.sign(user, process.env.ACCESS_TOKEN);
    };
    
    authToken = (req, res, next) => {
    
        const authHeader = req.headers['authorization'];
    
        const token = authHeader.split(' ')[1];
    
        if (token == null) return res.status(401).send({ 
            success: false, 
            message: "Authentication failed!"
        });
    
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) return res.status(403).send({ success: false, message: "Token invalid!" });
            req.user = user;
            next();
        });

    }
}

module.exports = Auth;