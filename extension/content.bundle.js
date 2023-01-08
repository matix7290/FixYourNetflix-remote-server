/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var transitionalDefaults = __webpack_require__(/*! ../defaults/transitional */ "./node_modules/axios/lib/defaults/transitional.js");
var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");
var CanceledError = __webpack_require__(/*! ../cancel/CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");
var parseProtocol = __webpack_require__(/*! ../helpers/parseProtocol */ "./node_modules/axios/lib/helpers/parseProtocol.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new CanceledError() : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    var protocol = parseProtocol(fullPath);

    if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults/index.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.CanceledError = __webpack_require__(/*! ./cancel/CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
axios.VERSION = (__webpack_require__(/*! ./env/data */ "./node_modules/axios/lib/env/data.js").version);
axios.toFormData = __webpack_require__(/*! ./helpers/toFormData */ "./node_modules/axios/lib/helpers/toFormData.js");

// Expose AxiosError class
axios.AxiosError = __webpack_require__(/*! ../lib/core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var CanceledError = __webpack_require__(/*! ./CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new CanceledError(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CanceledError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CanceledError.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");
var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function CanceledError(message) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

module.exports = CanceledError;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var buildFullPath = __webpack_require__(/*! ./buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  var fullPath = buildFullPath(config.baseURL, config.url);
  return buildURL(fullPath, config.params, config.paramsSerializer);
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url: url,
        data: data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosError.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosError.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

var prototype = AxiosError.prototype;
var descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED'
// eslint-disable-next-line func-names
].forEach(function(code) {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = function(error, code, config, request, response, customProps) {
  var axiosError = Object.create(prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

module.exports = AxiosError;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults/index.js");
var CanceledError = __webpack_require__(/*! ../cancel/CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'beforeRedirect': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var AxiosError = __webpack_require__(/*! ./AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults/index.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/defaults/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ../helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");
var transitionalDefaults = __webpack_require__(/*! ./transitional */ "./node_modules/axios/lib/defaults/transitional.js");
var toFormData = __webpack_require__(/*! ../helpers/toFormData */ "./node_modules/axios/lib/helpers/toFormData.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ../adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ../adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: transitionalDefaults,

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    var isObjectPayload = utils.isObject(data);
    var contentType = headers && headers['Content-Type'];

    var isFileList;

    if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
      var _FormData = this.env && this.env.FormData;
      return toFormData(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
    } else if (isObjectPayload || contentType === 'application/json') {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: __webpack_require__(/*! ./env/FormData */ "./node_modules/axios/lib/helpers/null.js")
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/defaults/transitional.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = {
  "version": "0.27.2"
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/null.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/null.js ***!
  \************************************************/
/***/ ((module) => {

// eslint-disable-next-line strict
module.exports = null;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseProtocol.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseProtocol.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function parseProtocol(url) {
  var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toFormData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toFormData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Convert a data object to FormData
 * @param {Object} obj
 * @param {?Object} [formData]
 * @returns {Object}
 **/

function toFormData(obj, formData) {
  // eslint-disable-next-line no-param-reassign
  formData = formData || new FormData();

  var stack = [];

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  function build(data, parentKey) {
    if (utils.isPlainObject(data) || utils.isArray(data)) {
      if (stack.indexOf(data) !== -1) {
        throw Error('Circular reference detected in ' + parentKey);
      }

      stack.push(data);

      utils.forEach(data, function each(value, key) {
        if (utils.isUndefined(value)) return;
        var fullKey = parentKey ? parentKey + '.' + key : key;
        var arr;

        if (value && !parentKey && typeof value === 'object') {
          if (utils.endsWith(key, '{}')) {
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
          } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
            // eslint-disable-next-line func-names
            arr.forEach(function(el) {
              !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
            });
            return;
          }
        }

        build(value, fullKey);
      });

      stack.pop();
    } else {
      formData.append(parentKey, convertValue(data));
    }
  }

  build(obj);

  return formData;
}

module.exports = toFormData;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var VERSION = (__webpack_require__(/*! ../env/data */ "./node_modules/axios/lib/env/data.js").version);
var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

// eslint-disable-next-line func-names
var kindOf = (function(cache) {
  // eslint-disable-next-line func-names
  return function(thing) {
    var str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
})(Object.create(null));

function kindOfTest(type) {
  type = type.toLowerCase();
  return function isKindOf(thing) {
    return kindOf(thing) === type;
  };
}

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
var isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (kindOf(val) !== 'object') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
var isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
var isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} thing The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(thing) {
  var pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
}

/**
 * Determine if a value is a URLSearchParams object
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
var isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 */

function inherits(constructor, superConstructor, props, descriptors) {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function} [filter]
 * @returns {Object}
 */

function toFlatObject(sourceObj, destObj, filter) {
  var props;
  var i;
  var prop;
  var merged = {};

  destObj = destObj || {};

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (!merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = Object.getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/*
 * determines whether a string ends with the characters of a specified string
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 * @returns {boolean}
 */
function endsWith(str, searchString, position) {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  var lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object
 * @param {*} [thing]
 * @returns {Array}
 */
function toArray(thing) {
  if (!thing) return null;
  var i = thing.length;
  if (isUndefined(i)) return null;
  var arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

// eslint-disable-next-line func-names
var isTypedArray = (function(TypedArray) {
  // eslint-disable-next-line func-names
  return function(thing) {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM,
  inherits: inherits,
  toFlatObject: toFlatObject,
  kindOf: kindOf,
  kindOfTest: kindOfTest,
  endsWith: endsWith,
  toArray: toArray,
  isTypedArray: isTypedArray,
  isFileList: isFileList
};


/***/ }),

/***/ "./src/utils/http_requests/config.js":
/*!*******************************************!*\
  !*** ./src/utils/http_requests/config.js ***!
  \*******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BASE_URL": () => (/* binding */ BASE_URL),
/* harmony export */   "backend_urls": () => (/* binding */ backend_urls)
/* harmony export */ });
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

const BASE_URL = "http://127.0.0.1:5001";
const backend_urls = {
  experiment: `${BASE_URL}/experiment/`,
  experiment_next_id: `${BASE_URL}/experiment/next_id`,
  video: `${BASE_URL}/video/`,
  playback_data: `${BASE_URL}/playback_data/`,
  assessment: `${BASE_URL}/assessment/`,
  bitrate: `${BASE_URL}/bitrate/`,
  connection_test: `${BASE_URL}/connection_test/`,
  event: `${BASE_URL}/event/`
};
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(BASE_URL, "BASE_URL", "/Users/mateuszolszewski/GitHub/FixYourNetflix-TUFIQoE-2022/extension/src/utils/http_requests/config.js");
  reactHotLoader.register(backend_urls, "backend_urls", "/Users/mateuszolszewski/GitHub/FixYourNetflix-TUFIQoE-2022/extension/src/utils/http_requests/config.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ }),

/***/ "./src/config/messages.config.ts":
/*!***************************************!*\
  !*** ./src/config/messages.config.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MESSAGE_HEADERS": () => (/* binding */ MESSAGE_HEADERS)
/* harmony export */ });
const MESSAGE_HEADERS = {
    START_ANALYZING: 'start_analyzing',
    NERD_STATISTICS: 'nerdstats',
    ASSESSMENT: 'assessment',
    FINISHED: 'finished',
    CREDITS: 'credits',
    REDIRECT: 'redirect'
};


/***/ }),

/***/ "./src/config/netflix_player_api.ts":
/*!******************************************!*\
  !*** ./src/config/netflix_player_api.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "netflix_api_elements": () => (/* binding */ netflix_api_elements)
/* harmony export */ });
const netflix_api_elements = {
    seek: {
        id: "netflix_seek",
        attribute: "seek_to",
        get: function () { return document.getElementById(this.id); }
    },
    current_time: {
        id: "netflix_current_time",
        attribute: "current_time",
        get: function () { return document.getElementById(this.id); }
    },
    duration: {
        id: "netflix_duration",
        attribute: "duration",
        get: function () { return document.getElementById(this.id); }
    }
};


/***/ }),

