//import the require dependencies
const express = require('express');
const userRoutes = require('./routes/userRoutes')
const restaurantRoutes = require('./routes/restaurantRoutes')
const customerRoutes = require('./routes/customerRoutes')
const {sequelize, db} = require('./models');
const cors = require('cors')
const session = require('express-session');
const config = require("./config/auth.config")
// const bodyParser = require('body-parser');
const app = express();

// const { checkAuth } = require("./config/chkauth")
// const passport = require('passport')
// app.use(passport.initialize())
// require("./config/passport")(passport)
// auth()

//use cors to allow cross origin resource sharing
app.use(cors({ origin: config.frontendURL, credentials: true  }));
// app.use(cors({ origin: 'http://localhost:3001', credentials: true  }));

// async function sync() {
//   await db.sequelize.sync({ foece: true });
// }
// sync().then((err) => console.log(err));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(session({
//   secret              : 'cmpe273_lab1',
//   resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
//   saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
//   duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
//   activeDuration      :  5 * 60 * 1000
// }));



// var verifyToken = require("./middleware/authJwt")
  
// app.get("/",verifyToken, (req, res) => {
//   res.send({
//     message:"Welcome",
//     data : req.user
//   })
// })

app.use("/user", userRoutes)
app.use("/restaurant", restaurantRoutes)
app.use("/customer", customerRoutes)
// app.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
//   console.log(req.user)
//   res.json({
//     msg:"success"
//   })
// })

//start your server on port 5500
const PORT = 5500;
app.listen(PORT, async () => {
  console.log('Server running on PORT', PORT)
  
  // await sequelize.sync({force : true})
  // await sequelize.sync({alter : true})
  await sequelize.sync()

  console.log('\n\nDatabase Connected!')
})


