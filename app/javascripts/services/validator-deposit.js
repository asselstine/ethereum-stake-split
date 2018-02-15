import polystakeContract from '../contracts/polystake-contract'

export default async function (index, amount) {
  let instance = await polystakeContract().deployed()
  return await instance.deposit.sendTransaction(index, { value: web3.toWei(amount, 'ether'), from: web3.eth.accounts[0] })
}
