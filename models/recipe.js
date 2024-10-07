const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: {
    type: String,  required: true
  },
  ingredients: [{
    type: String, required: true
  }],
  instructions: {
    type: String, required: true
  },
  author: {
    type: mongoose.Scheema.Type.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Type.ObjectId,
    ref: 'Comment'
  }]
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;