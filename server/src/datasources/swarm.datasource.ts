import {juggler} from '@loopback/service-proxy';

const swarmGateway = 'https://swarm-gateways.net';

export const SwarmDataSource: juggler.DataSource = new juggler.DataSource({
  name: 'Swarm',
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
        url: `${swarmGateway}/bzz-raw:/{hash}`,
        responsePath: '$',
      },
      functions: {
        get: ['hash'],
      },
    },
    {
      template: {
        method: 'POST',
        url: `${swarmGateway}/bzz-raw:/`,
        form: '{^content}',
        responsePath: '$',
      },
      functions: {
        post: ['content'],
      },
    },
  ],
});
