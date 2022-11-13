const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roundSchema = new Schema({
	room: {
		type: String,
		require: true
	},
	perticipants: {
		type: Array,
		default: []
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
	winner: {
		type: Object,
		default: {}
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Round = mongoose.model('round', roundSchema);