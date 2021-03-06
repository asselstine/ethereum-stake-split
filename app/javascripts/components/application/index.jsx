import React from 'react'
import {
  Route,
  Redirect,
  Switch
} from 'react-router-dom'

import { Validator } from './validator'
import { ValidatorList } from './validator-list'
import { Login } from './login'

export const Application = () => {
  if (window.web3 && web3.eth.accounts.length) {
    var contents =
      <div>
        <section className='hero is-primary is-bold'>
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                <Switch>
                  <Route path='/validator/:index' component={() => 'Validator'} />
                  <Route path='/validator' component={() => 'Validators'} />
                  <Route path='/' component={() => 'Polystake'} />
                </Switch>
              </h1>
            </div>
          </div>
        </section>
        <Switch>
          <Route path='/validator/:index' component={Validator} />
          <Route path='/validator' component={ValidatorList} />
          <Route path='/' component={Login} />
        </Switch>
      </div>
  } else if (window.web3) {
    contents =
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">
              Whoops!
            </h1>
            <h2 className="subtitle">
              The MetaMask browser extension is installed, but you need to create an account! Please create an account then refresh the page.
            </h2>
          </div>
        </div>
      </section>
  } else {
    contents =
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">
              Whoops!
            </h1>
            <h2 className="subtitle">
              You need to install the <a href='https://metamask.io/' title='MetaMask' target='_blank'>MetaMask</a> extension for your browser.
            </h2>
          </div>
        </div>
      </section>
  }

  return (
    contents
  )
}
