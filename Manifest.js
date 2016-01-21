var util = require("util");

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var _ = require('lodash');

var Manifest = {
    scan: function(libraryPaths) {
        if (typeof libraryPaths === 'string')
            libraryPaths = [libraryPaths];

        return Promise.map(libraryPaths, libraryPath => {
            var manifestPath = path.join(libraryPath, 'steamapps');
            var appPath = path.join(manifestPath, 'common');
            var files = fs.readdirAsync(manifestPath)
                .map(file => path.join(manifestPath, file));

            return Promise
                .map(files, this._onlyManifest)
                .then(_.compact)
        })
        .then(_.flatten)
    },
    parse: function(file) {
        var app = {};
        var fileContents = fs.readFileSync(file).toString();

        fileContents
            .split('\n')
            .forEach(line => {
                app = Object.assign(app, this._parseLine(line));
            });

        app['manifest'] = file;
        return app;
    },

    _onlyManifest: function(file, index, length) {
        var isFile = fs.statSync(file).isFile();

        if (isFile) {
            var ext = path.extname(file);

            if (ext == '.acf') {
                return file;
            }
        }
    },
    _unquote: str => str.replace(/"/gi, ''),
    _parseLine: function(line) {
        var entry = line
            .trim()
            .split(/"\s{1,}"/)
            .map(n => this._unquote(n))
            .filter(n => n != '');

        if (!_.isEmpty(entry[0]))
            entry[0] = entry[0].toLowerCase();

        var keys = {
            'appid': () => ({
                "id": parseInt(this._unquote(entry[1]))
            }),
            'name': () => ({
                "name": this._unquote(entry[1])
            }),
            'sizeondisk': () => ({
                "size": parseInt(this._unquote(entry[1]))
            }),
            'installdir': () => ({
                "appPath": this._unquote(entry[1])
            }),
            _: () => ({})
        };

        return (keys[entry[0]] || keys._)();
    }
};

module.exports = Object.create(Manifest);
