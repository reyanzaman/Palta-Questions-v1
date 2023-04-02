import UserModel from '../model/User.model.js';
import QuestionModel from '../model/Question.model.js';
import AnswerModel from '../model/Answer.model.js';
import TypeModel from '../model/Type.model.js';
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
      
        return res.status(201).json({ msg: `${qtype.toUpperCase()}-Question Posted` });

    }catch(error){
        console.log("app controller")
        console.log(error);
        return res.status(500).json({ error: "Failed to post Question!" });
    }
}

const incrementTypeField = async (fieldToUpdate) => {
    try {
      const filter = {}; // empty filter to match all documents
      const update = { $inc: { [fieldToUpdate]: 1 } }; // increment the specific field by 1
      const options = { upsert: true, new: true, setDefaultsOnInsert: true }; // if the document doesn't exist, create a new one with the field initialized to 0
      const result = await TypeModel.findOneAndUpdate(filter, update, options);
      console.log(result); // log the updated document
    } catch (error) {
      console.log(error); // handle the error
    }
};

export async function questionType(type, values){
    // Identifying Question Types
    // Knowledge-Recall Questions
    const bloom_knowledge = [
    "define",
    "identify",
    "describe",
    "label",
    "list",
    "name",
    "state",
    "match",
    "recognize",
    "select",
    "examine",
    "locate",
    "memorize",
    "quote",
    "recall",
    "reproduce",
    "tabulate",
    "tell",
    "copy",
    "discover",
    "duplicate",
    "enumerate",
    "listen",
    "observe",
    "omit",
    "read",
    "recite",
    "record",
    "repeat",
    "retell",
    "visualize",
    "who",
    "what",
    "why",
    "when",
    "where",
    "which",
    "choose",
    "find",
    "how",
    "show",
    "spell",
    "relate",
    ];
    // Understand / Comprehension-Explain
    const bloom_understand = [
    "explain",
    "describe",
    "interpret",
    "paraphrase",
    "summarize",
    "classify",
    "compare",
    "differentiate",
    "discuss",
    "distinguish",
    "extend",
    "predict",
    "associate",
    "contrast",
    "convert",
    "demonstrate",
    "estimate",
    "express",
    "identify",
    "indicate",
    "infer",
    "relate",
    "restate",
    "select",
    "translate",
    "ask",
    "cite",
    "discover",
    "generalize",
    "group",
    "illustrate",
    "judge",
    "observe",
    "order",
    "report",
    "represent",
    "research",
    "review",
    "rewrite",
    "show",
    "trace",
    "outline",
    "rephrase",
    ];
    // Application-Use
    const bloom_application = [
    "solve",
    "apply",
    "illustrate",
    "modify",
    "use",
    "calculate",
    "change",
    "choose",
    "demonstrate",
    "discover",
    "experiment",
    "relate",
    "show",
    "sketch",
    "complete",
    "construct",
    "dramatize",
    "interpret",
    "manipulate",
    "paint",
    "prepare",
    "teach",
    "act",
    "collect",
    "compute",
    "explain",
    "list",
    "operate",
    "practice",
    "simulate",
    "transfer",
    "write",
    "build",
    "develop",
    "interview",
    "make use of",
    "organize",
    "experiment with",
    "plan",
    "select",
    "utilize",
    "model",
    "identify",
    ];
    // Analysis-Take Apart
    const bloom_analysis = [
    "analyze",
    "compare",
    "classify",
    "contrast",
    "distinguish",
    "infer",
    "separate",
    "explain",
    "select",
    "categorize",
    "connect",
    "differentiate",
    "divide",
    "order",
    "prioritize",
    "survey",
    "calculate",
    "conclude",
    "correlate",
    "deduce",
    "devise",
    "diagram",
    "estimate",
    "evaluate",
    "experiment",
    "focus",
    "illustrate",
    "organize",
    "outline",
    "plan",
    "question",
    "test",
    "discover",
    "examine",
    "inspect",
    "simplify",
    "take part in",
    "test for",
    "list",
    "distinction",
    "theme",
    "relationships",
    "function",
    "motive",
    "inference",
    "assumption",
    "conclusion",
    ];
    // Synthesis/Creation-Make it new
    const bloom_creation = [
    "design",
    "compose",
    "create",
    "plan",
    "combine",
    "formulate",
    "invent",
    "hypothesize",
    "substitute",
    "write",
    "compile",
    "construct",
    "develop",
    "generalize",
    "integrate",
    "modify",
    "organize",
    "prepare",
    "produce",
    "rearrange",
    "rewrite",
    "adapt",
    "anticipate",
    "arrange",
    "assemble",
    "choose",
    "collaborate",
    "facilitate",
    "imagine",
    "intervene",
    "make",
    "manage",
    "originate",
    "propose",
    "simulate",
    "solve",
    "support",
    "test",
    "validate",
    "build",
    "predict",
    "suppose",
    "discuss",
    "change",
    "improve",
    "minimize",
    "maximize",
    "delete",
    "theorize",
    "elaborate",
    "happen",
    "estimate",
    ];          
    // Evaluation-Judge It
    const bloom_evaluation = [
    "reframe",
    "criticize",
    "evaluate",
    "order",
    "appraise",
    "judge",
    "support",
    "compare",
    "decide",
    "discriminate",
    "recommend",
    "summarize",
    "assess",
    "choose",
    "convince",
    "defend",
    "estimate",
    "grade",
    "measure",
    "predict",
    "rank",
    "score",
    "select",
    "test",
    "argue",
    "consider",
    "critique",
    "debate",
    "distinguish",
    "editorialize",
    "justify",
    "persuade",
    "weigh",
    "award",
    "determine",
    "dispute",
    "rule on",
    "agree",
    "prioritize",
    "opinion",
    "interpret",
    "importance",
    "criteria",
    "prove",
    "disprove",
    "influence",
    "perceive",
    "value",
    "deduct",
    "mark",
    ];

    let fieldToUpdate = "";

    if(type==="general"){
        if (bloom_knowledge.some((word) => values.paltaQuestion.toLowerCase().includes(word))) {
            fieldToUpdate = "knowledge";
            incrementTypeField(fieldToUpdate);
          }if (bloom_understand.some((word) => values.paltaQuestion.toLowerCase().includes(word))) {
            fieldToUpdate = "comprehensive";
            incrementTypeField(fieldToUpdate);
          }if (bloom_application.some((word) => values.paltaQuestion.toLowerCase().includes(word))) {
            fieldToUpdate = "application";
            incrementTypeField(fieldToUpdate);
          }if (bloom_analysis.some((word) => values.paltaQuestion.toLowerCase().includes(word))) {
            fieldToUpdate = "analytical";
            incrementTypeField(fieldToUpdate);
          }if (bloom_creation.some((word) => values.paltaQuestion.toLowerCase().includes(word))) {
            fieldToUpdate = "synthetic";
            incrementTypeField(fieldToUpdate);
          }if (bloom_evaluation.some((word) => values.paltaQuestion.toLowerCase().includes(word))) {
            fieldToUpdate = "evaluative";
            incrementTypeField(fieldToUpdate);
          }
    }else if(type==="pre"){
        // Question1
        if (bloom_knowledge.some((word) => values.question1.toLowerCase().includes(word))) {
            fieldToUpdate = "knowledge";
            incrementTypeField(fieldToUpdate);
          } if (bloom_understand.some((word) => values.question1.toLowerCase().includes(word))) {
            fieldToUpdate = "comprehensive";
            incrementTypeField(fieldToUpdate);
          } if (bloom_application.some((word) => values.question1.toLowerCase().includes(word))) {
            fieldToUpdate = "application";
            incrementTypeField(fieldToUpdate);
          } if (bloom_analysis.some((word) => values.question1.toLowerCase().includes(word))) {
            fieldToUpdate = "analytical";
            incrementTypeField(fieldToUpdate);
          } if (bloom_creation.some((word) => values.question1.toLowerCase().includes(word))) {
            fieldToUpdate = "synthetic";
            incrementTypeField(fieldToUpdate);
          } if (bloom_evaluation.some((word) => values.question1.toLowerCase().includes(word))) {
            fieldToUpdate = "evaluative";
            incrementTypeField(fieldToUpdate);
          }
        // Question2
        if (bloom_knowledge.some((word) => values.question2.toLowerCase().includes(word))) {
            fieldToUpdate = "knowledge";
            incrementTypeField(fieldToUpdate);
          } if (bloom_understand.some((word) => values.question2.toLowerCase().includes(word))) {
            fieldToUpdate = "comprehensive";
            incrementTypeField(fieldToUpdate);
          } if (bloom_application.some((word) => values.question2.toLowerCase().includes(word))) {
            fieldToUpdate = "application";
            incrementTypeField(fieldToUpdate);
          } if (bloom_analysis.some((word) => values.question2.toLowerCase().includes(word))) {
            fieldToUpdate = "analytical";
            incrementTypeField(fieldToUpdate);
          } if (bloom_creation.some((word) => values.question2.toLowerCase().includes(word))) {
            fieldToUpdate = "synthetic";
            incrementTypeField(fieldToUpdate);
          } if (bloom_evaluation.some((word) => values.question2.toLowerCase().includes(word))) {
            fieldToUpdate = "evaluative";
            incrementTypeField(fieldToUpdate);
          }
        // Question3
        if (bloom_knowledge.some((word) => values.question3.toLowerCase().includes(word))) {
            fieldToUpdate = "knowledge";
            incrementTypeField(fieldToUpdate);
          } if (bloom_understand.some((word) => values.question3.toLowerCase().includes(word))) {
            fieldToUpdate = "comprehensive";
            incrementTypeField(fieldToUpdate);
          } if (bloom_application.some((word) => values.question3.toLowerCase().includes(word))) {
            fieldToUpdate = "application";
            incrementTypeField(fieldToUpdate);
          } if (bloom_analysis.some((word) => values.question3.toLowerCase().includes(word))) {
            fieldToUpdate = "analytical";
            incrementTypeField(fieldToUpdate);
          } if (bloom_creation.some((word) => values.question3.toLowerCase().includes(word))) {
            fieldToUpdate = "synthetic";
            incrementTypeField(fieldToUpdate);
          } if (bloom_evaluation.some((word) => values.question3.toLowerCase().includes(word))) {
            fieldToUpdate = "evaluative";
            incrementTypeField(fieldToUpdate);
          }
    }else{
        return res.status(500).send({ error : "Question Type Not Found"});
    }
}

