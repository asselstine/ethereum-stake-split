import React, {
  Component
} from 'react'
import PropTypes from 'prop-types'

export class ValidatorRow extends Component {
  render () {
    return (
      <tr>
        <td>{this.props.address.toString()}</td>
      </tr>
    )
  }
}

ValidatorRow.propTypes = {
  address: PropTypes.any.isRequired
}
