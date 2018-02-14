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
import { ValidatorRow } from './validator-row'

export const ValidatorList = connect(
  (state, ownProps) => {
    return {
      validatorCount: _.get(state, 'validators.count') || []
    }
  }
)(class extends Component {
  componentDidMount () {
    retrieveValidatorCount()
  }

  render () {
    return (
      <div>
        <section className='section'>
          <div className='container'>
            <h1 className="title">
              Validator
            </h1>
          </div>
        </section>
        <section className='section'>
          <div className='container'>
            <h1 className='title'>New Contract</h1>
            <NewValidatorForm />
          </div>
        </section>
        <section className='section'>
          <div className='container'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Validator Address</th>
                  <th>Withdrawal Address</th>
                  <th>Validator Deposit</th>
                  <th>Total Deposits</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                {
                  _.range(this.props.validatorCount).map(index => <ValidatorRow index={index} key={index} />)
                }
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  }
})

ValidatorList.propTypes = {
  validatorCount: PropTypes.number.isRequired
}

ValidatorList.defaultProps = {
  validatorCount: 0
}
