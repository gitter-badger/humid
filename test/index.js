var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var path = require("path");

chai.should();
chai.use(chaiAsPromised);

var humid = require('../index');

describe('humid', () => {
    var multipuleLibraries = [
        path.join(__dirname, 'assets/library_1'),
        path.join(__dirname, 'assets/library_2')
    ];

    describe('#find()', () => {
        it('should resolve to an array', () =>
            humid.find(multipuleLibraries)
                .should.eventually.be.an("array"));
    });
});
