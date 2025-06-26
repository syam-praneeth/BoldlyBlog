const exp = require('express');
const user = exp.Router();
const bcrypt = require('bcryptjs');
const asynchandler = require('express-async-handler');
const UserAuthor = require('../models/UserAuthor');

user.post('/register', asynchandler(async (req, res) => {
    const {role, name, email, password, image} = req.body;
    if (!role || !name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await UserAuthor.findOne({email:email});
    if(existingUser){
        return res.status(200).send({message:"user already exists", payload: existingUser});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserAuthor({
        role,
        name,
        email,
        password: hashedPassword,
        image: image || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', payload: newUser });
}));


module.exports = user;