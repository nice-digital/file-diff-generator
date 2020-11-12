import BaseDiffGenerator from './BaseDiffGenerator.js';
import * as Diff2html from 'diff2html';
import * as Diff from 'diff';

export default class AddedDiffGenerator extends BaseDiffGenerator {
    constructor(config){
        super(config.regexReplacement);
        this.diff2htmlConfig = config.diff2htmlConfig;
    }

    GetPatch(mappedFile) {
        return Diff.createPatch(mappedFile.newPath, '', this.GetText(mappedFile.newPath))
      }
    
    GetDiff(mappedFile) {
        var parsedPatch = this.ParsePatch(this.GetPatch(mappedFile));
        parsedPatch[0].isNew = true;
        
        return Diff2html.html(parsedPatch, this.diff2htmlConfig);
    }
}