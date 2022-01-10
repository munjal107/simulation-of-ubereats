const Dish = require("../models/dishes")


async function handle_request(msg, callback) {
    console.log("message", msg)

    const dish_obj = new Dish(msg)

    await dish_obj.save()
                .then( result => {
                    console.log("dish result", result)
                    callback(null, {
                        success: true,
                        data : result
                    })
                })
                .catch(err => {
                    console.log("error in dish", err)
                    callback(null, {
                        success: false,
                        msg: err
                    })
                })


}


exports.handle_request = handle_request