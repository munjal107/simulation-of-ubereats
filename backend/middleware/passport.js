const JwtStrategy = require('passport-jwt').Strategy
const  ExtractJwt = require('passport-jwt').ExtractJwt
// const passport = require('passport')
const config = require('./auth.config')

var user = {
        email : "m1@gmail.com",
        password : "hello"
    }

const secret_key = config.secret
var opts = { }
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt"),
opts.secretOrKey = secret_key

// sample token -> generate token
// JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJtMUBnbWFpbC5jb20iLCJpYXQiOjE2MzUwMzQ4MDEsImV4cCI6MTYzNTEzNTYwMX0.W87cnElk3pALWtbtdvxFGGQ4jhMSLDrS5LmdkIIDU08

module.exports = (passport) => {
    passport.use( new JwtStrategy(opts,async (jwt_payload, callback) => {
            const email = jwt_payload.email;
            console.log(email, jwt_payload)
            if(user.email === email){
                console.log("email correct")
                return callback(null, user)
            }else{
                console.log("email incorrect")
                return callback(null, false)
            }
            // return callback(null, false, { message: 'Something went wrong trying to authenticate' });
        })
    );
}

// exports.checkAuth = passport.authenticate("jwt", { session: false });
// module.exports = passport.authenticate("jwt", { session: false });


// initialize passport in app.js
// const passport = require('passport')
// app.use(passport.initialize())
// require('./middleware/passport')(passport)