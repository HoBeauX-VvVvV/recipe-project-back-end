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
      const recipe = await Recipe.findById(req.params.recipeId).populate('author', 'username');
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
  
      if (recipe.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to update this recipe' });
      }
  
      recipe.title = req.body.title || recipe.title;
      recipe.ingredients = req.body.ingredients || recipe.ingredients;
      recipe.instructions = req.body.instructions || recipe.instructions;
  
      const updatedRecipe = await recipe.save();
      res.status(200).json(updatedRecipe);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// DELETE
router.delete('/:recipeId', verifyToken, async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.recipeId);
      if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  
      // Only allow author of recipe to delete it
      if (recipe.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to delete this recipe' });
      }
  
      await recipe.remove();
      res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
router.use('/:recipeId/comments', commentRouter);


module.exports = router