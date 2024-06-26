<<<<<<< HEAD
//Controller for user-related routes

=======
>>>>>>> 2f8b5d101435158da9a28a8c90fd1200ca5303f6
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

<<<<<<< HEAD
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
=======

module.exports = {
    registerUser,
    validateUser
>>>>>>> 2f8b5d101435158da9a28a8c90fd1200ca5303f6
}