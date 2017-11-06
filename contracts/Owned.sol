pragma solidity ^0.4.13;

import "./interfaces/OwnedI.sol";

contract Owned is OwnedI {
    address owner;

	function Owned() {
		owner = msg.sender;
	}

	/**
     * Sets the new owner for this contract.
     *     It should roll back if the caller is not the current owner.
     *     It should roll back if the argument is the current owner.
     *     It should roll back if the argument is a 0 address.
     * @param newOwner The new owner of the contract
     * @return Whether the action was successful.
     * Emits LogOwnerSet.
     */
    function setOwner(address newOwner) fromOwner() returns(bool) {
    	require(newOwner != owner);
        require(newOwner != 0x0);
    	LogOwnerSet(owner, newOwner);
    	owner = newOwner;
    	return true;
    }

    function getOwner() constant returns(address) {
    	return owner;
    }

    modifier fromOwner() {
     	require(owner == msg.sender);
     	_;
    }



}