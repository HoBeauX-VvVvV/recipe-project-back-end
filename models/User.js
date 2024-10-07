const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username : {
        type: string, required: true, unique: true 
    },
    email: {
        type: string, requirred: true, unique: true 
    },
    password: {
        type: string, required: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;