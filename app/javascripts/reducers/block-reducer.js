import update from 'immutability-helper'

export default function (state, action) {
  if (typeof state === 'undefined') {
    state = {}
  }

  switch (action.type) {
    case 'RECEIVE_BLOCK':
      var cmd = {}
      cmd[action.block.hash] = { $set: action.block }
      state = update(state, cmd)
      break
  }

  return state
}
