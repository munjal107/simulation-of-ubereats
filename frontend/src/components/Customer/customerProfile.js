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
import { updateUserInfo } from "../../redux";


const useStyles = makeStyles(theme => ({
    fab: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }));

  

function RestaurantDashboard(props) {
  const classes = useStyles();

  const [loading, setloading] = useState(false);
  const [pic, setPic] = useState("");

  const [doUpdate, setDoUpdate] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
    
    var user = JSON.parse(localStorage.getItem("user"))
    console.log("PROFILE USER", user)

    var initialValues = {
      firstname : user.firstname,
      lastname : user.lastname,
      dob : new Date(user.dob).toISOString().split('T')[0],
      email : user.email,
      contact : user.contact,
      city : user.city,
      state : user.state,
      country : user.country,
      address : user.address
    }
  
    console.log("PROFILE USER", initialValues)



  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user.user, shallowEqual);
  

    const handleEditPress = (e) =>{
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
    // pic: Yup.string(),
    firstname: Yup.string().required("Firstname name is required"),
    lastname: Yup.string().required("Last name is required"),
    city : Yup.string().required("Location city cannot be empty"),
    state : Yup.string().required("Location state cannot be empty"),
    country : Yup.string().required("Location country cannot be empty"),
    contact: Yup.string().matches(contactRegex, "Contact number is incorrect").required("Contact is required"),
    // dob : Yup.date().required("data of birth is required")
    email : Yup.string().required('Email is required').email('Email is invalid'),
    address : Yup.string().required("Address is required")
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
      // const new_user = {
      //   ...user,
      //   firstname : initialValues.firstname,
      //   lastname : initialValues.lastname,
      //   dob : initialValues.dob,
      //   email  : initialValues.email,
      //   contact : initialValues.contact,
      //   city : initialValues.city,
      //   state : initialValues.state,
      //   country : initialValues.country,
      //   address : initialValues.address
      // }
      const new_user = {
        ...user,
        firstname : values.firstname,
        lastname : values.lastname,
        dob : values.dob,
        email  : values.email,
        contact : values.contact,
        city : values.city,
        state : values.state,
        country : values.country,
        address : values.address
      }
      console.log("inside on new submit:",new_user)
        
      dispatch(updateUserInfo(new_user))
        .then((response) => {
          console.log("response update...", response.data.data)
          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(response.data.data));
          setDoUpdate(false)
          setIsDisabled(true)
  
        })
        .catch( err => {
          // console.log("user validated..",response.status, response.data)
          console.log("error...", err.response)
          // setError(err.response.data)
          // console.log("error obj", error)
        })
    },


    // get the original values back
    onReset: (values, { resetForm }) => {
        setDoUpdate(false)
        setIsDisabled(true)

        var user = JSON.parse(localStorage.getItem("user"))
        console.log("PROFILE USER", user)
    
        initialValues = {
          firstname : user.firstname,
          lastname : user.lastname,
          dob : new Date(user.dob).toISOString().split('T')[0],
          email : user.email,
          contact : user.contact,
          city : user.city,
          state : user.state,
          country : user.country,
          address : user.address
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
    <form
      className="card card-custom card-stretch"
      onSubmit={formik.handleSubmit}
    >
      {/* {loading && <ModalProgressBar />} */}

      {/* begin::Header */}
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
          <h3 className="card-label font-weight-bolder text-dark">
            Customer Information
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
            { doUpdate && <div> Update your personal informaiton</div> }
          </span>
        </div>

        {
            doUpdate &&           <div className="card-toolbar">
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
              First Name
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="text"
                placeholder="First name"
                disabled = {isDisabled}
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "firstname"
                )}`}
                name="firstname"
                {...formik.getFieldProps("firstname")}

              />
              {formik.touched.firstname && formik.errors.firstname ? (
                <div className="invalid-feedback">
                  {formik.errors.firstname}
                </div>
              ) : null}

            </div>
          </div>
          <br></br>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              Last Name
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="text"
                placeholder="Last Name"
                disabled = {isDisabled}
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "lastname"
                )}`}
                name="lastname"
                {...formik.getFieldProps("lastname")}
              />

              {formik.touched.lastname && formik.errors.lastname ? (
                <div className="invalid-feedback">{formik.errors.lastname}</div>
              ) : null}

            </div>
          </div>
          <br></br>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
                  DOB
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="date"
                name="dob"
                disabled = {isDisabled}
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "dob"
                )}`}
                value={initialValues.dob}
                {...formik.getFieldProps("dob")}
              />

              {formik.touched.dob && formik.errors.dob ? (
                  <div className="invalid-feedback">{formik.errors.dob}</div>
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
                  disabled = {isDisabled}
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


          <br/>
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
              City
            </label>
            <div className="col-lg-9 col-xl-6">
              <div className="input-group input-group-lg input-group-solid">
                
                <input
                  type="text"
                  disabled = {isDisabled}
                  className={`form-control form-control-lg form-control-solid ${getInputClasses(
                    "city"
                  )}`}
                  name="city"
                  {...formik.getFieldProps("city")}
                />
                {formik.touched.city && formik.errors.city ? (
                  <div className="invalid-feedback">{formik.errors.city}</div>
                ) : null}
              </div>
              
            </div>
          </div>

          <br/>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              State
            </label>
            <div className="col-lg-9 col-xl-6">
              <div className="input-group input-group-lg input-group-solid">
                
                <input
                  type="text"
                  disabled = {isDisabled}
                  className={`form-control form-control-lg form-control-solid ${getInputClasses(
                    "state"
                  )}`}
                  name="state"
                  {...formik.getFieldProps("state")}
                />
                {formik.touched.state && formik.errors.state ? (
                  <div className="invalid-feedback">{formik.errors.state}</div>
                ) : null}
              </div>
              
            </div>
          </div>

          <br/>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              Country
            </label>
            <div className="col-lg-9 col-xl-6">
              <div className="input-group input-group-lg input-group-solid">

              <select  id="country"
                    disabled = {isDisabled}
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                      "country"
                    )}`}
                    name="country"
                    {...formik.getFieldProps("country")}
                >
                  <option value="USA">USA</option>
                  <option value="INDIA">INDIA</option>
              </select>
                
                
                {formik.touched.country && formik.errors.country ? (
                  <div className="invalid-feedback">{formik.errors.country}</div>
                ) : null}
              </div>
              
            </div>
          </div>
        
        
        </div>
        {/* end::Body */}
      </div>
      {/* end::Form */}
    </form>
  );
}

export default RestaurantDashboard;
// export default connect(null, auth.actions)(CustomerProfile);
