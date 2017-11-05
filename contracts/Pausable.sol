pragma solidity ^0.4.13;

import "./interfaces/PausableI.sol";
import "./Owned.sol";

contract Pausable is PausableI, Owned {

	bool state;

	function Pausable(bool initialState) {
		state = initialState; 
	}

    /**
     * Sets the new paused state for this contract.
     *     It should roll back if the caller is not the current owner of this contract.
     *     It should roll back if the state passed is no different from the current.
     * @param newState The new desired "paused" state of the contract.
     * @return Whether the action was successful.
     * Emits LogPausedSet.
     */
    function setPaused(bool newState) fromOwner() returns(bool success) {
    	require(state != newState);
    	LogPausedSet(msg.sender, state, newState);
    	state = newState;
    }

    /**
     * @return Whether the contract is indeed paused.
     */
    function isPaused() constant returns(bool isIndeed) {
    	return state;
    }

    /*
     * - a contract named `Pausable` that:
     *     - is a `OwnedI` and a `PausableI`.
     *     - has a modifier named `whenPaused` that rolls back the transaction if the
     * contract is in the `false` paused state.
     *     - has a modifier named `whenNotPaused` that rolls back the transaction if the
     * contract is in the `true` paused state.
     *     - has a constructor that takes one `bool` parameter, the initial paused state.
     */

     modifier whenPaused() {
     	require(state);
     	_;
     }

     modifier whenNotPaused() {
     	require(!state);
     	_;
     }
}