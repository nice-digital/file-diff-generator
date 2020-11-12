import FileUtilities from '../FileUtilities.js';

export default class BaseFileMapper {
  constructor(newFilesPath, oldFilesPath){
    this.newFilesPath = newFilesPath;
    this.oldFilesPath = oldFilesPath;
  }

  GetAllNewAndOldFiles() {
    let newFiles = FileUtilities.GetAllFilesFromPath(this.newFilesPath).map(x=> FileUtilities.GetRelativeFilePathToRootPath(x, this.newFilesPath));
    let oldFiles = FileUtilities.GetAllFilesFromPath(this.oldFilesPath).map(x=> FileUtilities.GetRelativeFilePathToRootPath(x, this.oldFilesPath));
    
    return {newFiles: newFiles, oldFiles: oldFiles}
  }

  GetFiles() {
      throw new Error('Not implemented!');
  }

  GetDiffGenerator() {
    throw new Error('Not implemented!');
  }

  GetType() {
    throw new Error('Not implemented!');
  }
}