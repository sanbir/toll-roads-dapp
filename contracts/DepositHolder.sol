pragma solidity ^0.4.13;
import "./interfaces/DepositHolderI.sol";
import "./Owned.sol";
/*
 * You need to create:
 *
 * - a contract named `DepositHolder` that:
 *     - is `OwnedI`, and `DepositHolderI`.
 *     - has a constructor that takes:
 *         - one `uint` parameter, the initial deposit wei value, which cannot be 0.
 */ 
contract DepositHolder is DepositHolderI, Owned {

    uint currentDepositWeis; 

    /**
     * Called by the owner of the DepositHolder.
     *     It should roll back if the caller is not the owner of the contract.
     *     It should roll back if the argument passed is 0.
     *     It should roll back if the argument is no different from the current deposit.
     * @param depositWeis The value of the deposit being set, measure in weis.
     * @return Whether the action was successful.
     * Emits LogDepositSet.
     */
    function setDeposit(uint depositWeis)
        fromOwner()
        public
        returns(bool success) {
        require(depositWeis != 0);
        require(depositWeis != currentDepositWeis);
        currentDepositWeis = depositWeis;
        LogDepositSet(msg.sender, depositWeis);
        return true;
    }

    /**
     * @return The base price, then to be multiplied by the multiplier, a given vehicle
     * needs to deposit to enter the road system.
     */
    function getDeposit()
        constant
        public
        returns(uint weis) {
        return currentDepositWeis;
    }

       
}