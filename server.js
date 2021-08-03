'use strict';
require('dotenv').config();
require('rootpath')();

const
    { Core } = require('src/core');

Core.startProcess().then(console.log('I\'m a then'));