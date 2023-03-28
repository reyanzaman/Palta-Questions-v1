import axios from 'axios';
import jwt_decode from 'jwt-decode';

axios.defaults.baseURL = 'https://iub-qbl.onrender.com';

// Make API Requests

/** To get username from Token */
export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token)
    return decode;
}

export async function findQuestions(type, course, topic){
    try{
        console.log("Helper Function Running")
        const response = await axios.get('/api/questions', {
            params: { type, course, topic }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function findGeneral(course, topic){
    try{
        console.log("Helper Function Running")
        const response = await axios.get('/api/general', {
            params: { course, topic }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function findAnswers(question){
    try{
        console.log("Helper Function Running")
        const response = await axios.get('/api/getanswer', {
            params: { question }
        });
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export async function postAnswer(values){
    try{
        const { data: { msg } } = await axios.post(`/api/answer`, values);
        return Promise.resolve(msg);
    }catch(error){
        console.log(error);
    }
}

// Authenticate Function
export async function authenticate(username){
    console.log(process.env)
    console.log(axios.defaults.baseURL + "/api/authenticate")
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error){
        return { error: "Username doesn't exist"}
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
        console.log("helper function")
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
        console.log("helper function")
        console.log(error)
        return Promise.reject({ error });
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

// Verify OTP
export async function verifyOTP({ username, code }){
    try{
        const { data, status } = await axios.get('/api/verifyOTP', { params : { username, code }})
        return { data, status }
    }catch(error){
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