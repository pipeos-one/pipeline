import sourceBuilder from '../sourceBuilder';
import web3Builder from '../web3Builder';

import graphFixt from './fixtures/enrichedGraph_fixtures';
import web3BuilderFixt from './fixtures/web3BuilderSource_fixtures';

test('web3Builder_vendorPriceMarketConnected', () => {
  const web3Source = sourceBuilder(web3Builder)(graphFixt.vendorPriceMarketConnected)('function00');

  expect(web3Source.source).toBe(web3BuilderFixt.vendorPriceMarketConnected);
})
