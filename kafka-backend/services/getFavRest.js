const Favorites = require("../models/favorites")
const Restaurant = require("../models/restaurant")


async function handle_request(msg, callback){
    console.log("message Get Fav =>", msg)

    var update_obj = await Favorites.findOne({
        userId: msg.user_id
    })
    console.log("update_obj =>", update_obj)

    var rest_id_list = update_obj.restaurantId
    console.log("rest id list => ", rest_id_list)

    var rest_list = await Restaurant.find({
        _id: rest_id_list
    })

    console.log("rest list => ", rest_list)


    callback(null, {
        success: true,
        data: rest_list
    })

}


exports.handle_request = handle_request