import polystakeContract from '../contracts/polystake-contract'

export default async function (index, amount) {
  let instance = await polystakeContract().deployed()
  var gasEstimate = await instance.withdraw.estimateGas(index, { from: web3.eth.accounts[0] })
  return await instance.withdraw(index, { from: web3.eth.accounts[0], gas: gasEstimate * 3 })
}
