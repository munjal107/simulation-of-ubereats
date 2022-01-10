import RestaurantList from "../Restaurant.js/restaurantList"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { MDBCol, MDBContainer, MDBRow, MDBFormInline, MDBBtn } from "mdbreact";
import backendURL from "../../config"
import axios from "axios";
import { Link } from "react-router-dom";
import getToken from "../../utils";
// import { FormControl, DropdownButton, InputGroup, Dropdown } from "react-bootstrap";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  formControl: {
    margin: theme.spacing(3),
  },
  group: {
    margin: theme.spacing(1, 0),
  },
}));


const CustomerDashboard = (props) => {
  const classes = useStyles();

  const user_id = useSelector(state => state.user.user.id)
  const user_loc = useSelector(state => state.user.user.city)
  console.log("user_loc", user_loc)

  const [viewRestaurants, setViewRestaurants] = useState(true)
  const [searchBy, setSearchBy] = useState("dish")
  const [query, setQuery] = useState("")
  const [restList, setRestList] = useState([])
  const [allRestList, setAllRestList] = useState([])

  const [isQuery, setIsQuery] = useState(false)
  const [filterBy, setFilterBy] = useState('pickup and delivery');

  const handleViewRestaurants = () => {
    setViewRestaurants(!viewRestaurants)
  }

  const handleSearchChange = (e) => {
    setSearchBy(e.target.value)
  }

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('do validate');
      const data = {
        query: query,
        searchBy: searchBy
      }
      const token = getToken()
      axios.defaults.headers.common['authorization'] = token
      const url = backendURL + "/restaurant/getSearchResult"
      axios.post(url, data)
        .then(response => {
          setIsQuery(true)
          if (response.status == 200) {
            console.log("handle response:", response.data.data)
            setAllRestList(response.data.data)
            if (filterBy === 'pickup and delivery') {
              setRestList(response.data.data)

            } else {
              var new_list = response.data.data
              setRestList(new_list.filter(rest => rest.deliveryType === filterBy || rest.deliveryType ==='pickup and delivery' ))
            }
          }
        })
        .catch(err => {
          console.log("error...", err.response)
        })
    }
  }

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
    if (e.target.value === 'pickup and delivery') {
      setRestList(allRestList)
    } else {
      setRestList(allRestList.filter(rest => (rest.deliveryType === e.target.value || rest.deliveryType ==='pickup and delivery')))
    }
  }


  return (
    <div class="container">
      <MDBContainer style={{ margin: "15px" }}>
        <MDBRow>
          <MDBCol md="10">
            <MDBRow>

              <MDBCol md="5">
                <select onChange={handleSearchChange} class="form-select form-select-md mb-3" aria-label=".form-select-lg example">
                  <option selected value="dish">Search by Dish</option>
                  <option value="location">By Location</option>
                  <option value="cuisine">By Cuisine</option>
                  {/* <option value="3">Three</option> */}
                </select>

              </MDBCol>
              <MDBCol md="5">
                <input onChange={handleQueryChange} onKeyDown={handleKeyPress}
                  className={`form-control mr-sm-2 }`} required
                  type="text" placeholder="Search" aria-label="Search" />

              </MDBCol>

            </MDBRow>

          </MDBCol>
          <MDBCol md="2">
            {
              // !viewRestaurants && <Button onClick={handleViewRestaurants} variant="contained" color="primary" className={classes.button}>
              //   See Restaurants near you
              // </Button>
              <div>
                <Button style={{ left: "50%", width: "200px" }}
                  variant="contained" color="primary" className={classes.button}>
                  <Link style={{ textDecoration: "none", color: "#FFFFFF" }} to="/prevOrders">Previous Orders</Link>
                </Button>
              </div>
            }

          </MDBCol>

        </MDBRow>

        <MDBRow >
          <MDBCol md="5">
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Filter by </FormLabel>
              <RadioGroup
                aria-label="filter"
                name="filter"
                className={classes.group}
                value={filterBy}
                onChange={handleFilterChange}
              >
                <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
                <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
                <FormControlLabel value="pickup and delivery" control={<Radio />} label="Pickup and delivery" />

              </RadioGroup>
            </FormControl>
          </MDBCol>
          <MDBCol md="5">

          </MDBCol>

          <MDBCol md="2">

          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <div style={{ display: "block" }}>
        {(restList.length === 0 && isQuery &&
          <div>
            <h6 style={{ color: "red" }}>No Search Result</h6>
          </div>)

          ||

          (isQuery && restList.length > 0 && <div class="container">
            <h6 style={{ color: "red" }}>Search Result</h6>

            <div class="row">

              {restList.map((rest, index) => {

                return (
                  <div class="col-sm-4">
                    <div class="card" style={{ width: "18rem", margin: "20px", display: "flex" }}>
                      <div class="card-header">
                        {rest.deliveryType}
                      </div>
                      <Link to={`/restaurant/${rest._id}`} style={{ textDecoration: "none", color: "#000000" }}>
                        <img class="card-ig-topm" src={`${rest.profile_picture}`} width="285" height="240" alt="Card image cap" />

                        <div class="card-body">
                          <h5 class="card-title">{rest.name}</h5>
                          <p class="card-text">{rest.description}</p>
                          {/* <button onClick={handleAddToCart(dish.id)} class="btn btn-primary">Add to Cart</button> */}
                          {/* <button type="button" onClick={e => { handleAddToCart(dish.id) }} class="btn btn-outline-primary">Add to Cart</button> */}
                        </div>
                      </Link>

                      <div class="break">

                      </div>

                    </div>



                  </div>

                )



              })}


            </div>


          </div>)
        }


      </div>

      <div style={{ display: "block" }}>

        {
          viewRestaurants && !isQuery &&
          <div>
            <h6 style={{ color: "green" }}>
              Restaurants near you
            </h6><RestaurantList user_loc={user_loc} filterBy={filterBy} />

          </div>


        }
      </div>

    </div>
  )
}


export default CustomerDashboard