const exp = require('express');
const user = exp.Router();
const bcrypt = require('bcryptjs');
const UserAuthor = require('../models/UserAuthor');
const Article = require('../models/Article');
const expressAsyncHandler = require('express-async-handler');
user.post('/register', expressAsyncHandler(async (req, res) => {
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

user.put('/comments/:articleId',expressAsyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { content, authorId } = req.body;

    if (!content || !authorId) {
        return res.status(400).json({ message: 'Content and authorId are required' });
    }

    const article = await Article.findById(articleId);
    if (!article) {
        return res.status(404).json({ message: 'Article not found' });
    }

    article.comments.push({ content, authorId });
    await article.save();

    res.status(200).json({ message: 'Comment added successfully', payload: article });
}));

module.exports = user;