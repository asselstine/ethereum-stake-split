import { store } from '../store'
import validatorActions from '../actions/validator-actions'
import polystakeContract from '../contracts/polystake-contract'

export default function () {
  polystakeContract().deployed().then((instance) => {

    instance.getValidatorCount().then((result) => {
      console.log('RECEIVE VALIDATORS: ', result.toString())
      for (var x = 0; x < result; x++) {
        instance.getValidator(x).then((validator) => {

        })
      }
    })

  }).catch((error) => {
    console.error(error)
  })
}
