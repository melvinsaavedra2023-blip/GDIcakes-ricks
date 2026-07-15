const express = require("express");

const router = express.Router();

const {

    loginGoogle

} = require("../controllers/googleController");

router.post("/google", loginGoogle);

module.exports = router;