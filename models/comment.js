const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String, required: true
  },
  author: { type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    reequired: true
  },
  recipe: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  }  
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;