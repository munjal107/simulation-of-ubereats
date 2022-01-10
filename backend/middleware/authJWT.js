var jwt = require('jsonwebtoken');
var config = require('../config/auth.config')
const db = require('../models');

const mongoose = require("mongoose")
const User = require("../models/user")
const Restaurant = require("../models/restaurant")

const accessTokenSecret = config.secret

const verifyToken =  (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("auth header", authHeader)

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // console.log("auth header", token)

        jwt.verify(token, accessTokenSecret, async (err, decoded) => {
            console.log("decoded", decoded)

            if (err) {
                // console.log("decoded=>", err)

                return res.status(403).send({
                    err : err
                });
            }
            // console.log("user", decoded)
            try{
                console.log("decoded id", decoded.id)
                var user = await User.findOne({
                    _id : decoded.id
                }).exec()
                // console.log("decoded user", user)

                if (!user) {
                    return res.status(401).send({ message: "Unauthorized!! User not found." });
                  }else{  

                    if(user.type === "restaurant"){
                        console.log("inside decode rest..")
                        const rest_obj = await Restaurant.findOne({
                            userId : decoded.id
                        }).exec()

                        console.log("rest_obj--", rest_obj)
                        user = {
                            ...user._doc,
                            Restaurant: rest_obj
                        }
                        // user['Restaurant'] = rest_obj
                    }

                    
                    req.user = user;
            }
            }catch(err){
                console.log(err)
            }
            next();
        });
    } else {
        res.sendStatus(401);
    }
};



// const verifyToken = (req, res) => {
//     token = req.headers['authorization']
//     token = token.split(" ")[1]
//     console.log("TOKEN", token)

//     jwt.verify(token, config.secret, (err, decoded) => {
//         if (err) {
//           return res.status(401).send({
//             message: "Unauthorized!!!!"
//           });
//         }
//         email = decoded.email
//         console.log("decoed email", email)
//         if(email === user.email){
//             req.userId = {
//                 email: decoded.email,
//                 id : 11
//             }
//         }else{
//             return res.status(401).send({
//                 message: "do not match!!!!"
//               });
//         }


        
//       });
// }

module.exports = verifyToken;
