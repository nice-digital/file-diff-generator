import FileUtilities from './FileUtilities.js';
import multistream from 'multistream';
import fs from 'fs';
import ejs from 'ejs';
import mkdirp from 'mkdirp';
import path from 'path';

export default class FileWriter {
    constructor(outputPath){
        this.outputPath = outputPath;
    }
    
    GetFileDiffView(){
        return '/views/diff.ejs';
    }

    GetFileListView(){
        return '/views/fileList.ejs';
    }

    ApplyTemplate(content, view){
        const templatePath = path.join(__dirname, view);
        let template = fs.readFileSync(templatePath, 'utf8');
        return ejs.render(template, { content: content }, { filename: templatePath });
    }

    WriteToDisk(content, filePath, view) {
        let destinationPath = path.join(this.outputPath, path.parse(filePath).dir, path.parse(filePath).name + '.html');
        mkdirp.sync(path.dirname(destinationPath));
        fs.writeFileSync(destinationPath, this.ApplyTemplate(content, view));
        
        return destinationPath;
    }

    CollateResultantFilePathsIntoASingleFile(inputPathList)
    {
      inputPathList = inputPathList.map(x=> FileUtilities.GetRelativeFilePathToRootPath(x, this.outputPath + '/'));
      let destinationPath = this.WriteToDisk(inputPathList, "filesList.html", this.GetFileListView());
      console.log("Finished collating file list page: " + destinationPath);
    }

    MergeAllResultsIntoASingleFile(inputPathList){
        let outputPathOfResults = path.join(this.outputPath, 'allResults.html');
        return new Promise((resolve, reject) => {
          var output = fs.createWriteStream(outputPathOfResults);
          var inputList = inputPathList.map((path) => {
              return fs.createReadStream(path);
          });
          var multiStream = new multistream(inputList);
          multiStream.pipe(output);
          output.on('close', () => {
              resolve("Finished merging files into a single file: " + outputPathOfResults);
          });
          multiStream.on('error', () => {
              reject(false);
          });
      });
    }
}