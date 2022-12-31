const mongoose = require('mongoose');

const userSchema = require('./models/user-schema');
const workshopSchema = require('./models/workshop-schema');
const collectionSchema = require('./models/collection-schema');

// Create the models for the collections
const User = mongoose.model('User', userSchema);
const Collection = mongoose.model('Collection', collectionSchema);
const Workshop = mongoose.model('Workshop', workshopSchema);

mongoose.connect('mongodb://127.0.0.1/abdulHadi', { useNewUrlParser: true });

//Get the default Mongoose connection (can then be shared across multiple files)
let db = mongoose.connection;
//We register events to listen to that connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

	for (let i = 0; i < 100; i++) {

		// Generate a random username and password
		const username = Math.random().toString(36).substring(2, 15);
		const password = Math.random().toString(36).substring(2, 15);

		// Create an instance of the User model with the random username and password
		const user = new User({
			username: username,
			password: password,
			isArtist: i < 50 ? false : true,
			artworks: []
		});

		if (user.isArtist) {

			// Use a for loop to execute the specified number of times
			for (let i = 0; i < Math.floor(Math.random() * (5 - 2 + 1) + 2); i++) {
				const seed = Math.random().toString(36).substring(2, 10);
				const width = Math.floor(Math.random() * (1920 - 1280 + 1) + 1280);
				const height = Math.floor(Math.random() * (1080 - 720 + 1) + 720);

				const collection = new Collection({
					artist: user.username,
					obj: user.id,
					name: Math.random().toString(36).substring(2, 10),
					style: Math.random().toString(36).substring(2, 10),
					date: generateRandomDate(),
					medium: Math.random().toString(36).substring(2, 10),
					description: Math.random().toString(36).substring(2, 10),
					source: `https://picsum.photos/seed/${seed}/${width}/${height}`,
					likes: 0
				})

				collection.save((err, user) => {
					if (err) {
						console.error('Error saving user:', err);
					} else {
						console.log('Collections saved successfully:', collection);
					}

				});

				user.artworks.push(collection);
			}
		}

		// Save the user to the database
		user.save((err, user) => {
			if (err) {
				console.error('Error saving user:', err);
			} else {
				console.log('User saved successfully:', user);
			}

		});

	}
});

function generateRandomDate() {
	const now = Date.now();

	const start = new Date(2010, 0, 1).getTime();

	const randomTime = Math.random() * (now - start) + start;

	const date = new Date(randomTime);

	return date;
}
