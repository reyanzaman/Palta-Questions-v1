import UserModel from "../model/User.model.js";
import QuestionModel from "../model/Question.model.js";
import TypeModel from "../model/Type.model.js";
import QuestionnaireModel from "../model/Questionnaire.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import FollowupModel from "../model/Followup.model.js";
import natural from 'natural';

/** middleware for verify user */
export async function verifyUser(req, res, next) {
	try {
		const { username } = req.method == "GET" ? req.query : req.body;

		// check the user existance
		let exist = await UserModel.findOne({ username });
		if (!exist) return res.status(404).send({ error: "Can't find User!" });
		next();
	} catch (error) {
		return res.status(404).send({ error: "Authentication Error" });
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
			token,
		});
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
	const { username } = req.params;

	if (!username) {
		return res.status(400).send({ error: "Invalid Username" });
	}

	try {
		const user = await UserModel.findOne({ username });

		if (!user) {
			return res.status(404).send({ error: "User Not Found" });
		}

		// remove password from the user
		// mongoose return unnecessary data with object so convert it to json
		const { password, ...rest } = Object.assign({}, user.toJSON());

		return res.status(200).send(rest);
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" });
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
		const { username, password, id, email, profile, questions, rank, course, section } =
			req.body;

		const new_email = email + "@iub.edu.bd";

		// Check for existing user
		const existUsername = UserModel.exists({ username });

		// Check for existing id
		const existID = UserModel.exists({ id });

		// Check for existing email
		const existEmail = UserModel.exists({ email: new_email });

		const [usernameExists, idExists, emailExists] = await Promise.all([
			existUsername,
			existID,
			existEmail,
		]);

		if (usernameExists) {
			console.log("username exists")
			return res.status(400).json({ error: "Account already exists with this ID" });
		}

		if (idExists) {
			console.log("id exists");
			return res.status(400).json({ error: "Account already exists with this ID" });
		}

		if (emailExists) {
			console.log("email exists");
			return res.status(400).json({ error: "Account already exists with this ID" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new UserModel({
			username,
			password: hashedPassword,
			id,
			email: new_email,
			profile: profile || "",
			questions: 0,
			rank: "Novice Questioneer",
			section: section,
			course: course
		});

		const result = await user.save();

		return res.status(201).json({ msg: "User Registration Succesful" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Reg error" });
	}
}

export async function postPhoto(req, res) {
	try{
		const { username, profile } = req.body;
		await UserModel.updateOne(
		{ username: username },
		{ profile: profile }
		);
		res.sendStatus(200);
	}catch(error){
		console.log(error);
		res.sendStatus(500);
	}
}

export async function getUserDetails(req, res){
	try{
		const { username } = req.query;
		const user = await UserModel.findOne(
		{ username: username }
		);
		return res.json(user);
	}catch(error){
		console.log(error);
		res.sendStatus(500);
	}
}

export async function setUserDetails(req, res){
	try{
		const { username } = req.query;
		const user = await UserModel.findOne(
		{ username: username }
		);
		return res.json(user);
	}catch(error){
		console.log(error);
		res.sendStatus(500);
	}
}

export async function setSection(req, res){
	try{
		const { username, section } = req.body;
		await UserModel.updateOne(
			{ username: username },
			{ $set: {section: section} }
			);
			res.sendStatus(200);
	}catch(error){
		console.log(error);
		res.sendStatus(500);
	}
}

export async function setCourse(req, res){
	try{
		const { username, course } = req.body;
		await UserModel.updateOne(
			{ username: username },
			{ $set: {course: course} }
			);
			res.sendStatus(200);
	}catch(error){
		console.log(error);
		res.sendStatus(500);
	}
}

export async function changeRank(req, res) {
	try {
		const { username } = req.body;

		if (username) {
			const user = await UserModel.findOne({ username });

			if (user.score < 550 && user.score >= 0) {
				await UserModel.updateOne(
					{ username: username },
					{ rank: "Novice Questioneer" }
				);
			} else if (user.score >= 550 && user.score < 1500) {
				await UserModel.updateOne(
					{ username: username },
					{ rank: "Apprentice Questioneer" }
				);
			} else if (user.score >= 1500 && user.score < 3000) {
				await UserModel.updateOne(
					{ username: username },
					{ rank: "Adept Questioneer" }
				);
			} else if (user.score >= 3000 && user.score < 5000) {
				await UserModel.updateOne(
					{ username: username },
					{ rank: "Expert Questioneer" }
				);
			} else if (user.score >= 5000 && user.score < 7000) {
				await UserModel.updateOne(
					{ username: username },
					{ rank: "Master Questioneer" }
				);
			} else if (user.score >= 7000 && user.score < 15000) {
				await UserModel.updateOne(
					{ username: username },
					{ rank: "Legendary Questioneer" }
				);
			} else if (user.score >= 15000 && user.score < 25000) {
				await UserModel.updateOne(
					{ username: username },
					{ rank: "Mythical Questioneer" }
				);
			} else if (user.score >= 25000 && user.score < 35000) {
				await UserModel.updateOne(
					{ username: username },
					{ rank: "Outstanding Questioneer" }
				);
			} else if (user.score >= 35000 && user.score < 50000) {
				await UserModel.updateOne(
					{ username: username },
					{ rank: "Master of Questions" }
				);
			} else if (user.score >= 50000) {
				await UserModel.updateOne(
					{ username: username },
					{ rank: "Beyond Comparison" }
				);
			} else if (user.score < 0){
				await UserModel.updateOne(
					{ username: username },
					{ rank: "Master of Questions" }
				);
			}

			res.status(201).json({ msg: `Rank Updated` });
		}
	} catch (error) {
		console.log(error);
	}
}

export async function searchQuestion(req, res) {
	try {
		const { type, course, topic, section, date, month, year } = req.query;

		let questions = null;
		if (date==""){
			if (month === "All") {
				if (topic != "All Topics" && section!=="All" && year!=="") {
					questions = await QuestionModel.find({type, course, topic, section, year});
				} else if (section!=="All" && topic != "All Topics" && year=="") {
					questions = await QuestionModel.find({ type, course, topic, section});
				} else if (year!=="" && topic != "All Topics" && section=="All") {
					questions = await QuestionModel.find({ type, course, topic, year});
				} else if (section!=="All" && topic == "All Topics" && year=="") {
					questions = await QuestionModel.find({ type, course, section});
				} else if (year!="" && topic == "All Topics" && section=="All") {
					questions = await QuestionModel.find({ type, course, year });
				} else if (topic != "All Topics" && section=="All" && year=="") {
					questions = await QuestionModel.find({ type, course, topic });
				}else if (topic == "All Topics" && section!=="All" && year!==""){
					console.log(type, course, section, year);
					questions = await QuestionModel.find({ type, course, section, year});
				} else {
					questions = await QuestionModel.find({ type, course });
				}
			} else {
				if (topic != "All Topics" && section!=="All" && year!=="") {
					questions = await QuestionModel.find({type, course, topic, month, section, year});
				} else if (section!=="All" && topic != "All Topics" && year=="") {
					questions = await QuestionModel.find({type, course, topic, month, section});
				} else if (year!=="" && topic != "All Topics" && section=="All") {
					questions = await QuestionModel.find({type, course, topic, month, year});
				} else if (section!=="All" && topic == "All Topics" && year=="") {
					questions = await QuestionModel.find({ type, course, month, section });
				} else if (year!=="" && topic == "All Topics" && section=="All") {
					console.log("here: ", type, course, month, year);
					questions = await QuestionModel.find({ type, course, month, year });
				} else if (topic != "All Topics" && section=="All" && year=="") {
					questions = await QuestionModel.find({ type, course, month, topic });
				}else if (topic == "All Topics" && section!=="All" && year!==""){
					questions = await QuestionModel.find({ type, course, month, section, year});
				} else {
					questions = await QuestionModel.find({ type, course, month });
				}
			}
		}else{
			const regexPattern = new RegExp(`.*\\s${date.toString()}\\s.*`);
			const searchDate = { $regex: regexPattern };
			if (month === "All") {
				if (topic != "All Topics" && section!=="All" && year!=="") {
					questions = await QuestionModel.find({type, course, topic, section, date:searchDate, year});
				} else if (section!=="All" && topic != "All Topics" && year=="") {
					questions = await QuestionModel.find({ type, course, topic, section, date:searchDate});
				} else if (year!=="" && topic != "All Topics" && section=="All") {
					questions = await QuestionModel.find({ type, course, topic, date:searchDate, year});
				} else if (section!=="All" && topic == "All Topics" && year=="") {
					questions = await QuestionModel.find({ type, course, section, date:searchDate});
				} else if (year!="" && topic == "All Topics" && section=="All") {
					questions = await QuestionModel.find({ type, course, date:searchDate, year });
				} else if (topic != "All Topics" && section=="All" && year=="") {
					questions = await QuestionModel.find({ type, course, topic, date:searchDate});
				}else if (topic == "All Topics" && section!=="All" && year!==""){
					questions = await QuestionModel.find({ type, course, section, date:searchDate, year});
				} else {
					questions = await QuestionModel.find({ type, course, date:searchDate});
				}
			} else {
				if (topic != "All Topics" && section!=="All" && year!=="") {
					questions = await QuestionModel.find({type, course, topic, month, section, date:searchDate, year});
				} else if (section!=="All" && topic != "All Topics" && year=="") {
					questions = await QuestionModel.find({type, course, topic, month, date:searchDate, section});
				} else if (year!=="" && topic != "All Topics" && section=="All") {
					questions = await QuestionModel.find({type, course, topic, month, date:searchDate, year});
				} else if (section!=="All" && topic == "All Topics" && year=="") {
					questions = await QuestionModel.find({ type, course, month, date:searchDate, section });
				} else if (year!=="" && topic == "All Topics" && section=="All") {
					questions = await QuestionModel.find({ type, course, month, date:searchDate, year });
				} else if (topic != "All Topics" && section=="All" && year=="") {
					questions = await QuestionModel.find({ type, course, month, date:searchDate, topic });
				}else if (topic == "All Topics" && section!=="All" && year!==""){
					questions = await QuestionModel.find({ type, course, month, date:searchDate, section, year});
				} else {
					questions = await QuestionModel.find({ type, course, date:searchDate, month });
				}
			}
		}
		return res.json(questions);
	} catch (error) {
		console.log(error);
	}
}

export async function searchQuestionnaire(req, res) {
	try {
		let { type, course, section, semester, year } = req.query;

		if (type == "prequestionnaire") {
			type = "pre";
		} else if (type == "postquestionnaire") {
			type = "post";
		}

		let questionnaire = null;

		if (!year || year == "") {
			if (!section || section == "All") {
				questionnaire = await QuestionnaireModel.find({ type, course, semester });
			} else {
				questionnaire = await QuestionnaireModel.find({ type, course, semester, section });
			}
		} else {
			// Extract the year from the date string
			const yearRegex = /(\d{4})/;
			const match = year.match(yearRegex);
			const extractedYear = match ? match[0] : null;

			if (!section || section == "All") {
				questionnaire = await QuestionnaireModel.find({ type, course, semester, date: { $regex: extractedYear } });
			} else {
				questionnaire = await QuestionnaireModel.find({ type, course, semester, section, date: { $regex: extractedYear } });
			}
		}

		return res.json(questionnaire);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error });
	}
}
  

export async function getAllComments(req, res){
	try{
		const { course } = req.query;

		var questions = await FollowupModel.find({
			course
		});

		return res.json(questions);
	}catch(error){
		console.log(error);
		return res.status(500).json({ error: "Failed to Get Palta Questions" });
	}
}

export async function leaderboard(req, res) {
    try {
		const { section, course } = req.query;
        var rankings = await UserModel.find({ section, course }).sort({ score: -1 }).limit(10);
        return res.json(rankings);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to retrieve leaderboard users!" });
    }
}

export async function searchGeneral(req, res) {
	try {
		const { type, date, month, year } = req.query;
		const regexPattern = new RegExp(`.*\\s${date.toString()}\\s.*`);
		const searchDate = { $regex: regexPattern };

		let questions = null;
		if (date==""){
			if (month === "All") {
				if (year!=="") {
					questions = await QuestionModel.find({ type, year });
				} else {
					questions = await QuestionModel.find({ type });
				}
			} else {
				if (year!=="") {
					questions = await QuestionModel.find({ type, month, year });
				} else {
					questions = await QuestionModel.find({ type, month });
				}
			}
		} else {
			if (month === "All") {
				if (year!=="") {
					questions = await QuestionModel.find({ type, date:searchDate, year });
				} else {
					questions = await QuestionModel.find({ type, date:searchDate });
				}
			} else {
				if (year!=="") {
					questions = await QuestionModel.find({ type, date:searchDate, month, year });
				} else {
					questions = await QuestionModel.find({ type, date:searchDate, month });
				}
			}
		}
		return res.json(questions);
	} catch (error) {
		console.log(error);
		console.log("Failed to execute searchGeneral function");
	}
}

export async function searchGeneralAll(req, res) {
	try {
		const { type, month, year } = req.query;
		var questions = await QuestionModel.find({ type, month, year });
		if(questions[0]==null){
			const new_month = month-1;
			var questions = await QuestionModel.find({ type, new_month, year });
		}
		return res.json(questions);
	} catch (error) {
		console.log(error);
		console.log("Failed to execute searchGeneralAll function");
	}
}

export async function getComment(req, res) {
	try {
		const { question } = req.query;
		const comments = await FollowupModel.find({ question });
		return res.json(comments);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function submitComment(req, res) {
	try {
		const {
			author,
			usernames,
			date,
			question,
			qScore,
			comments,
			course,
			topic,
			isAnonymous,
			section,
			semester,
			month,
			year,
		} = req.body;

		await UserModel.updateOne(
			{ username: usernames },
			{ $inc: { questions: 1 } }
		);
		var cScore = await questionQuality(course, section, comments);

		await updateScore(usernames, cScore);

		// Check if data with the same question exists
		const existingFollowup = await FollowupModel.findOne({ question });

		if (existingFollowup) {
			// Data with the same question exists, update the arrays
			existingFollowup.usernames.push(usernames);
			existingFollowup.isAnonymous.push(isAnonymous);
			existingFollowup.date.push(date);
			existingFollowup.comments.push(comments);
			existingFollowup.cScore.push(cScore);

			await existingFollowup.save();
		} else {
			// Data with the same question doesn't exist, create a new data
			const newFollowup = new FollowupModel({
				author,
				usernames: [usernames],
				date: [date],
				question,
				qScore,
				comments: [comments],
				cScore: [cScore],
				course,
				topic,
				isAnonymous: [isAnonymous],
				section,
				semester,
				month,
				year,
			});
			await newFollowup.save();
		}

		return res.status(201).json({ msg: `${cScore} Points Scored!` });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Failed to post Question!" });
	}
}

export async function validatePost(req, res, next) {
	try {
		const { thisclass, nextclass } = req.body;
		if (String(thisclass).length < 10 || String(nextclass).length < 10) {
			return res.status(500).send({ error: "Feedback too Short!" });
		} else {
			next();
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function submitQuestion(req, res) {
	try {
		const {
			username,
			type,
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
			month,
			year,
		} = req.body;

		let qtype = "";
		if (question1 && question2 && question3) {
			qtype = "pre";
			if (!section) {
				return res.status(500).json({ error: "Section missing!" });
			}
			await UserModel.updateOne(
				{ username: username },
				{ $inc: { questions: 3 } }
			);
			var q1Score = await questionQuality(course, section, question1);
			var q2Score = await questionQuality(course, section, question2);
			var q3Score = await questionQuality(course, section, question3);
			var score = q1Score + q2Score + q3Score;
			await updateScore(username, score);
		} else if (thisclass || nextclass) {
			qtype = "post";
			if (!section) {
				return res.status(500).json({ error: "Section missing!" });
			}
			score = 20;
			await updateScore(username, 20);
		} else {
			qtype = "general";
			await UserModel.updateOne(
				{ username: username },
				{ $inc: { questions: 1 } }
			);
			var q1Score = await questionQuality(course, 1, question1);
			var score = q1Score;
			await updateScore(username, q1Score);
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
			q1Score,
			q2Score,
			q3Score,
			thisclass,
			nextclass,
			isAnonymous,
			section,
			semester,
			month,
			year,
		});

		const result = await question.save();

		return res.status(201).json({ msg: `${score} Points Scored!` });
	} catch (error) {
		console.log("app controller");
		console.log(error);
		return res.status(500).json({ error: "Failed to post Question!" });
	}
}

const incrementTypeField = async (course, section, fieldToUpdate) => {
	try {
		const filter = { course: course, section: section }; // filter documents based on the specific course and section
		const update = { $inc: { [fieldToUpdate]: 1 } }; // increment the specific field by 1
		const options = {
			upsert: true, // if the document doesn't exist, create a new one
			new: true, // return the updated document
			setDefaultsOnInsert: true, // set default values if a new document is created
			rawResult: true, // return the raw result instead of the modified document
		};
		const result = await TypeModel.findOneAndUpdate(filter, update, options);
	} catch (error) {
		console.log(error); // handle the error
	}
};

export async function questionQuality(course, section, question) {
	// Identifying Question Types
	// Knowledge-Recall Questions
	const bloom_knowledge = [
		"bookmark",
		"bookmarked",
		"bookmarking",
		"bullet point",
		"bullet-point",
		"bullet-pointing",
		"choose",
		"choosed",
		"choosing",
		"chosen",
		"copy",
		"copied",
		"copying",
		"define",
		"defined",
		"defining",
		"describe",
		"described",
		"describing",
		"discover",
		"discovered",
		"discovering",
		"discovery",
		"duplicate",
		"duplicated",
		"duplicating",
		"enumerate",
		"enumerated",
		"enumerating",
		"examine",
		"examined",
		"examining",
		"find",
		"finding",
		"found",
		"google",
		"googled",
		"googling",
		"highlight",
		"highlighted",
		"highlighting",
		"how",
		"identify",
		"identified",
		"identifying",
		"label",
		"labeled",
		"labelling",
		"listen",
		"listened",
		"listening",
		"list",
		"listed",
		"listing",
		"locate",
		"located",
		"locating",
		"location",
		"match",
		"matched",
		"matching",
		"memorize",
		"memorized",
		"memorizing",
		"memory",
		"name",
		"named",
		"naming",
		"network",
		"networked",
		"networking",
		"observe",
		"observed",
		"observing",
		"omit",
		"omitted",
		"omiting",
		"omitted",
		"omitting",
		"outlining",
		"outlined",
		"outline",
		"quote",
		"quoted",
		"quoting",
		"read",
		"recite",
		"recited",
		"reciting",
		"recognize",
		"recognized",
		"recognizing",
		"recall",
		"recalled",
		"recalling",
		"record",
		"recorded",
		"recording",
		"relate",
		"related",
		"relating",
		"repeat",
		"repeated",
		"repeating",
		"reproduce",
		"reproduced",
		"reproducing",
		"retrieve",
		"retrieved",
		"retrieving",
		"retell",
		"retold",
		"retelling",
		"search",
		"searched",
		"searching",
		"select",
		"selected",
		"selecting",
		"show",
		"shown",
		"showing",
		"spell",
		"spelled",
		"spelling",
		"state",
		"stated",
		"stating",
		"tabulate",
		"tabulated",
		"tabulating",
		"tell",
		"told",
		"visualize",
		"visualized",
		"visualizing",
		"what",
		"when",
		"where",
		"which",
		"who",
		"why",
	];
	// Understand / Comprehension-Explain
	const bloom_understand = [
		"annotate",
		"annotated",
		"annotating",
		"ask",
		"asking",
		"asked",
		"associate",
		"associating",
		"associated",
		"categorize",
		"categorized",
		"categorizing",
		"cite",
		"cited",
		"citing",
		"classify",
		"classified",
		"classifying",
		"comment",
		"commented",
		"commenting",
		"compare",
		"compared",
		"comparing",
		"contrast",
		"contrasted",
		"contrasting",
		"convert",
		"converted",
		"converting",
		"demonstrate",
		"demonstrated",
		"demonstrating",
		"describe",
		"described",
		"describing",
		"discover",
		"discovered",
		"discovering",
		"discuss",
		"discussed",
		"discussing",
		"distinguish",
		"distinguished",
		"distinguishing",
		"estimate",
		"estimated",
		"estimating",
		"evaluate",
		"evaluated",
		"evaluating",
		"explain",
		"explained",
		"explaining",
		"express",
		"expressed",
		"expressing",
		"extend",
		"extended",
		"extending",
		"exemplify",
		"exemplified",
		"exemplifying",
		"gather",
		"gathered",
		"gathering",
		"generalize",
		"generalized",
		"generalizing",
		"group",
		"grouped",
		"grouping",
		"illustrate",
		"illustrated",
		"illustrating",
		"identify",
		"identified",
		"identifying",
		"indicate",
		"indicated",
		"indicating",
		"infer",
		"inferred",
		"inferring",
		"interpret",
		"interpreted",
		"interpreting",
		"journal",
		"journaled",
		"journaling",
		"judge",
		"judged",
		"judging",
		"observe",
		"observed",
		"observing",
		"order",
		"ordered",
		"ordering",
		"outline",
		"outlined",
		"outlining",
		"paraphrase",
		"paraphrased",
		"paraphrasing",
		"predict",
		"predicted",
		"predicting",
		"relate",
		"related",
		"relating",
		"represent",
		"represented",
		"representing",
		"report",
		"reported",
		"reporting",
		"research",
		"researched",
		"researching",
		"rewrite",
		"rewritten",
		"rewriting",
		"review",
		"reviewed",
		"reviewing",
		"select",
		"selected",
		"selecting",
		"show",
		"showed",
		"showing",
		"summarize",
		"summarized",
		"summarizing",
		"tag",
		"tagged",
		"tagging",
		"trace",
		"traced",
		"tracing",
		"translate",
		"translated",
		"translating",
		"tweet",
		"tweeted",
		"tweeting",
	];

	// Application-Use
	const bloom_application = [
		"act",
		"acted",
		"acting",
		"act out",
		"acted out",
		"acting out",
		"apply",
		"applied",
		"applying",
		"articulate",
		"articulated",
		"articulating",
		"build",
		"built",
		"building",
		"calculate",
		"calculated",
		"calculating",
		"change",
		"changed",
		"changing",
		"charting",
		"charted",
		"charting",
		"choose",
		"chose",
		"choosing",
		"collect",
		"collected",
		"collecting",
		"complete",
		"completed",
		"completing",
		"compute",
		"computed",
		"computing",
		"construct",
		"constructed",
		"constructing",
		"demonstrate",
		"demonstrated",
		"demonstrating",
		"develop",
		"developed",
		"developing",
		"determine",
		"determined",
		"determining",
		"display",
		"displayed",
		"displaying",
		"dramatize",
		"dramatized",
		"dramatizing",
		"examine",
		"examined",
		"examining",
		"execute",
		"executed",
		"executing",
		"explain",
		"explained",
		"explaining",
		"experiment",
		"experimented",
		"experimenting",
		"experiment with",
		"experimented with",
		"experimenting with",
		"hack",
		"hacked",
		"hacking",
		"identify",
		"identified",
		"identifying",
		"implement",
		"implemented",
		"implementing",
		"integrate",
		"integrated",
		"integrating",
		"interview",
		"interviewed",
		"interviewing",
		"interpret",
		"interpreted",
		"interpreting",
		"judge",
		"judged",
		"judging",
		"list",
		"listed",
		"listing",
		"load",
		"loaded",
		"loading",
		"make use of",
		"made use of",
		"making use of",
		"manipulate",
		"manipulated",
		"manipulating",
		"model",
		"modeled",
		"modeling",
		"operate",
		"operated",
		"operating",
		"organize",
		"organized",
		"organizing",
		"paint",
		"painted",
		"painting",
		"play",
		"played",
		"playing",
		"prepare",
		"prepared",
		"preparing",
		"present",
		"presented",
		"presenting",
		"practice",
		"practiced",
		"practicing",
		"relate",
		"related",
		"relating",
		"reenact",
		"reenacted",
		"reenacting",
		"select",
		"selected",
		"selecting",
		"show",
		"showed",
		"showing",
		"simulate",
		"simulated",
		"simulating",
		"sketch",
		"sketched",
		"sketching",
		"teach",
		"taught",
		"teaching",
		"transfer",
		"transferred",
		"transferring",
		"use",
		"used",
		"using",
		"utilize",
		"utilized",
		"utilizing",
	];

	// Analysis-Take Apart
	const bloom_analysis = [
		"advert",
		"advertised",
		"advertising",
		"analyze",
		"analyzed",
		"analyzing",
		"appraise",
		"appraised",
		"appraising",
		"assumption",
		"assumed",
		"assuming",
		"atrribute",
		"attributed",
		"attributing",
		"break down",
		"broke down",
		"breaking down",
		"calculate",
		"calculated",
		"calculating",
		"categorize",
		"categorized",
		"categorizing",
		"classify",
		"classified",
		"classifying",
		"compare",
		"compared",
		"comparing",
		"conclude",
		"concluded",
		"concluding",
		"connect",
		"connected",
		"connecting",
		"conclusion",
		"concluded",
		"concluding",
		"contrast",
		"contrasted",
		"contrasting",
		"correlate",
		"correlated",
		"correlating",
		"deconstruct",
		"deconstructed",
		"deconstructing",
		"define",
		"defined",
		"defining",
		"describe",
		"described",
		"describing",
		"design",
		"designed",
		"designing",
		"develop",
		"developed",
		"developing",
		"devise",
		"devised",
		"devising",
		"diagram",
		"diagrammed",
		"diagramming",
		"differentiate",
		"differentiated",
		"differentiating",
		"discover",
		"discovered",
		"discovering",
		"distinguish",
		"distinguished",
		"distinguishing",
		"divide",
		"divided",
		"dividing",
		"estabish",
		"estimated",
		"estimating",
		"evaluate",
		"evaluated",
		"evaluating",
		"examine",
		"examined",
		"examining",
		"explain",
		"explained",
		"explaining",
		"explore",
		"explored",
		"exploring",
		"focus",
		"focused",
		"focusing",
		"function",
		"functioned",
		"functioning",
		"identify",
		"identified",
		"identifying",
		"illustrate",
		"illustrated",
		"illustrating",
		"infer",
		"inferred",
		"inferring",
		"inspect",
		"inspected",
		"inspecting",
		"integrate",
		"integrated",
		"integrating",
		"interpret",
		"interpreted",
		"interpreting",
		"link",
		"linked",
		"linking",
		"list",
		"listed",
		"listing",
		"mash",
		"mashed",
		"mashing",
		"mind map",
		"mind-mapped",
		"mind-mapping",
		"mind-mapping",
		"motive",
		"motivated",
		"motivating",
		"observe",
		"observed",
		"observing",
		"organize",
		"organized",
		"organizing",
		"outline",
		"outlined",
		"outlining",
		"plan",
		"planned",
		"planning",
		"prioritize",
		"prioritized",
		"prioritizing",
		"question",
		"questioned",
		"questioning",
		"relate",
		"related",
		"relating",
		"relationships",
		"related",
		"relating",
		"separate",
		"separated",
		"separating",
		"simplify",
		"simplified",
		"simplifying",
		"sort",
		"sorted",
		"sorting",
		"structure",
		"structured",
		"structuring",
		"survey",
		"surveyed",
		"surveying",
		"take part in",
		"took part in",
		"taking part in",
		"test",
		"tested",
		"testing",
		"test for",
		"tested for",
		"testing for",
		"theme",
		"themed",
		"theming",
	];

	// Evaluation-Judge It
	const bloom_evaluation = [
		"agree",
		"agreed",
		"agreeing",
		"appraise",
		"appraised",
		"appraising",
		"argue",
		"argued",
		"arguing",
		"assess",
		"assessed",
		"assessing",
		"award",
		"awarded",
		"awarding",
		"choose",
		"chose",
		"choosing",
		"comment",
		"commented",
		"commenting",
		"compare",
		"compared",
		"comparing",
		"consider",
		"considered",
		"considering",
		"convince",
		"convinced",
		"convincing",
		"criticize",
		"criticized",
		"criticizing",
		"debate",
		"debated",
		"debating",
		"decide",
		"decided",
		"deciding",
		"deduct",
		"deducted",
		"deducting",
		"defect",
		"defected",
		"defecting",
		"defend",
		"defended",
		"defending",
		"determine",
		"determined",
		"determining",
		"disprove",
		"disproved",
		"disproving",
		"dispute",
		"disputed",
		"disputing",
		"distinguish",
		"distinguished",
		"distinguishing",
		"editorialize",
		"editorialized",
		"editorializing",
		"estimate",
		"estimated",
		"estimating",
		"evaluate",
		"evaluated",
		"evaluating",
		"experiment",
		"experimented",
		"experimenting",
		"grade",
		"graded",
		"grading",
		"importance",
		"importanced",
		"importancing",
		"interpret",
		"interpreted",
		"interpreting",
		"influence",
		"influenced",
		"influencing",
		"justify",
		"justified",
		"justifying",
		"judge",
		"judged",
		"judging",
		"mark",
		"marked",
		"marking",
		"measure",
		"measured",
		"measuring",
		"moderate",
		"moderated",
		"moderating",
		"opinion",
		"opinied",
		"opinieing",
		"order",
		"ordered",
		"ordering",
		"persuade",
		"persuaded",
		"persuading",
		"perceive",
		"perceived",
		"perceiving",
		"predict",
		"predicted",
		"predicting",
		"prioritize",
		"prioritized",
		"prioritizing",
		"prove",
		"proved",
		"proving",
		"rank",
		"ranked",
		"ranking",
		"rate",
		"rated",
		"rating",
		"recommend",
		"recommended",
		"recommending",
		"reflect",
		"reflected",
		"reflecting",
		"review",
		"reviewed",
		"reviewing",
		"rule on",
		"ruled on",
		"ruling on",
		"score",
		"scored",
		"scoring",
		"select",
		"selected",
		"selecting",
		"support",
		"supported",
		"supporting",
		"summarize",
		"summarized",
		"summarizing",
		"test",
		"tested",
		"testing",
		"validate",
		"validated",
		"validating",
		"value",
		"valued",
		"valuing",
		"weigh",
		"weighed",
		"weighing",
	];

	// Synthesis/Creation-Make it new
	const bloom_creation = [
		"adapt",
		"adapted",
		"adapting",
		"animate",
		"animated",
		"animating",
		"anticipate",
		"anticipated",
		"anticipating",
		"arrange",
		"arranged",
		"arranging",
		"assemble",
		"assembled",
		"assembling",
		"blog",
		"blogged",
		"blogging",
		"build",
		"built",
		"building",
		"change",
		"changed",
		"changing",
		"choose",
		"chose",
		"choosing",
		"collaborate",
		"collaborated",
		"collaborating",
		"compose",
		"composed",
		"composing",
		"construct",
		"constructed",
		"constructing",
		"create",
		"created",
		"creating",
		"delete",
		"deleted",
		"deleting",
		"design",
		"designed",
		"designing",
		"devise",
		"devised",
		"devising",
		"direct",
		"directed",
		"directing",
		"discuss",
		"discussed",
		"discussing",
		"elaborate",
		"elaborated",
		"elaborating",
		"estimate",
		"estimated",
		"estimating",
		"facilitate",
		"facilitated",
		"facilitating",
		"formulate",
		"formulated",
		"formulating",
		"happen",
		"happened",
		"happening",
		"imagine",
		"imagined",
		"imagining",
		"improve",
		"improved",
		"improving",
		"integrate",
		"integrated",
		"integrating",
		"intervene",
		"intervened",
		"intervening",
		"invent",
		"invented",
		"inventing",
		"lead",
		"led",
		"leading",
		"manage",
		"managed",
		"managing",
		"maximize",
		"maximized",
		"maximizing",
		"minimize",
		"minimized",
		"minimizing",
		"modify",
		"modified",
		"modifying",
		"organize",
		"organized",
		"organizing",
		"originate",
		"originated",
		"originating",
		"podcast",
		"podcasted",
		"podcasting",
		"prepare",
		"prepared",
		"preparing",
		"predict",
		"predicted",
		"predicting",
		"propose",
		"proposed",
		"proposing",
		"rewrite",
		"rewrote",
		"rewriting",
		"simulate",
		"simulated",
		"simulating",
		"solve",
		"solved",
		"solving",
		"substitute",
		"substituted",
		"substituting",
		"support",
		"supported",
		"supporting",
		"suppose",
		"supposed",
		"supposing",
		"test",
		"tested",
		"testing",
		"theorize",
		"theorized",
		"theorizing",
		"validate",
		"validated",
		"validating",
		"wiki",
		"wikied",
		"wikiing",
		"write",
		"wrote",
		"writing",
		"film",
		"filmed",
		"filming",
		"program",
		"programmed",
		"programming",
		"role play",
		"role played",
		"role playing",
		"solve",
		"solved",
		"solving",
		"mix",
		"mixed",
		"mixing",
		"facilitate",
		"facilitated",
		"facilitating",
		"manage",
		"managed",
		"managing",
		"negotiate",
		"negotiated",
		"negotiating",
		"lead",
		"led",
		"leading",
	];

	let fieldToUpdate = "";
	let score = 0;
	let wordDetected = false;

	if (
		!wordDetected &&
		bloom_knowledge.some((word) => question.toLowerCase().includes(word))
	) {
		fieldToUpdate = "knowledge";
		await incrementTypeField(course, section, fieldToUpdate);
		score = score + 5;
		wordDetected = true;
	}
	wordDetected = false;
	if (
		!wordDetected &&
		bloom_understand.some((word) => question.toLowerCase().includes(word))
	) {
		fieldToUpdate = "comprehensive";
		await incrementTypeField(course, section, fieldToUpdate);
		score = score + 10;
		wordDetected = true;
	}
	wordDetected = false;
	if (
		!wordDetected &&
		bloom_application.some((word) => question.toLowerCase().includes(word))
	) {
		fieldToUpdate = "application";
		await incrementTypeField(course, section, fieldToUpdate);
		score = score + 15;
		wordDetected = true;
	}
	wordDetected = false;
	if (
		!wordDetected &&
		bloom_analysis.some((word) => question.toLowerCase().includes(word))
	) {
		fieldToUpdate = "analytical";
		await incrementTypeField(course, section, fieldToUpdate);
		score = score + 20;
		wordDetected = true;
	}
	wordDetected = false;
    if (
		!wordDetected &&
		bloom_evaluation.some((word) => question.toLowerCase().includes(word))
	) {
		fieldToUpdate = "evaluative";
		await incrementTypeField(course, section, fieldToUpdate);
		score = score + 20;
		wordDetected = true;
	}
    wordDetected = false;
	if (
		!wordDetected &&
		bloom_creation.some((word) => question.toLowerCase().includes(word))
	) {
		fieldToUpdate = "synthetic";
		await incrementTypeField(course, section, fieldToUpdate);
		score = score + 30;
		wordDetected = true;
	}

	return score;
}

export async function updateScore(username, num) {
	try {
		const user = await UserModel.findOne({ username });
		if (!user) {
			console.log("User not found");
			return;
		}
		const updated_score = user.score + num;
		await UserModel.updateOne({ username: username }, { score: updated_score });
	} catch (error) {
		console.log(error); // handle the error
	}
}

function calculateSimilarity(question1, question2) {
	if(question2){
		const distance = natural.LevenshteinDistance(question1, question2);
		const maxLength = Math.max(question1.length, question2.length);
		const similarity = 1 - distance / maxLength;
		return similarity;
	}else{
		return 0;
	}
}

export async function checkSimilarity(type, course, section, question, num){
	try{
		if(num==1){
			let existingQuestions = "";
			if(section){
				existingQuestions = await QuestionModel.find({ type, course, section });
			}else{
				existingQuestions = await QuestionModel.find({ type, course });
			}

			for (const existingQuestion of existingQuestions) {
				const similarity1 = calculateSimilarity(question, existingQuestion.question1);
				const similarity2 = calculateSimilarity(question, existingQuestion.question2);
				const similarity3 = calculateSimilarity(question, existingQuestion.question3);
				if (similarity1 >= 0.75 || similarity2 >= 0.75 || similarity3 >= 0.75) {
					return true;
				}
			}

			return false;
			
		}else if(num==2){
			let existingQuestions = "";
			if(section){
				existingQuestions = await FollowupModel.find({ course, section });
			}

			for (const existingQuestion of existingQuestions) {
				for(const comment of existingQuestion.comments){
					const similarity = calculateSimilarity(question, comment);
					if (similarity >= 0.75 ) {
						return true;
					}
				}
			}

			return false;
		}
	}catch(error){
		console.log(error);
		return { error: "Error checking similarity: " + error.message };
	}
}

export async function checkDuplicate(type, course, section, questions) {
	if (type == "general") {
		try {
			const q1 = questions;
			let statusQ11 = null;
			let statusQ12 = null;
			if(section){
				const filter = {
					course: course,
					section: section,
					$or: [
						{ question1: { $regex: new RegExp(q1, "i") } },
						{ question2: { $regex: new RegExp(q1, "i") } },
						{ question3: { $regex: new RegExp(q1, "i") } }
					]
				};
				statusQ11 = await QuestionModel.exists(filter);
			}else{
				const filter = {
					type: "general",
					question1: q1
				};
				statusQ11 = await QuestionModel.exists(filter);
			}
			
			if(section){
				const filter2 = {
					course: course,
					section: section,
					$or: [
						{ comments: { $regex: new RegExp(q1, "i") } }
					]
				};
				statusQ12 = await FollowupModel.exists(filter2);
			}else{
				const filter2 = {
					course: course,
					$or: [
						{ comments: { $regex: new RegExp(q1, "i") } }
					]
				};
				statusQ12 = await FollowupModel.exists(filter2);
			}
			
			if (statusQ11 || statusQ12) {
				return { error: "Question Already Exists!" };
			}

			const statusQ21 = await checkSimilarity(type, course, section, q1, 1);
			const statusQ22 = await checkSimilarity(type, course, section, q1, 2);

			if(statusQ21 || statusQ22){
				return { error: "Similar Question Already Exists!"};
			}
			return { success: "No duplicates found" };
		} catch (error) {
			return { error: "Error checking general duplicates: " + error.message };
		}
	}

	if (type == "pre") {
		const q1 = questions[0];
		const q2 = questions[1];
		const q3 = questions[2];

		try {
			const filter = {
				course: course,
				section: section,
				$or: [
				  { question1: { $regex: new RegExp(q1, "i") } },
				  { question2: { $regex: new RegExp(q1, "i") } },
				  { question3: { $regex: new RegExp(q1, "i") } }
				]
			  };
			  const statusQ11 = await QuestionModel.exists(filter);
			  if (statusQ11) {
				return { error: "Question 1 Already Exists!" };
			  }
			
			  filter.$or = [
				{ question1: { $regex: new RegExp(q2, "i") } },
				{ question2: { $regex: new RegExp(q2, "i") } },
				{ question3: { $regex: new RegExp(q2, "i") } }
			  ];
			  const statusQ21 = await QuestionModel.exists(filter);
			  
			  if (statusQ21) {
				return { error: "Question 2 Already Exists!" };
			  }
			
			  filter.$or = [
				{ question1: { $regex: new RegExp(q3, "i") } },
				{ question2: { $regex: new RegExp(q3, "i") } },
				{ question3: { $regex: new RegExp(q3, "i") } }
			  ];
			  const statusQ31 = await QuestionModel.exists(filter);
			  
			  if (statusQ31) {
				return { error: "Question 3 Already Exists!" };
			  }

			  const statusQ41 = await checkSimilarity(type, course, section, q1, 1);
			  const statusQ42 = await checkSimilarity(type, course, section, q2, 1);
			  const statusQ43 = await checkSimilarity(type, course, section, q3, 1);

			  if(statusQ41){
				return { error: "Question 1 Similar to Another Question!" };
			  }else if(statusQ42){
				return { error: "Question 2 Similar to Another Question!" };
			  }else if(statusQ43){
				return { error: "Question 3 Similar to Another Question!" };
			  }
			
			  // If no duplicates found
			  return { success: "No duplicates found" };
		} catch (error) {
			return { error: "Error checking pre duplicates: " + error.message };
		}
	}
}

export async function checkSimilarity2(type, course, section, question){
	try{
		let existingQuestions = "";
		if(section){
			existingQuestions = await QuestionModel.find({ type, course, section });
		}else{
			existingQuestions = await QuestionModel.find({ type, course });
		}

		for (const existingQuestion of existingQuestions) {
			if(question==existingQuestion.question1 || question==existingQuestion.question2 || question==existingQuestion.question3){
				continue;
			}else{
				const similarity1 = calculateSimilarity(question, existingQuestion.question1);
				const similarity2 = calculateSimilarity(question, existingQuestion.question2);
				const similarity3 = calculateSimilarity(question, existingQuestion.question3);
				
				var user = "";

				if(similarity1 >= 0.75 || similarity2 >= 0.75 || similarity3 >= 0.75){
					const username = existingQuestion.username;
					user = await UserModel.findOne({ username: username });
					var scoreToDeduct = existingQuestion.q1Score;
					if(existingQuestion.q2Score){
						scoreToDeduct = scoreToDeduct + existingQuestion.q2Score
					}
					if(existingQuestion.q3Score){
						scoreToDeduct = scoreToDeduct + existingQuestion.q3Score
					}
				}

				if (similarity1 >= 0.75) {
					console.log(question);
					console.log(existingQuestion.question1);
					console.log("Q1: ", existingQuestion.q1Score)
					console.log("Q2: ", existingQuestion.q2Score)
					console.log("Q3: ", existingQuestion.q3Score)
					console.log("Deducted: ", scoreToDeduct, "from: ", user.username);

					await QuestionModel.deleteOne({ _id: existingQuestion._id });
					if (user) {
						user.score -= scoreToDeduct;
						await user.save();
					}
					return true;
				}else if(similarity2 >= 0.75){
					console.log(question);
					console.log(existingQuestion.question2);
					console.log("Q1: ", existingQuestion.q1Score)
					console.log("Q2: ", existingQuestion.q2Score)
					console.log("Q3: ", existingQuestion.q3Score)
					console.log("Deducted: ", scoreToDeduct, "from: ", user.username);

					await QuestionModel.deleteOne({ _id: existingQuestion._id });
					if (user) {
						user.score -= scoreToDeduct;
						await user.save();
					}
					return true;
				}else if(similarity3 >= 0.75){
					console.log(question);
					console.log(existingQuestion.question3);
					console.log("Q1: ", existingQuestion.q1Score)
					console.log("Q2: ", existingQuestion.q2Score)
					console.log("Q3: ", existingQuestion.q3Score)
					console.log("Deducted: ", scoreToDeduct, "from: ", user.username);

					await QuestionModel.deleteOne({ _id: existingQuestion._id });
					if (user) {
						user.score -= scoreToDeduct;
						await user.save();
					}
					return true;
				}
			}
		}
		return false;
	}catch(error){
		console.log(error);
		return { error: "Error checking similarity: " + error.message };
	}
}

export async function adminCommand(req, res){
	try{
		console.log("Admin command running");

		const questions = await QuestionModel.find();
		console.log(questions.length);

		var general_count = 0;
		var pre_count = 0;
		var count = 0;

		for(const question of questions){
			count++;
			console.log("Question count: ", count);
			if(question.type=="general"){
				const statusQ1 = await checkSimilarity2(question.type, question.course, question.section, question.question1);
			
				if(statusQ1){
					general_count++;
					console.log("General_Count: ", general_count);
				}
			}else if(question.type=="pre"){
				const statusQ1 = await checkSimilarity2(question.type, question.course, question.section, question.question1);
				const statusQ2 = await checkSimilarity2(question.type, question.course, question.section, question.question2);
				const statusQ3 = await checkSimilarity2(question.type, question.course, question.section, question.question3);
			
				if(statusQ1 || statusQ2 || statusQ3){
					pre_count++;
					console.log("Pre_Count: ", pre_count);
				}
			}
		}
		const total_count = general_count + pre_count;
		console.log("Total: ", total_count);

		const now_questions = await QuestionModel.find();
		console.log(now_questions.length);

		return res.status(200);
	}catch(error){
		console.log(error);
		return res.status(500);
	}
}

// export async function removeWrongSections(req, res){
// 	try{
// 		const questions = await QuestionModel.find({
// 			course: "CIS101",
//             section: {"$nin": [10, 11]}
//         });
//         console.log(questions.length);

// 		for (const question of questions) {

// 			const q1S = parseInt(question.q1Score);
// 			const q2S = parseInt(question.q2Score);
// 			const q3S = parseInt(question.q3Score);
// 			let scoreToDeduct = 0;

// 			if(q1S){
// 				scoreToDeduct = scoreToDeduct + q1S;
// 			}
// 			if(q2S){
// 				scoreToDeduct = scoreToDeduct + q2S;
// 			}
// 			if(q3S){
// 				scoreToDeduct = scoreToDeduct + q3S;
// 			}

//             const user = await UserModel.findOne({ username: question.username });

//             if (user) {
//                 user.score -= scoreToDeduct;
//                 await user.save();
//             }
//             await QuestionModel.deleteOne({ _id: question._id });
//         }
// 		console.log("Operation Successful");

// 		res.sendStatus(200);
// 	}catch(error){
// 		console.log(error);
// 		res.sendStatus(500);
// 	}
// }

export async function validateQuestion(req, res, next) {
	try {
		const values = req.body;

		//General Questions
		if (values.question1 && !values.question2 && !values.question3) {
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
				"are",
				"was",
				"were",
				"will",
				"can",
				"does",
				"do",
				"shall",
				"should"
			];

			const lowercaseQuestion = values.question1.toLowerCase();
			const containsBloomQuestion = bloom_question.some((questionWord) =>
				lowercaseQuestion.includes(questionWord)
			);

			if (values.question1.length < 10) {
				return res.status(500).send({ error: "Question too Short!" });
			} else if (containsBloomQuestion) {
				const result = await checkDuplicate("general", values.course, values.section, values.question1);
				console.log(result);
				if (result.error) {
					return res.status(500).json({ error: result.error });
				} else {
					next();
				}
			} else {
				return res.status(500).send({ error: "Invalid Question!" });
			}

			//Pre Questions
		} else if (values.question1 && values.question2 && values.question3) {
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
				"are",
				"was",
				"were",
				"will",
				"can",
				"does",
				"do",
				"shall",
				"should"
			];

			const lowercaseQuestion1 = values.question1.toLowerCase();
			const lowercaseQuestion2 = values.question2.toLowerCase();
			const lowercaseQuestion3 = values.question3.toLowerCase();
			const containsBloomQuestion1 = bloom_question.some((questionWord) =>
				lowercaseQuestion1.includes(questionWord)
			);
			const containsBloomQuestion2 = bloom_question.some((questionWord) =>
				lowercaseQuestion2.includes(questionWord)
			);
			const containsBloomQuestion3 = bloom_question.some((questionWord) =>
				lowercaseQuestion3.includes(questionWord)
			);

			if (values.question1.length < 10) {
				return res.status(500).send({ error: "Question 1 too Short!" });
			} else if (values.question2.length < 10) {
				return res.status(500).send({ error: "Question 2 too Short!" });
			} else if (values.question3.length < 10) {
				return res.status(500).send({ error: "Question 3 too Short!" });
			} else if (!containsBloomQuestion1) {
				return res.status(500).send({ error: "Question-1 Invalid" });
			} else if (!containsBloomQuestion2) {
				return res.status(500).send({ error: "Question-2 Invalid" });
			} else if (!containsBloomQuestion3) {
				return res.status(500).send({ error: "Question-3 Invalid" });
			} else if (
				lowercaseQuestion1 == lowercaseQuestion2 ||
				lowercaseQuestion1 == lowercaseQuestion3 ||
				lowercaseQuestion2 == lowercaseQuestion3
			) {
				return res.status(500).send({ error: "Duplicate Questions" });
			} else {
				var q_array = [values.question1, values.question2, values.question3];
				const result = await checkDuplicate("pre", values.course, values.section, q_array);
				if (result.error) {
					return res.status(500).json({ error: result.error });
				} else {
					next();
				}
			}
		} else if (values.comments) {
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
				"are",
				"was",
				"were",
				"will",
				"can",
				"does",
				"do",
				"shall",
				"should"
			];

			const lowercaseComment = values.comments.toLowerCase();
			const containsBloomQuestion = bloom_question.some((questionWord) =>
				lowercaseComment.includes(questionWord)
			);

			if (values.comments.length < 10) {
				return res.status(500).send({ error: "Question too Short!" });
			} else if (containsBloomQuestion) {
				const result = await checkDuplicate("general", values.course, values.section, values.comments);
				console.log(result);
				if (result.error) {
					return res.status(500).json({ error: result.error });
				} else {
					next();
				}
			} else {
				return res.status(500).send({ error: "Invalid Question!" });
			}
		} else {
			return res.status(500).json({ error: "Questions Missing!" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Something strange has happened!" });
	}
}

/** GET http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
	req.app.locals.OTP = await otpGenerator.generate(6, {
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});
	res.status(201).send({ code: req.app.locals.OTP });
}

export async function recoverUsername(req, res) {
	try {
		const email = req.query.email;
		console.log("Email: ", email);
		const user = await UserModel.findOne({ email });
		if (!user) {
			return res.status(404).json({ error: "Username not found" });
		}
		return res.json(user.username);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}

/** GET http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
	const { code } = req.query;
	if (parseInt(req.app.locals.OTP) === parseInt(code)) {
		req.app.locals.OTP = null;
		req.app.locals.resetSession = true;
		return res.status(201).send({ msg: "Verified Successfully" });
	}
	return res.status(400).send({ error: "Invalid OTP" });
}

//successfully redirect user when OTP is valid
/** GET http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
	if (req.app.locals.resetSession) {
		return res.status(201).send({ flag: req.app.locals.resetSession });
	}
	return res.status(440).send({ error: "Session expired!" });
}

/** PUT http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
	try {
		if (!req.app.locals.resetSession)
			return res.status(404).send({ error: "Session Expired!" });

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

export async function postQuestionnaire(req, res){
	try{
		const {
			username,
            type,
			course,
			section,
			date,
			semester,
			attitude,
			confidence,
			topic_motivation,
			teaching_method,
			new_method,
			learning_motivation,
			justification,
			whyChooseCourse,
			questionsAskedYoung,
			questionsAskDaily,
			questionsHelpLearn,
		} = req.body;

		const exists = QuestionnaireModel.exists({ username: username, type: type });

		const[questionnaireExists] = await Promise.all([
			exists
		])

		if(questionnaireExists){
			return res.status(500).json({ msg: `You have already posted the questionnaire` });
		}

		if(!username || !type || !course || !date || !semester){
			return res.status(500).json({ msg: `Essential Information Missing!` });
		}
		if(!section){
			return res.status(500).json({ msg: `Section Missing!` });
		}
		if(type==="pre"){
			//Pre-Questionnaire Validation
			if(attitude=="" || confidence=="" || topic_motivation=="" || teaching_method=="" ||
			learning_motivation=="" || justification=="" || whyChooseCourse=="" || new_method=="" ||
			questionsAskedYoung=="" || questionsAskDaily=="" || questionsHelpLearn==""){
				return res.status(500).json({ msg: `Information Missing!` });
			}
			if(attitude.length < 10 || questionsHelpLearn.length < 10 || teaching_method.length < 10 || justification.length < 10){
				return res.status(500).json({ msg: `Response too short!` });
			}
		}else{
			//Post-Questionnaire Validation
		}

		const questionnaire = new QuestionnaireModel({
			username,
			type,
			course,
			section,
			date,
			semester,
			attitude,
			confidence,
			topic_motivation,
			teaching_method,
			new_method,
			learning_motivation,
			justification,
			whyChooseCourse,
			questionsAskedYoung,
			questionsAskDaily,
			questionsHelpLearn
		});

		const result = await questionnaire.save();

		return res.status(201).json({ msg: `Questionnaire Posted` });
	}catch(error){
		console.log(error);
		return res.status(500).json({ error: error.error });
	}
}
