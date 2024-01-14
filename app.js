const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '65a41790d672e67b24fddca1',
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(routes);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
