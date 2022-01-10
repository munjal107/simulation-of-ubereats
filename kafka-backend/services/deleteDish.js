const Dish = require("../models/dishes")


async function handle_request(msg, callback) {
    console.log("message in getDishes", msg)
    
    await Dish.deleteOne({ _id: msg.id }, function (err) {
        if (err){
            callback(null, {
                success: false,
                msg: err
            })
        }else{
            callback(null, {
                success: true,
            })
        }
      });

    

}

exports.handle_request = handle_request