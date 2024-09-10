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
let viteServer,viteNodeServer,filePath,fileContent;const{platform}=require("os"),{existsSync}=require("fs"),{pathToFileURL}=require("url"),currentPlatform=platform(),isWindows="win32"===currentPlatform||"win64"===currentPlatform;function isFileSystemCaseSensitive(){return!isWindows&&!existsSync(swapCase(__filename))}function swapCase(e){return e.replace(/\w/g,e=>{var r=e.toUpperCase();return e===r?e.toLowerCase():r})}const isPathCaseSensitive=isFileSystemCaseSensitive();function normalizePathCase(e){return isPathCaseSensitive?e:e.toLowerCase()}function normalizePathSeparator(e){return isWindows?e.replace(/\\/gu,"/"):e}async function start({localProjectRoot,vitePath,viteNodeServerPath,quokkaSettingsDirPath,quokkaTempDirPath}){const{createServer}=await eval("import(pathToFileURL(vitePath))"),{ViteNodeServer}=await eval("import(pathToFileURL(viteNodeServerPath))"),resolve=(await eval("import('resolve')")).default.sync;let viteNodeServerSettings={};return viteServer=await createServer({mode:"development",root:localProjectRoot,build:{sourcemap:!0},optimizeDeps:{disabled:!0},logLevel:"error",plugins:[{name:"quokka:configResolved",configResolved(e){viteNodeServerSettings=(null==(e=null==e?void 0:e.test)?void 0:e.server)||{}}},{name:"quokka:adjust-config",enforce:"pre",config(e){!1!==e.esbuild&&(e.esbuild=e.esbuild||{},e.esbuild.sourcemap=!0,e.esbuild.legalComments="none")}},{name:"quokka:preprocessing",enforce:"pre",load(e){if(normalizePathCase(e)===filePath)return fileContent}},{name:"quokka:postprocessing",enforce:"post",async transform(e,r){return normalizePathCase(r)!==filePath?{code:e}:externalRequest("transform",{transformed:{code:e,map:this._getCombinedSourcemap()},fileName:r})}},{name:"quokka:resolveId",async resolveId(e,r,t){if(/\0/.test(e))return null;r=await this.resolve(e,r,Object.assign({skipSelf:!0},t));if(!r){try{return resolve(e,{basedir:quokkaTempDirPath})}catch(e){}try{return resolve(e,{basedir:quokkaSettingsDirPath})}catch(e){}}}}]}),await viteServer.pluginContainer.buildStart({}),viteNodeServer=new ViteNodeServer(viteServer,Object.assign(Object.assign({},viteNodeServerSettings),{sourcemap:!0})),{root:viteServer.config.root,base:viteServer.config.base}}let id=1,pendingPromises={};function reset(e){filePath=normalizePathSeparator(normalizePathCase(e.path)),fileContent=e.content,id=1,pendingPromises={},viteServer.moduleGraph.invalidateAll(),viteNodeServer.fetchCache.clear(),viteNodeServer.fetchPromiseMap.clear&&viteNodeServer.fetchPromiseMap.clear(),null!=(e=viteNodeServer.fetchPromiseMap.ssr)&&e.clear(),null!=(e=viteNodeServer.fetchPromiseMap.web)&&e.clear()}function externalRequest(t,s){return new Promise((e,r)=>{pendingPromises[id]={resolve:e,reject:r},process.send({type:t,id:id,payload:s}),id++})}async function resolveId({id:e,importer:r}){return viteNodeServer.resolveId(e,r)}async function fetchModule({moduleId:e}){return viteNodeServer.fetchModule(e)}const messageHandlers={reset:reset,start:start,resolveId:resolveId,fetchModule:fetchModule};(async()=>{process.on("message",async r=>{if(r)if(r.returnId){var{returnId:e,result:t,error:s}=r;if(pendingPromises[e]){if(s){const o=JSON.parse(s),a=new Error;Object.keys(o).forEach(e=>{a[e]=o[e]}),pendingPromises[e].reject(a)}else pendingPromises[e].resolve(t);delete pendingPromises[e]}}else if(r&&r.type&&messageHandlers[r.type])try{var i=await messageHandlers[r.type](r.payload);r.id&&process.send({returnId:r.id,result:i})}catch(e){r.id&&(s=Object.assign(Object.assign({},e),{message:e.message,stack:e.stack}),process.send({returnId:r.id,error:JSON.stringify(s)}))}}),process.send({type:"ready"}),setTimeout(()=>{},void 0)})();