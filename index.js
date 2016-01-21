"use strict";

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var manifest = require('./Manifest');

var humid = {
    find: function(libraries) {
        return manifest
            .scan(libraries)
            .map(file => manifest.parse(file));
    }
};

module.exports = Object.create(humid);
