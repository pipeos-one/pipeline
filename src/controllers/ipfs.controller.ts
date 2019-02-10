import {serviceProxy, GenericService} from '@loopback/service-proxy';

export class Ipfs {
  @serviceProxy('ipfs')
  public ipfs: GenericService;
}
