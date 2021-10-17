import { useParams } from "react-router"
import { useEffect, useState } from "react"
import axios from "axios"
import backendURL from "../../config"
import { makeStyles } from '@material-ui/core/styles';
import { Button, Form } from "react-bootstrap";
import getToken from "../../utils";





const ViewCustomerProfile = (props) => {
    const { id } = useParams()
    const data = {
        id : id
    }

    const [custData, setCustData] = useState({})
    const [disabled, setDisabled] = useState(true)



    useEffect( () => {
        const token = getToken()
        axios.defaults.headers.common['authorization'] = token
    
        const url = backendURL + "/customer/getInfo"
        axios.post(url, data)
            .then(response => {
                setCustData(response.data.data)
                // console.log("getInfo",response)
            })
            .catch( err => {
                console.log(err)
            })
    }, [])

    const getInputClasses = (fieldname) => {
    
        return "";
    };


    return (
        <div className="container">
        
        <Form style={{ padding: "50px" }}>
            <h3 style={{color:"Red"}}>Customer Info</h3>
                
            <Form.Group controlId="formBasicEmail">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control name="firstname"
                        className={` ${getInputClasses("firstname")}`}
                        value={custData.firstname}
                        disabled={disabled}
                        type="text" placeholder="Enter firstname" />

                </Form.Group>
                <br/>

            
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control name="lastname"
                        disabled={disabled}
                        className={` ${getInputClasses("lastname")}`}
                        value={custData.lastname}
                        type="text" placeholder="Enter lastname" />

                </Form.Group>
                
                
            <br/>
                
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control name="email"
                        className={` ${getInputClasses("email")}`}
                        value={custData.email}
                        disabled={disabled}
                        type="email" placeholder="Enter email" />

                 

                </Form.Group>
                <br/>

            

            <Form.Group controlId="formBasicEmail">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control name="contact"
                        className={` ${getInputClasses("contact")}`}
                        value={custData.contact}
                        disabled={disabled}

                        type="text" placeholder="Enter contact" />

                   
                </Form.Group>

            
            <br/>
            <Form.Group controlId="formBasicEmail">
                    <Form.Label>Default Delivery Address</Form.Label>
                    <Form.Control name="address"
                        className={` ${getInputClasses("address")}`}
                        value={custData.address}
                        disabled={disabled}
                        type="text" placeholder="Enter Address" />
                </Form.Group>
                <br/>

            <Form.Group controlId="formBasicEmail">
                    <Form.Label>City</Form.Label>
                    <Form.Control name="city"
                        className={` ${getInputClasses("city")}`}
                        value={custData.city}
                        disabled={disabled}

                        type="text" placeholder="Enter City" />
                        

                </Form.Group>

            <br/>

            </Form>
    
        </div>
    )
}


export default ViewCustomerProfile