/***/ "./src/config/storage.config.ts":
/*!**************************************!*\
  !*** ./src/config/storage.config.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "STORAGE_DEFAULT": () => (/* binding */ STORAGE_DEFAULT),
/* harmony export */   "STORAGE_KEYS": () => (/* binding */ STORAGE_KEYS)
/* harmony export */ });
// The rest...
const STORAGE_KEYS = {
    EXPERIMENT_SETTINGS: "experiment_settings",
    EXPERIMENT_VARIABLES: "experiment_variables"
};
const STORAGE_DEFAULT = {
    experiment_settings: {
        stats_record_interval_ms: 1000,
        bitrate_change_interval_ms: 2.5 * 60 * 1000,
        bitrate_change_jitter_ms: 25 * 1000,
        quality_increase_rewind: 3 * 1000,
        video_url: [
            "https://www.netflix.com/watch/70305903"
        ],
        subject_age: 0,
        subject_sex: "",
        subject_netflix_familiarity: "",
        content_chooser: ""
    },
    experiment_variables: {
        database_experiment_id: -1,
        database_video_id: -1,
        video_index: 0,
        experiment_running: false
    }
};


/***/ }),

/***/ "./src/pages/Content/CustomPlayer.ts":
/*!*******************************************!*\
  !*** ./src/pages/Content/CustomPlayer.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CustomPlayer": () => (/* binding */ CustomPlayer)
/* harmony export */ });
/* harmony import */ var _utils_waiters_wait_for_video_to_load__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/waiters/wait_for_video_to_load */ "./src/utils/waiters/wait_for_video_to_load.ts");
/* harmony import */ var _utils_custom_CustomLogger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/custom/CustomLogger */ "./src/utils/custom/CustomLogger.ts");


class CustomPlayer {
    constructor() {
        this.elements_to_remove = ["control-play-pause-pause", "control-play-pause-play", "control-back10",
            "control-forward10", "control-speed", "control-episodes", "control-next", "timeline-bar"];
        this.elements_to_leave = [
            "control-volume-off",
            "control-volume-low",
            "control-volume-medium",
            "control-volume-high",
            "control-audio-subtitle",
            "control-fullscreen-enter",
            "control-fullscreen-exit"
        ];
        this.init = async () => {
            await (0,_utils_waiters_wait_for_video_to_load__WEBPACK_IMPORTED_MODULE_0__.wait_for_video_to_load)();
            this.create_shutter();
            const video_canvas = document.querySelectorAll("[data-uia='video-canvas']")[0];
            video_canvas.onmousemove = () => {
                let controls_container = document.getElementsByClassName("watch-video--bottom-controls-container")[0];
                this.elements_to_remove.forEach(element_data_uia => {
                    const element = this.get_element(controls_container, element_data_uia);
                    if (element)
                        element.remove();
                });
                this.elements_to_leave.forEach(element_data_uia => {
                    const element = this.get_element(controls_container, element_data_uia);
                    if (element)
                        this.modify_element(element);
                });
            };
        };
        this.get_element = (container, element_data_uia) => {
            const selector = `[data-uia='${element_data_uia}']`;
            return container.querySelectorAll(selector)[0];
        };
        this.logger = new _utils_custom_CustomLogger__WEBPACK_IMPORTED_MODULE_1__.CustomLogger("[CustomPlayer]");
    }
    modify_element(element) {
        if (element && element.parentNode) {
            const el = element;
            const parent_node = element.parentNode;
            el.style.zIndex = "10100";
            parent_node.style.zIndex = "10100";
        }
    }
    create_shutter() {
        const video_canvas = document.querySelectorAll("[data-uia='video-canvas']")[0];
        video_canvas.style.willChange = "unset"; // <-- this is essential - in YourNetflixOurLab it was done in AssessmentManager
        const shutter = document.createElement("div");
        shutter.id = "transparent_panel";
        shutter.style.width = "100vw";
        shutter.style.height = "100vh";
        shutter.style.position = "absolute";
        shutter.style.left = "0";
        shutter.style.top = "0";
        shutter.style.backgroundColor = "lightblue";
        shutter.style.display = "flex";
        shutter.style.justifyContent = "center";
        shutter.style.alignItems = "center";
        shutter.style.flexDirection = "column";
        shutter.style.zIndex = "10000";
        shutter.style.opacity = "0";
        shutter.onclick = (e) => {
            e.stopPropagation();
        };
        video_canvas.appendChild(shutter);
    }
}


/***/ }),

/***/ "./src/pages/Content/DebugMenuAnalyzer.ts":
/*!************************************************!*\
  !*** ./src/pages/Content/DebugMenuAnalyzer.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DebugMenuAnalyzer": () => (/* binding */ DebugMenuAnalyzer)
/* harmony export */ });
/* harmony import */ var _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/custom/ChromeStorage */ "./src/utils/custom/ChromeStorage.ts");
/* harmony import */ var _utils_custom_CustomLogger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/custom/CustomLogger */ "./src/utils/custom/CustomLogger.ts");
/* harmony import */ var _utils_netflix_NetflixDebugMenu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/netflix/NetflixDebugMenu */ "./src/utils/netflix/NetflixDebugMenu.ts");
/* harmony import */ var _utils_debug_menu_analysis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/debug_menu_analysis */ "./src/utils/debug_menu_analysis.ts");
/* harmony import */ var _utils_time_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/time_utils */ "./src/utils/time_utils.ts");
/* harmony import */ var _utils_http_requests_post_playback_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/http_requests/post_playback_data */ "./src/utils/http_requests/post_playback_data.ts");
/* harmony import */ var _config_messages_config__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../config/messages.config */ "./src/config/messages.config.ts");
/* harmony import */ var _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/netflix/NetflixPlayerAPI */ "./src/utils/netflix/NetflixPlayerAPI.ts");
/* harmony import */ var _utils_http_requests_patch_video_ended__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/http_requests/patch_video_ended */ "./src/utils/http_requests/patch_video_ended.ts");
/* harmony import */ var _utils_http_requests_patch_experiment_ended__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../utils/http_requests/patch_experiment_ended */ "./src/utils/http_requests/patch_experiment_ended.ts");










