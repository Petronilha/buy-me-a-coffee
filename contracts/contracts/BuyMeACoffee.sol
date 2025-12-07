// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract BuyMeACoffee {
    // Evento emitido quando um café é comprado (o Front-end escuta isso)
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Estrutura do recado (Memo)
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // Lista de todos os recados recebidos
    Memo[] memos;

    // Endereço do dono do contrato
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        require(msg.value > 0, unicode"Não pode comprar café de graça!");

        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
