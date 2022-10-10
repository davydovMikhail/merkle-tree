// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol"; 
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract AirdropV2 {
    using SafeERC20 for IERC20Metadata;

    address owner;
    address dropToken;
    uint256 dropAmount; 
    bytes32 public root;
    mapping(address => bool) public usersClaimed;
    
    constructor(address _dropToken, uint256 _dropAmount) {
        owner = msg.sender;
        dropToken = _dropToken;
        dropAmount = _dropAmount;
    } 

    function setRoot(bytes32 _root) public {
        require(owner == msg.sender, "Only owner!");
        root = _root;
    }

    function claim(bytes32[] calldata _proof) public {
        require(!usersClaimed[msg.sender], "Already claimed");
        require(MerkleProof.verify(_proof, root, keccak256(abi.encodePacked(msg.sender))), "You are not whitelisted.");
        IERC20Metadata(dropToken).safeTransfer(
            msg.sender,
            dropAmount
        );
        usersClaimed[msg.sender] = true;
    }
}