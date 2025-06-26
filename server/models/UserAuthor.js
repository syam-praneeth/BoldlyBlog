const mongoose = require('mongoose');

const userAuthorSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
    },
    image: {
        type: String,
        default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
},{"strict": "throw", timestamps: true});

const UserAuthor = mongoose.model('UserAuthor', userAuthorSchema);
module.exports = UserAuthor;