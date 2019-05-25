import {PipeosServerApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {CORS} from './config';

export {PipeosServerApplication};

export async function main(options: ApplicationConfig = {}) {
  options = Object.assign(options, {
    rest: {
        host: '127.0.0.1',
        port: 3000,
        cors: CORS,
        apiExplorer: {
            disabled: true,
        },
    }
  });

  const app = new PipeosServerApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
