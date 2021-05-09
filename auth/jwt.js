const jwt = require('jsonwebtoken');
const {User} = require('../models/index');
require('dotenv').config();


class Auth{
    async createToken(userDetails){
        const token =  jwt.sign(userDetails,process.env.SECRET_TOKEN_JWT, {expiresIn : '1h'});
        return token;
    }
    async createTokenFiveMinute(userDetails,mergedSecretKey){
        const token =  jwt.sign(userDetails,mergedSecretKey, {expiresIn : '5m'});
        return token;
    }

    async createRefreshToken(userDetails){
        const refreshToken = jwt.sign(userDetails, process.env.REFRESH_TOKEN_JWT, {expiresIn : '1y'});
        return refreshToken;
    }
    async verifyToken(req,res,next){
        try {
            const token = req.headers.authorization.split(' ')[1];
            const userData = jwt.verify(token,process.env.SECRET_TOKEN_JWT);
            console.log(userData,"<<<<<<userData");
            if(userData.userId == req.body.userId){
                next();
            }else{
                res.send({
                    status : 0,
                    message : 'Authorization denied',
                    data : {
                        data : "No data available"
                    }
                })
            }
        } catch (err) {
            console.log(err);
            res.send({
                status : 0,
                message : "Authorization failed! Try Reloading the Page.",
                data : err
            })
        }
    }
    async verifyRefreshToken(refreshToken, userId){
        try{
            const data = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_JWT);
            console.log(data);
            if(data.userId == userId){
                return data;
            }else{
                const err1 = new Error();
                err1.name = 'Authorization denied';
                throw err1;
            }
        }catch(err){
            console.log(err);
            throw err;
        }
    }
    async verifyTokenJWT(user,token){
        try {
            const mergedSecretKey = user.password + process.env.SECRET_TOKEN_JWT;
            const userData = await jwt.verify(token,mergedSecretKey);
            // console.log(userData,"<<<<<<userData");
            if(userData.userId == user.id){
                return {status : 1}
            }else{
                return { status : 0}
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

const auth = new Auth();
module.exports = auth;


// module.exports.verifyToken = async (req,res,next)=>{
//     try {
//         const token = req.headers.Authorization.split(' ')[1];
//         console.log(token)
//         const userData = jwt.verify(token,process.env.SECRET_TOKEN_JWT);
//         if(userData){
//             next();
//         }
//     } catch (err) {
//         res.send({
//             status : 0,
//             message : "Authorization failed! Try Reloading the Page.",
//             data : err
//         })
//     }
// }