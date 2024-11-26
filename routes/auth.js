const express = require("express");
const router = express.Router();
const { SignUp , Login, resetPassword,fetctUser} = require('../controllers/auth'); 



router.post('/SignUp', SignUp)
router.post('/Login', Login)
router.post('/resetPassword', resetPassword)
router.get('/user', fetctUser)


module.exports = router;