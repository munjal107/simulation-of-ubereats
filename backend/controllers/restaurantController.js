const db = require('../models');
const bcrypt = require("bcrypt");
const session = require('express-session');
const { response } = require('express');
const { search } = require('../routes/restaurantRoutes');


const add_dish = async (req, res) => {
    user = req.user
    console.log("add dish", user)
    if (user.type === "restaurant") {
        var menu_obj = req.body
        // const restaurant_id = menu_obj.restaurant_id
        menu_obj = {
            ...menu_obj,
            restaurant_id: user.Restaurant.id
        }
        try {
            const dish_obj = await db.Dish.create(menu_obj)
            res.json(dish_obj);

        } catch (err) {
            res.send("error")
        }

    } else {
        res.status(401).send({
            message: "unauthorized access"
        })
    }

}

const edit_dish = async (req, res) => {
    // console.log("EDIT:", req.body)
    const user = req.user
    if (user.type === "restaurant") {
        const obj = req.body
        const id = obj.id
        try {
            var dish_obj = await db.Dish.findOne({ where: { id: id } })
            // console.log("user object found", user)
            for (const key in obj) {
                if (key != 'id') {
                    dish_obj[key] = obj[key]
                }
            }
            await dish_obj.save()
            res.json(dish_obj)

        } catch (err) {
            res.send(err)
        }
    } else {
        res.status(401).send({
            message: "Unauthorized Access"
        })
    }


}

const update_info = async (req, res) => {
    const user = req.user
    if(user.type === "restaurant"){
        var update_body = req.body

        console.log("\n\nUpdate body", update_body, "\n\n", update_body.id)
        // db.User.update(
        //     {...user},
        //     { where: {id: user.id},include : db.Restaurant  })
    
        try {
    
            // var user = await db.User.findOne(
            //     {  
            //     where: { 
            //       id : update_body.id
            //     }, include: db.Restaurant
            // })
    
            // user.Restaurant.name = update_body.Restaurant.name
            // user.Restaurant.description = update_body.Restaurant.description
            // user.Restaurant.startTime = update_body.Restaurant.startTime
            // user.Restaurant.endTime = update_body.Restaurant.endTime
            // user.city = update_body.city
            // user.contact = update_body.contact
    
            // await user.save()
    
            // console.log("\n\nUpdated user", user, "\n\n", user)
    
            await db.User.update(
                { ...update_body },
                { where: { id: update_body.id } })
    
            await db.Restaurant.update(
                { ...update_body.Restaurant },
                { where: { id: update_body.Restaurant.id } }
            )
            var updated_user = await db.User.findOne({ where: { id: update_body.id }, include: db.Restaurant })
            updated_user = {
                ...updated_user.dataValues,
                password: null
            }
            console.log("\n\n\nupdated=>", updated_user)
            res.status(200).send({
                data: updated_user,
            })
    
    
        } catch (err) {
            console.log(err)
            return res.status(500).json({ error: 'Something went wrong' })
        }
    
    }else{
        res.status(401).send({
            message : "Unauthorized Access"
        })
    }
}

const get_dishes = async (req, res) => {
    const user = req.user
    
    // console.log("get_dishes", req.query)
        try {
            const dishes = await db.Dish.findAll({
                where: {
                    restaurant_id: req.query.id
                }
            })
                // console.log("get_dishes", dishes)
            const fav_obj = await db.Favorites.findAll({
                where : {
                    user_id : user.id,
                    restaurant_id : req.query.id
                }
            })
            
            console.log("fav obj", fav_obj)

            if(fav_obj.length>0){
                return res.status(200).send({
                    data : dishes,
                    isFav : true
                })

            }else{
                return res.status(200).send({
                    data : dishes,
                    isFav : false
                })
            }
            

            console.log("fav", fav_obj)
            return res.status(200).json(dishes)
        } catch (err) {
            console.log(err)
            return res.status(500).json({ error: 'Something went wrong' })
        }
    
    
}

const delete_dish = async (req, res) => {
    const user = req.user
    if(user.type === "restaurant"){
        dish_id = req.params.id
        console.log("DISH ID:", dish_id)
        try {
            await db.Dish.destroy({
                where: {
                    id: dish_id
                }
            })
            console.log("Delete Success...")
            res.send("Success")
    
        } catch (err) {
            console.lof("Error...", err)
            res.send(err)
        }
    }else{
        res.status(401).send({
            message : "Unauthorized Access"
        })
    }
}


const get_restaurants = async (req, res) => {
    try {
        const rest_list = await db.Restaurant.findAll()
        console.log(rest_list)
        res.send({
            data: rest_list
        })
        // db.sequelize.close()
    } catch (err) {
        console.log(err)
        res.send(404).send({
            message: err
        })
    }
}

const get_dishById = async (req, res) => {
    const user = req.user
    console.log("user.type", user.type)
    if(user.type === "customer"){
        const rest_id = req.query.rest_id
        const dish_id = req.query.dish_id
        console.log("get_dishById", rest_id, dish_id)
        try {
            const dish_details = await db.Dish.findOne({
                where: {
                    id: dish_id,
                    // restaurant_id : rest_id
                }
            })
            console.log("get_dishById", dish_details)
    
            return res.status(200).json(dish_details)
        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: "server error"
            })
        }
    }else{
        res.status(401).send({
            message : "Unauthorized Access"
        })
    }
    
}

