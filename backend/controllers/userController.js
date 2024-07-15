const User = require('../Model/User');
const bcrypt = require('bcrypt');
const Token = require("../Model/Token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");


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

        const token = await new Token({
            userId: newUser._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save();
        const url = `${process.env.BASE_URL}api/v1/users/${newUser._id}/verify/${token.token}`;
        await sendEmail(newUser.email,"Verify Email",url);

        // const result = await User.findOne({ newUser }).select('-password'); // help here!
        const result = await User.findOne({_id: newUser._id}).select('-password -email');

        res.status(201).json({message: "An email was sent to your account please verify"});
    } catch (err) {
        res.status(400).json({
            message: err.message
        })

    }

}

const verifyUser = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(400).json({ message: "Invalid link" });
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        }).exec();

        //console.log(token instanceof Token);
        if (!token) {
            return res.status(400).json({ message: "Invalid link" });
        }

        await User.updateOne({ _id: user._id }, { $set: { isVerified: true } });
        //console.log("Token found", token);
        await Token.deleteOne({ _id: token._id });
        //console.log("Token removed", token);

        res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
        console.error("Error in verifyUser:", err);
        res.status(500).json({ message: "Internal Server Error" });
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

        if(!user.isVerified){
            let token = await Token.findOne({userId: user._id});
            if(!token)
            {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex")
                }).save();
                const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
                await sendEmail(user.email,"Verify Email",url);

            }
            return res.status(400).json({message: "An email was sent to your account please verify"});
        }


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