import React from 'react'
import {
  Route,
  Redirect,
  Switch
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
              <Switch>
                <Route path='/operator' component={() => 'Operator'} />
                <Route path='/' component={() => 'Polystake'} />
              </Switch>
            </h1>
          </div>
        </div>
      </section>
      <Switch>
        <Route path='/operator' component={Operator} />
        <Route path='/' component={Login} />
      </Switch>
    </div>
  )
}
