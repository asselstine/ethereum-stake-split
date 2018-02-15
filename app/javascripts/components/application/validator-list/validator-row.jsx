import React, {
  Component
} from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import retrieveValidator from '../../../services/retrieve-validator'
import { connect } from 'react-redux'
import { Address } from '../../address'
import { Ether } from '../../ether'
import { Stage } from '../../stage'

export const ValidatorRow = connect(
  (state, ownProps) => {
    return {
      validator: _.get(state, `validators.validators[${ownProps.index}]`)
    }
  }
)(class extends Component {
  componentDidMount () {
    retrieveValidator(this.props.index)
  }

  render () {
    if (this.props.validator) {
      var validator = this.props.validator
      var tr =
        <tr>
          <td><Address address={validator.validatorAddress} /></td>
          <td><Address address={validator.withdrawalAddress} /></td>
          <td><Ether wei={validator.deposit} /></td>
          <td><Ether wei={validator.totalDeposits} /></td>
          <td><Stage stage={validator.stage} /></td>
          <td>
            <a href='javascript:;' className='button is-success' onClick={(e) => this.props.onDeposit(this.props.index, this.props.validator)}>Deposit</a>
            &nbsp;
            <a href='javascript:;' className='button is-warning' onClick={(e) => this.props.onWithdraw(this.props.index, this.props.validator)}>Withdraw</a>
          </td>
        </tr>
    } else {
      tr =
        <tr>
          <td>{this.props.index.toString()}</td>
        </tr>
    }
    return tr
  }
})

ValidatorRow.propTypes = {
  index: PropTypes.any.isRequired,
  validator: PropTypes.object,
  onDeposit: PropTypes.func.isRequired,
  onWithdraw: PropTypes.func.isRequired
}
