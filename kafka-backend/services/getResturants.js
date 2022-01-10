const Restaurant = require("../models/restaurant")


async function handle_request(msg, callback) {
    console.log("message in getDishes", msg)
    
    // const rest_list = Restaurant.find().exec()
    await Restaurant.find()
        .exec()
        .then( result => {
            console.log("Rest list..", result)
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