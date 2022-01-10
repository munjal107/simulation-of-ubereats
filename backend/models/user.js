const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    firstname: {
        type : String,
        required : true
    },
    lastname: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    profile_picture: {
        type : String,
        default : ""
    },
    dob: {
        type : Date,
        required : true
    },
    type: {
        type : String,
        required : true
    },
    contact:{
        type : Number,
        required : true
    },
    address:{
        type : String,
        required : true
    },
    city: {
        type : String,
        required : true
    },
    state: {
        type : String,
        required : true
    },
    country: {
        type : String,
        required : true
    },
})

module.exports = mongoose.model('User', userSchema)