export async function validateQuestion(req, res){
    try{
        const values = req.body;
        console.log("Values:: ", values);
        console.log("PaltaQ: ", values.paltaQuestion);
        console.log("Pre Questions: ", values.question1, values.question2, values.question3)

        if(values.paltaQuestion){
            // const Question = values.paltaQuestion.trim().toLowerCase();
            
            // const existQuestion = AnswerModel.exists({ paltaQuestion: Question });
            // const existQuestion1 = QuestionModel.exists({ question1: Question });
            // const existQuestion2 = QuestionModel.exists({ question2: Question });
            // const existQuestion3 = QuestionModel.exists({ question3: Question });
            
            // if(existQuestion){
            //     console.log("existQuestion")
            // }if(existQuestion1){
            //     console.log("existQuestion1")
            // }if(existQuestion2){
            //     console.log("existQuestion2")
            // }if(existQuestion3){
            //     console.log("existQuestion3")
            // }

            // if(existQuestion || existQuestion1 || existQuestion2 || existQuestion3){
            //     return res.status(500).send({ error : "Duplicate Question!"});
            // }

            // General Question
            // Identifying Question
            const bloom_question = [
                "who",
                "what",
                "why",
                "when",
                "omit",
                "where",
                "which",
                "choose",
                "find",
                "how",
                "define",
                "show",
                "spell",
                "list",
                "match",
                "name",
                "relate",
                "tell",
                "recall",
                "select",
                "label",
                "am",
                "is",
                "are"
            ];
            console.log("Length of Question: ", values.paltaQuestion.length)
            const lowercaseQuestion = values.paltaQuestion.toLowerCase();
            const containsBloomQuestion = bloom_question.some(questionWord => lowercaseQuestion.includes(questionWord));

            if(values.paltaQuestion.length < 10){
                return res.status(500).send({ error : "Question too Short!"});
            }else if(containsBloomQuestion){
                questionType("general", values);
                return res.status(200).send("Question Posted");
            }else{
                return res.status(500).send({ error : "Invalid Question!"});
            }
        }else if(values.question1 && values.question2 && values.question3){
            // Pre Question
            // const question1 = values.question1;
            // const question2 = values.question2;
            // const question3 = values.question3;

            // const existQuestion1 = AnswerModel.exists({ paltaQuestion: question1 });
            // const existQuestion11 = QuestionModel.exists({ question1: question1 });
            // const existQuestion12 = QuestionModel.exists({ question2: question1 });
            // const existQuestion13 = QuestionModel.exists({ question3: question1 });

            // const existQuestion2 = AnswerModel.exists({ paltaQuestion: question2 });
            // const existQuestion21 = QuestionModel.exists({ question1: question2 });
            // const existQuestion22 = QuestionModel.exists({ question2: question2 });
            // const existQuestion23 = QuestionModel.exists({ question3: question2 });

            // const existQuestion3 = AnswerModel.exists({ paltaQuestion: question3 });
            // const existQuestion31 = QuestionModel.exists({ question1: question3 });
            // const existQuestion32 = QuestionModel.exists({ question2: question3 });
            // const existQuestion33 = QuestionModel.exists({ question3: question3 });

            // if(existQuestion1 || existQuestion11 || existQuestion12 || existQuestion13){
            //     return res.status(500).send({ error : "Question-1 is Duplicate!" });
            // }else if(existQuestion2 || existQuestion21 || existQuestion22 || existQuestion23){
            //     return res.status(500).send({ error : "Question-2 is Duplicate!"})
            // }else if(existQuestion3 || existQuestion31 || existQuestion32 || existQuestion33){
            //     return res.status(500).send({ error : "Question-3 is Duplicate!"})
            // }

            const bloom_question = [
                "who",
                "what",
                "why",
                "when",
                "omit",
                "where",
                "which",
                "choose",
                "find",
                "how",
                "define",
                "show",
                "spell",
                "list",
                "match",
                "name",
                "relate",
                "tell",
                "recall",
                "select",
                "label",
                "am",
                "is",
                "are"
            ];
            console.log("Length of Questions: ", values.question1.length, values.question2.length, values.question3.length)
            const lowercaseQuestion1 = values.question1.toLowerCase();
            const lowercaseQuestion2 = values.question2.toLowerCase();
            const lowercaseQuestion3 = values.question3.toLowerCase();
            const containsBloomQuestion1 = bloom_question.some(questionWord => lowercaseQuestion1.includes(questionWord));
            const containsBloomQuestion2 = bloom_question.some(questionWord => lowercaseQuestion2.includes(questionWord));
            const containsBloomQuestion3 = bloom_question.some(questionWord => lowercaseQuestion3.includes(questionWord));

            if(values.question1.length < 10){
                return res.status(500).send({ error : "Question 1 too Short!"});
            }else if(values.question2.length < 10){
                return res.status(500).send({ error : "Question 2 too Short!"});
            }else if(values.question3.length < 10){
                return res.status(500).send({ error : "Question 3 too Short!"});
            }else if(!containsBloomQuestion1){
                return res.status(500).send({error : "Question-1 Invalid"});
            }else if(!containsBloomQuestion2){
                return res.status(500).send({error : "Question-2 Invalid"});
            }else if(!containsBloomQuestion3){
                return res.status(500).send({error : "Question-3 Invalid"});
            }else{
                questionType("pre", values);
                return res.status(200).send("Question Posted");
            }
        }else{
            return res.status(500).json({ error: "Questions Missing!"});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({ error: "Something strange has happened!"});
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
  