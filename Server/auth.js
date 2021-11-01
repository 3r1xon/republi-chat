const jwt = require('jsonwebtoken');

class Auth {

    generateToken = (req, res, next) => {
    
        const user = {
            userName: req.body.userName
        };
        
        const token = jwt.sign(user, process.env.ACCESS_TOKEN);
    
        console.log(token);
    
        res.status(200).send({ success: true, data: token });
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