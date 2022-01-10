const Favorites = require("../models/favorites")


function handle_request(msg, callback){
    console.log("message")

    Favorites.find({
        userId : msg._id
    })
    .exec()
    .then( result => {
        console.lof("find Favs..", result)
        callback(null, result)
    })
    .catch(err => {
        callback(err, null)
    })
}




exports.handle_request = handle_request