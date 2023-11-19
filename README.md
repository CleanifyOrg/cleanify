# Cleanify

Cleanify is a dapp and protocol that incentivizes users to clean up the world from waste and being rewarded by doing so.

## Why Cleanify

Imagine a world where waste isn't just an eyesore but a ticking time bomb. Illegal landfills and abandoned waste areas not only scar the landscape but poison our air, water, and soil, threatening the very fabric of our communities. 

If we take a closer look at the most polluted countries in the world, we can easily notice that mostly all of them are third-world countries, In regions like Brazil, Nigeria, India, Bangladesh, and Pakistan, communities grapple not only with the environmental devastation caused by waste but also with socio-economic complexities. These areas are often home to a significant population of unbanked individuals which limits their access to financial services and their ability to get paid

Considering all of this, we strongly believe that blockchain, thanks to its native capability of creating financial applications and incentives  is  the best solution to tackle a complex problem of this kind 

Cleanify, is a platform that targets developing countries allowing people to receive fair compersation for their efforts in cleaning up their communities. We're bringing web3 closer to the reality, by creating an incentive to build a better world

### How it works 

We've designed a unique incentive mechanism to drive community participation. Companies, governments, and local shops can contribute to a reward pool for those who take action in cleaning up reported areas. 

Our solution allows every individual on earth to report dirty areas through a user-friendly interface. The information is then timestamped and added to the blockchain

If one ore more user are then able to prove they cleaned a specific area, the smart contract automatically rewards them accordingly 


## Tech
### Contracts 

Our contracts are currently deployed on mainnet on Celo, Arbitrum, Polygon ZkEvm, Base and Gnosis

#### Deploy contracts


Create a .mnemonic and a .infura file in the root directory of the project. The .mnemonic file should contain the mnemonic of the wallet that will deploy the contracts. The .infura file should contain the infura key.

Run the following command to deploy the contracts:

```bash
npx hardhat run scripts/deploy.ts --network goerli
```

#### Verify contracts

Run the following command to verify the contracts:

```bash
npx hardhat verify --constructor-args scripts/arguments.ts --network goerli DEPLOYED_CONTRACT_ADDRESS


```

### Dapp

The app is running react using vite. In order to start, you need to set up different env variables according to `.env.example`
To do so, generate the required env keys and insert them in a .env by doing 

```
cp .env.example .env
```

#### Running the dapp

```
yarn dev
```
