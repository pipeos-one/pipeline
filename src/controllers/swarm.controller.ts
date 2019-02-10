import {serviceProxy, GenericService} from '@loopback/service-proxy';

export class Swarm {
  @serviceProxy('swarm')
  public swarm: GenericService;
}
