const util = require("util");
const fs = require("fs");
const path = require("path");
const { exec, execSync, execFile } = require("child_process");
const process = require("process");

let projectDir = "D:\\GitHub\\IOXGD-Designer\\simulator\\pc_simulator_win_codeblocks";
let compilerDir = "D:\\GitHub\\IOXGD-Designer\\simulator\\MinGW\\bin";
let outputDir = "D:\\GitHub\\IOXGD-Designer\\simulator\\output";
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
  "D:\\GitHub\\IOXGD-Designer\\simulator\\pc_simulator_win_codeblocks",
  "D:\\GitHub\\IOXGD-Designer\\simulator\\pc_simulator_win_codeblocks\\lvgl"
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

let compile = (finishCallback) => {
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
  completeCounter = 0;
  listCodeFile.forEach((file) => {
    let outDir = path.dirname(file).replace(projectDir, outputDir);
    let fileName = path.basename(file);

    // Check exist output dir
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    if (file.endsWith(".c")) {
      let outFile = `${outDir}/${fileName}.o`;

      let cmd = `${compilerDir}/${compiler.c} ${flag.c} ${includeDir.map(x => `-I "${x}"`).join(' ')} -c "${file}" -o "${outFile}"`;
      exec(cmd, {cwd: compilerDir }, function(error, stdout, stderr) {
        if (error) {
          console.log(`Compile ${fileName} fail`);
          console.error(stderr);
          console.log(stdout);
          process.exit(0);
          return;
        }

        console.log(`Compile ${fileName} OK`);
        completeCounter++;

        if (completeCounter == listCodeFile.length) {
          getExe();
        }
      });
      outputFiles.push(outFile);
    }
  });

  let getExe = function() {
    let arg = [];
    arg = arg.concat(flag.linker.split(' '));
    arg = arg.concat(outputFiles);
    arg.push('-o');
    arg.push(`${outputDir}/${outputFile}`);

    execFile(`${compilerDir}/${compiler.linker}`, arg, {cwd: compilerDir }, function(error, stdout, stderr) {
      if (error) {
        console.log("Get Exe error !");
        console.error(stderr);
        console.log(stdout);
      } else {
        // console.log("Finish !");
        if (typeof finishCallback === "function") {
          finishCallback();
        }
      }
    });
  }
}

console.log("Clean");
clean();

console.log("Compile...");
compile(() => console.log("Finish !"));

