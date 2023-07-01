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
router.route('/post').post(controller.verifyUser, controller.validatePost, controller.submitQuestion); //submit post-question
router.route('/pre').post(controller.verifyUser, controller.validateQuestion, controller.submitQuestion); //submit pre-question
router.route('/comments').post(controller.validateQuestion, controller.submitComment); //submit comments
router.route('/rank').post(controller.changeRank) //update rank based on score
router.route('/questionnaire').post(controller.postQuestionnaire); //submit questionnaire
router.route('/photo').post(controller.postPhoto); //submit photo
router.route('/setUserDetails').post(controller.setUserDetails); //set section and course
router.route('/setCourse').post(controller.setCourse); //set the course of user
router.route('/setSection').post(controller.setSection); //set the section of user

/** GET Methods */
router.route('/user/:username').get(controller.getUser) //user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); //generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); //verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); //reset all the variables
router.route('/questions').get(controller.searchQuestion); //Repository of Questions
router.route('/getComment').get(controller.getComment); //Question Answer Viewer
router.route('/general').get(controller.searchGeneral); //Search for general question repository
router.route('/generalAll').get(controller.searchGeneralAll); //Search for all general questions
router.route('/commentALl').get(controller.getAllComments); //Search for all comments
router.route('/getUsername').get(controller.recoverUsername); //Send username to email
router.route('/leaderboard').get(controller.leaderboard); //Get leaderboard users
router.route('/userDetails').get(controller.getUserDetails); //Get user course and section
router.route('/getQuestionnaire').get(controller.searchQuestionnaire); //Get questionnaire
router.route('/adminCommand').get(controller.adminCommand); //Admin function

/** PUT Methods */
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // used to reset password

export default router;