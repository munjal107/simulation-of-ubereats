const Dish = require("../models/dishes")


async function handle_request(msg, callback) {
    console.log("message", msg)
    
   var update_values = {}
   for (const key in msg) {
        if (key != 'id') {
            update_values[key] = msg[key]
        }
    }

    console.log("update obj->", update_values)

    await Dish.updateOne({
        _id: msg.id
    }, {
        $set : update_values
    }).exec()
    .then(async (result) => {
        console.log("edit dish result->", result)
        
        const update_obj = await Dish.findOne({
            _id: msg.id
        }).exec()

        console.log("updated edit dish,", update_obj)
        callback(null, {
            success: true,
            data: update_obj
        })
    })
    .catch(err => {
        callback(null, {
            success: false,
            msg: err
        })
    })

}

exports.handle_request = handle_request