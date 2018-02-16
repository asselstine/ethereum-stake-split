pragma solidity ^0.4.18;

contract Polystake {
  struct Stake {
    address owner;
    uint256 deposit;
    uint256 withdrawal;
    uint256 validatorIndex;
  }

  enum Stages {
    AcceptingDeposits,
    ValidatorActive,
    LoggedOut
  }

  struct Validator {
    /// The address of the validator
    address validatorAddress;
    /// The address to pay the validator out to
    address withdrawalAddress;
    /// The amount the validator has staked
    uint deposit;
    /// The total amount deposited by stakers
    uint totalDeposits;
    /// The current stage of the validator
    Stages stage;
    /// The amount that casper deposits back into the account
    uint casperDeposit;
    /// The amount we have withdrawn from the casper deposit
    uint casperWithdrawal;
  }

  // just for testing
  uint public interestRate = 5;

  Validator[] validators;
  mapping(address => Stake) ownerToStakes;
  mapping(address => bool) validatorExists;

  event Deposited(address indexed owner, uint256 indexed validatorIndex, uint256 amount);
  event Withdrawn(address indexed owner, uint256 indexed validatorIndex, uint256 amount);

  event ReadyToActivate(uint validatorIndex);
  event NewValidator(uint indexed validatorIndex, address indexed validatorAddress);

  modifier legitValidator(uint _validatorIndex) {
    require(_validatorIndex < validators.length);
    require(_validatorIndex >= 0);
    _;
  }

  modifier atStage(uint _validatorIndex, Stages _stage) {
    Validator storage validator = validators[_validatorIndex];
    require(validator.stage == _stage);
    _;
  }

  modifier notStage(uint _validatorIndex, Stages _stage) {
    Validator storage validator = validators[_validatorIndex];
    require(validator.stage != _stage);
    _;
  }

  modifier assertValidator(uint _validatorIndex) {
    require(isValidator(_validatorIndex));
    _;
  }

  function getValidatorCount() external view returns (uint) {
    return validators.length;
  }

  function newValidator(address _withdrawalAddress) external {
    require(!validatorExists[msg.sender]);
    uint index = validators.push(
      Validator(
        msg.sender,
        _withdrawalAddress,
        0,
        0,
        Stages.AcceptingDeposits,
        0,
        0
      )
    );
    validatorExists[msg.sender] = true;
    NewValidator(index, msg.sender);
  }

  function getValidator(uint _validatorIndex)
    external view legitValidator(_validatorIndex)
    returns (
      /// The address of the validator
      address,
      /// The address to pay the validator out to
      address,
      /// The amount the validator has staked
      uint,
      /// The total amount deposited by stakers
      uint,
      /// The current stage of the validator
      Stages,
      /// The amount that casper deposits back into the account
      uint,
      /// The amount we have withdrawn from the casper deposit
      uint
    ) {
    Validator storage validator = validators[_validatorIndex];
    return (
      validator.validatorAddress,
      validator.withdrawalAddress,
      validator.deposit,
      validator.totalDeposits,
      validator.stage,
      validator.casperDeposit,
      validator.casperWithdrawal
    );
  }

  function deposit(uint _validatorIndex) external payable atStage(_validatorIndex, Stages.AcceptingDeposits) {
    if (isValidator(_validatorIndex)) {
      depositFromValidator(_validatorIndex);
    } else {
      depositFromStaker(_validatorIndex);
    }
  }

  function activate(uint _validatorIndex) external legitValidator(_validatorIndex) assertValidator(_validatorIndex) atStage(_validatorIndex, Stages.AcceptingDeposits) {
    Validator storage validator = validators[_validatorIndex];
    validator.stage = Stages.ValidatorActive;
    validator.casperDeposit = validator.deposit + validator.totalDeposits;
  }

  function logout(uint _validatorIndex) external legitValidator(_validatorIndex) assertValidator(_validatorIndex) atStage(_validatorIndex, Stages.ValidatorActive) {
    Validator storage validator = validators[_validatorIndex];
    // assume here that casper is complete
    // now we have a deposit returned, it's time to
    validator.stage = Stages.LoggedOut;
    /// Just for testing
    validator.casperWithdrawal = validator.casperDeposit + percentageOf(validator.casperDeposit, interestRate);
  }

  function withdraw(uint _validatorIndex) external legitValidator(_validatorIndex) notStage(_validatorIndex, Stages.ValidatorActive) {
    if (isValidator(_validatorIndex)) {
      validatorWithdrawal(_validatorIndex);
    } else {
      stakerWithdrawal(_validatorIndex);
    }
  }

  function depositFromValidator(uint _validatorIndex) internal {
    Validator storage validator = validators[_validatorIndex];
    require(validator.deposit == 0);
    validator.deposit += msg.value;
  }

  function depositFromStaker(uint _validatorIndex) internal {
    Validator storage validator = validators[_validatorIndex];
    require(validator.deposit > 0);
    Stake storage stake = ownerToStakes[msg.sender];
    stake.owner = msg.sender;
    stake.deposit += msg.value;
    stake.validatorIndex = _validatorIndex;
    validator.totalDeposits += msg.value;
    if (validator.totalDeposits >= validator.deposit) {
      ReadyToActivate(_validatorIndex);
    }
    Deposited(msg.sender, _validatorIndex, msg.value);
  }

  function validatorWithdrawal(uint _validatorIndex) internal pure {
  }

  function stakerWithdrawal(uint _validatorIndex) internal {
    Validator storage validator = validators[_validatorIndex];
    Stake storage stake = ownerToStakes[msg.sender];
    require(stake.validatorIndex == _validatorIndex);
    uint withdrawal;
    if (validator.stage == Stages.LoggedOut) {
      uint stakePercentOfTotal = percent(stake.deposit, validator.casperDeposit, 6);
      uint stakeWithdrawal = (validator.casperWithdrawal * stakePercentOfTotal) / 10 ** 6;
      withdrawal = stakeWithdrawal - stake.withdrawal;
      validator.casperWithdrawal -= withdrawal;
      stake.withdrawal += withdrawal;
    } else if (validator.stage == Stages.AcceptingDeposits) {
      withdrawal = stake.deposit;
      validator.totalDeposits -= stake.deposit;
      stake.deposit = 0;
    }
    Withdrawn(msg.sender, _validatorIndex, withdrawal);
    msg.sender.transfer(withdrawal);
  }

  function percentageOf(uint _deposit, uint _percent) internal pure returns (uint) {
    return (_percent * _deposit) / 100;
  }

  function percent(uint numerator, uint denominator, uint precision) internal pure returns(uint quotient) {
     // caution, check safe-to-multiply here
    uint _numerator  = numerator * 10 ** (precision+1);
    // with rounding of last digit
    uint _quotient =  ((_numerator / denominator) + 5) / 10;
    return ( _quotient);
  }

  function isValidator(uint _validatorIndex) internal view returns (bool) {
    Validator storage validator = validators[_validatorIndex];
    return validator.validatorAddress == msg.sender;
  }
}
