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

// INDEX
router.get('/', async (req, res) => {
  const { recipeId } = req.params;
   try {
    const comments = await Comment.find({ recipe: recipeId }).populate('author', 'username');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete('/:commentId', verifyToken, async (req, res) => {
  const { commentId } = req.params;
   try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    await comment.deleteOne({ _id: commentId });
    await Recipe.findByIdAndUpdate(comment.recipe, { $pull: { comments: commentId } });
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EDIT
router.put('/:commentId', verifyToken, async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;
   try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this comment' });
    }
    comment.text = text || comment.text;
    const updatedComment = await comment.save();
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router