const Dish = require("../models/dishes")

async function handle_request(msg, callback) {
    console.log("message in getDishById", msg)
    
    await Dish.findOne({
        _id : msg.dish_id,
        restaurantId: msg.rest_id
    })
    .exec()
    .then( result => {
        console.log("Dish ByID->", result)
        callback(null, {
            success: true,
            data: result
        })
    })
    .catch( err => {
        callback(null, {
            success: false,
            msg: err
        })
    })

    

}

exports.handle_request = handle_request