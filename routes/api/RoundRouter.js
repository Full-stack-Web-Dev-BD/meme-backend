const express = require('express');
const moment = require('moment/moment');
const Round = require('../../models/Round');
const RoundRouter = express.Router();
const multer = require("multer");

RoundRouter.post('/', (req, res) => {
    console.log(req.body)
    if (!req.body.id || !req.body.time) return res.json({ message: "Time & Owner ID required !!" })
    Round.find({
        owner: req.body.id
    })
        .then(round => {
            if (round.length < 1) { // it means he can create new    bcos no active  round 
                var expTime = moment(new Date()).add(req.body.time, "seconds").toDate()
                // var expTime = moment(new Date()).add(req.body.time, "minute").toDate()
                new Round({ owner: req.body.id, time: req.body.time, expTime: expTime })
                    .save()
                    .then(created => {
                        return res.json(created)
                    })
            } else {

                var lastRound = round[round.length - 1]
                var date = moment(lastRound.expTime)
                var now = moment();
                if (now > date) { //checking  if  any  active  round
                    // date is past
                    // var expTime = moment(new Date()).add(req.body.time, "minute").toDate()
                    var expTime = moment(new Date()).add(req.body.time, "seconds").toDate()
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

RoundRouter.get('/:id', (req, res) => {
    Round.findById({
        _id: req.params.id
    })
        .then(round => {
            return res.json(round)
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
            res.json(all.reverse())
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

// Perticipant
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now() + file.originalname}`);
    }
});
var upload = multer({ storage: storage });



RoundRouter.post("/upload", upload.single('file'), (req, res) => {
    if (!req.body.userID) {
        return res.json({ message: "User ID Requried", status: false })
    }
    if (!req.body.roundID) {
        return res.json({ message: "Round ID Required", status: false })
    }
    console.log(req.body)
    const { userID, roundID } = req.body
    if (!userID || !roundID) return res.json({ message: "User ID and Round ID is required !!" })
    Round.findOne({ _id: req.body.roundID })
        .then(round => {
            if (!round) return res.json({ message: "Round Not Finded ", status: false })
            if (round.perticipants.findIndex((obj) => obj.userID === req.body.userID) !== -1) {
                return res.json({ message: "You already  Perticipated in This Round !", status: false })
            } else {
                var newPerticipant = {
                    userID, roundID, meme: req.file.filename, user: JSON.parse(req.body.user),
                    vote: {
                        paidEsterEggsCount: 0,
                        paidRottenEggsCount: 0,
                        freeEsterEggsCount: 0,
                        freeRottenEggsCount: 0
                    }
                }
                var newRoundPerticipants = [...round.perticipants]
                newRoundPerticipants.push(newPerticipant)
                round.perticipants = newRoundPerticipants
                round.save()
                    .then(resp => {
                        res.json({ message: "Your Meme Added On List ", status: true, round: resp })
                    })
            }
        })
        .catch(err => {
            res.json(err)
        })
})
RoundRouter.post('/vote', (req, res) => {
    Round.findOne({ _id: req.body.id })
        .then(round => {
            if (!round) return res.json({ message: "Round  Not  Finded", status: false })
            var udpatePerticipants = [...round.perticipants]
            var index = udpatePerticipants.findIndex(p => p.userID == req.body.userID)
            round.perticipants[index].vote = {
                paidEsterEggsCount: parseInt(round.perticipants[index].vote.paidEsterEggsCount) + parseInt(req.body.paidEsterEggsCount),
                paidRottenEggsCount: parseInt(round.perticipants[index].vote.paidRottenEggsCount) + parseInt(req.body.paidRottenEggsCount),
                freeEsterEggsCount: parseInt(round.perticipants[index].vote.freeEsterEggsCount) + parseInt(req.body.freeEsterEggsCount),
                freeRottenEggsCount: parseInt(round.perticipants[index].vote.freeRottenEggsCount) + parseInt(req.body.freeRottenEggsCount),
            }
            round.save()
                .then(resp => {
                    Round.findByIdAndUpdate(req.body.id, resp)
                        .then(updated => {
                            res.json(updated)
                        })
                })
        })
        .catch(err => {
            console.log(err)
            return res.json(err)
        })
})
module.exports = RoundRouter;