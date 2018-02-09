import React, {
  Component
} from 'react'
import PropTypes from 'prop-types'

export class OperatorRow extends Component {
  render () {
    return (
      <tr>
        <td>{this.props.address.toString()}</td>
      </tr>
    )
  }
}

OperatorRow.propTypes = {
  address: PropTypes.any.isRequired
}
