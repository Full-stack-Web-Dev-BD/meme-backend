# mern-stack
ctasalguero@gmail.com


	const create_payment_json = {
		intent: "sale",
		payer: {
			payment_method: "paypal"
		},
		redirect_urls: {
			return_url: "http://localhost:3000/payment-success",
			cancel_url: "http://localhost:3000/payment-cancel"
		},
		transactions: [{
			item_list: {
				items: [{
					name: "Red Sox Hat",
					sku: "001",
					price: "25.00",
					currency: "USD",
					quantity: 1
				}]
			},
			amount: {
				currency: "USD",
				total: "25.00"
			},
			description: "Hat for the best team ever"
		}]
	};
