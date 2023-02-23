// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { SendAPI } from "@zondax/filecoin-solidity/contracts/v0.8/SendAPI.sol";

/**
 * FilForwarder
 * 
 * This contract is designed as an immutable singleton contract that exposes
 * a single actor call method to send Filecoin from an ethereum-based wallet 
 * to any given address in the filecoin address space. 
 *
 * The user will call this contract's only method as a payable and it will send
 * the entire message value to the user supplied addresss. 
 *
 * This contract should be easily deployed and connected to with web3.js, ethers.js,
 * or any other client that is capable of signing ethereum-based transactions and 
 * connected to the Filecoin network.
 *
 * This contract is also designed to be as gas-efficient as possible, so it holds
 * no state, emits no events, and has no other methods than what is necessary to 
 * successfully and safely facilitate the transfer.
 */
contract FilForwarder {
    /**
     * constructor
     *
     * This method will be called once upon deployment. It does nothing.
     */
    constructor() {}

    /**
     * forward
     *
     * Designed mostly for EOAs, this method can be called to transfer FIL from the f410
     * address space to any address space safely using the Filecoin specific Send API.
     *
     * The function is a payable, so the FIL to be sent is specified as the message value.
     * All FIL sent as value along with the message will be sent. The caller will pay
     * the gas for this transaction, as determined by EIP-1559.
     *
     * The address should be formated as specified by the Filecoin Address types,
     * which can be found here: https://spec.filecoin.io/appendix/address/#section-appendix.address.bytes
     *
     * If you had an address as a string, say, "f01024", it would be encoded as bytes 0x00c10d.
     * You can find a typescript reference implementation of this conversion here:
     * https://github.com/Zondax/filecoin-signing-tools/blob/master/signer-npm/js/src/utils.ts#L56
     *
     * This method will revert if:
     *  - the actor address is clearly invalid (or the byte array is empty)
     *  - the actor call fails internally for some reason (like out of gas, missing actor, etc) 
     *  - if somehow the msg.value amount is not in this contract during execution (unlikely) 
     *  - if the actor returns any unexpected response message
     *
     * @param destination the destination address in bytes format
     */
    function forward(bytes calldata destination) public payable {
        SendAPI.send(destination, msg.value);
    }
}
