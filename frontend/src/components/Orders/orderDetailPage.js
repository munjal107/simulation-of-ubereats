import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { connect } from "react-redux"
import Swal from 'sweetalert2'
import backendURL from "../../config"
import axios from "axios"


import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import useFetch from "../../useFetch";
import getToken from "../../utils"


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

const OrderDetailPage = (props) => {
  const { id } = useParams()
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const abortController = new AbortController()
  const [orderDetails, setOrderDetails] = useState({
    OrderedDishes:[]
  })
  const [isPending, setIsPending] = useState(false)
  const [isStatusChanged, setIsStatusChanged] = useState(false)
  const url = backendURL + `/restaurant/getOrder?id=${id}`
  console.log("URL:", url)
  // const { error, isPending, data: orderDetails } = useFetch(url)
  // console.log("response data", orderDetail)

  useEffect( () => {
    
    const token = getToken()
    axios.defaults.headers.common['authorization'] = token

     axios.get(url)
      .then(response => {
        const temp = response.data.data
        console.log("Axios response...", response.data)
        setOrderDetails(response.data.data)

        if(temp.orderStatus === "pending" || temp.orderStatus.toLowerCase() === "preparing"){
          setIsPending(true)
        }else{
          setIsPending(false)
        }


        console.log("Axios response...orderDetails", orderDetails)

      })
      .catch( err => {
        console.log("axios err",err)
      })

      return () => {
        abortController.abort()
      }

  }, [isStatusChanged])

  const handleSubmit = () => {
    console.log("Inside Cancel Order Handle Submit")
    const url = backendURL + `/restaurant/order/cancel?id=${id}`

    const token = getToken()
    axios.defaults.headers.common['authorization'] = token

    axios.get(url)
      .then( response => {
        console.log("hello")
        // setIsPending(false)
        setIsStatusChanged(!isStatusChanged)
      })
      .catch( err => {
        console.log("cancel order Error => ", err)
      })
  }



  return (
    <div className="container" style={{ margin: "20px" }}>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            order Receipt
          </Typography>
          <Typography variant="h5" component="h2">
            <div style={{ color: "Blue" }}>{orderDetails.restName}</div>
          </Typography>

          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="center">Qty</StyledTableCell>
                  <StyledTableCell align="center">Price ($)</StyledTableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {orderDetails.OrderedDishes.map((dish, index) => (

                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row">{dish.name}</StyledTableCell>
                    <StyledTableCell align="center">{dish.qty}</StyledTableCell>
                    <StyledTableCell align="center">{dish.price}</StyledTableCell>

                  </StyledTableRow>
                ))}


                <StyledTableRow>
                  <StyledTableCell/>
                  <StyledTableCell align="right"><b>Tax</b></StyledTableCell>
                  <StyledTableCell align="center"><b>{orderDetails.tax}%</b></StyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell/>
                  <StyledTableCell align="right"><b>Total</b></StyledTableCell>
                  <StyledTableCell align="center"><b>{orderDetails.totalCost}</b></StyledTableCell>
                </StyledTableRow>

              </TableBody>
            </Table>
          </Paper>
          <br />
          <Typography variant="h6" component="h2">
            Order Status - <span style={{color:"green"}}> {orderDetails.orderStatus} </span>
          </Typography>

          <Typography variant="h6" component="h2">
            {orderDetails.deliveryType} Location - {orderDetails.deliveryLocation}
          </Typography>

          <Typography variant="h6" component="h2">
            Additional Instruction - <span style={{color:"red"}}> {orderDetails.note} </span>
          </Typography>

        </CardContent>
        {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
      {
        isPending &&
        <button onClick={handleSubmit} style={{ margin: "10px",}} type="button" class="btn btn-outline-primary">Cancel Order</button>        
      }
      </Card>

    </div>
  )
}

// const mapStatsToProps = state => {
//     return {
//         rest_id : state.orders.rest_id
//     }    
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         resetCart: () => dispatch(resetCart()),
//         addToCart : (rest_id, dish_id, is_update) => dispatch(addToCart(rest_id, dish_id, is_update))
//     }
// }

export default OrderDetailPage
// export default connect(mapStatsToProps, mapDispatchToProps)(RestaurantDetails)