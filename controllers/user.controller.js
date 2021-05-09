const uao = require('../dao/user.dao');
const auth = require('../auth/jwt');
// const jwt = require('jsonwebtoken')


class UserController {
    signUp = async (req,res)=>{
        try {
            // firstName, lastName, dob, gender, height, address, mobileNo, emailAddress
            const { firstName, lastName, emailAddress , password } = req.body;
            const newUser =  await uao.registerUser(firstName, lastName, emailAddress, password)
            res.send({
                status : 1,
                message : 'Registration Successful',
                data : newUser
            })
        } catch (err) {
            if(err.name == 'SequelizeUniqueConstraintError'){
                res.send({
                    status : 0,
                    message : 'Email already exists',
                    data : err.name
                })
            }else{
                res.send({
                    status : -1,
                    message : 'Please try again later',
                    data : err.name
                })
            }
            // console.log(err);
        }
    }
    signIn = async (req,res)=>{
        try {
            const { emailAddress, password } = req.body;
            const checkUser = await uao.loginUser(emailAddress, password);
            // console.log(checkUser);
            // console.log(checkUser);
            const status = checkUser.status;
            console.log(checkUser.userId ,"<<<<<<<<<<<<<<<<<<<<<<<< UserID")
            if(status == 2){
                const userDetails = { 
                    emailAddress : emailAddress,
                    userId : checkUser.userId
                 };
                const token = await auth.createToken(userDetails);
                const refreshToken = await auth.createRefreshToken(userDetails);
                res.send({
                    status : 1,
                    message : "Login successful",
                    data : req.body,
                    token,
                    refreshToken
                })
            }else if(status == 1){
                res.send({
                    status : 0,
                    message : "Password incorrect",
                    data : req.body
                })
            }else if(status == 0){
                res.send({
                    status : 0,
                    message : "Invalid email ID",
                    data : req.body
                })
            }else{
                res.send({
                    status : 0,
                    message : "Please try again later",
                    data : req.body
                })
            }
        } catch (err) {
            res.send({
                status : 0,
                message : "Please try again later",
                data : req.body
            })
        }
    }
    verifyRefreshToken = async (req,res)=>{
        try {
            const { refreshToken } = req.body;
            const { userId, emailAddress } = await auth.verifyRefreshToken(refreshToken,req.body.userId);
            const userDetails = { 
                emailAddress,
                userId
             };
            const createNewToken = await auth.createToken(userDetails);
            res.send({
                status : 1,
                message : 'Token created',
                data : createNewToken
            })
        } catch (err) {
            console.log(err.name);
            if(err.name == 'TokenExpiredError'){
                res.send({
                    status : 0,
                    message : 'Refresh Token Expired! Log In again',
                    data : err
                })
            }else if(err.name == 'Authorization denied'){
                res.send({
                    status : 0,
                    message : err.name,
                    data : err
                })
            }
            else{
                res.send({
                    status : 0,
                    message : 'Please try again later',
                    data : err
                })
            }
        }
    }
    forgotPassword = async (req,res) =>{
        try {
            const { emailAddress }  = req.body;
            const userForgot = await uao.forgotPassword(emailAddress);
            if(userForgot.status == 1){
                res.send({
                    status : 1,
                    message : "Reset link sent to your registered email ID",
                    data : userForgot.info
                })
            }else if(userForgot.status == 0){
                res.send({
                    status : 0,
                    message : "Email ID not registered",
                    data : userForgot.info 
                })
            }else{
                res.send({
                    status : 0,
                    message : "Please try again later",
                    data : userForgot.info
                })
            }
        } catch (err) {
            res.send({
                status : 0,
                message : "Please try again later",
                data : err
            })
        }
    }
    resetPassword = async (req,res) =>{
        try {
            const user = await uao.resetPassword(req.params.userId);
            if(!user){
                res.render('errorPage',{message : 'Authorization denied'});
                return;
            }
            const checkToken =  await auth.verifyTokenJWT(user,req.params.token);
            if(checkToken.status == 1){
                res.render('forgotPassword');
            }else{
                res.render('errorPage' , { message : 'page expired'});
            }
        } catch (err) {
            res.render('errorPage' , { message : 'forbidden'});
        }
    }
    resetPasswordPost = async (req,res) =>{
        try {
            // res.render('forgetPassword');
            const user = await uao.resetPassword(req.params.userId);
            if(!user){
                res.render('errorPage',{message : 'Authorization denied'});
                return;
            }
            const checkToken =  await auth.verifyTokenJWT(user,req.params.token);
            if(checkToken.status == 1){
                const hashData = await uao.hashgeneration(req.body.newPassword);
                user.password = hashData;                
                await user.save();
                res.render('passwordSuccess');
            }else{
                res.render('errorPage' , { message : 'page expired'});
            }
            console.log('reached',req.body.newPassword,req.body.confirmPassword);
        } catch (err) {
            console.log(err);
            res.render('errorPage' , { message : 'forbidden'});
        }
    }

}

const userController = new UserController();

module.exports = userController;
// async function register(req,res){
//     try{
//         const { firstName, lastName, dob, gender, height, address, mobileNo, emailAddress } = req.body;
//         const userDao = await uao.registerUser(firstName, lastName, dob, gender, height, address, mobileNo, emailAddress);
//         console.log(userDao,"In controller!!!!");
//         res.status(200).json({
//             success : true,
//             message : "Registration Successful",
//             data : userDao
//         })
//     }catch(err){
//         res.status(404).json({
//             success : false,
//             message : "Registration Unsuccessful",
//             data : err
//         })
//     }
// }
// module.exports.register = async (req,res)=>{
//     try{
//         const { firstName, lastName, dob, gender, height, address, mobileNo, emailAddress } = req.body;
//         const userDao = await uao.registerUser(firstName, lastName, dob, gender, height, address, mobileNo, emailAddress);
//         console.log(userDao,"In controller!!!!");
//         res.status(200).json({
//             success : true,
//             message : "Registration Successful",
//             data : userDao
//         })
//     }catch(err){
//         res.status(404).json({
//             success : false,
//             message : "Registration Unsuccessful",
//             data : err
//         })
//     }
// }