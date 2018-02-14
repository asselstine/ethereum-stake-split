import { store } from '../store'
import validatorActions from '../actions/validator-actions'
import polystakeContract from '../contracts/polystake-contract'

export default function (index) {
  polystakeContract().deployed().then((instance) => {
    instance.getValidator(index).then((data) => {
      store.dispatch(validatorActions.receiveValidator(index, data))
    })
  }).catch((error) => {
    console.error(error)
  })
}
