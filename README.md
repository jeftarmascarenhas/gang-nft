# Gang NFT

This a NFT project real world project

### Project requirements

For run this project on localhost you are gonna need it:

- [Truffle](https://trufflesuite.com/docs/truffle/quickstart.html)
- [Ganache](https://trufflesuite.com/ganache/)

### Config project

This project is using npm and not yarn, use npm to module install.

run `npm i` or `npm install`

### Run project on development

You need enter of project directory and to have global truffle-cli installed

run command for open truffle terminal: `truffle develop`

on the truffle terminal

run `compile`

and after

run `migrate`

### Run project on test

This does a deploy of contract in the rinkeby network

run `truffle migrate --network {network}`

example: `truffle migrate --network rinkeby`

### Run project on test

This does a deploy of contract in the main network
Coming soon

### Run verify contract

This command should run after

run `truffle run verify GangNFT --network rinkeby`
