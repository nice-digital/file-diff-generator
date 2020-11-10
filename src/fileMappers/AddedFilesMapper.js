import BaseFileMapper from './BaseFileMapper.js';
import FileUtilities from '../FileUtilities.js';
import path from 'path';


export default class AddedFileMapper extends BaseFileMapper {
    constructor(config, diffGenerator) {
      super(config.newFilesPath, config.oldFilesPath);
      this.config = config;
      this.files = this.GetAllNewAndOldFiles();
      this.diffGenerator = diffGenerator;
    }

    GetFiles(){
      return this.files.newFiles.filter(x => this.files.oldFiles.includes(x) === false).map(x=> {
        let newPath = FileUtilities.ReplaceRootPathWithGivenRootPath(x, this.config.newFilesPath, '/');
        return { 
          newPath: newPath, 
          outputPath: FileUtilities.GetRelativeFilePathToRootPath(newPath, path.normalize(this.config.newFilesPath)) }
      });
    }

    GetDiffGenerator() {
      return this.diffGenerator;
    }

    GetType() {
      return "added";
    }
  }