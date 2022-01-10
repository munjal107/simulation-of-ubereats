const mongoose = require("mongoose")

const restaurantSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    startTime : {
        type: String,
        required: true
    },
    endTime : {
        type: String,
        required: true
    },
    location : {
        type: String,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    profile_picture : {
        type: String,
        default: ""
    },
    deliveryType : {
        type: String,
        required: true
    },
    userId : {
        type : mongoose.Types.ObjectId
    }
},{ timestamps: true })


module.exports = mongoose.model('Restaurant', restaurantSchema)