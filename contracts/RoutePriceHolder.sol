pragma solidity ^0.4.13;

import "./interfaces/RoutePriceHolderI.sol";
import "./TollBoothHolder.sol";

    /*
     * You need to create:
     *
     * - a contract named `RoutePriceHolder` that:
     *     - is `OwnedI`, `TollBoothHolderI`, and `RoutePriceHolderI`.
     *     - has a constructor that takes no parameter.
     */

contract RoutePriceHolder is RoutePriceHolderI, TollBoothHolder {

    mapping(address => mapping(address => uint)) routePrices;

    function RoutePriceHolder() TollBoothHolder() {}

    /**
     * Called by the owner of the RoutePriceHolder.
     *     It can be used to update the price of a route, including to zero.
     *     It should roll back if the caller is not the owner of the contract.
     *     It should roll back if one of the booths is not a registered booth.
     *     It should roll back if entry and exit booths are the same.
     *     It should roll back if either booth is a 0x address.
     *     It should roll back if there is no change in price.
     * @param entryBooth The address of the entry booth of the route set.
     * @param exitBooth The address of the exit booth of the route set.
     * @param priceWeis The price in weis of the new route.
     * @return Whether the action was successful.
     * Emits LogPriceSet.
     */
    function setRoutePrice(
            address entryBooth,
            address exitBooth,
            uint priceWeis)
        fromOwner()
        public
        returns(bool success) {
            require(entryBooth != address(0));
            require(exitBooth != address(0));
            require(tollBooths[entryBooth] && tollBooths[exitBooth]);
            require(entryBooth != exitBooth);
            require(routePrices[entryBooth][exitBooth] != priceWeis);
            routePrices[entryBooth][exitBooth] = priceWeis;
            LogRoutePriceSet(msg.sender, entryBooth, exitBooth, priceWeis);
            return true;
        }

    /**
     * @param entryBooth The address of the entry booth of the route.
     * @param exitBooth The address of the exit booth of the route.
     * @return priceWeis The price in weis of the route.
     *     If the route is not known or if any address is not a booth it should return 0.
     *     If the route is invalid, it should return 0.
     */
    function getRoutePrice(
            address entryBooth,
            address exitBooth)
        constant
        public
        returns(uint priceWeis) {

        return routePrices[entryBooth][exitBooth];
    }

}