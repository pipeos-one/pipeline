import {Context} from '@loopback/context';
import {Ipfs} from './ipfs.controller';
import {Swarm} from './swarm.controller';
import {IpfsDataSource, SwarmDataSource} from '../datasources';
import {DStorageType} from '../interfaces';

export class DStorageController {
  constructor() {}

  async ipfs() : Promise<Ipfs> {
    const context: Context = new Context();
    context.bind('datasources.ipfs').to(IpfsDataSource);
    context.bind('controllers.Ipfs').toClass(Ipfs);
    return await context.get<Ipfs>(
    'controllers.Ipfs',
    );
  }

  async swarm() : Promise<Swarm> {
    const context: Context = new Context();
    context.bind('datasources.swarm').to(SwarmDataSource);
    context.bind('controllers.Swarm').toClass(Swarm);
    return await context.get<Swarm>(
    'controllers.Swarm',
    );
  }

  async get(type: DStorageType, hash: string): Promise<any> {
    let storage;
    if (type === 'ipfs') {
        storage = await this.ipfs();
        return storage.ipfs.get(hash);
    } else if (type === 'swarm') {
        storage = await this.swarm();
        return storage.swarm.get(hash);
    }
  }
}
