const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
	user: {
		type: Object,
		require: true
	},
	room: {
		type: String,
		require: true
	},
	sms: {
		type: Object,
		require: true
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Chat = mongoose.model('chat', chatSchema);