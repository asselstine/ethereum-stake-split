import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert'
import BigNumber from 'bignumber.js'
const Operator = artifacts.require('Operator')

contract('Operator', function (accounts) {
  let op;

  let validatorAddress = accounts[0]
  let withdrawalAddress = accounts[1]
  let userAddress = accounts[2]

  beforeEach(async function () {
    op = await Operator.new(validatorAddress, withdrawalAddress)
  })

  describe('deposit()', function () {
    it('validator should be able to deposit ether', async function () {
      await op.deposit({ from: validatorAddress, value: 10 })
      let validatorDeposit = await op.validatorDeposit()
      assert.equal(validatorDeposit, 10)
    })

    it('validator cannot deposit more than once', async function () {
      await op.deposit({ from: validatorAddress, value: 10 })
      await assertRevert(op.deposit({ from: validatorAddress, value: 20 }))
    })

    it('user cannot deposit unless validator has deposited', async function () {
      await assertRevert(op.deposit({ from: userAddress, value: 20 }))
    })

    it('user can deposit ether', async function () {
      await op.deposit({ from: validatorAddress, value: 10 })
      await op.deposit({ from: userAddress, value: 9 })

      let totalDeposits = await op.totalDeposits()
      assert.equal(totalDeposits, 9)
    })

    it('operator activates when user ether matches deposit', async function () {
      await op.deposit({ from: validatorAddress, value: 10 })
      await op.deposit({ from: userAddress, value: 10 })

      let active = await op.active()
      assert.ok(active === true)
    })

    it('cannot deposit into a logged-in operator', async function () {
      await op.deposit({ from: validatorAddress, value: 10 })
      await op.deposit({ from: userAddress, value: 10 })

      await assertRevert(op.deposit({ from: userAddress, value: 10 }))
      await assertRevert(op.deposit({ from: validatorAddress, value: 10 }))
    })
  })

  describe('percentageOf', function () {
    it('should return the deposit plus the interest', async function () {
      assert.equal(await op.percentageOf(new BigNumber(100), new BigNumber(5)), 5)
      assert.equal((await op.percentageOf(new BigNumber(20), new BigNumber(5))).toString(), "1")
      assert.equal((await op.percentageOf(new BigNumber(2000), new BigNumber(20))).toString(), "400")
    })
  })

  describe('logout()', function () {
    it('should create a fake deposit', async function () {
      await op.deposit({ from: validatorAddress, value: 10 })
      await op.deposit({ from: userAddress, value: 10 })
      assert.ok((await op.active()) === true)
      await op.logout()
      assert.equal(await op.loggedOut(), true)
      assert.equal(await op.casperDeposit(), 20)
      assert.equal(await op.interestRate(), 5)
      assert.equal((await op.casperWithdrawal()).toString(), "21")
    })
  })

  describe('withdraw()', function () {
    describe('stakerWithdrawal()', function () {
      it('should remove the stake and interest when active', async function () {
        let initialBalance = web3.eth.getBalance(userAddress)
        await op.deposit({ from: validatorAddress, value: 100 })
        await op.deposit({ from: userAddress, value: 100 })
        await op.logout()

        await op.withdraw({ from: userAddress })
        assert.equal(
          web3.eth.getBalance(userAddress).mod(100000).toString(),
          initialBalance.plus(5).mod(100000).toString()
        )
      })

      it('should return the deposit if not active', async function () {
        let initialBalance = web3.eth.getBalance(userAddress)
        await op.deposit({ from: validatorAddress, value: 100 })
        await op.deposit({ from: userAddress, value: 90 })
        await op.withdraw({ from: userAddress })
        assert.equal(
          web3.eth.getBalance(userAddress).mod(100000).toString(),
          initialBalance.mod(100000).toString()
        )
      })
    })

    describe('validatorWithdrawal', function () {
    })
  })
})
