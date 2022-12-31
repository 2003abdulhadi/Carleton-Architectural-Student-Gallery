// collection-schema.js
const mongoose = require('mongoose');

// Define the schema for the "collections" collection
const collectionSchema = new mongoose.Schema({
	artist: String,
	obj: mongoose.Schema.Types.ObjectId,
	name: String,
	style: String,
	date: Date,
	medium: String,
	description: String,
	source: String,
	likes: Number

});

// Export the schema
module.exports = collectionSchema;