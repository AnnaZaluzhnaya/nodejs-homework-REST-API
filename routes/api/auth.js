const express = require("express");
const authControllers = require('../../controllers/authControllers')

const router = express.Router();

// signup
router.post("/register", authControllers.register)

// signin
router.post("/login", authControllers.login)


module.exports = router;