#!/usr/bin/env node

const fs = require('fs');
//debounce package, helper function from lodash library
const debounce = require('lodash.debounce');
//main package for app functionality
const chokidar = require('chokidar');
//print CLI documentation in app, use nameOfApp -h to get help
const program = require('caporal'); //documentation specific name
const {spawn} = require('child_process');
const chalk = require('chalk')

program
  .version('1.0.0')
  .argument('[filename]', 'Name of a file to execute')
  .action( async ({ filename }) => {
    const name = filename || 'app.js';
    //check if filename exists in the directory
    try {
      await fs.promises.access(name);
    } catch (err) {
        throw new Error (`Could not find the file ${name}`);
    }

    // kill the previous process
    let proc;
    const start = debounce(()=>{
      if (proc) {
        proc.kill();
      }
      console.log(chalk.blue('>>>>Starting Process....'));
      proc = spawn('node', [name], { stdio: 'inherit'});
    }, 200);

    chokidar
      .watch('.')
      .on('add', start) //not running start, just invoking the function
      .on('change', start)
      //unlink is chokidar for delete a file
      .on('unlink', start);
  });

program.parse(process.argv)
