const mongoose = require("mongoose")


const orderSchema = new mongoose.Schema({
    deliveryType: {
        type : String,
        required : true
    },
    deliveryLocation: {
        type : String,
        required : true
    },
    tax: {
        type: Number
    },
    totalCost: {
        type: Number

    },
    userId : {
        type : mongoose.Types.ObjectId
    },
    restaurantId : {
        type : mongoose.Types.ObjectId
    },
    restName:{
        type: String
    },
    note:{
        type: String
    },
    orderStatus: {
        type: String
    },
    OrderedDishes: [{
        name: String,
        price: Number,
        qty: Number
    }]

    
},{ timestamps: true })

module.exports = mongoose.model('Orders', orderSchema)