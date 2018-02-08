import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'

import { Login } from './login'

export const Application = () => {
  return (
    <div>
      <section className='hero is-primary is-bold'>
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Polystake
            </h1>
          </div>
        </div>
      </section>
      <Route path='/login' component={Login} />
      <Redirect from='/' to='/login' />
    </div>
  )
}
