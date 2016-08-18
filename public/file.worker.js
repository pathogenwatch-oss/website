!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return e[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="/",t(0)}([function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e){return e.name.match(y)}function a(e){return e.name.match(b)}function s(e){return i(e)||a(e)}function o(e){for(var t={validFiles:[],invalidFiles:[]},n=e.length;n>0;){n-=1;var r=e[n];s(r)?t.validFiles.push(r):t.invalidFiles.push(r)}return t}function u(e,t){if("undefined"==typeof FileReader){console.log("using FileReaderSync");try{var n=new FileReaderSync;t(null,n.readAsText(e))}catch(r){t("[WGSA] Failed to read file: "+e.name+". "+r,null)}}else{console.log("using FileReader");var i=new FileReader;i.onload=function(e){t(null,e.target.result)},i.onerror=function(){console.error("[WGSA] Failed to load dropped file: "+e.name),t(e.name,null)},i.readAsText(e)}}function f(e,t){var n=[];e.forEach(function(r){u(r,function(i,a){return i?void console.error("[WGSA] Failed to load file: "+i):(n.push({name:r.name,content:a}),void(n.length===e.length&&t(null,n)))})})}function l(e,t,n){var r=e.name.replace(y,""),i=e.content;t[r]={name:r,content:i},n[r]={name:r,fasta:{name:r,assembly:i},metrics:i.length?(0,v["default"])(i):{}}}function h(e,t,n){var r=g["default"].parseCsvToJson(e.content);return r.errors.length>0?void console.error("[WGSA] Failed to parse CSV file "+e.name):void r.data.forEach(function(t){if(!t.filename)return void console.error("[WGSA] Missing assembly filename in metadata file "+e.name);var r=t.filename.replace(y,""),i=t.displayname||r,a={name:r,metadata:{assemblyName:i,pmid:null,date:{year:null,month:null,day:null},position:{latitude:null,longitude:null}}},s=!0,o=!1,u=void 0;try{for(var f,l=Object.keys(t)[Symbol.iterator]();!(s=(f=l.next()).done);s=!0){var h=f.value;"filename"!==h&&"assembly_name"!==h&&"original_isolate_id"!==h&&("latitude"===h||"longitude"===h||"year"===h||"month"===h||"day"===h?(a.metadata.position.latitude=parseFloat(t.latitude)||null,a.metadata.position.longitude=parseFloat(t.longitude)||null,a.metadata.date.year=parseInt(t.year,10)||null,a.metadata.date.month=parseInt(t.month,10)||null,a.metadata.date.day=parseInt(t.day,10)||null):a.metadata[h]=t[h]||null)}}catch(c){o=!0,u=c}finally{try{!s&&l["return"]&&l["return"]()}finally{if(o)throw u}}n[r]=a})}function c(e,t,n){e.forEach(function(e){a(e)?h(e,t,n):i(e)?l(e,t,n):console.warn("[WGSA] Unsupported file type: "+e.name)})}function d(e,t){var n=function r(n){var i={},a=o([e[n]]);f(a.validFiles,function(a,s){return a?(console.error("[WGSA] Failed to read files"),void t(a)):(c(s,{},i),t(null,i,n+1),void(n+1<e.length&&r(n+1)))})};n(0)}var p=n(2),g=r(p),m=n(3),v=r(m),_=[".fa",".fas",".fna",".ffn",".faa",".frn",".fasta",".contig"],y=new RegExp("("+_.join("|")+")$","i"),b=/(.csv)$/i;onmessage=function(e){d(e.data.files,function(e,t,n){e&&postMessage({error:e}),postMessage({assemblies:t,index:n})})}},function(e,t){"use strict";function n(e){var t=e%10,n=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n}Object.defineProperty(t,"__esModule",{value:!0}),t.formatDay=n;var r=["January","February","March","April","May","June","July","August","September","October","November","December"];t.formatMonth=function(e){return r[e-1]}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e){for(var t=Object.keys(e),n=0,r={};n<t.length;){var i=t[n];r[i.toLowerCase()]=e[i],n+=1}return r}function a(e){var t=c["default"].parse(e,{header:!0,dynamicTyping:!1,skipEmptyLines:!0});return t.errors.length>0&&(console.error("[WGSA] Errors during CSV to JSON conversion:"),console.dir(t.errors)),t.data=t.data.map(i),t}function s(e){var t=e.year,n=e.month,r=e.day;return!t||n||r?t&&n&&!r?(0,d.formatMonth)(n)+" "+t:t&&n&&r?(0,d.formatDay)(r)+" "+(0,d.formatMonth)(n)+" "+t:"":t}function o(e){return{year:e.getFullYear(),month:e.getMonth()+1,day:e.getDate()}}function u(e){var t=e.assemblies;return Object.keys(t).forEach(function(e){var n=t[e];n.metadata.datetime&&(n.metadata.date=o(new Date(n.metadata.datetime)))}),e}function f(e){var t=e.date,n=(new Date).getFullYear();if(!t)return!0;var r=t.day,i=t.month,a=t.year;return!(r&&(r<1||r>31||!i||!a))&&(!(i&&(i<1||i>12||!a))&&(!a||!(a<1900||a>n)))}function l(e){var t=e.assemblies;return Object.keys(t).forEach(function(e){var n=t[e].metadata;n.geography&&(n.position=n.geography.position)}),e}Object.defineProperty(t,"__esModule",{value:!0});var h=n(4),c=r(h),d=n(1);t["default"]={parseCsvToJson:a,getFormattedDateString:s,fixDateFormats:u,isValid:f,fixPositions:l}},function(e,t){"use strict";function n(e){return e.trim().split(">").filter(function(e){return e.length>0})}function r(e){return e.split(/\n/).filter(function(e){return e.length>0}).map(function(e){return e.trim()})}function i(e){var t=r(e),n=t.splice(1,t.length);return g.test(n[0].trim())||(n=n.splice(1,n.length)),n.join("").replace(/\s/g,"").toUpperCase()}function a(e){var t,n=[];return e.forEach(function(e){t=i(e),n.push(t)}),n}function s(e){for(var t=e.sort(function(e,t){return t.length-e.length}),n=[],r=0;r<t.length;r++)n.length>0?n.push(t[r].length+n[n.length-1]):n.push(t[r].length);for(var i=Math.floor(n[n.length-1]/2),a=0,s={},r=0;r<t.length;r++)if(a+=t[r].length,a>=i){s.sequenceNumber=r+1,s.sum=a,s.sequenceLength=t[r].length;break}return s}function o(e){var t=0;return e.forEach(function(e,n,r){t+=e.length}),t}function u(e){var t=0;return e.forEach(function(e,n,r){t+=(e.match(/[^ACGT]/g)||[]).length}),t}function f(e){var t=o(e),n=e.length,r=Math.floor(t/n);return r}function l(e){var t=e.map(function(e){return e.length}),n=t.reduce(function(e,t,n,r){return Math.min(e,t)});return n}function h(e){var t=e.map(function(e){return e.length}),n=t.reduce(function(e,t,n,r){return Math.max(e,t)});return n}function c(e){var t=e.sort(function(e,t){return t.length-e.length}),n=[];return t.forEach(function(e,t,r){0===n.length?n.push(e.length):n.push(e.length+n[n.length-1])}),n}function d(e){var t=0;return e.forEach(function(e){for(var n=0;n<e.length;n++){var r=e[n];"C"!==r&&"G"!==r||t++}}),t}function p(e){var t=n(e),r=a(t),i=s(r),p=o(r),g=u(r);return{totalNumberOfContigs:t.length,assemblyN50Data:i,contigN50:i.sequenceLength,sumsOfNucleotidesInDnaStrings:c(r),totalNumberOfNucleotidesInDnaStrings:p,totalNumberOfNsInDnaStrings:g,averageNumberOfNucleotidesInDnaStrings:f(r),smallestNumberOfNucleotidesInDnaStrings:l(r),biggestNumberOfNucleotidesInDnaStrings:h(r),gcContent:(100*d(r)/(p-g)).toFixed(1)}}var g=/^[CTAGNUXRY]+$/i;e.exports=p},function(e,t,n){var r;/*!
		Papa Parse
		v4.1.2
		https://github.com/mholt/PapaParse
	*/
!function(i){"use strict";function a(e,t){if(t=t||{},t.worker&&O.WORKERS_SUPPORTED){var n=p();return n.userStep=t.step,n.userChunk=t.chunk,n.userComplete=t.complete,n.userError=t.error,t.step=k(t.step),t.chunk=k(t.chunk),t.complete=k(t.complete),t.error=k(t.error),delete t.worker,void n.postMessage({input:e,config:t,workerId:n.id})}var r=null;return"string"==typeof e?r=t.download?new u(t):new l(t):(i.File&&e instanceof File||e instanceof Object)&&(r=new f(t)),r.stream(e)}function s(e,t){function n(){"object"==typeof t&&("string"==typeof t.delimiter&&1==t.delimiter.length&&O.BAD_DELIMITERS.indexOf(t.delimiter)==-1&&(u=t.delimiter),("boolean"==typeof t.quotes||t.quotes instanceof Array)&&(o=t.quotes),"string"==typeof t.newline&&(f=t.newline))}function r(e){if("object"!=typeof e)return[];var t=[];for(var n in e)t.push(n);return t}function i(e,t){var n="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var r=e instanceof Array&&e.length>0,i=!(t[0]instanceof Array);if(r){for(var s=0;s<e.length;s++)s>0&&(n+=u),n+=a(e[s],s);t.length>0&&(n+=f)}for(var o=0;o<t.length;o++){for(var l=r?e.length:t[o].length,h=0;h<l;h++){h>0&&(n+=u);var c=r&&i?e[h]:h;n+=a(t[o][c],h)}o<t.length-1&&(n+=f)}return n}function a(e,t){if("undefined"==typeof e||null===e)return"";e=e.toString().replace(/"/g,'""');var n="boolean"==typeof o&&o||o instanceof Array&&o[t]||s(e,O.BAD_DELIMITERS)||e.indexOf(u)>-1||" "==e.charAt(0)||" "==e.charAt(e.length-1);return n?'"'+e+'"':e}function s(e,t){for(var n=0;n<t.length;n++)if(e.indexOf(t[n])>-1)return!0;return!1}var o=!1,u=",",f="\r\n";if(n(),"string"==typeof e&&(e=JSON.parse(e)),e instanceof Array){if(!e.length||e[0]instanceof Array)return i(null,e);if("object"==typeof e[0])return i(r(e[0]),e)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),e.data instanceof Array&&(e.fields||(e.fields=e.data[0]instanceof Array?e.fields:r(e.data[0])),e.data[0]instanceof Array||"object"==typeof e.data[0]||(e.data=[e.data])),i(e.fields||[],e.data||[]);throw"exception: Unable to serialize unrecognized input"}function o(e){function t(e){var t=y(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null),this._handle=new h(t),this._handle.streamer=this,this._config=t}this._handle=null,this._paused=!1,this._finished=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},t.call(this,e),this.parseChunk=function(e){if(this.isFirstChunk&&k(this._config.beforeFirstChunk)){var t=this._config.beforeFirstChunk(e);void 0!==t&&(e=t)}this.isFirstChunk=!1;var n=this._partialLine+e;this._partialLine="";var r=this._handle.parse(n,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var a=r.meta.cursor;this._finished||(this._partialLine=n.substring(a-this._baseIndex),this._baseIndex=a),r&&r.data&&(this._rowCount+=r.data.length);var s=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(E)i.postMessage({results:r,workerId:O.WORKER_ID,finished:s});else if(k(this._config.chunk)){if(this._config.chunk(r,this._handle),this._paused)return;r=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(r.data),this._completeResults.errors=this._completeResults.errors.concat(r.errors),this._completeResults.meta=r.meta),!s||!k(this._config.complete)||r&&r.meta.aborted||this._config.complete(this._completeResults),s||r&&r.meta.paused||this._nextChunk(),r}},this._sendError=function(e){k(this._config.error)?this._config.error(e):E&&this._config.error&&i.postMessage({workerId:O.WORKER_ID,error:e,finished:!1})}}function u(e){function t(e){var t=e.getResponseHeader("Content-Range");return parseInt(t.substr(t.lastIndexOf("/")+1))}e=e||{},e.chunkSize||(e.chunkSize=O.RemoteChunkSize),o.call(this,e);var n;C?this._nextChunk=function(){this._readChunk(),this._chunkLoaded()}:this._nextChunk=function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)return void this._chunkLoaded();if(n=new XMLHttpRequest,C||(n.onload=b(this._chunkLoaded,this),n.onerror=b(this._chunkError,this)),n.open("GET",this._input,!C),this._config.chunkSize){var e=this._start+this._config.chunkSize-1;n.setRequestHeader("Range","bytes="+this._start+"-"+e),n.setRequestHeader("If-None-Match","webkit-no-cache")}try{n.send()}catch(t){this._chunkError(t.message)}C&&0==n.status?this._chunkError():this._start+=this._config.chunkSize},this._chunkLoaded=function(){if(4==n.readyState){if(n.status<200||n.status>=400)return void this._chunkError();this._finished=!this._config.chunkSize||this._start>t(n),this.parseChunk(n.responseText)}},this._chunkError=function(e){var t=n.statusText||e;this._sendError(t)}}function f(e){e=e||{},e.chunkSize||(e.chunkSize=O.LocalChunkSize),o.call(this,e);var t,n,r="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,r?(t=new FileReader,t.onload=b(this._chunkLoaded,this),t.onerror=b(this._chunkError,this)):t=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var i=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,i)}var a=t.readAsText(e,this._config.encoding);r||this._chunkLoaded({target:{result:a}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(t.error)}}function l(e){e=e||{},o.call(this,e);var t,n;this.stream=function(e){return t=e,n=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?n.substr(0,e):n;return n=e?n.substr(e):"",this._finished=!n,this.parseChunk(t)}}}function h(e){function t(){if(b&&h&&(u("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+O.DefaultDelimiter+"'"),h=!1),e.skipEmptyLines)for(var t=0;t<b.data.length;t++)1==b.data[t].length&&""==b.data[t][0]&&b.data.splice(t--,1);return n()&&r(),i()}function n(){return e.header&&0==_.length}function r(){if(b){for(var e=0;n()&&e<b.data.length;e++)for(var t=0;t<b.data[e].length;t++)_.push(b.data[e][t]);b.data.splice(0,1)}}function i(){if(!b||!e.header&&!e.dynamicTyping)return b;for(var t=0;t<b.data.length;t++){for(var n={},r=0;r<b.data[t].length;r++){if(e.dynamicTyping){var i=b.data[t][r];"true"==i||"TRUE"==i?b.data[t][r]=!0:"false"==i||"FALSE"==i?b.data[t][r]=!1:b.data[t][r]=o(i)}e.header&&(r>=_.length?(n.__parsed_extra||(n.__parsed_extra=[]),n.__parsed_extra.push(b.data[t][r])):n[_[r]]=b.data[t][r])}e.header&&(b.data[t]=n,r>_.length?u("FieldMismatch","TooManyFields","Too many fields: expected "+_.length+" fields but parsed "+r,t):r<_.length&&u("FieldMismatch","TooFewFields","Too few fields: expected "+_.length+" fields but parsed "+r,t))}return e.header&&b.meta&&(b.meta.fields=_),b}function a(t){for(var n,r,i,a=[",","\t","|",";",O.RECORD_SEP,O.UNIT_SEP],s=0;s<a.length;s++){var o=a[s],u=0,f=0;i=void 0;for(var l=new c({delimiter:o,preview:10}).parse(t),h=0;h<l.data.length;h++){var d=l.data[h].length;f+=d,"undefined"!=typeof i?d>1&&(u+=Math.abs(d-i),i=d):i=d}l.data.length>0&&(f/=l.data.length),("undefined"==typeof r||u<r)&&f>1.99&&(r=u,n=o)}return e.delimiter=n,{successful:!!n,bestDelimiter:n}}function s(e){e=e.substr(0,1048576);var t=e.split("\r");if(1==t.length)return"\n";for(var n=0,r=0;r<t.length;r++)"\n"==t[r][0]&&n++;return n>=t.length/2?"\r\n":"\r"}function o(e){var t=d.test(e);return t?parseFloat(e):e}function u(e,t,n,r){b.errors.push({type:e,code:t,message:n,row:r})}var f,l,h,d=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,p=this,g=0,m=!1,v=!1,_=[],b={data:[],errors:[],meta:{}};if(k(e.step)){var S=e.step;e.step=function(r){if(b=r,n())t();else{if(t(),0==b.data.length)return;g+=r.data.length,e.preview&&g>e.preview?l.abort():S(b,p)}}}this.parse=function(n,r,i){if(e.newline||(e.newline=s(n)),h=!1,!e.delimiter){var o=a(n);o.successful?e.delimiter=o.bestDelimiter:(h=!0,e.delimiter=O.DefaultDelimiter),b.meta.delimiter=e.delimiter}var u=y(e);return e.preview&&e.header&&u.preview++,f=n,l=new c(u),b=l.parse(f,r,i),t(),m?{meta:{paused:!0}}:b||{meta:{paused:!1}}},this.paused=function(){return m},this.pause=function(){m=!0,l.abort(),f=f.substr(l.getCharIndex())},this.resume=function(){m=!1,p.streamer.parseChunk(f)},this.aborted=function(){return v},this.abort=function(){v=!0,l.abort(),b.meta.aborted=!0,k(e.complete)&&e.complete(b),f=""}}function c(e){e=e||{};var t=e.delimiter,n=e.newline,r=e.comments,i=e.step,a=e.preview,s=e.fastMode;if(("string"!=typeof t||O.BAD_DELIMITERS.indexOf(t)>-1)&&(t=","),r===t)throw"Comment character same as delimiter";r===!0?r="#":("string"!=typeof r||O.BAD_DELIMITERS.indexOf(r)>-1)&&(r=!1),"\n"!=n&&"\r"!=n&&"\r\n"!=n&&(n="\n");var o=0,u=!1;this.parse=function(e,f,l){function h(e){k.push(e),E=o}function c(t){return l?p():("undefined"==typeof t&&(t=e.substr(o)),C.push(t),o=m,h(C),b&&g(),p())}function d(t){o=t,h(C),C=[],O=e.indexOf(n,o)}function p(e){return{data:k,errors:S,meta:{delimiter:t,linebreak:n,aborted:u,truncated:!!e,cursor:E+(f||0)}}}function g(){i(p()),k=[],S=[]}if("string"!=typeof e)throw"Input must be a string";var m=e.length,v=t.length,_=n.length,y=r.length,b="function"==typeof i;o=0;var k=[],S=[],C=[],E=0;if(!e)return p();if(s||s!==!1&&e.indexOf('"')===-1){for(var R=e.split(n),w=0;w<R.length;w++){var C=R[w];if(o+=C.length,w!==R.length-1)o+=n.length;else if(l)return p();if(!r||C.substr(0,y)!=r){if(b){if(k=[],h(C.split(t)),g(),u)return p()}else h(C.split(t));if(a&&w>=a)return k=k.slice(0,a),p(!0)}}return p()}for(var x=e.indexOf(t,o),O=e.indexOf(n,o);;)if('"'!=e[o])if(r&&0===C.length&&e.substr(o,y)===r){if(O==-1)return p();o=O+_,O=e.indexOf(n,o),x=e.indexOf(t,o)}else if(x!==-1&&(x<O||O===-1))C.push(e.substring(o,x)),o=x+v,x=e.indexOf(t,o);else{if(O===-1)break;if(C.push(e.substring(o,O)),d(O+_),b&&(g(),u))return p();if(a&&k.length>=a)return p(!0)}else{var I=o;for(o++;;){var I=e.indexOf('"',I+1);if(I===-1)return l||S.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:k.length,index:o}),c();if(I===m-1){var D=e.substring(o,I).replace(/""/g,'"');return c(D)}if('"'!=e[I+1]){if(e[I+1]==t){C.push(e.substring(o,I).replace(/""/g,'"')),o=I+1+v,x=e.indexOf(t,o),O=e.indexOf(n,o);break}if(e.substr(I+1,_)===n){if(C.push(e.substring(o,I).replace(/""/g,'"')),d(I+1+_),x=e.indexOf(t,o),b&&(g(),u))return p();if(a&&k.length>=a)return p(!0);break}}else I++}}return c()},this.abort=function(){u=!0},this.getCharIndex=function(){return o}}function d(){var e=document.getElementsByTagName("script");return e.length?e[e.length-1].src:""}function p(){if(!O.WORKERS_SUPPORTED)return!1;if(!R&&null===O.SCRIPT_PATH)throw new Error("Script path cannot be determined automatically when Papa Parse is loaded asynchronously. You need to set Papa.SCRIPT_PATH manually.");var e=O.SCRIPT_PATH||S;e+=(e.indexOf("?")!==-1?"&":"?")+"papaworker";var t=new i.Worker(e);return t.onmessage=g,t.id=x++,w[t.id]=t,t}function g(e){var t=e.data,n=w[t.workerId],r=!1;if(t.error)n.userError(t.error,t.file);else if(t.results&&t.results.data){var i=function(){r=!0,m(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},a={abort:i,pause:v,resume:v};if(k(n.userStep)){for(var s=0;s<t.results.data.length&&(n.userStep({data:[t.results.data[s]],errors:t.results.errors,meta:t.results.meta},a),!r);s++);delete t.results}else k(n.userChunk)&&(n.userChunk(t.results,a,t.file),delete t.results)}t.finished&&!r&&m(t.workerId,t.results)}function m(e,t){var n=w[e];k(n.userComplete)&&n.userComplete(t),n.terminate(),delete w[e]}function v(){throw"Not implemented."}function _(e){var t=e.data;if("undefined"==typeof O.WORKER_ID&&t&&(O.WORKER_ID=t.workerId),"string"==typeof t.input)i.postMessage({workerId:O.WORKER_ID,results:O.parse(t.input,t.config),finished:!0});else if(i.File&&t.input instanceof File||t.input instanceof Object){var n=O.parse(t.input,t.config);n&&i.postMessage({workerId:O.WORKER_ID,results:n,finished:!0})}}function y(e){if("object"!=typeof e)return e;var t=e instanceof Array?[]:{};for(var n in e)t[n]=y(e[n]);return t}function b(e,t){return function(){e.apply(t,arguments)}}function k(e){return"function"==typeof e}var S,C=!i.document&&!!i.postMessage,E=C&&/(\?|&)papaworker(=|&|$)/.test(i.location.search),R=!1,w={},x=0,O={};if(O.parse=a,O.unparse=s,O.RECORD_SEP=String.fromCharCode(30),O.UNIT_SEP=String.fromCharCode(31),O.BYTE_ORDER_MARK="\ufeff",O.BAD_DELIMITERS=["\r","\n",'"',O.BYTE_ORDER_MARK],O.WORKERS_SUPPORTED=!C&&!!i.Worker,O.SCRIPT_PATH=null,O.LocalChunkSize=10485760,O.RemoteChunkSize=5242880,O.DefaultDelimiter=",",O.Parser=c,O.ParserHandle=h,O.NetworkStreamer=u,O.FileStreamer=f,O.StringStreamer=l,"undefined"!=typeof e&&e.exports?e.exports=O:k(i.define)&&i.define.amd?(r=function(){return O}.call(t,n,t,e),!(void 0!==r&&(e.exports=r))):i.Papa=O,i.jQuery){var I=i.jQuery;I.fn.parse=function(e){function t(){if(0==s.length)return void(k(e.complete)&&e.complete());var t=s[0];if(k(e.before)){var i=e.before(t.file,t.inputElem);if("object"==typeof i){if("abort"==i.action)return void n("AbortError",t.file,t.inputElem,i.reason);if("skip"==i.action)return void r();"object"==typeof i.config&&(t.instanceConfig=I.extend(t.instanceConfig,i.config))}else if("skip"==i)return void r()}var a=t.instanceConfig.complete;t.instanceConfig.complete=function(e){k(a)&&a(e,t.file,t.inputElem),r()},O.parse(t.file,t.instanceConfig)}function n(t,n,r,i){k(e.error)&&e.error({name:t},n,r,i)}function r(){s.splice(0,1),t()}var a=e.config||{},s=[];return this.each(function(e){var t="INPUT"==I(this).prop("tagName").toUpperCase()&&"file"==I(this).attr("type").toLowerCase()&&i.FileReader;if(!t||!this.files||0==this.files.length)return!0;for(var n=0;n<this.files.length;n++)s.push({file:this.files[n],inputElem:this,instanceConfig:I.extend({},a)})}),t(),this}}E?i.onmessage=_:O.WORKERS_SUPPORTED&&(S=d(),document.body?document.addEventListener("DOMContentLoaded",function(){R=!0},!0):R=!0),u.prototype=Object.create(o.prototype),u.prototype.constructor=u,f.prototype=Object.create(o.prototype),f.prototype.constructor=f,l.prototype=Object.create(l.prototype),l.prototype.constructor=l}("undefined"!=typeof window?window:this)}]);