//import the require dependencies
const express = require('express');
const userRoutes = require('./routes/userRoutes')
const restaurantRoutes = require('./routes/restaurantRoutes')
const customerRoutes = require('./routes/customerRoutes')
// const {sequelize, db} = require('./models');
const cors = require('cors')
// const session = require('express-session');
const config = require("./config/auth.config")
const { getFileStream } = require("./middleware/S3")
// const bodyParser = require('body-parser');
const app = express();

// const { checkAuth } = require("./config/chkauth")
// const passport = require('passport')
// app.use(passport.initialize())
// require("./config/passport")(passport)
// auth()

//use cors to allow cross origin resource sharing
app.use(cors({ origin: config.frontendURL, credentials: true  }));


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// var verifyToken = require("./middleware/authJwt")
  
// app.get("/",verifyToken, (req, res) => {
//   res.send({
//     message:"Welcome",
//     data : req.user
//   })
// })


app.get('/images/:key', (req, res) => {
  console.log("iamge params::",req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})

const mongoose = require('mongoose');

app.use("/user", userRoutes)
app.use("/restaurant", restaurantRoutes)
app.use("/customer", customerRoutes)
// app.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
//   console.log(req.user)
//   res.json({
//     msg:"success"
//   })
// })


const main = async () => {
  const dbURI = `your mongodb uri`
  await mongoose.connect(dbURI)
}

//start your server on port 5500
const PORT = 5500;
app.listen(PORT, async () => {
  console.log('Server running on PORT', PORT)
  
  // await sequelize.sync({force : true})
  // await sequelize.sync({alter : true})
 // await sequelize.sync()
  // console.log('\n\nMySQL Database Connected!')

  main().then(() => console.log("MongoDB Database Connected..."));

})


