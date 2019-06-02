# Pipeline [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/pipeos-one/pipeline)

The project is in development. Not safe for production use.


## Use

Use on https://remix.ethereum.org (new design) or http://remix-alpha.ethereum.org. Activate Pipeline from the plugins section.

Demos: https://www.youtube.com/watch?v=sC7Hd6Sr1SI&list=PL323JufuD9JAyaYCEvrnQ5yOAc3ukuNyF

## Features

- SVG-based graph library, enabling the user to create smart contracts and JavaScript scripts visually, by dragging and dropping function components and connecting inputs and outputs.
- graph components can be: Solidity functions and events, OpenAPI schemas for an HTTP endpoint and (soon) JavaScript functions
- running the Pipeline-created JS scripts right in the browser
- ContractFinder:
  - has 4000+ contracts deployed on Mainnet, Ropsten, Rinkeby, Kovan
  - browsable and searchable by contract name, tags and project name
  - data models closely follow EthPM v2. schema
  - import and export EthPM packages
  - see [ContractFinder docs](/docs/ContractFinder.md) for more information and our plans to make it a standalone Remix plugin


## Video Guides

- Brief Overall Guide: https://youtu.be/8xwoyQkYm5U
- Browse and search ContractFinder: https://youtu.be/oEUjV2WZaVU
- Import and export EthPM packages: https://youtu.be/TkR5I4v_n7U
- A quick presentation of Pipeline, including OpenAPI support and running Pipeline-created scripts in the browser: https://youtu.be/2NqQh_GHAh0?t=944 (ETHParis, 2019)

## Development

- run https://github.com/pipeos-one/pipeline/tree/master/server
- run https://github.com/pipeos-one/pipeline/tree/master/client
