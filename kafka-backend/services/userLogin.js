const User = require("../models/user")
const Restaurant = require("../models/restaurant")
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const config = require("../config/auth.config")

async function handle_request(msg, callback) {
    console.log("message", msg)
    // const email = msg.email

    try {
        await User.findOne({
            email: msg.email
        })
            .exec()
            .then(async (result, err) => {
                if (result != null) {
                    var validPassword = bcrypt.compareSync(
                        msg.password,
                        result.password
                    );

                    if (validPassword) {
                        //id: result._id,
                        console.log("idid", result._id)
                        const payload = {
                            email: result.email,
                            id: result._id
                        }
                        var token = jwt.sign(payload, config.secret, {
                            expiresIn: 100800 // in seconds
                        });

                        var final_result = {}
                        if (result.type === "restaurant") {
                            var rest_obj = await Restaurant.findOne({
                                userId: result._id
                            }).exec()

                            final_result = {
                                ...result._doc,
                                password: undefined,
                                Restaurant: rest_obj
                            }

                        } else {
                            final_result = {
                                ...result._doc,
                                password: undefined
                            }
                        }

                        const send_msg = {
                            data: final_result,
                            accessToken: "JWT " + token
                        }
                        callback(null, send_msg)
                    } else {
                        callback(null, "Wrong Password")
                    }
                } else {
                    callback(null, "Create Account First")
                    // callback(null, "Create Account First")
                }
            })
            .catch(err => {
                console.log('error..->', err)
                callback(err, null)
            })



    } catch (err) {
        console.log(err);
        callback(err, null);
    }

}

exports.handle_request = handle_request;
