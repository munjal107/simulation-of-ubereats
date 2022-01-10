
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

import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@material-ui/core/TextField';

import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { IconButton } from "@material-ui/core"


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
    const [allOrdersCopy, setAllOrdersCopy] = useState([])
    const [filter, setFilter] = useState("none")

    // total page size to display
    const [pageNumber, setPageNumber] = useState(5)
    // current page number
    const [currPageNumber, setCurrPageNumber] = useState(1)
    // 
    const [isFistPage, setIsFirstPage] = useState(true)
    const [isLastPage, setIsLastPage] = useState(false)
    const [totalPages, setTotalPages] = useState()
    



    useEffect(() => {
        // console.log("inside")
        const token = getToken()
        axios.defaults.headers.common['authorization'] = token
        console.log("auth token...->", token)
        const url = backendURL + `/restaurant/prevorders`
        axios.get(url)
            .then(response => {
                console.log(response.data)
                var temp = response.data.data
                // setAllOrders(temp)
                // setAllOrders(temp.slice(0, parseInt(pageNumber)))
                const total_pages = Math.ceil((temp.length)/pageNumber)
                console.log("Total Pages -> ", total_pages)
                setTotalPages(total_pages)
                setAllOrders(temp.slice(0, pageNumber))
                setAllOrdersCopy(response.data.data)
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

    const handlePageChange = (e) => {
        const curr_value = e.target.value
        console.log("e", e.target.value)
        setPageNumber(e.target.value)
        setCurrPageNumber(1)

        var orders_list = allOrdersCopy
        var total_pages = Math.ceil((orders_list.length)/curr_value)
        setTotalPages(total_pages)
        if(total_pages > 1){
            setIsLastPage(false)
        }else{
            setIsLastPage(true)
        }
        setIsFirstPage(true)
        var curr_list = orders_list.slice(0, curr_value)
        setAllOrders(curr_list)

    }

    const handlePrevChange = (e) => {
        console.log("inside Prev Page")

        var orders_list = allOrdersCopy
        var new_page = currPageNumber - 1
        var total_pages = Math.ceil((orders_list.length)/pageNumber)
        setTotalPages(total_pages)

        if(new_page<=1){
            setIsFirstPage(true)
        }else{
            setIsLastPage(false)
        }

        if(new_page<total_pages){
            setIsLastPage(false)
        }else{
            setIsLastPage(true)
        }

        console.log("pageNumber", pageNumber, new_page)
        console.log(pageNumber*(new_page), pageNumber*(new_page+1))
        var new_list = orders_list.slice(pageNumber*(new_page-1), pageNumber*(new_page))
        console.log("new_list length", new_list.length, new_list)

        setCurrPageNumber(new_page)
        setAllOrders(new_list)
        console.log("executed")

        // var 
    }

    const handleNextChange = (e) => {
        console.log("inside next page")

        var orders_list = allOrdersCopy
        var new_page = currPageNumber + 1
        var total_pages = Math.ceil((orders_list.length)/pageNumber)
        
        console.log("orders length", orders_list.length, total_pages)
        
        if(new_page>=total_pages){
            setIsLastPage(true)
        }else{
            setIsLastPage(false)
        }
        if(new_page>1){
            setIsFirstPage(false)
        }else{
            setIsFirstPage(true)
        }

        console.log(pageNumber*(currPageNumber-1),pageNumber*currPageNumber)
        var new_list = orders_list.slice(pageNumber*(currPageNumber), pageNumber*(currPageNumber+1))
        console.log("new_list length", new_list.length, new_list)

        setCurrPageNumber(new_page)
        setAllOrders(new_list)
        console.log("executed")

        // var 
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
                        <option value="Order Cancelled">Canceled Orders</option>

                        {/* <option value="none">Cancelled Order</option> */}
                    </Form.Select>

                <br/>
                <br/>
                <spam>Page - {currPageNumber} of {totalPages}</spam>

                <IconButton onClick={handlePrevChange} disabled={isFistPage} className={classes.button} aria-label="prev">
                        <SkipPreviousIcon />
                    </IconButton>

                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel id="demo-simple-select-standard-label"><b>Items per page</b></InputLabel>
                            {/* <br/> */}
                            <Select sx={{ m: 1, minWidth: 140, height:35 }}
                                label Id="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                label="Deliery"
                                value={pageNumber}
                                onChange={handlePageChange}
                            >
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                                <MenuItem value="7">10</MenuItem>
                            </Select>
                        </FormControl>

                    <IconButton onClick={handleNextChange} disabled={isLastPage} className={classes.button} aria-label="prev">
                        <SkipNextIcon/>
                    </IconButton>

                   

                    <Paper className={classes.root}>

                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Index No.</StyledTableCell>
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
                                                <StyledTableCell component="th" scope="row">{index + 1}</StyledTableCell>
                                                <StyledTableCell align="center">{order.deliveryType}</StyledTableCell>
                                                <StyledTableCell align="center">{order.totalCost.toFixed(2)}</StyledTableCell>
                                                <StyledTableCell align="center">{new Date(order.createdAt).toLocaleString()}</StyledTableCell>
                                                <StyledTableCell align="center">{order.orderStatus}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Link style={{ textDecoration: "none", color: "#000000" }} to={`/orders/${order._id}`}>

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
                                                        <StyledTableCell component="th" scope="row">{index + 1}</StyledTableCell>
                                                        <StyledTableCell align="center">{order.deliveryType}</StyledTableCell>
                                                        <StyledTableCell align="center">{order.totalCost}</StyledTableCell>
                                                        <StyledTableCell align="center">{new Date(order.createdAt).toLocaleString()}</StyledTableCell>
                                                        <StyledTableCell align="center">{order.orderStatus}</StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            <Link style={{ textDecoration: "none", color: "#000000" }} to={`/orders/${order._id}`}>

                                                                <Button variant="contained" size="small" color="primary" className={classes.margin}>
                                                                    View
                                                                </Button>
                                                            </Link>
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

        </div>
    )
}


export default PrevOrders