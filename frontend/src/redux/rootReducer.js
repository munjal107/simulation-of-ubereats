import { combineReducers } from "redux";
import restaurantReducer from "./reducers/restaurant";
import userReducer from "./reducers/user";
import ordersReducer from "./reducers/orders";



const rootReducer = combineReducers({
    user : userReducer,
    restaurant : restaurantReducer,
    orders : ordersReducer
})

export default rootReducer