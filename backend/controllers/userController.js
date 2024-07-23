const User = require('../Model/User');
const bcrypt = require('bcrypt');
const Token = require("../Model/myToken"); // Updated the path to match the correct file name
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Club = require('../Model/Club'); // Import the Club model

require('dotenv').config(); // Ensure this is at the very top

// create/register new user
const registerUser = async (req, res) => {
    const { email, userName, password, firstName, lastName } = req.body;

    try {
        // Check if the email already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Check if the username already exists
        existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already in use' });
        }

        // Create new user
        const userData = new User({ email, userName, password, firstName, lastName });

        // Apply encryption using bcrypt
        let salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);

        // Add user to db
        const newUser = await userData.save();
        const userToken = await new Token({
            userId: newUser._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save();
        const url = `${process.env.BASE_URL}api/v1/users/${newUser._id}/verify/${userToken.token}`;
        await sendEmail(newUser.email, "Verify Email", url);

        // Automatically add new user to the "UCF"
        const publicClub = await Club.findOne({ name: 'UCF' });
        if (publicClub) {
            newUser.clubList.push(publicClub._id);
            await newUser.save();
        }

        res.status(201).json({ message: "An email was sent to your account please verify" });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
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

        // Redirect to the email verified page
        res.redirect(`${process.env.FRONTEND_URL}email-verified`);
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

        if (!user.isVerified) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
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
            return res.status(400).json({ message: "An email was sent to your account please verify" });
        }

        // Send user data including ID
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.firstName,
                email: user.email,
                // Include other necessary user data, but be careful not to send sensitive information
            },
            message: "Login successful"
        });
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
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Generating token for user:", user._id);
        // Generate a token
        const token = crypto.randomBytes(32).toString("hex");

        // Find existing token or create a new one
        let userToken = await Token.findOne({ userId: user._id });
        if (userToken) {
            userToken.token = token;
        } else {
            userToken = new Token({
                userId: user._id,
                token: token
            });
        }

        console.log("Saving token:", userToken);
        await userToken.save();

        console.log("Token generated and saved:", token);

        // Send the email
        const resetUrl = `${process.env.BASE_URL}reset-password/${user._id}/${token}`;
        console.log("Sending email to:", email, "with reset URL:", resetUrl);
        await sendEmail(email, 'Password Reset', `Please use the following link to reset your password: ${resetUrl}`);

        console.log("Password reset email sent to:", email);
        res.status(202).json({ message: "Password reset email sent", email });
    } catch (error) {
        console.error("Error during password reset request:", error);
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

const makeAdmin = async (req, res) => {
    try {
        const { clubId } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 1;
        user.adminOf.push(clubId);
        await user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user's event list
const getUserEvents = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('eventList');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.eventList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user events', error });
    }
};

// Get user's clubs
const getUserClubs = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('clubList');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.clubList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user clubs', error });
    }
};

const userInfo = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email })
            .populate({
                path: 'clubList',
                select: 'name'  // Populates only the 'name' field from each club in clubList
            })
            .populate({
                path: 'eventList',
                select: 'Ename date location description',  // Selects multiple fields from each event in eventList
                populate: {
                    path: 'eventDetail',
                    selct: 'topic describe'
                }
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);  // This will now include populated details of clubs and eventsgit 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    forgotPassword,
    resetPassword,
    makeAdmin,
    getUserEvents,
    getUserClubs,
    userInfo
};