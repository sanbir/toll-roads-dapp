pragma solidity ^0.4.13;

import "./interfaces/RegulatorI.sol"; 
import "./TollBoothOperator.sol";

    /*
     * You need to create:
     *
     * - a contract named `Regulator` that:
     *     - is `OwnedI` and `RegulatorI`.
     *     - has a constructor that takes no parameter.
     */ 
contract Regulator is RegulatorI, Owned {

    /**
     * 0: not a vehicle, absence of a vehicle
     * 1 and above: is a vehicle.
     * For instance:
     *   1: motorbike
     *   2: car
     *   3: lorry
     */
     mapping(address => uint) public registeredVehicles;
     mapping(address => bool) public registredOperators;
    /**
     * Called by the owner of the regulator to register a new vehicle with its VehicleType.
     *     It should roll back if the caller is not the owner of the contract.
     *     It should roll back if the arguments mean no change of state.
     *     It should roll back if a 0x vehicle address is passed.
     * @param vehicle The address of the vehicle being registered. This may be an externally
     *   owned account or a contract. The regulator does not care.
     * @param vehicleType The VehicleType of the vehicle being registered.
     *    passing 0 is equivalent to unregistering the vehicle.
     * @return Whether the action was successful.
     * Emits LogVehicleTypeSet
     */
    function setVehicleType(address vehicle, uint vehicleType)
        fromOwner()
        notZeroAddress(vehicle)
        public
        returns(bool success) 
    {
        require(registeredVehicles[vehicle] != vehicleType);

        registeredVehicles[vehicle] = vehicleType;
        LogVehicleTypeSet(msg.sender, vehicle, vehicleType);
        return true;
    }

    /**
     * @param vehicle The address of the registered vehicle.
     * @return The VehicleType of the vehicle whose address was passed. 0 means it is not
     *   a registered vehicle.
     */
    function getVehicleType(address vehicle)
        constant
        public
        returns(uint vehicleType) {

        return registeredVehicles[vehicle];
    }

    /**
     * Called by the owner of the regulator to deploy a new TollBoothOperator onto the network.
     *     It should roll back if the caller is not the owner of the contract.
     *     It should start the TollBoothOperator in the `true` paused state.
     *     It should roll back if the rightful owner argument is the current owner of the regulator.
     * @param owner The rightful owner of the newly deployed TollBoothOperator.
     * @param deposit The initial value of the TollBoothOperator deposit.
     * @return The address of the newly deployed TollBoothOperator.
     * Emits LogTollBoothOperatorCreated.
     */
    function createNewOperator(
            address owner,
            uint deposit)
        fromOwner()
        public
        returns(TollBoothOperatorI newOperator) {
        require(getOwner() != owner);
        newOperator = new TollBoothOperator(true, deposit, owner);
        registredOperators[newOperator] = true;
        LogTollBoothOperatorCreated(msg.sender, newOperator, owner, deposit);
        return newOperator;
    }

    /**
     * Called by the owner of the regulator to remove a previously deployed TollBoothOperator from
     * the list of approved operators.
     *     It should roll back if the caller is not the owner of the contract.
     *     It should roll back if the operator is unknown.
     * @param operator The address of the contract to remove.
     * @return Whether the action was successful.
     * Emits LogTollBoothOperatorRemoved.
     */
    function removeOperator(address operator)
        fromOwner()
        public
        returns(bool success) {
        require(registredOperators[operator]);
        registredOperators[operator] = false;
        LogTollBoothOperatorRemoved(msg.sender, operator);
        return true;
    }

    /**
     * @param operator The address of the TollBoothOperator to test.
     * @return Whether the TollBoothOperator is indeed approved.
     */
    function isOperator(address operator)
        constant
        public
        returns(bool indeed) {
        return registredOperators[operator]; 
    }

}