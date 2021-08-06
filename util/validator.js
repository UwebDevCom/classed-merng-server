module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {}
    if(username.trim() === ''){
        errors.username = 'Username nust not be empty';
    }
    if(email.trim() === ''){
        errors.email = 'Email nust not be empty';
    }else {
        const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!email.match(regEx)) {
        errors.email = 'Email nust be valid';
        }
    }
    if(password.trim() === ''){
        errors.password = 'Password nust not be empty';
    }else if (password !== confirmPassword)
    {
        errors.confirmPassword = 'Passwords must match';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
};

module.exports.validateLoginInput = (username, password)=>{
   const errors = {};
   if(username.trim() === ''){
    errors.username = 'Username nust not be empty';
}
if(password.trim() === ''){
    errors.password = 'Username nust not be empty';
}
console.log(errors)
return {
    errors,
    valid: Object.keys(errors).length < 1
}
} 