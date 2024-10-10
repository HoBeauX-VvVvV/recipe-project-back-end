const express = require('express');
const router = express.Router({ mergeParams: true });
const verifyToken = require('../middleware/verify-token.js');
const Comment = require('../models/comment.js');
const Recipe = require('../models/recipe.js');


// CREATE
router.post('/', verifyToken, async (req, res) => {
    const { recipeId } = req.params;
    const { text } = req.body;
  
    try {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      const comment = new Comment({
        text,
        author: req.user._id,
        recipe: recipeId
      });
      await comment.save();
      recipe.comments.push(comment._id);
      await recipe.save();
  
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router