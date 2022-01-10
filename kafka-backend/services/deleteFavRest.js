const Favorites = require("../models/favorites")

async function handle_request(msg, callback){
    console.log("message delete Fav =>", msg)

    var update_obj = await Favorites.findOne({
        userId: msg.user_id
    })

    var new_list = []
    update_obj.restaurantId.forEach( (element) => {
        if(element != msg.rest_id){
            new_list.push(element)
        }
    })
    console.log("update obj found ", update_obj)
    const update = {
        $set: {
            restaurantId: new_list
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