// workshop-schema.js
const mongoose = require('mongoose');

// Define the schema for the "workshops" collection
const workshopSchema = new mongoose.Schema({
	artist: String,
	name: String,
	description: String,
	date: Date,
	enrolled: Number
});

// Export the schema
module.exports = workshopSchema;