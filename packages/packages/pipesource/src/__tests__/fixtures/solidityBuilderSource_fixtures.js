const vendorPriceMarketConnected = `pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

interface VendorRegistrationInterface {
  function getVendor(uint256 product_id)
    external view
    returns (address);
}
interface VendorPricesInterface {
  function calculateQuantity(uint256 product_id, address vendor, uint256 wei_value)
    external view
    returns (uint256);
}
interface MarketPlaceInterface {
  function buy(address vendor, address buyer, uint256 product_id, uint256 quantity)
    external payable;
}


contract PipedContract {
  VendorRegistrationInterface public VendorRegistration;
  VendorPricesInterface public VendorPrices;
  MarketPlaceInterface public MarketPlace;

  constructor(address _VendorRegistration_address, address _VendorPrices_address, address _MarketPlace_address) public {
    VendorRegistration = VendorRegistrationInterface(_VendorRegistration_address);
    VendorPrices = VendorPricesInterface(_VendorPrices_address);
    MarketPlace = MarketPlaceInterface(_MarketPlace_address);
  }

  function function00(uint256 product_id_3000_0, uint256 WEI_VALUE_3001_0, address buyer_3002_0)
    public payable
  {
    address vendor_101_0 = VendorRegistration.getVendor(product_id_3000_0);
    uint256 quantity_102_0 = VendorPrices.calculateQuantity(product_id_3000_0, vendor_101_0, WEI_VALUE_3001_0);
    MarketPlace.buy.value(WEI_VALUE_3001_0)(vendor_101_0, buyer_3002_0, product_id_3000_0, quantity_102_0);
  }

}`;

const priceMarketEvent1 = `pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

interface MarketPlaceInterface {
  function QuantitySet()
    external nonpayable
    returns (address, uint256, uint256);
  function buy(address vendor, address buyer, uint256 product_id, uint256 quantity)
    external payable;
}
interface VendorPricesInterface {
  function calculateQuantity(uint256 product_id, address vendor, uint256 wei_value)
    external view
    returns (uint256);
}


contract PipedContract {
  MarketPlaceInterface public MarketPlace;
  VendorPricesInterface public VendorPrices;

  constructor(address _MarketPlace_address, address _VendorPrices_address) public {
    MarketPlace = MarketPlaceInterface(_MarketPlace_address);
    VendorPrices = VendorPricesInterface(_VendorPrices_address);
  }

  function function00(address buyer_3000_0, uint256 wei_value_3002_0)
    public payable
    returns (uint256)
  {
    (address vendor_101_0, uint256 product_id_101_1, uint256 quantity_101_2) = MarketPlace.QuantitySet();
    uint256 quantity_103_0 = VendorPrices.calculateQuantity(product_id_101_1, vendor_101_0, wei_value_3002_0);
    MarketPlace.buy.value(wei_value_3002_0)(vendor_101_0, buyer_3000_0, product_id_101_1, quantity_103_0);
    return quantity_101_2;
  }

}`;

export default {vendorPriceMarketConnected, priceMarketEvent1};
