import update from 'immutability-helper'

export default function (state, action) {
  if (typeof state === 'undefined') {
    state = {}
  }

  switch (action.type) {
    case 'RECEIVE_OPERATOR_ADDRESSES':
      state = update(state, {
        addresses: {
          $set: action.addresses
        }
      })
      break
  }

  return state
}
