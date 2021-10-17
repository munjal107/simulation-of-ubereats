import React from "react";
import {Redirect, Route, withRouter} from "react-router-dom";
// import {getAccessTokenCookie} from "../utils/CookieHander";

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    
    const curRole = JSON.parse(localStorage.getItem("type"))
    console.log("curr role", curRole)
    
    return (
        <Route
            {...rest}
            render={(props) => {
                // if (!getAccessTokenCookie()) {
                //     // not logged in so redirect to login page with the return url
                //     return <Redirect to="/" />;
                // }
                if (!roles.includes(curRole)) {
                    return <Redirect to="/" />;
                }
                // authorised so return component
                return <Component {...props} />;
            }}
        />
    );
};

export default withRouter(PrivateRoute);