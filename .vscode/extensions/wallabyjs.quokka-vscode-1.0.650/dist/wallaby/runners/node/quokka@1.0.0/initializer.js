/*
 * wallaby-core - v1.0.1595
 * https://wallabyjs.com
 * Copyright (c) 2014-2024 Wallaby.js - All Rights Reserved.
 *
 * This source code file is a part of wallaby-core and is a proprietary (closed source) software.

 * IMPORTANT:
 * Wallaby.js is a tool made by software developers for software developers with passion and love for what we do.
 * Pirating the tool is not only illegal and just morally wrong,
 * it is also unfair to other fellow programmers who are using it legally,
 * and very harmful for the tool and its future.
 */
var path=require("path");const url=require("url"),semver=require("semver");var Module=require("module"),tracer=global.$_$tracer,utils=tracer._utils,file,entryModule,quokkaSettings={},quokkaSettingsDirPath,quokkaSettingsDirNodeModulesPath,quokkaTempDirNodeModulesPath,beforeExitHandlers=[],startTime,serverPath=path.dirname(process.mainModule.filename);const isWindows="win32"===process.platform,viteNodeContext={};function patchConsoleError(){const e=global.console.error;global.console.error=function(){if((arguments.length&&Buffer.isBuffer(arguments[0])&&(arguments[0]=arguments[0].toString("utf8")),arguments.length)&&0===arguments[0].toString("utf8").split("\n").filter(e=>-1===e.indexOf("ExperimentalWarning:")&&-1===e.indexOf("node --trace-warnings")).join("\n").length)return;e.call(global.console,...arguments)}}async function runInViteNode(viteNodeServer){await viteNodeServer.reset({path:viteNodeContext.file.path,content:viteNodeContext.file.content});const{ViteNodeRunner}=await eval("import(url.pathToFileURL(quokkaSettings.vite.viteNodeClientPath))"),viteNodeRunner=new ViteNodeRunner({root:viteNodeServer.config.root,base:viteNodeServer.config.base,async resolveId(e,t){return viteNodeServer.resolveId({id:e,importer:t})},async fetchModule(t){try{var e=await viteNodeServer.fetchModule({moduleId:t}),o=t.replace(/\\/g,"/").replace(/^\/@fs\//,isWindows?"":"/").replace(/^file:\//,"/").replace(/^node:/,"").replace(/^\/+/,"/"),r=viteNodeContext.instrumentedFiles[o];if(r&&global.$_$coverage){var s=new Array(r.instrumented.ranges.length);for(let e=0;e<r.instrumented.ranges.length;e++)s[e]={};global.$_$coverage[1]=s,r.lineMap=utils.updateFileMap({},[e.map]),tracer.sendTransformedFile(r)}return delete e.map,e}catch(e){throw"string"==typeof e?new Error(e):e.frame?new Error(`Error while loading module ${e.plugin?"(plugin: "+e.plugin+")":""}: ${t}:
`+e.frame):e}}});await viteNodeRunner.executeFile(viteNodeContext.file.path)}async function createViteNodeServer(){const e=require("child_process").fork,t=path.join(__dirname,"vite-server.js");return new Promise((o,r)=>{const n=e(t,[],{stdio:["ignore","ignore","ignore","ipc"]}),l=(n.unref(),n.channel.unref(),{transform:async({transformed:t,fileName:e})=>{if(!global.$_$coverage)return t;t.map&&t.map.sources&&(t.map.sources=t.map.sources.map(e=>e||viteNodeContext.file.path));let o;t.map&&(viteNodeContext.file.changeStart||viteNodeContext.file.logMarkers&&viteNodeContext.file.logMarkers.length||viteNodeContext.file.extractedComments&&!viteNodeContext.file.extractedComments.isCoverageIgnored||viteNodeContext.file.test)&&(o=new utils.SourceMapConsumer(t.map));var r=utils.mapTextPosition(viteNodeContext.file.changeStart&&viteNodeContext.file.changePosition,o),s=viteNodeContext.file.logMarkers||[];let i;var a=viteNodeContext.file.path;try{i=utils.instrument(t.code,{file:viteNodeContext.file.id,test:viteNodeContext.file.test,fileName:path.basename(a),testFileChangeStart:r,hints:global.$_$tracer._hints,recordValues:global.$_$tracer._autoConsoleLog,captureConsoleLog:!0,recordMatchSnapshotRanges:!0,preserveComments:global.$_$tracer._preserveComments,logMarkers:s.map(e=>({originalRange:e.range,range:utils.mapOriginalRangeToTransformed(o,e.range),changeId:e.id,traceId:e.traceId,expanded:e.expanded,new:e.new,exp:e.exp,action:e.action,logpoint:e.logpoint,inlineLogpoint:e.inlineLogpoint})),extractedComments:utils.remapComments(viteNodeContext.file.extractedComments,t.code,o),sequenceExpressionToDiff:!0,vue:"vue"===quokkaSettings.vite.fileType,svelte:"svelte"===quokkaSettings.vite.fileType,snaps:{enabled:quokkaSettings.snaps,onlyMode:quokkaSettings.snapsOnlyMode,asyncWrap:!1}})}catch(e){throw utils.formatInstrumentationError(e,t.code,a)}let n;if(quokkaSettings.snapsOnlyMode){if(!i.snaps||!i.snaps.length)throw new Error(utils.snapsNotFoundError);i.snaps.find(e=>!e.empty)||(n=new Error(utils.snapsAreEmptyError)),!global.$_$snapsAutoRun&&i.snaps&&i.snaps.length&&(n=new Error(utils.snapsFoundButNoAutoRunError))}tracer._autoExpandAllLogs=quokkaSettings.snaps&&!!(i.snaps||[]).find(e=>e.output),i.liveCommentLines&&t.map?(o=o||new utils.SourceMapConsumer(t.map),i.liveCommentLines=_.chain(i.liveCommentLines).map((e,t)=>({line:parseInt(t,10),column:e+1})).map(({line:e,column:t})=>utils.mapTransformedRangeToOriginal(o,[e,t,e,t])).filter(e=>e&&e.length).map(e=>e[0]).value()):i.liveCommentLines&&(i.liveCommentLines=Object.keys(i.liveCommentLines).map(e=>parseInt(e,10)).filter(e=>e).map(e=>e));r={id:viteNodeContext.file.id,transformed:_.omit(t,"code"),instrumented:_.omit(i,"map"),ts:viteNodeContext.file.ts,originalTs:viteNodeContext.file.originalTs,runnerCacheKey:viteNodeContext.file.runnerCacheKey,transformedTime:(new Date).toISOString()};if(n)throw tracer.sendTransformedFile(r),n;return viteNodeContext.instrumentedFiles[e]=r,{code:i.code,map:i.map}}});let s=1,u={};function i(o,r){return new Promise((e,t)=>{u[s]={resolve:e,reject:t},n.send({type:o,id:s,payload:r}),s++})}const a={reset:async e=>{s=1,u={},await i("reset",e)},resolveId:async e=>i("resolveId",e),fetchModule:async e=>i("fetchModule",e)};n.once("message",async e=>{var t;n.on("message",async t=>{if(t)if(t.returnId){var{returnId:e,result:o,error:r}=t;if(u[e]){if(r){const i=JSON.parse(r),a=new Error;Object.keys(i).forEach(e=>{a[e]=i[e]}),u[e].reject(a)}else u[e].resolve(o);delete u[e]}}else if(t&&t.type&&l[t.type])try{var s=await l[t.type](t.payload);t.id&&n.send({returnId:t.id,result:s})}catch(e){t.id&&(r=Object.assign(Object.assign({},e),{message:e.message,stack:e.stack}),n.send({returnId:t.id,error:JSON.stringify(r)}))}}),"ready"===e.type?(t=await i("start",{localProjectRoot:localProjectRoot,vitePath:quokkaSettings.vite.vitePath,viteNodeServerPath:quokkaSettings.vite.viteNodeServerPath,quokkaSettingsDirPath:path.dirname(quokkaSettings.globalConfigFile),quokkaTempDirPath:quokkaSettings.tempDir}),a.config=t,o(a)):r(e.error||"Unknown error starting vite node"),n.on("error",e=>{r(e)})})})}utils.patchModulesCode([{files:["scheduler/cjs/scheduler.development.js"],replacements:[{from:"typeof window === 'undefined'",to:"true || typeof window === 'undefined'",optional:!0}]},{files:["tsconfig-paths/lib/register.js"],replacements:[{from:"if (!isCoreModule) {",to:"if (!isCoreModule && (!_parent || !require('path').relative(configLoaderResult.absoluteBaseUrl, _parent.filename).startsWith('..'))) {"},{from:"console.warn",to:"",optional:!0}]},{files:["@babel/plugin-proposal-private-property-in-object/lib/index.js"],replacements:[{from:"setTimeout(console.warn, 2500",to:"setTimeout(() => {}, 0",optional:!0}]}]),patchConsoleError(),tracer._maxLogEntrySize=1048576,tracer._hiddenGlobalProps={$_$baseDir:1,$_$slow:1,$_$testFiles:1,$_$tests:1,$_$session:1,$_$initialSpecId:1,$_$coverage:1},process.on("unhandledRejection",function(e){throw e});var localProjectRoot=path.dirname(global.wallaby._localNodeModules);try{quokkaSettings=JSON.parse(process.env.quokka),quokkaSettingsDirPath=path.dirname(quokkaSettings.globalConfigFile);const quokkaTempDirPath=quokkaSettings.tempDir;quokkaSettings.nativeEsm&&(tracer._esm={localProjectDirUrl:url.pathToFileURL(localProjectRoot).href,settingsDirUrl:url.pathToFileURL(quokkaSettingsDirPath).href,tempDirUrl:url.pathToFileURL(quokkaTempDirPath).href}),quokkaSettingsDirNodeModulesPath=path.join(quokkaSettingsDirPath,"node_modules"),quokkaTempDirNodeModulesPath=path.join(quokkaTempDirPath,"node_modules")}catch(e){}var requireFromTheProjectAndGlobalSettingsContext=function(e){var t=Module._load(e,entryModule,!1);try{var o=Module._resolveFilename(e,entryModule,!1);tracer._doWhenReceiverIsReady(function(){tracer._send("module",{path:o})})}catch(e){}return t},rootEntryModule=(requireFromTheProjectAndGlobalSettingsContext.extensions=require.extensions,requireFromTheProjectAndGlobalSettingsContext.resolve=require.resolve,new Module(".",null)),requireForPlugin=(rootEntryModule.filename=path.join(localProjectRoot,"index.js"),rootEntryModule.path=localProjectRoot,rootEntryModule.paths=Module._nodeModulePaths(localProjectRoot).concat([quokkaSettingsDirNodeModulesPath,quokkaTempDirNodeModulesPath]),function(t){if(!t||"."!==t[0])return Module._load(t,rootEntryModule,!1);try{return Module._load(path.resolve(quokkaSettingsDirPath,t),rootEntryModule,!1)}catch(e){return Module._load(t,rootEntryModule,!1)}}),hideProp=(requireForPlugin.extensions=require.extensions,requireForPlugin.resolve=require.resolve,function(e){Object.defineProperty(global,e,{enumerable:!1,value:global[e]})});Object.keys(global).filter(function(e){return"wallaby"===e||0===e.indexOf("$_$")}).forEach(function(e){hideProp(e)}),require.extensions[".jsx"]=require.extensions[".js"];const registerAssetExtensions=()=>{[".png",".svg",".ico",".jpeg",".jpg",".css",".less",".scss",".sass",".htm",".html"].forEach(function(e){require.extensions[e]=function(){}})};tracer._identifierExpressionAutoLogHitLimit=10,tracer._logLimit=Math.max(quokkaSettings.logLimit||100,10);var toInitialize={vite:!0,babel:!0,ts:!0,js:!0,plugins:!0,globals:["assert","events","fs","os","path"]},runBeforeEach=[],starter={quokkaStackTraceMarker:async function(){var _a,_b,sessionId=global.$_$session;if(global.$_$resolveGetters=quokkaSettings.resolveGetters,quokkaSettings.vite)toInitialize.vite&&(global._quokkaLazyLoadHelperFunctions(),viteNodeContext.serverPromise=createViteNodeServer(),toInitialize.vite=!1);else{if(quokkaSettings.babel&&toInitialize.babel){var babelConfig={ignore:"string"==typeof quokkaSettings.babel.ignore?new RegExp(quokkaSettings.babel.ignore):"[object Array]"===Object.prototype.toString.call(quokkaSettings.babel.ignore)?quokkaSettings.babel.ignore:function(e){return~e.indexOf("quokka.js")||~e.indexOf("node_modules")},presets:quokkaSettings.babel.presets,plugins:quokkaSettings.babel.plugins,extensions:[".js",".jsx",".es6",".es",".mjs",".ts",".tsx",".cjs",".mjs",".cts",".mts"]},babelMajorVersion=NaN;if(quokkaSettings.babel.version&&(babelMajorVersion=parseInt(quokkaSettings.babel.version.split(".")[0],10)),7<=babelMajorVersion){utils.patchBabelResolve(quokkaSettings.babel.path);try{"[object Array]"!==Object.prototype.toString.call(babelConfig.ignore)&&(babelConfig.ignore=[babelConfig.ignore]),require(path.join(path.dirname(quokkaSettings.babel.path),"register"))(babelConfig)}catch(e){try{utils.patchModule("@babel/core",()=>require(quokkaSettings.babel.path)),require(quokkaSettings.babel.registerPath)(babelConfig)}catch(e){console.warn("@babel/register could not be launched properly. This may indicate that your project packages are not compatible with your current version of Quokka.\nPlease install @babel/register as a project dependency.\nYou may install the module in your project by running `npm install @babel/register` command.")}}}else require(path.join(quokkaSettings.babel.path,"register"))(babelConfig);if(quokkaSettings.babel.polyfill&&(7<=babelMajorVersion?require(path.join(path.dirname(quokkaSettings.babel.path),"polyfill")):require(path.join(path.dirname(quokkaSettings.babel.path),"babel-polyfill"))),quokkaSettings.babel.tsconfigPaths)try{require(path.join(quokkaSettings.babel.tsconfigPaths.path,"register"))}catch(e){}delete toInitialize.babel}if(quokkaSettings.ts&&toInitialize.ts){var ignore=quokkaSettings.ts.tsNode.ignore||["(?:^|/)node_modules/"],ignore=Array.isArray(ignore)?ignore:[ignore],tsNodeOptions=(ignore.push(serverPath),{compiler:process.env.TS_NODE_COMPILER,ignore:ignore,ignoreDiagnostics:(process.env.TS_NODE_IGNORE_DIAGNOSTICS||"").split(",").map(e=>parseInt(e,10)).filter(e=>e),compilerOptions:{experimentalDecorators:!(null==(_b=null==(_a=quokkaSettings.ts)?void 0:_a.compilerOptions)||!_b.experimentalDecorators)}}),tsNodePath=(quokkaSettings.nativeEsm&&(tsNodeOptions.experimentalEsmLoader=!0,tsNodeOptions.transpileOnly=!0),quokkaSettings.ts.swc&&(tsNodeOptions.swc=!1,tsNodeOptions.transpileOnly=!0,tsNodeOptions.transpiler=[quokkaSettings.ts.swcTranspilerPath,{swc:quokkaSettings.ts.swcPath}]),path.join(quokkaSettings.ts.tsNode.path)),tsNode=require(tsNodePath),tsNodeInstance=tsNode.register(tsNodeOptions),tsNodeEsmResolveImplPath,tsNodeEsmResolveImpl,tsNodeEsmResolveImplOptions,tsNodeEsmResolveImplPath,tsNodeEsmResolveImpl,tsNodeEsmResolveImplOptions;quokkaSettings.nativeEsm&&(tracer._esm.tsNode=tsNodeInstance,semver.gte(tsNode.VERSION,"10.8.0")?(tsNodeEsmResolveImplPath=path.join(tsNodePath,"/dist-raw/node-internal-modules-esm-resolve"),tsNodeEsmResolveImpl=require(tsNodeEsmResolveImplPath),tsNodeEsmResolveImplOptions=require(path.join(tsNodePath,"/dist/file-extensions")).getExtensions(tsNodeInstance.config,tsNodeInstance.options,tsNodeInstance.ts.version),tracer._esm.tsNodeResolve=tsNodeEsmResolveImpl.createResolve({extensions:tsNodeEsmResolveImplOptions,preferTsExts:tsNodeInstance.options.preferTsExts,tsNodeExperimentalSpecifierResolution:tsNodeInstance.options.experimentalSpecifierResolution})):(tsNodeEsmResolveImplPath=path.join(tsNodePath,"/dist-raw/node-esm-resolve-implementation"),tsNodeEsmResolveImpl=require(tsNodeEsmResolveImplPath),tsNodeEsmResolveImplOptions=tsNode.getExtensions(tsNodeInstance.config),tsNodeEsmResolveImplOptions.preferTsExts=tsNodeInstance.options.preferTsExts,tracer._esm.tsNodeResolve=tsNodeEsmResolveImpl.createResolve(tsNodeEsmResolveImplOptions)));try{if(quokkaSettings.ts.tsconfigPaths){if(quokkaSettings.nativeEsm)try{const tsConfigPaths=require(quokkaSettings.ts.tsconfigPaths.path);if(quokkaSettings.ts.compilerOptions&&quokkaSettings.ts.compilerOptions.baseUrl&&quokkaSettings.ts.compilerOptions.paths)path.isAbsolute(quokkaSettings.ts.compilerOptions.baseUrl)?tracer._esm.tsConfigPathsMatchPath=tsConfigPaths.createMatchPath(quokkaSettings.ts.compilerOptions.baseUrl,quokkaSettings.ts.compilerOptions.paths):tracer._esm.tsConfigPathsMatchPath=tsConfigPaths.createMatchPath(quokkaSettings.ts.compilerOptions.pathsBasePath||quokkaSettings.ts.compilerOptions.baseUrl,quokkaSettings.ts.compilerOptions.paths);else{const{absoluteBaseUrl,paths}=tsConfigPaths.loadConfig();tracer._esm.tsConfigPathsMatchPath=tsConfigPaths.createMatchPath(absoluteBaseUrl,paths)}}catch(e){}quokkaSettings.ts.compilerOptions&&quokkaSettings.ts.compilerOptions.baseUrl&&quokkaSettings.ts.compilerOptions.paths?path.isAbsolute(quokkaSettings.ts.compilerOptions.baseUrl)?require(path.join(quokkaSettings.ts.tsconfigPaths.path,"lib","register")).register({baseUrl:quokkaSettings.ts.compilerOptions.baseUrl,paths:quokkaSettings.ts.compilerOptions.paths}):require(path.join(quokkaSettings.ts.tsconfigPaths.path,"lib","register")).register({baseUrl:quokkaSettings.ts.compilerOptions.pathsBasePath||quokkaSettings.ts.compilerOptions.baseUrl,paths:quokkaSettings.ts.compilerOptions.paths}):require(path.join(quokkaSettings.ts.tsconfigPaths.path,"register"))}}catch(e){}delete toInitialize.ts}if(quokkaSettings.js&&toInitialize.js&&quokkaSettings.js.compilerOptions&&quokkaSettings.js.compilerOptions.baseUrl&&quokkaSettings.js.compilerOptions.paths){try{path.isAbsolute(quokkaSettings.js.compilerOptions.baseUrl)?require(path.join(quokkaSettings.js.tsconfigPaths.path,"lib","register")).register({baseUrl:quokkaSettings.js.compilerOptions.baseUrl,paths:quokkaSettings.js.compilerOptions.paths}):require(path.join(quokkaSettings.js.tsconfigPaths.path,"lib","register")).register({baseUrl:quokkaSettings.js.compilerOptions.pathsBasePath||quokkaSettings.js.compilerOptions.baseUrl,paths:quokkaSettings.js.compilerOptions.paths})}catch(e){}delete toInitialize.js}}if(quokkaSettings.plugins&&toInitialize.plugins){if(quokkaSettings.builtInPlugins&&quokkaSettings.builtInPlugins.find(e=>"auto-detect:create-react-app"===e))try{global.React=requireForPlugin("react")}catch(e){}"string"==typeof quokkaSettings.plugins&&(quokkaSettings.plugins=[quokkaSettings.plugins]),quokkaSettings.plugins.slice().forEach(function(e){var t;"jsdom-quokka-plugin"===e?((t=require("./jsdomQuokkaPlugin")).before&&t.before(requireForPlugin,quokkaSettings),t.beforeEach&&runBeforeEach.push(t.beforeEach)):((t=requireForPlugin(e)).before&&t.before(quokkaSettings),t.beforeEach&&runBeforeEach.push(t.beforeEach))}),delete toInitialize.plugins}toInitialize.globals&&(toInitialize.globals.forEach(function(e){global[e]||(global[e]=require(e))}),delete toInitialize.globals),runBeforeEach.forEach(function(e){e(quokkaSettings)}),registerAssetExtensions();var beforeExitHandler=function(){var e;tracer._asyncCodeMayBeExecuting=!1,tracer.refWebSocket(),sessionId!==global.$_$session?delete tracer._pong:(startTime&&(e=(1e3*(e=process.hrtime(startTime))[0]+e[1]/1e6).toFixed(2)),tracer._pong&&(tracer._pong(),delete tracer._pong),tracer.complete({time:e}))},runner=(process.once("beforeExit",beforeExitHandler),beforeExitHandlers.push(beforeExitHandler),{quokkaStackTraceMarker:async function(){if(startTime=process.hrtime(),quokkaSettings&&quokkaSettings.vite)return runInViteNode(await viteNodeContext.serverPromise);if(quokkaSettings&&quokkaSettings.nativeEsm){const fileUrl=url.pathToFileURL(file.path.replace(/$quokka.js^/,"quokka.mjs")),nodeVersion=(fileUrl.href=fileUrl.href+"?session="+sessionId,tracer._esm.scratchFileUrl=fileUrl.href,tracer._esm.scratchFileContent=file.content,semver.clean(process.version));if(semver.gte(nodeVersion,"19.0.0")&&semver.lt(nodeVersion,"20.0.0")||semver.lt(nodeVersion,"20.0.0")&&semver.lt(nodeVersion,"18.19.0")||semver.gte(nodeVersion,"20.0.0")&&semver.lt(nodeVersion,"20.6.0"))global.$_$esmHooksPort&&(global.$_$esmHooksPort.postMessage({quokkaSettings:quokkaSettings,serverPath:serverPath,scratchFileUrl:fileUrl.href,scratchFileContent:file.content,localProjectDirUrl:tracer._esm.localProjectDirUrl,settingsDirUrl:tracer._esm.settingsDirUrl,tempDirUrl:tracer._esm.tempDirUrl,sessionId:sessionId}),global.$_$esmHooksPort.onmessage=e=>{e&&e.data&&"tracer._doWhenReceiverIsReady._send"===e.data.method&&tracer._doWhenReceiverIsReady(()=>{tracer._send.apply(tracer,e.data.args)})});else{const{register}=require("node:module"),{pathToFileURL}=require("node:url"),{MessageChannel}=require("node:worker_threads"),{port1:clientPort,port2:esmPort}=new MessageChannel;global.$_$clientPort&&global.$_$clientPort.close(),global.$_$esmPort&&global.$_$esmPort.close(),clientPort.addEventListener("message",e=>{e&&e.data&&"tracer._doWhenReceiverIsReady._send"===e.data.method&&tracer._doWhenReceiverIsReady(()=>{tracer._send.apply(tracer,e.data.args)})}),global.$_$clientPort=clientPort,global.$_$esmPort=esmPort,clientPort.unref(),esmPort.unref(),await register("./hooks-v2.mjs",{parentURL:pathToFileURL(__filename).href,data:{quokkaSettings:quokkaSettings,serverPath:serverPath,scratchFileUrl:fileUrl.href,scratchFileContent:file.content,localProjectDirUrl:tracer._esm.localProjectDirUrl,settingsDirUrl:tracer._esm.settingsDirUrl,tempDirUrl:tracer._esm.tempDirUrl,sessionId:sessionId,port:esmPort},transferList:[esmPort]})}await eval("import(fileUrl)")}else entryModule._compile(file.content,file.path)}});try{await runner.quokkaStackTraceMarker()}catch(e){if(sessionId===global.$_$session)throw e}finally{tracer._asyncCodeMayBeExecuting=!0,tracer.unrefWebSocket(),global.$_$esmHooksPort&&global.$_$esmHooksPort.unref&&global.$_$esmHooksPort.unref()}}};tracer.start(starter.quokkaStackTraceMarker),module.exports={init:function(e){return file={path:e[0],content:global.$_$testFiles[0].content},(entryModule=new Module(".",null)).filename=file.path,entryModule.path=path.dirname(file.path),entryModule.paths=Module._nodeModulePaths(path.dirname(entryModule.filename)).concat([quokkaTempDirNodeModulesPath,quokkaSettingsDirNodeModulesPath]),entryModule.require=requireFromTheProjectAndGlobalSettingsContext,quokkaSettings&&(quokkaSettings.filePath=file.path,quokkaSettings.vite)&&(viteNodeContext.file=global.$_$testFiles[0],viteNodeContext.instrumentedFiles={}),beforeExitHandlers.forEach(function(e){process.removeListener("beforeExit",e)}),beforeExitHandlers.length=0,Object.keys(tracer._hiddenGlobalProps).forEach(function(e){hideProp(e)}),{}}};