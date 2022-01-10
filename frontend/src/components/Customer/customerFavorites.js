import { useState, useEffect } from "react"
import backendURL from "../../config"
import axios from "axios"
import getToken from "../../utils"
// import { MDBCol, MDBContainer, MDBRow, MDBFormInline, MDBBtn } from "mdbreact";
// import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";



const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
  }));

const CustomerFavorites = (props) => {
    const classes = useStyles();

    const [restList, setRestList] = useState([])

    useEffect( () => {
        const url = backendURL + `/customer/fav/get`
        const token = getToken()
        axios.defaults.headers.common['authorization'] = token

        axios.get(url)
            .then(response => {
                console.log(response.data)
                setRestList(response.data.data)
            })
            .catch(err => {
                console.log("error", err.response)
                // setError(err.response.message)
            })
    },[])

    return (
        <div class="container">
            <div class="row">
                <h5 style={{marginTop:"15px", color:"Green"}}>Your Favroite Restaurants</h5>
            </div>
     
            <div class="row">

                {restList.map((rest, index) => {

                    return (
                        <div class="col-sm-4">
                            <div class="card" style={{ width: "18rem", margin: "20px", display: "flex" }}>
                                <div class="card-header">
                                    {rest.location}
                                </div>
                                <Link to={`/restaurant/${rest._id}`} style={{ textDecoration: "none", color: "#000000" }}>
                                    <img class="card-ig-topm" src={rest.profile_picture}  width="285" height="240" alt="Card image cap" />

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
        </div>
    )
}

export default CustomerFavorites