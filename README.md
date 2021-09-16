# BIFI FlashLoan Cooking Kits

This repository provides basic templates and hardhat deployment scripts(ETH-fork Based) to understand Flashloan of BIFI.

It should be noted that the corresponding solidity files are example files, not production files, so additional development and security considerations are required for production.

## Install
```
$ npm install
```

## Compile Contracts
```
$ npx hardhat compile
```

## Run Hardhat Task
```
$ npx hardhat flashLoanCooking
```

## Hardhat Config File
```
module.exports = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.6.12' ,
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: 'https://mainnet.infura.io/v3/[INFURA_KEY]'
      }
    }
  },
}
```
