import * as Diff2html from 'diff2html';
import FileUtilities from '../FileUtilities.js';

export default class BaseDiffGenerator {
    constructor(regexReplacement) {
      this.regexReplacement = regexReplacement;
    }

    GetText(path){
      return FileUtilities.ReadFileAndReplaceStringsUsingRegex(path, this.regexReplacement)
    }

    ParsePatch(patch) {
      return Diff2html.parse(patch);
    }
  
    GetPatch() {
      throw new Error('Not implemented!');
    }
  
    GetDiff(){
        throw new Error('Not implemented!');
    }
}