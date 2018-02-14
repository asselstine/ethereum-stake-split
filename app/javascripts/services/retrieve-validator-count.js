import { store } from '../store'
import validatorActions from '../actions/validator-actions'
import polystakeContract from '../contracts/polystake-contract'

export default function () {
  polystakeContract().deployed().then((instance) => {
    instance.getValidatorCount().then((result) => {
      store.dispatch(validatorActions.receiveValidatorCount(result))
    })
  }).catch((error) => {
    console.error(error)
  })
}
