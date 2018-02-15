import React, {
  Component
} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { NewValidatorForm } from './new-validator-form'
import polystakeContract from '../../../contracts/polystake-contract'
import { connect } from 'react-redux'
import retrieveValidatorCount from '../../../services/retrieve-validator-count'
import retrieveValidator from '../../../services/retrieve-validator'
import { ValidatorRow } from './validator-row'
import { Modal } from '../../modal'
import { Address } from '../../address'
import { NewDepositForm } from './new-deposit-form'
import validatorDeposit from '../../../services/validator-deposit'
import validatorWithdrawal from '../../../services/validator-withdrawal'

export const ValidatorList = connect(
  (state, ownProps) => {
    return {
      validatorCount: _.get(state, 'validators.count') || []
    }
  }
)(class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showNewValidatorForm: false,
      showDeposit: false,
      showWithdraw: false,
      deposit: 0
    }
    this.onDeposit = this.onDeposit.bind(this)
    this.onWithdraw = this.onWithdraw.bind(this)
  }

  componentDidMount () {
    retrieveValidatorCount()
  }

  onDeposit (index, validator) {
    this.setState({
      showDeposit: true,
      deposit: 0,
      validatorIndex: index,
      validator: validator
    })
  }

  onWithdraw (index, validator) {
    this.setState({
      showWithdraw: true,
      validatorIndex: index,
      validator: validator
    })
  }

  onSubmitDeposit (e) {
    e.preventDefault()
    validatorDeposit(this.state.validatorIndex, this.state.deposit).then((result) => {
      console.log('deposit done: ', result)
      retrieveValidator(this.state.validatorIndex)
      this.setState({showDeposit: false})
    })
  }

  onSubmitWithdrawal () {
    validatorWithdrawal(this.state.validatorIndex).then((result) => {
      console.log('withdrawal done: ', result)
      retrieveValidator(this.state.validatorIndex)
      this.setState({showWithdraw: false})
    })
  }

  render () {
    if (this.state.validator) {
      var newDepositForm =
        <div className='box'>
          <h1 className='title'>New Validator Deposit</h1>
          <h2 className='subtitle'><Address address={this.state.validator.validatorAddress} /></h2>
          <NewDepositForm
            onSubmit={this.onSubmitDeposit.bind(this)}
            deposit={this.state.deposit}
            onChangeDeposit={(e) => this.setState({ deposit: e.target.value })} />
        </div>
      var newWithdrawalForm =
        <div className='box'>
          <h1 className='title'>New Validator Withdrawal</h1>
          <h2 className='subtitle'><Address address={this.state.validator.validatorAddress} /></h2>
          <button className='button is-success' onClick={this.onSubmitWithdrawal.bind(this)}>Withdraw</button>
        </div>
    }
    return (
      <section className='section'>
        <div className='container'>
          <Modal isOpen={this.state.showNewValidatorForm} onClose={(e) => this.setState({ showNewValidatorForm: false })}>
            <div className='box'>
              <h1 className='title'>Create New Validator</h1>
              <NewValidatorForm />
            </div>
          </Modal>
          <Modal isOpen={this.state.showDeposit} onClose={(e) => this.setState({ showDeposit: false })}>
            {newDepositForm}
          </Modal>
          <Modal isOpen={this.state.showWithdraw} onClose={(e) => this.setState({ showWithdraw: false })}>
            {newWithdrawalForm}
          </Modal>
          <a href='javascript:;' onClick={() => this.setState({ showNewValidatorForm: true })} className='button'>New Contract</a>
          <table className='table'>
            <thead>
              <tr>
                <th>Validator Address</th>
                <th>Withdrawal Address</th>
                <th>Validator Deposit</th>
                <th>Total Deposits</th>
                <th>Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                _.range(this.props.validatorCount).map(
                  index => <ValidatorRow index={index} key={index} onDeposit={this.onDeposit} onWithdraw={this.onWithdraw} />
                )
              }
            </tbody>
          </table>
        </div>
      </section>
    )
  }
})

ValidatorList.propTypes = {
  validatorCount: PropTypes.number.isRequired
}

ValidatorList.defaultProps = {
  validatorCount: 0
}
