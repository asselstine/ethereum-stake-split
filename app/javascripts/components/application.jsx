import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'

import { Operator } from './operator'
import { Login } from './login'

export const Application = () => {
  return (
    <div>
      <section className='hero is-primary is-bold'>
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              <Route path='/' component={() => 'Polystake'} />
              <Route path='/operator' component={() => ': Operator'} />
            </h1>
          </div>
        </div>
      </section>
      <Route path='/login' component={Login} />
      <Route path='/operator' component={Operator} />
      <Redirect from='/' to='/login' />
    </div>
  )
}
