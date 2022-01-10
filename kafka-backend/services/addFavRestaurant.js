
const Favorites = require("../models/favorites")

function handle_request(msg, callback){
    console.log("message=>", msg)

    const rest_id  = msg.restaurant_id
    const update = {
        $set : {
            userId: msg.user_id
        },
        $push: {
            restaurantId: rest_id
        }
    }
    const options = {
        upsert: true
    }

    Favorites.updateOne({
            _id : msg.user_id
        },update, options
        )
        .exec()
        .then( result => {
            callback(null, {
                success: true
            })
        })
        .catch( err => {
            callback(null, {
                success: false
            })
        })

}


exports.handle_request = handle_request