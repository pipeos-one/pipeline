export const ports = [
  {
    _id: '5bc59e192817116e84bdd830',
    pclassid: '5bc59d5d2817116e84bdd82e',
    pclass: {name: 'PipeOS'},
    pfunction: {
      gapi: {
        constant: true,
        inputs: [
          {
            name: 'in',
            type: '*',
          },
        ],
        name: 'PortOut',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'port',
      },
      signature: 'PortOut(*)',
    },
    timestamp: '2018-10-16T08:10:33.614Z',
  },
  {
    _id: '5bc59e192817116e84bdd831',
    pclassid: '5bc59d5d2817116e84bdd82e',
    pclass: {name: 'PipeOS'},
    pfunction: {
      gapi: {
        constant: true,
        inputs: [],
        name: 'PortIn',
        outputs: [
          {
            name: 'out',
            type: '*',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'port',
      },
      signature: 'PortIn()',
    },
    timestamp: '2018-10-16T08:10:33.614Z',
  },
  {
    _id: '5bc59e192817116e84bdd832',
    pclassid: '5bc59d5d2817116e84bdd82e',
    pclass: {name: 'PipeOS'},
    pfunction: {
      gapi: {
        constant: true,
        inputs: [],
        name: 'MsgData',
        outputs: [
          {
            name: 'data',
            type: 'bytes',
          },
          {
            name: 'sender',
            type: 'address',
          },
          {
            name: 'sig',
            type: 'bytes4',
          },
          {
            name: 'value',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'data',
      },
      signature: 'MsgData()',
    },
    timestamp: '2018-10-16T08:10:33.614Z',
  },
  {
    _id: '5bc59e192817116e84bdd833',
    pclassid: '5bc59d5d2817116e84bdd82e',
    pclass: {name: 'PipeOS'},
    pfunction: {
      gapi: {
        constant: true,
        inputs: [],
        name: 'BlockData',
        outputs: [
          {
            name: 'coinbase',
            type: 'address',
          },
          {
            name: 'dificulty',
            type: 'uint256',
          },
          {
            name: 'gaslimit',
            type: 'uint256',
          },
          {
            name: 'number',
            type: 'uint256',
          },
          {
            name: 'timestamp',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'data',
      },
      signature: 'BlockData()',
    },
    timestamp: '2018-10-16T08:10:33.614Z',
  },
  {
    _id: '5bc59e192817116e84bdd834',
    pclassid: '5bc59d5d2817116e84bdd82e',
    pclass: {name: 'PipeOS'},
    pfunction: {
      gapi: {
        constant: true,
        inputs: [],
        name: 'MiscData',
        outputs: [
          {
            name: 'gasleft',
            type: 'uint256',
          },
          {
            name: 'now',
            type: 'uint256',
          },
          {
            name: 'tx.gasprice',
            type: 'uint256',
          },
          {
            name: 'tx.origin',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'data',
      },
      signature: 'MiscData()',
    },
    timestamp: '2018-10-16T08:10:33.614Z',
  },
];

export const containers = [
  {
    _id: '5bc59d5d2817116e84bdd82e',
    name: 'PipeOS',
    pclass: {
      gapi: [{
        constant: true,
        inputs: [{name: 'in', type: '*'}],
        name: 'PortOut',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'port',
      }, {
        constant: true,
        inputs: [],
        name: 'PortIn',
        outputs: [{name: 'out', type: '*'}],
        payable: false,
        stateMutability: 'view',
        type: 'port',
      }],
      natspec: {methods: {}, title: 'PipeOS Utils.'},
      bytecode: '',
      flatsource: ' ',
    },
    timestamp: '2018-10-16T08:10:33.614Z',
  },
];
