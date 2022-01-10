import { ADD_TO_CART, RESET_CART, UPDATE_CART, UPDATE_ORDER_CART } from "../types/orders";
import backendURL from "../../config";
import axios from "axios";
import getToken from "../../utils";


export const addToCartSuccess = (data) => {
    return {
        type: ADD_TO_CART,
        payload: data
    }
}


export const updateCartSuccess = (data) => {
    console.log("updateCartSuccess", data)
    return {
        type: UPDATE_CART,
        payload: data
    }
}


export const resetCart = () => {
    return {
        type: RESET_CART
    }
}

export const updateOrderCartSuccess = (data) => {
    console.log("Inside updateOrderCartSuccess", data)
    return {
        type: UPDATE_ORDER_CART,
        payload: data
    }
}


export const addToCart = (rest_id, dish_id, qty, is_update = false) => {
    return (dispatch) => {
        const token = getToken()
        axios.defaults.headers.common['authorization'] = token
        axios.defaults.withCredentials = true;

        console.log("inside cart action...", rest_id, dish_id, qty, is_update)
        const url = backendURL + `/restaurant/getDish?dish_id=${dish_id}&rest_id=${rest_id}`
        return axios.get(url)
            .then(response => {
                console.log("response get dish", response.data.data)
                const data = response.data.data
                // console.log("response get dish data->", response.data.data, data.restaurantId)

                var values = {
                    price: data.price,
                    name: data.name,
                    dish_id: data._id,
                    qty: qty
                }

                if (is_update) {
                    console.log("dispatch update", values)
                    dispatch(updateCartSuccess(values))
                } else {
                    console.log("dispatch add new restaurantId", data.restaurantId)

                    values = {
                        ...values,
                        rest_id: data.restaurantId,
                    }
                    dispatch(addToCartSuccess(values))
                }

            })
            .catch(err => {
                console.log(err)
                return Promise.reject(err)
            })
    }
}

export const confirmOrder = (data) => {
    return (dispatch, getState) => {
        const order_data = getState().orders
        const new_data = {
            ...order_data,
            delivery: data.delivery,
            location: data.location,
            note: data.note
        }

        const token = JSON.parse(localStorage.getItem("accessToken"))
        axios.defaults.headers.common['authorization'] = token
        axios.defaults.withCredentials = true;

        console.log("new data", token, new_data)
        const url = backendURL + `/restaurant/order`

        return axios.post(url, new_data)
            .then(response => {
                // console.log("response", response.data)
                if (response.status === 200) {
                    dispatch(resetCart())
                }
                return Promise.resolve(response)

            })
            .catch(err => {
                console.log("confirmOrder actions...", err)
                return Promise.reject(err)
            })

    }
}


export const updateOrderCart = (dish_id, isInc = true) => {
    return (dispatch, getState) => {
        var currState = getState().orders

        console.log("curr state", currState, isInc)


        currState.dish_id.forEach((element, index) => {
            console.log("d:", dish_id, "e:", element)

            if (element == dish_id) {
                if (!isInc) {
                    if (currState.qty[index] <= 1) {
                        currState.total = currState.total - currState.price[index] * (1+currState.tax/100)
                        currState.qty.splice(index, 1)
                        currState.name.splice(index, 1)
                        currState.price.splice(index, 1)
                        currState.no_of_items = currState.no_of_items - 1

                    } else {
                        console.log("inside gt 1 -> isInc=false")
                        currState.total = currState.total - currState.price[index] * (1+currState.tax/100)
                        currState.qty[index] = currState.qty[index] - 1
                    }

                } else {
                    console.log(" Increment Item => ",currState.total, currState.price[index], currState.tax)
                    currState.total = currState.total + (currState.price[index] * (1+currState.tax/100))
                    console.log(" Increment Item After => ",currState.total, currState.price[index], currState.tax)
                    currState.qty[index] = currState.qty[index] + 1
                }
            }

        })
        dispatch(updateOrderCartSuccess(currState))




    }
}
