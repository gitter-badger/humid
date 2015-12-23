var steam = require('./steam-local');

var libraries = [
	'/run/media/simonwjackson/6C7E3EE008C5F5B5/games/binaries/steam-win',
	'/media/storage/bowser/games/binaries/steam-win',
];

steam
  .getSteamApps(libraries)
	.then(function(data) {
		console.log(data);
	});
