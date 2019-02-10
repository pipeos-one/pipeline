import {inject} from '@loopback/core';
import {juggler, AnyObject} from '@loopback/repository';
const config = require('./atlasmongo.datasource.json');

export class AtlasmongoDataSource extends juggler.DataSource {
  static dataSourceName = 'atlasmongo';

  constructor(
    @inject('datasources.config.atlasmongo', {optional: true})
    dsConfig: AnyObject = config,
  ) {
    super(dsConfig);
  }
}
