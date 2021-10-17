import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
// import { ModalProgressBar } from "../../../_metronic/_partials/controls";
// import { toAbsoluteUrl } from "../../../_metronic/_helpers";
// import * as auth from "../Auth";
import EditIcon from '@mui/icons-material/Edit';
import { updateRestaurantInfo } from "../../redux";
import Button from '@material-ui/core/Button';
import RestaurantDishes from "./restaurantDishes";
import axios from 'axios';
import backendURL from "../../config";
import useFetch from "../../useFetch";
import getToken from "../../utils";

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
}));




const RestaurantDashboard = (props) => {
  const abortController = new AbortController()

  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [onDataDelete, setOnDataDelete] = useState(false)

  const rest_id = localStorage.getItem("restaurant_id")
  // const { error, isPending, data: dishes } = useFetch(backendURL + `/restaurant/getDishes?id=${rest_id}` )
  const url = backendURL + `/restaurant/getDishes?id=${rest_id}`
  const token = getToken()
  axios.defaults.headers.common['authorization'] = token  
  
  useEffect(() => {
    fetch(url, {
      headers: {
        'Authorization': token
      },
      signal: abortController.signal
    })
      .then(res => {
        if (!res.ok) { // error coming back from server
          throw Error('could not fetch the data for that resource');
        }
        return res.json();
      })
      .then(data => {
        setIsPending(false);
        setData(data);
        setError(null);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log("fetch aborted")
        } else {
          setIsPending(false);
          setError(err.message);
        }
        // auto catches network / connection error

      })
    return () => {
      abortController.abort()
    }

  }, [onDataDelete])

  const dishes = data
  console.log("OUTSIDE DISHES", dishes)

  const classes = useStyles();

  const [loading, setloading] = useState(false);
  const [pic, setPic] = useState("");

  const [doUpdate, setDoUpdate] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const [viewDishes, setViewDishes] = useState(false)

  var user = JSON.parse(localStorage.getItem("user"))
  console.log("PROFILE USER", user)




  var initialValues = {
    restaurantname: user.Restaurant.name,
    description: user.Restaurant.description,
    city: user.city,
    contact: user.contact,
    email: user.email,
    startTime: user.Restaurant.startTime,
    endTime: user.Restaurant.endTime,
    user_id: user.id,
    address : user.address,
    restaurant_id: user.Restaurant.id,
  }




  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user.user, shallowEqual);


  const handleEditPress = (e) => {
    setDoUpdate(true)
    setIsDisabled(false)
  }
  // const handleCancelPress = (e) => {
  //     setDoUpdate(false)
  //     setIsDisabled(true)
  // }


  // Methods
  const saveUser = (values, setStatus, setSubmitting) => {
    setloading(true);
    const updatedUser = Object.assign(user, values);
    // user for update preparation
    dispatch(props.setUser(updatedUser));
    setTimeout(() => {
      setloading(false);
      setSubmitting(false);
      // Do request to your server for user update, we just imitate user update there, For example:
      // update(updatedUser)
      //  .then(()) => {
      //    setloading(false);
      //  })
      //  .catch((error) => {
      //    setloading(false);
      //    setSubmitting(false);
      //    setStatus(error);
      // });
    }, 1000);
  };
  // UI Helpers

  // const contactRegex = "^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$"
  const contactRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const Schema = Yup.object().shape({
    pic: Yup.string(),
    restaurantname: Yup.string().required("Restaurant name is required"),
    city: Yup.string().required("Location city cannot be empty"),
    description: Yup.string().required("Description is required"),
    address :  Yup.string().required("address is required"),
    contact: Yup.string().matches(contactRegex, "Contact number is incorrect").required("Contact is required"),
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Schema,

    onSubmit: (values, actions) => {
      // console.log("inside on submit:",values)
      const new_user = {
        ...user,
        Restaurant: {
          ...user.Restaurant,
          name: values.restaurantname,
          description: values.description,
          startTime: values.startTime,
          endTime: values.endTime
        },
        contact: values.contact,
        city: values.city,
        address : values.address
      }
      // console.log("inside on new submit:",new_user)

      dispatch(updateRestaurantInfo(new_user))
        .then((response) => {
          console.log("resonse update...", response.data.data)
          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(response.data.data));
          setDoUpdate(false)
          setIsDisabled(true)

        })
        .catch(err => {
          // console.log("user validated..",response.status, response.data)
          console.log("error...", err.response)
          // setError(err.response.data)
          // console.log("error obj", error)
        })
        actions.setSubmitting(false)
        actions.handleReset()
    },


    // get the original values back
    onReset: (values, { resetForm }) => {
      setDoUpdate(false)
      setIsDisabled(true)

      var user = JSON.parse(localStorage.getItem("user"))
      console.log("PROFILE USER", user)

      initialValues = {

        restaurantname: user.Restaurant.name,
        description: user.Restaurant.description,
        city: user.city,
        contact: user.contact,
        email: user.email,
        startTime: user.Restaurant.startTime,
        endTime: user.Restaurant.endTime,
        user_id: user.id,
        address : user.address,
        restaurant_id: user.Restaurant.id,
      }

    },

  });


  const getUserPic = () => {
    if (!pic) {
      return "none";
    }

    return `url(${pic})`;
  };


  const removePic = () => {
    setPic("");
  };

  return (
    <div>
      <form
        className="card card-custom card-stretch"
        onSubmit={formik.handleSubmit}
      >
        {/* {loading && <ModalProgressBar />} */}

        {/* begin::Header */}
        <div className="card-header py-3">
          <div className="card-title align-items-start flex-column">
            <h3 className="card-label font-weight-bolder text-dark">
              Restaurant Information
            </h3>

            <span className="text-muted font-weight-bold font-size-sm mt-1">

              {
                !doUpdate &&
                <div>
                  <Fab onClick={handleEditPress} color="secondary" aria-label="Edit" className={classes.fab}>
                    <EditIcon> </EditIcon>
                  </Fab>

                </div>
              }
              {doUpdate && <div> Update your personal informaiton</div>}
            </span>
          </div>

          {
            doUpdate && <div className="card-toolbar">
              <button
                type="submit"
                className="btn btn-success mr-2"
                disabled={
                  formik.isSubmitting || (formik.touched && !formik.isValid)
                }
              >
                Save Changes
                {formik.isSubmitting}
              </button>
              <button
                // to="/user-profile/profile-overview"
                onClick={formik.handleReset}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>

          }
        </div>
        {/* end::Header */}


        {/* begin::Form */}
        <div className="form">
          {/* begin::Body */}
          <div className="card-body">
            <div className="row">
              <label className="col-xl-3"></label>
              <div className="col-lg-9 col-xl-6">
                <h5 className="font-weight-bold mb-6">General Info</h5>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label">Avatar</label>
              <div className="col-lg-9 col-xl-6">
                <div
                  className="image-input image-input-outline"
                  id="kt_profile_avatar"

                >
                  <div
                    className="image-input-wrapper"
                    style={{ backgroundImage: `${getUserPic()}` }}
                  />
                  <label
                    className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                    data-action="change"
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Change avatar"
                  >
                    <i className="fa fa-pen icon-sm text-muted"></i>
                    <input
                      type="file"
                      // name="pic"
                      accept=".png, .jpg, .jpeg"
                    // {...formik.getFieldProps("pic")}
                    />
                    <input type="hidden" name="profile_avatar_remove" />
                  </label>
                  <span
                    className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                    data-action="cancel"
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Cancel avatar"
                  >
                    <i className="ki ki-bold-close icon-xs text-muted"></i>
                  </span>
                  <span
                    onClick={removePic}
                    className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                    data-action="remove"
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Remove avatar"
                  >
                    <i className="ki ki-bold-close icon-xs text-muted"></i>
                  </span>
                </div>
                <span className="form-text text-muted">
                  Allowed file types: png, jpg, jpeg.
                </span>
              </div>
            </div>
            <br></br>

            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label">
                Restaurant Name
              </label>
              <div className="col-lg-9 col-xl-6">
                <input
                  type="text"
                  placeholder="First name"
                  disabled={isDisabled}
                  className={`form-control form-control-lg form-control-solid ${getInputClasses(
                    "restaurantname"
                  )}`}
                  name="restaurantname"
                  {...formik.getFieldProps("restaurantname")}

                />
                {formik.touched.restaurantname && formik.errors.restaurantname ? (
                  <div className="invalid-feedback">
                    {formik.errors.restaurantname}
                  </div>
                ) : null}

              </div>
            </div>
            <br></br>

            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label">
                Description
              </label>
              <div className="col-lg-9 col-xl-6">
                <input
                  type="text"
                  placeholder="Restaurant Description"
                  disabled={isDisabled}
                  className={`form-control form-control-lg form-control-solid ${getInputClasses(
                    "description"
                  )}`}
                  name="description"
                  {...formik.getFieldProps("description")}
                />

                {formik.touched.description && formik.errors.description ? (
                  <div className="invalid-feedback">{formik.errors.description}</div>
                ) : null}

              </div>
            </div>
            <br></br>

            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label">
                Location
              </label>
              <div className="col-lg-9 col-xl-6">
                <input
                  type="text"
                  name="city"
                  placeholder="Restaurant Location"
                  disabled={isDisabled}
                  className={`form-control form-control-lg form-control-solid ${getInputClasses(
                    "city"
                  )}`}
                  {...formik.getFieldProps("city")}
                />

                {formik.touched.city && formik.errors.city ? (
                  <div className="invalid-feedback">{formik.errors.city}</div>
                ) : null}

              </div>
            </div>

            <br></br>

            <div className="row">
              <label className="col-xl-3"></label>
              <div className="col-lg-9 col-xl-6">
                <h5 className="font-weight-bold mt-10 mb-6">Contact Info</h5>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label">
                Phone
              </label>
              <div className="col-lg-9 col-xl-6">
                <div className="input-group input-group-lg input-group-solid">

                  <input
                    type="text"
                    placeholder="+1(123)112-1111"
                    disabled={isDisabled}
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                      "contact"
                    )}`}
                    name="contact"
                    {...formik.getFieldProps("contact")}
                  />
                  {formik.touched.contact && formik.errors.contact ? (
                    <div className="invalid-feedback">{formik.errors.contact}</div>
                  ) : null}
                </div>
                <span className="form-text text-muted">
                  We'll never share your phone with anyone else.
                </span>
              </div>
            </div>


            <br />

            <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              Address
            </label>
            <div className="col-lg-9 col-xl-6">
              <div className="input-group input-group-lg input-group-solid">
                
                <input
                  type="textarea"
                  disabled = {isDisabled}
                  className={`form-control form-control-lg form-control-solid ${getInputClasses(
                    "address"
                  )}`}
                  name="address"
                  {...formik.getFieldProps("address")}
                />
                {formik.touched.address && formik.errors.address ? (
                  <div className="invalid-feedback">{formik.errors.address}</div>
                ) : null}
              </div>
              
            </div>
          </div>

          <br/>


            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label">
                Start Time
              </label>
              <div className="col-lg-9 col-xl-6">
                <div className="input-group input-group-lg input-group-solid">

                  <input
                    type="time"
                    disabled={isDisabled}
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                      "startTime"
                    )}`}
                    name="startTime"
                    {...formik.getFieldProps("startTime")}
                  />
                  {formik.touched.startTime && formik.errors.startTime ? (
                    <div className="invalid-feedback">{formik.errors.startTime}</div>
                  ) : null}
                </div>

              </div>
            </div>

            <br />

            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label">
                Phone
              </label>
              <div className="col-lg-9 col-xl-6">
                <div className="input-group input-group-lg input-group-solid">

                  <input
                    type="time"
                    disabled={isDisabled}
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                      "endTime"
                    )}`}
                    name="endTime"
                    {...formik.getFieldProps("endTime")}
                  />
                  {formik.touched.endTime && formik.errors.endTime ? (
                    <div className="invalid-feedback">{formik.errors.startTime}</div>
                  ) : null}
                </div>

              </div>
            </div>

            

          </div>
          {/* end::Body */}
        </div>
        {/* end::Form */}

        <br />
        <br />
        <br />

      </form>

      <div>
        <div>

        <Button style={{ left: "50%", width: "200px" }} onClick={(e) => setViewDishes(!viewDishes)}
          variant="contained" color="primary" className={classes.button}>
          View/Add Dishes
        </Button>
        

        <Button style={{ left: "50%", width: "200px" }}
          variant="contained" color="primary" className={classes.button}>
          <Link style={{ textDecoration: "none", color:"#FFFFFF" }} to="/customerOrders">Go to Orders Page</Link>
        </Button>
        </div>

       

        {
          viewDishes &&

          <div className="home">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {dishes && <RestaurantDishes dishes={dishes} onDataDelete={onDataDelete} setOnDataDelete={setOnDataDelete} />}
          </div>

        }


        
      </div>

    </div>
  );
}

export default RestaurantDashboard;
// export default connect(null, auth.actions)(CustomerProfile);
