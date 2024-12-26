const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name, 
            email,
            password_hash
        });
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully!'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Email not registered!'
            })
        }
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({
                message: 'Wrong Password!'
            })
        }
        const token = generateToken(user);
        res.status(200).json({
            token: token
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}