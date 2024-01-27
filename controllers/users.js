const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { OK, OBJECT_CREATED } = require('../utils/constants');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NotFound('Пользователь по указанному _id не найден');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { 
    name, about, avatar, email
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({ 
        name, about, avatar, email, password: hash, 
      });
    })
    .then((user) => res.status(OBJECT_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные');
      } else if (err.code === 11000) {
        throw new ConflictError('Произошла ошибка на сервере');
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { throw new NotFound('Пользователь не найден'); })
    .then((user) => res.status(OK).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NotFound('Пользователь не найден');
      }
    })
    .catch(next);
};
