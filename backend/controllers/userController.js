// const db = require('../models');
// const bcrypt = require("bcrypt");
// const session = require('express-session');
var jwt = require('jsonwebtoken');
var config = require('../config/auth.config')
// const {  checkAuth } = require("../config/chkauth")
// auth()

const { uploadFile } = require("../middleware/S3")

var kafka = require('../kafka/client');


const login = async (req, res) => {
    console.log("\n\nInside login user body", req.body)
    const obj = req.body

    kafka.make_request('PostUserLogin', req.body, function (err, results) {
        console.log('in result');
        console.log(results);
        if (err) {
            console.log("Inside err");
            res.json({
                status: "error",
                msg: "System Error, Try Again."
            })
        } else {
            console.log("Inside user create success->", results);

            if (results != null) {
                if (results === "Wrong Password") {
                    res.status(401).send({
                        message: results
                    })
                } else if (results === "Create Account First") {
                    res.status(401).send({
                        message: results
                    })
                } else {
                    res.status(200).send({
                        message: "Success",
                        data: results.data,
                        accessToken: results.accessToken
                    })
                }

            }



        }

    });

}


const create_user = async (req, res) => {
    var user = req.body;
    console.log("\nuser user:", user);
                        
    kafka.make_request('PostUserCreate1', req.body, function (err, results) {
        console.log('in result');
        console.log(results);
        if (err) {
            console.log("Inside err");
            res.json({
                status: "error",
                msg: "System Error, Try Again."
            })
        } else {
            console.log("Inside user create success->", results);
            if (results.success) {
                res.status(200).send({
                    message: "success",
                    data: results.data
                });
            } else {
                res.status(401).send({
                    msg: results.msg
                })
            }

            // res.json({
            //     updatedList:results
            // });

            // res.end();
        }

    });

    // res.send({
    //   data:"success!!"
    // })

};


const update_user = async (req, res) => {
    console.log("inside update")
    console.log("rest....-", req.body)

    var obj = req.body
    console.log("Update obj =>", obj)
    // console.log("Update obj =>", req.body)

    const file = req.file
    console.log("File..", file)
    // console.log("File..", obj)

    // const id = obj._id

    var pic = ""
    if (file) {
        pic = file.filename
        const uploadResult = await uploadFile(file)
        console.log("uploadResult=>", uploadResult, uploadResult['key'])
        // pic = uploadResult['key']
        pic = uploadResult['Location']
        const update_body = {
            ...obj,
            profile_picture: pic
        }

        kafka.make_request('PostUserUpdate', update_body, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                console.log("Inside err");
                res.json({
                    status: "error",
                    msg: "System Error, Try Again."
                })
            } else {
                console.log("Inside user create success->", results);
                res.status(200).send({
                    message: "success",
                    data: results.data
                });

            }

        });



    } else {
        console.log("no file->", req.body.data)
        kafka.make_request('PostUserUpdate', req.body, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                console.log("Inside err");
                res.json({
                    status: "error",
                    msg: "System Error, Try Again."
                })
            } else {
                if (results.success) {
                    console.log("Inside user create success->", results);
                    res.status(200).send({
                        message: "success",
                        data: results.data
                    });
                } else {
                    res.status(401).send({
                        msg: results.msg
                    });
                }


            }

        });

    }
}


const update_userrest = async (req, res) => {
    console.log("inside update_userrest")

    var obj = JSON.parse(req.body.data)

    console.log("Update obj =>", obj)
    // console.log("Update obj =>", req.body)

    const file = req.file
    console.log("File..", file)
    // console.log("File..", obj)

    // const id = obj._id

    var pic = ""
    if (file) {
        pic = file.filename
        const uploadResult = await uploadFile(file)
        console.log("uploadResult=>", uploadResult, uploadResult['key'])
        // pic = uploadResult['key']
        pic = uploadResult['Location']
        const update_body = {
            ...obj,
            profile_picture: pic,
            Restaurant:{
                ...obj.Restaurant,
                profile_picture: pic
            }
        }

        kafka.make_request('PostUserUpdate', update_body, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                console.log("Inside err");
                res.json({
                    status: "error",
                    msg: "System Error, Try Again."
                })
            } else {
                console.log("Inside user create success->", results);
                res.status(200).send({
                    message: "success",
                    data: results.data
                });

            }

        });



    } else {
        console.log("no file->", req.body.data)
        kafka.make_request('PostUserUpdate', obj, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                console.log("Inside err");
                res.json({
                    status: "error",
                    msg: "System Error, Try Again."
                })
            } else {
                if (results.success) {
                    console.log("Inside user create success->", results);
                    res.status(200).send({
                        message: "success",
                        data: results.data
                    });
                } else {
                    res.status(401).send({
                        msg: results.msg
                    });
                }


            }

        });


        // res.send({
        //     message: "success",
        // })
    }

}

const user_test = async (req, res) => {
    res.send(req.user)
}


// const get_current = (checkAuth, (req, res) => {
//   console.log("Success Success....")

//   console.log(req)

//   res.json({message:"success"})
// })

module.exports = {
    create_user,
    login,
    update_user,
    update_userrest,
    user_test
}