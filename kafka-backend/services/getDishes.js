const Dish = require("../models/dishes")
const Favorites = require("../models/favorites")

async function handle_request(msg, callback) {
    console.log("message in getDishes", msg)
    
    await Dish.find({
        restaurantId: msg.rest_id
    })
    .exec()
    .then(async (result) => {
        console.log("Dish list->", result)

        const fav_obj = await Favorites.findOne({
            userId: msg.user_id
        })

        var isFav = false
        console.log("Favs ->", fav_obj)
        if(fav_obj){
            fav_obj.restaurantId.forEach((element) => {
                console.log(element)
    
                if(String(element) === msg.rest_id){
                    isFav = true
                    console.log("Success match")
                }
    
            })
        }
        

        callback(null, {
            success: true,
            data: result,
            isFav: isFav
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