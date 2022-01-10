import { useParams } from "react-router"
import { useState, useEffect } from "react"
import axios from "axios"
import backendURL from "../../config"
import { connect } from "react-redux"
import { addToCart, resetCart } from "../../redux"
import Swal from 'sweetalert2'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { IconButton } from "@material-ui/core"
// import backendURL from "../../config"
import { Modal, Form, Button as Button1 } from "react-bootstrap";
// import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    dense: {
        marginTop: theme.spacing(2),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "50px"
    },
}));

const RestaurantDetails = (props) => {
    const classes = useStyles();

    const { id } = useParams()
    const [dishList, setDishList] = useState([])
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [isFav, setIsFav] = useState(false);
    const [foodType, setFoodType] = useState("none")
    const [isFavUpdated, setIsFavUpdated] = useState(false)


    // for cart modal
    const [showModal, setShowModal] = useState(false)
    const [cartQty, SetCartQty] = useState(0)
    const [currDish, setCurrDish] = useState({})

    useEffect(() => {
        const url = backendURL + `/restaurant/getDishes?id=${id}`
        console.log("URL:", url)

        const token = JSON.parse(localStorage.getItem("accessToken"))
        axios.defaults.headers.common['authorization'] = token

        axios.get(url)
            .then(response => {
                setIsPending(false)
                console.log("response data", response.data)
                setDishList(response.data.data)
                setIsFav(response.data.isFav)
                console.log(dishList)
            })
            .catch(err => {
                console.log("error", err.message)
                // setError(err.response.message)
            })
    }, [isFavUpdated])

    // add to cart func (modal)
    const handleShowCart = (dish) => {
        setCurrDish(dish)
        setShowModal(true)
    }

    const handleCloseCart = () => {
        setCurrDish({})
        setShowModal(false)
    }

    const handleIncrement = () => {
        // const new_val = cartQty + 1
        SetCartQty(cartQty + 1)
    }
    const handleDecrement = () => {
        const new_val = cartQty - 1 >= 0 ? cartQty - 1 : 0
        SetCartQty(new_val)
    }


    const handleFoodChange = (e) => {
        setFoodType(e.target.value)
        // console.log(e.target.value)
    }

    const handleAddToCart = (dish_id) => {
        console.log("dish id", dish_id, id)
        console.log("rest_id id", props.rest_id)
        console.log("cartQty ->", cartQty)

        if (props.rest_id === -1) {

            props.addToCart(id, dish_id, cartQty, false)
            setCurrDish({})
            SetCartQty(0)
            setShowModal(false)
        } else {
            if (props.rest_id != id) {
                Swal.fire({
                    title: 'Create New Order',
                    text: 'Your oder contains items from other Restaurant. Create a new order for this Restaurant',
                    showCancelButton: true,
                    confirmButtonText: 'Create New Order',
                }).then((result) => {
                    if (result.isConfirmed) {
                        props.resetCart()
                        props.addToCart(id, dish_id, cartQty, false)
                        setCurrDish({})
                        SetCartQty(0)
                        setShowModal(false)
                    }
                })
            } else {
                console.log("update card")
                props.addToCart(id, dish_id, cartQty, true)
                setCurrDish({})
                SetCartQty(0)
                setShowModal(false)

            }

        }
    }

    const handleFavoriteSubmit = () => {
        const token = JSON.parse(localStorage.getItem("accessToken"))
        axios.defaults.headers.common['authorization'] = token
        axios.defaults.withCredentials = true;
        const data = {
            rest_id: id
        }

        console.log("Add to fav rest id -> ", data)
        const url = backendURL + "/customer/fav/add"
        axios.post(url, data)
            .then(response => {
                console.log(response.data)
                setIsFavUpdated(!isFavUpdated)
            })
            .catch(err => {
                console.log(err.response)
            })
    }

    const handleRemoveFavoriteSubmit = () => {
        const token = JSON.parse(localStorage.getItem("accessToken"))
        axios.defaults.headers.common['authorization'] = token
        axios.defaults.withCredentials = true;
        const data = {
            rest_id: id
        }
        const url = backendURL + "/customer/fav/delete"
        axios.post(url, data)
            .then(response => {
                console.log(response.data)
                setIsFavUpdated(!isFavUpdated)

            })
            .catch(err => {
                console.log(err.response)
            })

    }

    return (
        <div className="container" style={{ display: "flex", flexWrap: "wrap" }}>
            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="agefood-helper">Food Type</InputLabel>
                    <Select
                        value={foodType}
                        onChange={handleFoodChange}
                        input={<Input name="foodType" id="food-helper" />}
                    >
                        <MenuItem value="none">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="veg">Veg</MenuItem>
                        <MenuItem value="non veg">Non Veg</MenuItem>
                        <MenuItem value="vegan">Vegan</MenuItem>
                    </Select>
                </FormControl>
            </div>





            <div>
                {
                    !isFav && <div>

                        <IconButton onClick={handleFavoriteSubmit} className={classes.button} aria-label="Star">
                            <StarIcon style={{ fill: "aqua" }} />
                        </IconButton>


                        <b>Add to Favroites</b>


                    </div>
                }


                {
                    isFav && <div>

                        <IconButton onClick={handleRemoveFavoriteSubmit} className={classes.button} aria-label="Star">
                            <StarIcon style={{ fill: "yellow" }} />
                        </IconButton>
                        <b>Remove from Favroites</b>


                    </div>
                }


            </div>

            <div class="row">



                {dishList.map((dish, index) => {

                    if (foodType === "none") {
                        return (
                            <div class="col-sm-4">
                                <div class="card" style={{ width: "18rem", margin: "20px", display: "flex" }}>
                                    <div class="card-header">
                                        {dish.type}
                                    </div>
                                    <img class="card-img-top" src={dish.image} width="285" height="240" alt="Card image cap" />
                                    <div class="card-body">
                                        <h5 class="card-title">{dish.name}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted"><b>Ingredients</b> - {dish.ingredients}</h6>
                                        <h6 class="card-subtitle mb-2 text-muted"><b>Cost</b> - {dish.price} $</h6>
                                        <p class="card-text">{dish.description}</p>
                                        {/* <button onClick={handleAddToCart(dish.id)} class="btn btn-primary">Add to Cart</button> */}
                                        <button type="button" onClick={e => { handleShowCart(dish) }} class="btn btn-outline-primary">Add to Cart</button>

                                        {/* <button type="button" onClick={e => { handleAddToCart(dish.id) }} class="btn btn-outline-primary">Add to Cart</button> */}
                                    </div>
                                    <div class="break"></div>

                                </div>

                            </div>

                        )
                    }
                    else {
                        if (dish.type === foodType) {
                            // var color = "#0ecf48"
                            // if(dish.type === "non veg"){
                            //     color="#f54251"
                            // }

                            return (
                                <div class="col-sm-4">
                                    <div class="card" style={{ width: "18rem", margin: "20px", display: "flex" }}>
                                        <div class="card-header">
                                            {dish.type}
                                        </div>
                                        <img class="card-img-top"  src={dish.image} width="285" height="240" alt="Card image cap" />
                                        <div class="card-body">
                                            <h5 class="card-title">{dish.name}</h5>
                                            <h6 class="card-subtitle mb-2 text-muted"><b>Ingredients</b> - {dish.ingredients}</h6>
                                            <h6 class="card-subtitle mb-2 text-muted"><b>Cost</b> - {dish.price} $</h6>
                                            <p class="card-text">{dish.description}</p>
                                            {/* <button onClick={handleAddToCart(dish.id)} class="btn btn-primary">Add to Cart</button> */}
                                            {/* <button type="button" onClick={e => { handleAddToCart(dish.id) }} class="btn btn-outline-primary">Add to Cart</button> */}
                                            <button type="button" onClick={e => { handleShowCart(dish) }} class="btn btn-outline-primary">Add to Cart</button>
                                        </div>
                                        <div class="break"></div>

                                    </div>

                                </div>

                            )
                        }
                    }


                }
                )}

            </div>

            <Modal show={showModal} onHide={handleCloseCart}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Dish</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <b>{currDish.name} </b>
                    <IconButton onClick={handleIncrement} className={classes.button} aria-label="Delete">
                        <AddIcon />
                    </IconButton>
                    <TextField
                        id="outlined-dense"
                        // label="Qty"
                        className={clsx(classes.textField, classes.dense)}
                        margin="dense"
                        disabled
                        value={cartQty}
                        variant="outlined"
                    />
                    <IconButton onClick={handleDecrement} className={classes.button} aria-label="Delete">
                        <RemoveIcon />
                    </IconButton>


                </Modal.Body>
                <Modal.Footer>
                    <Button1 variant="secondary" onClick={handleCloseCart}>
                        Cancel
                    </Button1>
                    <Button1 variant="primary" onClick={e => { handleAddToCart(currDish._id) }}>
                        Add to Cart
                    </Button1>
                </Modal.Footer>
            </Modal>


        </div>
    )
}

const mapStatsToProps = state => {
    return {
        rest_id: state.orders.rest_id
    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetCart: () => dispatch(resetCart()),
        addToCart: (rest_id, dish_id, qty, is_update) => dispatch(addToCart(rest_id, dish_id, qty, is_update))
    }
}

export default connect(mapStatsToProps, mapDispatchToProps)(RestaurantDetails)