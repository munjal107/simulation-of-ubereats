import {  USER_SIGNUP, LOGIN_SUCCESS, USER_UPDATE_SUCCES, LOGIN_FAILURE } from "../types/user";

const initialState = {
    isLoggedin : false,
    user : "",
    error : ""
}


const userReducer = (state = initialState, action) => {
    console.log("user reducer...", action.payload, action.type)
    switch(action.type) {
        case LOGIN_SUCCESS : return {
            ...state,
            isLoggedin : true,
            user : action.payload
        }
        case LOGIN_FAILURE : return {
            isLoggedin : false,
            user : "",
            error : action.payload
        }
        case USER_SIGNUP : return {
            ...state,
            isLoggedin : false,
            user : action.payload
        }
        case USER_UPDATE_SUCCES : return {
            ...state,
            isLoggedin : true,
            user : action.payload
        }
       
        default : return state
    }
}

export default userReducer