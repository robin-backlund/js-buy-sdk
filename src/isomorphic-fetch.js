/* global require */

import global from './metal/global';
import isNodeLikeEnvironment from './metal/is-node-like-environment';

const fetch = global.fetch;

if (!fetch && isNodeLikeEnvironment()) {
  global.fetch = require('node-fetch');
  global.Response = global.fetch.Response;
}
