const db = require('../models');


const get_info = async (req, res) => {
    console.log("getinfo", req.body)
    const id = req.body.id
    const user = req.user
    if (user.type === "restaurant") {
        try {
            var user_obj = await db.User.findOne({ where: { id: id } })
            user_obj = {
                ...user_obj.dataValues,
                password: undefined,
                dob: undefined,
                createdAt: undefined,
                updatedAt: undefined
            }
            console.log("\nuser...", user_obj)
            res.send({
                data: user_obj
            })
        } catch (err) {
            res.send(500).send({
                message: "something went wrong"
            })
        }
    } else {
        res.status(401).send({
            message: "Unauthorized Access"
        })
    }
}

const add_fav = async (req, res) => {
    const user = req.user
    if (user.type === "customer") {
        const { rest_id } = req.body
        console.log("user data", req.body)

        const fav_obj = {
            restaurant_id: rest_id,
            user_id: user.id
        }

        try {

            var db_fav = await db.Favorites.create(fav_obj)

        } catch (err) {
            res.status(401).send({
                message: "Unauthorized Access"
            })
        }

        res.send({
            message: "Success"
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
        const id = user.id
        // console.log("user--",user)

        try{
            const fav_list = await db.Favorites.findAll({
                where : {
                    user_id : id
                },raw : true
            })

            var rest_id_list = []
            for (var i of fav_list){
                rest_id_list.push(i.restaurant_id)
            }
            console.log("fav list",rest_id_list)

            var rest_list = await db.Restaurant.findAll({
                where : {
                    id : rest_id_list
                }
            })
    
            res.status(200).send({
                data : rest_list
            })
        }catch(err){
            res.status(500).send({
                message : err
            })
        }
        

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
        const user_id = user.id
        console.log("success",user_id)

        try{
            await db.Favorites.destroy({
                where : {
                    restaurant_id : rest_id,
                    user_id : user_id
                }
            })
            console.log("success")
            res.send({
                message : "success"
            })

        }catch(err){
            res.status(500).send({
                message : "something went wrong"
            })
        }


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