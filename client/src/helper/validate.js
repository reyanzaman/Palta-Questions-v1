import toast from 'react-hot-toast'

/** validate login page username */
export async function usernameValidate(values){
    const errors = usernameVerify({}, values);
    
    return errors;
}

/** validate password async */
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);

    return errors;
}

/** validate password */
function passwordVerify(errors = {}, values){

    const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/

    if(!values.password){
        errors.password = toast.error("Password Required!")
    }else if(values.password.includes(" ")){
        errors.password = toast.error("Wrong Password")
    }else if(values.password.length < 4){
        errors.password = toast.error("Password too short! Must be minimum 4 characters.")
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must contain at least one special character.")
    }

    return errors;
}

/** validate username */
function usernameVerify(error = {}, values){
    if(!values.username){
        error.username = toast.error('Username Required!')
    }else if(values.username.includes(" ")){
        error.username = toast.error('Invalid Username')
    }

    return error;
}