const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRouter = require('./controllers/users.js');
const recipeRouter = require('./controllers/recipes.js')
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());

// Routes go here
app.use('/users', userRouter)
app.use('/recipes', recipeRouter);


app.listen(3000, () => {
  console.log('The express app is ready!');
});