import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter
} from 'react-router-dom'

import { Application } from './components/application'

export const init = (elem) => {
  ReactDOM.render(<HashRouter><Application /></HashRouter>, elem)
}
