// const db = require('../models');
// const bcrypt = require("bcrypt");
// const session = require('express-session');
const { response } = require('express');
const { search } = require('../routes/restaurantRoutes');
var kafka = require('../kafka/client');


const add_dish = async (req, res) => {
    user = req.user
    console.log("Inside add dish", req.body)
    if (user.type === "restaurant") {
        var menu_obj = req.body
        // const restaurant_id = menu_obj.restaurant_id
        menu_obj = {
            ...menu_obj,
            restaurantId: user.Restaurant._id
        }
        kafka.make_request('PostAddDish', menu_obj, function (err, results) {
            console.log("Add Dish Results->", results)
            
            if(results.success){
                res.json(results.data)

            }else{
                res.status(404).send({
                    msg: results.msg
                })
            }
        
        })

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
        console.log("edit dish data ", obj)

        kafka.make_request('PostEditDish', req.body, function (err, results) {
            console.log("Add Dish Results->", results)
            
            if(results.success){
                res.json(results.data)

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


const get_dishes = async (req, res) => {
    const user = req.user
    console.log("req.user -> ", req.user)
    console.log("req.user -> ", req.query.id,)

    const msg = {
        user_id: user._id,
        rest_id: req.query.id
    }

    kafka.make_request('GetDishes', msg, function (err, results) {
        console.log("GetDishes Results->", results)
        
        if(results.success){
            res.send({
                data: results.data,
                isFav: results.isFav
            })

        }else{
            res.status(404).send({
                msg: results.msg
            })
        }
    
    })
    
}

const delete_dish = async (req, res) => {
    const user = req.user
    if(user.type === "restaurant"){
        dish_id = req.params.id
        console.log("DISH ID:", dish_id)
        
        const msg = {
            id: dish_id
        }
        
        kafka.make_request('DeleteDish', msg, function (err, results) {
            console.log("Add Dish Results->", results)
            
            if(results.success){
                console.log("Deleted")
                res.send("Success")
    
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


const get_restaurants = async (req, res) => {

    const msg="hello"
    kafka.make_request('GetRestaurantList', msg, function (err, results) {
        console.log("GetRestaurantList Results->", results)
        
        if(results.success){
            console.log("Deleted")
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
}

const get_dishById = async (req, res) => {
    const user = req.user
    console.log("user.type", user.type)
    if(user.type === "customer"){
        const rest_id = req.query.rest_id
        const dish_id = req.query.dish_id
        console.log("get_dishById", rest_id, dish_id)

        const msg = {
            rest_id,
            dish_id
        }

        kafka.make_request('GetDishById', msg, function (err, results) {
            console.log("Add Dish Results->", results)
            
            if(results.success){
                console.log("Dish by id ", results)
                res.json(results)
    
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

const place_order = async (req, res) => {
    const user = req.user
    if(user.type === "customer"){
        order_data = req.body
        
            console.log("\n\n\nOrder data =>", order_data)

            const msg = {
                user,
                order_data
            }

            kafka.make_request('PlaceOrder', msg, function (err, results) {
                console.log("PlaceOrder response->", results)
                
                if(results.success){
                    console.log("PlaceOrder ", results)
                    res.json(results)
        
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

const get_orderDetails = async (req, res) => {
    console.log("insideeee get_orderDetails")
    // const order_id = req.query.id
    const msg = {
        order_id: req.query.id
    }

    kafka.make_request('GetOrderDetails', msg, function (err, results) {
        console.log("GetOrderDetails Results->", results)
        
        if(results.success){
            console.log("GetOrderDetails success ", results)
            res.send(results)

        }else{
            res.status(404).send({
                msg: results.msg
            })
        }
    
    })

}


const get_allorders = async (req, res) => {
    const user = req.user
    if(user.type === "restaurant"){
        // const rest_id = req.query.id
        const rest_id = user.Restaurant._id
        const msg = {
            rest_id
        }

        kafka.make_request('GetAllOrders', msg, function (err, results) {
            console.log("GetAllOrders ->", results)
            
            if(results.success){
                console.log("Dish by id ", results)
                res.json(results)
    
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

// only for restaurant
const update_order_status = async (req, res) => {
    user = req.user
    if(user.type==="restaurant"){
        data = req.body
        console.log("inside update order status..", data)

        kafka.make_request('UpdateOrderStatus', data, function (err, results) {
            console.log("GetAllOrders ->", results)
            
            if(results.success){
                console.log("Dish by id ", results)
                res.send({
                    message: "success"
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


const get_prevorders = async (req, res) => {
    const user = req.user
    if(user.type==='customer'){
        user_id = user._id
        const msg = {
            id: user_id
        }
        console.log("\n\ninside\n")

        kafka.make_request('GetPrevOrders', msg, function (err, results) {
            console.log("GetAllOrders ->", results)
            
            if(results.success){
                console.log("Dish by id ", results)
                res.send({
                    message: "success",
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
            message : "Unauth access"
        })
    }
}


const get_searchResult = async (req, res) => {
    const user = req.user

    if(user.type === "customer"){
        var { query, searchBy } = req.body
        const msg = {
            query,
            searchBy
        }
        query = query.toLowerCase()
        var db_resturant_list = []

        console.log("Search By and Query -> ",searchBy, query)

        kafka.make_request('SearchRestaurants', msg, function (err, results) {
            console.log("SearchRestaurants ->", results)
            
            if(results.success){
                res.send({
                    message: "success",
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
            message : "unauthorized access"
        })
    }
    
}

const cancel_order = async (req, res) => {
    console.log("Inside cancel Order => ", req.query.id)

    const msg = {
        _id: req.query.id,
        orderStatus: "Order Cancelled"
    }

    kafka.make_request('UpdateOrderStatus', msg, function (err, results) {
        console.log("cancel_order ->", results)
        
        if(results.success){
            res.send({
                message: "success"
            })

        }else{
            res.status(404).send({
                msg: results.msg
            })
        }
    
    })
}

const rest_info = async (req, res) => {
    console.log(" Inside Rest info => ", req.query.id)
    const msg = {
        id : req.query.id
    }

    kafka.make_request('GetRestInfo', msg, function (err, results) {
        console.log("GetRestInfo ->", results)
        
        if(results.success){
            res.send({
                message: "success",
                data: results.data
            })

        }else{
            res.status(404).send({
                msg: results.msg
            })
        }
    
    })


}

module.exports = {
    add_dish,
    edit_dish,
    get_dishes,
    delete_dish,
    get_restaurants,
    get_dishById,
    place_order,
    get_orderDetails,
    get_allorders,
    update_order_status,
    get_prevorders,
    get_searchResult,
    cancel_order,
    rest_info

}