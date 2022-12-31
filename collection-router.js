
const express = require('express');
const mongoose = require('mongoose');
const collectionSchema = require('./models/collection-schema');
const Collection = mongoose.model('Collection', collectionSchema);
const userSchema = require('./models/user-schema');
const User = mongoose.model('User', userSchema);

let router = express.Router();

// Define a route for handling HTTP GET requests to the /images URL
router.get('/', (req, res, next) => {
	// Get the query parameters from the URL
	const { artist, style, name } = req.query;

	if (!(Boolean(artist) || Boolean(style) || Boolean(name))) {
		// Use the $or operator to search for collections with an artist, style, or name that either matches the query or is not specified
		Collection.find({}, (error, collections) => {
			if (error) {
				// Handle any errors that may occur
				res.status(500).send(error);
			} else {
				// Return the matching images as a JSON response
				res.render('collections', {
					user: req.session.user,
					collections: collections,
					query: { artist: '', style: '', name: '' },
				});
				next();
			}
		}
		);
	} else {
		// Use the $or operator to search for collections with an artist, style, or name that either matches the query or is not specified
		Collection.find(
			{
				$or: [
					{ artist: { $regex: artist } },
					{ artist: { $exists: false } },
					{ style: { $regex: style } },
					{ style: { $exists: false } },
					{ name: { $regex: name } },
					{ name: { $exists: false } },
				],
			},
			(error, collections) => {
				if (error) {
					// Handle any errors that may occur
					console.log(error);
					res.status(500).send(error);
				} else {
					res.render('collections', {
						user: req.session.user,
						collections: collections,
						query: req.query,
					});
					next();
				}
			}
		);
	}

});

// Define a route for handling HTTP GET requests to the /:name URL
router.get('/:name', (req, res, next) => {
	// Get the query parameters from the URL
	const { name } = req.params;

	// Search the "collections" collection for a document with the specified name
	Collection.findOne({ name: name }, (error, collection) => {
		if (error) {
			// Handle any errors that may occur
			res.status(500).send(error);
		} else {
			// Return the matching collection as a JSON response
			res.render('collection', { collection: collection, user: req.session.user });
			next();
		}
	});
});


//Export the router so it can be mounted in the main app
module.exports = router;
