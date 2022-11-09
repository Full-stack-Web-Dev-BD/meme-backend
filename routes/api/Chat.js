const express = require('express');
const Chat = require('../../models/Chat');
const ChatRouter = express.Router();

ChatRouter.get('/:roomName', async (req, res) => {
    if (!req.params.roomName) return res.json({ message: "Room Name requried" })
    var roomName = req.params.roomName.toLowerCase()
    console.log(roomName)
    var smsHistory = await Chat.find({ room: roomName })
    return res.json(smsHistory)
})


module.exports = ChatRouter;