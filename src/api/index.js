import { version } from '../../package.json';
import { Router } from 'express';
import wallets from './wallets';

export default ({ config, db }) => {
	let api = Router();

	// mount the wallet resource
	api.use('/wallets', wallets({ config, db }));

	// createWallet
	// Generate an Ethereum wallet and return priv & public address in obj
	api.get('/createWallet', (req, res) => {
		const walletAddress = 0;
		let statusCode = 200;

		res.status(statusCode)
		.json({ 
			walletAddress
		});
	});


	// getBalance/:address
	// Get the balance of an Ethereum address
	api.get('/getBalance/:address', (req, res) => {
		const walletAddress = req.params.address
		const balance = 0;
		let statusCode = 200;

		res.status(statusCode)
		.json({ 
			walletAddress,
			balance
		});
	});


	// transaction
	// Transaction to send ETH from one address to another
	// 3 JSON params: privateKey, destination, amount
	// returns 202 
	api.post('/transaction', (req, res) => {
		const privateKey = req.body.privateKey;
		const destination = req.body.destination;
		const amount = req.body.amount;
		let err = false;

		// check we have all the required POST keys
		if ( !privateKey || !destination || !amount ) {
			err = true;
		}

		if (err) {
			res.status(400).end();

		} else {
			res.json({
				privateKey,
				destination,
				amount,
			});
		}

	});

	return api;
}
