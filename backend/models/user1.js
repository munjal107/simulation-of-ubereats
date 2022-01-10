'use strict';
const {
  Model
} = require('sequelize');
const Joi = require('joi');




module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Restaurant, Orders, Favorites}) {
      // define association here
      this.hasOne(Restaurant, { foreignKey: 'userId' }),
      this.hasMany(Orders, {foreignKey: "user_id"})
      this.hasMany(Favorites, {foreignKey: "user_id"})
    }
  };
  User.schema = Joi.object({
    firstname: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),

    lastname: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),

    password: Joi.string()
      .min(4)
      .max(18)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,35}$')),

    email: Joi.string()
      .email()
      .required(),

    profile_picture: Joi.string().allow(null, ''),
    //   .dataUri(),

    dob: Joi.string()
      .isoDate()
      .required(),
    
      city: Joi.string().required(),
      state: Joi.string().required(),
      address: Joi.string().required(),
    country: Joi.string()
      .valid('USA', 'India'),
    
    type : Joi.string(),

    contact: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
  }).unknown(true);

  User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    dob: DataTypes.DATE,
    type: DataTypes.STRING,
    contact: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};