import FileUtilities from '../src/FileUtilities.js';
import Cli from '../src/Cli.js';
import path from 'path';
import * as chai from 'chai';  
import chai_fs from 'chai-fs';  
chai.use(chai_fs);
const assert = chai.assert;

const config = {
  newFilesPath: "test/new",
  oldFilesPath: "test/old",
  outputPath: "output",
  outputFormat: "line-by-line",
  regexReplacement : '[ { regex: /data-buildnumber=\".+?\"/, replacement: "data-buildnumber=\\"\\"" } ]',
  merge: true
}

beforeAll((done) => {
  Cli.Run(config).then(function(result) {
    console.log(result);
    done();
  });
});

describe('#file-diff-generator', function () {
    it('should compare files from two paths and create a diff for each file processed', function () {
        let expectedPath = "output/abacavir.html";
        expect(FileUtilities.ReadFileAndReturnData(expectedPath)).toMatchSnapshot(path.join('../', expectedPath));
    });

    it('should not create a diff file if the files are the same', function () {
      let notExpectedPath = "output/zanamivir.html";
      assert.notPathExists(notExpectedPath);
    });

    it('should create a diff for files in sub directories', function () {
      let expectedPathForFileInSubFolder = "output/sub-folder/paracetamol.html";
      expect(FileUtilities.ReadFileAndReturnData(expectedPathForFileInSubFolder)).toMatchSnapshot(path.join('../', expectedPathForFileInSubFolder));
    });

    it('should handle any extension type', function () {
      let expectedPath1 = "output/calcitriol.html";
      let expectedPath2 = "output/bnf.html";
      assert.pathExists(expectedPath1);
      assert.pathExists(expectedPath2);
    });

    it('should create a diff for a new file with no corresponding old file (added / renamed / moved)', function () {
      let expectedPath = "output/belatacept.html";
      expect(FileUtilities.ReadFileAndReturnData(expectedPath)).toMatchSnapshot(path.join('../', expectedPath));
    });

    it('should create a diff for an old file with no corresponding new file (deleted / renamed / moved)', function () {
      let expectedPath = "output/calcitriol.html";
      expect(FileUtilities.ReadFileAndReturnData(expectedPath)).toMatchSnapshot(path.join('../', expectedPath));
    });

    it('should replace strings in files using regex parameter', function () {
      let expectedPath = "output/selenium.html";
      expect(FileUtilities.ReadFileAndReturnData(expectedPath)).toMatchSnapshot(path.join('../', expectedPath));
    });

    it('should merge all file diffs into a single file', function () {
      let expectedPath = "output/allResults.html";
      assert.pathExists(expectedPath);
      expect(FileUtilities.ReadFileAndReturnData(expectedPath)).toMatchSnapshot(path.join('../', expectedPath));
    });

    it('should collate resultant file paths into a single file', function () {
      let expectedPath = "output/filesList.html";
      assert.pathExists(expectedPath);
      expect(FileUtilities.ReadFileAndReturnData(expectedPath)).toMatchSnapshot(path.join('../', expectedPath));
    });
});
