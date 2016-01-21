var chai = require("chai");
var expect = require("chai").expect;
var chaiAsPromised = require("chai-as-promised");
var path = require("path");
var fs = require("fs");

chai.should();
chai.use(chaiAsPromised);

var manifest = require('../Manifest');

describe('Manifest', () => {
    describe('#scan()', () => {
        var singleLibrary = path.join(__dirname, 'assets/library_1');
        var multipuleLibraries = [
            path.join(__dirname, 'assets/library_1'),
            path.join(__dirname, 'assets/library_2')
        ];

        it('should accept a string of a path', () => manifest.scan(singleLibrary)
            .should.eventually.be.an("array"));

        it('should resolve to an array', () => manifest.scan(multipuleLibraries)
            .should.eventually.be.an("array"));

        it('should not be empty', () => manifest.scan(multipuleLibraries)
            .should.eventually.have.length.above(0));
    });

    describe('#parse()', () => {
        var manifestFile = path.join(__dirname, 'assets/library_1/steamapps/appmanifest_241600.acf');
        var manifestObject = manifest.parse(manifestFile);

        it('should read a manifest file and return an object literal', () => {
            manifestObject.should.be.an("object");

            manifestObject.should.have.property("manifest");
            expect(manifestObject.manifest).to.equal(manifestFile);

            manifestObject.should.have.property("id");
            expect(manifestObject.id).to.equal(241600);

            manifestObject.should.have.property("name");
            expect(manifestObject.name).to.equal("Rogue Legacy");

            manifestObject.should.have.property("size");
            expect(manifestObject.size).to.equal(337208904);

            manifestObject.should.have.property("appPath");
        });
    });
});
