require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Recipe = require('./models/recipe');

const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/recipes", (req, res, next) => {
  const recipe = new Recipe({
    recipeName: req.body.recipeName,
    content: req.body.content
  });
  recipe.save().then(createdRecipe => {
    res.status(201).json({
      message: 'Recipe added successfully',
      recipeId: createdRecipe._id
    });
  });
});

app.put('/api/recipes/:id', (req, res, next) => {
  const recipe = new Recipe({
    _id: req.body.id,
    recipeName: req.body.recipeName,
    content: req.body.content
  });
  Recipe.updateOne({_id: req.params.id}, recipe).then(result => {
    res.status(200).json({ message: 'Update successfully' });
  })
});

app.get('/api/recipes', (req, res, next) => {
  Recipe.find().then(documents => {
    res.status(200).json({
      message: 'Recipes fetched successfully',
      recipes: documents,
    });
  });
});

app.get('/api/recipes/:id', (req, res, next) => {
  Recipe.findById(req.params.id).then(recipe => {
    if (recipe) {
      res.status(200).json(recipe);
    } else {
      res.status(404).json({message: 'Recipe not found!'});
    }
  })
});



app.delete('/api/recipes/:id', (req, res, next) => {
  Recipe.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  });
});

module.exports = app;
