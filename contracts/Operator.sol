pragma solidity ^0.4.18;

contract Operator {
  struct Stake {
    uint256 deposit;
    uint256 withdrawal;
  }

  address withdrawalAddress; // where to pay out Operator
  address validatorAddress;
  uint public validatorDeposit;
  uint public totalDeposits;
  bool public active;

  // just for testing
  uint public interestRate = 5;

  bool public loggedOut;
  uint public casperDeposit;
  uint public casperWithdrawal;

  mapping(address => Stake) ownerToStakes;
  address[] owners;

  event OperatorReady(address validatorAddress);
  event Transfer(address userAddress, uint amount, uint percentage, uint whatever);

  function Operator(address _validatorAddress, address _withdrawalAddress) public {
    validatorAddress = _validatorAddress;
    withdrawalAddress = _withdrawalAddress;
  }

  modifier notActive {
    require(!active);
    _;
  }

  modifier isActive {
    require(active);
    _;
  }

  modifier notComplete {
    require(!loggedOut);
    _;
  }

  modifier isComplete {
    require(loggedOut);
    _;
  }

  function deposit() external payable notActive {
    if (msg.sender == validatorAddress) {
      depositFromValidator();
    } else {
      depositFromStaker();
    }
  }

  function depositFromValidator() internal {
    require(validatorDeposit == 0);
    validatorDeposit += msg.value;
  }

  function depositFromStaker() internal {
    require(validatorDeposit > 0);
    Stake storage stake = ownerToStakes[msg.sender];
    stake.deposit += msg.value;
    totalDeposits += msg.value;
    if (totalDeposits >= validatorDeposit) {
      active = true;
      casperDeposit = validatorDeposit + totalDeposits;
      OperatorReady(validatorAddress);
    }
  }

  function logout() external isActive notComplete {
    // assume here that casper is complete
    // now we have a deposit returned, it's time to
    loggedOut = true;
    casperWithdrawal = casperDeposit + percentageOf(casperDeposit, interestRate);
  }

  function withdraw() external {
    if (msg.sender == validatorAddress) {
      validatorWithdrawal();
    } else {
      stakerWithdrawal();
    }
  }

  function validatorWithdrawal() internal pure {
  }

  function stakerWithdrawal() internal {
    Stake storage stake = ownerToStakes[msg.sender];
    if (active) {
      require(loggedOut);
      uint stakePercentOfTotal = percent(stake.deposit, casperDeposit, 6);
      uint stakeWithdrawal = (casperWithdrawal * stakePercentOfTotal) / 10 ** 6;
      uint remainingStakeWithdrawal = stakeWithdrawal - stake.withdrawal;
      casperWithdrawal -= remainingStakeWithdrawal;
      stake.withdrawal += remainingStakeWithdrawal;
      msg.sender.transfer(remainingStakeWithdrawal);
    } else {
      uint withdrawal = stake.deposit;
      totalDeposits -= stake.deposit;
      stake.deposit = 0;
      msg.sender.transfer(withdrawal);
    }
  }

  function percentageOf(uint _deposit, uint _percent) public pure returns (uint) {
    return (_percent * _deposit) / 100;
  }

  function percent(uint numerator, uint denominator, uint precision) public pure returns(uint quotient) {
     // caution, check safe-to-multiply here
    uint _numerator  = numerator * 10 ** (precision+1);
    // with rounding of last digit
    uint _quotient =  ((_numerator / denominator) + 5) / 10;
    return ( _quotient);
  }
}
