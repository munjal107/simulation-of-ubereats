import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from "react-redux"
import { confirmOrder, resetCart, updateOrderCart } from '../../redux/actions/orders';
import { Redirect } from 'react-router';

import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@material-ui/core/TextField';

import Checkbox from '@material-ui/core/Checkbox';
import RestaurantDashboard from '../Restaurant.js/restaurantdashboard';
import Swal from 'sweetalert2'

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton } from "@material-ui/core"

import backendURL from '../../config';
import axios from 'axios';

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


const OrderConfirmation = (props) => {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  console.log("props...", props.orders)

  var rest_id = props.orders.rest_id
  console.log("rest_id =>.", rest_id)

  const [redirectVar, setRedirectVar] = useState(null)
  const [delivery, setDelivery] = useState("delivery")
  const [isDelivery, setIsDelivery] = useState(true)
  const [checkedA, setCheckedA] = useState(true)
  const [locationValue, setLocationValue] = useState("")
  const [isOrder, setIsOrder] = useState(true)
  const [note, setNote] = useState("")
  const [isPickup, setIsPickup] = useState(false)
  const [restObj, setRestObj] = useState({})

  useEffect(() => {

    if(rest_id===-1 || rest_id==="-1"){
      rest_id = "6190896b25beeb60a0d85147"
    }
    const url = backendURL + `/restaurant/get/restinfo?id=${rest_id}` 

    axios.get(url)
      .then( response => {
        const temp = response.data.data
        console.log("temp => ", temp)
        setRestObj(temp)
        if(temp.deliveryType == "pickup"){
          console.log("pickup true")
          setIsPickup(true)
        }
      })

    if(props.orders.no_of_items === 0) {
      setIsOrder(false)
    }
  }, [isOrder])

  const handleIncrement = (dish_id) => {
    // const new_val = cartQty + 1
    // SetCartQty(cartQty + 1)
    console.log("dish_id", dish_id)
    console.log("calling..")
    props.updateOrderCart(dish_id, true)
  }
  const handleDecrement = (dish_id) => {
    // const new_val = cartQty - 1 >= 0 ? cartQty - 1 : 0
    // SetCartQty(new_val)
    props.updateOrderCart(dish_id, false)

  }



  const handleCancel = () => {
    console.log("cancel")
    props.resetCart()
    setIsOrder(false)
    setNote("")
    setRedirectVar(<Redirect to="/customerDashboard" />)
  }

  const handleChange = (e) => {
    setDelivery(e.target.value)
    // console.log("outside..", delivery, e.target.value)
    if (e.target.value === 'delivery') {
      setIsDelivery(true)
    } else {
      setIsDelivery(false)
    }
  }

  const handleSubmit = () => {
    console.log("inside order confirm submit")
    var data = {
      delivery: delivery,
      note: note
    }
    
    
    if (checkedA) {
      data.location = "default"
    } else {
      data.location = locationValue
    }

    if(isPickup){
      data.delivery = "pickup"
      data.location = restObj.address
    }
    // console.log('hh', checkedA, delivery, locationValue, data)
    props.confirmOrder(data)
      .then(response => {
        console.log("confirmOrder", response)
        const order_id = response.data.data._id
        setIsOrder(false)

        Swal.fire({
          title: 'Order Placed Successfully!!',
          confirmButtonText: 'Ok',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            setRedirectVar(<Redirect to={`orders/${order_id}`} />)
          }
        })

      })
      .catch(err => {
        console.log("error", err)

      })
  }

  const handleChecked = name => event => {
    setCheckedA(event.target.checked);
    console.log("checked", checkedA, event.target.checked)
  };

  const handleLocationChange = (e) => {
    setLocationValue(e.target.value)
  }


  return (
    <div className="container" style={{ margin: "20px" }}>
      {redirectVar}
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            <b>Order From - <span style={{color:"green"}}>{restObj.name}</span> </b>
          </Typography>
          <Typography variant="h5" component="h2">
            Order Confirmation
          </Typography>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="center">Price ($)</StyledTableCell>
                  <StyledTableCell align="center">Qty</StyledTableCell>
                  <StyledTableCell align="center">total</StyledTableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {props.orders.name.map((dish, index) => (

                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row">{dish}</StyledTableCell>
                    <StyledTableCell align="center">{props.orders.price[index]}</StyledTableCell>
                    <StyledTableCell align="center">

                    <IconButton onClick={(e) => { e.preventDefault(); handleIncrement(props.orders.dish_id[index])}} className={classes.button} aria-label="Delete">
                        <AddIcon />
                    </IconButton>
                      
                      {props.orders.qty[index]}

                      <IconButton onClick={(e) => { e.preventDefault(); handleDecrement(props.orders.dish_id[index])}} className={classes.button} aria-label="Delete">
                        <RemoveIcon />
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell align="center">{(props.orders.qty[index] * props.orders.price[index]).toFixed(2)}</StyledTableCell>


                  </StyledTableRow>
                )


                )
                }



                <StyledTableRow>
                  <StyledTableCell />
                  <StyledTableCell />
                  <StyledTableCell align="right"><b>Tax</b></StyledTableCell>
                  <StyledTableCell align="center"><b>{props.orders.tax}%</b></StyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell />
                  <StyledTableCell />
                  <StyledTableCell align="right"><b>Total</b></StyledTableCell>
                  <StyledTableCell align="center"><b>

                    {Math.round(props.orders.total * 100) / 100}</b></StyledTableCell>
                </StyledTableRow>

              </TableBody>
            </Table>
          </Paper>

        </CardContent>

        {
          !isPickup && isOrder && <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label"><b>Delivery Options</b></InputLabel>
              <br />
              <Select sx={{ m: 1, minWidth: 120 }}
                label Id="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                label="Deliery"
                value={delivery}
                onChange={handleChange}
              >
                <MenuItem value="delivery">delivery</MenuItem>
                <MenuItem value="pickup">pickup</MenuItem>
              </Select>
            </FormControl>
            <br />
            <div>
              {
                isDelivery &&
                <div>
                  <Checkbox
                    checked={checkedA}
                    onChange={handleChecked('checkedA')}
                    value="default"
                    inputProps={{
                      'aria-label': 'primary checkbox',
                    }}
                  />  - Delivery Location same as default address

                </div>
              }
              {
                !checkedA &&
                <div>
                  <TextField
                    id="outlined-multiline-static"
                    label="Enter Delivery Loc"
                    multiline
                    rows="4"
                    defaultValue=""
                    className={classes.textField}
                    margin="normal"
                    value={locationValue}
                    onChange={handleLocationChange}
                    variant="outlined"
                  />
                </div>
              }


              <TextField
                id="standard-full-width"
                label="Note"
                name="note"
                style={{ margin: 8 }}
                placeholder="Add a note for the store"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => { e.preventDefault(); setNote(e.target.value)}}
              />

            </div>
          </div>


        }

        {
          isPickup && 
          <div>

        <p><b>Pick-up address</b> - <spam style={{color:"red"}}>{restObj.address}</spam></p>
          
          <TextField
                id="standard-full-width"
                label="Note"
                name="note"
                style={{ margin: 8 }}
                placeholder="Add a note for the store"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={note}
                onChange={(e) => { e.preventDefault(); setNote(e.target.value)}}
              />

          </div>
          
        }



        <CardActions className="float-right">

          <button onClick={handleCancel} style={{ margin: "10px" }} type="button" class="btn btn-outline-primary">Cancel</button>
          {isOrder &&
            <div>

              <button onClick={handleSubmit} style={{ margin: "10px" }} type="button" class="btn btn-outline-success">Confirm Order</button>

            </div>
          }
        </CardActions>
      </Card>
    </div>

  );
}

const mapStatsToProps = state => {
  return {
    orders: state.orders
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetCart: () => dispatch(resetCart()),
    confirmOrder: (delivery) => dispatch(confirmOrder(delivery)),
    updateOrderCart: (rest_id, isInc) => dispatch(updateOrderCart(rest_id, isInc))
  }
}

export default connect(mapStatsToProps, mapDispatchToProps)(OrderConfirmation)