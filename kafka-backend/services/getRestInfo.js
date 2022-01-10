const Restaurants = require("../models/restaurant")

async function handle_request(msg, callback) {
    console.log("message in Get Restaurant Info", msg)

    var rest_info = await Restaurants.findOne({
        _id: msg.id
    })

    callback(null, {
        success: true,
        data: rest_info
    })
}


exports.handle_request = handle_request
