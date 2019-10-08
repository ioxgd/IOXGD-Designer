const fs = require("fs");
const path = require("path");
const { exec, execFile } = require("child_process");

let projectDir = `${__dirname}\\pc_simulator_win_codeblocks`;
let compilerDir = `${__dirname}\\MinGW\\bin`;
let outputDir = `${__dirname}\\output`;
let outputFile = "LittlevGL.exe";

let compiler = {
  c: 'mingw32-gcc.exe',
  linker: 'mingw32-g++.exe'
}

let flag = {
  c: '-Wall -g -DLV_CONF_INCLUDE_SIMPLE=1',
  linker: '-lmingw32 -mwindows -static-libgcc -static-libstdc++'
}

let includeDir = [
  `${__dirname}\\pc_simulator_win_codeblocks`,
  `${__dirname}\\pc_simulator_win_codeblocks\\lvgl`
];

let clean = () => {
  let deleteFolderRecursive = (path) => {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };

  deleteFolderRecursive(outputDir);
}

function execShellCommand(cmd) {
 return new Promise((resolve, reject) => {
  exec(cmd, {cwd: compilerDir }, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

let compile = async function(log_cb, useOldFile) {
  if (typeof log_cb !== "function") {
    log_cb = (msg) => console.log(msg);
  }
  if (typeof useOldFile === "undefined") {
    useOldFile = true;
  }

  if (!useOldFile) {
    clean();
  }

  var walkSync = function(dir, filelist) {
    files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
      if (fs.statSync(dir + '/' + file).isDirectory()) {
        filelist = walkSync(dir + '/' + file, filelist);
      }
      else {
        filelist.push(dir + '/' + file);
      }
    });
    return filelist;
  };

  let listCodeFile = walkSync(projectDir).filter(f => f.endsWith(".cpp") || f.endsWith(".c") || f.endsWith(".s") || f.endsWith(".S"));

  outputFiles = [];

  for await (const file of listCodeFile) {
    let outDir = path.dirname(file).replace(projectDir, outputDir);
    let fileName = path.basename(file);

    // Check exist output dir
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    if (file.endsWith(".c")) {
      let outFile = `${outDir}/${fileName}.o`;

      if (useOldFile) {
        if (fileName != "codeSimulator.c") {
          if (fs.existsSync(outFile)) {
            outputFiles.push(path.resolve(outFile));
            continue;
          }
        }
      }

      let cmd = `${compilerDir}/${compiler.c} ${flag.c} ${includeDir.map(x => `-I "${x}"`).join(' ')} -c "${file}" -o "${outFile}"`;
      try {
        log_cb(`Compile ${fileName}`);
        const output = await execShellCommand(cmd);
        if (output) {
          console.log(output);
        }
      } catch (err) {
        console.error(err);
        break;
      }
      outputFiles.push(path.resolve(outFile));
    }
  }

  let arg = [];
  arg = arg.concat(flag.linker.split(' '));
  arg = arg.concat(outputFiles);
  arg.push('-o');
  arg.push(`${outputDir}/${outputFile}`);

  log_cb(`Create ${outputFile}`);
  const output = await new Promise((resolve, reject) => {
    execFile(`${compilerDir}/${compiler.linker}`, arg, {cwd: compilerDir }, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
  if (output) {
    console.log(output);
    log_cb("Error !!!");
  }
}

let run = function() {
  return exec(`${outputDir}/${outputFile}`);
}

let writeCode = async function(code) {
  code = `#include "lvgl/lvgl.h"\nvoid codeSimulator() {\n${code}\n}\n`;

  fs.writeFileSync(`${projectDir}/codeSimulator.c`, code);
}

module.exports = {
  writeCode,
  clean,
  compile,
  run,
  outputFile
}
