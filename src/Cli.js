#!/usr/bin/env node
import FileIterator  from './FileIterator.js';
import FileUtilities from './FileUtilities.js';
import FileWriter from './FileWriter.js';
import ExistingFilesMapper from './fileMappers/ExistingFilesMapper.js';
import ExistingDiffGenerator from './fileMappers/ExistingDiffGenerator.js';
import AddedFilesMapper from './fileMappers/AddedFilesMapper.js';
import AddedDiffGenerator from './fileMappers/AddedDiffGenerator.js';
import DeletedFilesMapper from './fileMappers/DeletedFilesMapper.js';
import DeletedDiffGenerator from './fileMappers/DeletedDiffGenerator.js';
import path from 'path';
import minimist from 'minimist';
const args = minimist(process.argv);
var fileMappers;
var fileWriter;
var config;

export default class Cli {
  static Setup(config) {
    config.diff2htmlConfig = { drawFileList: true, matching: 'lines', outputFormat: config.outputFormat };

    fileMappers = [new ExistingFilesMapper(config, new ExistingDiffGenerator(config)),
                  new AddedFilesMapper(config, new AddedDiffGenerator(config)),
                  new DeletedFilesMapper(config, new DeletedDiffGenerator(config))]
    
    fileWriter = new FileWriter(config.outputPath);
  }
  
  static CleanUp(outputPath) {
      console.log("Deleting output directory...");
      FileUtilities.deleteFolderRecursive(path.join(process.cwd(), outputPath));
  }
  
  static CheckParameters(config)
  {
    let continueScript = true;
  
    if(!config.newFilesPath)
    {
      console.log("No new files path specified.");
      continueScript = false;
    } 
    
    if (!config.oldFilesPath) {
      console.log("No old files path specified.");
      continueScript = false;
    } 
    
    if (!config.outputPath){
      console.log("No output path specified.");
      continueScript = false;
    }
  
    if (config.regexReplacement){
      try {
        eval(config.regexReplacement);
      } catch {
        console.log("The JSON string specified appears to be malformed. Please ensure to single escape double quotes.");
        continueScript = false;
      }
    }
  
    if(!continueScript)
    {
      return false;
    } else {
      return true;
    }
  }
  
  static ExecuteFileDiffGenerator() {
     console.log("Executing file diff generator...");
     return FileIterator.IterateOverFilesAndWriteDifferenceToDisk(fileMappers, fileWriter);
  }
  
  static Run(config)
  {
    const finishedMsg = "Finished.";
    let mergeResultsToFile;

    this.Setup(config);

    if(this.CheckParameters(config)) {
      this.CleanUp(config.outputPath);
      let resultOfDiffGenerator = this.ExecuteFileDiffGenerator();
      if(resultOfDiffGenerator) 
      {
        if(config.merge) {
          mergeResultsToFile = fileWriter.MergeAllResultsIntoASingleFile(FileUtilities.GetAllFilesFromPath(config.outputPath), 
          config.outputFilePath);
        }
        let inputPathList = FileUtilities.GetAllFilesFromPath(config.outputPath);
        fileWriter.CollateResultantFilePathsIntoASingleFile(inputPathList, config.outputPath);
      }
    }
 
    return new Promise((resolve) => {
      if(mergeResultsToFile)
      {
        mergeResultsToFile.then((result)=>{
          console.log(result);
          resolve(finishedMsg);
        });
      } else {
        resolve(finishedMsg);
      }
    }); 
  }
}

config = {
  newFilesPath: args["new"],
  oldFilesPath: args["old"],
  outputPath: args["output"],
  outputFormat: args["outputFormat"],
  regexReplacement : args["regexReplacement"],
  merge: args["merge"]
};

Cli.Run(config).then((result)=>{
  console.log(result);
});
