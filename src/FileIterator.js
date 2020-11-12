export default class FileIterator {
    static IterateOverFilesAndWriteDifferenceToDisk(fileMappers, fileWriter) {
        let totalFiles = 0;

        if (fileMappers.length === 0)
        {
          console.log("No file mappers specified.");
          return false;
        }
          
        fileMappers.forEach((fileMapper) => {
          let files = fileMapper.GetFiles();
          if(files.length === 0)
          {
            console.log(`No ${fileMapper.GetType()} files were found.`);
            return false;
          }
          files.forEach((file) => {
            ++totalFiles;
            let result = fileMapper.GetDiffGenerator().GetDiff(file);
            if(result)
            {
              let destinationPath = fileWriter.WriteToDisk(result, file.outputPath, fileWriter.GetFileDiffView());
              console.log("Generated file diff to: " + destinationPath);
            }
          });
        });

        if(totalFiles > 0) {
          return true;
        } else {
          return false;
        }
      }
}