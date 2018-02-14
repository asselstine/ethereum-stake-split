import React from 'react'

export const Stage = (props) => {
  var label
  switch (props.stage.toString()) {
    case '0':
      label = 'Accepting Deposits'
      break
    case '1':
      label = 'Validator Active'
      break
    case '2':
      label = 'Complete'
      break
    default:
      label = 'Unknown'
  }
  return label
}
