import axios from 'axios'
import backendURL from "../../config"
import getToken from '../../utils'
import { UPDATE_REST_INFO, UPDATE_REST_INFO_SUCCESS } from '../types/restaurant'


export const updateRestInfoSuccess = (user) => {
    console.log("updateRestInfoSuccess", user)
    return {
        type: UPDATE_REST_INFO_SUCCESS,
        payload: user
    }
}


export const updateRestaurantInfo = (data) => {
    console.log("inside update Rest..", data)

    
    // Object.keys(data).forEach(key => formData.append(key, data[key]));

    return (dispatch) => {
        const token = getToken()
        axios.defaults.headers.common['authorization'] = token;
        axios.defaults.headers.post['Content-Type'] =  'multipart/form-data';
        axios.defaults.withCredentials = true;

        const formData = new FormData();
        formData.append("data", JSON.stringify(data))
        formData.append("profile_picture", data.profile_picture)
        // formData.append("type", "restaurant")

        // console.log("Form Data---", formData, JSON.stringify(data))

        // return axios.post(backendURL+"/restaurant/update/info", data)
        return axios.post(backendURL + "/user/updaterest", formData)
        // return axios.post(backendURL + "/user/update", data)
            .then(response => {
                console.log("updateRestaurantInfo..", response)
                dispatch(updateRestInfoSuccess(response.data))
                return Promise.resolve(response)
            })
            .catch(err => {
                console.log(err)
                return Promise.reject(err)
            })
    }
}