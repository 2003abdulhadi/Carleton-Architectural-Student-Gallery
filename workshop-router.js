
const express = require('express');
let router = express.Router();

//Requests for /products
//Specify three functions to handle in order
router.get("/", (req, res, next) => {
	res.render("workshops", { user: req.session.user });
	next();
});

//Export the router so it can be mounted in the main app
module.exports = router;
