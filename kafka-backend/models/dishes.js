const mongoose = require("mongoose")


const dishSchema = new mongoose.Schema({
    name: {
        type: String
    },
    ingredients: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: String,
        default:""
    },
    category: {
        type: String
    },
    type: {
        type: String
    },
    cuisine: {
        type: String
    },
    restaurantId: {
        type: mongoose.Types.ObjectId
    }
},{ timestamps: true })

module.exports = mongoose.model('Dishes', dishSchema)