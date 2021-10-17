var jwt = require('jsonwebtoken');
var config = require('../config/auth.config')
const db = require('../models');

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
                var user = await db.User.findOne(
                    {  
                    where: { 
                      email: decoded.email
                    }, include: db.Restaurant
                })
                if (!user) {
                    return res.status(401).send({ message: "Unauthorized!! User not found." });
                  }else{  
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
