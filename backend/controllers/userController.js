const db = require('../models');
const bcrypt = require("bcrypt");
const session = require('express-session');
var jwt = require('jsonwebtoken');
var config = require('../config/auth.config')
// const {  checkAuth } = require("../config/chkauth")
// auth()



const login = async (req, res) => {
  console.log("\n\ninside login user body", req.body)
  const obj = req.body
  email = obj.email
  try {
    // var user = await db.User.findOne({where: { email:email }})

    var user = await db.User.findOne(
      {
        where: {
          email: email
        }, include: db.Restaurant
      })

    // no user found
    if (!user) {
      return res.status(401).send({ message: "User Not found." });
    }
    console.log("user user", user.dataValues)

    // const validPassword = await bcrypt.compare(obj.password, user.password);

    var validPassword = bcrypt.compareSync(
      obj.password,
      user.password
    );

    if (validPassword) {

      // res.cookie('cookie',user.email,{maxAge: 900000, httpOnly: false, path : '/'});
      // req.session.user = user;

      const payload = {
        id: user.id,
        email: user.email
      }
      var token = jwt.sign(payload, config.secret, {
        expiresIn: 100800 // in seconds
      });

      // console.log("\n\nUSERUSER",JSON.stringify(user))
      // user = JSON.stringify(user)
      user = {
        ...user.dataValues,
        password: undefined
      }
      console.log("\n\n user datavalues", user)

      // if(user.type=='restaurant'){
      //   var user = await db.User.findOne(
      //     {  
      //      where: { 
      //        email:email
      //      }, include: db.Restaurant
      // })
      //   console.log("NEW USER = ", user)
      // }

      res.status(200).send({
        message: "success",
        data: user,
        accessToken: "JWT " + token
      })
    } else {
      // res.status(401).send({ message: "Password do not match" });
      res.status(401).send({
        message: "Password do not match"
      });


    }

  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Something went wrong' })
  }
  //   res.send("success")
}


const create_user = async (req, res) => {
  var user = req.body;
  console.log("\nuser user:", user);

  const validation = db.User.schema.validate(user);
  if (!validation.error) {
    try {
      console.log("\n\n:user email->", user.email)
      var is_User = await db.User.findOne({ where: { email: user.email } })
      console.log("\nIS USER:", is_User)

      if (is_User != null) {
        res.status(401).send({
          message: "User already exists"
        })
      } else {

        // generate salt to hash password
        const salt = await bcrypt.genSaltSync(10);
        // now we set user password to hashed password
        user.password = await bcrypt.hashSync(user.password, salt);


        var dbuser = await db.User.create(user);

        if (user.type === 'restaurant') {
          const restaurant = {
            name: user.name,
            description: user.description,
            startTime: user.startTime,
            endTime: user.endTime,
            location: user.city,
            deliveryType: user.deliveryType,
            address: user.address
          }

          console.log("restaurant....", restaurant)
          const dbrestaurant = await db.Restaurant.create({ ...restaurant, userId: dbuser.id });
        }

        dbuser = {
          ...dbuser,
          password: null
        }


        // console.log("user added success:",get_user);
        res.status(200).send({
          message: "success"
        });
      }

    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(500).json({ err: validation.error });
  }

  // const validation = db.User.schema.validate(user);


};


const update_user = async (req, res) => {
  const obj = req.body
  // const id = obj.id

  if (obj.type === "restaurant") {
    console.log("restaurant")
    const update_body = obj

    await db.User.update(
      { ...update_body },
      { where: { id: update_body.id } })

    await db.Restaurant.update(
      { ...update_body.Restaurant },
      { where: { id: update_body.Restaurant.id } }
    )
    var updated_user = await db.User.findOne({ where: { id: update_body.id }, include: db.Restaurant })
    updated_user = {
      ...updated_user.dataValues,
      password: null
    }
    console.log("\n\n\nupdated=>", updated_user)
    res.status(200).send({
      data: updated_user,
    })

  } else {

    console.log("user object found", obj)

    try {
      var user = await db.User.findOne({ where: { id: id } })
      // console.log("user object found", user)
      for (const key in obj) {
        if (key != 'id') {
          user[key] = obj[key]
        }

      }
      // console.log("new user object found", user)

      await user.save()
      console.log("\n\nUPdate Successful")

      return res.status(200).send({
        data: user
      })


    } catch (err) {
      console.log(err)
      res.status(401).send(err)
    }

  }


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
}