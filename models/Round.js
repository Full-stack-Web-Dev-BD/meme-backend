const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roundSchema = new Schema({
	room: {
		type: String,
		require: true
	},
	time: {
		type: Number,
		require: true
	},
	expTime: {
		type: Number,
		require: true
	},
	owner: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Round = mongoose.model('round', roundSchema);