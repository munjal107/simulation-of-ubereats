const Dishes = require("../models/dishes")
const Restaurants = require("../models/restaurant")

async function handle_request(msg, callback) {
    const {query, searchBy} = msg
    console.log("message in Search Restaurants", msg)


    var restaurant_list = []
    if(searchBy == "dish"){
        var dish_list = await Dishes.find({
            name: query
        }).exec()

        console.log("dishes => ",dish_list)
    }else if(searchBy == "location"){
        restaurant_list = await Restaurants.find({
            "location" : { $regex : new RegExp(query, "i") }
        }).exec()

        console.log("rest list ", restaurant_list)
    }else{
        // search by cuisne
        console.log("by cuisne")
    }

    callback(null, {
        success: true,
        data: restaurant_list
    })


    
   
}

exports.handle_request = handle_request