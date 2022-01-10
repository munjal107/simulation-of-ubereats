const User = require("../models/user")

async function handle_request(msg, callback){
    console.log("Get User Info Message", msg)

    await User.findOne({
        _id: msg.id
    })
    .exec()
    .then( result => {
        result = {
            ...result._doc,
            password: undefined,
            dob: undefined,
            createdAt: undefined,
            updatedAt: undefined
        }

        console.log("Get User Info Result",result)

        callback(null, {
            success: true,
            data: result
        })
    })
    .catch(err => {
        callback(err, null)
    })
}


exports.handle_request = handle_request