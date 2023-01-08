const express = require('express');
const moment = require('moment/moment');
const Round = require('../../models/Round');
const RoundRouter = express.Router();
const multer = require("multer");
const User = require('../../models/User');

RoundRouter.post('/', (req, res) => {
    if (!req.body.id || !req.body.time || !req.body.room) return res.json({ message: "Time, Room Name  & Owner ID required !!" })
    Round.find({
        room: req.body.room
    })
        .then(round => {
            if (round.length < 1) { // it means he can create new  round , bcos  there is not round existing 
                console.log('creating room with ', req.body)
                var expTime = moment(new Date()).add(req.body.time, "minutes").toDate()
                new Round({
                    owner: req.body.id,
                    time: req.body.time,
                    expTime: expTime,
                    room: req.body.room
                })
                    .save()
                    .then(created => { 
                        return res.json({status:true , round :created})
                    })
            } else {
                var lastRound = round[round.length - 1]
                var date = moment(lastRound.expTime)
                var now = moment();
                if (now > date) { //if not have   any  active  round-creating  a new round
                    var expTime = moment(new Date()).add(req.body.time, "minutes").toDate()
                    new Round({ 
                         owner: req.body.id,
                         time: req.body.time,
                         expTime: expTime,
                         room:req.body.room,
                         winner: {} 
                        })
                        .save()
                        .then(created => {  
                            return res.json({status:true,round: created})
                        })
                } else {
                    // date is future
                    console.log("Active round existing  ")
                    return res.json({ message: "Round Existing" , status:false}).status(400)
                }
            }
        })
        .catch(err => {
            return res.json(err)
        })
})


RoundRouter.post('/active-round', (req, res) => {
    Round.find({room:req.body.room})
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
RoundRouter.get("/totalround", (req, res) => {
    Round.find()
        .then(all => {
            res.json({ message: "success", total: all.length })
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
            return res.json(rounds.reverse())
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
    const { userID, roundID } = req.body
    if (!userID || !roundID) return res.json({ message: "User ID and Round ID is required !!" })
    Round.findOne({ _id: req.body.roundID })
        .then(round => {
            if (!round) return res.json({ message: "Round Not Finded ", status: false })
            if (round.perticipants.findIndex((obj) => obj.userID === req.body.userID) !== -1) {
                return res.json({ message: "You already  Perticipated in This Round !", status: false })
            } else {
                var newPerticipant = {
                    userID, roundID, meme: req.file ? req.file.filename : req.body.fileName, user: JSON.parse(req.body.user),
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
                        res.json({ message: "Your Meme Added On List ", status: true, file: req.file ? req.file.filename : req.body.filename, round: resp })
                    })
            }
        })
        .catch(err => {
            res.json(err)
        })
})
RoundRouter.post('/vote', (req, res) => {
    User.findById({ _id: req.body.userID })
        .then(user => {
            if (user) {
                if (!req.body.paidEsterEggs || !req.body.paidRottenEggs) {
                    return res.json({ message: "Paid Amount required !!", status: false, error: { message: "Paid Amount requried" } })
                }
                var error = {}
                if (user.balance.paidEsterEggs < req.body.paidEsterEggs) {
                    error.paidEsterEggs = "Ester Eggs Sufficient Balance !"
                }

                if (user.balance.paidRottenEggs < req.body.paidRottenEggs) {
                    error.paidRottenEggs = "Rotten Eggs Sufficient Balance !"
                }
                if (Object.keys(error).length > 0) {
                    return res.json({ message: "Not have Enough Balance", status: false, error: error })
                } else {
                    var updatedUser = user
                    updatedUser.balance.paidEsterEggs = updatedUser.balance.paidEsterEggs - req.body.paidEsterEggs
                    updatedUser.balance.paidRottenEggs = updatedUser.balance.paidRottenEggs - req.body.paidRottenEggs
                    User.findByIdAndUpdate(req.body.userID, updatedUser, { new: true })
                        .then(balanceUpdate => {
                            Round.findOne({ _id: req.body.id })
                                .then(round => {
                                    if (!round) return res.json({ message: "Round  Not  Finded", status: false })
                                    var udpatePerticipants = [...round.perticipants]
                                    var index = udpatePerticipants.findIndex(p => p.userID == req.body.userID)
                                    if (index < 0) return res.json({ message: "You are not  Authorized to  Vote", status: false })
                                    round.perticipants[index].vote = {
                                        paidEsterEggsCount: parseInt(round.perticipants[index].vote.paidEsterEggsCount) + req.body.paidEsterEggs ? parseInt(req.body.paidEsterEggs) : 0,
                                        paidRottenEggsCount: parseInt(round.perticipants[index].vote.paidRottenEggsCount) + req.body.paidRottenEggs ? parseInt(req.body.paidRottenEggs) : 0,
                                        // freeEsterEggsCount: parseInt(round.perticipants[index].vote.freeEsterEggsCount) + parseInt(req.body.freeEsterEggsCount),
                                        // freeRottenEggsCount: parseInt(round.perticipants[index].vote.freeRottenEggsCount) + parseInt(req.body.freeRottenEggsCount),
                                    }
                                    round.save()
                                        .then(resp => {
                                            Round.findByIdAndUpdate(req.body.id, resp)
                                                .then(updated => {
                                                    res.json({ updated, status: true })
                                                })
                                        })
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            return res.json({ message: "Unexpected Error", err, status: false })
                        })
                }
            } else {
                return res.json({ message: "You are not authorize to Vote", status: false })
            }
        })
})
RoundRouter.get("/winner/:id", (req, res) => {
    Round.findById({ _id: req.params.id })
        .then(round => {
            if (Object.keys(round.winner).length > 0) {
                console.log("pre detected winner is ", round.winner)
                return res.json(round.winner)
            } else {
                var perticipants = round.perticipants
                if (perticipants.length > 0) {
                    var winner = perticipants[0]
                    for (var i = 1; i < perticipants.length; i++) {
                        var winnerTotalEggs = winner.vote.paidEsterEggsCount - winner.vote.paidRottenEggsCount
                        var thisTotalEggs = perticipants[i].vote.paidEsterEggsCount - perticipants[i].vote.paidRottenEggsCount
                        if (thisTotalEggs > winnerTotalEggs) {
                            winner = perticipants[i]
                        }
                    }
                    console.log("deteceted winner is ", winner)
                    round.winner = winner
                    round.save()
                        .then(updated => {
                            return res.json(winner)
                        })
                } else {
                    var noWinner = { meme: null, user: { name: "Round result released !" } }
                    res.json(noWinner)
                }
            }
        })
        .catch(err => res.json(err))

})
module.exports = RoundRouter;