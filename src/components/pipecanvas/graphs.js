const contracts = [
  {
    "_id":  "5bb7f015a06fd6ff93fb96e4" ,
    "name": "VendorPrices",
    "abi":
    [
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      }
    ],
    "devdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "params":
          {
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor.",
            "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
          },
          "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "params":
          {
            "price_per_unit": "The price paid for a unit of the given product.",
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor."
          }
        }
      },
      "title": "Vendor Prices contract"
    },
    "userdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "notice": "This function calculated the product quantity for a certain product and vendor price."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "notice": "This function sets the price of a unit of a product."
        }
      }
    },
    "keccak256": "sdfs",
    "solsource": "pragma solidity ^0.4.24;\n\n/// @title Vendor Prices contract. This is where vendors register their product prices in the system. \n/// @notice This is where vendors register their product prices in the system. \ncontract VendorPrices {\n    mapping (bytes32 => uint256) public prices;\n    \n    event PriceSet(uint256 product_id, address vendor, uint256 price_per_unit);\n    \n    constructor() public {\n        setUnitPrice(msg.sender, 1, 10);\n    }\n    \n    /// @notice This function calculated the product quantity for a certain product and vendor price.\n    /// @param product_id The id of the product registered in the system.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param wei_value The total amount of WEI that the buyer wants to pay for the product.\n    /// @return quantity The quantity of product that `wei_value` can buy from a vendor.\n    function calculateQuantity(uint256 product_id, address vendor, uint256 wei_value) view public returns (uint256 quantity) {\n        require(wei_value > 0);\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\n        require(prices[key] > 0);\n        quantity = wei_value / prices[key];\n    }\n    \n    /// @notice This function sets the price of a unit of a product.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param product_id The id of the product registered in the system.\n    /// @param price_per_unit The price paid for a unit of the given product.\n    function setUnitPrice(address vendor, uint256 product_id, uint256 price_per_unit) public {\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\n        prices[key] = price_per_unit;\n        \n        emit PriceSet(product_id, vendor, price_per_unit);\n    }\n}",
    "tags":
    [
      "market",
      "supply chain"
    ],
    "timestamp":
    {
      "$date":
      {
        "$numberLong": "1538776890317"
      }
    }
  },
  {
    "_id":  "5bb7f09aa06fd6ff93fb96ea" ,
    "name": "VendorRegistration",
    "abi":
    [
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          }
        ],
        "name": "getVendor",
        "outputs":
        [
          {
            "name": "vendor",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "table",
        "outputs":
        [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          }
        ],
        "name": "registerVendor",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          }
        ],
        "name": "VendorRegistered",
        "type": "event"
      }
    ],
    "devdoc":
    {
      "methods":
      {
        "getVendor(uint256)":
        {
          "params":
          {
            "product_id": "The id of the product registered in the system."
          },
          "return": "vendor The Ethereum address of the vendor."
        },
        "registerVendor(address,uint256)":
        {
          "params":
          {
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor."
          }
        }
      },
      "title": "Vendor Registration contract"
    },
    "userdoc":
    {
      "methods":
      {
        "getVendor(uint256)":
        {
          "notice": "This function returns an available vendor for a given product"
        },
        "registerVendor(address,uint256)":
        {
          "notice": "This function registers a vendor in the system, for the given product."
        }
      }
    },
    "keccak256": "rewr",
    "solsource": "pragma solidity ^0.4.24;\n\n/// @title Vendor Registration contract\n/// @notice This is where vendors are registered in the system. \ncontract VendorRegistration {\n    \n    mapping (uint256 => address[]) public table;\n    \n    event VendorRegistered(uint256 product_id, address vendor);\n    \n    constructor() public {\n        registerVendor(msg.sender, 1);\n    }\n    \n    /// @notice This function returns an available vendor for a given product\n    /// @param product_id The id of the product registered in the system.\n    /// @return vendor The Ethereum address of the vendor.\n    function getVendor(uint256 product_id) view public returns (address vendor) {\n        if (table[product_id].length == 0) {\n            return 0x0;\n        }\n        return table[product_id][0];\n    }\n    \n    /// @notice This function registers a vendor in the system, for the given product.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param product_id The id of the product registered in the system.\n    function registerVendor(address vendor, uint256 product_id) public {\n        if (table[product_id].length == 0) {\n            address[] storage addresses;\n            table[product_id] = addresses;\n        }\n        table[product_id].push(vendor);\n        emit VendorRegistered(product_id, vendor);\n    }\n}",
    "tags":
    [
      "market",
      "supply chain"
    ],
    "timestamp":
    {
      "$date":
      {
        "$numberLong": "1538776890317"
      }
    }
  },
  {
    "_id":   "5bb7f0c1a06fd6ff93fb96f0" ,
    "name": "MarketPlace",
    "abi":
    [
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          }
        ],
        "name": "getQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "prices_contract",
        "outputs":
        [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "registration_contract",
        "outputs":
        [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "available_quantities",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          }
        ],
        "name": "getKey",
        "outputs":
        [
          {
            "name": "key",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "buyer",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "name": "buy",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "name": "setQuantity",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs":
        [
          {
            "name": "registration_address",
            "type": "address"
          },
          {
            "name": "prices_address",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "quantity",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "buyer",
            "type": "address"
          }
        ],
        "name": "MarketBuy",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "name": "QuantitySet",
        "type": "event"
      }
    ],
    "devdoc":
    {
      "methods":
      {
        "buy(address,address,uint256,uint256)":
        {
          "params":
          {
            "buyer": "The Ethereum address of the buyer.",
            "product_id": "The id of the product registered in the system.",
            "quantity": "The amount of product that the user wants to buy.",
            "vendor": "The Ethereum address of the vendor."
          }
        },
        "getKey(address,uint256)":
        {
          "details": "This function returns the key for the available_quantities mapping",
          "params":
          {
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor."
          },
          "return": "key The key for the available_quantities mapping"
        },
        "getQuantity(address,uint256)":
        {
          "params":
          {
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor."
          },
          "return": "quantity The amount of the product that the vendor has available for purchase."
        },
        "setQuantity(address,uint256,uint256)":
        {
          "params":
          {
            "product_id": "The id of the product registered in the system.",
            "quantity": "The amount of product that the vendor has available for purchase.",
            "vendor": "The Ethereum address of the vendor."
          }
        }
      },
      "title": "Market Place contract"
    },
    "userdoc":
    {
      "methods":
      {
        "buy(address,address,uint256,uint256)":
        {
          "notice": "This function allows a user to buy a product from a registered vendor."
        },
        "getQuantity(address,uint256)":
        {
          "notice": "This function returns the quantity of product that a registered vendor has available for purchase."
        },
        "setQuantity(address,uint256,uint256)":
        {
          "notice": "This function sets the quantity of a product that a registered vendor has available for purchase."
        }
      }
    },
    "keccak256": "dfs",
    "solsource": "pragma solidity ^0.4.24;\n\n/// @title Market Place contract. This is where users buy products from registered vendors.\n/// @notice This is where users buy products from registered vendors.\ncontract MarketPlace {\n    VendorRegistration public registration_contract;\n    VendorPrices public prices_contract;\n    \n    mapping (bytes32 => uint256) public available_quantities;\n    \n    event MarketBuy(address vendor, uint256 product_id, uint256 quantity, address buyer);\n    event QuantitySet(address vendor, uint256 product_id, uint256 quantity);\n    \n    constructor(address registration_address, address prices_address) public {\n        registration_contract = VendorRegistration(registration_address);\n        prices_contract = VendorPrices(prices_address);\n        \n        setQuantity(msg.sender, 1, 1000);\n    }\n    \n    /// @notice This function allows a user to buy a product from a registered vendor.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param buyer The Ethereum address of the buyer.\n    /// @param product_id The id of the product registered in the system.\n    /// @param quantity The amount of product that the user wants to buy.\n    function buy(address vendor, address buyer, uint256 product_id, uint256 quantity) payable public {\n        bytes32 key = getKey(vendor, product_id);\n        require(available_quantities[key] >= quantity);\n        uint256 computed_quantity = prices_contract.calculateQuantity(product_id, vendor, msg.value);\n        require(computed_quantity >= quantity);\n        available_quantities[key] -= quantity;\n\n        emit MarketBuy(vendor, product_id, quantity, buyer);\n    }\n    \n    /// @notice This function sets the quantity of a product that a registered vendor has available for purchase.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param product_id The id of the product registered in the system.\n    /// @param quantity The amount of product that the vendor has available for purchase.\n    function setQuantity(address vendor, uint256 product_id, uint256 quantity) public {\n        bytes32 key = getKey(vendor, product_id);\n        available_quantities[key] = quantity;\n        \n        emit QuantitySet(vendor, product_id, quantity);\n    }\n    \n    /// @notice This function returns the quantity of product that a registered vendor has available for purchase.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param product_id The id of the product registered in the system.\n    /// @return quantity The amount of the product that the vendor has available for purchase.\n    function getQuantity(address vendor, uint256 product_id) view public returns (uint256 quantity) {\n        bytes32 key = getKey(vendor, product_id);\n        return available_quantities[key];\n    }\n    \n    /// @dev This function returns the key for the available_quantities mapping\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param product_id The id of the product registered in the system.\n    /// @return key The key for the available_quantities mapping\n    function getKey(address vendor, uint256 product_id) view public returns (bytes32 key) {\n        return keccak256(abi.encodePacked(vendor, product_id));\n    }\n}",
    "tags":
    [
      "market",
      "supply chain"
    ],
    "timestamp":
    {
      "$date":
      {
        "$numberLong": "1538776890317"
      }
    }
  },
  {
    "_id":   "5bb7f0d9a06fd6ff93fb96fb" ,
    "name": "Utils",
    "abi":
    [
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "input_address",
            "type": "address"
          }
        ],
        "name": "pipe_address",
        "outputs":
        [
          {
            "name": "output_address",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "input_bytes32",
            "type": "bytes32"
          }
        ],
        "name": "pipe_bytes32",
        "outputs":
        [
          {
            "name": "output_bytes32",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "input_uint",
            "type": "uint256"
          }
        ],
        "name": "pipe_uint256",
        "outputs":
        [
          {
            "name": "output_uint",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      }
    ],
    "devdoc":
    {
      "methods":
      {
        "pipe_address(address)":
        {
          "params":
          {
            "input_address": "The input to be returned as output."
          },
          "return": "output_address Same as the input."
        },
        "pipe_bytes32(bytes32)":
        {
          "params":
          {
            "input_bytes32": "The input to be returned as output."
          },
          "return": "output_bytes32 Same as the input."
        },
        "pipe_uint256(uint256)":
        {
          "params":
          {
            "input_uint": "The input to be returned as output."
          },
          "return": "output_uint Same as the input."
        }
      },
      "title": "Utils contract to be used by Pipeline"
    },
    "userdoc":
    {
      "methods":
      {
        "pipe_address(address)":
        {
          "notice": "This function returns it's input."
        },
        "pipe_bytes32(bytes32)":
        {
          "notice": "This function returns it's input."
        },
        "pipe_uint256(uint256)":
        {
          "notice": "This function returns it's input."
        }
      }
    },
    "keccak256": "dfds",
    "solsource": "pragma solidity ^0.4.24;\n/// @title Utils contract to be used by Pipeline\n/// @notice This contract contains utility functions to be used by Pipeline.\ncontract Utils {\n    \n    /// @notice This function returns it's input.\n    /// @param input_uint The input to be returned as output.\n    /// @return output_uint Same as the input.\n    function pipe_uint256(uint256 input_uint) pure public returns (uint256 output_uint) {\n       output_uint = input_uint;\n    }\n\n    /// @notice This function returns it's input.\n    /// @param input_address The input to be returned as output.\n    /// @return output_address Same as the input.\n    function pipe_address(address input_address) pure public returns (address output_address) {\n       output_address = input_address;\n    }\n    \n    /// @notice This function returns it's input.\n    /// @param input_bytes32 The input to be returned as output.\n    /// @return output_bytes32 Same as the input.\n    function pipe_bytes32(bytes32 input_bytes32) pure public returns (bytes32 output_bytes32) {\n       output_bytes32 = input_bytes32;\n    }\n}",
    "tags":
    [
      "market",
      "supply chain",
      "governance"
    ],
    "timestamp":
    {
      "$date":
      {
        "$numberLong": "1538776890317"
      }
    }
  },
  {
    "_id":  "5bb87b6c09bf163c5e6ce66b" ,
    "name": "VendorPrices2",
    "abi":
    [
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      }
    ],
    "devdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "params":
          {
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor.",
            "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
          },
          "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "params":
          {
            "price_per_unit": "The price paid for a unit of the given product.",
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor."
          }
        }
      },
      "title": "Vendor Prices contract"
    },
    "userdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "notice": "This function calculated the product quantity for a certain product and vendor price."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "notice": "This function sets the price of a unit of a product."
        }
      }
    },
    "solsource": "pragma solidity ^0.4.24;\\n\\n/// @title Vendor Prices contract. This is where vendors register their product prices in the system. \\n/// @notice This is where vendors register their product prices in the system. \\ncontract VendorPrices {\\n    mapping (bytes32 => uint256) public prices;\\n    \\n    event PriceSet(uint256 product_id, address vendor, uint256 price_per_unit);\\n    \\n    constructor() public {\\n        setUnitPrice(msg.sender, 1, 10);\\n    }\\n    \\n    /// @notice This function calculated the product quantity for a certain product and vendor price.\\n    /// @param product_id The id of the product registered in the system.\\n    /// @param vendor The Ethereum address of the vendor.\\n    /// @param wei_value The total amount of WEI that the buyer wants to pay for the product.\\n    /// @return quantity The quantity of product that `wei_value` can buy from a vendor.\\n    function calculateQuantity(uint256 product_id, address vendor, uint256 wei_value) view public returns (uint256 quantity) {\\n        require(wei_value > 0);\\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\\n        require(prices[key] > 0);\\n        quantity = wei_value / prices[key];\\n    }\\n    \\n    /// @notice This function sets the price of a unit of a product.\\n    /// @param vendor The Ethereum address of the vendor.\\n    /// @param product_id The id of the product registered in the system.\\n    /// @param price_per_unit The price paid for a unit of the given product.\\n    function setUnitPrice(address vendor, uint256 product_id, uint256 price_per_unit) public {\\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\\n        prices[key] = price_per_unit;\\n        \\n        emit PriceSet(product_id, vendor, price_per_unit);\\n    }\\n}",
    "tags":
    [
      "governance",
      "market"
    ],
    "timestamp":
    {
      "$date":
      {
        "$numberLong": "1538816876154"
      }
    }
  },
  {
    "_id":  "5bb9e02e97d3fc2b627579ef" ,
    "name": "VendorPrices3",
    "abi":
    [
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      }
    ],
    "devdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "params":
          {
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor.",
            "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
          },
          "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "params":
          {
            "price_per_unit": "The price paid for a unit of the given product.",
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor."
          }
        }
      },
      "title": "Vendor Prices contract"
    },
    "userdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "notice": "This function calculated the product quantity for a certain product and vendor price."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "notice": "This function sets the price of a unit of a product."
        }
      }
    },
    "keccak256": "sdfs",
    "solsource": "pragma solidity ^0.4.24;\n\n/// @title Vendor Prices contract. This is where vendors register their product prices in the system. \n/// @notice This is where vendors register their product prices in the system. \ncontract VendorPrices {\n    mapping (bytes32 => uint256) public prices;\n    \n    event PriceSet(uint256 product_id, address vendor, uint256 price_per_unit);\n    \n    constructor() public {\n        setUnitPrice(msg.sender, 1, 10);\n    }\n    \n    /// @notice This function calculated the product quantity for a certain product and vendor price.\n    /// @param product_id The id of the product registered in the system.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param wei_value The total amount of WEI that the buyer wants to pay for the product.\n    /// @return quantity The quantity of product that `wei_value` can buy from a vendor.\n    function calculateQuantity(uint256 product_id, address vendor, uint256 wei_value) view public returns (uint256 quantity) {\n        require(wei_value > 0);\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\n        require(prices[key] > 0);\n        quantity = wei_value / prices[key];\n    }\n    \n    /// @notice This function sets the price of a unit of a product.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param product_id The id of the product registered in the system.\n    /// @param price_per_unit The price paid for a unit of the given product.\n    function setUnitPrice(address vendor, uint256 product_id, uint256 price_per_unit) public {\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\n        prices[key] = price_per_unit;\n        \n        emit PriceSet(product_id, vendor, price_per_unit);\n    }\n}",
    "tags":
    [
      "market",
      "supply chain"
    ],
    "timestamp":
    {
      "$date":
      {
        "$numberLong": "1538904358266"
      }
    }
  },
  {
    "_id":   "5bb9fe2225cdcdcf150217b3" ,
    "name": "VendorPricesPP",
    "solsource": "pragma solidity ^0.4.24;\n\n/// @title Vendor Prices contract. This is where vendors register their product prices in the system. \n/// @notice This is where vendors register their product prices in the system. \ncontract VendorPricesPP {\n    mapping (bytes32 => uint256) public prices;\n    \n    event PriceSet(uint256 product_id, address vendor, uint256 price_per_unit);\n    \n    constructor() public {\n        setUnitPrice(msg.sender, 1, 10);\n    }\n    \n    /// @notice This function calculated the product quantity for a certain product and vendor price.\n    /// @param product_id The id of the product registered in the system.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param wei_value The total amount of WEI that the buyer wants to pay for the product.\n    /// @return quantity The quantity of product that `wei_value` can buy from a vendor.\n    function calculateQuantity(uint256 product_id, address vendor, uint256 wei_value) view public returns (uint256 quantity) {\n        require(wei_value > 0);\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\n        require(prices[key] > 0);\n        quantity = wei_value / prices[key];\n    }\n    \n    /// @notice This function sets the price of a unit of a product.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param product_id The id of the product registered in the system.\n    /// @param price_per_unit The price paid for a unit of the given product.\n    function setUnitPrice(address vendor, uint256 product_id, uint256 price_per_unit) public {\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\n        prices[key] = price_per_unit;\n        \n        emit PriceSet(product_id, vendor, price_per_unit);\n    }\n}",
    "jssource": "",
    "timestamp":
    {
      "$date":
      {
        "$numberLong": "1538915874179"
      }
    },
    "abi":
    [
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      }
    ],
    "bytecode": "608060405234801561001057600080fd5b5061002d336001600a610032640100000000026401000000009004565b610193565b60008383604051602001808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401828152602001925050506040516020818303038152906040526040518082805190602001908083835b6020831015156100cc57805182526020820191506020810190506020830392506100a7565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050816000808360001916600019168152602001908152602001600020819055507f897067d69d8599f561aaa211b7f688922d15fe296be5d957b5313de9f0d13cdc838584604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a150505050565b61043a806101a26000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360846bc61461005c57806369726205146100a157806369739c89146100f8575b600080fd5b34801561006857600080fd5b5061008b6004803603810190808035600019169060200190929190505050610163565b6040518082815260200191505060405180910390f35b3480156100ad57600080fd5b506100f6600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291908035906020019092919050505061017b565b005b34801561010457600080fd5b5061014d60048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506102dc565b6040518082815260200191505060405180910390f35b60006020528060005260406000206000915090505481565b60008383604051602001808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401828152602001925050506040516020818303038152906040526040518082805190602001908083835b60208310151561021557805182526020820191506020810190506020830392506101f0565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050816000808360001916600019168152602001908152602001600020819055507f897067d69d8599f561aaa211b7f688922d15fe296be5d957b5313de9f0d13cdc838584604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a150505050565b6000806000831115156102ee57600080fd5b8385604051602001808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401828152602001925050506040516020818303038152906040526040518082805190602001908083835b6020831015156103865780518252602082019150602081019050602083039250610361565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040518091039020905060008060008360001916600019168152602001908152602001600020541115156103de57600080fd5b6000808260001916600019168152602001908152602001600020548381151561040357fe5b0491505093925050505600a165627a7a723058208787c87050d818c1fb407b2a525a266ba3ae94bc6b3951605ef147daf85df38c0029",
    "devdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "params":
          {
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor.",
            "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
          },
          "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "params":
          {
            "price_per_unit": "The price paid for a unit of the given product.",
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor."
          }
        }
      },
      "title": "Vendor Prices contract. This is where vendors register their product prices in the system. "
    },
    "userdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "notice": "This function calculated the product quantity for a certain product and vendor price."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "notice": "This function sets the price of a unit of a product."
        }
      }
    }
  },
  {
    "_id":   "5bba035845adbae4ce4c116c" ,
    "name": "VendorPricesBB",
    "solsource": "pragma solidity ^0.4.24;\n\n/// @title Vendor Prices contract. This is where vendors register their product prices in the system. \n/// @notice This is where vendors register their product prices in the system. \ncontract VendorPricesBB {\n    mapping (bytes32 => uint256) public prices;\n    \n    event PriceSet(uint256 product_id, address vendor, uint256 price_per_unit);\n    \n    constructor() public {\n        setUnitPrice(msg.sender, 1, 10);\n    }\n    \n    /// @notice This function calculated the product quantity for a certain product and vendor price.\n    /// @param product_id The id of the product registered in the system.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param wei_value The total amount of WEI that the buyer wants to pay for the product.\n    /// @return quantity The quantity of product that `wei_value` can buy from a vendor.\n    function calculateQuantity(uint256 product_id, address vendor, uint256 wei_value) view public returns (uint256 quantity) {\n        require(wei_value > 0);\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\n        require(prices[key] > 0);\n        quantity = wei_value / prices[key];\n    }\n    \n    /// @notice This function sets the price of a unit of a product.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param product_id The id of the product registered in the system.\n    /// @param price_per_unit The price paid for a unit of the given product.\n    function setUnitPrice(address vendor, uint256 product_id, uint256 price_per_unit) public {\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\n        prices[key] = price_per_unit;\n        \n        emit PriceSet(product_id, vendor, price_per_unit);\n    }\n}",
    "jssource": "",
    "timestamp":
    {
      "$date":
      {
        "$numberLong": "1538917208238"
      }
    },
    "abi":
    [
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      }
    ],
    "bytecode": "608060405234801561001057600080fd5b5061002d336001600a610032640100000000026401000000009004565b610193565b60008383604051602001808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401828152602001925050506040516020818303038152906040526040518082805190602001908083835b6020831015156100cc57805182526020820191506020810190506020830392506100a7565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050816000808360001916600019168152602001908152602001600020819055507f897067d69d8599f561aaa211b7f688922d15fe296be5d957b5313de9f0d13cdc838584604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a150505050565b61043a806101a26000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360846bc61461005c57806369726205146100a157806369739c89146100f8575b600080fd5b34801561006857600080fd5b5061008b6004803603810190808035600019169060200190929190505050610163565b6040518082815260200191505060405180910390f35b3480156100ad57600080fd5b506100f6600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291908035906020019092919050505061017b565b005b34801561010457600080fd5b5061014d60048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506102dc565b6040518082815260200191505060405180910390f35b60006020528060005260406000206000915090505481565b60008383604051602001808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401828152602001925050506040516020818303038152906040526040518082805190602001908083835b60208310151561021557805182526020820191506020810190506020830392506101f0565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050816000808360001916600019168152602001908152602001600020819055507f897067d69d8599f561aaa211b7f688922d15fe296be5d957b5313de9f0d13cdc838584604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a150505050565b6000806000831115156102ee57600080fd5b8385604051602001808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401828152602001925050506040516020818303038152906040526040518082805190602001908083835b6020831015156103865780518252602082019150602081019050602083039250610361565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040518091039020905060008060008360001916600019168152602001908152602001600020541115156103de57600080fd5b6000808260001916600019168152602001908152602001600020548381151561040357fe5b0491505093925050505600a165627a7a723058204f8cc27414991a9f356c7f9ae9a1b58e0dfaafa8b01ecdf51d6217e6aa8eb8b40029",
    "devdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "params":
          {
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor.",
            "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
          },
          "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "params":
          {
            "price_per_unit": "The price paid for a unit of the given product.",
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor."
          }
        }
      },
      "title": "Vendor Prices contract. This is where vendors register their product prices in the system. "
    },
    "userdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "notice": "This function calculated the product quantity for a certain product and vendor price."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "notice": "This function sets the price of a unit of a product."
        }
      }
    }
  },
  {
    "_id":   "5bba0ac145adbae4ce4c1172" ,
    "name": "VendorPricesCC",
    "solsource": "pragma solidity ^0.4.24;\n\n/// @title Vendor Prices contract. This is where vendors register their product prices in the system. \n/// @notice This is where vendors register their product prices in the system. \ncontract VendorPricesCC {\n    mapping (bytes32 => uint256) public prices;\n    \n    event PriceSet(uint256 product_id, address vendor, uint256 price_per_unit);\n    \n    constructor() public {\n        setUnitPrice(msg.sender, 1, 10);\n    }\n    \n    /// @notice This function calculated the product quantity for a certain product and vendor price.\n    /// @param product_id The id of the product registered in the system.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param wei_value The total amount of WEI that the buyer wants to pay for the product.\n    /// @return quantity The quantity of product that `wei_value` can buy from a vendor.\n    function calculateQuantity(uint256 product_id, address vendor, uint256 wei_value) view public returns (uint256 quantity) {\n        require(wei_value > 0);\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\n        require(prices[key] > 0);\n        quantity = wei_value / prices[key];\n    }\n    \n    /// @notice This function sets the price of a unit of a product.\n    /// @param vendor The Ethereum address of the vendor.\n    /// @param product_id The id of the product registered in the system.\n    /// @param price_per_unit The price paid for a unit of the given product.\n    function setUnitPrice(address vendor, uint256 product_id, uint256 price_per_unit) public {\n        bytes32 key = keccak256(abi.encodePacked(vendor, product_id));\n        prices[key] = price_per_unit;\n        \n        emit PriceSet(product_id, vendor, price_per_unit);\n    }\n}",
    "jssource": "",
    "timestamp":
    {
      "$date":
      {
        "$numberLong": "1538919105913"
      }
    },
    "abi":
    [
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      }
    ],
    "bytecode": "608060405234801561001057600080fd5b5061002d336001600a610032640100000000026401000000009004565b610193565b60008383604051602001808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401828152602001925050506040516020818303038152906040526040518082805190602001908083835b6020831015156100cc57805182526020820191506020810190506020830392506100a7565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050816000808360001916600019168152602001908152602001600020819055507f897067d69d8599f561aaa211b7f688922d15fe296be5d957b5313de9f0d13cdc838584604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a150505050565b61043a806101a26000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360846bc61461005c57806369726205146100a157806369739c89146100f8575b600080fd5b34801561006857600080fd5b5061008b6004803603810190808035600019169060200190929190505050610163565b6040518082815260200191505060405180910390f35b3480156100ad57600080fd5b506100f6600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291908035906020019092919050505061017b565b005b34801561010457600080fd5b5061014d60048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506102dc565b6040518082815260200191505060405180910390f35b60006020528060005260406000206000915090505481565b60008383604051602001808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401828152602001925050506040516020818303038152906040526040518082805190602001908083835b60208310151561021557805182526020820191506020810190506020830392506101f0565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050816000808360001916600019168152602001908152602001600020819055507f897067d69d8599f561aaa211b7f688922d15fe296be5d957b5313de9f0d13cdc838584604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a150505050565b6000806000831115156102ee57600080fd5b8385604051602001808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401828152602001925050506040516020818303038152906040526040518082805190602001908083835b6020831015156103865780518252602082019150602081019050602083039250610361565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040518091039020905060008060008360001916600019168152602001908152602001600020541115156103de57600080fd5b6000808260001916600019168152602001908152602001600020548381151561040357fe5b0491505093925050505600a165627a7a723058206bbf8c125322eeb5bcacb0c31435f5d9ddfc1c965675f9ef4f0607eefb2589020029",
    "devdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "params":
          {
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor.",
            "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
          },
          "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "params":
          {
            "price_per_unit": "The price paid for a unit of the given product.",
            "product_id": "The id of the product registered in the system.",
            "vendor": "The Ethereum address of the vendor."
          }
        }
      },
      "title": "Vendor Prices contract. This is where vendors register their product prices in the system. "
    },
    "userdoc":
    {
      "methods":
      {
        "calculateQuantity(uint256,address,uint256)":
        {
          "notice": "This function calculated the product quantity for a certain product and vendor price."
        },
        "setUnitPrice(address,uint256,uint256)":
        {
          "notice": "This function sets the price of a unit of a product."
        }
      }
    }
  },

  {
    "_id":   "5bb54c23cbd77bc8f07afce3" ,
    "name": "PipeOS",
    "solsource": "",
    "jssource": "",
    "timestamp":
    {
      "$date":
      {
        "$numberLong": "1538919105913"
      }
    },
    "abi":
    [
      {
        "constant": true,
        "inputs": [
            {
                "name": "in",
                "type": "*"
            }
        ],
        "name": "PortOut",
        "outputs": [],
        "payable": false,
        "stateMutability": "view",
        "type": "port"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "PortIn",
        "outputs": [
            {
                "name": "out",
                "type": "*"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "port"
        }
    ],
    "bytecode": "",
    "devdoc":
    {
      "methods":
      {      },
      "title": "PipeOS Utils."
    },
    "userdoc":
    {
      "methods":
      {

      }
    }
  }
]

const functions = [
    {
      "_id":  "5bb7f015a06fd6ff93fb96e5" ,
      "containerid": "5bb7f015a06fd6ff93fb96e4",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "signature": "prices(bytes32)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f015a06fd6ff93fb96e6" ,
      "containerid": "5bb7f015a06fd6ff93fb96e4",
      "abiObj":
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "price_per_unit": "The price paid for a unit of the given product.",
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor."
        }
      },
      "userdoc":
      {
        "notice": "This function sets the price of a unit of a product."
      },
      "signature": "setUnitPrice(address,uint256,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f015a06fd6ff93fb96e7" ,
      "containerid": "5bb7f015a06fd6ff93fb96e4",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor.",
          "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
        },
        "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
      },
      "userdoc":
      {
        "notice": "This function calculated the product quantity for a certain product and vendor price."
      },
      "signature": "calculateQuantity(uint256,address,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f015a06fd6ff93fb96e8" ,
      "containerid": "5bb7f015a06fd6ff93fb96e4",
      "abiObj":
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      "signature": "undefined()",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f015a06fd6ff93fb96e9" ,
      "containerid": "5bb7f015a06fd6ff93fb96e4",
      "abiObj":
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      },
      "signature": "PriceSet(uint256,address,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f09aa06fd6ff93fb96eb" ,
      "containerid": "5bb7f09aa06fd6ff93fb96ea",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          }
        ],
        "name": "getVendor",
        "outputs":
        [
          {
            "name": "vendor",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "product_id": "The id of the product registered in the system."
        },
        "return": "vendor The Ethereum address of the vendor."
      },
      "userdoc":
      {
        "notice": "This function returns an available vendor for a given product"
      },
      "signature": "getVendor(uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f09aa06fd6ff93fb96ec" ,
      "containerid": "5bb7f09aa06fd6ff93fb96ea",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "table",
        "outputs":
        [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "signature": "table(uint256,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f09aa06fd6ff93fb96ed" ,
      "containerid": "5bb7f09aa06fd6ff93fb96ea",
      "abiObj":
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          }
        ],
        "name": "registerVendor",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor."
        }
      },
      "userdoc":
      {
        "notice": "This function registers a vendor in the system, for the given product."
      },
      "signature": "registerVendor(address,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f09aa06fd6ff93fb96ee" ,
      "containerid": "5bb7f09aa06fd6ff93fb96ea",
      "abiObj":
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      "signature": "undefined()",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f09aa06fd6ff93fb96ef" ,
      "containerid": "5bb7f09aa06fd6ff93fb96ea",
      "abiObj":
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          }
        ],
        "name": "VendorRegistered",
        "type": "event"
      },
      "signature": "VendorRegistered(uint256,address)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0c1a06fd6ff93fb96f1" ,
      "containerid": "5bb7f0c1a06fd6ff93fb96f0",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          }
        ],
        "name": "getQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor."
        },
        "return": "quantity The amount of the product that the vendor has available for purchase."
      },
      "userdoc":
      {
        "notice": "This function returns the quantity of product that a registered vendor has available for purchase."
      },
      "signature": "getQuantity(address,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0c1a06fd6ff93fb96f2" ,
      "containerid": "5bb7f0c1a06fd6ff93fb96f0",
      "abiObj":
      {
        "constant": true,
        "inputs": [],
        "name": "prices_contract",
        "outputs":
        [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "signature": "prices_contract()",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0c1a06fd6ff93fb96f3" ,
      "containerid": "5bb7f0c1a06fd6ff93fb96f0",
      "abiObj":
      {
        "constant": true,
        "inputs": [],
        "name": "registration_contract",
        "outputs":
        [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "signature": "registration_contract()",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0c1a06fd6ff93fb96f4" ,
      "containerid": "5bb7f0c1a06fd6ff93fb96f0",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "available_quantities",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "signature": "available_quantities(bytes32)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0c1a06fd6ff93fb96f5" ,
      "containerid": "5bb7f0c1a06fd6ff93fb96f0",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          }
        ],
        "name": "getKey",
        "outputs":
        [
          {
            "name": "key",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "devdoc":
      {
        "details": "This function returns the key for the available_quantities mapping",
        "params":
        {
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor."
        },
        "return": "key The key for the available_quantities mapping"
      },
      "signature": "getKey(address,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0c1a06fd6ff93fb96f6" ,
      "containerid": "5bb7f0c1a06fd6ff93fb96f0",
      "abiObj":
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "buyer",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "name": "buy",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "buyer": "The Ethereum address of the buyer.",
          "product_id": "The id of the product registered in the system.",
          "quantity": "The amount of product that the user wants to buy.",
          "vendor": "The Ethereum address of the vendor."
        }
      },
      "userdoc":
      {
        "notice": "This function allows a user to buy a product from a registered vendor."
      },
      "signature": "buy(address,address,uint256,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0c1a06fd6ff93fb96f7" ,
      "containerid": "5bb7f0c1a06fd6ff93fb96f0",
      "abiObj":
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "name": "setQuantity",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "product_id": "The id of the product registered in the system.",
          "quantity": "The amount of product that the vendor has available for purchase.",
          "vendor": "The Ethereum address of the vendor."
        }
      },
      "userdoc":
      {
        "notice": "This function sets the quantity of a product that a registered vendor has available for purchase."
      },
      "signature": "setQuantity(address,uint256,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0c1a06fd6ff93fb96f8" ,
      "containerid": "5bb7f0c1a06fd6ff93fb96f0",
      "abiObj":
      {
        "inputs":
        [
          {
            "name": "registration_address",
            "type": "address"
          },
          {
            "name": "prices_address",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      "signature": "undefined(address,address)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0c1a06fd6ff93fb96f9" ,
      "containerid": "5bb7f0c1a06fd6ff93fb96f0",
      "abiObj":
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "quantity",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "buyer",
            "type": "address"
          }
        ],
        "name": "MarketBuy",
        "type": "event"
      },
      "signature": "MarketBuy(address,uint256,uint256,address)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0c1a06fd6ff93fb96fa" ,
      "containerid": "5bb7f0c1a06fd6ff93fb96f0",
      "abiObj":
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "name": "QuantitySet",
        "type": "event"
      },
      "signature": "QuantitySet(address,uint256,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0d9a06fd6ff93fb96fc" ,
      "containerid": "5bb7f0d9a06fd6ff93fb96fb",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "input_address",
            "type": "address"
          }
        ],
        "name": "pipe_address",
        "outputs":
        [
          {
            "name": "output_address",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "input_address": "The input to be returned as output."
        },
        "return": "output_address Same as the input."
      },
      "userdoc":
      {
        "notice": "This function returns it's input."
      },
      "signature": "pipe_address(address)",
      "tags":
      [
        "market",
        "supply chain",
        "governance"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0d9a06fd6ff93fb96fd" ,
      "containerid": "5bb7f0d9a06fd6ff93fb96fb",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "input_bytes32",
            "type": "bytes32"
          }
        ],
        "name": "pipe_bytes32",
        "outputs":
        [
          {
            "name": "output_bytes32",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "input_bytes32": "The input to be returned as output."
        },
        "return": "output_bytes32 Same as the input."
      },
      "userdoc":
      {
        "notice": "This function returns it's input."
      },
      "signature": "pipe_bytes32(bytes32)",
      "tags":
      [
        "market",
        "supply chain",
        "governance"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb7f0d9a06fd6ff93fb96fe" ,
      "containerid": "5bb7f0d9a06fd6ff93fb96fb",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "input_uint",
            "type": "uint256"
          }
        ],
        "name": "pipe_uint256",
        "outputs":
        [
          {
            "name": "output_uint",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "input_uint": "The input to be returned as output."
        },
        "return": "output_uint Same as the input."
      },
      "userdoc":
      {
        "notice": "This function returns it's input."
      },
      "signature": "pipe_uint256(uint256)",
      "tags":
      [
        "market",
        "supply chain",
        "governance"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538776890317"
        }
      }
    },
    {
      "_id":  "5bb87b6c09bf163c5e6ce66c" ,
      "containerid": "5bb87b6c09bf163c5e6ce66b",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "signature": "prices(bytes32)",
      "tags":
      [
        "governance",
        "market"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538816876154"
        }
      }
    },
    {
      "_id":  "5bb87b6c09bf163c5e6ce66d" ,
      "containerid": "5bb87b6c09bf163c5e6ce66b",
      "abiObj":
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "price_per_unit": "The price paid for a unit of the given product.",
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor."
        }
      },
      "userdoc":
      {
        "notice": "This function sets the price of a unit of a product."
      },
      "signature": "setUnitPrice(address,uint256,uint256)",
      "tags":
      [
        "governance",
        "market"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538816876154"
        }
      }
    },
    {
      "_id":  "5bb87b6c09bf163c5e6ce66e" ,
      "containerid": "5bb87b6c09bf163c5e6ce66b",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor.",
          "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
        },
        "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
      },
      "userdoc":
      {
        "notice": "This function calculated the product quantity for a certain product and vendor price."
      },
      "signature": "calculateQuantity(uint256,address,uint256)",
      "tags":
      [
        "governance",
        "market"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538816876154"
        }
      }
    },
    {
      "_id":  "5bb87b6c09bf163c5e6ce66f" ,
      "containerid": "5bb87b6c09bf163c5e6ce66b",
      "abiObj":
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      "signature": "undefined()",
      "tags":
      [
        "governance",
        "market"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538816876154"
        }
      }
    },
    {
      "_id":  "5bb87b6c09bf163c5e6ce670" ,
      "containerid": "5bb87b6c09bf163c5e6ce66b",
      "abiObj":
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      },
      "signature": "PriceSet(uint256,address,uint256)",
      "tags":
      [
        "governance",
        "market"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538816876154"
        }
      }
    },
    {
      "_id":  "5bb9e02e97d3fc2b627579f0" ,
      "containerid": "5bb9e02e97d3fc2b627579ef",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "signature": "prices(bytes32)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538904358266"
        }
      }
    },
    {
      "_id":  "5bb9e02e97d3fc2b627579f1" ,
      "containerid": "5bb9e02e97d3fc2b627579ef",
      "abiObj":
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "price_per_unit": "The price paid for a unit of the given product.",
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor."
        }
      },
      "userdoc":
      {
        "notice": "This function sets the price of a unit of a product."
      },
      "signature": "setUnitPrice(address,uint256,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538904358266"
        }
      }
    },
    {
      "_id":  "5bb9e02e97d3fc2b627579f2" ,
      "containerid": "5bb9e02e97d3fc2b627579ef",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor.",
          "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
        },
        "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
      },
      "userdoc":
      {
        "notice": "This function calculated the product quantity for a certain product and vendor price."
      },
      "signature": "calculateQuantity(uint256,address,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538904358266"
        }
      }
    },
    {
      "_id":  "5bb9e02f97d3fc2b627579f3" ,
      "containerid": "5bb9e02e97d3fc2b627579ef",
      "abiObj":
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      "signature": "undefined()",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538904358266"
        }
      }
    },
    {
      "_id":  "5bb9e02f97d3fc2b627579f4" ,
      "containerid": "5bb9e02e97d3fc2b627579ef",
      "abiObj":
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      },
      "signature": "PriceSet(uint256,address,uint256)",
      "tags":
      [
        "market",
        "supply chain"
      ],
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538904358266"
        }
      }
    },
    {
      "_id":  "5bb9febd45adbae4ce4c1167" ,
      "containerid": "5bb9fe2225cdcdcf150217b3",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "signature": "prices(bytes32)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538915874179"
        }
      }
    },
    {
      "_id":  "5bb9febd45adbae4ce4c1168" ,
      "containerid": "5bb9fe2225cdcdcf150217b3",
      "abiObj":
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "price_per_unit": "The price paid for a unit of the given product.",
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor."
        }
      },
      "userdoc":
      {
        "notice": "This function sets the price of a unit of a product."
      },
      "signature": "setUnitPrice(address,uint256,uint256)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538915874179"
        }
      }
    },
    {
      "_id":  "5bb9febe45adbae4ce4c1169" ,
      "containerid": "5bb9fe2225cdcdcf150217b3",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor.",
          "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
        },
        "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
      },
      "userdoc":
      {
        "notice": "This function calculated the product quantity for a certain product and vendor price."
      },
      "signature": "calculateQuantity(uint256,address,uint256)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538915874179"
        }
      }
    },
    {
      "_id":  "5bb9febe45adbae4ce4c116a" ,
      "containerid": "5bb9fe2225cdcdcf150217b3",
      "abiObj":
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      "signature": "undefined()",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538915874179"
        }
      }
    },
    {
      "_id":  "5bb9febe45adbae4ce4c116b" ,
      "containerid": "5bb9fe2225cdcdcf150217b3",
      "abiObj":
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      },
      "signature": "PriceSet(uint256,address,uint256)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538915874179"
        }
      }
    },
    {
      "_id":  "5bba0aa845adbae4ce4c116d" ,
      "containerid": "5bba035845adbae4ce4c116c",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "signature": "prices(bytes32)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538917208238"
        }
      }
    },
    {
      "_id":  "5bba0aa845adbae4ce4c116e" ,
      "containerid": "5bba035845adbae4ce4c116c",
      "abiObj":
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "price_per_unit": "The price paid for a unit of the given product.",
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor."
        }
      },
      "userdoc":
      {
        "notice": "This function sets the price of a unit of a product."
      },
      "signature": "setUnitPrice(address,uint256,uint256)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538917208238"
        }
      }
    },
    {
      "_id":  "5bba0aa845adbae4ce4c116f" ,
      "containerid": "5bba035845adbae4ce4c116c",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor.",
          "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
        },
        "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
      },
      "userdoc":
      {
        "notice": "This function calculated the product quantity for a certain product and vendor price."
      },
      "signature": "calculateQuantity(uint256,address,uint256)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538917208238"
        }
      }
    },
    {
      "_id":  "5bba0aa845adbae4ce4c1170" ,
      "containerid": "5bba035845adbae4ce4c116c",
      "abiObj":
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      "signature": "undefined()",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538917208238"
        }
      }
    },
    {
      "_id":  "5bba0aa845adbae4ce4c1171" ,
      "containerid": "5bba035845adbae4ce4c116c",
      "abiObj":
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      },
      "signature": "PriceSet(uint256,address,uint256)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538917208238"
        }
      }
    },
    {
      "_id":  "5bba0aed32268e682b134b02" ,
      "containerid": "5bba0ac145adbae4ce4c1172",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "prices",
        "outputs":
        [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "signature": "prices(bytes32)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538919105913"
        }
      }
    },
    {
      "_id":  "5bba0aed32268e682b134b03" ,
      "containerid": "5bba0ac145adbae4ce4c1172",
      "abiObj":
      {
        "constant": false,
        "inputs":
        [
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "setUnitPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "price_per_unit": "The price paid for a unit of the given product.",
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor."
        }
      },
      "userdoc":
      {
        "notice": "This function sets the price of a unit of a product."
      },
      "signature": "setUnitPrice(address,uint256,uint256)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538919105913"
        }
      }
    },
    {
      "_id":  "5bba0aed32268e682b134b04" ,
      "containerid": "5bba0ac145adbae4ce4c1172",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "product_id",
            "type": "uint256"
          },
          {
            "name": "vendor",
            "type": "address"
          },
          {
            "name": "wei_value",
            "type": "uint256"
          }
        ],
        "name": "calculateQuantity",
        "outputs":
        [
          {
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      "devdoc":
      {
        "params":
        {
          "product_id": "The id of the product registered in the system.",
          "vendor": "The Ethereum address of the vendor.",
          "wei_value": "The total amount of WEI that the buyer wants to pay for the product."
        },
        "return": "quantity The quantity of product that `wei_value` can buy from a vendor."
      },
      "userdoc":
      {
        "notice": "This function calculated the product quantity for a certain product and vendor price."
      },
      "signature": "calculateQuantity(uint256,address,uint256)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538919105913"
        }
      }
    },
    {
      "_id":  "5bba0aed32268e682b134b05" ,
      "containerid": "5bba0ac145adbae4ce4c1172",
      "abiObj":
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      "signature": "undefined()",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538919105913"
        }
      }
    },
    {
      "_id": "5bba0aed32268e682b134b06" ,
      "containerid": "5bba0ac145adbae4ce4c1172",
      "abiObj":
      {
        "anonymous": false,
        "inputs":
        [
          {
            "indexed": false,
            "name": "product_id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "vendor",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "price_per_unit",
            "type": "uint256"
          }
        ],
        "name": "PriceSet",
        "type": "event"
      },
      "signature": "PriceSet(uint256,address,uint256)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538919105913"
        }
      }
    },
    {
      "_id": "5bb70817738d090ce531e760",
      "containerid": "5bb54c23cbd77bc8f07afce3",
      "abiObj":
      {
        "constant": true,
        "inputs": [],
        "name": "PortIn",
        "outputs":
        [
          {
            "name": "out",
            "type": "*"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "port"
      },
      "signature": "PortIn()",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538919105913"
        }
      }
    },
    {
      "_id": "5bb70817738d090ce531e761",
      "containerid": "5bb54c23cbd77bc8f07afce3",
      "abiObj":
      {
        "constant": true,
        "inputs":
        [
          {
            "name": "in",
            "type": "*"
          }
        ],
        "name": "PortOut",
        "outputs": [],
        "payable": false,
        "stateMutability": "view",
        "type": "port"
      },
      "signature": "PortOut(*)",
      "timestamp":
      {
        "$date":
        {
          "$numberLong": "1538919105913"
        }
      }
    }
  ]

const graphh = {
    "_id": "5bae6999e4a589fae995349",
    "n": [
        {
            "i": 2003,
            "id": "5bba0aed32268e682b134b04"
        },
        {
            "i": 2006,
            "id": "5bba0aed32268e682b134b04"
        },
        {
            "i": 2008,
            "id": "5bba0aa845adbae4ce4c1171"
        },
        {
            "i": 2011,
            "id": "5bba0aa845adbae4ce4c116f"
        }
    ],
    "e": [
        [ 2006,1,2003,1],
        [2006,1,2003,3],
        [2011, 1, 2006,1 ]

    ]

}

export {contracts, functions, graphh}
