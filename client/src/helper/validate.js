import toast from 'react-hot-toast';
import { authenticate } from './helper';

/** validate username */
function usernameVerify(error = {}, values){
    if(!values.username){
        error.username = toast.error('Username Required!')
    }
    // }else if(values.username.includes(" ")){
    //     error.username = toast.error('Invalid Username')
    // }

    return error;
}

/** validate login page username */
export async function usernameValidate(values){
    const errors = usernameVerify({}, values);
    
    if(values.username){
        // check user existence
        const { status } = await authenticate(values.username)

        if(status !== 200){
            errors.exist = toast.error('User does not exist')
        }
    }

    return errors;
}

/** validate password async */
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);

    return errors;
}

/** validate reset password */
export async function resetPasswordValidation(values){
    const errors = passwordVerify({}, values);

    if(values.password !== values.confirm_pwd){
        errors.exists = toast.error("Passwords do not match!")
    }

    return errors;
}

/** validate register form */
export async function registerValidation(values){
    const errors = usernameVerify({}, values);
    idVerify(errors, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);

    return errors;
}

/** ************************************** */

/** validate password */
function passwordVerify(errors = {}, values){

    // const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/

    if(!values.password){
        errors.password = toast.error("Password Required!")
    }else if(values.password.includes(" ")){
        errors.password = toast.error("Invalid character in password")
    }else if(String(values.password).length < 4){
        errors.password = toast.error("Password too short! Must be minimum 4 characters.")
    }
    // }else if(!specialChars.test(values.password)){
    //     errors.password = toast.error("Password must contain at least one special character.")
    // }

    return errors;
}

/** validate email */
function emailVerify(error={}, values){
    if(!values.email){
        error.email = toast.error("Email Required!");
    }else if(values.email.includes(" ")){
        error.email = toast.error("Invalid Email!");
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.error("Invalid Email Address!")
    }

    return error;
}

function idVerify(error = {}, values) {
    if (!values.id) {
        error.id = toast.error("ID Required!");
    } else if (typeof values.id === "string" && values.id.includes(" ")) {
        error.id = toast.error("Invalid ID");
    } else if (/^[a-zA-z]*$/i.test(values.id)) {
        error.id = toast.error("Invalid ID");
    } else if (String(values.id).length < 4) {
        error.id = toast.error("Invalid ID");
    }
    return error;
}
  