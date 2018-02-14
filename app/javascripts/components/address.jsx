import React from 'react'

export const Address = (props) => {
  return (
    <span title={props.address}>{props.address.toString().substring(0, 6)}...</span>
  )
}
