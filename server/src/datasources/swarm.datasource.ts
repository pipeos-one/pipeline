import {juggler} from '@loopback/service-proxy';

const swarmGateway = 'https://swarm-gateways.net';

export const SwarmDataSource: juggler.DataSource = new juggler.DataSource({
  name: 'Swarm',
  connector: 'rest',
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'text/html; charset=utf-8',
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
        body: '{^content}',
        headers: {
          accept: 'text/html',
          'content-type': 'text/plain; charset=utf-8',
        },
        responsePath: '$',
      },
      functions: {
        postText: ['content'],
      },
    },
    {
      template: {
        method: 'POST',
        url: `${swarmGateway}/bzz-raw:/`,
        form: '{^content}',
        headers: {
            accept: "application/json",
            "content-type": "application/json"
        },
        responsePath: '$',
      },
      functions: {
        postJson: ['content'],
      },
    },
  ],
});
