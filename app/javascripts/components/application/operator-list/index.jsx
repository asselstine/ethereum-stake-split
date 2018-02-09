import React, {
  Component
} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { NewOperatorForm } from './new-operator-form'
import operatorContract from '../../../contracts/operator-contract'
import polystakeContract from '../../../contracts/polystake-contract'
import { connect } from 'react-redux'
import retrieveOperators from '../../../services/retrieve-operators'
import { OperatorRow } from './operator-row'

export const OperatorList = connect(
  (state, ownProps) => {
    return {
      operatorAddresses: _.get(state, 'operators.addresses') || []
    }
  }
)(class extends Component {
  componentDidMount () {
    retrieveOperators()
  }

  render () {
    return (
      <div>
        <section className='section'>
          <div className='container'>
            <h1 className="title">
              Operator
            </h1>
          </div>
        </section>
        <section className='section'>
          <div className='container'>
            <h1 className='title'>New Contract</h1>
            <NewOperatorForm />
          </div>
        </section>
        <section className='section'>
          <div className='container'>
            <table className='table'>
              <tbody>
                {
                  this.props.operatorAddresses.map(address => <OperatorRow address={address} key={address} />)
                }
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  }
})

OperatorList.propTypes = {
  operatorAddresses: PropTypes.array.isRequired
}

OperatorList.defaultProps = {
  operatorAddresses: []
}
