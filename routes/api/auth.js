const express = require("express");
const authControllers = require('../../controllers/authControllers')
const authenticate = require("../../middlewares/authenticate");

const router = express.Router();


router.post("/register", authControllers.register)

router.post("/login", authControllers.login)

router.get('/current', authenticate, authControllers.getCurrent)

router.get('/logout', authenticate, authControllers.logout)



module.exports = router;