var steam = require('./index');
var _ = require('lodash');
var fs = require('fs');
var Promise = require('bluebird');
var exec = require('child_process').exec;
var mv = Promise.promisify(require('mv'));

var maxGB = 0;

var moveTo = "h:";
var libraries = [
    'g:\\games\\binaries\\steam-win',
];

var reduceToSize = data => {
    var init = {
        items: [],
        total: 0
    };

    data = data.reduce((memo, item) => {
        memo.total += item.size;

        if (memo.total <= maxGB)
            memo.items.push(item);

        return memo;
    }, init);

    return data.items;
}

var bytesFree = driveLetter => {
    var command = 'fsutil volume diskfree ' + driveLetter;

    return new Promise(function(res, rej) {
        exec(command, function(error, stdout, stderr) {
            var lines = stdout.split("\r\n");
            maxGB = lines[0].replace("Total # of free bytes        : ", '');
            res(maxGB);
        });
    });
}

var moveGame = item => {
    var newGamePath = moveTo + item.full_path.substring(2);
    var newManifestPath = moveTo + item.manifest.substring(2);
    var opts = {
        mkdirp: true
    };

    if (!fs.existsSync(item.full_path)) {
        console.log(item.name, 'Missing.. Moving now..');

        return mv(item.manifest, newManifestPath, opts);
    } else {
        console.log("Moving..", item.name);

        return mv(item.full_path, newGamePath, opts)
            .then(() => mv(item.manifest, newManifestPath, opts))
    }
}

steam
    .find(libraries)
    // .tap(bytesFree.bind(null, moveTo))
    // .then(data => _.orderBy(data, ['size'], ['asc']))
    // .then(reduceToSize)
    // .mapSeries(moveGame)
    .catch(console.log);
