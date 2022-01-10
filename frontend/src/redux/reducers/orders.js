import { ADD_TO_CART, UPDATE_CART, RESET_CART, UPDATE_ORDER_CART } from "../types/orders"

const initialState = {
    no_of_items : 0,
    rest_id : -1,
    dish_id : [],
    name : [],
    qty : [],
    price : [],
    total : 0.00,
    tax : 10,
}

const ordersReducer = (state = initialState, action) => {
    console.log("ordersReducer", action.payload)
    switch(action.type){
        case ADD_TO_CART: return {
            ...state,
            rest_id : action.payload.rest_id,
            no_of_items : state.no_of_items + 1,
            dish_id : [...state.dish_id, action.payload.dish_id],
            name : [...state.name, action.payload.name],
            qty : [...state.qty, action.payload.qty],
            price :  [...state.price, action.payload.price],
            total : state.total + ( (1 + state.tax/100) * action.payload.price * action.payload.qty)
        }
        case UPDATE_CART :{
            // check whether item already exist in cart?
            var isItemNew = true
            var newQty = 0
            // var newPrice = 0
            state.dish_id.forEach((element, index) => {
                if(element === action.payload.dish_id){
                    isItemNew = false
                    newQty = state.qty[index] + action.payload.qty
                    // newPrice = newQty + action.payload.price
                    var newTotal = state.total - state.qty[index] * state.price[index] + newQty * action.payload.price

                    state.qty[index] = newQty
                    state.price[index] = action.payload.price
                    state.total = newTotal
                }
            })
            if(isItemNew){
                return {
                    ...state,
                    no_of_items : state.no_of_items + 1,
                    dish_id : [...state.dish_id, action.payload.dish_id],
                    name : [...state.name, action.payload.name],
                    qty : [...state.qty, action.payload.qty],
                    price :  [...state.price, action.payload.price],
                    total : state.total + ( (1 + state.tax/100) * action.payload.price * action.payload.qty)
                }
            }else{
                return {
                    ...state
                }
            }

            

        } 
    
        case RESET_CART : return {
            ...state,
            no_of_items : 0,
            rest_id : -1,
            dish_id : [],
            name : [],
            price : [],
            qty : [],
            total : 0.00,
            tax : 10,
        }

        case UPDATE_ORDER_CART: {
            console.log("Inside reducer UPDATE_ORDER_CART", action.payload)
            return {
                ...action.payload
            }
        }

        default: return state
    }
}

export default ordersReducer
