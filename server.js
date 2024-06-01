const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Todo = require('./model/todoModel');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB
mongoose.connect('mongodb+srv://amanmongodb123:amanmongodb123@cluster0.raequ.mongodb.net/NihareekaCollege?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected Succesfully'))
  .catch(err => console.log(err));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.get('/', async (req, res) => {
  const allTodos = await Todo.find();
  res.render('index', { allTodos });
});

app.post('/add', async (req, res) => {
  const { text } = req.body;
  if (text) {
    const newTodo = new Todo({
      text
    });
    await newTodo.save();
  }
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndRemove(id);
  res.redirect('/');
});

app.post('/toggle/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  todo.completed = !todo.completed;
  await todo.save();
  res.redirect('/');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
