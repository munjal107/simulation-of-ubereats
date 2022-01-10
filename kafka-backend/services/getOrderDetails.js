const Order = require("../models/Orders")
const Restaurant = require("../models/restaurant")

async function handle_request(msg, callback) {
    console.log("message in getOrderDetails", msg)

    await Order.findOne({
        _id: msg.order_id
    }).exec()
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