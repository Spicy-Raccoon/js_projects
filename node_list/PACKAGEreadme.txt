Study on node.js files and explanation

To create package.json -> cmd -> npm init -y

To make the file executable from the terminal:
- add bin: {"name":"fileToRun"} to create an executable command;
- if not on Windows run in terminal: chmod +x index.js;
- add #!/usr/local/env node to the top of the js file
- link the project in terminal: npm link
- try npm install -g

Basic implementation, no promises
// change color of the file depending on the type
// create a null array with length of checked directory. Used to order the files in alphabetical order
const allStats = Array(filenames.length).fill(null);

for (let filename of filenames) {
  // use indexOf, as we're using forof loop
  const index = filenames.indexOf(filename);
  // check the stat of the item
  fs.lstat(filename, (err, stats) => {
    if (err) {
      console.log(err);
    }
    allStats[index] = stats;
    // check if any null values left in allStats
    const ready = allStats.every((stats)=>{
      //null is a falsy value, if any value is null, then every will return false
      return stats;
    });
    if (ready) {
      allStats.forEach((stats,index)=>{
        console.log(filenames[index], stats.isFile());
      });
    }
  });
}
