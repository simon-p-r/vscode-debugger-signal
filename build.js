'use strict';

const Path = require('path');
const Spawn = require('child_process').spawn;


let cmakeBuildType = null;
let cmakeTargetArch = null;
let buildDir = null;
let vcpkgHome = null;
let targetToolSet = null;
let generatorName = null;


const targetPlatform = '8.1';


const cmdLineArgs = process.argv.slice(2);
const buildType = cmdLineArgs[0];
if (buildType === 'Debug' || buildType === 'Release') {
    cmakeBuildType = buildType;
} else {
    cmakeBuildType = 'Debug';
};

const targetArch = cmdLineArgs[1];
if (targetArch === 'x86' || targetArch === 'x64') {
    cmakeTargetArch = targetArch;
} else {
    cmakeTargetArch = 'x64';
};



if (process.env.VCPKG_HOME) {
    vcpkgHome = process.env.VCPKG_HOME;
} else {
    throw new Error('Vcpkg root env variable not found');
}


const vcpkgToolchain = Path.join(vcpkgHome, 'scripts/buildsystems/vcpkg.cmake');
if (cmakeTargetArch === 'x86') {
    buildDir = Path.join(process.cwd(), 'build-x86');
    targetToolSet = 'x86-windows';
    generatorName = 'Visual Studio 14 2015';
} else {
    buildDir = Path.join(process.cwd(), 'build');
    targetToolSet = 'x64-windows';
    generatorName = 'Visual Studio 14 2015 Win64';
}


const args = [
    '-O',
    buildDir,
    '-G',
    generatorName,
    `--CDCMAKE_SYSTEM_VERSION=${targetPlatform}`,
    `--CDCMAKE_TOOLCHAIN_FILE=${vcpkgToolchain}`,
    `--CDVCPKG_TARGET_TRIPLET=${targetToolSet}`,
    '--colors'
];


const opts = {
   argv: args,
   arch: 'x64',
   runtime: 'node'
};


const runCmake = (opts, target, cb) =>  {
    
    const cmakejsMain = require.resolve('cmake-js');
    let cmakeCmd = '.bin/cmake-js';
    if(process.platform === 'win32') {
        cmakeCmd = '.bin/cmake-js.cmd';
    }
    
    const cmakejsBin = Path.join(Path.dirname(Path.dirname(cmakejsMain)), cmakeCmd);
    const args = ['rebuild'];
    args.push('--runtime-version=' + target);
    args.push('--target_arch=' + opts.arch);
    args.push('--runtime=' + opts.runtime);
    
    if (cmakeBuildType === 'Debug') {
        args.push('-D');
    };
    
    for (let arg of opts.argv) {
        args.push(arg);
    };



    const proc = Spawn(cmakejsBin, args, { stdio:'inherit' });
    proc.on('exit', function (code) {
    
        if (code !== 0) {
            return cb(new Error('Failed to build cmake with exit code ' + code));
        }
        cb();
    });
};


runCmake(opts, '8.11.0', (err) => {

    if(err) {
        throw err;
    };
});

