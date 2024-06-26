//Controller for user-related routes

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

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        if (password !== user.password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


module.exports = {
    registerUser,
    validateUser,
    loginUser
}