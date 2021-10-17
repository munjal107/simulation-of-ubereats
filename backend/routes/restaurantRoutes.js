const express = require('express')
const restaurantController = require("../controllers/restaurantController")
const verifyToken = require('../middleware/authJWT')

const router = express.Router();

// add dish by restaurant owner
router.post('/add/dish',verifyToken, restaurantController.add_dish)
//edit dish by rest owner
router.post('/edit/dish',verifyToken, restaurantController.edit_dish)
// update rest personal info - currently unused
router.post('/update/info',verifyToken, restaurantController.update_info)
// custoemer uses to show list of available dishes in a particular rest.
// and also used by restaurant
router.get('/getDishes',verifyToken, restaurantController.get_dishes)
// restaurant to delete dish by id
router.delete('/delete/:id',verifyToken, restaurantController.delete_dish)
// anyone can access it - (here used by customer to get list of resturants, in RestaurantList.js page)
router.get('/getList', restaurantController.get_restaurants)
// used in orders actions (redux)
router.get('/getDish',verifyToken, restaurantController.get_dishById)
// used to place customer order
router.post('/order', verifyToken, restaurantController.place_order)

router.get('/getOrder',verifyToken, restaurantController.get_orderDetails)

router.get('/getOrders',verifyToken, restaurantController.get_allorders)
// only restaurnat owners - now
router.post('/updateOrderStatus',verifyToken, restaurantController.update_order_status)

router.post('/getSearchResult',verifyToken, restaurantController.get_searchResult)

router.get('/prevorders',verifyToken, restaurantController.get_prevorders)


module.exports = router;
