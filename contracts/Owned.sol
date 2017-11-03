pragma solidity ^0.4.13;

import "./interfaces/OwnedI.sol";

contract Owned is OwnedI{
	adderess owner;

	public Onwed() {
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
    function setOwner(address newOwner) fromOwner() notZeroAddress(newOwner) returns(bool success) {
    	require(newOwner != owner);
    	LogOwnerSet(owner, newOwner);
    	owner = newOwner;
    }

    function getOwner() constant returns(address owner) {
    	return owner;
    }

    modifier fromOwner() {
     	require(owner == msg.sender);
     	_;
    }

    modifier notZeroAddress(address addr) {
    	require(addr != 0x);
    	_;
    }
}