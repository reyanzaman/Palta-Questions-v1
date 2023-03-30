import UserModel from '../model/User.model.js';
import QuestionModel from '../model/Question.model.js';
import AnswerModel from '../model/Answer.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

export async function changeRank(req, res){
    try{

        const { username } = req.body;

        if(username){
            const score = await UserModel.findOne({ username }, { questions: 1 });
            console.log(`The score for ${username} is ${score}`);

            if(score.questions < 50){
                await UserModel.updateOne({ username: username }, { rank: "Novice Questioneer" });
            }else if(score.questions >= 50 && score.questions < 100){
                await UserModel.updateOne({ username: username }, { rank: "Apprentice Questioneer" });
            }else if(score.questions >= 100 && score.questions < 150){
                await UserModel.updateOne({ username: username }, { rank: "Adept Questioneer" });
            }else if(score.questions >= 150 && score.questions < 200){
                await UserModel.updateOne({ username: username }, { rank: "Expert Questioneer" });
            }else if(score.questions >= 200){
                await UserModel.updateOne({ username: username }, { rank: "Master Questioneer" });
            }

            res.status(201).json({ msg: `Rank Updated` });
        }else{
            console.log(username)
        }

    }catch(error){
        console.log(error);
    }
}

export async function searchQuestion(req, res){
    try{
        console.log("app controller running")
        const { type, course, topic, section, semester, year } = req.query;

        let questions = null;
        if(semester==="All"){
            console.log("All running")
            if(section && year){
                console.log("All section && year running")
                questions = await QuestionModel.find({ type, course, topic, section, year });
            }else if(section){
                console.log("All section running")
                questions = await QuestionModel.find({ type, course, topic, section });
            }else if(year){
                console.log("All year running")
                questions = await QuestionModel.find({ type, course, topic, year });
            }else{
                console.log("All else running")
                questions = await QuestionModel.find({ type, course, topic });
            }
        }else{
            console.log("NOT All running")
            if(section && year){
                console.log("section && year running")
                questions = await QuestionModel.find({ type, course, topic, section, semester, year });
            }else if(section){
                console.log("Section running")
                questions = await QuestionModel.find({ type, course, topic, section, semester });
            }else if(year){
                console.log("Year running")
                questions = await QuestionModel.find({ type, course, topic, semester, year });
            }else{
                console.log("Else running")
                questions = await QuestionModel.find({ type, course, topic, semester });
            }
        }

        return res.json(questions);
    }catch(error){
        console.log(error)
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
        const { username, date, answer, question, paltaQuestion , course, topic, section, semester, year} = req.body;

        const Answer = new AnswerModel({
            username,
            date,
            answer,
            question,
            paltaQuestion,
            course,
            topic,
            section,
            semester,
            year
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
        const { username, type, course, topic, date, question1, question2, question3, thisclass, nextclass, isAnonymous, section, semester, year} = req.body;

        let qtype = "";
        if(question1 || question2 || question3){
            qtype = "pre";
            await UserModel.updateOne({ username: username }, { $inc: { questions: 3 } });
        }else if(thisclass || nextclass){
            qtype = "post"
        }else{
            await UserModel.updateOne({ username: username }, { $inc: { questions: 1 } });
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
            isAnonymous,
            section,
            semester,
            year
        });
      
        const result = await question.save();
      
        res.status(201).json({ msg: `${qtype.toUpperCase()}-Question Posted` });

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
        const { username, password, id, email , profile, questions, rank} = req.body;
    
        // Check for existing user
        const existUsername = UserModel.exists({ username });
    
        // Check for existing id
        const existID = UserModel.exists({ id });
    
        // Check for existing email
        const existEmail = UserModel.exists({ email });
    
        const [usernameExists, idExists, emailExists] = await Promise.all([
            existUsername,
            existID,
            existEmail,
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
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = new UserModel({
        username,
        password: hashedPassword,
        id,
        email,
        profile: profile || '',
        questions: 0,
        rank: 'Novice Questioneer'
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
            process.env.JWT_SECRET,
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
  