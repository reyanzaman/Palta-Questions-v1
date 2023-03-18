import { Router } from 'express';
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js'
import { localVariables } from '../middleware/auth.js';
import { registerMail } from '../controllers/mailer.js';

/**  POST Methods */
router.route('/register').post(controller.register); //register user
router.route('/registerMail').post(registerMail); //send email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); //authenticate user
router.route('/login').post(controller.verifyUser, controller.login); //login to the app

/** GET Methods */
router.route('/user/:username').get(controller.getUser) //user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) //generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) //verify generated OTP
router.route('/createResetSession').get(controller.createResetSession) //reset all the variables
router.route('/questionnaire').get(controller.verifyUser, (req, res) => {
    res.render('Questionnaire')
})
router.route('/pre').get(controller.verifyUser, (req, res) => {
    res.render('Pre')
})
router.route('/post').get(controller.verifyUser, (req, res) => {
    res.render('Post')
})

/** PUT Methods */
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // used to reset password

export default router;