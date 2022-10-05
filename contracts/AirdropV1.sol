// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol"; 

contract AirdropV1 {

    address owner;
    address dropToken;
    uint256 dropAmount; 
    mapping(address => bool) public whitelist; 
 
    constructor(address _dropToken, uint256 _dropAmount) {
        owner = msg.sender;
        dropToken = _dropToken;
        dropAmount = _dropAmount;
    } 

    function addToWhitelist(address _user) public {
        require(owner == msg.sender, "Only owner!");
        whitelist[_user] = true;
    }

    function claim() public {

    }

}