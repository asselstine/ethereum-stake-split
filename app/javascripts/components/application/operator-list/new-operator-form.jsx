import React, {
  Component
} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import operatorContract from '../../../contracts/operator-contract'
import polystakeContract from '../../../contracts/polystake-contract'

export class NewOperatorForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      validatorAddress: '0x89a40de21210e700492bd5bf99cc305b9ac8ab52',
      withdrawalAddress: '0x89a40de21210e700492bd5bf99cc305b9ac8ab52',
    }
    this.submitNewContract = this.submitNewContract.bind(this)
  }

  submitNewContract (event) {
    event.preventDefault()
    polystakeContract().deployed().then((instance) => {
      instance.createOperator(this.state.validatorAddress, this.state.withdrawalAddress, { from: window.web3.eth.accounts[0]})
    })
  }

  render () {
    return (
      <form onSubmit={this.submitNewContract}>
        <div className='field'>
          <label className='label is-medium'>Validator Address</label>
          <div className='control'>
            <input
              className="input"
              type='text'
              placeholder='0x89a40de21210e700492bd5bf99cc305b9ac8ab52'
              pattern="0x[A-Fa-f0-9]{40}"
              required
              value={this.state.validatorAddress}
              onChange={(e) => this.setState({validatorAddress: e.target.value})} />
          </div>
        </div>
        <div className='field'>
          <label className='label is-medium'>Withdrawal Address</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='0x89a40de21210e700492bd5bf99cc305b9ac8ab52'
              pattern="0x[A-Fa-f0-9]{40}"
              required
              value={this.state.withdrawalAddress}
              onChange={(e) => this.setState({withdrawalAddress: e.target.value})} />
          </div>
        </div>
        <input type='submit' className='button is-success' value='New' />
      </form>
    )
  }
}
