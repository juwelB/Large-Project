const User = require('../Model/User');


// create/register new user
const registerUser = async (req, res) => {
    const userData = new User(req.body);


    try {
        //add user to db
        const newUser = await userData.save();
        res.status(201).json(newUser.get)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })

    }


}

// login/validate exisiting user
const validateUser = async (req, res) => {

}


module.exports = {
    registerUser,
    validateUser
}