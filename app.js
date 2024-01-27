const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const {
  validationCreateUser,
  validationLogin
} = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.post('/signin', validationCreateUser, login);
app.post('/signup', validationLogin, createUser);

app.use(auth);
app.use(routes);
app.use(errors());
app.use(handleError);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