class DebugMenuAnalyzer {
    constructor() {
        this.init = async () => {
            this.debug_menu = await _utils_netflix_NetflixDebugMenu__WEBPACK_IMPORTED_MODULE_2__.NetflixDebugMenu.get_html_element();
            await this.start_debug_menu_recording();
        };
        this.start_debug_menu_recording = async () => {
            const interval_value = await (await _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_0__.ChromeStorage.get_experiment_settings()).stats_record_interval_ms;
            this.interval = setInterval(async () => {
                // Check if debug menu is not null
                if (!this.debug_menu)
                    return;
                const timestamp = (0,_utils_time_utils__WEBPACK_IMPORTED_MODULE_4__.get_local_datetime)(new Date());
                const data = (0,_utils_debug_menu_analysis__WEBPACK_IMPORTED_MODULE_3__.extract_debug_menu_data)(this.debug_menu.value, timestamp);
                const archive = {
                    data: this.debug_menu.value,
                    timestamp: timestamp
                };
                // Send data to backend
                await (0,_utils_http_requests_post_playback_data__WEBPACK_IMPORTED_MODULE_5__.post_playback_data)(data, archive);
                // Check if video has finished
                await this.check_video_finished();
            }, interval_value);
        };
        this.check_video_finished = async () => {
            const outer_container = document.getElementsByClassName("nfa-pos-abs nfa-bot-6-em nfa-right-5-em nfa-d-flex")[0];
            const player_space = document.getElementsByClassName("PlayerSpace")[0];
            const back_to_browse = document.getElementsByClassName("BackToBrowse")[0];
            // Click watch credits in case of common series episode
            if ([outer_container, player_space, back_to_browse].some(el => el != null)) {
                // Clear analyze interval
                clearInterval(this.interval);
                // Pause video
                _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_7__.NetflixPlayerAPI.pause_video();
                // Simulate click on watch-credits-button in order to avoid default Netflix behaviour
                if (outer_container) {
                    const credits_button = document.querySelectorAll('[data-uia="watch-credits-seamless-button"]')[0];
                    credits_button.click();
                    outer_container.remove();
                }
                // Update finished video
                const variables = await _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_0__.ChromeStorage.get_experiment_variables();
                const settings = await _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_0__.ChromeStorage.get_experiment_settings();
                // Update current video finished time
                await (0,_utils_http_requests_patch_video_ended__WEBPACK_IMPORTED_MODULE_8__.patch_video_ended)();
                if (variables.video_index < settings.video_url.length) {
                    variables.video_index += 1;
                    await _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_0__.ChromeStorage.set_experiment_variables(variables);
                }
                else {
                    // Experiment finished
                    await (0,_utils_http_requests_patch_experiment_ended__WEBPACK_IMPORTED_MODULE_9__.patch_experiment_ended)();
                }
                // Send FINISHED signal to the BackgroundScript
                const message = {
                    header: _config_messages_config__WEBPACK_IMPORTED_MODULE_6__.MESSAGE_HEADERS.FINISHED
                };
                await chrome.runtime.sendMessage(message);
            }
        };
        this.logger = new _utils_custom_CustomLogger__WEBPACK_IMPORTED_MODULE_1__.CustomLogger("[DebugMenuAnalyzer]");
    }
}
/*
     * This method checks if certain HTML elements are available in DOM tree.
     * Their availability indicates that serie's video is about to end and credits are present.
     * If elements are detected video playback ends and subject is redirected to custom extension's web page

async are_credits_available(){
    const outer_container = document.getElementsByClassName("nfa-pos-abs nfa-bot-6-em nfa-right-5-em nfa-d-flex")[0]

    // data-uia = "watch-credits-seamless-button"   // Leave this for reference purpose
    // data-uia="next-episode-seamless-button"      // Leave this for reference purpose
    
    // Checking PlayerSpace class element in case of last episode of the last season
    const player_space = document.getElementsByClassName("PlayerSpace")[0]

    // This element is displayed when last video of last season is played or a standalone movie
    const back_to_browse = document.getElementsByClassName("BackToBrowse")[0]

    if(back_to_browse){
        clearInterval(this.interval)

        // Pause the video
        document.getElementsByTagName("video")[0].pause()

        // Send FINISHED signal to the BackgroundScript
        const message : T_MESSAGE = {
            header: MESSAGE_HEADERS.FINISHED
        }
        await chrome.runtime.sendMessage(message)
        
    }
    else if(player_space){
        // Stop analyzing
        clearInterval(this.interval)

        // Pause the video
        document.getElementsByTagName("video")[0].pause()

        // Send FINISHED signal to the BackgroundScript
        const message : T_MESSAGE = {
            header: MESSAGE_HEADERS.FINISHED
        }
        await chrome.runtime.sendMessage(message)
    }
    else if(outer_container){
        // Click watch credits button
        const credits_button = document.querySelectorAll('[data-uia="watch-credits-seamless-button"]')[0] as HTMLButtonElement
        credits_button.click()
        outer_container.remove() // remove container

        // Stop analyzing
        clearInterval(this.interval)

        // Pause the video
        document.getElementsByTagName("video")[0].pause()

        // Send FINISHED signal to the BackgroundScript
        const message : T_MESSAGE = {
            header: MESSAGE_HEADERS.FINISHED
        }
        await chrome.runtime.sendMessage(message)
    }
}
*/ 


/***/ }),

/***/ "./src/pages/Content/QualityDecreaser.ts":
/*!***********************************************!*\
  !*** ./src/pages/Content/QualityDecreaser.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QualityDecreaser": () => (/* binding */ QualityDecreaser),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/custom/ChromeStorage */ "./src/utils/custom/ChromeStorage.ts");
/* harmony import */ var _utils_custom_CustomLogger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/custom/CustomLogger */ "./src/utils/custom/CustomLogger.ts");
/* harmony import */ var _utils_netflix_NetflixBitrateMenu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/netflix/NetflixBitrateMenu */ "./src/utils/netflix/NetflixBitrateMenu.ts");
/* harmony import */ var _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/netflix/NetflixPlayerAPI */ "./src/utils/netflix/NetflixPlayerAPI.ts");
/* harmony import */ var _utils_waiters_wait_for_video_to_load__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/waiters/wait_for_video_to_load */ "./src/utils/waiters/wait_for_video_to_load.ts");





class QualityDecreaser {
    constructor() {
        this.init = async () => {
            // Prepare bitrate change settings
            this.bitrate_change_interval = await (await _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_0__.ChromeStorage.get_experiment_settings()).bitrate_change_interval_ms;
            this.bitrate_change_jitter = await (await _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_0__.ChromeStorage.get_experiment_settings()).bitrate_change_jitter_ms;
            await (0,_utils_waiters_wait_for_video_to_load__WEBPACK_IMPORTED_MODULE_4__.wait_for_video_to_load)();
            _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_3__.NetflixPlayerAPI.hide_video_player();
            await this.init_bitrate_index();
            await this.set_new_bitrate(); // Setting first bitrate - highest value
            this.reset_to_beginning(); // Resetting playback - rewinding to the beginning
            _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_3__.NetflixPlayerAPI.reveal_video_player();
            _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_3__.NetflixPlayerAPI.set_video_muted(false);
            // Some time after starting video with highest possible quality set next bitrate to buffer and schedule rest
            // Proper solution would be to wait for buffer to fill up to certain capacity
            setTimeout(async () => {
                await this.set_new_bitrate();
                await this.start_bitrate_changes();
            }, 10e3);
        };
        this.init_bitrate_index = async (after_quality_reset = false) => {
            const available_bitrates = await _utils_netflix_NetflixBitrateMenu__WEBPACK_IMPORTED_MODULE_2__.NetflixBitrateMenu.get_available_bitrates();
            this.bitrate_index = after_quality_reset === true ? available_bitrates.length - 2 : available_bitrates.length - 1;
            _utils_netflix_NetflixBitrateMenu__WEBPACK_IMPORTED_MODULE_2__.NetflixBitrateMenu.dispatch_invoker_event();
        };
        /**
         *  Method rewinds video to the beginning resetting video buffer at the same time.
         *  @returns {void}
        */
        this.reset_to_beginning = () => {
            const video_duration = _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_3__.NetflixPlayerAPI.get_video_duration();
            _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_3__.NetflixPlayerAPI.seek(Math.round(video_duration / 2));
            _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_3__.NetflixPlayerAPI.seek(Math.round(video_duration / 4));
            _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_3__.NetflixPlayerAPI.seek(0); // seek to the beginning of the video
        };
        /**
         * Recurent method - schedules bitrate change using setTimeout.
        */
        this.start_bitrate_changes = async () => {
            const tmt = this.calculate_timeout();
            this.logger.log(`Scheduling next bitrate change in ${tmt} ms`);
            this.timeout = setTimeout(async () => {
                this.logger.log("Executing bitrate change...");
                await this.set_new_bitrate();
                // Call itself recurrently
                await this.start_bitrate_changes();
            }, tmt);
        };
        /**
         * Method cleares scheduled bitrate changes .
        */
        this.stop_bitrate_changes = () => {
            if (this.timeout) {
                this.logger.log("Halting bitrate changes");
                clearTimeout(this.timeout);
            }
        };
        /**
         *  Method uses NetflixBitrateMenu wrapper API in order to set new bitrate value.
        */
        this.set_new_bitrate = async () => {
            const bitrates = await _utils_netflix_NetflixBitrateMenu__WEBPACK_IMPORTED_MODULE_2__.NetflixBitrateMenu.get_available_bitrates();
            const bitrate_to_set = bitrates[this.bitrate_index];
            this.logger.log(`Setting bitrate to ${bitrate_to_set} kbps`);
            await _utils_netflix_NetflixBitrateMenu__WEBPACK_IMPORTED_MODULE_2__.NetflixBitrateMenu.set_bitrate(bitrate_to_set);
            this.decrement_bitrate_index();
        };
        /**
         * Method decrements bitrate index. Index value cannot be lower than 0
        */
        this.decrement_bitrate_index = () => {
            this.bitrate_index > 0 ? this.bitrate_index -= 1 : this.bitrate_index = 0;
        };
        /**
         * Timeout value is calculated using base and jitter.
         * +- value is choosen randomly with uniform distribution
         * @returns {number}
        */
        this.calculate_timeout = () => {
            const jitters = [-this.bitrate_change_jitter, this.bitrate_change_jitter];
            return this.bitrate_change_interval + jitters[Math.round(Math.random())];
        };
        this.logger = new _utils_custom_CustomLogger__WEBPACK_IMPORTED_MODULE_1__.CustomLogger("[QualityScenarioManager]", "red");
        this.bitrate_index = 0;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QualityDecreaser);


/***/ }),

