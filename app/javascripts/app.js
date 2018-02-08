// Import the page's CSS. Webpack will know what to do with it.
require('bulma/css/bulma.css');
require('./navbar');

import { init } from './init'
import loadWeb3 from './load-web3'

window.addEventListener('load', function() {
  loadWeb3()
  init(document.getElementById('application'))
});
