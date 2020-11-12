import BaseDiffGenerator from './BaseDiffGenerator.js';
import * as Diff2html from 'diff2html';
import * as Diff from 'diff';

export default class ExistingDiffGenerator extends BaseDiffGenerator {
    constructor(config){
        super(config.regexReplacement);
        this.diff2htmlConfig = config.diff2htmlConfig;
    }

    GetPatch(mappedFile) {
        return Diff.createPatch(mappedFile.newPath, this.GetText(mappedFile.oldPath),
        this.GetText(mappedFile.newPath))
      }
    
    GetDiff(mappedFile) {
        var parsedPatch = this.ParsePatch(this.GetPatch(mappedFile));
        if(parsedPatch[0].addedLines === 0 && parsedPatch[0].deletedLines === 0)
          return null;
        
        return Diff2html.html(parsedPatch, this.diff2htmlConfig);
    }   
}