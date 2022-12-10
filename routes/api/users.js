const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const User = require('../../models/User');
const router = express.Router();
const paypal = require('paypal-rest-sdk');



router.post('/checkout', (req, res) => {

	paypal.configure({
		'mode': 'live', //sandbox or live
		'client_id': 'AQ-G-nLPbc-RLRM-b6akpbgapyyi72vppFekw2vOVf8UOY3bi7YwHsfLXWVeySZIofwFKL1KCAHYznUa',//Live-Meme
		// 'client_id': 'Aae9jmqpFR309TWIkxwY3qctslElWNnWw4_VoLunOon47-FsQjFQvPQHoboxfVY7sFDEkeifdXymVJW1',//Live-alamin
		// 'client_id': 'AWkC_xaoRVRLRwiQm6lkktEDSsAhoOFoiLw9uJ9HdgZYzrGZJnoQ5kCVPoP43aA6JFthwsibhQ-k-Z4a',//Sandbox


		'client_secret': 'EN_vF_8tmUYeZLYTK-hfG1EDV7DqFqOljxxqHr64tfd54EUcoq2qEm1qtyIy5GHKAUYHpiqCusqZq6uB'//Live-Meme
		// 'client_secret': 'EDbPyBlOBG__deyzYgoCJm1Rnsmox3xp8RXCVmCobFxrVEpzjaZk1zoWQuBluRDKiP1ibeeAusXWi1r8'//Live-alamin
		// 'client_secret': 'ELQWiXX2OSLP72vyKB-TTwVLWv_4dpkDsT8kHM4Sy6WO_UZJ7rjhlRRMtMAMZmSUuraStLTWuXM6cvJ9'//Sandbox
	});


	const create_payment_json = {
		intent: "sale",
		payer: {
			payment_method: "paypal"
		},
		redirect_urls: {
			return_url: "https://meme-backend-api.herokuapp.com/api/user/payment-success",
			cancel_url: "https://meme-backend-api.herokuapp.com/api/user/payment-cancel"

			// return_url: "http://localhost:5000/api/user/payment-success",
			// cancel_url: "http://localhost:5000/api/user/payment-cancel"
			// https://meme-frontend.vercel.app/
		},
		transactions: [{
			item_list: {
				items: [{
					name: req.body.packName,
					sku: "001",
					price: `${req.body.price}.00`,
					currency: "USD",
					quantity: 1
				}]
			},
			amount: {
				currency: "USD",
				total: `${req.body.price}.00`
			},
			description: JSON.stringify(req.body)
		}]
	};
	paypal.payment.create(JSON.stringify(create_payment_json), function (error, payment) {
		if (error) {
			throw error;
		} else {
			for (let i = 0; i < payment.links.length; i++) {
				if (payment.links[i].rel === 'approval_url') {
					console.log(payment.links[i].href)
					return res.json(payment.links[i].href);
				}
			}
		}
	});
})


router.get('/payment-success', (req, res) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;

	const execute_payment_json = {
		"payer_id": payerId
	};

	paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
		if (error) {
			console.log(error.response);
			throw error;
		} else {
			console.log(JSON.stringify(payment));
			var paymentDetails = JSON.parse(payment.transactions[0].description);
			User.findById(paymentDetails.user)
				.then(user => {
					console.log(user)
					var updateUser = user
					updateUser.balance.paidEsterEggs = updateUser.balance.paidEsterEggs + paymentDetails.esterEggs
					updateUser.balance.paidRottenEggs = updateUser.balance.paidRottenEggs + paymentDetails.rottenEggs
					console.log("updated balance ", updateUser.balance)
					User.findByIdAndUpdate(paymentDetails.user, updateUser, { new: true })
						.then(resp => {
							console.log(resp)
							res.redirect("https://meme-frontend.vercel.app/success")
							// res.redirect("https://meme-frontend.vercel.app/success")
						})
						.catch(err => {
							res.json(err)
							console.log(err)
						})
				})
		}
	});
});

router.get('/payment-cancel', (req, res) => res.send('Cancelled'));
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				errors.email = 'Email already exits';
				res.status(400).json(errors);
			} else {
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					pp: Math.floor(Math.random() * 11) + 1,
					country: req.body.country,
					balance: {
						freeEsterEggs: 100,
						freeRotenEggs: 100,
						paidEsterEggs: 5,
						paidRottenEggs: 7
					},
					password: req.body.password
				})
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser.save()
							.then((user) => {
								res.json(user);
							})
							.catch((err) => {
								console.log(err);
							})
					})
				})
			}
		})
})

router.post('/login', (req, res) => {

	const { errors, isValid } = validateLoginInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email })
		.then(user => {
			if (!user) {
				errors.email = 'User not found';
				return res.status(404).json(errors);
			}

			bcrypt.compare(password, user.password)
				.then(isMatch => {
					if (isMatch) {
						const payload = { ...user._doc };
						jwt.sign(
							payload,
							// user,
							keys.secretOrKey,
							{ expiresIn: 3600 },
							(err, token) => {
								res.json({
									success: true,
									token: 'bearer ' + token
								})
							});
					} else {
						errors.password = 'Incorrect password';
						res.status(400).json(errors);
					}
				})
		});
});

router.post('/update-user', (req, res) => {
	User.findByIdAndUpdate(req.body._id, req.body, { new: true })
		.then(updatedUser => {
			res.json(updatedUser)
			// var newUser = user
			// user.save()
			// 	.then(udpatedUser => {
			// 		res.json({ message: 'User Update success', user: udpatedUser })
			// 	})
		})
		.catch(err => {
			console.log(err)
			res.json({ message: "error ", err })
		})
})
router.get('/', (req, res) => {
	User.find()
		.then(allUser => {
			res.json(allUser).status(200)
		})
		.catch(err => {
			res.json(err).status(400)
		})
})
router.delete("/:id", (req, res) => {
	User.findByIdAndDelete(req.params.id)
		.then(deleted => {
			if (deleted) {
				return res.json(deleted)
			} else {
				return res.json({ message: "User Not Finded !!" })
			}
		})
		.catch(err => {
			res.json(err)
		})
})
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email
	});
});
router.get('/find/:id', (req, res) => {
	User.findById(req.params.id)
		.then(user => {
			res.json(user)
		})
		.catch(err => {
			res.json({ err })
		})
});
router.get('/find-email/:id', (req, res) => {
	User.findOne({ email: req.params.id })
		.then(user => {
			res.json(user)
		})
		.catch(err => {
			res.json({ err })
		})
});

module.exports = router;