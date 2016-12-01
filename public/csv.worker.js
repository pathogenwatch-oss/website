!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return e[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="/",t(0)}([function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){var t=e.columnKeys,n=e.table,r=e.dataType,i=p[n](r);return t.map(function(e){return e in i.defined?i.defined[e].valueGetter:function(t){return i.genericGetter(e,t)}})}var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=n(17),u=r(s),c=n(3),f=r(c),l=n(12),d=n(8),h=n(15),_={columnKey:"__name",valueGetter:function(e){var t=e.name;return t}},p={metadata:function(){return{defined:o(i({},_.columnKey,_),d.systemDataColumns),genericGetter:d.getUserDefinedValue}},resistanceProfile:function(e){return{defined:i({},_.columnKey,_),genericGetter:function(t,n){var r=n.analysis.resistanceProfile;switch(e){case"profile":return(0,h.isResistant)(r,t)?1:0;case"mechanisms":var i=r.antibiotics;return'"'+i[t].mechanisms.join(",")+'"';default:return""}}}}};(0,u.default)(function(e){var t=e.table,n=e.dataType,r=e.columnKeys,i=e.rows,o=a({columnKeys:r,table:t,dataType:n});return f.default.unparse({fields:r.map(function(e){return(0,l.formatColumnKeyAsLabel)(e)}),data:i.map(function(e){return o.map(function(t){return t(e)})})})})},function(e,t){(function(e){"use strict";function n(){if("WGSA_CONFIG"in e){var t=Object.assign({},WGSA_CONFIG);return WGSA_CONFIG=void 0,t}return{}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=n()}).call(t,function(){return this}())},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e){for(var t=Object.keys(e),n=0,r={};n<t.length;){var i=t[n];r[i.toLowerCase()]=e[i],n+=1}return r}function a(e){return e.map(i)}function o(e){var t=h.default.parse(e,{header:!0,dynamicTyping:!1,skipEmptyLines:!0});return t.errors.length>0&&(console.error("[WGSA] Errors during CSV to JSON conversion:"),console.dir(t.errors)),t.data=a(t.data),t}function s(e){var t=e.year,n=e.month,r=e.day;return!t||n||r?t&&n&&!r?(0,_.formatMonth)(n)+" "+t:t&&n&&r?(0,_.formatDay)(r)+" "+(0,_.formatMonth)(n)+" "+t:"":t}function u(e){return{year:e.getFullYear(),month:e.getMonth()+1,day:e.getDate()}}function c(e){var t=e.assemblies;return Object.keys(t).forEach(function(e){var n=t[e];n.metadata.datetime&&(n.metadata.date=u(new Date(n.metadata.datetime)))}),e}function f(e){var t=e.date,n=(new Date).getFullYear();if(!t)return!0;var r=t.day,i=t.month,a=t.year;return!(r&&(r<1||r>31||!i||!a))&&(!(i&&(i<1||i>12||!a))&&(!a||!(a<1900||a>n)))}function l(e){var t=e.assemblies;return Object.keys(t).forEach(function(e){var n=t[e].metadata;n.geography&&(n.position=n.geography.position)}),e}Object.defineProperty(t,"__esModule",{value:!0});var d=n(3),h=r(d),_=n(14);t.default={parseCsvToJson:o,getFormattedDateString:s,fixDateFormats:c,isValid:f,fixPositions:l}},function(e,t,n){var r;/*!
		Papa Parse
		v4.1.2
		https://github.com/mholt/PapaParse
	*/
!function(i){"use strict";function a(e,t){if(t=t||{},t.worker&&I.WORKERS_SUPPORTED){var n=_();return n.userStep=t.step,n.userChunk=t.chunk,n.userComplete=t.complete,n.userError=t.error,t.step=S(t.step),t.chunk=S(t.chunk),t.complete=S(t.complete),t.error=S(t.error),delete t.worker,void n.postMessage({input:e,config:t,workerId:n.id})}var r=null;return"string"==typeof e?r=t.download?new u(t):new f(t):(i.File&&e instanceof File||e instanceof Object)&&(r=new c(t)),r.stream(e)}function o(e,t){function n(){"object"==typeof t&&("string"==typeof t.delimiter&&1==t.delimiter.length&&I.BAD_DELIMITERS.indexOf(t.delimiter)==-1&&(u=t.delimiter),("boolean"==typeof t.quotes||t.quotes instanceof Array)&&(s=t.quotes),"string"==typeof t.newline&&(c=t.newline))}function r(e){if("object"!=typeof e)return[];var t=[];for(var n in e)t.push(n);return t}function i(e,t){var n="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var r=e instanceof Array&&e.length>0,i=!(t[0]instanceof Array);if(r){for(var o=0;o<e.length;o++)o>0&&(n+=u),n+=a(e[o],o);t.length>0&&(n+=c)}for(var s=0;s<t.length;s++){for(var f=r?e.length:t[s].length,l=0;l<f;l++){l>0&&(n+=u);var d=r&&i?e[l]:l;n+=a(t[s][d],l)}s<t.length-1&&(n+=c)}return n}function a(e,t){if("undefined"==typeof e||null===e)return"";e=e.toString().replace(/"/g,'""');var n="boolean"==typeof s&&s||s instanceof Array&&s[t]||o(e,I.BAD_DELIMITERS)||e.indexOf(u)>-1||" "==e.charAt(0)||" "==e.charAt(e.length-1);return n?'"'+e+'"':e}function o(e,t){for(var n=0;n<t.length;n++)if(e.indexOf(t[n])>-1)return!0;return!1}var s=!1,u=",",c="\r\n";if(n(),"string"==typeof e&&(e=JSON.parse(e)),e instanceof Array){if(!e.length||e[0]instanceof Array)return i(null,e);if("object"==typeof e[0])return i(r(e[0]),e)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),e.data instanceof Array&&(e.fields||(e.fields=e.data[0]instanceof Array?e.fields:r(e.data[0])),e.data[0]instanceof Array||"object"==typeof e.data[0]||(e.data=[e.data])),i(e.fields||[],e.data||[]);throw"exception: Unable to serialize unrecognized input"}function s(e){function t(e){var t=y(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null),this._handle=new l(t),this._handle.streamer=this,this._config=t}this._handle=null,this._paused=!1,this._finished=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},t.call(this,e),this.parseChunk=function(e){if(this.isFirstChunk&&S(this._config.beforeFirstChunk)){var t=this._config.beforeFirstChunk(e);void 0!==t&&(e=t)}this.isFirstChunk=!1;var n=this._partialLine+e;this._partialLine="";var r=this._handle.parse(n,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var a=r.meta.cursor;this._finished||(this._partialLine=n.substring(a-this._baseIndex),this._baseIndex=a),r&&r.data&&(this._rowCount+=r.data.length);var o=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(O)i.postMessage({results:r,workerId:I.WORKER_ID,finished:o});else if(S(this._config.chunk)){if(this._config.chunk(r,this._handle),this._paused)return;r=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(r.data),this._completeResults.errors=this._completeResults.errors.concat(r.errors),this._completeResults.meta=r.meta),!o||!S(this._config.complete)||r&&r.meta.aborted||this._config.complete(this._completeResults),o||r&&r.meta.paused||this._nextChunk(),r}},this._sendError=function(e){S(this._config.error)?this._config.error(e):O&&this._config.error&&i.postMessage({workerId:I.WORKER_ID,error:e,finished:!1})}}function u(e){function t(e){var t=e.getResponseHeader("Content-Range");return parseInt(t.substr(t.lastIndexOf("/")+1))}e=e||{},e.chunkSize||(e.chunkSize=I.RemoteChunkSize),s.call(this,e);var n;A?this._nextChunk=function(){this._readChunk(),this._chunkLoaded()}:this._nextChunk=function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)return void this._chunkLoaded();if(n=new XMLHttpRequest,A||(n.onload=E(this._chunkLoaded,this),n.onerror=E(this._chunkError,this)),n.open("GET",this._input,!A),this._config.chunkSize){var e=this._start+this._config.chunkSize-1;n.setRequestHeader("Range","bytes="+this._start+"-"+e),n.setRequestHeader("If-None-Match","webkit-no-cache")}try{n.send()}catch(e){this._chunkError(e.message)}A&&0==n.status?this._chunkError():this._start+=this._config.chunkSize},this._chunkLoaded=function(){if(4==n.readyState){if(n.status<200||n.status>=400)return void this._chunkError();this._finished=!this._config.chunkSize||this._start>t(n),this.parseChunk(n.responseText)}},this._chunkError=function(e){var t=n.statusText||e;this._sendError(t)}}function c(e){e=e||{},e.chunkSize||(e.chunkSize=I.LocalChunkSize),s.call(this,e);var t,n,r="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,r?(t=new FileReader,t.onload=E(this._chunkLoaded,this),t.onerror=E(this._chunkError,this)):t=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var i=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,i)}var a=t.readAsText(e,this._config.encoding);r||this._chunkLoaded({target:{result:a}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(t.error)}}function f(e){e=e||{},s.call(this,e);var t,n;this.stream=function(e){return t=e,n=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?n.substr(0,e):n;return n=e?n.substr(e):"",this._finished=!n,this.parseChunk(t)}}}function l(e){function t(){if(E&&l&&(u("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+I.DefaultDelimiter+"'"),l=!1),e.skipEmptyLines)for(var t=0;t<E.data.length;t++)1==E.data[t].length&&""==E.data[t][0]&&E.data.splice(t--,1);return n()&&r(),i()}function n(){return e.header&&0==v.length}function r(){if(E){for(var e=0;n()&&e<E.data.length;e++)for(var t=0;t<E.data[e].length;t++)v.push(E.data[e][t]);E.data.splice(0,1)}}function i(){if(!E||!e.header&&!e.dynamicTyping)return E;for(var t=0;t<E.data.length;t++){for(var n={},r=0;r<E.data[t].length;r++){if(e.dynamicTyping){var i=E.data[t][r];"true"==i||"TRUE"==i?E.data[t][r]=!0:"false"==i||"FALSE"==i?E.data[t][r]=!1:E.data[t][r]=s(i)}e.header&&(r>=v.length?(n.__parsed_extra||(n.__parsed_extra=[]),n.__parsed_extra.push(E.data[t][r])):n[v[r]]=E.data[t][r])}e.header&&(E.data[t]=n,r>v.length?u("FieldMismatch","TooManyFields","Too many fields: expected "+v.length+" fields but parsed "+r,t):r<v.length&&u("FieldMismatch","TooFewFields","Too few fields: expected "+v.length+" fields but parsed "+r,t))}return e.header&&E.meta&&(E.meta.fields=v),E}function a(t){for(var n,r,i,a=[",","\t","|",";",I.RECORD_SEP,I.UNIT_SEP],o=0;o<a.length;o++){var s=a[o],u=0,c=0;i=void 0;for(var f=new d({delimiter:s,preview:10}).parse(t),l=0;l<f.data.length;l++){var h=f.data[l].length;c+=h,"undefined"!=typeof i?h>1&&(u+=Math.abs(h-i),i=h):i=h}f.data.length>0&&(c/=f.data.length),("undefined"==typeof r||u<r)&&c>1.99&&(r=u,n=s)}return e.delimiter=n,{successful:!!n,bestDelimiter:n}}function o(e){e=e.substr(0,1048576);var t=e.split("\r");if(1==t.length)return"\n";for(var n=0,r=0;r<t.length;r++)"\n"==t[r][0]&&n++;return n>=t.length/2?"\r\n":"\r"}function s(e){var t=h.test(e);return t?parseFloat(e):e}function u(e,t,n,r){E.errors.push({type:e,code:t,message:n,row:r})}var c,f,l,h=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,_=this,p=0,m=!1,g=!1,v=[],E={data:[],errors:[],meta:{}};if(S(e.step)){var b=e.step;e.step=function(r){if(E=r,n())t();else{if(t(),0==E.data.length)return;p+=r.data.length,e.preview&&p>e.preview?f.abort():b(E,_)}}}this.parse=function(n,r,i){if(e.newline||(e.newline=o(n)),l=!1,!e.delimiter){var s=a(n);s.successful?e.delimiter=s.bestDelimiter:(l=!0,e.delimiter=I.DefaultDelimiter),E.meta.delimiter=e.delimiter}var u=y(e);return e.preview&&e.header&&u.preview++,c=n,f=new d(u),E=f.parse(c,r,i),t(),m?{meta:{paused:!0}}:E||{meta:{paused:!1}}},this.paused=function(){return m},this.pause=function(){m=!0,f.abort(),c=c.substr(f.getCharIndex())},this.resume=function(){m=!1,_.streamer.parseChunk(c)},this.aborted=function(){return g},this.abort=function(){g=!0,f.abort(),E.meta.aborted=!0,S(e.complete)&&e.complete(E),c=""}}function d(e){e=e||{};var t=e.delimiter,n=e.newline,r=e.comments,i=e.step,a=e.preview,o=e.fastMode;if(("string"!=typeof t||I.BAD_DELIMITERS.indexOf(t)>-1)&&(t=","),r===t)throw"Comment character same as delimiter";r===!0?r="#":("string"!=typeof r||I.BAD_DELIMITERS.indexOf(r)>-1)&&(r=!1),"\n"!=n&&"\r"!=n&&"\r\n"!=n&&(n="\n");var s=0,u=!1;this.parse=function(e,c,f){function l(e){S.push(e),O=s}function d(t){return f?_():("undefined"==typeof t&&(t=e.substr(s)),A.push(t),s=m,l(A),E&&p(),_())}function h(t){s=t,l(A),A=[],I=e.indexOf(n,s)}function _(e){return{data:S,errors:b,meta:{delimiter:t,linebreak:n,aborted:u,truncated:!!e,cursor:O+(c||0)}}}function p(){i(_()),S=[],b=[]}if("string"!=typeof e)throw"Input must be a string";var m=e.length,g=t.length,v=n.length,y=r.length,E="function"==typeof i;s=0;var S=[],b=[],A=[],O=0;if(!e)return _();if(o||o!==!1&&e.indexOf('"')===-1){for(var T=e.split(n),C=0;C<T.length;C++){var A=T[C];if(s+=A.length,C!==T.length-1)s+=n.length;else if(f)return _();if(!r||A.substr(0,y)!=r){if(E){if(S=[],l(A.split(t)),p(),u)return _()}else l(A.split(t));if(a&&C>=a)return S=S.slice(0,a),_(!0)}}return _()}for(var R=e.indexOf(t,s),I=e.indexOf(n,s);;)if('"'!=e[s])if(r&&0===A.length&&e.substr(s,y)===r){if(I==-1)return _();s=I+v,I=e.indexOf(n,s),R=e.indexOf(t,s)}else if(R!==-1&&(R<I||I===-1))A.push(e.substring(s,R)),s=R+g,R=e.indexOf(t,s);else{if(I===-1)break;if(A.push(e.substring(s,I)),h(I+v),E&&(p(),u))return _();if(a&&S.length>=a)return _(!0)}else{var w=s;for(s++;;){var w=e.indexOf('"',w+1);if(w===-1)return f||b.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:S.length,index:s}),d();if(w===m-1){var k=e.substring(s,w).replace(/""/g,'"');return d(k)}if('"'!=e[w+1]){if(e[w+1]==t){A.push(e.substring(s,w).replace(/""/g,'"')),s=w+1+g,R=e.indexOf(t,s),I=e.indexOf(n,s);break}if(e.substr(w+1,v)===n){if(A.push(e.substring(s,w).replace(/""/g,'"')),h(w+1+v),R=e.indexOf(t,s),E&&(p(),u))return _();if(a&&S.length>=a)return _(!0);break}}else w++}}return d()},this.abort=function(){u=!0},this.getCharIndex=function(){return s}}function h(){var e=document.getElementsByTagName("script");return e.length?e[e.length-1].src:""}function _(){if(!I.WORKERS_SUPPORTED)return!1;if(!T&&null===I.SCRIPT_PATH)throw new Error("Script path cannot be determined automatically when Papa Parse is loaded asynchronously. You need to set Papa.SCRIPT_PATH manually.");var e=I.SCRIPT_PATH||b;e+=(e.indexOf("?")!==-1?"&":"?")+"papaworker";var t=new i.Worker(e);return t.onmessage=p,t.id=R++,C[t.id]=t,t}function p(e){var t=e.data,n=C[t.workerId],r=!1;if(t.error)n.userError(t.error,t.file);else if(t.results&&t.results.data){var i=function(){r=!0,m(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},a={abort:i,pause:g,resume:g};if(S(n.userStep)){for(var o=0;o<t.results.data.length&&(n.userStep({data:[t.results.data[o]],errors:t.results.errors,meta:t.results.meta},a),!r);o++);delete t.results}else S(n.userChunk)&&(n.userChunk(t.results,a,t.file),delete t.results)}t.finished&&!r&&m(t.workerId,t.results)}function m(e,t){var n=C[e];S(n.userComplete)&&n.userComplete(t),n.terminate(),delete C[e]}function g(){throw"Not implemented."}function v(e){var t=e.data;if("undefined"==typeof I.WORKER_ID&&t&&(I.WORKER_ID=t.workerId),"string"==typeof t.input)i.postMessage({workerId:I.WORKER_ID,results:I.parse(t.input,t.config),finished:!0});else if(i.File&&t.input instanceof File||t.input instanceof Object){var n=I.parse(t.input,t.config);n&&i.postMessage({workerId:I.WORKER_ID,results:n,finished:!0})}}function y(e){if("object"!=typeof e)return e;var t=e instanceof Array?[]:{};for(var n in e)t[n]=y(e[n]);return t}function E(e,t){return function(){e.apply(t,arguments)}}function S(e){return"function"==typeof e}var b,A=!i.document&&!!i.postMessage,O=A&&/(\?|&)papaworker(=|&|$)/.test(i.location.search),T=!1,C={},R=0,I={};if(I.parse=a,I.unparse=o,I.RECORD_SEP=String.fromCharCode(30),I.UNIT_SEP=String.fromCharCode(31),I.BYTE_ORDER_MARK="\ufeff",I.BAD_DELIMITERS=["\r","\n",'"',I.BYTE_ORDER_MARK],I.WORKERS_SUPPORTED=!A&&!!i.Worker,I.SCRIPT_PATH=null,I.LocalChunkSize=10485760,I.RemoteChunkSize=5242880,I.DefaultDelimiter=",",I.Parser=d,I.ParserHandle=l,I.NetworkStreamer=u,I.FileStreamer=c,I.StringStreamer=f,"undefined"!=typeof e&&e.exports?e.exports=I:S(i.define)&&i.define.amd?(r=function(){return I}.call(t,n,t,e),!(void 0!==r&&(e.exports=r))):i.Papa=I,i.jQuery){var w=i.jQuery;w.fn.parse=function(e){function t(){if(0==o.length)return void(S(e.complete)&&e.complete());var t=o[0];if(S(e.before)){var i=e.before(t.file,t.inputElem);if("object"==typeof i){if("abort"==i.action)return void n("AbortError",t.file,t.inputElem,i.reason);if("skip"==i.action)return void r();"object"==typeof i.config&&(t.instanceConfig=w.extend(t.instanceConfig,i.config))}else if("skip"==i)return void r()}var a=t.instanceConfig.complete;t.instanceConfig.complete=function(e){S(a)&&a(e,t.file,t.inputElem),r()},I.parse(t.file,t.instanceConfig)}function n(t,n,r,i){S(e.error)&&e.error({name:t},n,r,i)}function r(){o.splice(0,1),t()}var a=e.config||{},o=[];return this.each(function(e){var t="INPUT"==w(this).prop("tagName").toUpperCase()&&"file"==w(this).attr("type").toLowerCase()&&i.FileReader;if(!t||!this.files||0==this.files.length)return!0;for(var n=0;n<this.files.length;n++)o.push({file:this.files[n],inputElem:this,instanceConfig:w.extend({},a)})}),t(),this}}O?i.onmessage=v:I.WORKERS_SUPPORTED&&(b=h(),document.body?document.addEventListener("DOMContentLoaded",function(){T=!0},!0):T=!0),u.prototype=Object.create(s.prototype),u.prototype.constructor=u,c.prototype=Object.create(s.prototype),c.prototype.constructor=c,f.prototype=Object.create(f.prototype),f.prototype.constructor=f}("undefined"!=typeof window?window:this)},function(e,t){"use strict";function n(e){if(!(e instanceof Blob))throw new TypeError("Must be a File or Blob");return new Promise(function(t,n){var r=new FileReader;r.onload=function(e){return t(e.target.result)},r.onerror=function(t){return n("Error reading "+e.name+": "+t.target.result)},r.readAsDataURL(e)})}function r(e){if(!(e instanceof Blob))throw new TypeError("Must be a File or Blob");return new Promise(function(t,n){var r=new FileReader;r.onload=function(e){return t(e.target.result)},r.onerror=function(t){return n("Error reading "+e.name+": "+t.target.result)},r.readAsText(e)})}function i(e){if(!(e instanceof Blob))throw new TypeError("Must be a File or Blob");return new Promise(function(t,n){var r=new FileReader;r.onload=function(e){return t(e.target.result)},r.onerror=function(t){return n("Error reading "+e.name+": "+t.target.result)},r.readAsArrayBuffer(e)})}e.exports={readAsDataURL:n,readAsText:r,readAsArrayBuffer:i}},function(e,t){"use strict";function n(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e){return a.reduce(function(t,r){return i({},t,n({},r,e+"::"+r))},{})}Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};t.createAsyncConstants=r;var a=["ATTEMPT","SUCCESS","FAILURE"]},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DEFAULT=t.CGPS=void 0;var r=n(11);t.CGPS={COLOURS:{GREEN_LIGHT:"#d0e9dc",GREEN_MID:"#87c7a6",GREEN:"#48996F",PURPLE_LIGHT:"#a386bd",PURPLE_WARM:"#AC65A6",PURPLE:"#673c90",GREY:"#e5e5e5",GREY_LIGHT:"#efefef",GREY_DARK:"#ababab"}},t.DEFAULT={SHAPE:"circle",COLOUR:"#555555",DANGER_COLOUR:"#d11b1b",WARNING_COLOUR:"#d19b1b",TREE_TYPE:"rectangular",NODE_SIZE:10,LABEL_SIZE:10,LAYOUT:{MINIMUM_CONTAINER_WIDTH:150,MINIMUM_CONTAINER_HEIGHT:50},SELECTED_TREE_NODE_LABEL:"id",MAP:{CENTER:{LATITUDE:47.34452036,LONGITUDE:5.85082183}},SUPPORTED_FILE_EXTENSIONS:[".csv"].concat(r.FASTA_FILE_EXTENSIONS).join(",")}},function(e,t){"use strict";function n(e){return{type:o,payload:{name:e}}}function r(e){return{type:s,payload:{view:e}}}function i(e){return{type:u,payload:{column:e}}}function a(e){return{type:c,payload:{columns:e}}}Object.defineProperty(t,"__esModule",{value:!0}),t.setTable=n,t.showTableView=r,t.setLabelColumn=i,t.setColourColumns=a;var o=t.SET_TABLE="SET_TABLE",s=t.SHOW_TABLE_VIEW="SHOW_TABLE_VIEW",u=t.SET_LABEL_COLUMN="SET_LABEL_COLUMN",c=t.SET_COLOUR_COLUMNS="SET_COLOUR_COLUMNS"},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return["__date"].concat(e.noPopulation?[]:["__wgsa_reference","__st"]).concat(e.noMLST?[]:["__profile"]).concat(e.ngMast?["__ng-mast","__por","__tbpb"]:[]).concat(e.genotyphi?["__genotyphi_type"]:[]).concat(["__core_matches","__%_core_families","__%_non-core","__assembly_length","__n50","__no._contigs","__non-ATCG","__GC_Content"])}function a(e){return i(e).map(function(e){return u[e]})}Object.defineProperty(t,"__esModule",{value:!0}),t.getUserDefinedValue=t.systemDataColumns=void 0,t.getSystemDataColumnProps=a;var o=n(2),s=r(o),u=t.systemDataColumns={__date:{columnKey:"__date",valueGetter:function(e){var t=e.metadata;return s.default.getFormattedDateString(t.date)}},__wgsa_reference:{columnKey:"__wgsa_reference",valueGetter:function(e){var t=e.analysis;return t.populationSubtype}},__st:{columnKey:"__st",valueGetter:function(e){var t=e.analysis;return t.st}},__profile:{columnKey:"__profile",valueGetter:function(e){var t=e.analysis;return t.mlst}},"__ng-mast":{columnKey:"__ng-mast",valueGetter:function(e){var t=e.analysis;return t.ngmast?t.ngmast.ngmast:null}},__por:{columnKey:"__por",valueGetter:function(e){var t=e.analysis;return t.ngmast?t.ngmast.por:null}},__tbpb:{columnKey:"__tbpb",valueGetter:function(e){var t=e.analysis;return t.ngmast?t.ngmast.tbpb:null}},__genotyphi_type:{columnKey:"__genotyphi_type",valueGetter:function(e){var t=e.analysis;return t.genotyphi?t.genotyphi.genotype:null}},__core_matches:{columnKey:"__core_matches",valueGetter:function(e){var t=e.analysis;return t.core?t.core.size:null}},"__%_core_families":{columnKey:"__%_core_families",valueGetter:function(e){var t=e.analysis;return t.core?t.core.percentMatched:null}},"__%_non-core":{columnKey:"__%_non-core",valueGetter:function(e){var t=e.analysis;return t.core&&t.core.percentAssemblyMatched?(100-t.core.percentAssemblyMatched).toFixed(1):null}},__assembly_length:{columnKey:"__assembly_length",valueGetter:function(e){var t=e.metadata;return t.metrics?t.metrics.totalNumberOfNucleotidesInDnaStrings:null}},__n50:{columnKey:"__n50",valueGetter:function(e){var t=e.metadata;return t.metrics?t.metrics.contigN50:null}},"__no._contigs":{columnKey:"__no._contigs",valueGetter:function(e){var t=e.metadata;return t.metrics?t.metrics.totalNumberOfContigs:null}},"__non-ATCG":{columnKey:"__non-ATCG",valueGetter:function(e){var t=e.metadata;return t.metrics?t.metrics.totalNumberOfNsInDnaStrings:null}},__GC_Content:{columnKey:"__GC_Content",valueGetter:function(e){var t=e.metadata;return t.metrics&&t.metrics.gcContent?t.metrics.gcContent+"%":null}}};t.getUserDefinedValue=function(e,t){var n=t.metadata;return n.userDefined[e]}},function(e,t,n){"use strict";function r(e){return{type:c,payload:{fastas:e}}}function i(e,t){return{type:f,payload:{name:e,progress:t}}}function a(e){return{type:l,payload:{name:e}}}function o(e){return{type:d,payload:{fasta:e}}}function s(e){return{type:h,payload:{metric:e}}}Object.defineProperty(t,"__esModule",{value:!0}),t.SHOW_METRIC=t.UNDO_REMOVE_FASTA=t.REMOVE_FASTA=t.UPDATE_FASTA_PROGRESS=t.UPLOAD_FASTA=t.ADD_FASTAS=void 0;var u=n(5),c=t.ADD_FASTAS="ADD_FASTAS",f=(t.UPLOAD_FASTA=(0,u.createAsyncConstants)("UPLOAD_FASTA"),t.UPDATE_FASTA_PROGRESS="UPDATE_FASTA_PROGRESS"),l=t.REMOVE_FASTA="REMOVE_FASTA",d=t.UNDO_REMOVE_FASTA="UNDO_REMOVE_FASTA",h=t.SHOW_METRIC="SHOW_METRIC";t.default={addFastas:r,updateFastaProgress:i,removeFasta:a,undoRemoveFasta:o,showMetric:s}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e){return new Promise(function(t,n){0===e.size?n(f.EMPTY_FILE):e.size>d?n(f.INVALID_FASTA_SIZE):t(e)})}function a(e){var t=e.replace(/\r/g,"");if(c.test(t))return t;throw f.INVALID_FASTA_CONTENT}function o(e){var t=e.error;return t&&!l.has(t)}Object.defineProperty(t,"__esModule",{value:!0}),t.fastaValidationErrorSet=t.fastaValidationErrors=void 0,t.validateFastaSize=i,t.validateFastaContent=a,t.isFailedUpload=o;var s=n(1),u=r(s),c=/^(?:[>;].+(?:\n[ACGTURYKMSWBDHVN]+\*?)+\n*)+$/i,f=t.fastaValidationErrors={INVALID_FASTA_SIZE:"INVALID_FASTA_SIZE",INVALID_FASTA_CONTENT:"INVALID_FASTA_CONTENT",EMPTY_FILE:"EMPTY_FILE"},l=t.fastaValidationErrorSet=new Set(Object.keys(f)),d=1048576*u.default.maxFastaFileSize},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e){if(e)return f({},e,{assemblyName:e.displayname||e.filename,latitude:parseFloat(e.latitude),longitude:parseFloat(e.longitude)})}function a(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.year,n=e.month,r=e.day;return t?new Date(t,parseInt(n||"1",10)-1,r||1):void 0}function o(e){return e.reduce(function(e,t){var n=t.data,r=void 0===n?{}:n;return e.concat(r)},[])}function s(e){var t=e.filter(function(e){var t=e.name;return E.test(t)}),n=e.filter(function(e){var t=e.name;return y.test(t)});return t.length?Promise.all(t.map(function(e){return(0,l.readAsText)(e).then(function(e){return p.default.parseCsvToJson(e)})})).then(function(e){return o(e)}).then(function(e){return n.map(function(t){var n=e.filter(function(e){var n=e.filename;return n===t.name})[0];return{name:t.name,file:t,metadata:i(n),date:a(n)}})}):Promise.resolve(n.map(function(e){return{name:e.name,file:e}}))}function u(e,t){var n=new window.XMLHttpRequest,r=0;return n.upload.addEventListener("progress",function(n){if(n.lengthComputable){var i=n.loaded/n.total*100,a=10*Math.floor(i/10);a>r&&(t(h.default.updateFastaProgress(e,a)),r=a)}},!1),n}function c(e,t){var n=e.file,r=e.metadata,i=void 0===r?{}:r,a=i.latitude,o=void 0===a?"":a,s=i.longitude,c=void 0===s?"":s;return(0,g.validateFastaSize)(n).then(l.readAsText).then(g.validateFastaContent).then(function(e){return $.ajax({type:"POST",url:m.API_ROOT+"/upload?latitude="+o+"&longitude="+c,contentType:"text/plain; charset=UTF-8",data:e,dataType:"json",xhr:function(){return u(n.name,t)}})})}Object.defineProperty(t,"__esModule",{value:!0}),t.FASTA_FILE_EXTENSIONS=void 0;var f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};t.mapCSVsToFastas=s,t.sendToServer=c;var l=n(4),d=n(9),h=r(d),_=n(2),p=r(_),m=n(13),g=n(10),v=t.FASTA_FILE_EXTENSIONS=[".fa",".fas",".fna",".ffn",".faa",".frn",".fasta",".contig"],y=new RegExp("("+v.join("|")+")$","i"),E=/(.csv)$/i},function(e,t){"use strict";function n(e){return(e.getLabel?e.getLabel():i(e.columnKey)).toUpperCase()}function r(e,t,n){var r=e[t],i=e[n];return r.metadata.assemblyName<i.metadata.assemblyName?-1:r.metadata.assemblyName>i.metadata.assemblyName?1:0}Object.defineProperty(t,"__esModule",{value:!0}),t.getColumnLabel=n,t.sortAssemblies=r;var i=(t.getCellValue=function(e,t){var n=e.valueGetter;return n(t)},t.formatColumnKeyAsLabel=function(e){return e.replace(/_?_autocolou?r$/,"").replace(/^__/,"").replace(/_/g," ")})},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e){return new Promise(function(t,n){$.ajax(e).done(function(e){return t(e)}).fail(function(e){return n(e)})})}function a(e,t,n){return i({type:"POST",url:""+g+e,contentType:"application/json; charset=UTF-8",data:JSON.stringify(t),dataType:"json",xhr:function e(){var e=new window.XMLHttpRequest;return n&&e.upload.addEventListener("progress",function(e){if(e.lengthComputable){var t=e.loaded/e.total*100;n(t)}},!1),e}})}function o(e,t,n){a("/species/"+e+"/collection",t).then(function(e){return n(null,e)},function(e){return n(e)})}function s(e){return $.get(g+"/species/"+e+"/reference")}function u(e,t){return console.log("[WGSA] Getting collection "+t),$.get(g+"/species/"+e+"/collection/"+t)}function c(e,t){var n=e.speciesId,r=e.idType,i=void 0===r?"assembly":r,o=e.format;return a("/species/"+n+"/download/type/"+i+"/format/"+o,t)}function f(e,t,n){return function(){return c({speciesId:n,format:e},{idList:Array.isArray(t)?t:[t]})}}function l(e){return $.get(g+"/species/"+e+"/resistance")}function d(e,t,n){return i({type:"GET",url:g+"/species/"+e+"/collection/"+t+"/subtree/"+n})}function h(e,t,n){return $.get(g+"/species/"+e+"/collection/"+t+"/status",{cas:n})}Object.defineProperty(t,"__esModule",{value:!0}),t.API_ROOT=t.SERVER_ADDRESS=void 0,t.postJson=a,t.getCollectionId=o,t.getReferenceCollection=s,t.getCollection=u,t.requestFile=c,t.makeFileRequest=f,t.getResistanceData=l,t.getSubtree=d,t.checkCollectionStatus=h;var _=n(1),p=r(_),m=t.SERVER_ADDRESS=p.default.api?"http://"+p.default.api.address:"",g=t.API_ROOT=m+"/api"},function(e,t){"use strict";function n(e){var t=e%10,n=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n}Object.defineProperty(t,"__esModule",{value:!0}),t.formatDay=n;var r=t.months=["January","February","March","April","May","June","July","August","September","October","November","December"].map(function(e,t){return{text:e,value:t}});t.formatMonth=function(e){return r[e-1].text}},function(e,t,n){"use strict";function r(e,t){var n=e.antibiotics;return t in n&&"UNKNOWN"!==n[t].state}function i(e){return e.__isCollection?f.CGPS.COLOURS.PURPLE_LIGHT:f.CGPS.COLOURS.GREY}function a(e,t){var n=t.analysis.resistanceProfile;return n?r(n,e)?l[n.antibiotics[e].state]:d:i(t)}function o(e){return function(t){var n=new Set(Array.from(e.size?e:_).map(function(e){return e.valueGetter(t)}));return 1===n.size?Array.from(n)[0]:d}}function s(e,t,n){var r=t.column,i=t.activeColumns,a=e.metaKey||e.ctrlKey;return a?(i[i.has(r)?"delete":"add"](r),void n((0,c.setColourColumns)(new Set(i)))):i.has(r)&&1===i.size?void n((0,c.setColourColumns)(new Set)):void n((0,c.setColourColumns)(new Set([r])))}function u(e){switch(e){case"RESISTANT":return"check_circle";case"INTERMEDIATE":return"info";default:return null}}Object.defineProperty(t,"__esModule",{value:!0}),t.getColourState=t.nonResistantColour=void 0,t.isResistant=r,t.defaultColourGetter=i,t.getColour=a,t.createColourGetter=o,t.onHeaderClick=s,t.getIcon=u;var c=n(7),f=n(6),l={RESISTANT:f.DEFAULT.DANGER_COLOUR,INTERMEDIATE:f.DEFAULT.WARNING_COLOUR},d=t.nonResistantColour="#fff",h=Object.keys(l).reduce(function(e,t){return e.set(l[t],t)},(new Map).set(d,"UNKNOWN")),_=[{valueGetter:i}];t.getColourState=function(e){return h.get(e)}},function(e,t){function n(e){return!!e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then}e.exports=n},function(e,t,n){"use strict";function r(e){try{return JSON.parse(e)}catch(e){return!1}}function i(e){function t(e,t,n,r){function i(t){"function"!=typeof self.postMessage?e.ports[0].postMessage(t):self.postMessage(t)}n?("undefined"!=typeof console&&"error"in console&&console.error("Worker caught an error:",n),i(JSON.stringify([t,{message:n.message}]))):i(JSON.stringify([t,null,r]))}function n(e,t){try{return{res:e(t)}}catch(e){return{err:e}}}function i(e,r,i,o){var s=n(r,o);s.err?t(e,i,s.err):a(s.res)?s.res.then(function(n){t(e,i,null,n)},function(n){t(e,i,n)}):t(e,i,null,s.res)}function o(n){var a=r(n.data);if(a){var o=a[0],s=a[1];"function"!=typeof e?t(n,o,new Error("Please pass a function into register().")):i(n,e,o,s)}}self.addEventListener("message",o)}var a=n(16);e.exports=i}]);