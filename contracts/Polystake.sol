pragma solidity ^0.4.18;

import './Operator.sol';

contract Polystake {
  Operator[] operators;
  mapping(address => address) validatorToOperator;

  event NewOperator(address operator, address creator, address validatorAddress, address withdrawalAddress);

  function createOperator(address _validatorAddress, address _withdrawalAddress) external {
    Operator newOperator = new Operator(_validatorAddress, _withdrawalAddress);
    operators.push(newOperator);
    NewOperator(newOperator, msg.sender, _validatorAddress, _withdrawalAddress);
  }

  function getOperators() external view returns (address[]) {
    return operators;
  }
}
