const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe.js');
const verifyToken = require('../middleware/verify-token.js');
const commentRouter = require('./comments.js');

// CEATE 
router.post('/', verifyToken, async (req, res) => {
    const { title, ingredients, instructions } = req.body;
    try {
      const recipe = new Recipe({
        title,
        ingredients,
        instructions,
        author: req.user._id, 
      });
      await recipe.save();
      res.status(201).json(recipe);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// INDEX
router.get('/', async (req, res) => {
    try {
      const recipes = await Recipe.find().populate('author', 'username');
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// SHOW
router.get('/:recipeId', async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.recipeId).populate('author', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' }
      });
      if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
      res.status(200).json(recipe);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// EDIT
router.put('/:recipeId', verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    if (recipe.author.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Not authorized to edit this recipe' });
    }
    Object.assign(recipe, req.body);
    await recipe.save();
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
// DELETE
router.delete('/:recipeId', verifyToken, async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.recipeId);
      if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
      if (recipe.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to delete this recipe' });
      }
      await recipe.deleteOne();
      res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
router.use('/:recipeId/comments', commentRouter);


module.exports = router