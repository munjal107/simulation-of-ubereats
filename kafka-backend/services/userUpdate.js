const User = require("../models/user")
const Restaurant = require("../models/restaurant")
const mongoose = require("mongoose")

async function handle_request(msg, callback) {
    console.log("user_update - message", msg)

        await User.updateOne({
            _id: msg._id
        }, {
            $set: {
                firstname: msg.firstname,
                lastname: msg.lastname,
                email: msg.email,
                contact: msg.contact,
                dob: msg.dob,
                address: msg.address,
                city: msg.city,
                state: msg.state,
                country: msg.country,
                profile_picture: msg.profile_picture,
            }
        })
            .exec()
            .then(async (result) => {
                // need to update restaurant
                console.log("update object..", result)

                var user_obj = await User.findOne({
                    _id: msg._id
                }).exec()

                user_obj = {
                    ...user_obj._doc,
                    password: undefined
                }

                var rest_obj = {}
                if (msg.type === "restaurant") {
                    console.log("inside restaurant...")

                    var rest_update = await Restaurant.updateOne({
                        _id : msg.Restaurant._id
                    }, {
                        $set: {
                            name: msg.Restaurant.name,
                            deliveryType: msg.Restaurant.deliveryType,
                            address: msg.Restaurant.address,
                            location: msg.Restaurant.location,
                            endTime: msg.Restaurant.endTime,
                            startTime: msg.Restaurant.startTime,
                            description: msg.Restaurant.description,
                            profile_picture: msg.Restaurant.profile_picture,
                        }
                    }).exec()
                    
                    rest_obj = await Restaurant.findOne({
                        _id: msg.Restaurant._id
                    }).exec()

                    user_obj = {
                        ...user_obj,
                        Restaurant: rest_obj
                    }
                    console.log("rest obj", rest_obj)

                }

                callback(null, {
                    success: true,
                    data: user_obj
                })

                

            }).catch(err => {
                callback(null, {
                    success: false,
                    msg: err
                })
                // callback(err, null)
            })

    }

exports.handle_request = handle_request;
