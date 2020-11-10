import BaseFileMapper from './BaseFileMapper.js';
import FileUtilities from '../FileUtilities.js';
import path from 'path';

export default class DeletedFileMapper extends BaseFileMapper {
    constructor(config, diffGenerator) {
      super(config.newFilesPath, config.oldFilesPath);
      this.config = config;
      this.files = this.GetAllNewAndOldFiles();
      this.diffGenerator = diffGenerator;
    }

    GetFiles() {
      return this.files.oldFiles.filter(x => this.files.newFiles.includes(x) === false).map(x=> {
        let oldPath =  FileUtilities.ReplaceRootPathWithGivenRootPath(x, this.config.oldFilesPath, '/');
        return { 
          oldPath: oldPath,  
          outputPath: FileUtilities.GetRelativeFilePathToRootPath(oldPath, path.normalize(this.config.oldFilesPath)) }
      });
    }

    GetDiffGenerator() {
      return this.diffGenerator;
    }

    GetType() {
      return "deleted";
    }
  }