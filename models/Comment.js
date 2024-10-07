const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String, required: true
  },
  author: { type: mongoose.Schema.Type.ObjectId,
    ref: 'User',
    reequired: true
  },
  recipe: { type: mongoose.Schema.Type.ObjectId,
    ref: 'Comment',
    required: true
  }  
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;