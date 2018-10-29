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

returns create wallet address and private key:
```JSON
{
    "address": "<ethereum (rinkeby) address>",
    "privateKey": "<private key>"
}
```

## GET /api/getBalance/<rinkeby address>
Check the balance of a wallet address
    
returns wallet balance:

```JSON
{
    "walletAddress": "<ethereum addree>",
    "balance": "<balance>"
}
```

## POST /api/transaction

```JS
//POST BODY (urlencoded)

body = 
```

```JSON
{
    "privateKey": "<private key>",
    "desination": "<destination address>",
    "amount": "<amount to transfer>"
}
```

returns transaction receipt and new destination balance:
```JSON
{
    "destination": "<address we sent ETH to>",
    "destinationBalance": "<new destination balance>",
    "receipt": {
        "blockHash": "<block hash>",
        "blockNumber": "<block number>",
        "contractAddress": null,
        "cumulativeGasUsed": "<cumulative>",
        "from": "<source address of ETH>",
        "gasUsed": "<gas cost>",
        "logs": [],
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": "<true/false>",
        "to": "<destination address>",
        "transactionHash": "<tx hash>",
        "transactionIndex": "<tx index>"
    }
}
```

Notes
=====

This code contains an Infura API key that I pushed as it was a demonstration API for a presentation. I will go Infura and destroy the key at some point but will leave the code in Github


License
-------

MIT
