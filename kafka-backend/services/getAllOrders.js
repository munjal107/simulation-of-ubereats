const Orders = require("../models/Orders")

async function handle_request(msg, callback) {
    console.log("message in getOrderDetails", msg)

    await Orders.find({
        restaurantId: msg.rest_id
    }).sort({createdAt: -1}).exec()
        .then( result => {
            console.log("get order...", result)
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