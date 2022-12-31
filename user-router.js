const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('./models/user-schema');
const User = mongoose.model('User', userSchema);

//Used for generating random data

//Create the router
let router = express.Router();

router.get('/', (req, res, next) => {
	// Get the query parameters from the URL
	const name = req.query.name;
    if(!name){
        User.find({isArtist: true}, (error, artists) => {
            if (error) {
                // Handle any errors that may occur
                res.status(500).send(error);
            } else {
                res.render('artists', { user: req.session.user, artists: artists , name: name == undefined ? '' : name});
                next();
            }
        });
    }else{
        User.find({username: {$regex: name}, isArtist: true}, (error, artists) => {
            if (error) {
                // Handle any errors that may occur
                res.status(500).send(error);
            } else {
                res.render('artists', { user: req.session.user, artists: artists , name: name == undefined ? '' : name});
                next();
            }
        });
    }
	
});

router.get('/:id', (req, res, next) => {
    // Get the user ID from the URL parameter
    const name = req.params.id;
    // Find the user with the given ID
    User.findOne({username: name }, (err, account) => {
        if (err) {
            // Handle the error
            res.send({ message: 'Error: ' + err });
        } else if (!account) {
            // If no user was found, return a 404 error
            res.status(404).send({ message: 'Error: User not found' });
        } else {
			if(account.isArtist){
				res.render('artist', {account: account,  user: req.session.user  });
                next();
			}else{
				res.render('user', {account: account,  user: req.session.user  });
                next();
			}
        }
    });
});

//Export the router object, so it can be mounted in the store-server.js file
module.exports = router;
