import { default as contract } from 'truffle-contract'
import operatorArtifacts from '../../../build/contracts/Operator.json'

const Operator = contract(operatorArtifacts)

export default function () {
  Operator.setProvider(web3.currentProvider);
  return Operator
}
