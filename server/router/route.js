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
router.route('/post').post(controller.verifyUser, controller.submitQuestion); //submit post-question
router.route('/pre').post(controller.verifyUser, controller.validateQuestion, controller.submitQuestion); //submit pre-question
// router.route('/answer').post(controller.verifyUser, controller.validateQuestion); //just for testing
router.route('/answer').post(controller.verifyUser, controller.validateQuestion, controller.postAnswer); //post answer and palta
router.route('/rank').post(controller.changeRank) //update rank based on score

/** GET Methods */
router.route('/user/:username').get(controller.getUser) //user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); //generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); //verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); //reset all the variables
router.route('/questions').get(controller.searchQuestion); //Repository of Questions
router.route('/getanswer').get(controller.searchAnswer); //Question Answer Viewer
router.route('/general').get(controller.searchGeneral); //Search for general question repository

/** PUT Methods */
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // used to reset password

export default router;