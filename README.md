Ethereum testnet wallet and transaction API
===========================================

Based on [Express & ES6 REST API Boilerplate](https://github.com/developit/express-es6-rest-api)



Getting Started
---------------

```sh
# clone it
git clone git@github.com:kushalj/ethWalletAPI.git
cd ethWalletAPI

# Install dependencies
npm install

# Start development live-reload server
PORT=8080 npm run dev

# Start production server:
PORT=8080 npm start
```

Endpoints
=========

## GET /api/createWallet
Generate a new Ethereum testnet (Rinkeby) wallet and return private key & address

## GET /api/getBalance/<rinkeby address>
Check the balance of a wallet address

## POST /api/transaction

```JS
//POST BODY (urlencoded)

body = 
```

```JSON
{
    privateKey: <private key>,
    desination: <destination address>,
    amount: <amount to transfer>
}
```

Notes
=====

This code contains an Infura API key that I pushed as it was a demonstration API for a presentation. I will go Infura and destroy the key at some point but will leave the code in Github


License
-------

MIT
