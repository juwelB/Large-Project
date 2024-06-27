const User = require('../Model/User');
const bcrypt = require('bcrypt');


// create/register new user
const registerUser = async (req, res) => {
    const userData = new User(req.body);

    //apply ecryption using bcrypt


    try {
        //apply hash() using bcrypt
        let salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);

        //add user to db
        const newUser = await userData.save();
        // const result = await User.findOne({ newUser }).select('-password'); // help here!
        const result = await User.findOne(newUser).select('-password -email');

        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({
            message: err.message
        })

    }

}

// login/validate exisiting user
const loginUser = async (req, res) => {
    const { userName, email, password } = req.body;
    // also authenticate uses with username & password

    try {
        let user = await User.findOne({ // check for username || email
            $or: [
                { email }, { userName }
            ]
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }


        // hash and compare incoming password
        const validPassword = await bcrypt.compare(password, user.password);

        // if (password !== user.password) {
        if (!validPassword)
            return res.status(400).json({ msg: 'Invalid Credentials' });


        // successfull resond msg
        res.status(201).json({
            name: user.firstName,
            msg: "login succesfull"
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// for logged in users, get the favorite
// add code
module.exports = {
    registerUser,
    loginUser
};