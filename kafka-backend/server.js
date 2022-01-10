var connection = new require('./kafka/Connection');
const mongoose = require('mongoose');



// async function connectToDB(){
//     const database_name = "mongo-1"

//     await mongoose.connect(dbURI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then((result) => {
//         console.log("connected to db")
//     })
//     .catch((err) => {  console.log("Error:", err) })
// }
// connectToDB()


//topics files
//var signin = require('./services/signin.js');
// var Books = require('./services/books.js');
const PostUserCreate = require("./services/userCreate")
const UserLogin = require("./services/userLogin")
const UserUpdate = require("./services/userUpdate")
const AddDish = require("./services/addDishes")
const EditDish = require("./services/editDish")
const GetDishes = require("./services/getDishes")
const DeleteDish = require("./services/deleteDish")
const PlaceOrder = require("./services/placeOrder")
const RestaurantList = require("./services/getResturants")
const GetDishById = require("./services/getDishById")
const GetOrderDetails = require("./services/getOrderDetails")
const GetAllOrders = require("./services/getAllOrders")
const UpdateOrderStatus = require("./services/updateOrderStatus")
const GetPrevOrders = require("./services/getPrevOrders")
const AddFavRestaurant = require("./services/addFavRestaurant")
const DeleteFavRestaurant = require("./services/deleteFavRest")
const GetFavRestaurant = require("./services/getFavRest")
const GetUserInfo = require("./services/getUserInfo")
const CancelOrder = require("./services/cancelOrder")
const SearchRestaurants = require("./services/searchRestaurants")
const GetRestInfo = require("./services/getRestInfo")



function handleTopicRequest(topic_name, fname) {
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name + " ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        fname.handle_request(data.data, function (err, res) {
            console.log('after handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });

    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
// handleTopicRequest("post_book",Books)

const main = async () => {
    const dbURI = `uri`
    await mongoose.connect(dbURI)
  }
  
main().then(() => console.log("Database Connected..."));
  

handleTopicRequest("PostUserCreate1", PostUserCreate)
handleTopicRequest("PostUserLogin", UserLogin)
handleTopicRequest("PostUserUpdate", UserUpdate)
handleTopicRequest("PostAddDish", AddDish)
handleTopicRequest("PostEditDish", EditDish)
handleTopicRequest("GetDishes", GetDishes)
handleTopicRequest("DeleteDish", DeleteDish)
handleTopicRequest("GetRestaurantList", RestaurantList)
handleTopicRequest("GetDishById", GetDishById)
handleTopicRequest("GetOrderDetails", GetOrderDetails)
handleTopicRequest("GetAllOrders", GetAllOrders)
handleTopicRequest("UpdateOrderStatus", UpdateOrderStatus)
handleTopicRequest("GetPrevOrders", GetPrevOrders)
handleTopicRequest("PlaceOrder", PlaceOrder)
handleTopicRequest("AddFavRestaurant", AddFavRestaurant)
handleTopicRequest("DeleteFavRestaurant", DeleteFavRestaurant)
handleTopicRequest("GetFavRestaurant", GetFavRestaurant)
handleTopicRequest("GetUserInfo", GetUserInfo)
handleTopicRequest("CancelOrder", CancelOrder)
handleTopicRequest("SearchRestaurants", SearchRestaurants)
handleTopicRequest("GetRestInfo", GetRestInfo)










