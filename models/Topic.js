const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
	topicName: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Topic = mongoose.model('topic', TopicSchema);