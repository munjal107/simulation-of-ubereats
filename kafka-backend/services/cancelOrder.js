const Orders = require("../models/Orders")


async function handle_request(msg, callback) {
    console.log("Cancel - message", msg)

    callback(null, {
        success:true
    })

}


exports.handle_request = handle_request