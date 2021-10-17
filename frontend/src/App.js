// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login/login';
import NavigationBar from './components/Navbar';
// import Signin from './components/Login/signin';
import Home from './components/Home/home';
import { Provider } from 'react-redux'
import UserSignupPage from './components/Signup/usersignup';
// import CustomerProfile from './components/Customer/customerProfile';
import RestaurantSignup from './components/Signup/restaurantsignup';
import RestaurantDashboard from './components/Restaurant.js/restaurantdashboard';
import CustomerProfile from './components/Customer/customerProfile';
import CustomerDashboard from './components/Customer/customerDashboard';
import RestaurantDetails from './components/Restaurant.js/restaurantDetails';
import OrderConfirmation from './components/Orders/orderConfirmation';
// import store from './redux/store';

// import persistor from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from "./redux/store"
import OrderDetailPage from './components/Orders/orderDetailPage';
import CustomerOrders from './components/Orders/customerorders';
import ViewCustomerProfile from './components/Customer/viewcustomerprofile';
import CustomerFavorites from './components/Customer/customerFavorites';
import PrivateRoute from './privateRoutes';
import PrevOrders from './components/Orders/prevOrders';

const { store, persistor } = configureStore()
{/* <PrivateRoute
path="/registration/step2"
component={Step2}
roles={['USER']}
/> */}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <Router>
          <div className="App">
            <NavigationBar />

            <div className="content">

              <div class="container">

                <div class="row">
                  <div class="col-1">
                    <div>

                    </div>
                  </div>
                  <div class="col-11">
                    <Switch>

                      <Route exact path="/">
                        <Login />
                      </Route>

                      {/* <Route exact path="/home">
                                        <Home/>
                                </Route> */}
                      <Route path="/userSignup">
                        <UserSignupPage />
                      </Route>

                      <Route path="/restaurantSignup">
                        <RestaurantSignup />
                      </Route>

                      {/* <Route path="/customerProfile">
                                  <CustomerProfile/>
                                  
                                </Route> */}

                      <PrivateRoute
                        path="/customerProfile"
                        component={CustomerProfile}
                        roles={['customer']}
                      />


                      {/* <Route path="/restaurantDashboard">
                                  <RestaurantDashboard/>
                                </Route> */}
                      <PrivateRoute
                        path="/restaurantDashboard"
                        component={RestaurantDashboard}
                        roles={['restaurant']}
                      />

                      {/* <Route path="/customerDashboard">
                                  <CustomerDashboard/>
                                </Route> */}
                      <PrivateRoute
                        path="/customerDashboard"
                        component={CustomerDashboard}
                        roles={['customer']}
                      />

                      {/* <Route path="/restaurant/:id">
                                  <RestaurantDetails/>
                                </Route> */}
                      <PrivateRoute
                        path="/restaurant/:id"
                        component={RestaurantDetails}
                        roles={['customer']}
                      />



                      {/* <Route path="/orderConfirmation">
                                  <OrderConfirmation/>
                                </Route> */}
                      <PrivateRoute
                        path="/orderConfirmation"
                        component={OrderConfirmation}
                        roles={['customer']}
                      />

                      {/* <Route path="/orders/:id">
                                  <OrderDetailPage/>
                                </Route> */}
                      <PrivateRoute
                        path="/orders/:id"
                        component={OrderDetailPage}
                        roles={['customer', 'restaurant']}
                      />


                      {/* <Route path="/customerOrders">
                                  <CustomerOrders/>
                                </Route> */}
                      <PrivateRoute
                        path="/customerOrders"
                        component={CustomerOrders}
                        roles={['restaurant']}
                      />

                      {/* <Route path="/customer/view/:id">
                                  <ViewCustomerProfile/>
                                </Route> */}
                      <PrivateRoute
                        path="/customer/view/:id"
                        component={ViewCustomerProfile}
                        roles={['restaurant']}
                      />

                      {/* <Route path="/favorites">
                                  <CustomerFavorites/>
                                </Route> */}
                      <PrivateRoute
                        path="/favorites"
                        component={CustomerFavorites}
                        roles={['customer']}
                      />


                      <PrivateRoute
                        path="/prevOrders"
                        component={PrevOrders}
                        roles={['customer']}
                      />

                    </Switch>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </Router>
      </PersistGate>
    </Provider>


  );
}

export default App;