/***/ "./src/pages/Content/QualityIncreaser.ts":
/*!***********************************************!*\
  !*** ./src/pages/Content/QualityIncreaser.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QualityIncreaser": () => (/* binding */ QualityIncreaser)
/* harmony export */ });
/* harmony import */ var _utils_custom_CustomLogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/custom/CustomLogger */ "./src/utils/custom/CustomLogger.ts");
/* harmony import */ var _utils_netflix_NetflixBitrateMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/netflix/NetflixBitrateMenu */ "./src/utils/netflix/NetflixBitrateMenu.ts");
/* harmony import */ var _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/netflix/NetflixPlayerAPI */ "./src/utils/netflix/NetflixPlayerAPI.ts");
/* harmony import */ var _utils_custom_VideoCurtain__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/custom/VideoCurtain */ "./src/utils/custom/VideoCurtain.ts");
/* harmony import */ var _utils_waiters_wait_for_rendering_state_playing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/waiters/wait_for_rendering_state_playing */ "./src/utils/waiters/wait_for_rendering_state_playing.ts");
/* harmony import */ var _utils_waiters_wait_for_expected_bitrate_buffering__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/waiters/wait_for_expected_bitrate_buffering */ "./src/utils/waiters/wait_for_expected_bitrate_buffering.ts");
/* harmony import */ var _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/custom/ChromeStorage */ "./src/utils/custom/ChromeStorage.ts");
/* harmony import */ var _utils_http_requests_post_custom_event__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/http_requests/post_custom_event */ "./src/utils/http_requests/post_custom_event.ts");
/* harmony import */ var _utils_time_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/time_utils */ "./src/utils/time_utils.ts");









class QualityIncreaser {
    constructor(qualityDecreaser) {
        this.init = async () => {
            window.document.onkeydown = async (e) => {
                if (e.key === "G" && this.cooldown_active === false) {
                    this.cooldown_active = true; // enable quality increase cooldown
                    await this.reset_video_quality();
                    this.cooldown_active = false; // disable cooldown after process has finished
                }
            };
        };
        /**
         * Resets video quality to highest possible value
        */
        this.reset_video_quality = async () => {
            this.logger.log("Proceeding to reset video quality...");
            // Mark quality increase request in database
            this.mark_quality_increase_requested();
            // Stop quality decreasing process
            this.qualityDecreaser.stop_bitrate_changes();
            // Hide resetting process from subject
            const request_time = await _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_2__.NetflixPlayerAPI.get_current_time();
            this.hide_video_player();
            // Set highest bitrate available
            const available_bitrates = await _utils_netflix_NetflixBitrateMenu__WEBPACK_IMPORTED_MODULE_1__.NetflixBitrateMenu.get_available_bitrates();
            const highest_bitrate_available = available_bitrates[available_bitrates.length - 1];
            await _utils_netflix_NetflixBitrateMenu__WEBPACK_IMPORTED_MODULE_1__.NetflixBitrateMenu.set_bitrate(highest_bitrate_available);
            // Reset buffer
            await this.buffer_seek_reset(request_time);
            await (0,_utils_waiters_wait_for_expected_bitrate_buffering__WEBPACK_IMPORTED_MODULE_5__.wait_for_expected_bitrate_buffering)(highest_bitrate_available);
            // Resume video
            await (0,_utils_waiters_wait_for_rendering_state_playing__WEBPACK_IMPORTED_MODULE_4__.wait_for_rendering_state_playing)();
            await this.reveal_video_player();
            // Mark video quality increase completed in database
            this.mark_quality_increase_completed();
            // Resume quality decreasing process - resuming 2-5 seconds after resuming playback - giving some time for the highest quality to buffer
            // Marked as irrelevant for now
            setTimeout(async () => {
                await this.qualityDecreaser.init_bitrate_index(true);
                await this.qualityDecreaser.set_new_bitrate();
                await this.qualityDecreaser.start_bitrate_changes();
            }, 5000);
        };
        /**
         * Blocks video playback from subject
        */
        this.hide_video_player = () => {
            this.logger.log("Hiding video player");
            _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_2__.NetflixPlayerAPI.set_video_muted(true);
            //NetflixPlayerAPI.pause_video()
            this.videoCurtain.reveal();
        };
        /**
         * Reveals video playback to the subject
        */
        this.reveal_video_player = async () => {
            this.logger.log("Revealing video player");
            _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_2__.NetflixPlayerAPI.set_video_muted(false);
            //await NetflixPlayerAPI.resume_video()
            this.videoCurtain.remove();
        };
        /**
         * Method uses NetflixPlayerAPI in order to reset video buffer by seeking video.
         * Playback resumes at the time passed as parameter
         * @param video_pause_time
        */
        this.buffer_seek_reset = async (video_pause_time) => {
            const video_duration = await _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_2__.NetflixPlayerAPI.get_video_duration();
            const delay = 250; //ms
            // Seek to beginning of video immediately
            _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_2__.NetflixPlayerAPI.seek(0);
            // Seek to the other positions after certain delay
            await new Promise(resolve => {
                setTimeout(() => {
                    _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_2__.NetflixPlayerAPI.seek(video_duration / 2);
                    resolve();
                }, delay);
            });
            await new Promise(resolve => {
                setTimeout(() => {
                    _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_2__.NetflixPlayerAPI.seek(video_duration / 4);
                    resolve();
                }, delay);
            });
            await new Promise(resolve => {
                setTimeout(async () => {
                    const { quality_increase_rewind } = await _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_6__.ChromeStorage.get_experiment_settings();
                    _utils_netflix_NetflixPlayerAPI__WEBPACK_IMPORTED_MODULE_2__.NetflixPlayerAPI.seek(video_pause_time - Math.round(quality_increase_rewind / 1000));
                    resolve();
                }, delay);
            });
        };
        this.mark_quality_increase_requested = async () => {
            const data = {
                timestamp: (0,_utils_time_utils__WEBPACK_IMPORTED_MODULE_8__.get_local_datetime)(new Date()),
                video_id: (await _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_6__.ChromeStorage.get_experiment_variables()).database_video_id,
                type: "VIDEO_QUALITY_INCREASE_REQUESTED",
                payload: JSON.stringify({})
            };
            await (0,_utils_http_requests_post_custom_event__WEBPACK_IMPORTED_MODULE_7__.post_custom_event)(data);
        };
        this.mark_quality_increase_completed = async () => {
            const data = {
                timestamp: (0,_utils_time_utils__WEBPACK_IMPORTED_MODULE_8__.get_local_datetime)(new Date()),
                video_id: (await _utils_custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_6__.ChromeStorage.get_experiment_variables()).database_video_id,
                type: "VIDEO_QUALITY_INCREASE_COMPLETED",
                payload: JSON.stringify({})
            };
            await (0,_utils_http_requests_post_custom_event__WEBPACK_IMPORTED_MODULE_7__.post_custom_event)(data);
        };
        this.logger = new _utils_custom_CustomLogger__WEBPACK_IMPORTED_MODULE_0__.CustomLogger("[QualityIncreaser]", "steelblue");
        this.qualityDecreaser = qualityDecreaser;
        this.videoCurtain = new _utils_custom_VideoCurtain__WEBPACK_IMPORTED_MODULE_3__.VideoCurtain("quality-increaser-curtain", "Video quality is being increased. Please wait.");
        this.cooldown_active = false;
    }
}


/***/ }),

