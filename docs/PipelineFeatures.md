# Pipeline Features


With Pipeline, we have demonstrated:


### Runtimes (Pipeline graph interpreters)

* JavaScript & Node.js - executing graphs containing
    * nested graphs [video1](#pipeline---ethereum-dapps-with-nested-webassembly--smart-contract-graphs)
    * a mix of web3/smart contract & WebAssembly functions [video1](#pipeline---ethereum-dapps-with-nested-webassembly--smart-contract-graphs)
    * WebAssembly functions, in Node.js, through FFI [video2](#pipeline-executing-graphs-on-webassembly-binaries-with-ffi-feature-preview)
    * Rust functions in Node.js, through FFI [video1](#pipeline---multi-language-runtimes-rust-feature-preview)
    * HTTP calls based on OpenApi schemas [video1 min 18:59](#ethcc-2-paris-2019-proof-of-wonder--pipeline---visual-ide-for-solidity-smart-contracts-ethereum)
    * smart contract & JS functions [video1](#pipeline---solidity-and-javascript-composite)
* Python [video1, starting at 2:39](#pipeline---multi-language-runtimes-js-python-feature-preview)
* Rust
* WebAssembly
    * interpreting graphs containing WebAssembly functions, in WebAssembly [video1](#pipeline-core-for-webassembly-in-rust---execute-graphs-on-dynamically-loaded-wasm-modules)
    * with JS & Node.js as glue [video1](#pipeline-interpreter-for-graphs-in-webassembly)
* Ethereum Virtual Machine:
    * graph interpreter smart contract, directly on an Ethereum chain, where you can execute a graph by graph object or graph ID. [video1](#pipeline-on-chain-graph-interpreter-on-four-ethereum-testnets), [video2](#pipeline-on-chain-graph-interpreter-no-more-race-conditions)


| can be executed ><br>runtimes v   | solidity/web3| javascript| python | rust | wasm | nested graph |
| --------      | ---- | ---  | ---- | ---  | ---  | ---  |
| **js & node** | done | done | TBI  | done | done | done |
| **python**    | TBI  |  --  | done | TBI  | TBI  | TBI  |
| **rust**      | TBI  | --   |  --  | TBI  | TBI  | TBI  |
| **wasm**      | TBI  | TBI  |  --  | --   | done | TBI  |
| **EVM**       | done |  --  |  --  |  --  |  --  | done |


```
*TBI = to be implemented
*- = imposible or not planned
```


### Source code generation

* Solidity
    * [video1](#pipeline-javascript-web3-development-environment-v001), [video2](#pipeline-javascript-web3-development-environment-v002---new-tools), [video3](#pipeline---visual-ethereum-ide---brief-guide-old-version)
* JavaScript, from graphs containing
    * smart contract & WebAssembly functions [video1](#Pipeline---Ethereum-dApps-with-Nested-WebAssembly-amp-Smart-Contract-Graphs), [video2](#pipeline---visual-ethereum-ide---brief-guide-old-version)
* Rust
    * from graph to crate [video1](#pipeline-from-graph-to-rust-crate-feature-preview)



| source code ><br>runtimes v   | solidity   | javascript     | rust |
| --------   | --------   | --------       |----  |
| **js & node** | done   | done     | done |


### Sharing Pipeline dApps

* by QRcode [video](#pipeline-create-dapps-by-drag--drop-and-share-them-by-qr-code-on-ethereum)
* across devices [video](#pipem---pipeline-dapp-dissemination-across-devices-by-qrcode-on-ethereum)



## Video Tutorials

### Pipeline - Ethereum dApps with Nested WebAssembly & Smart Contract Graphs

Creating a dApp with smart contract & WebAssembly functions, by composing and nesting graphs + Markdown documentation for the user.


[![https://youtu.be/mBL4khzDE-4](https://img.youtube.com/vi/mBL4khzDE-4/0.jpg)](https://youtu.be/mBL4khzDE-4 "Go to video demo")


### Pipeline Interpreter for Graphs in WebAssembly

Loading and executing Wasm in Wasm.

[![https://youtu.be/WQx6rvASOOI](https://img.youtube.com/vi/WQx6rvASOOI/0.jpg)](https://youtu.be/WQx6rvASOOI "Go to video demo")

### Pipeline On-Chain Graph Interpreter on Four Ethereum Testnets

[![https://youtu.be/nZ8XFbCQqX0](https://img.youtube.com/vi/nZ8XFbCQqX0/0.jpg)](https://youtu.be/nZ8XFbCQqX0 "Go to video demo")

### Pipeline On-Chain Graph Interpreter: No More Race Conditions

You are now able to batch multiple transactions and do complex computations on-chain data in a single transaction. Even more, executing a graph that was stored on-chain means that you now have trustless, atomic execution of logic.

[![https://youtu.be/inc43gBE9yU](https://img.youtube.com/vi/inc43gBE9yU/0.jpg)](https://youtu.be/inc43gBE9yU "Go to video demo")

### ChainLens & new Pipeline Client are Live on Remix-alpha

Pipeline's ContractFinder is now ChainLens https://chainlens.pipeos.one.
Use it in https://remix.ethereum.org or https://remix-alpha.ethereum.org with Pipeline.


[![https://youtu.be/TsXgE_AQgQU](https://img.youtube.com/vi/TsXgE_AQgQU/0.jpg)](https://youtu.be/TsXgE_AQgQU "Go to video demo")


### Pipeline Core for WebAssembly, in Rust - execute graphs on dynamically loaded WASM modules

[![https://youtu.be/uXlb2etvjYY](https://img.youtube.com/vi/uXlb2etvjYY/0.jpg)](https://youtu.be/uXlb2etvjYY "Go to video demo")


### Pipeline Dev Environment v.0.0.3 - Type-Driven Development

https://observablehq.com/@loredanacirstea/pipeos-web3-env


[![https://youtu.be/PGAvFef7-wc](https://img.youtube.com/vi/PGAvFef7-wc/0.jpg)](https://youtu.be/PGAvFef7-wc "Go to video demo")

### Pipeline JavaScript-Web3 Development Environment v.0.0.2 - New Tools!

https://observablehq.com/@loredanacirstea/pipeos-web3-env


[![https://youtu.be/FU1PxSBq8sI](https://img.youtube.com/vi/FU1PxSBq8sI/0.jpg)](https://youtu.be/FU1PxSBq8sI "Go to video demo")



### Pipeline JavaScript-Web3 Development Environment v.0.0.1

https://observablehq.com/@loredanacirstea/pipeos-web3-env

[![https://youtu.be/m4isQBqdiyE](https://img.youtube.com/vi/m4isQBqdiyE/0.jpg)](https://youtu.be/m4isQBqdiyE "Go to video demo")


### dtypei: Rust/Wasm Exports Introspection v.0.0.1

https://crates.io/crates/dtypei
https://crates.io/crates/dtypei-derive

- type checking #WebAssembly
- help menu for https://github.com/wasmerio/webassemblysh
- supports functions using scalar types, simple enum & struct, modules

[![https://youtu.be/tkbo-cnlCKk](https://img.youtube.com/vi/tkbo-cnlCKk/0.jpg)](https://youtu.be/tkbo-cnlCKk "Go to video demo")

### dtypei: Bridging Types - Rust/Wasm Exports Introspection

Rust macro to expose module interfaces. Works with wasm-bidgen.

[![https://youtu.be/3lCnO9sI548](https://img.youtube.com/vi/3lCnO9sI548/0.jpg)](https://youtu.be/3lCnO9sI548 "Go to video demo")

### Pipeline: Executing Graphs on WebAssembly Binaries with FFI (feature preview)

Prototype showing some of the future Pipeline features that are in-work:
- executing Pipeline graphs that contain functions from Wasm libraries
- using Wasm libraries dynamically from Node.js, through a Wasm FFI library

[![https://youtu.be/mn1fPEQE3k0](https://img.youtube.com/vi/mn1fPEQE3k0/0.jpg)](https://youtu.be/mn1fPEQE3k0 "Go to video demo")


### Pipeline: From Graph to Rust Crate (feature preview)

Prototype showing some of the future Pipeline features that are in-work:
- different rendering algorithm for graphs
- creating Rust crates from Pipeline graphs

[![https://youtu.be/2bW9EfFOrow](https://img.youtube.com/vi/2bW9EfFOrow/0.jpg)](https://youtu.be/2bW9EfFOrow "Go to video demo")

### Pipeline - Multi-language Runtimes: Rust (feature preview)

[![https://youtu.be/NDFpgfZY2Ic](https://img.youtube.com/vi/NDFpgfZY2Ic/0.jpg)](https://youtu.be/NDFpgfZY2Ic "Go to video demo")


### Pipeline - Multi-language Runtimes: JS, Python (feature preview)

[![https://youtu.be/5Ec5yRp0SgM](https://img.youtube.com/vi/5Ec5yRp0SgM/0.jpg)](https://youtu.be/5Ec5yRp0SgM "Go to video demo")


### PipEm - Pipeline dApp Dissemination Across Devices, by QRcode, on Ethereum

[![https://youtu.be/tR5X38uq1JY](https://img.youtube.com/vi/tR5X38uq1JY/0.jpg)](https://youtu.be/tR5X38uq1JY "Go to video demo")

### Pipeline: create dApps by drag & drop and share them by QR code! on Ethereum

[![https://youtu.be/Op-BSbFJUR4](https://img.youtube.com/vi/Op-BSbFJUR4/0.jpg)](https://youtu.be/Op-BSbFJUR4 "Go to video demo")


### Pipeline - Visual Ethereum IDE - Brief Guide (old version)

[![https://youtu.be/8xwoyQkYm5U](https://img.youtube.com/vi/8xwoyQkYm5U/0.jpg)](https://youtu.be/8xwoyQkYm5U "Go to video demo")

### EthCC 2, Paris 2019: Proof of Wonder & Pipeline - Visual IDE for Solidity Smart Contracts, Ethereum

[![https://youtu.be/01Ao2_aFc2o](https://img.youtube.com/vi/01Ao2_aFc2o/0.jpg)](https://youtu.be/01Ao2_aFc2o "Go to video demo")


### Pipeline - Solidity and Javascript Composite

[![https://youtu.be/-LHvdZZUrss](https://img.youtube.com/vi/-LHvdZZUrss/0.jpg)](https://youtu.be/-LHvdZZUrss "Go to video demo")

### Pipeline: EthPM Import and Export to Remix in your Browser!

[![https://youtu.be/TkR5I4v_n7U](https://img.youtube.com/vi/TkR5I4v_n7U/0.jpg)](https://youtu.be/TkR5I4v_n7U "Go to video demo")
