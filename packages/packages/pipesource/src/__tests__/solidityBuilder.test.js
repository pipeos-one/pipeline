import sourceBuilder from '../sourceBuilder';
import solidityBuilder from '../solidityBuilder';

import graphFixt from './fixtures/enrichedGraph_fixtures';
import solidityBuilderFixt from './fixtures/solidityBuilderSource_fixtures';

test('web3Builder_vendorPriceMarketConnected', () => {
  const web3Source = sourceBuilder(solidityBuilder)(graphFixt.vendorPriceMarketConnected)('function00');

  expect(web3Source.source).toBe(solidityBuilderFixt.vendorPriceMarketConnected);
})
