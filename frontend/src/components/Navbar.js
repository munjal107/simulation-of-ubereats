
import React from 'react';
// import { useState } from "react";
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { connect } from 'react-redux'

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));


// main Function
const NavigationBar = (props) => {
  console.log("no of items...", props.no_of_items)
  const classes = useStyles();
  const [logoutSuccess, setLogoutSuccess] = React.useState(null);

  const [show, setShow] = React.useState(false)


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // get user type from local storage
  const userType = JSON.parse(localStorage.getItem("type"))
  console.log("Navbar-usertype", userType)
  if (userType === "customer") {
    var homeLink = <Link style={{ textDecoration: "none", color: "#000000" }} to="/customerDashboard">Dashboard</Link>
    var favLink = <Link style={{ textDecoration: "none", color: "#000000" }} to="/favorites">My Favorites</Link>
    var profileLink = <Link style={{ textDecoration: "none", color: "#000000" }} to="/customerProfile">Profile</Link>
    console.log("Navbar-usertype", profileLink)
  }
  if (userType === "restaurant") {
    var homeLink = <Link style={{ textDecoration: "none", color: "#000000" }} to="/restaurantDashboard">Dashboard</Link>
    var profileLink = <Link style={{ textDecoration: "none", color: "#000000" }} to="/restaurantDashboard">Profile</Link>
    var favLink = false
  }

  const handleLogout = () => {
    console.log("inside handle logout")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("type")
    localStorage.removeItem("username")
    setLogoutSuccess(<div className="alert alert-success" role="alert">logout Success</div>)
  }

  const handleShow = () => {
    setShow(true)
  }
  const handleClose = () => {
    setShow(false)
  }

  if (localStorage.getItem("accessToken")) {
    console.log("Navbar-Able to read token");
    var navLogin = (
      <Link style={{ textDecoration: "none", color: "#000000" }} to="/" onClick={handleLogout}><span className="glyphicon glyphicon-user"></span>Logout</Link>
    );
  } else {
    //Else display login button
    console.log("Not Able to read token");
    // handleLogout()
    navLogin = (
      <Link style={{ textDecoration: "none", color: "#000000" }} to="/"><span className="glyphicon glyphicon-log-in"></span> Login</Link>
    )
  }



  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{homeLink}</MenuItem>
      {
        favLink && favLink
      }
      <MenuItem onClick={handleMenuClose}>{profileLink}</MenuItem>
      <MenuItem onClick={handleMenuClose}>{navLogin}</MenuItem>
      


    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="Show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="Show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="Account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      {setLogoutSuccess}
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Open drawer"
          >
            <MenuIcon />
          </IconButton> */}
          <Typography className={classes.title} variant="h6" noWrap>
            UberEats
          </Typography>
          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'Search' }}
            />
          </div> */}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>

          <Link style={{ textDecoration: "none", color:"#FFFFFF" }} to="/orderConfirmation">
              <IconButton onClick={handleShow}  aria-label="Show 3 new mails" color="inherit">
                  <Badge badgeContent={props.no_of_items} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
          </Link>
          

            
            {/* <IconButton aria-label="Show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            <IconButton
              edge="end"
              aria-label="Account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="Show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>

      </AppBar>


      {/* <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={show}
                onClose={handleClose}
            >
                <div className={classes.paper}>
                    <h2>Simple React Modal</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi accumsan odio enim, non pharetra est ultrices et.
                    </p>
                </div>
            </Modal> */}
            

      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}


const mapStateToProps = state => {
  return {
    no_of_items : state.orders.no_of_items
  }
}


export default connect(mapStateToProps, null)(NavigationBar)