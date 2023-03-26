import UserModel from '../model/User.model.js';
import QuestionModel from '../model/Question.model.js';
import AnswerModel from '../model/Answer.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator'


/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}

export async function searchQuestion(req, res){
    try{
        console.log("app controller running")
        const { type, course, topic } = req.query;
        const questions = await QuestionModel.find({ type, course, topic });
        return res.json(questions);
    }catch(error){
        console.log("Failed to execute searchQuestion function");
    }
}

export async function searchGeneral(req, res){
    try{
        console.log("app controller running")
        const { course, topic } = req.query;
        const questions = await AnswerModel.find({ course, topic });
        return res.json(questions);
    }catch(error){
        console.log("Failed to execute searchGeneral function");
    }
}

export async function searchAnswer(req, res){
    console.log("app controller running")
    try {
        const { question } = req.query;
        const answers = await AnswerModel.find({ question });
        return res.json(answers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function postAnswer(req, res){
    try{
        console.log("Posting Answer...");
        const { username, date, answer, question, paltaQuestion , course, topic} = req.body;

        const Answer = new AnswerModel({
            username,
            date,
            answer,
            question,
            paltaQuestion,
            course,
            topic
        });
      
        const result = await Answer.save();
      
        res.status(201).json({ msg: `Answer Posted` });

        await UserModel.updateOne({ username: username }, { $inc: { questions: 1 } });
    }catch(error){
        console.log(error);
    }
}

export async function submitQuestion(req, res) {
    console.log("Submit Question Module Executed")
    try{
        const { username, type, course, topic, date, question1, question2, question3, thisclass, nextclass, isAnonymous} = req.body;

        let qtype = "";
        if(question1 || question2 || question3){
            qtype = "pre"
        }else if(thisclass || nextclass){
            qtype = "post"
        }

        const question = new QuestionModel({
            username,
            type: qtype,
            course,
            topic,
            date,
            question1,
            question2,
            question3,
            thisclass,
            nextclass,
            isAnonymous
        });
      
        const result = await question.save();
      
        res.status(201).json({ msg: `${qtype.toUpperCase()}-Question Posted` });

        await UserModel.updateOne({ username: username }, { $inc: { questions: 1 } });

    }catch(error){
        console.log("app controller")
        console.log(error);
        res.status(500).json({ error: "Failed to post Question!" });
    }
}


/** POST http://localhost:8080/api/register
 * @param : {
 * "username" : "example123",
 * "password" : "admin123",
 * "id" : "2021065",
 * "email" : "example@gmail.com"
 * }
*/
export async function register(req, res) {
    try {
        const { username, password, id, email , profile, questions} = req.body;
    
        // Check for existing user
        const existUsername = UserModel.exists({ username });
    
        // Check for existing id
        const existID = UserModel.exists({ id });
    
        // Check for existing email
        const existEmail = UserModel.exists({ email });

        // Check for profile image
        const existProfile = UserModel.exists({ profile });
    
        const [usernameExists, idExists, emailExists, profileExists] = await Promise.all([
            existUsername,
            existID,
            existEmail,
            existProfile
        ]);
  
    if (usernameExists) {
        return res.status(400).json({ error: "Please use unique username" });
    }
  
    if (idExists) {
        return res.status(400).json({
        error:
        "This ID already exists. Please login with your IUB ID.",
        });
    }
  
    if (emailExists) {
        return res
        .status(400)
        .json({ error: "Please use unique email" });
    }

    if (profileExists){
        return res
        .status(400)
        .json({ error: "Please upload a photo"});
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = new UserModel({
        username,
        password: hashedPassword,
        id,
        email,
        profile: profile || '',
        questions: 0
    });
  
    const result = await user.save();
  
    res.status(201).json({ msg: "User Registration Succesful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Reg error" });
    }
}


/** POST http://localhost:8080/api/login
 * @param: {
 * "username" : "example123",
 * "password" : "admin123"
 * }
 */
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);

        if (!passwordCheck) {
            return res.status(400).send({ error: "Password does not match" });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            ENV.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).send({
            msg: "Login Successful",
            username: user.username,
            token
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res){
    
    const { username } = req.params;

    if(!username) {
        return res.status(400).send({ error: "Invalid Username"});
    }

    try {
        const user = await UserModel.findOne({ username });
        
        if(!user) {
            return res.status(404).send({ error: "User Not Found"});
        }

        // remove password from the user
        // mongoose return unnecessary data with object so convert it to json
        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(200).send(rest);

    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

/** GET http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}

/** GET http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(201).send({ msg: 'Verified Successfully' })
    }
    return res.status(400).send({ error: "Invalid OTP"})
}

//successfully redirect user when OTP is valid
/** GET http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res){
    if(req.app.locals.resetSession){
        return res.status(201).send({ flag: req.app.locals.resetSession })
    }
    return res.status(440).send({error: "Session expired!"})
}

/** PUT http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {

        if(!req.app.locals.resetSession) return res.status(404).send({error: "Session Expired!"});
    
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "Username Not Found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.updateOne(
            { username: user.username },
            { password: hashedPassword }
        );

        return res.status(201).send({ msg: "Record Updated" });
    } catch (error) {
      return res.status(500).send({ error });
    }
  }
  