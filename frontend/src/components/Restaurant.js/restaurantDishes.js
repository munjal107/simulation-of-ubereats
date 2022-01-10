import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import backendURL from '../../config';
import useFetch from '../../useFetch';
import { Modal, Form, Button as Button1 } from "react-bootstrap";
import axios from 'axios';
import Button from '@material-ui/core/Button';

import Swal from 'sweetalert2'
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
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
}));


const RestaurantDishes = ({ dishes, onDataDelete, setOnDataDelete }) => {

  // const rest_id = localStorage.getItem("restaurant_id")
  // console.log("rest_id",backendURL + `/restaurant/getDishes?id=${rest_id}`)
  // const { error, isPending, data: new_dishes } = useFetch(backendURL + `/restaurant/getDishes?id=${rest_id}` )

  const classes = useStyles();
  console.log("Rest dishes", dishes)
  console.log("Rest dishes type", dishes.data)

  if(dishes.data.length==0){
  console.log("indisde Rest dishes", dishes)

    dishes = []
  }else{
    dishes = dishes.data
  }

  const handleDelete = (dish_id) => {
    console.log("handleDelete", dish_id)

    const token = JSON.parse(localStorage.getItem("accessToken"))
    axios.defaults.headers.common['authorization'] = token
    axios.defaults.withCredentials = true;

    const url = backendURL + "/restaurant/delete/" + dish_id
    axios.delete(url)
        .then( response => {
          console.log("fetch delete response", response)
        setOnDataDelete(!onDataDelete)
        })
        .catch( err => {
          console.lof("Delete error=",err)
        })

    // fetch(, {
    //   method: "DELETE"
    // }).then(response => {
    //   console.log("fetch delete response", response)
    //   setOnDataDelete(!onDataDelete)
    // })

    console.log("Delete Success")
  }

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({
    name : "",
    ingredients : "",
    price : "",
    id : "",
    category : "",
    description : "",
    type: "",
    cuisine : ""
  })

  const [addData, setAddData] = useState({
    name : "",
    ingredients : "",
    price : "",
    id : "",
    category : "main course",
    description : "",
    type: "veg",
    cuisine : ""
  })

  const handleShowEditModal = (dish) => {
    console.log("dishes",dish)
    setEditData({
      name : dish.name,
      ingredients : dish.ingredients,
      price : dish.price,
      id : dish._id,
      category : dish.category,
      description : dish.description,
      type: dish.type,
      cuisine : dish.cuisine
    })
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
  }
  const handleValueChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name] : e.target.value
    })
  }


  const handleShowAddModal = () => {
    // console.log("dishes",dish)
    setShowAddModal(true)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
  }
  const handleAddValueChange = (e) => {
    setAddData({
      ...addData,
      [e.target.name] : e.target.value
    })
  }

  const handleAddSubmit = () => {
    console.log("submit", addData)
    const url = backendURL + "/restaurant/add/dish"

    const token = getToken()
    console.log("Token", token)
    axios.defaults.headers.common['authorization'] = token

    axios.post(url, addData)
      .then( response => {
        setAddData({
          name : "",
          ingredients : "",
          price : "",
          id : "",
          category : "main course",
          description : "",
          type: "veg",
          cuisine : ""
        })
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Add Success',
          showConfirmButton: false,
          timer: 1500
      })
        setShowAddModal(false)
        setOnDataDelete(!onDataDelete)
      })
      .catch( err => {
        console.log("Error....", err)
      })
  }



  const handleEditSubmit = () => {
    console.log("Edit submit", editData)
    const url = backendURL + "/restaurant/edit/dish"
    const token = getToken()
    axios.defaults.headers.common['authorization'] = token
    
    axios.post(url, editData)
      .then( response => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Update Success',
          showConfirmButton: false,
          timer: 1500
      })
        setShowEditModal(false)
        setOnDataDelete(!onDataDelete)
      })
      .catch( err => {
        console.log("Error....", err)
      })
  }

  return (
    <div className="container">
   
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="center">Ingredients</StyledTableCell>
              <StyledTableCell align="center">Description&nbsp;</StyledTableCell>
              <StyledTableCell align="center">Price&nbsp;(&#x24;)</StyledTableCell>
              <StyledTableCell align="center">Category&nbsp;</StyledTableCell>
              <StyledTableCell align="center">Type&nbsp;</StyledTableCell>
              <StyledTableCell align="center">Cuisine&nbsp;</StyledTableCell>
              <StyledTableCell align="center">Edit&nbsp;</StyledTableCell>
              <StyledTableCell align="center">Delete&nbsp;</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dishes.map(dish => (
              <StyledTableRow key={dish._id}>
                <StyledTableCell component="th" scope="row">
                  {dish.name}
                </StyledTableCell>
                <StyledTableCell align="left">{dish.ingredients}</StyledTableCell>
                <StyledTableCell align="left">{dish.description}</StyledTableCell>
                <StyledTableCell align="left">{dish.price}</StyledTableCell>
                <StyledTableCell align="left">{dish.category}</StyledTableCell>
                <StyledTableCell align="left">{dish.type}</StyledTableCell>
                <StyledTableCell align="left">{dish.cuisine}</StyledTableCell>

                <StyledTableCell align="left">
                  <Fab onClick={(e) => handleShowEditModal(dish)} color="primary" height="24px" width="24px" aria-label="Edit" className={classes.fab}>
                    <EditIcon> </EditIcon>
                  </Fab>

                </StyledTableCell>

                <StyledTableCell align="left">
                  <Fab color="primary" height="24px" width="24px"
                    aria-label="Edit" className={classes.fab}
                    onClick={(e) => handleDelete(dish._id)}
                  >
                    <DeleteIcon />

                  </Fab>

                </StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <br/>
      <Button style={{ left: "90%", width: "`180px" }} onClick={handleShowAddModal}
              variant="contained" color="primary" className={classes.button}>
              Add Dish
            </Button>



      {/* modal for edit */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add/Update Dish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input
              onChange={handleValueChange}
              value={editData.name}
                type="text"
                className="form-control"
                name="name"
                placeholder="name"
                required
              />
            </div>

            <div className="form-group">
              <label>ingredients</label>
              <input
              onChange={handleValueChange}
              value={editData.ingredients}
                type="text"
                className="form-control"
                name="ingredients"
                placeholder="ingredients"
                required
              />
            </div>

            <div className="form-group">
              <label>description</label>
              <input
              onChange={handleValueChange}
              value={editData.description}
                type="text"
                className="form-control"
                name="description"
                placeholder="description"
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
              onChange={handleValueChange}
              value={editData.price}
                className="form-control"
                name="price"
                placeholder="price"
                required
              />
            </div>

            <div className="form-group">
              <label>Meal Category</label>
              <select value={editData.category} onChange={handleValueChange} name="category" required class="form-select" aria-label="Default select example">
                <option value="appetizer" selected>Appetizer</option>
                <option value="salads">Salads</option>
                <option value="main course">Main Course</option>
                <option value="desserts">Desserts</option>
                <option value="beverages">Beverages</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dish Type</label>
              <select   value={editData.type} onChange={handleValueChange} required name="type" class="form-select" aria-label="Default select example">
                <option value="veg" selected>veg</option>
                <option value="vegan">Vegan</option>
                <option value="non veg">Non Veg</option>
              </select>
            </div>

            <div className="form-group">
              <label>Cuisine</label>
              <input
                type="text"
                onChange={handleValueChange}
                value={editData.cuisine}
                className="form-control"
                name="cuisine"
                placeholder="cuisine"
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button1 variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button1>
          <Button1 variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button1>
        </Modal.Footer>
      </Modal>




        {/* modal for add */}
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add/Update Dish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input
              onChange={handleAddValueChange}
              value={addData.name}
                type="text"
                className="form-control"
                name="name"
                placeholder="name"
                required
              />
            </div>

            <div className="form-group">
              <label>ingredients</label>
              <input
              onChange={handleAddValueChange}
              value={addData.ingredients}
                type="text"
                className="form-control"
                name="ingredients"
                placeholder="ingredients"
                required
              />
            </div>

            <div className="form-group">
              <label>description</label>
              <input
              onChange={handleAddValueChange}
              value={addData.description}
                type="text"
                className="form-control"
                name="description"
                placeholder="description"
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
              onChange={handleAddValueChange}
              value={addData.price}
                className="form-control"
                name="price"
                placeholder="price"
                required
              />
            </div>

            <div className="form-group">
              <label>Meal Category</label>
              <select value={addData.category} onChange={handleAddValueChange} name="category" required class="form-select" aria-label="Default select example">
                <option value="appetizer" selected>Appetizer</option>
                <option value="salads">Salads</option>
                <option value="main course">Main Course</option>
                <option value="desserts">Desserts</option>
                <option value="beverages">Beverages</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dish Type</label>
              <select   value={addData.type} onChange={handleAddValueChange} required name="type" class="form-select" aria-label="Default select example">
                <option value="veg" selected>veg</option>
                <option value="vegan">Vegan</option>
                <option value="non veg">Non Veg</option>
              </select>
            </div>

            <div className="form-group">
              <label>Cuisine</label>
              <input
                type="text"
                onChange={handleAddValueChange}
                value={addData.cuisine}
                className="form-control"
                name="cuisine"
                placeholder="cuisine"
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button1 variant="secondary" onClick={handleCloseAddModal}>
            Cancel
          </Button1>
          <Button1 variant="primary" onClick={handleAddSubmit}>
            Save Changes
          </Button1>
        </Modal.Footer>
      </Modal>


    </div>
  );
}

export default RestaurantDishes