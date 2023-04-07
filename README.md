# Progress Tracker

## Environment Versions
Truffle v5.0.2 (core: 5.0.2)  
Solidity - ^0.4.24 (solc-js)  
Node v14.21.3  

## To get started again
Run: 'npm run dapp' to start UI
Run: ganache-cli -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" -a 20  
Run: 'npm run server' to start oracle server  
Run: 'Truffle migrate' if Operational Status isn't working in Dapp  

## Notes
### 3/31/2022
All Contracts are done I think, seem to be passing tests, pretty sure functionality is complete
probably would want to run through tests again (maybe just check rubric for requirements)

Front end (index.html) has all that's needed, css is fine, haven't tested functionality yet
Still need to stich together the index.js to the front end to the contract.js
Began working on prompt for this but it might not be relevant anymore (chat can be founder under "Fix Syntax in test script")

Also need to figure out how the oracles hook in exactly, I think I have a okay idea but need to test it out.

Also created a rubric that exists in notion
https://www.notion.so/elijahwilbanks/Final-Project-Rubric-edfb4d3d523248a3bc7bd80a0409499f?pvs=4

Due date is exactly 14 days away, should be easy to finish in time

////////////////////////////////////////////////////////////////////////////

### 4/05/2022
Oracle tests were fixed, still need to create another test to validate payouts on bad status, should be easy enough to just copy test and change status code
Also still need to link frontend to smart contracts
Also need to look over requirements and make sure everything is done

////////////////////////////////////////////////////////////////////////////

### 4/07/2022
Oracle tests are done, still need to link frontend to smart contracts  
Also still need to look over requirements and make sure everything is done

////////////////////////////////////////////////////////////////////////////


# Udacity notes begin here
# FlightSurety

FlightSurety is a sample application project for Udacity's Blockchain course.

## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.

To install, download or clone the repo, then:

`npm install`
`truffle compile`

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`
`truffle test ./test/oracles.js`

To use the dapp:

`truffle migrate`
`npm run dapp`

To view dapp:

`http://localhost:8000`

## Develop Server

`npm run server`
`truffle test ./test/oracles.js`

## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder


## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)