const express = require('express');
const Room = require('../../models/Room');
const RoomRouter = express.Router();

RoomRouter.get('/', async (req, res) => {
    var rooms = await Room.find()
    res.json(rooms.reverse())
})

RoomRouter.get('/:roomName', async (req, res) => {
    var roomName = req.params.roomName.toLowerCase()
    var room = await Room.findOne({ roomName: roomName })
    if (room) {
        res.json(room)
    } else {
        res.json({})
    }
})
RoomRouter.post('/find', async (req, res) => {
    if (!req.body.roomName) return res.json({ message: "roomName is requried to find a room " }).status(400)
    var roomName = req.body.roomName.toLowerCase()
    var room = await Room.findOne({ roomName: roomName })
    if (room) {
        res.json(room)
    } else {
        res.json({})
    }
})

RoomRouter.delete('/:id', async (req, res) => {
    var deleted = await Room.findByIdAndDelete(req.params.id)
    res.json(deleted)
})

module.exports = RoomRouter;