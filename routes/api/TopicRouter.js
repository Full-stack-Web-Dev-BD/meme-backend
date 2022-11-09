const express = require('express');
const Topic = require('../../models/Topic');
const TopicRouter = express.Router();

TopicRouter.post('/', (req, res) => {
    Topic.findOne({ topicName: req.body.topicName })
        .then(topic => {
            if (topic) return res.json({ message: "Topic existing" })
            new Topic({ topicName: req.body.topicName })
                .save()
                .then(resp => {
                    return res.json(resp)
                })
                .catch(err => {
                    return res.json(err)
                })
        })
})


TopicRouter.get('/', async (req, res) => {
    var rooms = await Topic.find()
    res.json(rooms)
})

TopicRouter.get('/:topic', async (req, res) => {
    if (!req.params.topic) return res.json({ message: "Topic name  is requried to find a Topic " }).status(404)
    var topics = await Topic.findOne({ topicName: req.params.topic })
    if (topics) {
        res.json(topics)
    } else {
        res.json({})
    }
})

TopicRouter.delete('/:id', async (req, res) => {
    var deleted = await Topic.findByIdAndDelete(req.params.id)
    res.json(deleted)
})

module.exports = TopicRouter;