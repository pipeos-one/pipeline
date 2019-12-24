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

export default {vendorPriceMarketConnected};
