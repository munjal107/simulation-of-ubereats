const express = require('express')
const userController = require("../controllers/userController")
const verifyToken = require('../middleware/authJWT')
const { upload } = require("../middleware/fileupload")

const router = express.Router();


router.post('/create', userController.create_user)
router.post('/login', userController.login)
// router.post('/update', userController.update_user)
// router.post('/update',verifyToken, upload.single("profile_picture"), userController.update_user)
router.post('/update', userController.update_user)

// to update rest
router.post('/updaterest',upload.single("profile_picture"), userController.update_userrest)

router.post('/test',verifyToken, userController.user_test)

// router.get("/current", userController.get_current)

module.exports = router;
