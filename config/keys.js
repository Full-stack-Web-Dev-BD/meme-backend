module.exports = {
	mongoURI: 'mongodb+srv://ctasalguero:Antonio1.@cluster0.oycblrh.mongodb.net/meme?retryWrites=true&w=majority',
	// mongoURI: 'mongodb+srv://admin:admin@cluster0.3wgw3ix.mongodb.net/memedeploy?retryWrites=true&w=majority',//Meme
	//mongoURI: 'mongodb://localhost:27017/meme-show',
	secretOrKey: 'secret',
	paymentSuccessRedirecURL: "http://localhost:3000/payment-success",
	paymentFailedRedirecURL: "http://localhost:3000/payment-failed"
}
