// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol"; 

contract AirdropV1 {
    using SafeERC20 for IERC20Metadata;

    address owner;
    address dropToken;
    uint256 dropAmount; 
    mapping(address => bool) public whitelist; 
    
    constructor(address _dropToken, uint256 _dropAmount) {
        owner = msg.sender;
        dropToken = _dropToken;
        dropAmount = _dropAmount;
    } 

    function addToWhitelist(address[] calldata _users) public {
        require(owner == msg.sender, "Only owner!");
        for(uint i = 0; i < _users.length; i++) {
            whitelist[_users[i]] = true;
        }
    }

    function claim() public {
        require(whitelist[msg.sender], "You are not whitelisted.");
        IERC20Metadata(dropToken).safeTransfer(
            msg.sender,
            dropAmount
        );
        whitelist[msg.sender] = false;
    }
}