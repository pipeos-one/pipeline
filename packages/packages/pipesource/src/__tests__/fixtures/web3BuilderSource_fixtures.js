const vendorPriceMarketConnected = `function pipedGraph(address_VendorRegistration, address_VendorPrices, address_MarketPlace, provider, signer, ethers) {


  const abi_VendorRegistration = [{"constant":true,"inputs":[{"name":"product_id","type":"uint256"}],"name":"getVendor","outputs":[{"name":"vendor","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
  const VendorRegistration = new ethers.Contract(address_VendorRegistration, abi_VendorRegistration, signer);

  const abi_VendorPrices = [{"constant":true,"inputs":[{"name":"product_id","type":"uint256"},{"name":"vendor","type":"address"},{"name":"wei_value","type":"uint256"}],"name":"calculateQuantity","outputs":[{"name":"quantity","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
  const VendorPrices = new ethers.Contract(address_VendorPrices, abi_VendorPrices, signer);

  const abi_MarketPlace = [{"constant":false,"inputs":[{"name":"vendor","type":"address"},{"name":"buyer","type":"address"},{"name":"product_id","type":"uint256"},{"name":"quantity","type":"uint256"}],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}];
  const MarketPlace = new ethers.Contract(address_MarketPlace, abi_MarketPlace, signer);

  async function function00(product_id_3000_0, WEI_VALUE_3001_0, buyer_3002_0, )
  {
    const vendor_101_0 = await VendorRegistration.getVendor(product_id_3000_0);

    const quantity_102_0 = await VendorPrices.calculateQuantity(product_id_3000_0, vendor_101_0, WEI_VALUE_3001_0);

    const done_103_0 = await MarketPlace.buy(vendor_101_0, buyer_3002_0, product_id_3000_0, quantity_102_0, {value: WEI_VALUE_3001_0});

    return [done_103_0];
  }


  return {function00};
}`;

const priceMarketEvent1 = `function pipedGraph(address_MarketPlace, address_VendorPrices, provider, signer, ethers) {


  const abi_MarketPlace = [{"anonymous":false,"inputs":[],"name":"QuantitySet","type":"event","stateMutability":"nonpayable","outputs":[{"indexed":false,"name":"vendor","type":"address"},{"indexed":false,"name":"product_id","type":"uint256"},{"indexed":false,"name":"quantity","type":"uint256"}]},{"constant":false,"inputs":[{"name":"vendor","type":"address"},{"name":"buyer","type":"address"},{"name":"product_id","type":"uint256"},{"name":"quantity","type":"uint256"}],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}];
  const MarketPlace = new ethers.Contract(address_MarketPlace, abi_MarketPlace, signer);

  const abi_VendorPrices = [{"constant":true,"inputs":[{"name":"product_id","type":"uint256"},{"name":"vendor","type":"address"},{"name":"wei_value","type":"uint256"}],"name":"calculateQuantity","outputs":[{"name":"quantity","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
  const VendorPrices = new ethers.Contract(address_VendorPrices, abi_VendorPrices, signer);

  function function00(buyer_3000_0, wei_value_3002_0, callback)
  {

    const topics = [ethers.utils.id("QuantitySet(address,uint256,uint256)")];
    const filter = {address: MarketPlace.address, topics};

    provider.once(filter, async (result) => {
      const {vendor_101_0, product_id_101_1, quantity_101_2} = ethers.utils.defaultAbiCoder.decode([{"name":"vendor_101_0","type":"address"},{"name":"product_id_101_1","type":"uint256"},{"indexed":false,"name":"quantity_101_2","type":"uint256"}], result.data);


    const quantity_103_0 = await VendorPrices.calculateQuantity(product_id_101_1, vendor_101_0, wei_value_3002_0);

    const done_102_0 = await MarketPlace.buy(vendor_101_0, buyer_3000_0, product_id_101_1, quantity_103_0, {value: wei_value_3002_0});

      callback(quantity_101_2, done_102_0);
    });
  }


  return {function00};
}`

export default {vendorPriceMarketConnected, priceMarketEvent1};
