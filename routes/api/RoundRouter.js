const express = require('express');
const moment = require('moment/moment');
const Round = require('../../models/Round');
const RoundRouter = express.Router();


RoundRouter.post('/', (req, res) => {
    console.log(req.body)
    if (!req.body.id || !req.body.time) return res.json({ message: "Time & Owner ID required !!" })
    Round.find({
        owner: req.body.id
    })
        .then(round => {
            if (round.length < 1) {
                var expTime = moment(new Date()).add(req.body.time, "minute").toDate()
                new Round({ owner: req.body.id, time: req.body.time, expTime: expTime })
                    .save()
                    .then(created => {
                        return res.json(created)
                    })
            } else {
                var lastRound = round[round.length - 1]
                var date = moment(lastRound.expTime)
                var now = moment();
                if (now > date) {
                    // date is past
                    var expTime = moment(new Date()).add(req.body.time, "minute").toDate()
                    new Round({ owner: req.body.id, time: req.body.time, expTime: expTime })
                        .save()
                        .then(created => {
                            console.log(created)
                            return res.json(created)
                        })
                } else {
                    // date is future
                    return res.json({ message: "Round Existing" })
                }
            }
        })
        .catch(err => {
            return res.json(err)
        })
})


RoundRouter.get('/active-round/:id', (req, res) => {
    Round.find({
        owner: req.params.id
    })
        .then(round => {
            if (round.length < 1) {
                return res.json({ message: " No Active Round Existing for You", status: false })
            } else {
                var lastRound = round[round.length - 1]
                var date = moment(lastRound.expTime)
                var now = moment();
                if (now > date) {
                    // date is past 
                    return res.json({ message: " No Active Round Existing for You", status: false })
                } else {
                    // date is future
                    return res.json({ round: lastRound, status: true })
                }
            }
        })
        .catch(err => {
            return res.json(err)
        })
})

RoundRouter.get('/all/:id', (req, res) => {
    Round.find({
        owner: req.params.id
    })
        .then(rounds => {
            return res.json(rounds)
        })
        .catch(err => {
            return res.json(err)
        })
})
RoundRouter.get('/', (req, res) => {
    Round.find()
        .then(all => {
            res.json(all)
        })
        .catch(err => {
            res.json(err)
        })
})
RoundRouter.delete("/:id", (req, res) => {
    Round.findByIdAndDelete(req.params.id)
        .then(deleted => {
            if (deleted) {
                return res.json(deleted)
            } else {
                return res.json({ message: "Record Not Finded !!" })
            }
        })
        .catch(err => {
            res.json(err)
        })
})
module.exports = RoundRouter;