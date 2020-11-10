import BaseDiffGenerator from './BaseDiffGenerator.js';
import * as Diff2html from 'diff2html';
import * as Diff from 'diff';

export default class DeletedDiffGenerator extends BaseDiffGenerator {
    constructor(config){
        super(config.regexReplacement);
        this.diff2htmlConfig = config.diff2htmlConfig;
    }

    GetPatch(mappedFile) {
        return Diff.createPatch(mappedFile.oldPath, this.GetText(mappedFile.oldPath), '')
      }
    
    GetDiff(mappedFile) {
        var parsedPatch = this.ParsePatch(this.GetPatch(mappedFile));
        parsedPatch[0].isDeleted = true;
        
        return Diff2html.html(parsedPatch, this.diff2htmlConfig);
    }
}