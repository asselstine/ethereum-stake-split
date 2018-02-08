import React, {
  Component
} from 'react'
import ReactDOM from 'react-dom'

import operatorContract from '../contracts/operator-contract'
import polystakeContract from '../contracts/polystake-contract'

export class Operator extends Component {
  constructor (props) {
    super(props)
    this.state = {
      validatorAddress: '',
      withdrawalAddress: '',
    }
  }
  componentDidMount () {
    var account = web3.eth.accounts[0]
  }

  submitNewContract (event) {
    event.preventDefault()

  }

  render () {
    return (
      <div>
        <section className='hero is-primary is-bold'>
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Operator
              </h1>
              <a href='/' className='button is-inverted is-primary is-outlined'>Back</a>
            </div>
          </div>
        </section>

        <section className='section'>
          <div className='container'>
            <h1 className='title'>New Contract</h1>
            <form onSubmit={(e) => this.submitNewContract(e)}>
              <div className='field'>
                <label className='label is-medium'>Validator Address</label>
                <div className='control'>
                  <input
                    className="input"
                    type='text'
                    placeholder='0xb25876a4ad833b438b6056c98ebef0686683ae633aaaa54e52fce19c1df47808'
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
                    placeholder='0xb25876a4ad833b438b6056c98ebef0686683ae633aaaa54e52fce19c1df47808'
                    value={this.state.withdrawalAddress}
                    onChange={(e) => this.setState({withdrawalAddress: e.target.value})} />
                </div>
              </div>
              <input type='submit' className='button is-success' value='New' />
            </form>
          </div>
        </section>
      </div>
    )
  }
}
