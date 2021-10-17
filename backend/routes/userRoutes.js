const express = require('express')
const userController = require("../controllers/userController")
const verifyToken = require('../middleware/authJWT')

const router = express.Router();


router.post('/create', userController.create_user)
router.post('/login', userController.login)
router.post('/update',verifyToken, userController.update_user)
// router.get("/current", userController.get_current)

module.exports = router;
