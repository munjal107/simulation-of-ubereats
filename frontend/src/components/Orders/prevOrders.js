
import { useState, useEffect } from "react"

import axios from 'axios';
import backendURL from '../../config';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import React from 'react';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Modal, Form, Button as Button1 } from "react-bootstrap";
import { Link } from 'react-router-dom';


// for table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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

const PrevOrders = (props) => {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const [allOrders, setAllOrders] = useState([])
    const [filter, setFilter] = useState("none")


    useEffect(() => {
        // console.log("inside")
        const token = getToken()
        axios.defaults.headers.common['authorization'] = token
        console.log("auth token...->", token)
        const url = backendURL + `/restaurant/prevorders`
        axios.get(url)
            .then(response => {
                console.log(response.data)
                setAllOrders(response.data.data)
                console.log("setAllOrders", allOrders)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
        console.log("e", e.target.value)
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
                        <option value="pending">Pending</option>
                        <option value="Preparing">Preparing</option>
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
                                    <StyledTableCell align="center">Order Time</StyledTableCell>
                                    <StyledTableCell align="center">Order Receipt</StyledTableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allOrders.map((order, index) => {
                                    if (filter === "none") {
                                        return (

                                            <StyledTableRow>
                                                <StyledTableCell component="th" scope="row">{order.id}</StyledTableCell>
                                                <StyledTableCell align="center">{order.deliveryType}</StyledTableCell>
                                                <StyledTableCell align="center">{order.totalCost}</StyledTableCell>
                                                <StyledTableCell align="center">{new Date(order.createdAt).toLocaleString()}</StyledTableCell>
                                                <StyledTableCell align="center">{order.orderStatus}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Link style={{ textDecoration: "none", color: "#000000" }} to={`/orders/${order.id}`}>

                                                        <Button variant="contained" size="small" color="primary" className={classes.margin}>
                                                            View
                                                        </Button>
                                                    </Link>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )


                                    } else {
                                        {
                                            if (order.orderStatus === filter) {
                                                return (
                                                    <StyledTableRow>
                                                        <StyledTableCell component="th" scope="row">{order.id}</StyledTableCell>
                                                        <StyledTableCell align="center">{order.deliveryType}</StyledTableCell>
                                                        <StyledTableCell align="center">{order.totalCost}</StyledTableCell>
                                                        <StyledTableCell align="center">{new Date(order.createdAt).toLocaleString()}</StyledTableCell>
                                                        <StyledTableCell align="center">{order.orderStatus}</StyledTableCell>


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

        </div>
    )
}


export default PrevOrders