'use strict';
const {
  Model
} = require('sequelize');
const Joi = require('joi');


module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Restaurant, OrderedDish, User}) {
      // define association here
      this.belongsTo(Restaurant, {foreignKey: "restaurant_id"})
      this.hasMany(OrderedDish, {foreignKey : "order_id"})
      this.belongsTo(User, { foreignKey : "user_id"})

    }
  };

  Orders.schema = Joi.object({
    deliveryType: Joi.string().required(),

    description: Joi.string().required(),
    
    tax: Joi.number().required(),

    totalCost: Joi.number().required(),

    restName : Joi.string().required(),
    orderStatus : Joi.string().required()
    
  }).unknown(true);



  Orders.init({
    deliveryType: DataTypes.STRING,
    deliveryLocation: DataTypes.STRING,
    tax: DataTypes.DOUBLE,
    totalCost: DataTypes.DOUBLE,
    restName : DataTypes.STRING,
    orderStatus : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};