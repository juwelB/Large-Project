
const passwordRequirements = {
    minLength: 8,
    maxLength: 30,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumbers: /\d/,
    hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/
};

const isStrongPassword = (password) => {
    if (password.length < passwordRequirements.minLength || password.length > passwordRequirements.maxLength) 
    {
        if(password.length < passwordRequirements.minLength)
        {
            console.log("Password not long enough"); 
        }
        else
        {
            console.log("Password too long");
        }
        return false;
    }
    if (!passwordRequirements.hasUpperCase.test(password)) 
    {
        console.log("Has no uppercase letters");
        return false;
    }
    if (!passwordRequirements.hasLowerCase.test(password)) 
    {
        console.log("Has no lowecase letters");
        return false;
    }
    if (!passwordRequirements.hasNumbers.test(password)) 
    {
        console.log("Has no numbers");
        return false;
    }
    if (!passwordRequirements.hasSpecialChars.test(password)) 
    {
        console.log("Has no special characters");
        return false;
    }
    return true;
};

module.exports = { isStrongPassword };
