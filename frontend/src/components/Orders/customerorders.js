// const jwt_decode = require('jwt-decode');
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { useState, useEffect } from "react"
import backendURL from '../../config';
import { Redirect } from 'react-router';
// for card
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// for table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Modal, Form, Button as Button1 } from "react-bootstrap";

import Swal from 'sweetalert2'

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import getToken from '../../utils';


const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);


const useStyles = makeStyles(theme => ({
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    dense: {
        marginTop: theme.spacing(2),
    },
    menu: {
        width: 200,
    },

}));

const CustomerOrders = (props) => {

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const token = JSON.parse(localStorage.getItem("accessToken"))
    var decoded = jwt_decode(token.split(' ')[1]);
    // console.log("decoded", decoded)
    const [restId, setRestId] = useState(decoded.id)
    const [allOrders, setAllOrders] = useState([])

    const [filter, setFilter] = useState("none")
    const [showUserVar, setShowUserVar] = useState(null)
    const [isUpdated, setIsUpdated] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({
        id: "",
        deliveryType: "",
        orderStatus: "",
        orderOptions: []
    })

    useEffect(() => {
        console.log("inside")
        const token = getToken()
        axios.defaults.headers.common['authorization'] = token    
        const url = backendURL + `/restaurant/getorders?id=${restId}`
        axios.get(url)
            .then(response => {
                console.log(response.data)
                setAllOrders(response.data)
                console.log("setAllOrders", allOrders)
            })
            .catch(err => {
                console.log(err)
            })
    }, [isUpdated])

    const handleShowModal = (id, deliveryType, orderStatus) => {
        var new_opts = []
        if (deliveryType === 'delivery') {
            new_opts = ["pending", "Order Received", "Preparing", "On the way", "Delivered"]
        } else {
            new_opts = ["pending", "Order Received", "Preparing", "Pickup Ready", "Pickedup"]

        }
        setModalData({
            ...modalData,
            id: id,
            deliveryType: deliveryType,
            orderStatus: orderStatus,
            orderOptions: new_opts
        })
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleOrderChange = (e) => {
        setModalData({
            ...modalData,
            orderStatus: e.target.value
        })
    }

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
        console.log("e", e.target.value)
    }

    const handleSaveOrderStatus = () => {
        console.log(modalData)
        const token = getToken()
        axios.defaults.headers.common['authorization'] = token    
        const url = backendURL + "/restaurant/updateOrderStatus"
        axios.post(url, modalData)
            .then(response => {
                if (response.status == 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Order Status updated',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setShowModal(false)
                    setIsUpdated(!isUpdated)
                }
            })
            .catch(err => {
                console.log(err)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            })

    }

    const handleShowUser = (id) => {
        console.log('user', id)

        setShowUserVar(<Redirect to={`/customer/view/${id}`} />)
    }

    return (
        <div class="container" style={{ margin: "20px" }}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        All Orders
                    </Typography>
                    
                    <Form.Label>
                        Filter by order status
                    </Form.Label>
                    <Form.Select value={filter} onChange={handleFilterChange} aria-label="example">
                        {/* <option>{filter}</option> */}
                        <option value="none">None</option>
                        <option value="pending">New Order</option>
                        <option value="Delivered">Delivered</option>
                        {/* <option value="none">Cancelled Order</option> */}
                    </Form.Select>

                    <Paper className={classes.root}>

                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>OrderNo</StyledTableCell>
                                    <StyledTableCell align="center">Delivery-Type</StyledTableCell>
                                    <StyledTableCell align="center">Total</StyledTableCell>
                                    <StyledTableCell align="center">created time</StyledTableCell>
                                    <StyledTableCell align="center">orderStatus</StyledTableCell>
                                    <StyledTableCell align="center">updateStatus</StyledTableCell>
                                    <StyledTableCell align="center">View Customer Profile</StyledTableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allOrders.map((order, index) => {
                                    if(filter==="none"){
                                        return (
                                
                                            <StyledTableRow>
                                                <StyledTableCell component="th" scope="row">{order.id}</StyledTableCell>
                                                <StyledTableCell align="center">{order.deliveryType}</StyledTableCell>
                                                <StyledTableCell align="center">{order.totalCost}</StyledTableCell>
                                                <StyledTableCell align="center">{new Date(order.createdAt).toLocaleString()}</StyledTableCell>
                                                <StyledTableCell align="center">{order.orderStatus}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Button onClick={(e) => handleShowModal(order.id,
                                                        order.deliveryType, order.orderStatus)} variant="contained" size="small" color="primary" className={classes.margin}>
                                                        Update
                                                    </Button>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Button onClick={(e) => handleShowUser(order.user_id)} variant="contained" size="small" color="primary" className={classes.margin}>
                                                        Show user
                                                    </Button>
                                                </StyledTableCell>
        
                                            </StyledTableRow>
                                        )
        
        
                                    }else{
                                        {
                                            if(order.orderStatus===filter) {
                                                return (
                                                    <StyledTableRow>
                                                    <StyledTableCell component="th" scope="row">{order.id}</StyledTableCell>
                                                    <StyledTableCell align="center">{order.deliveryType}</StyledTableCell>
                                                    <StyledTableCell align="center">{order.totalCost}</StyledTableCell>
                                                    <StyledTableCell align="center">{new Date(order.createdAt).toLocaleString()}</StyledTableCell>
                                                    <StyledTableCell align="center">{order.orderStatus}</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Button onClick={(e) => handleShowModal(order.id,
                                                            order.deliveryType, order.orderStatus)} variant="contained" size="small" color="primary" className={classes.margin}>
                                                            Update
                                                        </Button>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Button onClick={(e) => handleShowUser(order.user_id)} variant="contained" size="small" color="primary" className={classes.margin}>
                                                            Show user
                                                        </Button>
                                                    </StyledTableCell>
            
                                                </StyledTableRow>
                                                )
                                            }
                                           
                                        }
                                    }
                                
                                    })}
                            </TableBody>
                        </Table>
                    </Paper>

                </CardContent>

            </Card>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Order Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>Select Status update</Form.Label>
                    <Form.Select onChange={handleOrderChange} aria-label="example">
                        <option>{modalData.orderStatus}</option>
                        {
                            modalData.orderOptions.map((opt, index) => {
                                if (opt != modalData.orderStatus) {
                                    return (
                                        <option value={opt}>{opt}</option>
                                    )
                                }

                            })
                        }

                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button1 variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button1>
                    <Button1 variant="primary" onClick={handleSaveOrderStatus}>
                        Save Changes
                    </Button1>
                </Modal.Footer>
            </Modal>


            {showUserVar}
        </div>
    )
}

export default CustomerOrders