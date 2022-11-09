const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	avatar: {
		type: String
	},
	userType: {
		type: String,
		default: 'user'
	},
	country: {
		type: String,
	},
	language: {
		type: String,
	},
	city: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = User = mongoose.model('users', userSchema);