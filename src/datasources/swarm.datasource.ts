import {juggler} from '@loopback/service-proxy';

const swarmGateway = 'https://swarm-gateways.net/bzz:/';

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
        url: `${swarmGateway}/{hash}`,
        responsePath: '$',
      },
      functions: {
        get: ['hash'],
      },
    },
  ],
});
