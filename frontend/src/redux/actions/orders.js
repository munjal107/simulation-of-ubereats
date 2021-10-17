import { ADD_TO_CART, RESET_CART, UPDATE_CART } from "../types/orders";
import backendURL from "../../config";
import axios from "axios";
import getToken from "../../utils";


export const addToCartSuccess = (data) => {
    return {
        type : ADD_TO_CART,
        payload : data
    }
}


export const updateCartSuccess = (data) => {
    console.log("updateCartSuccess", data)
    return {
        type : UPDATE_CART,
        payload : data
    }
}


export const resetCart = () => {
    return {
        type : RESET_CART
    }
}


export const addToCart = (rest_id, dish_id, qty, is_update=false) => {
    return (dispatch) => { 
        const token = getToken()
        axios.defaults.headers.common['authorization'] = token
        axios.defaults.withCredentials = true;

        console.log("inside cart action...", rest_id, dish_id,qty ,is_update)
        const url = backendURL + `/restaurant/getDish?dish_id=${dish_id}&rest_id=${rest_id}`
        return axios.get(url)
                    .then( response => {
                        console.log("response get dish", response.data)
                        const data = response.data
                        var values = {
                            price : data.price,
                            name : data.name,
                            dish_id : data.id,
                            qty : qty
                        }
                        
                        if(is_update){
                            console.log("dispatch update", values)
                            dispatch(updateCartSuccess(values)) 
                        }else{
                            values = {
                                ... values,
                                rest_id : data.restaurant_id,
                            }
                            dispatch(addToCartSuccess(values))
                        }
                    
                    })
                    .catch( err => {
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
            delivery : data.delivery,
            location : data.location
        }

        const token = JSON.parse(localStorage.getItem("accessToken"))
        axios.defaults.headers.common['authorization'] = token
        axios.defaults.withCredentials = true;

        console.log("new data", token, new_data)
        const url = backendURL + `/restaurant/order`

        return axios.post(url, new_data)
                    .then( response => {
                        // console.log("response", response.data)
                        if(response.status === 200){
                            dispatch(resetCart())
                        }
                        return Promise.resolve(response)
                        
                    })
                    .catch( err => {
                        console.log("confirmOrder actions...",err)
                        return Promise.reject(err)
                    })

    }
}

