const User = require('../Model/User');
const bcrypt = require('bcrypt');
const Token = require("../Model/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { isStrongPassword } = require('../../passwordValidator');

require('dotenv').config(); // Ensure this is at the very top

// create/register new user
const registerUser = async (req, res) => {
    const { email, userName, password, firstName, lastName } = req.body;

    try {
        // Check if the email already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) 
        {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Check if the username already exists
        existingUser = await User.findOne({ userName });
        if (existingUser) 
        {
            return res.status(400).json({ message: 'Username already in use' });
        }

        if (!isStrongPassword(password)) 
        {
            return res.status(400).json({
                message: 'Password does not meet the strength requirements. Ensure it is 8-30 characters long, contains uppercase and lowercase letters, numbers, and special characters.'
            });
        }

        // Create new user
        const userData = new User({ email, userName, password, firstName, lastName });

        // Apply encryption using bcrypt
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
        if (!user) 
        {
            return res.status(400).json({ message: "Invalid link" });
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        }).exec();
        
        //console.log(token instanceof Token);
        if (!token) 
        {
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
};


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

        if (!user) 
        {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }


        // hash and compare incoming password
        const validPassword = await bcrypt.compare(password, user.password);

        // if (password !== user.password) {
        if (!validPassword)
            return res.status(400).json({ msg: 'Invalid Credentials' });

        if (!user.isVerified) 
        {
            let token = await Token.findOne({ userId: user._id });
            if (!token) 
            {
              token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex")
              }).save();
              const url = `${process.env.BASE_URL}api/v1/users/${user._id}/verify/${token.token}`;
              await sendEmail(user.email, "Verify Email", url);
            } else {
              const url = `${process.env.BASE_URL}api/v1/users/${user._id}/verify/${token.token}`;
              await sendEmail(user.email, "Verify Email", url);
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
        res.status(500).json('Server Error');
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        console.log("Finding user with email:", email);
        const user = await User.findOne({ email });
        if (!user) 
        {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Generating token for user:", user._id);
        // Generate a token
        const token = crypto.randomBytes(32).toString("hex");

        // Find existing token or create a new one
        let userToken = await Token.findOne({ userId: user._id });
        if (userToken) 
        {
            userToken.token = token;
        } else {
            userToken = new Token({
                userId: user._id,
                token: token
            });
        }

        console.log("Saving token:", userToken);
        await userToken.save();

        const url = `${process.env.BASE_URL}api/v1/users/${user._id}/resetpassword/${token.token}`;

        await sendEmail(user.email,"Forgot Password",url);

        res.status(202).json({message: "An email was sent to your account please reset password"});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const resetPassword = async (req, res) => {
    const { userId, token } = req.params;
    const { newPassword } = req.body;

    try 
    {
        const passwordResetToken = await Token.findOne({ userId, token });
        if (!passwordResetToken) 
        {
            return res.status(400).json({ message: "Invalid or expired password reset token" });
        }

    
        const user = await User.findOne({ _id: userId });
        if (!user) 
        {
            return res.status(400).json({ message: "User not found" });
        }

        
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();

        await Token.deleteOne({ _id: passwordResetToken._id });

        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const userInfo = async (req,res) => {
    const { userId } = req.params;

    try{
        const user = await User.findById(userId);

        if(!user)
        {
            return res.status(404).json({message : "User not found"});
        }

        res.status(200).json(user);
        
    }catch (err){
        console.err(err);
        res.status(500).json({messaage: "Internal Server Error"});
    }

};


// for logged in users, get the favorite
// add code
module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    forgotPassword,
    resetPassword,
    userInfo
};