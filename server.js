const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');

app.use(express.json());
app.set("view engine", "pug");
app.use(express.static(__dirname + '/public'));

const userSchema = require('./models/user-schema');
const workshopSchema = require('./models/workshop-schema');
const collectionSchema = require('./models/collection-schema');

mongoose.connect('mongodb://127.0.0.1/abdulHadi', { useNewUrlParser: true });

// Use the schemas to create the Workshop and Collection models
const User = mongoose.model('User', userSchema);
const Workshop = mongoose.model('Workshop', workshopSchema);
const Collection = mongoose.model('Collection', collectionSchema);

app.use(session({
    secret: 'some secret key here',
    resave: true,
    saveUninitialized: true
}));

let collectionRouter = require("./collection-router");
app.use("/collections", collectionRouter);
let workshopRouter = require("./workshop-router");
app.use("/workshops", workshopRouter);
let userRouter = require("./user-router");
app.use("/artists", userRouter);

app.use(function (req, res, next) {
    console.log(req.session);
    next();
});


//Respond with home page data if requested
app.get("/", (req, res, next) => {
    Collection.aggregate([{ $sample: { size: 10 } }], (error, collections) => {
        if (error) {
            // Handle any errors that may occur
            res.status(500).send(error);
        } else {
            res.render("index", { user: req.session.user, collections: collections });
            next();
        }
    });
});

app.get("/login", (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('login', { user: req.session.user });
        next();
    }
});

app.get("/register", (req, res, next) => {
    res.render("register", { user: req.session.user });
    next();
});

app.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    User.findOne({ username }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error: ' + err });
        } else if (!user) {
            res.status(401).send({ message: 'Error: Invalid username or password' });
        } else {
            // Check if the password matches
            if (user.password === password) {
                // Set the user data in the session
                req.session.user = user;
                res.send({ message: 'Login successful' });
                next();

            } else {
                res.status(401).send({ message: 'Error: Invalid username or password' });
            }
        }
    });
})

app.post('/register', (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username }, (err, user) => {
        if (err) {
            res.send({ message: 'Error: ' + err });
        } else if (user) {
            res.status(401).send({ message: 'Error: Username already exists' });
        } else {
            // Register the user using the provided username and password
            User.create({ username, password, isArtist: false, artworks: [] }, (err, user) => {
                if (err) {
                    res.send({ message: 'Error: ' + err });
                } else {
                    res.send({ message: 'Registration successful' });
                    next();
                }
            });
        }
    });
});


// Define a route for handling HTTP GET requests to the /:name URL
app.get('/upload', (req, res, next) => {
	res.render('upload', { user: req.session.user });
	next();
});

// Define the route handler
app.post('/upload', (req, res, next) => {
	// Create a new Collection based on the provided schema

	// Find the user who submitted the artwork
	User.findOne({ username: req.session.user.username }, (err, user) => {
		if (err) {
			// Handle any errors
			return res.send(err);
		}
		const collection = new Collection({
			artist: req.body.name,
			obj: user.id,
			name: req.body.name,
			style: req.body.style,
			date: Date.now(),
			medium: req.body.medium,
			description: req.body.description,
            source: req.body.link
		});

		// Save the new Collection to the database
		collection.save((err) => {
			if (err) {
				// Handle any errors
				return res.send(err);
			}
			// Push the id of the new Collection to the user's artworks array
			user.artworks.push(collection._id);

			// Save the updated user to the database
			user.save((err) => {
				if (err) {
					// Handle any errors
					return res.send(err);
				}

				// Return a success message
				return res.send('Artwork submitted successfully!');
                next();
			});
		});
	});
});

app.listen(3000);
console.log("Server listening at http://localhost:3000");
