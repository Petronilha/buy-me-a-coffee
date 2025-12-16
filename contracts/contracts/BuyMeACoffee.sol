// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

/// @title Buy Me A Coffee Contract
/// @author Daniel Petronilha
/// @notice A simple contract to accept tips (coffees) and store messages from friends
/// @dev Implements a tipping mechanism with memo storage and owner withdrawal

contract BuyMeACoffee {

    /// @notice Event emitted when a coffee is bought
    /// @param from The address of the tipper
    /// @param timestamp The block timestamp when the tip was sent
    /// @param name The name provided by the tipper
    /// @param message The message sent by the tipper

    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    /// @notice Structure to hold memo details
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    /// @notice List of all memos received
    Memo[] memos;

    /// @notice Address of the contract owner who can withdraw funds
    address payable owner;

    /// @notice Constructor sets the contract deployer as the owner
    constructor() {
        owner = payable(msg.sender);
    }
    /// @notice Buys a conffee for the contract owner
    /// @dev Sends ETH to the contract, creates a Memo struct, and emits an event
    /// @param _name The name of the person sending the tip
    /// @param _message A nice message from the sender
    function buyCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        require(msg.value > 0, unicode"Não pode comprar café de graça!");

        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /// @notice Withdraws the entire balance stored in the contract to the owner
    /// @dev Uses 'cal' to transfer funds, which is safer for smart contract wallets
    function withdrawTips() public {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    /// @notice Retrieves all stored memos 
    /// @return An array of Memo structs containing all tips and messages
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
