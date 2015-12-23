"use strict";

var util = require("util");

var fs      = require('fs'),
    path    = require('path'),
    wrench  = require('wrench'),
    Promise = require('bluebird'),
    mv      = require('mv');

Promise.promisifyAll(fs);

////////////
// Private
///////////

function removeDoubleQuotes(str) {
	return str.replace(/"/gi, '');
}

function getContent(filename) {
	return fs.readFileAsync(filename);
}

function parseManifestLine(line, library_path) {
  var steamApp = [];
  var entry = line.trim().split("\t");
  entry[0] = removeDoubleQuotes(entry[0].toLowerCase());
  entry = entry.filter(function(n){ return n != '' });

  if (entry[0] == "appid") {
    steamApp['appid'] = removeDoubleQuotes(entry[1]);
  }
  else if (entry[0] == "name") {
    steamApp['name'] = removeDoubleQuotes(entry[1]);
  }
  else if (entry[0] == "sizeondisk") {
    steamApp['size'] = removeDoubleQuotes(entry[1]);
  }
  else if (entry[0] == "installdir") {
    steamApp['dir_name'] = removeDoubleQuotes(entry[1]);
    steamApp['full_path'] = path.join(library_path, 'steamapps', 'common', steamApp['dir_name']);
  }

  return steamApp;
}

function parseAcf(fullPath, library_path) {
	var steamApp = {};

	return new Promise(function(resolve, reject) {
		getContent(fullPath)
			.then(function(content) {
				content.toString().split('\n')
					.forEach(function(line) {
            var new_line = parseManifestLine(line, library_path);
            steamApp = Object.assign(steamApp, new_line);
					});

				steamApp['manifest'] = fullPath;
			})
			.finally(function(){
				resolve(steamApp);
			});
	});
}

function getManifestFiles(library_path) {
	return new Promise(function(resolve, reject) {
		var acf_path = path.join(library_path, 'steamapps');
		var app_path = path.join(acf_path, 'common');
		var pth = fs.readdirAsync(acf_path);

		Promise.map(pth, function(file, index, length) {
			var fullpath = path.join(acf_path, file);
			var isFile = fs.statSync(fullpath).isFile();

			if (isFile) {
				var ext =	path.extname(fullpath);

				if (ext == '.acf') {
					return Promise.resolve(file);
				}
			}
		}).then(function(arr){
			resolve(arr.filter(function(n){
				return n != undefined
			}));
		});
	});
}

////////////
// Exports
///////////

exports.moveSteamApp = function(app, dest, cb) {
	var app_final_path = path.join(dest, 'steamapps', 'common', app['dir_name'])
	var manifest_final_path = path.join(dest, 'steamapps', 'appmanifest_' + app['appid'] + '.acf')

	console.log('Moving..', app['name']);

	mv(app['manifest'], manifest_final_path, {mkdirp: true});
	wrench.copyDirSyncRecursive(app['full_path'], app_final_path);
	cb('done');
};

exports.getSteamApps = function(libraries) {
	var steamApps = [];

	return new Promise(function(resolve, reject) {
		Promise.each(libraries, function(library_path) {
			return getManifestFiles(library_path).then(function(manifest_files) {
			   return Promise.mapSeries(manifest_files, function(file) {
				    var acf_path = path.join(library_path, 'steamapps');
				    var fullpath = path.join(acf_path, file);
				    return parseAcf(fullpath, library_path);
			   })
         .then(function(data){
            steamApps = steamApps.concat(data);
         });
		  })
		})
    .then(function(){
      resolve(steamApps);
    });
	});
};
