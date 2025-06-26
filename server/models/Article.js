const mongoose = require('mongoose');
const UserAuthor = require('./UserAuthor'); 

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuthor',
        required: true,
    },
}, { timestamps: true });

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuthor',
        required: true,
    },
    dateOfPublication: {
        type: Date,
        default: Date.now,
    },
    dateOfModification: {
        type: Date,
        default: Date.now,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    comments: [commentSchema],
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;