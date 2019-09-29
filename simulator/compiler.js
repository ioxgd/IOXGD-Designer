const util = require("util");
const fs = require("fs");
const path = require("path");
const execPromise = util.promisify(require("child_process").exec);
const exec = require("child_process").exec;
const log = require("./log");
const engine = Vue.prototype.$engine;
const { default: PQueue } = engine.util.requireFunc("p-queue");
const GB = Vue.prototype.$global;
const mkdirp = engine.util.requireFunc("mkdirp");

//---- setup dir and config ----//
let platformName = "arduino-avr";
let platformDir = `${engine.util.platformDir}/${platformName}`;
let platformLibDir = `${platformDir}/lib`;


const ospath = function(p) {
  if (process.platform == "win32") {
    return p.replace(/\//g, "\\");
  }
  return p;
};

const getName = (file) => path.basename(file).split(".")[0];
const getFileName = (file) => path.basename(file);

var G = {};

const setConfig = (context) => {
  let localContext = JSON.parse(fs.readFileSync(`${platformDir}/context.json`,
    "utf8"));
  G = Object.assign({}, localContext);
  G.board_name = context.board_name;   //require boardname
  G.app_dir = context.app_dir;         //require app_dir
  G.process_dir = context.process_dir; //require working dir
  G.cb = context.cb || function() {};
  G.board_context = context.board_context;

  if (!G.cpp_options) {
    G.cpp_options = [];
  }

  G.cflags = G.cflags.map(f => f.replace(/\{platform\}/g, platformDir));
  G.cppflags = G.cppflags.map(f => f.replace(/\{platform\}/g, platformDir));
  G.ldflags = G.ldflags.map(f => f.replace(/\{platform\}/g, platformDir));
  G.ldlibflag = G.ldlibflag.map(f => f.replace(/\{platform\}/g, platformDir));
  
  G.core_files = fs.readdirSync(`${platformDir}/sdk/cores/arduino`).filter(
    f => f.endsWith(".cpp") || f.endsWith(".c") || f.endsWith(".s") || f.endsWith(".S"));

  G.core_files = G.core_files.map(f => `${platformDir}/sdk/cores/arduino/${f}`);

  G.COMPILER_AR = `${platformDir}/${G.toolchain_dir}/avr-ar`;
  G.COMPILER_GCC = `${platformDir}/${G.toolchain_dir}/avr-gcc`;
  G.COMPILER_CPP = `${platformDir}/${G.toolchain_dir}/avr-g++`;
  G.COMPILER_OBJCOPY = `${platformDir}/${G.toolchain_dir}/avr-objcopy`;

  G.COMPILER_AVRDUDE = `${platformDir}/${G.toolchain_dir}/avrdude`;
  G.AVRDUDE_CONFIG = `${platformDir}/tools/etc/avrdude.conf`;

  G.ELF_FILE = `${G.app_dir}/${G.board_name}.elf`;
  G.BIN_FILE = `${G.app_dir}/${G.board_name}.hex`;
  G.ARCHIVE_FILE = `${G.app_dir}/libmain.a`;
};
//=====================================//

function compile(rawCode, boardName, config, cb) {
  console.log(`[kbpro] compiler.compile platformDir = ${platformDirectory}`);
  return new Promise((resolve, reject) => {
    //---- setup dir and config ----//
    let config = GB.board.board_info;
    let boardDirectory = `${engine.util.boardDir}/${config.name}`;
    let platformDirectory = `${engine.util.platformDir}/${config.platform}`;
    let boardIncludeDir = `${boardDirectory}/include`;
    let platformIncludeDir = `${platformDirectory}/include`;
    let context = JSON.parse(fs.readFileSync(boardDirectory + "/context.json", "utf8"));
    let platformCompiler = engine.util.requireFunc(`${platformDirectory}/compiler`);

    //--- init ---//
    let codegen = null;
    if (fs.existsSync(`${boardDirectory}/codegen.js`)) {
      codegen = require(`${boardDirectory}/codegen.js`);
    } else {
      codegen = engine.util.requireFunc(`${platformDirectory}/codegen`);
    }
    //---- inc folder ----//
    let app_dir = `${boardDirectory}/build/${boardName}`;
    let inc_src = engine.util.walk(boardIncludeDir)
      .filter(file => path.extname(file) === ".cpp" || path.extname(file) === ".c");
    inc_src = inc_src.concat(engine.util.walk(platformIncludeDir)
      .filter(file => path.extname(file) === ".cpp" || path.extname(file) === ".c"));
    let inc_switch = [];
    //--- step 1 load template and create full code ---//
    let sourceCode = null
    let codeContext = null;
    if (config.isSourceCode) {
      sourceCode = rawCode;
      //searching all include to find matched used plugin file
      codeContext = {
        plugins_sources: [],
        plugins_includes_switch: [],
      };
      let pluginInfo = GB.plugin.pluginInfo;
      let incsRex = /#include\s*(?:\<|\")(.*?\.h)(?:\>|\")/gm;
      let m;
      while (m = incsRex.exec(sourceCode)) {
        let incFile = m[1].trim();
        //lookup plugin exist inc file and not added to compiled files.
        let includedPlugin = pluginInfo.categories.find(
          obj=>
            obj.sourceFile.includes(incFile) &&
            !codeContext.plugins_includes_switch.includes(obj.sourceIncludeDir)
        );
        if (includedPlugin) {
          codeContext.plugins_includes_switch.push(includedPlugin.sourceIncludeDir);
          let cppFiles = includedPlugin.sourceFile
            .filter(el=>el.endsWith(".cpp") || el.endsWith(".c"))
            .map(el=>includedPlugin.sourceIncludeDir + "/" +el);
          codeContext.plugins_sources.push(...cppFiles);
        }
      }
    } else {
      let res = codegen.generate(rawCode);
      sourceCode = res.sourceCode;
      codeContext = res.codeContext;
    }
    //----- plugin file src ----//
    inc_src = inc_src.concat(codeContext.plugins_sources);
    inc_switch = inc_switch.concat(codeContext.plugins_includes_switch);
    //------ clear build folder and create new one --------//
    if (fs.existsSync(app_dir)) {
      engine.util.rmdirf(app_dir);
    }
    mkdirp.sync(app_dir);
    //-----------------------------------------------------//
    fs.writeFileSync(`${app_dir}/user_app.cpp`, sourceCode, "utf8");
    //--- step 3 load variable and flags ---//
    let cflags = [];
    let ldflags = [];
    let libflags = [];
    if (context.cflags) {
      cflags = context.cflags.map(f => f.replace(/\{board\}/g, boardDirectory));
    }
    if (context.ldflags) {
      ldflags = context.ldflags.map(
        f => f.replace(/\{board\}/g, boardDirectory));
    }
    if (context.libflags) {
      libflags = context.libflags.map(
        f => f.replace(/\{board\}/g, boardDirectory));
    }
    //--- step 4 compile
    let contextBoard = {
      board_name: boardName,
      app_dir: app_dir,
      process_dir: boardDirectory,
      board_context : context,
      cb,
    };

    inc_src.push(`${app_dir}/user_app.cpp`);
    platformCompiler.setConfig(contextBoard);

    platformCompiler.compileFiles(inc_src, [], cflags, inc_switch)
      .then(() => {
        //return platformCompiler.archiveProgram(inc_src);
        //return engine.util.promiseTimeout(1000);
        //}).then(() => {
        return platformCompiler.linkObject(ldflags, libflags);
      }).then(() => {
      return platformCompiler.createBin();
    }).then(() => {
      resolve();
    }).catch(msg => {
      console.log("error msg : " + msg);
      reject(msg);
    });
  });
}
//=====================================//
const compileFiles = async function(
  sources, boardCppOptions, boardcflags, plugins_includes_switch,
  concurrent = 8) {
  console.log(`arduino-avr compiler.compileFiles`);
  const queue = new PQueue({ concurrency: concurrent });

  return new Promise(async (resolve, reject) => {
    let cflags = `${G.cflags.join(" ")} ${boardcflags.join(" ")}`;
    let cppOptions = G.cpp_options.join(" ") + boardCppOptions.join(" ");
    let inc_switch = plugins_includes_switch.map(obj => `-I"${obj}"`).join(" ");
    let debug_opt = G.board_context.arch
      ? (" -mmcu=" + G.board_context.mcu)
      : "";
    debug_opt += G.board_context.cpu_clock
      ? (" -DF_CPU=" + G.board_context.cpu_clock)
      : "";
    
    debug_opt +=  G.ARDUINO_VERSION ? (" -DARDUINO=" + G.ARDUINO_VERSION) : (G.board_context.arduino_version ? (" -DARDUINO=" + G.board_context.arduino_version) : "");

    debug_opt += " -DARDUINO_" + G.board_context.arch + " -DARDUINO_ARCH_";

    console.log(`arduino-avr/compiler.js`);

    fs.copyFileSync(`${platformDir}/main.cpp`, `${G.app_dir}/main.cpp`);
    sources.push(`${G.app_dir}/main.cpp`);
    sources = sources.concat(G.core_files);
    //console.log(G.core_files);
    let exec = async function(file, cmd) {
      try {
        console.log("comping => " + file);
        const { stdout, stderr } = await execPromise(ospath(cmd),
          { cwd: G.process_dir });
        if (!stderr) {
          console.log(`compiling... ${file} ok.`);
          G.cb(`compiling... ${path.basename(file)} ok.`);
        } else {
          console.log(`compiling... ${file} ok. (with warnings)`);
          G.cb({
            file: path.basename(file),
            error: null
          });
        }
      } catch (e) {
        console.error(`[arduino-avr].compiler.js catch something`, e.error);
        console.error(`[arduino-avr].compiler.js >>> `, e);
        let _e = {
          file: file,
          error: e
        };
        reject(_e);
      }
    };
    for (let i in sources) {
      let file = sources[i];
      let filename = getFileName(file);
      //let fn_obj = `${G.app_dir}/${filename}.o`;
      let fn_obj = `${G.app_dir}/${filename}.o`;
      let cmd_c = `"${G.COMPILER_GCC}" ${cppOptions} ${cflags} ${inc_switch} ${debug_opt} -c "${file}" -o "${fn_obj}"`;
      let cmd_cpp = `"${G.COMPILER_CPP}" ${cppOptions} ${cflags} ${inc_switch} ${debug_opt} -c "${file}" -o "${fn_obj}"`;
      let cmd = file.endsWith(".c")
        ? cmd_c
        : cmd_cpp;
      queue.add(async () => { await exec(file, cmd); });
    }
    await queue.onIdle();
    resolve();
  });
};

function linkObject(ldflags, extarnal_libflags) {
  console.log(`linking... ${G.ELF_FILE}`);
  G.cb(`linking... ${G.ELF_FILE}`);
  let flags = G.ldflags.concat(ldflags);
  let libflags = (extarnal_libflags)
    ? G.ldlibflag.concat(extarnal_libflags).join(" ")
    : G.ldlibflag.join(" ");
  flags = G.ldflags.join(" ") + " " + ldflags.join(" ");
  let obj_files = fs.readdirSync(G.app_dir).filter(f => f.endsWith(".o"));
  obj_files = obj_files.map(f => `"${G.app_dir}/${f}"`).join(" ");
  let debug_opt = G.board_context.arch
    ? (" -mmcu=" + G.board_context.mcu)
    : "";
  debug_opt += G.board_context.cpu_clock
    ? (" -DF_CPU=" + G.board_context.cpu_clock)
    : "";
  debug_opt += G.board_context.arduino_version
    ? (" -DARDUINO=" + G.board_context.arduino_version)
    : "";
  debug_opt += " -DARDUINO_" + G.board_context.arch + " -DARDUINO_ARCH_" + ((G.board_context.arduino_arch) ? G.board_context.arduino_arch : "");
  let cmd = `"${G.COMPILER_GCC}" ${flags} ${debug_opt} -o ${G.ELF_FILE} ${obj_files} -L${G.app_dir} -lm`;
  return execPromise(ospath(cmd), { cwd: G.process_dir });
}

function archiveProgram(plugins_sources) {
  console.log(`archiving... ${G.ARCHIVE_FILE} `);
  let obj_files = plugins_sources.map(
    plugin => `"${G.app_dir}/${getName(plugin)}.o"`).join(" ");
  var cmd = `"${G.COMPILER_AR}" cru "${G.ARCHIVE_FILE}" ${obj_files}`;
  return execPromise(ospath(cmd), { cwd: G.process_dir });
}

function createBin() {
  log.i(`creating hex image... ${G.BIN_FILE}`);
  //let eeprom_section = getName(G.ELF_FILE) + ".epp"
  //let hex_section = getName(G.ELF_FILE) + ".hex"
  //let cmd_eeprom = `"${G.COMPILER_OBJCOPY}"  -O ihex -j .eeprom --set-section-flags=.eeprom=alloc,load --no-change-warnings --change-section-lma .eeprom=0 "${G.ELF_FILE}" "${eeprom_section}"`
  //execPromise(ospath(cmd), {cwd: G.process_dir});
  let cmd_hex = `"${G.COMPILER_OBJCOPY}" -O ihex -R .eeprom "${G.ELF_FILE}" "${G.BIN_FILE}"`;
  return execPromise(ospath(cmd_hex), { cwd: G.process_dir });
}

function flash(port, baudrate, stdio) {
  baudrate = G.board_context.baudrate || baudrate || 115200;
  stdio = stdio || "inherit";
  let part = G.board_context.mcu || "atmega328p";
  let protocol = G.board_context.protocol || "arduino";
  let cmd = `"${G.COMPILER_AVRDUDE}" -C "${G.AVRDUDE_CONFIG}" -p${part} -c${protocol} -P${port} -b${baudrate} -D -Uflash:w:${G.BIN_FILE}:i`;
  return execPromise(ospath(cmd), {
    cwd: G.process_dir,
    stdio
  });
}

module.exports = {
  setConfig,
  linkObject,
  compileFiles,
  archiveProgram,
  createBin,
  flash
};
