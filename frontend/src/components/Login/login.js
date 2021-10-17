import React from 'react';
import {Button, Form, InputGroup, Col, Row} from "react-bootstrap";
import { useState } from "react";
import axios from "axios"
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { Link } from 'react-router-dom';
import { validateUserLogin } from '../../redux';
import { useDispatch } from "react-redux";
import { connect } from 'react-redux'

import { useFormik } from 'formik';
import * as Yup from "yup";


// import baseURL from '../../config'
import backendURL from '../../config';


const Login = (props) => {

  const [errorVar, setErrorVar] = useState(null)
  const [loginSuccess, setLoginSuccess] = useState(null);

  const initialValues = {
    email : "",
    password : ""
  }
  const dispatch = useDispatch()


  const validationSchema = Yup.object().shape({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Password is required'),
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };


  const formik = useFormik({
    
    initialValues : initialValues,
    validationSchema: validationSchema,

    onSubmit: (values) => {
      dispatch(validateUserLogin(values))
        .then( response => {
          // console.log("user validated..",response.status, response.data)

          if (response.data.accessToken) {
            console.log("session token", response.data.accessToken)
            localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
            localStorage.setItem("userid", JSON.stringify(response.data.data.id));
            localStorage.setItem("user", JSON.stringify(response.data.data));
            localStorage.setItem("type", JSON.stringify(response.data.data.type));
            if(response.data.data.type === 'restaurant'){
              localStorage.setItem("restaurant_id", JSON.stringify(response.data.data.Restaurant.id));
              // let redirectVar2 = <Redirect to="/restaurantDashboard" />
              let responseVar = <div className="alert alert-success" role="alert">Success</div>

              setLoginSuccess(responseVar)
            }else{
              let responseVar = <div className="alert alert-danger" role="alert">Success</div>
              setLoginSuccess(responseVar)
            }
            
        }
      })
      .catch( err => {
        // console.log("user validated..",response.status, response.data)
        console.log("error...", err.response)
        setErrorVar(err.response.data.message)
        console.log("error obj", errorVar)
      })

    },

    onReset: (values, { resetForm }) => {
      resetForm();
    },
  });

    let redirectVar = null
    if (localStorage.getItem("accessToken") != null) {
      const typeVar = JSON.parse(localStorage.getItem("type"))
      if(typeVar==='customer'){
        redirectVar = <Redirect to="/customerDashboard" />
        // setRedirectVar(redirectVar1)
      }
      if(typeVar==='restaurant'){
        redirectVar = <Redirect to="/restaurantDashboard" />
       }
    
    }
    console.log("redirectVar", redirectVar)

  return (
            <div>
              
              {redirectVar}


            <Form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(e)}} style={{padding : "50px"}}>
            <Form.Group  controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control name="email"  
              className={` ${getInputClasses("email")}`}
              {...formik.getFieldProps('email')}

              type="email" placeholder="Enter email" />
              
              {formik.touched.email && formik.errors.email ? (
                <div className="invalid-feedback">
                  {formik.errors.email}
                </div>
              ) : null}


              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" 
              {...formik.getFieldProps('password')}
              className={` ${getInputClasses("password")}`}
               type="password" placeholder="Password" />

              {formik.touched.password && formik.errors.password ? (
                              <div className="invalid-feedback">
                                {formik.errors.password}
                              </div>
              ) : null}

            </Form.Group>
            
            <br></br>
            <h6>Don't have an account? Go to <Link to="/userSignup">Customer Signup Page</Link></h6>
            <h6>To Sign up as a Restaurant owner.<Link to="/restaurantSignup">Click Here</Link></h6>

            <br></br>

            <Button variant="primary" type="submit">
              Submit
            </Button>
            <br></br>
            <br></br>
            <div className="err" style={{color: "red"}}>
                        
            </div>

            <div style={{display:"block"}} className="invalid-feedback">{errorVar}</div>
          </Form>
          
            {loginSuccess}
                    

        </div>
  
      
  );
};

export default connect(null, { validateUserLogin })(Login);