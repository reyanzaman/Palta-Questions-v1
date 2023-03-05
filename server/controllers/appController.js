import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';


/** middleware for verify user */
export async function verifyUser(req, res, next){
    try{

        const { username } = req.method == "GET" ? req.query : req.body;

        //check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error: "User not found" });
        next();

    }catch(error){
        return res.status(404).send({ error: "Authentication Error" });
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
        const { username, password, id, email } = req.body;
    
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
    });
  
    const result = await user.save();
  
    res.status(201).json({ msg: "User Registration Succesful" });
    } catch (error) {
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
    res.json('getUser route');
}

/** GET http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res){
    res.json('generateOTP route');
}

/** GET http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res){
    res.json('verifyOTP route');
}

//successfully redirect user when OTP is valid
/** GET http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res){
    res.json('createResetSession route');
}

/** PUT http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res){
    res.json('resetPassword route');
}