/***/ "./src/pages/Content/index.ts":
/*!************************************!*\
  !*** ./src/pages/Content/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CustomPlayer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CustomPlayer */ "./src/pages/Content/CustomPlayer.ts");
/* harmony import */ var _QualityIncreaser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./QualityIncreaser */ "./src/pages/Content/QualityIncreaser.ts");
/* harmony import */ var _DebugMenuAnalyzer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DebugMenuAnalyzer */ "./src/pages/Content/DebugMenuAnalyzer.ts");
/* harmony import */ var _QualityDecreaser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./QualityDecreaser */ "./src/pages/Content/QualityDecreaser.ts");




const init = async () => {
    inject_netflix_controls_script();
    // First create and initialize DebugMenuAnalyzer instance
    const debugAnalyzer = new _DebugMenuAnalyzer__WEBPACK_IMPORTED_MODULE_2__.DebugMenuAnalyzer();
    await debugAnalyzer.init();
    // Second create and initialize CustomPlayer instance <-- in order to remove default player controls
    const customPlayer = new _CustomPlayer__WEBPACK_IMPORTED_MODULE_0__.CustomPlayer();
    await customPlayer.init();
    // Third create QualityDecreaser instance
    const qualityDecreaser = new _QualityDecreaser__WEBPACK_IMPORTED_MODULE_3__["default"]();
    await qualityDecreaser.init();
    // Fourth create QualityIncreaser instance
    const qualityIncreaser = new _QualityIncreaser__WEBPACK_IMPORTED_MODULE_1__.QualityIncreaser(qualityDecreaser);
    await qualityIncreaser.init();
};
const inject_netflix_controls_script = () => {
    const s = document.createElement("script");
    s.src = chrome.runtime.getURL("netflixControls.bundle.js");
    (document.head || document.documentElement).appendChild(s);
    s.remove();
};
init();


/***/ }),

/***/ "./src/utils/custom/ChromeStorage.ts":
/*!*******************************************!*\
  !*** ./src/utils/custom/ChromeStorage.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ChromeStorage": () => (/* binding */ ChromeStorage)
/* harmony export */ });
/* harmony import */ var _config_storage_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/storage.config */ "./src/config/storage.config.ts");
/* harmony import */ var _CustomLogger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CustomLogger */ "./src/utils/custom/CustomLogger.ts");
var _a;


class ChromeStorage {
}
_a = ChromeStorage;
ChromeStorage.logger = new _CustomLogger__WEBPACK_IMPORTED_MODULE_1__.CustomLogger("ChromeStorage");
ChromeStorage.initialize_default = async () => {
    ChromeStorage.logger.log("Initializing default storage");
    await chrome.storage.local.set(_config_storage_config__WEBPACK_IMPORTED_MODULE_0__.STORAGE_DEFAULT);
};
ChromeStorage.set_single = async (key, data) => {
    await chrome.storage.local.set({
        [key]: data
    });
};
ChromeStorage.get_single = async (key) => {
    const res = await chrome.storage.local.get([key]);
    return res[key];
};
ChromeStorage.get_multiple = async (...keys) => {
    return await chrome.storage.local.get([...keys]);
};
// Experiment variables utils
ChromeStorage.get_experiment_variables = async () => {
    const experiment_variables = await ChromeStorage.get_single("experiment_variables");
    return experiment_variables;
};
ChromeStorage.set_experiment_variables = async (variables) => {
    await chrome.storage.local.set({ experiment_variables: variables });
};
// Experiment settings utils
ChromeStorage.get_experiment_settings = async () => {
    const experiment_settings = await ChromeStorage.get_single("experiment_settings");
    return experiment_settings;
};
ChromeStorage.set_experiment_settings = async (settings) => {
    await chrome.storage.local.set({ experiment_settings: settings });
};


/***/ }),

/***/ "./src/utils/custom/CustomLogger.ts":
/*!******************************************!*\
  !*** ./src/utils/custom/CustomLogger.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CustomLogger": () => (/* binding */ CustomLogger)
/* harmony export */ });
/* harmony import */ var _time_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../time_utils */ "./src/utils/time_utils.ts");

class CustomLogger {
    constructor(prefix, color = "white") {
        this.log = (content) => {
            const prefix = `${this.prefix} | ${(0,_time_utils__WEBPACK_IMPORTED_MODULE_0__.get_local_datetime)(new Date())} |`;
            this.original_logger(`${prefix} %c ${content}`, `color: ${this.color}`);
        };
        this.prefix = prefix;
        this.color = color;
        this.original_logger = console.log;
    }
}


/***/ }),

/***/ "./src/utils/custom/VideoCurtain.ts":
/*!******************************************!*\
  !*** ./src/utils/custom/VideoCurtain.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VideoCurtain": () => (/* binding */ VideoCurtain)
/* harmony export */ });
class VideoCurtain {
    constructor(id, inner_text) {
        this.create_panel = () => {
            const panel = document.createElement("div");
            panel.id = this.id;
            // Styling
            panel.style.width = "100vw";
            panel.style.height = "100vh";
            panel.style.backgroundColor = "#222222";
            panel.style.position = "absolute";
            panel.style.left = "0px";
            panel.style.top = "0px";
            panel.style.display = "flex";
            panel.style.justifyContent = "center";
            panel.style.alignItems = "center";
            panel.style.color = "white";
            panel.style.fontSize = "24px";
            panel.style.zIndex = "11000";
            panel.style.pointerEvents = "none";
            return panel;
        };
        this.reveal = () => {
            const video = document.getElementsByTagName("video")[0];
            const video_div = video.parentElement;
            const video_canvas = document.querySelectorAll("[data-uia='video-canvas']")[0];
            video_canvas.style.willChange = "unset";
            this.element.innerText = this.inner_text;
            video_div.appendChild(this.element);
        };
        this.remove = () => {
            this.element.remove();
        };
        this.id = id;
        this.inner_text = inner_text;
        this.element = this.create_panel();
    }
}


/***/ }),

/***/ "./src/utils/debug_menu_analysis.ts":
/*!******************************************!*\
  !*** ./src/utils/debug_menu_analysis.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extract_buffering_bitrate_audio": () => (/* binding */ extract_buffering_bitrate_audio),
