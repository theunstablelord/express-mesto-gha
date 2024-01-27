const { celebrate, Joi } = require('celebrate');
const { linkRegex } = require('../utils/constants');

module.exports.validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(linkRegex),
  }),
});

module.exports.validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

module.exports.validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports.validationUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(linkRegex),
  }),
});

module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});