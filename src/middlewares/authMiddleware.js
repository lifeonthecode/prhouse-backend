const { errorResponse } = require("../utils/utils")
const jwt = require('jsonwebtoken');



const authMiddleware = async (req, res, next) => {
    try {

        const {token} = req.cookies;
        if(!token) {
            return errorResponse(res, 403, 'Forbidden Access!')
        }

        // jwt.verify(access_token, process.env.ACCESS_TOKEN, (error, decoded) => {
        //     if(error) {
        //         return errorResponse(res, 403, 'Invalid token!');
        //     }
        //     req.user = decoded;
        //     next(); // continue to next route
        // })

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user= decoded;
        next();
        
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
};

module.exports = {
    authMiddleware,
}