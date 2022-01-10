// const db = require('../models');
var kafka = require('../kafka/client');


const get_info = async (req, res) => {
    console.log("getinfo", req.body)
    const id = req.body.id
    const user = req.user
    if (user.type === "restaurant") {

        kafka.make_request('GetUserInfo', req.body, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
              console.log("Inside err");
              res.json({
                status: "error",
                msg: "System Error, Try Again."
              })
            } else {
              console.log("Inside user create success->", results);
              res.status(200).send({
                message: "success",
                data : results.data
              });
             
            }
        
          });
         
    } else {
        res.status(401).send({
            message: "Unauthorized Access"
        })
    }
}

const add_fav = async (req, res) => {
    const user = req.user
    // console.log("user add fav -> ", user)
    if (user.type === "customer") {
        const { rest_id } = req.body
        console.log("user data", req.body)

        const msg = {
            restaurant_id: rest_id,
            user_id: user._id
        }

        // console.log("Msg to ")

        kafka.make_request('AddFavRestaurant', msg, function (err, results) {
            console.log("AddFavRestaurant response->", results)
            
            if(results.success){
                // console.log("PlaceOrder ", results)
                res.send({
                    success: true,
                    message: "Success"
                })
    
            }else{
                res.status(404).send({
                    msg: results.msg
                })
            }
        
        })

        

    } else {
        res.status(401).send({
            message: "Unauthorized Access"
        })
    }
}

const get_favs = async (req, res) => {
    const user = req.user
    if(user.type === "customer"){
        const msg = {
            user_id: user._id
        }
        // console.log("user--",user)
        kafka.make_request('GetFavRestaurant', msg, function (err, results) {
            console.log("AddFavRestaurant response->", results)
            
            if(results.success){
                // console.log("PlaceOrder ", results)
                res.send({
                    success: true,
                    data: results.data
                })
    
            }else{
                res.status(404).send({
                    msg: results.msg
                })
            }
        
        })

    
        

    }else{
        res.status(401).send({
            message : "Unauthorized Access"
        })
    }
}


const delete_fav = async(req, res) => {
    const user = req.user
    if(user.type === "customer"){
        const { rest_id } = req.body
        const user_id = String(user._id)
        console.log("success delete_fav", user_id, rest_id)

        const msg = {
            rest_id,
            user_id
        }


        kafka.make_request('DeleteFavRestaurant', msg, function (err, results) {
            console.log("delete_fav response->", results)
            
            if(results.success){
                // console.log("PlaceOrder ", results)
                res.send({
                    success: true,
                    message: "Success"
                })
    
            }else{
                res.status(404).send({
                    msg: results.msg
                })
            }
        
        })

        // try{
        //     await db.Favorites.destroy({
        //         where : {
        //             restaurant_id : rest_id,
        //             user_id : user_id
        //         }
        //     })
        //     console.log("success")
        //     res.send({
        //         message : "success"
        //     })

        // }catch(err){
        //     res.status(500).send({
        //         message : "something went wrong"
        //     })
        // }


    }else{
        res.status(401).send({
            message : "Unauthorized access"
        })
    }
}

module.exports = {
    get_info,
    add_fav,
    get_favs,
    delete_fav
}