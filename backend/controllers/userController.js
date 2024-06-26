//Controller for user-related routes

const User = require('../models/User');

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