/* harmony export */   "extract_buffering_bitrate_video": () => (/* binding */ extract_buffering_bitrate_video),
/* harmony export */   "extract_buffering_state": () => (/* binding */ extract_buffering_state),
/* harmony export */   "extract_buffering_vmaf": () => (/* binding */ extract_buffering_vmaf),
/* harmony export */   "extract_debug_menu_data": () => (/* binding */ extract_debug_menu_data),
/* harmony export */   "extract_duration": () => (/* binding */ extract_duration),
/* harmony export */   "extract_framerate": () => (/* binding */ extract_framerate),
/* harmony export */   "extract_player_state": () => (/* binding */ extract_player_state),
/* harmony export */   "extract_playing_bitrate_audio": () => (/* binding */ extract_playing_bitrate_audio),
/* harmony export */   "extract_playing_bitrate_video": () => (/* binding */ extract_playing_bitrate_video),
/* harmony export */   "extract_playing_vmaf": () => (/* binding */ extract_playing_vmaf),
/* harmony export */   "extract_position": () => (/* binding */ extract_position),
/* harmony export */   "extract_rendering_state": () => (/* binding */ extract_rendering_state),
/* harmony export */   "extract_resolution": () => (/* binding */ extract_resolution),
/* harmony export */   "extract_segment_position": () => (/* binding */ extract_segment_position),
/* harmony export */   "extract_total_corrupted_frames": () => (/* binding */ extract_total_corrupted_frames),
/* harmony export */   "extract_total_dropped_frames": () => (/* binding */ extract_total_dropped_frames),
/* harmony export */   "extract_total_frames": () => (/* binding */ extract_total_frames),
/* harmony export */   "extract_volume": () => (/* binding */ extract_volume)
/* harmony export */ });
/**
 * Utility method --> extracts useful data from nerds stats (long) string
 * @param {string} regex
 * @param {number} group
 * @param {string} data
 * @returns {object|null}
*/
const get_value = (regex, group, data) => {
    try {
        let value = data.match(regex) ?? null;
        if (value != null) {
            return value[group];
        }
        else {
            return null;
        }
    }
    catch (e) {
        return null;
    }
};
const extract_debug_menu_data = (debug_menu_text, timestamp) => {
    const data = {
        position: extract_position(debug_menu_text),
        volume: extract_volume(debug_menu_text),
        segment_position: extract_segment_position(debug_menu_text),
        player_state: extract_player_state(debug_menu_text),
        buffering_state: extract_buffering_state(debug_menu_text),
        rendering_state: extract_rendering_state(debug_menu_text),
        playing_bitrate_audio: extract_playing_bitrate_audio(debug_menu_text),
        playing_bitrate_video: extract_playing_bitrate_video(debug_menu_text),
        resolution: extract_resolution(debug_menu_text),
        playing_vmaf: extract_playing_vmaf(debug_menu_text),
        buffering_vmaf: extract_buffering_vmaf(debug_menu_text),
        buffering_bitrate_audio: extract_buffering_bitrate_audio(debug_menu_text),
        buffering_bitrate_video: extract_buffering_bitrate_video(debug_menu_text),
        total_frames: extract_total_frames(debug_menu_text),
        total_dropped_frames: extract_total_dropped_frames(debug_menu_text),
        total_corrupted_frames: extract_total_corrupted_frames(debug_menu_text),
        framerate: extract_framerate(debug_menu_text),
        duration: extract_duration(debug_menu_text),
        timestamp: timestamp
    };
    return data;
};
const extract_position = (data) => {
    return get_value("(Position:) ([0-9]+.[0-9]+)", 2, data);
};
const extract_volume = (data) => {
    return get_value("(Volume:) ([0-9]+)%", 2, data);
};
const extract_segment_position = (data) => {
    return get_value("(Segment Position:) ([0-9]+.[0-9]+)", 2, data);
};
const extract_player_state = (data) => {
    return get_value("(Player state: )([a-zA-Z]+)", 2, data);
};
const extract_buffering_state = (data) => {
    return get_value("(Buffering state:) (.+)", 2, data);
};
const extract_rendering_state = (data) => {
    return get_value("(Rendering state:) (.+)", 2, data);
};
const extract_playing_bitrate_audio = (data) => {
    return get_value("Playing bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 1, data);
};
const extract_playing_bitrate_video = (data) => {
    return get_value("Playing bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 2, data);
};
const extract_resolution = (data) => {
    return get_value("([0-9]+x[0-9]+)", 1, data);
};
const extract_playing_vmaf = (data) => {
    return get_value("Playing\/Buffering vmaf: ([0-9]+)\s*\/\s*([0-9]+)", 1, data);
};
const extract_buffering_vmaf = (data) => {
    return get_value("Playing\/Buffering vmaf: ([0-9]+)\s*\/\s*([0-9]+)", 2, data);
};
const extract_buffering_bitrate_audio = (data) => {
    return get_value("Buffering bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 1, data);
};
const extract_buffering_bitrate_video = (data) => {
    return get_value("Buffering bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 2, data);
};
const extract_total_frames = (data) => {
    return get_value("Total Frames:\\s*([0-9]+)", 1, data);
};
const extract_total_dropped_frames = (data) => {
    return get_value("Total Dropped Frames:\\s*([0-9]+)", 1, data);
};
const extract_total_corrupted_frames = (data) => {
    return get_value("Total Corrupted Frames:\\s*([0-9]+)", 1, data);
};
const extract_framerate = (data) => {
    return get_value("Framerate: ([0-9]+.[0-9]+)", 1, data);
};
const extract_duration = (data) => {
    return get_value("(Duration:) ([0-9]+.[0-9]+)", 2, data);
};


/***/ }),

/***/ "./src/utils/http_requests/patch_experiment_ended.ts":
/*!***********************************************************!*\
  !*** ./src/utils/http_requests/patch_experiment_ended.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "patch_experiment_ended": () => (/* binding */ patch_experiment_ended)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../custom/ChromeStorage */ "./src/utils/custom/ChromeStorage.ts");
/* harmony import */ var _time_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../time_utils */ "./src/utils/time_utils.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config */ "./src/utils/http_requests/config.js");




const patch_experiment_ended = async () => {
    try {
        const variables = await _custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_1__.ChromeStorage.get_experiment_variables();
        const data = {
            ended: (0,_time_utils__WEBPACK_IMPORTED_MODULE_2__.get_local_datetime)(new Date()),
            experiment_id: variables.database_experiment_id
        };
        const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().patch(_config__WEBPACK_IMPORTED_MODULE_3__.backend_urls.experiment, data);
        console.log(response.data?.msg);
    }
    catch (err) {
        console.log(err);
    }
};


/***/ }),

/***/ "./src/utils/http_requests/patch_video_ended.ts":
/*!******************************************************!*\
  !*** ./src/utils/http_requests/patch_video_ended.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "patch_video_ended": () => (/* binding */ patch_video_ended)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../custom/ChromeStorage */ "./src/utils/custom/ChromeStorage.ts");
/* harmony import */ var _time_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../time_utils */ "./src/utils/time_utils.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config */ "./src/utils/http_requests/config.js");




const patch_video_ended = async () => {
    try {
        const variables = await _custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_1__.ChromeStorage.get_experiment_variables();
        const data = {
            ended: (0,_time_utils__WEBPACK_IMPORTED_MODULE_2__.get_local_datetime)(new Date()),
            video_id: variables.database_video_id
        };
        const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().patch(_config__WEBPACK_IMPORTED_MODULE_3__.backend_urls.video, data);
        console.log(response.data?.msg);
    }
    catch (err) {
        console.log(err);
    }
};


/***/ }),

/***/ "./src/utils/http_requests/post_custom_event.ts":
/*!******************************************************!*\
  !*** ./src/utils/http_requests/post_custom_event.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "post_custom_event": () => (/* binding */ post_custom_event)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./src/utils/http_requests/config.js");


const post_custom_event = async (data) => {
    try {
        const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().post(_config__WEBPACK_IMPORTED_MODULE_1__.backend_urls.event, data);
    }
    catch (err) {
        console.log(err);
    }
};


/***/ }),

/***/ "./src/utils/http_requests/post_playback_data.ts":
/*!*******************************************************!*\
  !*** ./src/utils/http_requests/post_playback_data.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "post_playback_data": () => (/* binding */ post_playback_data)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../custom/ChromeStorage */ "./src/utils/custom/ChromeStorage.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config */ "./src/utils/http_requests/config.js");



const post_playback_data = async (playback_data, archive) => {
    const { database_video_id } = await _custom_ChromeStorage__WEBPACK_IMPORTED_MODULE_1__.ChromeStorage.get_experiment_variables();
    const data = {
        playback_data: playback_data,
        archive: archive,
        video_id: database_video_id
    };
    try {
        const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().post(_config__WEBPACK_IMPORTED_MODULE_2__.backend_urls.playback_data, data);
        if (response.status === 201) {
            console.log("Playback data submitted successfully");
        }
    }
    catch (err) {
        console.log(err);
    }
};


/***/ }),

/***/ "./src/utils/netflix/NetflixBitrateMenu.ts":
/*!*************************************************!*\
  !*** ./src/utils/netflix/NetflixBitrateMenu.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetflixBitrateMenu": () => (/* binding */ NetflixBitrateMenu)
/* harmony export */ });
/* harmony import */ var _custom_CustomLogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../custom/CustomLogger */ "./src/utils/custom/CustomLogger.ts");
var _a;

