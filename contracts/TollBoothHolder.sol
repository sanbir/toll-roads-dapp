pragma solidity ^0.4.13;

import "./interfaces/TollBoothHolderI.sol";
import "./Owned.sol";

contract TollBoothHolder is TollBoothHolderI, Owned {

    mapping (address => bool) tollBooths;

    /**
     * Called by the owner of the TollBoothOperator.
     *     It should roll back if the caller is not the owner of the contract.
     *     It should roll back if the argument is already a toll booth.
     *     It should roll back if the argument is a 0x address.
     *     When part of TollBoothOperatorI, it should be possible to add toll booths even when
     *       the contract is paused.
     * @param tollBooth The address of the toll booth being added.
     * @return Whether the action was successful.
     * Emits LogTollBoothAdded
     */
    function addTollBooth(address tollBooth)
        onlyOwner()
        notZeroAddress(tollBooth)
        public
        returns(bool success) {

        require(!tollBooths[tollBooth]);
        tollBooths[tollBooth] = true;
        LogTollBoothAdded(msg.sender, tollBooth);
        return true;
    }

    /**
     * @param tollBooth The address of the toll booth we enquire about.
     * @return Whether the toll booth is indeed part of the operator.
     */
    function isTollBooth(address tollBooth)
        constant
        public
        returns(bool isIndeed) {

        return tollBooths[tollBooth];
    }

    /**
     * Called by the owner of the TollBoothOperator.
     *     It should roll back if the caller is not the owner of the contract.
     *     It should roll back if the argument has already been removed.
     *     It should roll back if the argument is a 0x address.
     *     When part of TollBoothOperatorI, it should be possible to remove toll booth even when
     *       the contract is paused.
     * @param tollBooth The toll booth to remove.
     * @return Whether the action was successful.
     * Emits LogTollBoothRemoved
     */
    function removeTollBooth(address tollBooth)
        onlyOwner()
        notZeroAddress(tollBooth)
        public
        returns(bool success) {

        require(tollBooths[tollBooth]);
        tollBooths[tollBooth] = false;
        LogTollBoothRemoved(msg.sender, tollBooth);
        return true;
    }

    /*
     * You need to create:
     *
     * - a contract named `TollBoothHolder` that:
     *     - is `OwnedI`, `TollBoothHolderI`.
     *     - has a constructor that takes no parameter.
     */         
}