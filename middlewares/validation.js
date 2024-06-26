const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().custom(validateURL).required().messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
    email: Joi.string().email().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.uri": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
    city: Joi.string().min(2).required().messages({
      "string.min": 'The minimum length of the "city" field is 2',
      "string.empty": 'The "city" field must be filled in',
    }),
    coordinates: Joi.object().keys({
      lat: Joi.number().required().messages({
        "number.base": 'The "lat" field must be a number',
        "any.required": 'The "lat" field is required',
      }),
      lng: Joi.number().required().messages({
        "number.base": 'The "lng" field must be a number',
        "any.required": 'The "lng" field is required',
      }),
    }).required().messages({
      "object.base": 'The "coordinates" field must be an object',
      "any.required": 'The "coordinates" field is required',
    }),
  }),
});

module.exports.validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
    city: Joi.string().min(2).required().messages({
      "string.min": 'The minimum length of the "city" field is 2',
      "string.empty": 'The "city" field must be filled in',
    }),
    coordinates: Joi.object().keys({
      lat: Joi.number().required().messages({
        "number.base": 'The "lat" field must be a number',
        "any.required": 'The "lat" field is required',
      }),
      lng: Joi.number().required().messages({
        "number.base": 'The "lng" field must be a number',
        "any.required": 'The "lng" field is required',
      }),
    }).required().messages({
      "object.base": 'The "coordinates" field must be an object',
      "any.required": 'The "coordinates" field is required',
    }),
  }),
});

module.exports.validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.uri": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24),
  }),
});
