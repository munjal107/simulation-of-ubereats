const User = require("../models/user")
const Restaurant = require("../models/restaurant")
const bcrypt = require("bcrypt");

async function handle_request(msg, callback) {
    console.log("PostUserCreate message", msg)

    User.findOne({
        email: msg.email,
    }).exec()
        .then((result, err) => {
            console.log("Error in findOne", err)
            console.log("Result", result)
            if (result !== null) {
                send_msg = {
                    success: false,
                    msg: "Account Exists"
                }
                callback(null, send_msg)
            }
            else {
                const salt = bcrypt.genSaltSync(10);
                const password = bcrypt.hashSync(msg.password, salt);

                const user = new User({
                    ...msg,
                    password: password,
                });

                user.save()
                    .then(async (result) => {
                        console.log("User Added : ", result)

                        // add restaurant 
                        var result2 = {}
                        if (result.type === "restaurant") {
                            console.log("creating rest...")
                            const rest_obj = new Restaurant({
                                name: msg.name,
                                description: msg.description,
                                startTime: msg.startTime,
                                endTime: msg.endTime,
                                location: msg.city,
                                deliveryType: msg.deliveryType,
                                profilePicture: msg.profilePicture,
                                address: msg.address,
                                userId: result._id
                            })
                            console.log("rest obj : ", rest_obj)
                            await rest_obj.save()
                                .then(result1 => {
                                    console.log("Rest Added : ", result1)
                                    result2 = {
                                        ...result._doc,
                                        password: undefined,
                                        Restaurant: result1
                                    }
                                })
                                .catch(err => {
                                    console.log("inside restaurant catch...", err)
                                    callback(null, {
                                        success: false,
                                        msg: err
                                    })
                                    // callback(err, null)
                                })

                        } else {
                            result2 = {
                                ...result._doc,
                                password: undefined
                            }
                        }


                        console.log("Result...before send...", result2)

                        const send_msg = {
                            success: true,
                            data: result2
                        }
                        callback(null, send_msg)

                    })
                    .catch(err => {
                        console.log("inside catch error..", err)
                        callback(null, {
                            success: false,
                            msg: err
                        })
                        // callback(err, null)
                    })
            }
        })
        .catch(err => {
            console.log(err);
            callback(null, {
                success: false,
                msg: err
            })
        })
}

exports.handle_request = handle_request;
