pragma solidity ^0.4.18;

import './Operator.sol';

contract Polystake {
  address[] newOperators;

  event NewOperator(address creator, address validatorAddress, address withdrawalAddress);

  function createOperator(address _validatorAddress, address _withdrawalAddress) external {
    address newOperator = new Operator(_validatorAddress, _withdrawalAddress);
    newOperators.push(newOperator);
    NewOperator(msg.sender, _validatorAddress, _withdrawalAddress);
  }
}