class NetflixBitrateMenu {
}
_a = NetflixBitrateMenu;
NetflixBitrateMenu.logger = new _custom_CustomLogger__WEBPACK_IMPORTED_MODULE_0__.CustomLogger("[NetflixBitrateMenu]");
/**
 * Blocking method!
 * Invokes Netflix's bitrate menu by calling repeatedly keybord event dispatch method
 * Resolves when bitrate menu is invoked
 * @returns {void}
*/
NetflixBitrateMenu.invoke = async () => {
    let interval;
    let attempt = 1;
    return new Promise(resolve => {
        interval = setInterval(() => {
            NetflixBitrateMenu.logger.log(`Invoking bitrate menu. Attempt: ${attempt}`);
            NetflixBitrateMenu.dispatch_invoker_event();
            if (NetflixBitrateMenu.is_invoked() === true) {
                clearInterval(interval);
                resolve();
            }
            attempt += 1;
        }, 500);
    });
};
/**
 *  Method simulates keyboard keys click in order to invoke bitrate menu programatically
*/
NetflixBitrateMenu.dispatch_invoker_event = () => {
    NetflixBitrateMenu.logger.log("Dispatching keyboard event");
    document.dispatchEvent(new KeyboardEvent("keydown", {
        key: "S",
        altKey: true,
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
        code: "KeyS",
        which: 83,
        cancelable: true,
        composed: true,
        keyCode: 83
    }));
};
/**
 * Method closes all invoked (opened) bitrate menus
 * Particularly useful at the end of an episode when bitrate menu can be doubled
 * @returns {void}
*/
NetflixBitrateMenu.close_invoked = () => {
    const player_streams = Array.from(document.getElementsByClassName("player-streams"));
    if (player_streams.length > 0) {
        for (const player_stream of player_streams) {
            NetflixBitrateMenu.logger.log("Closing remaining bitrate menu");
            const override_button = Array.from(player_stream.querySelectorAll("button")).filter(btn => btn.innerText === "Override")[0];
            override_button.click();
        }
    }
};
/**
 * Method checks if bitrate menu is invoked
 * @returns {boolean}
*/
NetflixBitrateMenu.is_invoked = () => {
    const player_streams = Array.from(document.getElementsByClassName("player-streams"));
    if (player_streams.length > 0 && player_streams[0] != null) {
        NetflixBitrateMenu.logger.log("Bitrate menu invoked");
        return true;
    }
    else {
        NetflixBitrateMenu.logger.log("Bitrate menu not invoked");
        return false;
    }
};
/**
 * Blocking method.
 * Resolves when particular html elements of bitrate menu are extracted
 * @returns {Promise<T_BITRATE_MENU_ELEMENTS>}
*/
NetflixBitrateMenu.get_html_elements = async () => {
    NetflixBitrateMenu.close_invoked();
    await NetflixBitrateMenu.invoke();
    // Note that this method should always return elements from 0-indexed player-streams container.
    // At the end of video there will be TWO bitrate menus invoked (second -  1-indexed is for the next video).
    const player_streams = document.getElementsByClassName("player-streams")[0]; // 0-indexed, menu for current video
    const container = player_streams.childNodes[0];
    const bitrate_menu = container.childNodes[1]; // contains bitrate select and options
    const select = bitrate_menu.childNodes[1];
    const options = Array.from(select.childNodes);
    const bitrate_values = options.map(option => Number(option.value));
    const reset_button = Array.from(player_streams.querySelectorAll("button")).filter(btn => btn.innerText === "Reset")[0];
    const override_button = Array.from(player_streams.querySelectorAll("button")).filter(btn => btn.innerText === "Override")[0];
    //const audio_menu = container.childNodes[0] // - audio bitrate menu
    //const cdn_menu = container.childNodes[2]  // - cdn menu
    return {
        container: container,
        override_button: override_button,
        reset_button: reset_button,
        select: select,
        options: options,
        bitrate_values: bitrate_values
    };
};
/**
 * Blocking method.
 * Waits for bitrate menu to be invoked and returns available bitrates.
 * @returns {Array<number>}
*/
NetflixBitrateMenu.get_available_bitrates = async () => {
    const { bitrate_values } = await NetflixBitrateMenu.get_html_elements();
    // Closing remaining bitrate menus
    _a.close_invoked();
    return bitrate_values;
};
/**
 * Blocking method.
 * Sets new bitrate in bitrate menu
 * @param value
*/
NetflixBitrateMenu.set_bitrate = async (value) => {
    const { select, override_button } = await NetflixBitrateMenu.get_html_elements();
    select.value = value.toString();
    override_button.click();
    // Closing remaining menus after bitrate is set
    _a.close_invoked();
};


/***/ }),

/***/ "./src/utils/netflix/NetflixDebugMenu.ts":
/*!***********************************************!*\
  !*** ./src/utils/netflix/NetflixDebugMenu.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetflixDebugMenu": () => (/* binding */ NetflixDebugMenu)
/* harmony export */ });
/* harmony import */ var _custom_CustomLogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../custom/CustomLogger */ "./src/utils/custom/CustomLogger.ts");
var _a;

class NetflixDebugMenu {
}
_a = NetflixDebugMenu;
NetflixDebugMenu.logger = new _custom_CustomLogger__WEBPACK_IMPORTED_MODULE_0__.CustomLogger("[NetflixDebugMenu]");
/**
 * Blocking method
 * @returns
 */
NetflixDebugMenu.invoke = () => {
    let interval;
    let attempt = 1;
    return new Promise(resolve => {
        interval = setInterval(() => {
            NetflixDebugMenu.logger.log(`Invoking bitrate menu. Attempt: ${attempt}`);
            NetflixDebugMenu.dispatch_invoker_event();
            if (NetflixDebugMenu.is_invoked() === true) {
                clearInterval(interval);
                resolve();
            }
            attempt += 1;
        }, 500);
    });
};
NetflixDebugMenu.dispatch_invoker_event = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", {
        key: "D",
        altKey: true,
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
        code: "KeyD",
        which: 68,
        cancelable: true,
        composed: true,
        keyCode: 68
    }));
};
/**
 * Non-blocking method. Returns true if DebugMenu is invoked or false if it is not.
 * @returns verdict
*/
NetflixDebugMenu.is_invoked = () => {
    const element = document.getElementsByTagName("textarea")[0];
    const outer_element = document.getElementsByClassName("player-info")[0]; // This is the element that contains X (exit) button
    if ([element, outer_element].some(elem => elem == null)) {
        NetflixDebugMenu.logger.log("Not invoked!");
        return false;
    }
    else {
        NetflixDebugMenu.logger.log("Invoked");
        outer_element.style.pointerEvents = "none"; // <-- makes element unclickable
        element.style.pointerEvents = "none"; // <-- makes element unclickable
        return true;
    }
};
/**
 * Blocking method. Returns HTMLTextAreaElement of Netflix Debug Menu consisting
 * information on video player state.
 * If debug menu is not invoked, method calls invoking method and waits for the element to be returned
 * @returns {element<HTMLTextAreaElement>}
*/
NetflixDebugMenu.get_html_element = async () => {
    if (NetflixDebugMenu.is_invoked() === false) {
        await NetflixDebugMenu.invoke();
    }
    const element = document.getElementsByTagName("textarea")[0];
    return element;
};


/***/ }),

/***/ "./src/utils/netflix/NetflixPlayerAPI.ts":
/*!***********************************************!*\
  !*** ./src/utils/netflix/NetflixPlayerAPI.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetflixPlayerAPI": () => (/* binding */ NetflixPlayerAPI)
/* harmony export */ });
/* harmony import */ var _custom_CustomLogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../custom/CustomLogger */ "./src/utils/custom/CustomLogger.ts");
/* harmony import */ var _config_netflix_player_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/netflix_player_api */ "./src/config/netflix_player_api.ts");
var _a;


