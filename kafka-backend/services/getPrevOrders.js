const Order = require("../models/Orders")


async function handle_request(msg, callback) {
    console.log("inside prev orders..", msg)
    await Order.find({
        userId: msg.id
    }).sort({createdAt: -1}).exec()
    .then( result => {
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
