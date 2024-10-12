const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRouter = require('./controllers/users.js');
const recipeRouter = require('./controllers/recipes.js')
const cors = require('cors')
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`We in the house @ MongoDB: ${mongoose.connection.name}.`);
});

app.use(express.json());
app.use(cors());


app.use('/users', userRouter)
app.use('/recipes', recipeRouter);


app.listen(3000, () => {
  console.log('Express is rockin!');
});