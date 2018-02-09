import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter
} from 'react-router-dom'
import {
  Provider
} from 'react-redux'

import { Application } from './components/application'
import { store } from './store'

export const init = (elem) => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Application />
      </BrowserRouter>
    </Provider>,
    elem)
}
