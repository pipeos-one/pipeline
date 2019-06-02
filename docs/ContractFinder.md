# ContractFinder

ContractFinder is a browsable and searchable cache of tagged Ethereum smart contracts that have already been deployed on the Mainnet and various testnets.

ContractFinder exists now, in an alpha version, as a part of Pipeline and you can use it at http://remix.ethereum.org (new design) or http://remix-alpha.ethereum.org.

- Browse and search video demo: https://youtu.be/oEUjV2WZaVU
- Import and export EthPM packages: https://youtu.be/TkR5I4v_n7U


## Summary

Having access to ecosystem smart contracts right inside Remix would broaden the range of plugins that can be built for Remix and would enhance project interoperability. Pipeline, on which one can visually build smart contracts and scripts based on web3 and HTTP endpoints, based on already deployed resources, is just one example of bridging projects.

This benefits developers and even beginner developers, who will be provided with a gateway to contract source code, compiled data and deployed instances. This data can act as a learning resource and ground for development ideas.


## Present state

- currently part of Pipeline
- has 4000+ contracts deployed on Mainnet, Ropsten, Rinkeby, Kovan
- centralized MongoDB database and Loopback server
- browsable and searchable by contract name, tags and project name
- data models closely follow EthPM v2. schema, in preparation for full EthPM support
- forever open source

## Plan for ContractFinder Remix plugin

### Fork from Pipeline as a separate plugin

We want to modularize Pipeline components and extract the Pipeline Core in a client-only library. The ContractFinder is a fundamental part of Pipeline, providing the contract data needed to create Pipeline graphs, smart contracts and scripts.

ContractFinder will be, at first, a tool to aggregate public ecosystem smart contracts. We can also make it available as an app to keep track of selected, individual smart contracts.

The ContractFinder prototype is currently based on a centralized server. However, the aim is to have decentralized and publicly available data. EthPM integration will have priority. We are currently researching and prototyping decentralized ways to index and tag contracts (both on and off-chain).
For the initial centralized version, we will provide publicly available database snapshots.

### Technological improvements

As mentioned, we will migrate to a decentralized database/storage system.

We are also building dType (https://github.com/pipeos-one/dType), a decentralized type system. dType can enable fine-grained searches, based on the types used by the contracts.

### Integration with other Remix plugins

Having the ContractFinder as a separate plugin will allow other Remix plugins to use it. We will start by creating a tight development flow between ContractFinder, Remix and Pipeline and improve the ContractFinder plugin API when other plugin projects request it.

### Data additions

- include more contracts
- import & cache from extant EthPM sources
- ability to receive smart contract registration proposals from deployed projects
- better and more fine-grained data search
