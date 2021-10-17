import React from 'react';
// import Button from '@material-ui/core/Button';
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";

import { useDispatch } from "react-redux";
import { connect } from 'react-redux';
import { userSignup } from '../../redux/actions/user';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from "yup";


const RestaurantSignup = (props) => {
    const [error, setError] = useState("")
    const [signUpSuccess, setSignUpSuccess] = useState(false)

    const initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        dob: '',
        contact: '',
        city: '',
        state: '',
        country: '',
        deliveryType: '',
        address: '',
        type: 'restaurant',
        name: "",
        description: "",
        startTime: '11:00',
        endTime: "23:59"
    }

    const contactRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().required('Password is required'),
        firstname: Yup.string().required('firstname is required'),
        lastname: Yup.string().required('lastname is required'),
        password: Yup.string().required('Password is required'),
        contact: Yup.string().matches(contactRegex, "Contact number is incorrect").required("Contact is required"),
        city: Yup.string().required('city is required'),
        state: Yup.string().required('state is required'),
        country: Yup.string().required('country is required'),
        deliveryType: Yup.string().required('DeliveryType is required'),
        type: Yup.string(),
        dob: Yup.date().nullable().required("dob required"),
        name: Yup.string().required("restaurant name is req"),
        description: Yup.string().required("restaurant description is req"),

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

    const dispatch = useDispatch()

    const formik = useFormik({

        initialValues: initialValues,
        validationSchema: validationSchema,

        onSubmit: (values, actions) => {
            console.log("onsubmit values", values)
            dispatch(userSignup(values))
                .then(response => {
                    console.log("user userSignup..", response.status, response.data)
                    if (response.data.message === 'success') {
                        setSignUpSuccess(true)
                    }

                })
                .catch(err => {
                    // console.log("user validated..",response.status, response.data)
                    console.log("error...", err.response)
                    console.log("error...", err.response.data.message)
                    setError(err.response.data.message)
                    console.log("error obj", error)
                })
        },

        onReset: (values, { resetForm }) => {

            resetForm({});
        },
    });





    return (
        <div className="container">
            <Form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(e) }} style={{ padding: "50px" }}>
                <h3 style={{ color: "Red" }}> Personal Info</h3>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control name="firstname"
                        className={` ${getInputClasses("firstname")}`}
                        {...formik.getFieldProps('firstname')}
                        type="text" placeholder="Enter firstname" />

                    {formik.touched.firstname && formik.errors.firstname ? (
                        <div className="invalid-feedback">
                            {formik.errors.firstname}
                        </div>
                    ) : null}

                </Form.Group>
                <br />


                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control name="lastname"
                        className={` ${getInputClasses("lastname")}`}
                        {...formik.getFieldProps('lastname')}
                        type="text" placeholder="Enter lastname" />

                    {formik.touched.lastname && formik.errors.lastname ? (
                        <div className="invalid-feedback">
                            {formik.errors.lastname}
                        </div>
                    ) : null}

                </Form.Group>


                <br />

                <Form.Group controlId="formBasicEmail">
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

                </Form.Group>
                <br />

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
                <br />

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control name="contact"
                        className={` ${getInputClasses("contact")}`}
                        {...formik.getFieldProps('contact')}
                        type="text" placeholder="Enter contact" />

                    {formik.touched.contact && formik.errors.contact ? (
                        <div className="invalid-feedback">
                            {formik.errors.contact}
                        </div>
                    ) : null}

                </Form.Group>

                <br />

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control name="dob"
                        className={` ${getInputClasses("dob")}`}
                        {...formik.getFieldProps('dob')}
                        type="date" placeholder="Enter dob" />

                    {formik.touched.dob && formik.errors.dob ? (
                        <div className="invalid-feedback">
                            {formik.errors.dob}
                        </div>
                    ) : null}

                </Form.Group>

                <br />

                <h3 style={{ color: "Red" }}>Restaurant Details </h3>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Restaurant Name</Form.Label>
                    <Form.Control name="name"
                        className={` ${getInputClasses("name")}`}
                        {...formik.getFieldProps('name')}
                        type="text" placeholder="Enter name" />

                    {formik.touched.name && formik.errors.name ? (
                        <div className="invalid-feedback">
                            {formik.errors.name}
                        </div>
                    ) : null}

                </Form.Group>
                <br />

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Restaurant Description</Form.Label>
                    <Form.Control name="description"
                        className={` ${getInputClasses("description")}`}
                        {...formik.getFieldProps('description')}
                        as="textarea" placeholder="Enter Description" />

                    {formik.touched.description && formik.errors.description ? (
                        <div className="invalid-feedback">
                            {formik.errors.description}
                        </div>
                    ) : null}

                </Form.Group>
                <br />

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control name="startTime"
                        className={` ${getInputClasses("startTime")}`}
                        {...formik.getFieldProps('startTime')}
                        type="time" placeholder="Enter time" />

                    {formik.touched.startTime && formik.errors.startTime ? (
                        <div className="invalid-feedback">
                            {formik.errors.startTime}
                        </div>
                    ) : null}

                </Form.Group>
                <br />

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control name="endTime"
                        className={` ${getInputClasses("endTime")}`}
                        {...formik.getFieldProps('endTime')}
                        type="time" placeholder="Enter time" />

                    {formik.touched.endTime && formik.errors.endTime ? (
                        <div className="invalid-feedback">
                            {formik.errors.endTime}
                        </div>
                    ) : null}

                </Form.Group>
                <br />

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Restaurant Address</Form.Label>
                    <Form.Control name="address"
                        className={` ${getInputClasses("address")}`}
                        {...formik.getFieldProps('address')}
                        as="textarea" placeholder="Enter Address" />

                    {formik.touched.address && formik.errors.address ? (
                        <div className="invalid-feedback">
                            {formik.errors.address}
                        </div>
                    ) : null}

                </Form.Group>
                <br />

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Restaurant Location City</Form.Label>
                    <Form.Control name="city"
                        className={` ${getInputClasses("city")}`}
                        {...formik.getFieldProps('city')}
                        type="text" placeholder="Enter City" />

                    {formik.touched.city && formik.errors.city ? (
                        <div className="invalid-feedback">
                            {formik.errors.city}
                        </div>
                    ) : null}

                </Form.Group>

                <br />

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>State</Form.Label>
                    <Form.Control name="state"
                        className={` ${getInputClasses("state")}`}
                        {...formik.getFieldProps('state')}
                        type="text" placeholder="Enter state" />

                    {formik.touched.state && formik.errors.state ? (
                        <div className="invalid-feedback">
                            {formik.errors.state}
                        </div>
                    ) : null}

                </Form.Group>

                <br />


                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Select Country</Form.Label>
                    <Form.Select name="country"
                        className={` ${getInputClasses("country")}`}
                        {...formik.getFieldProps('country')}
                        aria-label="Default select example">
                        <option value="">Select a country</option>
                        <option value="USA">USA</option>
                        <option value="INDIA">INDIA</option>
                    </Form.Select>

                    {formik.touched.country && formik.errors.country ? (
                        <div className="invalid-feedback">
                            {formik.errors.country}
                        </div>
                    ) : null}

                </Form.Group>



                <br />


                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Select Delivery Type</Form.Label>
                    <Form.Select name="country"
                        className={` ${getInputClasses("deliveryType")}`}
                        {...formik.getFieldProps('deliveryType')}
                        aria-label="Default select example">
                        <option value="">Select Delivery Type</option>
                        <option value="delivery">Delivery</option>
                        <option value="pickup">Pickup</option>
                        <option value="delivery and pickup">Delivery and Pickup</option>
                    </Form.Select>

                    {formik.touched.deliveryType && formik.errors.deliveryType ? (
                        <div className="invalid-feedback">
                            {formik.errors.deliveryType}
                        </div>
                    ) : null}

                </Form.Group>

                <br />
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <div className="invalid-feedback">{error}</div>

            </Form>
            <div>

                <div style={{ display: "block" }} class="invalid-feedback">{error}</div>

            </div>
            <div>
                {
                    signUpSuccess &&

                    <div>
                        <div style={{ color: "Green" }}> Restaurant Successfully Registerd</div>
                        <Link style={{ textDecoration: "none", color: "blue" }} to="/" ><span className="glyphicon glyphicon-user"></span>Click to Login</Link>

                    </div>

                }
            </div>

        </div>
    )
}

export default connect(null, { userSignup })(RestaurantSignup);