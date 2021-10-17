import { UPDATE_REST_INFO } from "../types/restaurant";

const initialState = {
    user : ""
}

const restaurantReducer = (state = initialState, action) => {
    console.log("Rest reducer...", action.payload, action.type)
    switch(action.type) {
        case UPDATE_REST_INFO : return {
            ...initialState,
            user : action.payload
        }

        default : return state
    }

}

export default restaurantReducer
