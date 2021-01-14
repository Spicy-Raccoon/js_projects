#!/usr/bin/env node

// console.log(arguments); to see the node.js 'invisible' function
// application for reading the files in the filesystem
// similar to "ls" in linux or "dir" in windows

// import filesystem module from node
const fs = require('fs');

// promisify method
// const util = require('util');
// const lstat = util.promisify(fs.lstat);

//fs has a built in promises module, destructure lstat from it
const { lstat } = fs.promises;
//use npm chalk package for coloring (npm install chalk)
const chalk = require('chalk');

// pass and argument to get list of items in a directory different then cwd()
const path = require('path');
const targetDir = process.argv[2] || process.cwd();

//.readdir(path[,options], callback)
// process module is included automatically in a project
// process.cwd() is prefered over ('.')
fs.readdir(targetDir, async (err, filenames)=>{ //use async with promise lstat
  // callback takes (error, filenames)
  //if err===null, it's falsy, no error, otherwise:
  if (err) {
    // error handling cod
    throw new Error(err);e//alternatively console.log(err)\nreturn
  }
  // method using map and promise.all()
  // return lstat array
  const statPromises = filenames.map(filename => {
    return lstat(path.join(targetDir, filename)); //use path.join() to get the target directory
  });
  // pass the array through Promise.all()
  const allStats = await Promise.all(statPromises);
  for (let stats of allStats) {
    const index = allStats.indexOf(stats);
    // print directory with different colors depending on item type
    if (stats.isFile()) {
      console.log(chalk.magenta(filenames[index]));
    } else {
      console.log(chalk.green(filenames[index]));
    }
  }
});
