import { store } from '../store'
import operatorActions from '../actions/operator-actions'
import polystakeContract from '../contracts/polystake-contract'

export default function () {
  polystakeContract().deployed().then((instance) => {
    return instance.getOperators()
  }).then((result) => {
    console.log('RECEIVE OPERATORS: ', result)
    store.dispatch(operatorActions.receiveOperators(result))
  }).catch((error) => {
    console.error(error)
  })
}
