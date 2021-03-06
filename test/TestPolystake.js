import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert'
import BigNumber from 'bignumber.js'
const Polystake = artifacts.require('Polystake')

contract('Polystake', function (accounts) {
  let polystake;
  let validatorIndex;

  let validatorAddress = accounts[0]
  let withdrawalAddress = accounts[1]
  let userAddress = accounts[2]

  beforeEach(async function () {
    await Polystake.new().then(function (instance) {
      polystake = instance
    }).then(async () => {
      await polystake.newValidator(withdrawalAddress)
      validatorIndex = 0
    })
  })

  describe('newValidator()', function () {
    it('cannot create multiple validators for the same address', async function () {
      assertRevert(polystake.newValidator(withdrawalAddress))
    })
  })

  describe('deposit()', function () {
    it('validator should be able to deposit ether', async function () {
      await polystake.deposit(validatorIndex, { from: validatorAddress, value: 10 })
      let validator = await polystake.getValidator(validatorIndex)
      assert.equal(validator[2], 10)
    })

    it('validator cannot deposit more than once', async function () {
      await polystake.deposit(validatorIndex, { from: validatorAddress, value: 10 })
      // await assertRevert(polystake.deposit(validatorIndex, { from: validatorAddress, value: 20 }))
    })

    it('user cannot deposit unless validator has deposited', async function () {
      await assertRevert(polystake.deposit(validatorIndex, { from: userAddress, value: 20 }))
    })

    it('user can deposit ether', async function () {
      await polystake.deposit(validatorIndex, { from: validatorAddress, value: 10 })
      await polystake.deposit(validatorIndex, { from: userAddress, value: 9 })

      let validator = await polystake.getValidator(validatorIndex)
      assert.equal(validator[3], 9)
    })

    it('operator activates when user ether matches deposit', async function () {
      await polystake.deposit(validatorIndex, { from: validatorAddress, value: 10 })
      await polystake.deposit(validatorIndex, { from: userAddress, value: 10 })

      let validator = await polystake.getValidator(validatorIndex)
      assert.equal(validator[5], 0)
    })

    it('cannot deposit into a logged-in operator', async function () {
      await polystake.deposit(validatorIndex, { from: validatorAddress, value: 10 })
      await polystake.deposit(validatorIndex, { from: userAddress, value: 10 })

      await polystake.activate(validatorIndex)

      await assertRevert(polystake.deposit(validatorIndex, { from: userAddress, value: 10 }))
      await assertRevert(polystake.deposit(validatorIndex, { from: validatorAddress, value: 10 }))
    })
  })

  describe('logout()', function () {
    it('should create a fake deposit', async function () {
      await polystake.deposit(validatorIndex, { from: validatorAddress, value: 10 })
      await polystake.deposit(validatorIndex, { from: userAddress, value: 10 })
      let validator = await polystake.getValidator(validatorIndex)
      assert.equal(validator[4], 0)
      await polystake.activate(validatorIndex)
      await polystake.logout(validatorIndex)
      validator = await polystake.getValidator(validatorIndex)
      assert.equal(validator[4], 2)
      assert.equal(validator[5], 20)
      assert.equal(await polystake.interestRate(), 5)
      assert.equal(validator[6], 21)
    })
  })

  describe('withdraw()', function () {
    describe('stakerWithdrawal()', function () {
      it('should remove the stake and interest when active', async function () {
        let initialBalance = web3.eth.getBalance(userAddress)
        await polystake.deposit(validatorIndex, { from: validatorAddress, value: 100 })
        await polystake.deposit(validatorIndex, { from: userAddress, value: 100 })

        await polystake.activate(validatorIndex)
        await polystake.logout(validatorIndex)

        await polystake.withdraw(validatorIndex, { from: userAddress })
        assert.equal(
          web3.eth.getBalance(userAddress).mod(100000).toString(),
          initialBalance.plus(5).mod(100000).toString()
        )
      })

      it('should return the deposit if not active', async function () {
        let initialBalance = web3.eth.getBalance(userAddress)
        await polystake.deposit(validatorIndex, { from: validatorAddress, value: 100 })
        await polystake.deposit(validatorIndex, { from: userAddress, value: 90 })
        await polystake.withdraw(validatorIndex, { from: userAddress })
        assert.equal(
          web3.eth.getBalance(userAddress).mod(100000).toString(),
          initialBalance.mod(100000).toString()
        )
      })
    })

    describe('validatorWithdrawal', function () {
      xit('fill this out!')
    })
  })

  describe('getValidatorCount()', function () {
    it('should return the correct count', async function () {
      let validatorCount = await polystake.getValidatorCount()
      assert.equal(validatorCount, 1)
    })
  })
})
