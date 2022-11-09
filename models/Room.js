const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoomSchems = new Schema({
	roomName: {
		type: String,
		require: true
	},
	perticipant: {
		type: Array,
		default: []
	},
	topic: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Room = mongoose.model('room', RoomSchems);