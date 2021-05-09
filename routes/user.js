const express = require('express');

const userController = require('../controllers/user.controller');
const auth = require('../auth/jwt');

const router = express.Router();


// router.route('/register').post(userController.register)
router.post('/register',userController.signUp);
router.post('/login',userController.signIn);
router.post('/forgotPassword',userController.forgotPassword);
router.get('/resetPassword/:userId/:token',userController.resetPassword)
router.post('/resetPassword/:userId/:token',userController.resetPasswordPost)
router.post('/tokenRefresh', userController.verifyRefreshToken)

module.exports = router;