const place_order = async (req, res) => {
    const user = req.user
    if(user.type === "customer"){
        order_data = req.body
        try {
            console.log("\n\n\nOrder data", order_data)
            var address = user.address
            if (order_data.location != 'default') {
                address = order_data.location
            }
    
            var db_rest = await db.Restaurant.findOne({
                where: {
                    id: order_data.rest_id
                }
            })
            console.log("rest obj", db_rest)
            const rest_name = db_rest.name
    
            var insert_row = {
                tax: order_data.tax,
                deliveryType: order_data.delivery,
                totalCost: order_data.total,
                restaurant_id: order_data.rest_id,
                user_id: user.id,
                deliveryLocation: address,
                restName: rest_name,
                orderStatus: "pending"
            }
    
            console.log("INSERT ROW ", insert_row)
    
            var db_order = await db.Orders.create(insert_row);
    
            for (let i = 0; i < order_data.no_of_items; i++) {
                var new_row = {
                    name: order_data.name[i],
                    price: order_data.price[i],
                    qty : order_data.qty[i]
                }
    
                console.log("new_row....", new_row)
                const db_orderdetail = await db.OrderedDish.create({ ...new_row, order_id: db_order.id });
            }
    
    
            res.json({
                order_id: db_order.id,
                message: "success"
            })
    
        } catch (err) {
            res.status(500).send({
                message: "Something went wrong"
            })
        }
    
    }else{
        res.status(401).send({
            message : "Unauthorized Access"
        })
    }
}

const get_orderDetails = async (req, res) => {
    console.log("insideeee")
    order_id = req.query.id
    // console.log("insideeee")
    try {
        const order_details = await db.Orders.findOne(
            {
                where: {
                    id: order_id
                }, include: db.OrderedDish
            })
        console.log("order_details", order_details)
        res.send(order_details)

    } catch (err) {
        res.status(500).send({
            message: "something went wrong"
        })
    }

}


const get_allorders = async (req, res) => {
    const user = req.user
    if(user.type === "restaurant"){
        // const rest_id = req.query.id
        const rest_id = user.Restaurant.id

        try {
            console.log("inside")
    
            var orders_list = await db.Orders.findAll({
                where: {
                    restaurant_id: rest_id
                }, include: db.OrderedDish
            })
    
    
            // console.log(orders_list)
            res.status(200).json(orders_list)
    
        } catch (err) {
            res.status(500).send({
                message: "something went wrong"
            })
        }
    
    }else{
        res.status(401).send({
            message : "Unauthorized Access"
        })
    }
   
}

// only for restaurant
const update_order_status = async (req, res) => {
    user = req.user
    if(user.type==="restaurant"){
        data = req.body
        try {
            var db_order = await db.Orders.findOne({
                where: {
                    id: data.id
                }
            })
            db_order.orderStatus = data.orderStatus
    
            await db_order.save()
    
            res.status(200).send({
                message: "success"
            })
    
        } catch (err) {
            res.status(500).send({
                message: "something went wrong"
            })
        }
    }else{
        res.status(401).send({
            message : "Unauthorized Access"
        })
    }
    
}

const get_searchResult = async (req, res) => {
    const user = req.user

    if(user.type === "customer"){
        var { query, searchBy } = req.body
        query = query.toLowerCase()
        var db_resturant_list = []
        try {
            console.log(query, searchBy)
            if (searchBy === 'dish') {
                db_dishes = await db.Dish.findAll({
                    where: {
                        name: query
                    }, attributes: ['restaurant_id'], raw: true
                })
    
                rest_id_list = []
                for (const a of db_dishes) {
                    rest_id_list.push(a.restaurant_id);
                }
    
                console.log("len", rest_id_list)
                if (db_dishes.length > 0) {
                    db_resturant_list = await db.Restaurant.findAll({
                        where: { "id": rest_id_list }
                    })
                }
    
                console.log("\n\nDatavals", db_resturant_list)
            } else if (searchBy === "location") {
                console.log('indise loc')
                db_resturant_list = await db.Restaurant.findAll({
                    where: db.sequelize.where(
                        db.sequelize.fn('lower', db.sequelize.col('location')),
                        db.sequelize.fn('lower', query)
                    )
                })
            } else if (searchBy === "cuisine") {
                console.log('indise cuisine')
    
                db_dishes = await db.Dish.findAll({
                    where:
                        db.sequelize.where(
                            db.sequelize.fn('lower', db.sequelize.col('cuisine')),
                            db.sequelize.fn('lower', query)
                        )
                    , attributes: ['restaurant_id'], raw: true
                })
    
                rest_id_list = []
                for (const a of db_dishes) {
                    rest_id_list.push(a.restaurant_id);
                }
    
                console.log("len....", rest_id_list)
                if (db_dishes.length > 0) {
                    db_resturant_list = await db.Restaurant.findAll({
                        where: { "id": rest_id_list }
                    })
                }
    
            }
    
            res.status(200).send({
                data: db_resturant_list
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: "something went wrong"
            })
        }
    }else{
        res.status(401).send({
            message : "unauthorized access"
        })
    }
    
}

const get_prevorders = async (req, res) => {
    const user = req.user
    if(user.type==='customer'){
        user_id = user.id
        console.log("\n\ninside\n")
        try{
            const db_orders = await db.Orders.findAll({
                where : {
                    user_id : user_id
                }
            })
    
            res.send({
                data : db_orders
            })
            
        }catch(err){
            res.status(500).send({
                message : "Unauth access"
            })
        }
       

    }else{
        res.status(401).send({
            message : "Unauth access"
        })
    }
}

module.exports = {
    add_dish,
    edit_dish,
    update_info,
    get_dishes,
    delete_dish,
    get_restaurants,
    get_dishById,
    place_order,
    get_orderDetails,
    get_allorders,
    update_order_status,
    get_prevorders,
    get_searchResult
}