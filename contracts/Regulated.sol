pragma solidity ^0.4.13;

import "./interfaces/RegulatedI.sol";
import "./interfaces/RegulatorI.sol";
/*
 * You need to create:
 *
 * - a contract named `Regulated` that:
 *     - is a `RegulatedI`.
 *     - has a constructor that takes one `address` parameter, the initial regulator, which cannot be 0.
 */
contract Regulated is RegulatedI {

	address currentRegulator;

	function Regulated(address initialRegulator) {
		require(initialRegulator != 0);
		currentRegulator = initialRegulator;
	}

    /**
     * Sets the new regulator for this contract.
     *     It should roll back if any address other than the current regulator of this contract
     *       calls this function.
     *     It should roll back if the new regulator address is 0.
     *     It should roll back if the new regulator is the same as the current regulator.
     * @param newRegulator The new desired regulator of the contract.
     * @return Whether the action was successful.
     * Emits LogRegulatorSet.
     */
    function setRegulator(address newRegulator)
        public
        returns(bool success) {

        require(newRegulator != 0x0);
        require(msg.sender == currentRegulator);
        require(newRegulator != currentRegulator);
        LogRegulatorSet(currentRegulator, newRegulator);
        currentRegulator = newRegulator;
        return true;
    }

    /**
     * @return The current regulator.
     */
    function getRegulator()
        constant
        public
        returns(RegulatorI regulator) {
        return RegulatorI(currentRegulator);
    }

}