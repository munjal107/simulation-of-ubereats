import { LOGIN_SUCCESS, LOGIN_FAILURE, USER_SIGNUP, USER_UPDATE_SUCCES } from "../types/user"
import axios from 'axios'
import backendURL from "../../config"
import getToken from "../../utils"

export const userLoginSuccess = (user) => {
    // console.log("userLoginSuccess", user)
    return {
        type : LOGIN_SUCCESS,
        payload : user
    }
}

export const userLoginFailure = (error) => {
    return {
        type : LOGIN_FAILURE,
        payload : error
    }
}

export const userSignupSuccess = (user) => {
    return {
        type : USER_SIGNUP,
        payload : user
    }
}

export const userUpdateSuccess = (user) => {
    return {
        type : USER_UPDATE_SUCCES,
        payload : user
    }
}

export const userSignup = (data) => {
    return (dispatch) => {
        axios.defaults.withCredentials = true;
        // console.log(" validateUserLogin data")
        return axios.post(backendURL + "/user/create", data)
            .then( response => {
                console.log(response.data)
                dispatch(userSignupSuccess(response.data))
                return Promise.resolve(response)

            })
            .catch( err => {
                console.log(err)
                return Promise.reject(err)
            })

    }
}

export  const validateUserLogin = (data) => {
    return (dispatch) => {
        axios.defaults.withCredentials = true;
        console.log(" validateUserLogin data", data)
        return axios.post(backendURL + "/user/login", data)
                .then( (response) => {
                    console.log("User login response", response)
                    console.log("User login response data", response.data)

                    dispatch(userLoginSuccess(response.data.data))
                    
                    return Promise.resolve(response)
                })
                .catch( (err) => {
                    console.log("User login error#", err.response.data)
                    // console.log("User login error#", err.message)
                    dispatch(userLoginFailure(err.response.data))
                    return Promise.reject(err)
                })
    }
}


export const updateUserInfo = (data) => {
    return (dispatch) => {
        axios.defaults.withCredentials = true;
        console.log(" updateUserInfo data")
        const token = getToken()
        axios.defaults.headers.common['authorization'] = token
    
        return axios.post(backendURL + "/user/update", data)
                .then( (response) => {
                    console.log("User login response", response)
                    dispatch(userLoginSuccess(response.data.data))
                    
                    return Promise.resolve(response)
                })
                .catch( (err) => {
                    console.log("User update error#", err.response.data)
                    return Promise.reject(err)
                })
    }
}



// export const restaurantSignup = (data) =>{
//     return (dispatch) => {
//         axios.defaults.withCredentials = true;
//         axios.post(backendURL + "/user/create", data)
//             .then( response => {
//                 console.log(response.data)
//                 dispatch(userSignupSuccess(response.data))
//             })
//             .catch( err => {
//                 console.log(err)
//             })

//     }
// }