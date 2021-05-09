const {User} = require('../models/index');
const { Op } = require('sequelize');
const userController = require('../controllers/user.controller');
const nodemailer = require('nodemailer');
require('dotenv').config();
const nodeMailer = require('../nodemailer_email/nodemailer_email');
const jwt = require('jsonwebtoken');


class Uao {
    async registerUser(firstName, lastName, emailAddress, password) {
        try {
            const data = {
                firstName,
                lastName,
                emailAddress,
                password
            }
            const user = await User.create(data);
            // console.log(user.toJSON());
            return user;
        } catch (err) {
            throw err;
        }
    }
    async loginUser(emailAddress, password) {
        try {
            console.log("ahdkjshdjkshad")
            const checkUser = await User.findAll({
                where: {
                    emailAddress: emailAddress
                }
            });
            // checkUser[0].password = await (new User()).generateHash("AAbb12()");
            // await checkUser[0].save();

            if (checkUser.length > 0) {
                const user1 = new User();
       
                const userCheck = await user1.validPassword(password, checkUser[0].password);
                // console.log(userCheck);
                if (userCheck) {
                    return { status: 2, userId : checkUser[0].id };
                } else {
                    return { status: 1 };
                }
            } else {
                return { status: 0 };
            }
        } catch (err) {
            throw err;
        }
    }
    async forgotPassword(emailAddress) {
        try {
            const userCheck = await User.findOne({
                where: {
                    emailAddress
                }
            })
            if (userCheck) {
                const info = await nodeMailer.emailSenderFunc(userCheck);
                return { 
                    status : 1,
                    info
                }

            } else {
                return { 
                    status: 0,
                    info : emailAddress
                }
            }
        } catch (err) {
            // return {status : -1}
            throw err;
        }
    }
    async resetPassword(userId){
        try {
            const user1 = await User.findOne({
                where : {
                    id : userId
                }
            });
            return user1;
        } catch (err) {
            throw err;
        }
        
    }
    async hashgeneration(password){
        try {
            const user1 = new User();
            const hashData = user1.generateHash(password);
            return hashData;
        } catch (err) {
            throw err;
        }
    }
    
}

const uao = new Uao();

module.exports = uao;