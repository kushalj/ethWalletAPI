//import { version } from '../../package.json';
//import wallets from './wallets';
import { Router } from 'express';
import wallet from 'ethereumjs-wallet';
import Tx from 'ethereumjs-tx';
import util from 'ethereumjs-util';
import  Web3 from 'web3'; 

// Rinkeby test address
// 0x4a50ce725ad42747852e60588aa163f107d20e4c
// Rinkeby destination test address
// 0x943fb332d3a7303a369b8e26c44dc8055ddb6123

// infura access token and link for connected to rinkeby testnet
const testnet = `https://rinkeby.infura.io/v3/bf0dccae21c74cb3bc3b737b48737fc6`
const web3 = new Web3( new Web3.providers.HttpProvider(testnet) );



// middleware patch to 'safely' use async/await
// #TODO should probably be moved to lib/utils
const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };


export default ({ config, db }) => {
	let api = Router();

	// createWallet
	// Generate an Ethereum wallet and return private key & public address in obj
	api.get('/createWallet', (req, res) => {
		try {
			const newWallet = wallet.generate();
			const address = newWallet.getAddressString();
			const privateKey = newWallet.getPrivateKeyString();
	
			res.json({ 
				address,
				privateKey
			});

		} catch(err) {
			console.error(err);
			res.status(500).end()
		} 
	});


	// getBalance/:address
	// Get the balance of an Ethereum address
	api.get('/getBalance/:address', asyncMiddleware(async function(req, res, next) {
		const walletAddress = req.params.address
		try {
				if ( !web3.utils.isAddress(walletAddress) ) {
					console.error('Bad ethereum address ' + walletAddress);
					res.status(400).end();	
				}

				const balance = await web3.eth.getBalance(walletAddress);
				res.json({
					walletAddress,
					balance,
				});

		} catch(err) {
			console.error(err);
		}
	}));


	// Transaction to send ETH from one address to another
	// 3 JSON params: privateKey, destination, amount
	api.post('/transaction', asyncMiddleware(async function(req, res, next) {
		const destination = req.body.destination;
		const amount = req.body.amount;
		let privateKey = req.body.privateKey;
		// strip the leading 0x:
		(privateKey.slice(0, 2) === '0x') ? privateKey = privateKey.slice(2) : privateKey;

		let err = false;

		// Some simple data validation:
		// check we have all the required POST keys
		if ( !privateKey || !destination || !amount ) {
			err = true;
		}

		// check the destination is an address
		if ( !web3.utils.isAddress(destination) ) {
			console.error('Bad ethereum address ' + destination);
			err = true;
		}

		if (err) {
			res.status(400).end();
		}

		// get the source address from privateKey
		const sourcePrivateKey = new Buffer.from(privateKey, 'hex');
		const sourceAddress = util.bufferToHex(
			util.privateToAddress(sourcePrivateKey)
		);


		let count;
		try {
			// get transaction count, later will be used as nonce
			const txCount = await web3.eth.getTransactionCount(sourceAddress);
			console.log("Count: " + txCount);
			count = txCount;
			const txAmount = web3.utils.toHex(amount);

			//creating raw tranaction for Rinkeby (chainId=4)
			const rawTransaction = {
				"from": sourceAddress,
				"gasPrice": web3.utils.toHex(20* 1e9),
				"gasLimit": web3.utils.toHex(210000),
				"to":  destination,
				"value": txAmount,
				"nonce": web3.utils.toHex(count),
				"chainId":4
			}
			console.log(rawTransaction);

			//creating tranaction via ethereumjs-tx
			const transaction = new Tx(rawTransaction);

			//signing transaction with private key
			transaction.sign(sourcePrivateKey);

			//sending transacton via web3 module
			const receipt = await web3.eth.sendSignedTransaction(
				'0x'+transaction.serialize().toString('hex')
			)
			.on('transactionHash',console.log)

			const destinationBalance = await web3.eth.getBalance(destination);
			res.json({
				destination,
				destinationBalance,
				receipt
			});

		} catch(err) {
			console.error(err);
		}


		



		// web3.eth.getTransactionCount(sourceAddress)
		// .then(function(txCount){
		// 	console.log("Count: " + txCount);
		// 	count = txCount;
		// 	const txAmount = web3.utils.toHex(amount);

		// 	//creating raw tranaction for Rinkeby (chainId=4)
		// 	const rawTransaction = {
		// 		"from": sourceAddress,
		// 		"gasPrice": web3.utils.toHex(20* 1e9),
		// 		"gasLimit": web3.utils.toHex(210000),
		// 		"to":  destination,
		// 		"value": txAmount,
		// 		"nonce": web3.utils.toHex(count),
		// 		"chainId":4
		// 	}
		// 	console.log(rawTransaction);

		// 	//creating tranaction via ethereumjs-tx
		// 	const transaction = new Tx(rawTransaction);

		// 	//signing transaction with private key
		// 	transaction.sign(sourcePrivateKey);

		// 	//sending transacton via web3 module
		// 	web3.eth.sendSignedTransaction(
		// 		'0x'+transaction.serialize().toString('hex'))
		// 		.on('transactionHash',console.log
		// 	)
		// 	.then(
		// 		web3.eth.getBalance(destination)
		// 		.then(function(balance){
		// 			console.log(balance)
		// 		})
		// 	);

		// })
		// .catch( (err) => {
		// 	console.log(err);
		// });


	}));

	return api;
}
