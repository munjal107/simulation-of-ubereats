const express = require('express')
const verifyToken = require('../middleware/authJWT')
const customerController = require("../controllers/customerController")
const router = express.Router();


router.post('/getInfo',verifyToken, customerController.get_info)
router.post('/fav/add',verifyToken, customerController.add_fav)
router.get('/fav/get', verifyToken, customerController.get_favs)
router.post('/fav/delete', verifyToken, customerController.delete_fav)


module.exports = router;