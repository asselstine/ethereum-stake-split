import update from 'immutability-helper'

export default function (state, action) {
  if (typeof state === 'undefined') {
    state = {
      count: 0,
      validators: {}
    }
  }

  switch (action.type) {
    case 'RECEIVE_VALIDATOR_COUNT':
      state = update(state, {
        count: {
          $set: action.count
        }
      })
      break
    case 'RECEIVE_VALIDATOR':
      var validator = {
          validatorAddress: action.data[0],
          withdrawalAddress: action.data[1],
          deposit: action.data[2],
          totalDeposits: action.data[3],
          stage: action.data[4],
          casperDeposit: action.data[5],
          casperWithdrawa: action.data[6]
      }
      var cmd = {
        validators: {}
      }
      cmd.validators[action.index] = { $set: validator }
      state = update(state, cmd)
      break
  }

  return state
}
