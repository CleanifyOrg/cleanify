// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";


contract Counter {
    uint public count;

    event Increment(uint count, uint when);

    constructor(uint _count) {
        count = _count;
    }

    function increment() public {
        count += 1;

        emit Increment(count, block.timestamp);
    }

    function incrementByAmount(uint amount) public {
        count += amount;

        emit Increment(count, block.timestamp);
    }
}