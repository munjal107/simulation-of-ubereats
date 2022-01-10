const Order = require("../models/Orders")


async function handle_request(msg, callback) {
    console.log("Inside UpdateOrderStatus", msg)

    await Order.updateOne({
        _id: msg._id
    },{
        $set : {
            orderStatus: msg.orderStatus
        }
    }).exec()
    .then( result => {
        callback(null, {
            success: true
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
