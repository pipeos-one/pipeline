import {juggler} from '@loopback/service-proxy';

const ipfsGateway = 'https://ipfs.io/ipfs/';

export const IpfsDataSource: juggler.DataSource = new juggler.DataSource({
  name: 'Ipfs',
  connector: 'rest',
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: `${ipfsGateway}/{hash}`,
        responsePath: '$',
      },
      functions: {
        get: ['hash'],
      },
    },
  ],
});
