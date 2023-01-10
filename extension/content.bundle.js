(()=>{var e={9669:(e,t,n)=>{e.exports=n(1609)},5448:(e,t,n)=>{"use strict";var r=n(4867),i=n(6026),o=n(4372),a=n(5327),s=n(4097),c=n(4109),l=n(7985),u=n(7874),d=n(2648),f=n(644),h=n(205);e.exports=function(e){return new Promise((function(t,n){var p,m=e.data,g=e.headers,_=e.responseType;function v(){e.cancelToken&&e.cancelToken.unsubscribe(p),e.signal&&e.signal.removeEventListener("abort",p)}r.isFormData(m)&&r.isStandardBrowserEnv()&&delete g["Content-Type"];var y=new XMLHttpRequest;if(e.auth){var b=e.auth.username||"",w=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";g.Authorization="Basic "+btoa(b+":"+w)}var x=s(e.baseURL,e.url);function E(){if(y){var r="getAllResponseHeaders"in y?c(y.getAllResponseHeaders()):null,o={data:_&&"text"!==_&&"json"!==_?y.response:y.responseText,status:y.status,statusText:y.statusText,headers:r,config:e,request:y};i((function(e){t(e),v()}),(function(e){n(e),v()}),o),y=null}}if(y.open(e.method.toUpperCase(),a(x,e.params,e.paramsSerializer),!0),y.timeout=e.timeout,"onloadend"in y?y.onloadend=E:y.onreadystatechange=function(){y&&4===y.readyState&&(0!==y.status||y.responseURL&&0===y.responseURL.indexOf("file:"))&&setTimeout(E)},y.onabort=function(){y&&(n(new d("Request aborted",d.ECONNABORTED,e,y)),y=null)},y.onerror=function(){n(new d("Network Error",d.ERR_NETWORK,e,y,y)),y=null},y.ontimeout=function(){var t=e.timeout?"timeout of "+e.timeout+"ms exceeded":"timeout exceeded",r=e.transitional||u;e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),n(new d(t,r.clarifyTimeoutError?d.ETIMEDOUT:d.ECONNABORTED,e,y)),y=null},r.isStandardBrowserEnv()){var S=(e.withCredentials||l(x))&&e.xsrfCookieName?o.read(e.xsrfCookieName):void 0;S&&(g[e.xsrfHeaderName]=S)}"setRequestHeader"in y&&r.forEach(g,(function(e,t){void 0===m&&"content-type"===t.toLowerCase()?delete g[t]:y.setRequestHeader(t,e)})),r.isUndefined(e.withCredentials)||(y.withCredentials=!!e.withCredentials),_&&"json"!==_&&(y.responseType=e.responseType),"function"==typeof e.onDownloadProgress&&y.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&y.upload&&y.upload.addEventListener("progress",e.onUploadProgress),(e.cancelToken||e.signal)&&(p=function(e){y&&(n(!e||e&&e.type?new f:e),y.abort(),y=null)},e.cancelToken&&e.cancelToken.subscribe(p),e.signal&&(e.signal.aborted?p():e.signal.addEventListener("abort",p))),m||(m=null);var k=h(x);k&&-1===["http","https","file"].indexOf(k)?n(new d("Unsupported protocol "+k+":",d.ERR_BAD_REQUEST,e)):y.send(m)}))}},1609:(e,t,n)=>{"use strict";var r=n(4867),i=n(1849),o=n(321),a=n(7185);var s=function e(t){var n=new o(t),s=i(o.prototype.request,n);return r.extend(s,o.prototype,n),r.extend(s,n),s.create=function(n){return e(a(t,n))},s}(n(5546));s.Axios=o,s.CanceledError=n(644),s.CancelToken=n(4972),s.isCancel=n(6502),s.VERSION=n(7288).version,s.toFormData=n(7675),s.AxiosError=n(2648),s.Cancel=s.CanceledError,s.all=function(e){return Promise.all(e)},s.spread=n(8713),s.isAxiosError=n(6268),e.exports=s,e.exports.default=s},4972:(e,t,n)=>{"use strict";var r=n(644);function i(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e}));var n=this;this.promise.then((function(e){if(n._listeners){var t,r=n._listeners.length;for(t=0;t<r;t++)n._listeners[t](e);n._listeners=null}})),this.promise.then=function(e){var t,r=new Promise((function(e){n.subscribe(e),t=e})).then(e);return r.cancel=function(){n.unsubscribe(t)},r},e((function(e){n.reason||(n.reason=new r(e),t(n.reason))}))}i.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},i.prototype.subscribe=function(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]},i.prototype.unsubscribe=function(e){if(this._listeners){var t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}},i.source=function(){var e;return{token:new i((function(t){e=t})),cancel:e}},e.exports=i},644:(e,t,n)=>{"use strict";var r=n(2648);function i(e){r.call(this,null==e?"canceled":e,r.ERR_CANCELED),this.name="CanceledError"}n(4867).inherits(i,r,{__CANCEL__:!0}),e.exports=i},6502:e=>{"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},321:(e,t,n)=>{"use strict";var r=n(4867),i=n(5327),o=n(782),a=n(3572),s=n(7185),c=n(4097),l=n(4875),u=l.validators;function d(e){this.defaults=e,this.interceptors={request:new o,response:new o}}d.prototype.request=function(e,t){"string"==typeof e?(t=t||{}).url=e:t=e||{},(t=s(this.defaults,t)).method?t.method=t.method.toLowerCase():this.defaults.method?t.method=this.defaults.method.toLowerCase():t.method="get";var n=t.transitional;void 0!==n&&l.assertOptions(n,{silentJSONParsing:u.transitional(u.boolean),forcedJSONParsing:u.transitional(u.boolean),clarifyTimeoutError:u.transitional(u.boolean)},!1);var r=[],i=!0;this.interceptors.request.forEach((function(e){"function"==typeof e.runWhen&&!1===e.runWhen(t)||(i=i&&e.synchronous,r.unshift(e.fulfilled,e.rejected))}));var o,c=[];if(this.interceptors.response.forEach((function(e){c.push(e.fulfilled,e.rejected)})),!i){var d=[a,void 0];for(Array.prototype.unshift.apply(d,r),d=d.concat(c),o=Promise.resolve(t);d.length;)o=o.then(d.shift(),d.shift());return o}for(var f=t;r.length;){var h=r.shift(),p=r.shift();try{f=h(f)}catch(e){p(e);break}}try{o=a(f)}catch(e){return Promise.reject(e)}for(;c.length;)o=o.then(c.shift(),c.shift());return o},d.prototype.getUri=function(e){e=s(this.defaults,e);var t=c(e.baseURL,e.url);return i(t,e.params,e.paramsSerializer)},r.forEach(["delete","get","head","options"],(function(e){d.prototype[e]=function(t,n){return this.request(s(n||{},{method:e,url:t,data:(n||{}).data}))}})),r.forEach(["post","put","patch"],(function(e){function t(t){return function(n,r,i){return this.request(s(i||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:n,data:r}))}}d.prototype[e]=t(),d.prototype[e+"Form"]=t(!0)})),e.exports=d},2648:(e,t,n)=>{"use strict";var r=n(4867);function i(e,t,n,r,i){Error.call(this),this.message=e,this.name="AxiosError",t&&(this.code=t),n&&(this.config=n),r&&(this.request=r),i&&(this.response=i)}r.inherits(i,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code,status:this.response&&this.response.status?this.response.status:null}}});var o=i.prototype,a={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED"].forEach((function(e){a[e]={value:e}})),Object.defineProperties(i,a),Object.defineProperty(o,"isAxiosError",{value:!0}),i.from=function(e,t,n,a,s,c){var l=Object.create(o);return r.toFlatObject(e,l,(function(e){return e!==Error.prototype})),i.call(l,e.message,t,n,a,s),l.name=e.name,c&&Object.assign(l,c),l},e.exports=i},782:(e,t,n)=>{"use strict";var r=n(4867);function i(){this.handlers=[]}i.prototype.use=function(e,t,n){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!n&&n.synchronous,runWhen:n?n.runWhen:null}),this.handlers.length-1},i.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},i.prototype.forEach=function(e){r.forEach(this.handlers,(function(t){null!==t&&e(t)}))},e.exports=i},4097:(e,t,n)=>{"use strict";var r=n(1793),i=n(7303);e.exports=function(e,t){return e&&!r(t)?i(e,t):t}},3572:(e,t,n)=>{"use strict";var r=n(4867),i=n(8527),o=n(6502),a=n(5546),s=n(644);function c(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new s}e.exports=function(e){return c(e),e.headers=e.headers||{},e.data=i.call(e,e.data,e.headers,e.transformRequest),e.headers=r.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),r.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t]})),(e.adapter||a.adapter)(e).then((function(t){return c(e),t.data=i.call(e,t.data,t.headers,e.transformResponse),t}),(function(t){return o(t)||(c(e),t&&t.response&&(t.response.data=i.call(e,t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))}},7185:(e,t,n)=>{"use strict";var r=n(4867);e.exports=function(e,t){t=t||{};var n={};function i(e,t){return r.isPlainObject(e)&&r.isPlainObject(t)?r.merge(e,t):r.isPlainObject(t)?r.merge({},t):r.isArray(t)?t.slice():t}function o(n){return r.isUndefined(t[n])?r.isUndefined(e[n])?void 0:i(void 0,e[n]):i(e[n],t[n])}function a(e){if(!r.isUndefined(t[e]))return i(void 0,t[e])}function s(n){return r.isUndefined(t[n])?r.isUndefined(e[n])?void 0:i(void 0,e[n]):i(void 0,t[n])}function c(n){return n in t?i(e[n],t[n]):n in e?i(void 0,e[n]):void 0}var l={url:a,method:a,data:a,baseURL:s,transformRequest:s,transformResponse:s,paramsSerializer:s,timeout:s,timeoutMessage:s,withCredentials:s,adapter:s,responseType:s,xsrfCookieName:s,xsrfHeaderName:s,onUploadProgress:s,onDownloadProgress:s,decompress:s,maxContentLength:s,maxBodyLength:s,beforeRedirect:s,transport:s,httpAgent:s,httpsAgent:s,cancelToken:s,socketPath:s,responseEncoding:s,validateStatus:c};return r.forEach(Object.keys(e).concat(Object.keys(t)),(function(e){var t=l[e]||o,i=t(e);r.isUndefined(i)&&t!==c||(n[e]=i)})),n}},6026:(e,t,n)=>{"use strict";var r=n(2648);e.exports=function(e,t,n){var i=n.config.validateStatus;n.status&&i&&!i(n.status)?t(new r("Request failed with status code "+n.status,[r.ERR_BAD_REQUEST,r.ERR_BAD_RESPONSE][Math.floor(n.status/100)-4],n.config,n.request,n)):e(n)}},8527:(e,t,n)=>{"use strict";var r=n(4867),i=n(5546);e.exports=function(e,t,n){var o=this||i;return r.forEach(n,(function(n){e=n.call(o,e,t)})),e}},5546:(e,t,n)=>{"use strict";var r=n(4867),i=n(6016),o=n(2648),a=n(7874),s=n(7675),c={"Content-Type":"application/x-www-form-urlencoded"};function l(e,t){!r.isUndefined(e)&&r.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var u,d={transitional:a,adapter:(("undefined"!=typeof XMLHttpRequest||"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process))&&(u=n(5448)),u),transformRequest:[function(e,t){if(i(t,"Accept"),i(t,"Content-Type"),r.isFormData(e)||r.isArrayBuffer(e)||r.isBuffer(e)||r.isStream(e)||r.isFile(e)||r.isBlob(e))return e;if(r.isArrayBufferView(e))return e.buffer;if(r.isURLSearchParams(e))return l(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString();var n,o=r.isObject(e),a=t&&t["Content-Type"];if((n=r.isFileList(e))||o&&"multipart/form-data"===a){var c=this.env&&this.env.FormData;return s(n?{"files[]":e}:e,c&&new c)}return o||"application/json"===a?(l(t,"application/json"),function(e,t,n){if(r.isString(e))try{return(t||JSON.parse)(e),r.trim(e)}catch(e){if("SyntaxError"!==e.name)throw e}return(n||JSON.stringify)(e)}(e)):e}],transformResponse:[function(e){var t=this.transitional||d.transitional,n=t&&t.silentJSONParsing,i=t&&t.forcedJSONParsing,a=!n&&"json"===this.responseType;if(a||i&&r.isString(e)&&e.length)try{return JSON.parse(e)}catch(e){if(a){if("SyntaxError"===e.name)throw o.from(e,o.ERR_BAD_RESPONSE,this,null,this.response);throw e}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:n(1623)},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};r.forEach(["delete","get","head"],(function(e){d.headers[e]={}})),r.forEach(["post","put","patch"],(function(e){d.headers[e]=r.merge(c)})),e.exports=d},7874:e=>{"use strict";e.exports={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1}},7288:e=>{e.exports={version:"0.27.2"}},1849:e=>{"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},5327:(e,t,n)=>{"use strict";var r=n(4867);function i(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,t,n){if(!t)return e;var o;if(n)o=n(t);else if(r.isURLSearchParams(t))o=t.toString();else{var a=[];r.forEach(t,(function(e,t){null!=e&&(r.isArray(e)?t+="[]":e=[e],r.forEach(e,(function(e){r.isDate(e)?e=e.toISOString():r.isObject(e)&&(e=JSON.stringify(e)),a.push(i(t)+"="+i(e))})))})),o=a.join("&")}if(o){var s=e.indexOf("#");-1!==s&&(e=e.slice(0,s)),e+=(-1===e.indexOf("?")?"?":"&")+o}return e}},7303:e=>{"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},4372:(e,t,n)=>{"use strict";var r=n(4867);e.exports=r.isStandardBrowserEnv()?{write:function(e,t,n,i,o,a){var s=[];s.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&s.push("expires="+new Date(n).toGMTString()),r.isString(i)&&s.push("path="+i),r.isString(o)&&s.push("domain="+o),!0===a&&s.push("secure"),document.cookie=s.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},1793:e=>{"use strict";e.exports=function(e){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)}},6268:(e,t,n)=>{"use strict";var r=n(4867);e.exports=function(e){return r.isObject(e)&&!0===e.isAxiosError}},7985:(e,t,n)=>{"use strict";var r=n(4867);e.exports=r.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function i(e){var r=e;return t&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return e=i(window.location.href),function(t){var n=r.isString(t)?i(t):t;return n.protocol===e.protocol&&n.host===e.host}}():function(){return!0}},6016:(e,t,n)=>{"use strict";var r=n(4867);e.exports=function(e,t){r.forEach(e,(function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])}))}},1623:e=>{e.exports=null},4109:(e,t,n)=>{"use strict";var r=n(4867),i=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,n,o,a={};return e?(r.forEach(e.split("\n"),(function(e){if(o=e.indexOf(":"),t=r.trim(e.substr(0,o)).toLowerCase(),n=r.trim(e.substr(o+1)),t){if(a[t]&&i.indexOf(t)>=0)return;a[t]="set-cookie"===t?(a[t]?a[t]:[]).concat([n]):a[t]?a[t]+", "+n:n}})),a):a}},205:e=>{"use strict";e.exports=function(e){var t=/^([-+\w]{1,25})(:?\/\/|:)/.exec(e);return t&&t[1]||""}},8713:e=>{"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}},7675:(e,t,n)=>{"use strict";var r=n(4867);e.exports=function(e,t){t=t||new FormData;var n=[];function i(e){return null===e?"":r.isDate(e)?e.toISOString():r.isArrayBuffer(e)||r.isTypedArray(e)?"function"==typeof Blob?new Blob([e]):Buffer.from(e):e}return function e(o,a){if(r.isPlainObject(o)||r.isArray(o)){if(-1!==n.indexOf(o))throw Error("Circular reference detected in "+a);n.push(o),r.forEach(o,(function(n,o){if(!r.isUndefined(n)){var s,c=a?a+"."+o:o;if(n&&!a&&"object"==typeof n)if(r.endsWith(o,"{}"))n=JSON.stringify(n);else if(r.endsWith(o,"[]")&&(s=r.toArray(n)))return void s.forEach((function(e){!r.isUndefined(e)&&t.append(c,i(e))}));e(n,c)}})),n.pop()}else t.append(a,i(o))}(e),t}},4875:(e,t,n)=>{"use strict";var r=n(7288).version,i=n(2648),o={};["object","boolean","number","function","string","symbol"].forEach((function(e,t){o[e]=function(n){return typeof n===e||"a"+(t<1?"n ":" ")+e}}));var a={};o.transitional=function(e,t,n){function o(e,t){return"[Axios v"+r+"] Transitional option '"+e+"'"+t+(n?". "+n:"")}return function(n,r,s){if(!1===e)throw new i(o(r," has been removed"+(t?" in "+t:"")),i.ERR_DEPRECATED);return t&&!a[r]&&(a[r]=!0,console.warn(o(r," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(n,r,s)}},e.exports={assertOptions:function(e,t,n){if("object"!=typeof e)throw new i("options must be an object",i.ERR_BAD_OPTION_VALUE);for(var r=Object.keys(e),o=r.length;o-- >0;){var a=r[o],s=t[a];if(s){var c=e[a],l=void 0===c||s(c,a,e);if(!0!==l)throw new i("option "+a+" must be "+l,i.ERR_BAD_OPTION_VALUE)}else if(!0!==n)throw new i("Unknown option "+a,i.ERR_BAD_OPTION)}},validators:o}},4867:(e,t,n)=>{"use strict";var r,i=n(1849),o=Object.prototype.toString,a=(r=Object.create(null),function(e){var t=o.call(e);return r[t]||(r[t]=t.slice(8,-1).toLowerCase())});function s(e){return e=e.toLowerCase(),function(t){return a(t)===e}}function c(e){return Array.isArray(e)}function l(e){return void 0===e}var u=s("ArrayBuffer");function d(e){return null!==e&&"object"==typeof e}function f(e){if("object"!==a(e))return!1;var t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}var h=s("Date"),p=s("File"),m=s("Blob"),g=s("FileList");function _(e){return"[object Function]"===o.call(e)}var v=s("URLSearchParams");function y(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),c(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.call(null,e[i],i,e)}var b,w=(b="undefined"!=typeof Uint8Array&&Object.getPrototypeOf(Uint8Array),function(e){return b&&e instanceof b});e.exports={isArray:c,isArrayBuffer:u,isBuffer:function(e){return null!==e&&!l(e)&&null!==e.constructor&&!l(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){var t="[object FormData]";return e&&("function"==typeof FormData&&e instanceof FormData||o.call(e)===t||_(e.toString)&&e.toString()===t)},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&u(e.buffer)},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:d,isPlainObject:f,isUndefined:l,isDate:h,isFile:p,isBlob:m,isFunction:_,isStream:function(e){return d(e)&&_(e.pipe)},isURLSearchParams:v,isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:y,merge:function e(){var t={};function n(n,r){f(t[r])&&f(n)?t[r]=e(t[r],n):f(n)?t[r]=e({},n):c(n)?t[r]=n.slice():t[r]=n}for(var r=0,i=arguments.length;r<i;r++)y(arguments[r],n);return t},extend:function(e,t,n){return y(t,(function(t,r){e[r]=n&&"function"==typeof t?i(t,n):t})),e},trim:function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")},stripBOM:function(e){return 65279===e.charCodeAt(0)&&(e=e.slice(1)),e},inherits:function(e,t,n,r){e.prototype=Object.create(t.prototype,r),e.prototype.constructor=e,n&&Object.assign(e.prototype,n)},toFlatObject:function(e,t,n){var r,i,o,a={};t=t||{};do{for(i=(r=Object.getOwnPropertyNames(e)).length;i-- >0;)a[o=r[i]]||(t[o]=e[o],a[o]=!0);e=Object.getPrototypeOf(e)}while(e&&(!n||n(e,t))&&e!==Object.prototype);return t},kindOf:a,kindOfTest:s,endsWith:function(e,t,n){e=String(e),(void 0===n||n>e.length)&&(n=e.length),n-=t.length;var r=e.indexOf(t,n);return-1!==r&&r===n},toArray:function(e){if(!e)return null;var t=e.length;if(l(t))return null;for(var n=new Array(t);t-- >0;)n[t]=e[t];return n},isTypedArray:w,isFileList:g}}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,n),o.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";const e=async()=>new Promise((e=>{let t;t=setInterval((async()=>{try{const n=document.getElementsByTagName("video")[0],r=document.querySelectorAll("[data-uia='video-canvas']")[0];n&&r?(clearInterval(t),console.log("HTML video element is loaded. Proceeding..."),e()):console.log("Video element not found! Retrying...")}catch(e){console.log(e)}}),10)})),t=e=>`${e.getFullYear()}-${(e.getMonth()+1).toString().padStart(2,"0")}-${e.getDate().toString().padStart(2,"0")}T${e.getHours().toString().padStart(2,"0")}:${e.getMinutes().toString().padStart(2,"0")}:${e.getSeconds().toString().padStart(2,"0")}.${e.getMilliseconds().toString().padStart(3,"0")}`;class r{constructor(e,n="white"){this.log=e=>{const n=`${this.prefix} | ${t(new Date)} |`;this.original_logger(`${n} %c ${e}`,`color: ${this.color}`)},this.prefix=e,this.color=n,this.original_logger=console.log}}class i{constructor(){this.elements_to_remove=["control-play-pause-pause","control-play-pause-play","control-back10","control-forward10","control-speed","control-episodes","control-next","timeline-bar"],this.elements_to_leave=["control-volume-off","control-volume-low","control-volume-medium","control-volume-high","control-audio-subtitle","control-fullscreen-enter","control-fullscreen-exit"],this.init=async()=>{await e(),this.create_shutter();document.querySelectorAll("[data-uia='video-canvas']")[0].onmousemove=()=>{let e=document.getElementsByClassName("watch-video--bottom-controls-container")[0];this.elements_to_remove.forEach((t=>{const n=this.get_element(e,t);n&&n.remove()})),this.elements_to_leave.forEach((t=>{const n=this.get_element(e,t);n&&this.modify_element(n)}))}},this.get_element=(e,t)=>{const n=`[data-uia='${t}']`;return e.querySelectorAll(n)[0]},this.logger=new r("[CustomPlayer]")}modify_element(e){if(e&&e.parentNode){const t=e,n=e.parentNode;t.style.zIndex="10100",n.style.zIndex="10100"}}create_shutter(){const e=document.querySelectorAll("[data-uia='video-canvas']")[0];e.style.willChange="unset";const t=document.createElement("div");t.id="transparent_panel",t.style.width="100vw",t.style.height="100vh",t.style.position="absolute",t.style.left="0",t.style.top="0",t.style.backgroundColor="lightblue",t.style.display="flex",t.style.justifyContent="center",t.style.alignItems="center",t.style.flexDirection="column",t.style.zIndex="10000",t.style.opacity="0",t.onclick=e=>{e.stopPropagation()},e.appendChild(t)}}var o;class a{}o=a,a.logger=new r("[NetflixBitrateMenu]"),a.invoke=async()=>{let e,t=1;return new Promise((n=>{e=setInterval((()=>{a.logger.log(`Invoking bitrate menu. Attempt: ${t}`),a.dispatch_invoker_event(),!0===a.is_invoked()&&(clearInterval(e),n()),t+=1}),500)}))},a.dispatch_invoker_event=()=>{a.logger.log("Dispatching keyboard event"),document.dispatchEvent(new KeyboardEvent("keydown",{key:"S",altKey:!0,ctrlKey:!0,shiftKey:!0,bubbles:!0,code:"KeyS",which:83,cancelable:!0,composed:!0,keyCode:83}))},a.close_invoked=()=>{const e=Array.from(document.getElementsByClassName("player-streams"));if(e.length>0)for(const t of e){a.logger.log("Closing remaining bitrate menu");Array.from(t.querySelectorAll("button")).filter((e=>"Override"===e.innerText))[0].click()}},a.is_invoked=()=>{const e=Array.from(document.getElementsByClassName("player-streams"));return e.length>0&&null!=e[0]?(a.logger.log("Bitrate menu invoked"),!0):(a.logger.log("Bitrate menu not invoked"),!1)},a.get_html_elements=async()=>{a.close_invoked(),await a.invoke();const e=document.getElementsByClassName("player-streams")[0],t=e.childNodes[0],n=t.childNodes[1].childNodes[1],r=Array.from(n.childNodes),i=r.map((e=>Number(e.value))),o=Array.from(e.querySelectorAll("button")).filter((e=>"Reset"===e.innerText))[0];return{container:t,override_button:Array.from(e.querySelectorAll("button")).filter((e=>"Override"===e.innerText))[0],reset_button:o,select:n,options:r,bitrate_values:i}},a.get_available_bitrates=async()=>{const{bitrate_values:e}=await a.get_html_elements();return o.close_invoked(),e},a.set_bitrate=async e=>{const{select:t,override_button:n}=await a.get_html_elements();t.value=e.toString(),n.click(),o.close_invoked()};const s={seek:{id:"netflix_seek",attribute:"seek_to",get:function(){return document.getElementById(this.id)}},current_time:{id:"netflix_current_time",attribute:"current_time",get:function(){return document.getElementById(this.id)}},duration:{id:"netflix_duration",attribute:"duration",get:function(){return document.getElementById(this.id)}}};class c{}c.logger=new r("[NetflixPlaybackController]"),c.seek=e=>{const t=s.seek.get();t?.setAttribute(s.seek.attribute,e.toString()),t?.click()},c.get_current_time=()=>{const e=s.current_time.get();return e?.click(),Number(e?.getAttribute(s.current_time.attribute))},c.get_video_duration=()=>{const e=s.duration.get();return e?.click(),Number(e?.getAttribute(s.duration.attribute))},c.pause_video=()=>{const e=c.get_html_video_element();null!=e&&e.pause()},c.resume_video=async()=>{const e=c.get_html_video_element();null!=e&&await e.play()},c.hide_video_player=()=>{const e=c.get_html_video_element();null!=e&&(e.style.visibility="hidden",e.style.pointerEvents="none")},c.reveal_video_player=()=>{const e=c.get_html_video_element();null!=e&&(e.style.visibility="visible",e.style.pointerEvents="auto")},c.set_video_muted=e=>{const t=c.get_html_video_element();null!=t&&(t.muted=e)},c.get_html_video_element=()=>{const e=document.getElementsByTagName("video")[0];return null!=e?e:null};class l{constructor(e,t){this.create_panel=()=>{const e=document.createElement("div");return e.id=this.id,e.style.width="100vw",e.style.height="100vh",e.style.backgroundColor="#222222",e.style.position="absolute",e.style.left="0px",e.style.top="0px",e.style.display="flex",e.style.justifyContent="center",e.style.alignItems="center",e.style.color="white",e.style.fontSize="24px",e.style.zIndex="11000",e.style.pointerEvents="none",e},this.reveal=()=>{const e=document.getElementsByTagName("video")[0].parentElement;document.querySelectorAll("[data-uia='video-canvas']")[0].style.willChange="unset",this.element.innerText=this.inner_text,e.appendChild(this.element)},this.remove=()=>{this.element.remove()},this.id=e,this.inner_text=t,this.element=this.create_panel()}}class u{}u.logger=new r("[NetflixDebugMenu]"),u.invoke=()=>{let e,t=1;return new Promise((n=>{e=setInterval((()=>{u.logger.log(`Invoking bitrate menu. Attempt: ${t}`),u.dispatch_invoker_event(),!0===u.is_invoked()&&(clearInterval(e),n()),t+=1}),500)}))},u.dispatch_invoker_event=()=>{document.dispatchEvent(new KeyboardEvent("keydown",{key:"D",altKey:!0,ctrlKey:!0,shiftKey:!0,bubbles:!0,code:"KeyD",which:68,cancelable:!0,composed:!0,keyCode:68}))},u.is_invoked=()=>{const e=document.getElementsByTagName("textarea")[0],t=document.getElementsByClassName("player-info")[0];return[e,t].some((e=>null==e))?(u.logger.log("Not invoked!"),!1):(u.logger.log("Invoked"),t.style.pointerEvents="none",e.style.pointerEvents="none",!0)},u.get_html_element=async()=>{!1===u.is_invoked()&&await u.invoke();return document.getElementsByTagName("textarea")[0]};const d=(e,t,n)=>{try{let r=n.match(e)??null;return null!=r?r[t]:null}catch(e){return null}},f=e=>d("(Position:) ([0-9]+.[0-9]+)",2,e),h=e=>d("(Volume:) ([0-9]+)%",2,e),p=e=>d("(Segment Position:) ([0-9]+.[0-9]+)",2,e),m=e=>d("(Player state: )([a-zA-Z]+)",2,e),g=e=>d("(Buffering state:) (.+)",2,e),_=e=>d("(Rendering state:) (.+)",2,e),v=e=>d("Playing bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)",1,e),y=e=>d("Playing bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)",2,e),b=e=>d("([0-9]+x[0-9]+)",1,e),w=e=>d("Playing/Buffering vmaf: ([0-9]+)s*/s*([0-9]+)",1,e),x=e=>d("Playing/Buffering vmaf: ([0-9]+)s*/s*([0-9]+)",2,e),E=e=>d("Buffering bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)",1,e),S=e=>d("Buffering bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)",2,e),k=e=>d("Total Frames:\\s*([0-9]+)",1,e),O=e=>d("Total Dropped Frames:\\s*([0-9]+)",1,e),R=e=>d("Total Corrupted Frames:\\s*([0-9]+)",1,e),A=e=>d("Framerate: ([0-9]+.[0-9]+)",1,e),N=e=>d("(Duration:) ([0-9]+.[0-9]+)",2,e),C={experiment_settings:{stats_record_interval_ms:1e3,bitrate_change_interval_ms:15e4,bitrate_change_jitter_ms:25e3,quality_increase_rewind:3e3,video_url:["https://www.netflix.com/watch/70305903"],subject_age:0,subject_sex:"",subject_netflix_familiarity:"",content_chooser:""},experiment_variables:{database_experiment_id:-1,database_video_id:-1,video_index:0,experiment_running:!1}};class T{}T.logger=new r("ChromeStorage"),T.initialize_default=async()=>{T.logger.log("Initializing default storage"),await chrome.storage.local.set(C)},T.set_single=async(e,t)=>{await chrome.storage.local.set({[e]:t})},T.get_single=async e=>(await chrome.storage.local.get([e]))[e],T.get_multiple=async(...e)=>await chrome.storage.local.get([...e]),T.get_experiment_variables=async()=>await T.get_single("experiment_variables"),T.set_experiment_variables=async e=>{await chrome.storage.local.set({experiment_variables:e})},T.get_experiment_settings=async()=>await T.get_single("experiment_settings"),T.set_experiment_settings=async e=>{await chrome.storage.local.set({experiment_settings:e})};var P=n(9669),B=n.n(P);const j="https://tufiqoe-fyn-remote-server.herokuapp.com",D={experiment:`${j}/experiment/`,experiment_next_id:`${j}/experiment/next_id`,video:`${j}/video/`,playback_data:`${j}/playback_data/`,assessment:`${j}/assessment/`,bitrate:`${j}/bitrate/`,connection_test:`${j}/connection_test/`,event:`${j}/event/`},I=async e=>{try{await B().post(D.event,e)}catch(e){console.log(e)}};class q{constructor(e){this.init=async()=>{window.document.onkeydown=async e=>{"G"===e.key&&!1===this.cooldown_active&&(this.cooldown_active=!0,await this.reset_video_quality(),this.cooldown_active=!1)}},this.reset_video_quality=async()=>{this.logger.log("Proceeding to reset video quality..."),this.mark_quality_increase_requested(),this.qualityDecreaser.stop_bitrate_changes();const e=await c.get_current_time();this.hide_video_player();const t=await a.get_available_bitrates(),n=t[t.length-1];await a.set_bitrate(n),await this.buffer_seek_reset(e),await(async e=>{const t=await u.get_html_element();let n;return console.log(`Waiting for expected bitrate to be buffered: ${e} kbps`),new Promise((r=>{n=setInterval((()=>{const i=S(t.value);Number(i)===e&&(clearInterval(n),console.log("Expected bitrate is buffering. Resolving..."),r())}),100)}))})(n),await(async()=>{const e=await u.get_html_element();let t;return console.log("Waiting for rendering state - playing"),new Promise((n=>{t=setInterval((()=>{"playing"===_(e.value)?.toLowerCase()&&(clearInterval(t),console.log("Rendering state - playing. Resolving..."),n())}),100)}))})(),await this.reveal_video_player(),this.mark_quality_increase_completed(),setTimeout((async()=>{await this.qualityDecreaser.init_bitrate_index(!0),await this.qualityDecreaser.set_new_bitrate(),await this.qualityDecreaser.start_bitrate_changes()}),5e3)},this.hide_video_player=()=>{this.logger.log("Hiding video player"),c.set_video_muted(!0),this.videoCurtain.reveal()},this.reveal_video_player=async()=>{this.logger.log("Revealing video player"),c.set_video_muted(!1),this.videoCurtain.remove()},this.buffer_seek_reset=async e=>{const t=await c.get_video_duration();c.seek(0),await new Promise((e=>{setTimeout((()=>{c.seek(t/2),e()}),250)})),await new Promise((e=>{setTimeout((()=>{c.seek(t/4),e()}),250)})),await new Promise((t=>{setTimeout((async()=>{const{quality_increase_rewind:n}=await T.get_experiment_settings();c.seek(e-Math.round(n/1e3)),t()}),250)}))},this.mark_quality_increase_requested=async()=>{const e={timestamp:t(new Date),video_id:(await T.get_experiment_variables()).database_video_id,type:"VIDEO_QUALITY_INCREASE_REQUESTED",payload:JSON.stringify({})};await I(e)},this.mark_quality_increase_completed=async()=>{const e={timestamp:t(new Date),video_id:(await T.get_experiment_variables()).database_video_id,type:"VIDEO_QUALITY_INCREASE_COMPLETED",payload:JSON.stringify({})};await I(e)},this.logger=new r("[QualityIncreaser]","steelblue"),this.qualityDecreaser=e,this.videoCurtain=new l("quality-increaser-curtain","Video quality is being increased. Please wait."),this.cooldown_active=!1}}const U="finished";class L{constructor(){this.init=async()=>{this.debug_menu=await u.get_html_element(),await this.start_debug_menu_recording()},this.start_debug_menu_recording=async()=>{const e=await(await T.get_experiment_settings()).stats_record_interval_ms;this.interval=setInterval((async()=>{if(!this.debug_menu)return;const e=t(new Date),n=((e,t)=>({position:f(e),volume:h(e),segment_position:p(e),player_state:m(e),buffering_state:g(e),rendering_state:_(e),playing_bitrate_audio:v(e),playing_bitrate_video:y(e),resolution:b(e),playing_vmaf:w(e),buffering_vmaf:x(e),buffering_bitrate_audio:E(e),buffering_bitrate_video:S(e),total_frames:k(e),total_dropped_frames:O(e),total_corrupted_frames:R(e),framerate:A(e),duration:N(e),timestamp:t}))(this.debug_menu.value,e),r={data:this.debug_menu.value,timestamp:e};await(async(e,t)=>{const{database_video_id:n}=await T.get_experiment_variables(),r={playback_data:e,archive:t,video_id:n};try{201===(await B().post(D.playback_data,r)).status&&console.log("Playback data submitted successfully")}catch(e){console.log(e)}})(n,r),await this.check_video_finished()}),e)},this.check_video_finished=async()=>{const e=document.getElementsByClassName("nfa-pos-abs nfa-bot-6-em nfa-right-5-em nfa-d-flex")[0];if([e,document.getElementsByClassName("PlayerSpace")[0],document.getElementsByClassName("BackToBrowse")[0]].some((e=>null!=e))){if(clearInterval(this.interval),c.pause_video(),e){document.querySelectorAll('[data-uia="watch-credits-seamless-button"]')[0].click(),e.remove()}const n=await T.get_experiment_variables(),r=await T.get_experiment_settings();await(async()=>{try{const e=await T.get_experiment_variables(),n={ended:t(new Date),video_id:e.database_video_id},r=await B().patch(D.video,n);console.log(r.data?.msg)}catch(e){console.log(e)}})(),n.video_index<r.video_url.length?(n.video_index+=1,await T.set_experiment_variables(n)):await(async()=>{try{const e=await T.get_experiment_variables(),n={ended:t(new Date),experiment_id:e.database_experiment_id},r=await B().patch(D.experiment,n);console.log(r.data?.msg)}catch(e){console.log(e)}})();const i={header:U};await chrome.runtime.sendMessage(i)}},this.logger=new r("[DebugMenuAnalyzer]")}}const $=class{constructor(){this.init=async()=>{this.bitrate_change_interval=await(await T.get_experiment_settings()).bitrate_change_interval_ms,this.bitrate_change_jitter=await(await T.get_experiment_settings()).bitrate_change_jitter_ms,await e(),c.hide_video_player(),await this.init_bitrate_index(),await this.set_new_bitrate(),this.reset_to_beginning(),c.reveal_video_player(),c.set_video_muted(!1),setTimeout((async()=>{await this.set_new_bitrate(),await this.start_bitrate_changes()}),1e4)},this.init_bitrate_index=async(e=!1)=>{const t=await a.get_available_bitrates();this.bitrate_index=!0===e?t.length-2:t.length-1,a.dispatch_invoker_event()},this.reset_to_beginning=()=>{const e=c.get_video_duration();c.seek(Math.round(e/2)),c.seek(Math.round(e/4)),c.seek(0)},this.start_bitrate_changes=async()=>{const e=this.calculate_timeout();this.logger.log(`Scheduling next bitrate change in ${e} ms`),this.timeout=setTimeout((async()=>{this.logger.log("Executing bitrate change..."),await this.set_new_bitrate(),await this.start_bitrate_changes()}),e)},this.stop_bitrate_changes=()=>{this.timeout&&(this.logger.log("Halting bitrate changes"),clearTimeout(this.timeout))},this.set_new_bitrate=async()=>{const e=(await a.get_available_bitrates())[this.bitrate_index];this.logger.log(`Setting bitrate to ${e} kbps`),await a.set_bitrate(e),this.decrement_bitrate_index()},this.decrement_bitrate_index=()=>{this.bitrate_index>0?this.bitrate_index-=1:this.bitrate_index=0},this.calculate_timeout=()=>{const e=[-this.bitrate_change_jitter,this.bitrate_change_jitter];return this.bitrate_change_interval+e[Math.round(Math.random())]},this.logger=new r("[QualityScenarioManager]","red"),this.bitrate_index=0}},F=()=>{const e=document.createElement("script");e.src=chrome.runtime.getURL("netflixControls.bundle.js"),(document.head||document.documentElement).appendChild(e),e.remove()};(async()=>{F();const e=new L;await e.init();const t=new i;await t.init();const n=new $;await n.init();const r=new q(n);await r.init()})()})()})();