const mongoose = require("mongoose")

const favoriteSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId
    },
    restaurantId : {
        type : [mongoose.Types.ObjectId]
    }
},{ timestamps: true })


module.exports = mongoose.model('Favorites', favoriteSchema)