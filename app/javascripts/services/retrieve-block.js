import { store } from '../store'
import blockActions from '../actions/block-actions'
import polystakeContract from '../contracts/polystake-contract'

export default function (hash) {
  web3.eth.getBlock(hash, false, (error, result) => {
    if (error) {
      console.error(error)
    } else {
      store.dispatch(blockActions.receiveBlock(result))
    }
  })
}
