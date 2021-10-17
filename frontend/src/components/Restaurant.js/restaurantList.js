import { useState, useEffect } from "react";
import backendURL from "../../config"
import axios from "axios"
import { Link } from "react-router-dom";
import getToken from "../../utils";
// import backendURL from "../../config";

const RestaurantList = ({ user_loc, filterBy }) => {
    const abortController = new AbortController()

    const [restList, setRestList] = useState([])

    const url = backendURL + "/restaurant/getList"
    console.log(url)
    useEffect(() => {
        const token = getToken()
        console.log("Token", token)
        axios.defaults.headers.common['authorization'] = token

        axios.get(url,
            {
                signal: abortController.signal
            })
            .then(response => {
                console.log("REST list response", response.data.data)
                var data = response.data.data
                console.log("location", user_loc)
                console.log("REST LIST", restList)

                for (var i = 0; i < data.length; i++) {
                    console.log(i)
                    if (data[i].location === user_loc) {
                        var a = data.splice(i, 1);   // removes the item
                        data.unshift(a[0]);         // adds it back to the beginning
                        // break;
                    }
                }


                setRestList(data)
                console.log("REST LIST", data)

                console.log("REST LIST", restList)


            })
            .catch(err => {
                console.log(err.response)
            })

        return () => {
            abortController.abort()
        }

    }, [])



    return (
        <div class="container">
     
            <div class="row">

                {restList.map((rest, index) => {

                    return (
                        <div class="col-sm-4">
                            <div class="card" style={{ width: "18rem", margin: "20px", display: "flex" }}>
                                <div class="card-header">
                                    {rest.deliveryType}
                                </div>
                                <Link to={`/restaurant/${rest.id}`} style={{ textDecoration: "none", color: "#000000" }}>
                                    <img class="card-ig-topm" src={`${backendURL}${rest.profile_picture}`} alt="Card image cap" />

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

export default RestaurantList