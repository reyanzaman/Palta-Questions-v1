import axios from 'axios';
import jwt_decode from 'jwt-decode';

// axios.defaults.baseURL = 'https://iub-qbl.onrender.com';
axios.defaults.baseURL = 'http://localhost:8081/';

// Make API Requests

// Authenticate Function
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error){
        console.log(error)
        return { error: "Username doesn't exist"}
    }
}

// Login Function
export async function verifyPassword({ username, password }){
    try{
        if(username){
            const { data } = await axios.post('/api/login', { username, password })
            return Promise.resolve({ data })
        }
    }catch(error){
        return Promise.reject({ error : "Password doesn't match."})
    }
}

/** To get username from Token */
export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token)
    return decode;
}

export async function getUserDetails(username){
    try{
        const response = await axios.get('/api/userDetails', {
            params: { username }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function setUserDetails(username){
    try{
        const response = await axios.post('/api/setUserDetails', {
            params: { username }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function setSection(username, section){
    try{
        const response = await axios.post('/api/setSection', {
            username, section
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function setCourse(username, course){
    try{
        const response = await axios.post('/api/setCourse', {
            username, course
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function uploadPhoto(username, profile){
    try{
        const response = await axios.post('/api/photo', {
            username,
            profile
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function findQuestions(type, course, topic, section, date, month, year){
    try{
        const response = await axios.get('/api/questions', {
            params: { type, course, topic, section, date, month, year }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function findQuestionnaire(type, course, section, semester, year){
    try{
        const response = await axios.get('/api/getQuestionnaire', {
            params: { type, course, section, semester, year }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function findAllComments(course){
    try{
        const response = await axios.get('/api/commentAll', {
            params: { course }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function findRanking(section, course){
    try{
        console.log(section, course);
        const response = await axios.get('/api/leaderboard', {
            params: { section, course }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function findGeneral(type, date, month, year){
    try{
        const response = await axios.get('/api/general', {
            params: { type, date, month, year }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function findGeneralAll(type, month, year){
    try{
        const response = await axios.get('/api/generalAll', {
            params: { type, month, year }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function findComments(question){
    try{
        const response = await axios.get('/api/getComment', {
            params: { question }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function postGeneral(values){
    try{
        const { data: { msg } } = await axios.post(`/api/pre`, values);
        return Promise.resolve(msg);
    }catch(error){
        console.log(error);
        return Promise.reject({ error })
    }
}

export async function postComments(values){
    try{
        const { data: { msg } } = await axios.post(`/api/comments`, values);
        return Promise.resolve(msg);
    }catch(error){
        console.log(error);
        return Promise.reject({ error })
    }
}

// Update Rank
export async function updateRank(username){
    try{
        const { data: {msg} } = await axios.post(`/api/rank`, { username });
        return Promise.resolve(msg);
    }catch(error){
        console.log(error);
    }
}

// Get User Details
export async function getUser({ username }){ 
    try{
        const { data } = await axios.get(`/api/user/${username}`);
        return { data };
    }catch(error){
        return {error : "Password doesn't match!"}
    }
}

// Register User Function
export async function registerUser(credentials){
    try{
        const { data: { msg }, status } = await axios.post(`/api/register`, credentials)

        let { username, email } = credentials;

        email = email + "@iub.edu.bd";

        // Send Email
        if(status === 201){
            await axios.post('/api/registerMail', { username, userEmail : email, text : msg})
        }

        return Promise.resolve(msg)

    }catch(error){
        return Promise.reject({ error })
    }
}

// Submit Post-Question
export async function postQuestion(values){
    try{
        const { data: { msg } } = await axios.post(`/api/post`, values);

        return Promise.resolve(msg)
    }catch(error){
        console.log(error)
        return Promise.reject({ error });
    }
}

// Submit Pre-Question
export async function preQuestion(values){
    try{
        const { data: { msg } } = await axios.post(`/api/pre`, values);

        return Promise.resolve(msg)
    }catch(error){
        console.log(error)
        return Promise.reject({ error });
    }
}

// Generate OTP
export async function generateOTP(username){
    try{
        const {data: { code }, status } = await axios.get('/api/generateOTP', { params : { username }})

        // Send Mail with OTP
        if(status === 201){
            let { data: { email }} = await getUser({ username })
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery OTP"})
        }
        return Promise.resolve(code);
    }catch(error){
        return Promise.reject({ error });
    }
}

export async function recoverUsername(email){
    try{
        const request = await axios.get(`/api/getUsername`, 
        { params: 
            {email: email.email}
        });
        console.log(request);
        if(!request.data){
            throw new Error();
        }
        let text = `Your Username is ${request.data}. Please login at https://palta-q.netlify.app/login.`;
        await axios.post('/api/registerMail', { username: request.data, userEmail: email.email, text: text, subject: "Username Recovery"})
        return Promise.resolve("Username has been sent to email");
    }catch(error){
        console.log(error);
        return Promise.reject("Account does not exist!");
    }
}

// Verify OTP
export async function verifyOTP({ username, code }){
    try{
        const { data, status } = await axios.get('/api/verifyOTP', { params : { username, code }})
        return { data, status }
    }catch(error){
        console.log(error);
        return Promise.reject(error);
    }
}

// Reset Password
export async function resetPassword({ username, password }){
    try{
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status })
    }catch(error){
        return Promise.reject({ error })
    }
}

export async function postQuestionnaire(values){
    try{
        console.log(values);
        const { data: { msg } } = await axios.post(`/api/questionnaire`, values);

        return Promise.resolve(msg)
    }catch(error){
        console.log(error)
        return Promise.reject({ error });
    }
}