const Order = require("../models/Orders")
const Restaurant = require("../models/restaurant")

async function handle_request(msg, callback) {
    console.log("message in place order - ", msg)

    const { user, order_data } = msg 

    var address = user.address
    if (order_data.location != 'default') {
        address = order_data.location
    }

    var db_rest = await Restaurant.findOne({
        _id: order_data.rest_id
    }).exec()
    console.log("rest obj", db_rest)
    const rest_name = db_rest.name


    var insert_row = {
        tax: order_data.tax,
        deliveryType: order_data.delivery,
        totalCost: order_data.total,
        restaurantId: order_data.rest_id,
        userId: user._id,
        deliveryLocation: address,
        restName: rest_name,
        orderStatus: "pending",
        note: order_data.note,
        OrderedDishes: []
    }

    console.log("INSERT ROW ", insert_row)

    for (let i = 0; i < order_data.no_of_items; i++) {
        var new_row = {
            name: order_data.name[i],
            price: order_data.price[i],
            qty: order_data.qty[i]
        }
        insert_row.OrderedDishes.push(new_row)
        
    }

    console.log("INSERT ROW before save ", insert_row)


    var order_obj = new Order(insert_row)
    console.log("INSERT ROW before save =>", order_obj)

    var new_obj = await order_obj.save()

    console.log("INSERT ROW after save ", new_obj)

    callback(null, {
        success: true,
        data : new_obj
    })

}

exports.handle_request = handle_request