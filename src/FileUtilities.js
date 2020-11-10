import fs from 'fs';
import path from 'path';
import glob from 'glob';

export default class FileUtilities {
    static GetAllFilesFromPath(path) {
      return glob.sync(path + "/**/*", { 'nodir': true });
    };

    static GetRelativeFilePathToRootPath(filePath, path){
      return filePath.replace(path, '');
    }

    static ReplaceRootPathWithGivenRootPath(filePath, newRootPath, currentRootPath){
      return path.join(newRootPath, this.GetRelativeFilePathToRootPath(filePath, currentRootPath));
    }

    static ReadFileAndReturnData(filePath) {
      return fs.readFileSync(filePath).toString();
    }

    static ReplaceStringsUsingRegEx(string, regexReplacement){
      regexReplacement = eval(regexReplacement)
      if(regexReplacement) {
          regexReplacement.forEach(x => {
              string = string.replace(x.regex, x.replacement);
          });
      }

      return string;
    }

    static ReadFileAndReplaceStringsUsingRegex(filePath, regexReplacement){
      let content = fs.readFileSync(filePath).toString(); 

      return this.ReplaceStringsUsingRegEx(content, regexReplacement);
    }

    static deleteFolderRecursive(fpath) {
        if (fs.existsSync(fpath)) {
          fs.readdirSync(fpath).forEach((file, index) => {
            const curPath = path.join(fpath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
              this.deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(fpath);
        }
    };
}