// user-schema.js
const mongoose = require('mongoose');

// Define the schema for the "users" collection
const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	isArtist: Boolean,
	artworks: [mongoose.Schema.Types.ObjectId],
	likes: [mongoose.Schema.Types.ObjectId],
	following: [mongoose.Schema.Types.ObjectId],
	workshops: [mongoose.Schema.Types.ObjectId]
});

// Export the schema
module.exports = userSchema;