class NetflixPlayerAPI {
}
_a = NetflixPlayerAPI;
NetflixPlayerAPI.logger = new _custom_CustomLogger__WEBPACK_IMPORTED_MODULE_0__.CustomLogger("[NetflixPlaybackController]");
NetflixPlayerAPI.seek = (position) => {
    const seek_element = _config_netflix_player_api__WEBPACK_IMPORTED_MODULE_1__.netflix_api_elements.seek.get();
    seek_element?.setAttribute(_config_netflix_player_api__WEBPACK_IMPORTED_MODULE_1__.netflix_api_elements.seek.attribute, position.toString());
    seek_element?.click();
};
NetflixPlayerAPI.get_current_time = () => {
    const current_time_element = _config_netflix_player_api__WEBPACK_IMPORTED_MODULE_1__.netflix_api_elements.current_time.get();
    current_time_element?.click();
    return Number(current_time_element?.getAttribute(_config_netflix_player_api__WEBPACK_IMPORTED_MODULE_1__.netflix_api_elements.current_time.attribute));
};
NetflixPlayerAPI.get_video_duration = () => {
    const duration_element = _config_netflix_player_api__WEBPACK_IMPORTED_MODULE_1__.netflix_api_elements.duration.get();
    duration_element?.click();
    return Number(duration_element?.getAttribute(_config_netflix_player_api__WEBPACK_IMPORTED_MODULE_1__.netflix_api_elements.duration.attribute));
};
NetflixPlayerAPI.pause_video = () => {
    const video = NetflixPlayerAPI.get_html_video_element();
    if (video != null) {
        video.pause();
    }
};
NetflixPlayerAPI.resume_video = async () => {
    const video = NetflixPlayerAPI.get_html_video_element();
    if (video != null) {
        await video.play();
    }
};
NetflixPlayerAPI.hide_video_player = () => {
    const video = NetflixPlayerAPI.get_html_video_element();
    if (video != null) {
        video.style.visibility = "hidden";
        video.style.pointerEvents = "none";
    }
};
NetflixPlayerAPI.reveal_video_player = () => {
    const video = NetflixPlayerAPI.get_html_video_element();
    if (video != null) {
        video.style.visibility = "visible";
        video.style.pointerEvents = "auto";
    }
};
NetflixPlayerAPI.set_video_muted = (muted) => {
    const video = NetflixPlayerAPI.get_html_video_element();
    if (video != null) {
        video.muted = muted;
    }
};
NetflixPlayerAPI.get_html_video_element = () => {
    const video = document.getElementsByTagName("video")[0];
    return video != null ? video : null;
};


/***/ }),

/***/ "./src/utils/time_utils.ts":
/*!*********************************!*\
  !*** ./src/utils/time_utils.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "get_local_datetime": () => (/* binding */ get_local_datetime),
/* harmony export */   "get_local_datetime_and_timezone": () => (/* binding */ get_local_datetime_and_timezone)
/* harmony export */ });
const get_local_datetime = (object) => {
    const year = object.getFullYear();
    const month = (object.getMonth() + 1).toString().padStart(2, "0");
    const day = object.getDate().toString().padStart(2, "0");
    const hours = object.getHours().toString().padStart(2, "0");
    const minutes = object.getMinutes().toString().padStart(2, "0");
    const seconds = object.getSeconds().toString().padStart(2, "0");
    const milliseconds = object.getMilliseconds().toString().padStart(3, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`; // <-- Local datetime in extended ISO format ''YYYY-MM-DDTHH:MM:SS:XXX''
};
const get_local_datetime_and_timezone = (object) => {
    // Get the datetime
    const year = object.getFullYear();
    const month = (object.getMonth() + 1).toString().padStart(2, "0");
    const day = object.getDate().toString().padStart(2, "0");
    const hours = object.getHours().toString().padStart(2, "0");
    const minutes = object.getMinutes().toString().padStart(2, "0");
    const seconds = object.getSeconds().toString().padStart(2, "0");
    const milliseconds = object.getMilliseconds().toString().padStart(3, "0");
    const datetime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    // Get timezone offset in +/- HH:MM format
    const timezone_offset_min = object.getTimezoneOffset();
    const offset_hrs = Math.abs(timezone_offset_min / 60);
    const offset_min = Math.abs(timezone_offset_min % 60);
    if (timezone_offset_min <= 0) {
        const timezone_standard = "+" + offset_hrs.toString().padStart(2, "0") + ":" + offset_min.toString().padStart(2, "0");
        return datetime + timezone_standard;
    }
    else {
        const timezone_standard = "-" + offset_hrs.toString().padStart(2, "0") + ":" + offset_min.toString().padStart(2, "0");
        return datetime + timezone_standard;
    }
};


/***/ }),

/***/ "./src/utils/waiters/wait_for_expected_bitrate_buffering.ts":
/*!******************************************************************!*\
  !*** ./src/utils/waiters/wait_for_expected_bitrate_buffering.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "wait_for_expected_bitrate_buffering": () => (/* binding */ wait_for_expected_bitrate_buffering)
/* harmony export */ });
/* harmony import */ var _netflix_NetflixDebugMenu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../netflix/NetflixDebugMenu */ "./src/utils/netflix/NetflixDebugMenu.ts");
/* harmony import */ var _debug_menu_analysis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../debug_menu_analysis */ "./src/utils/debug_menu_analysis.ts");


/**
 * Blocking function. Waits for expected bitrate to be buffered by Neflix player.
 * @returns {void}
*/
const wait_for_expected_bitrate_buffering = async (expected_bitrate) => {
    const element = await _netflix_NetflixDebugMenu__WEBPACK_IMPORTED_MODULE_0__.NetflixDebugMenu.get_html_element();
    let retry_interval;
    console.log(`Waiting for expected bitrate to be buffered: ${expected_bitrate} kbps`);
    return new Promise(resolve => {
        retry_interval = setInterval(() => {
            const buffering_bitrate = (0,_debug_menu_analysis__WEBPACK_IMPORTED_MODULE_1__.extract_buffering_bitrate_video)(element.value);
            if (Number(buffering_bitrate) === expected_bitrate) {
                clearInterval(retry_interval);
                console.log("Expected bitrate is buffering. Resolving...");
                resolve();
            }
        }, 100);
    });
};


/***/ }),

/***/ "./src/utils/waiters/wait_for_rendering_state_playing.ts":
/*!***************************************************************!*\
  !*** ./src/utils/waiters/wait_for_rendering_state_playing.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "wait_for_rendering_state_playing": () => (/* binding */ wait_for_rendering_state_playing)
/* harmony export */ });
/* harmony import */ var _netflix_NetflixDebugMenu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../netflix/NetflixDebugMenu */ "./src/utils/netflix/NetflixDebugMenu.ts");
/* harmony import */ var _debug_menu_analysis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../debug_menu_analysis */ "./src/utils/debug_menu_analysis.ts");


/**
 * Blocking function. Block code execution until DebugMenu's rendering_state property switches to "Playing"
 * @returns {void}
*/
const wait_for_rendering_state_playing = async () => {
    const element = await _netflix_NetflixDebugMenu__WEBPACK_IMPORTED_MODULE_0__.NetflixDebugMenu.get_html_element();
    let retry_interval;
    console.log("Waiting for rendering state - playing");
    return new Promise(resolve => {
        retry_interval = setInterval(() => {
            const rendering_state = (0,_debug_menu_analysis__WEBPACK_IMPORTED_MODULE_1__.extract_rendering_state)(element.value);
            if (rendering_state?.toLowerCase() === "playing") {
                clearInterval(retry_interval);
                console.log("Rendering state - playing. Resolving...");
                resolve();
            }
        }, 100);
    });
};


/***/ }),

/***/ "./src/utils/waiters/wait_for_video_to_load.ts":
/*!*****************************************************!*\
  !*** ./src/utils/waiters/wait_for_video_to_load.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "wait_for_video_to_load": () => (/* binding */ wait_for_video_to_load)
/* harmony export */ });
/**
 * Function waits for the essential html elements to be loaded and available for manipulation.
 * @returns {Promise<unknown>}
 */
const wait_for_video_to_load = async () => {
    return new Promise((resolve) => {
        let interval;
        interval = setInterval(async () => {
            try {
                const video = document.getElementsByTagName("video")[0];
                const video_canvas = document.querySelectorAll("[data-uia='video-canvas']")[0];
                if (video && video_canvas) {
                    clearInterval(interval); // stop the retrying process - must be first
                    console.log("HTML video element is loaded. Proceeding...");
                    resolve();
                }
                else {
                    console.log("Video element not found! Retrying...");
                }
            }
            catch (err) {
                console.log(err);
            }
        }, 10);
    });
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("content." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("f69e4d5e89866e5a87c7")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "fix-your-netflix-experiment-extension:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"content": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdatefix_your_netflix_experiment_extension"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("./src/pages/Content/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=content.bundle.js.map