import BaseFileMapper from './BaseFileMapper.js';
import FileUtilities from '../FileUtilities.js';
import path from 'path';

export default class ExistingFileMapper extends BaseFileMapper {
    constructor(config, diffGenerator) {
      super(config.newFilesPath, config.oldFilesPath);
      this.config = config;
      this.files = this.GetAllNewAndOldFiles();
      this.diffGenerator = diffGenerator;
    }

    GetFiles()
    {
      return this.files.newFiles.filter(x => this.files.oldFiles.includes(x) === true).map(x=> {
        let newPath = FileUtilities.ReplaceRootPathWithGivenRootPath(x, this.config.newFilesPath, '/');
        return { 
          newPath: newPath, 
          oldPath: FileUtilities.ReplaceRootPathWithGivenRootPath(x, this.config.oldFilesPath, '/'), 
          outputPath: FileUtilities.GetRelativeFilePathToRootPath(newPath, path.normalize(this.config.newFilesPath))}
      });
    }

    GetDiffGenerator() {
      return this.diffGenerator;
    }
 
    GetType() {
      return "exising";
    }
  }