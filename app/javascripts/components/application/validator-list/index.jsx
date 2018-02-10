import React, {
  Component
} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { NewValidatorForm } from './new-validator-form'
import polystakeContract from '../../../contracts/polystake-contract'
import { connect } from 'react-redux'
import retrieveValidators from '../../../services/retrieve-validators'
import { ValidatorRow } from './validator-row'

export const ValidatorList = connect(
  (state, ownProps) => {
    return {
      validatorAddresses: _.get(state, 'validators.addresses') || []
    }
  }
)(class extends Component {
  componentDidMount () {
    retrieveValidators()
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
              <tbody>
                {
                  this.props.validatorAddresses.map(address => <ValidatorRow address={address} key={address} />)
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
  validatorAddresses: PropTypes.array.isRequired
}

ValidatorList.defaultProps = {
  validatorAddresses: []
}
