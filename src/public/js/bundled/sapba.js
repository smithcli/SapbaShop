// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"dyRVe":[function(require,module,exports) {
var _nav = require("./modules/nav");
var _auth = require("./modules/auth");
var _charts = require("./modules/charts");
var _forms = require("./modules/forms");
/// DOM ELEMENTS ///
// Global elements
const menuBtn = document.getElementById("menu");
const closeMenu = document.getElementById("closeMenu");
const sideNav = document.getElementById("side-nav");
const navBar = document.querySelector(".nav-bar");
const editForm = document.querySelector(".btn--edit");
const saveForm = document.querySelectorAll(".btn--save");
const deleteForm = document.querySelectorAll(".btn--delete");
const logoutBtn = document.getElementById("logout");
// Dashboard
const currentReports = document.getElementsByClassName("chart-current-report");
// Product elements
const addRow = document.getElementById("add-row");
const removeRow = document.querySelectorAll(".btn--delete-icon");
// const sizeToggle = document.getElementById('size-toggle');
/// DELEGATION ///
// Side Navigation
if (menuBtn && sideNav) menuBtn.addEventListener("click", (e)=>{
    (0, _nav.openNav)(sideNav);
});
if (closeMenu && sideNav) closeMenu.addEventListener("click", (e)=>{
    (0, _nav.closeNav)(sideNav);
});
// Bar Navigation
if (navBar) navBar.childNodes.forEach((tab, index)=>{
    tab.addEventListener("click", (e)=>{
        (0, _nav.openTab)(tab, index);
    });
});
// Account Actions
if (logoutBtn) logoutBtn.addEventListener("click", (e)=>(0, _auth.logout)());
// Dashboard
// TODO: Develop client side storage or better version for this expensive call / operation
if (currentReports.length !== 0) (0, _charts.populateCharts)(currentReports);
// Global Form Actions
if (editForm) editForm.addEventListener("click", (e)=>{
    e.preventDefault();
    _forms.enableForm(editForm);
});
if (saveForm) saveForm.forEach((btn)=>{
    btn.addEventListener("click", (e)=>{
        e.preventDefault();
        _forms.submitRequest(btn);
    });
});
if (deleteForm) deleteForm.forEach((btn)=>{
    btn.addEventListener("click", (e)=>{
        e.preventDefault();
        _forms.submitRequest(btn);
    });
});
// Product Form Actions
if (addRow) addRow.addEventListener("click", (e)=>{
    _forms.addStoreRow();
});
if (removeRow) removeRow.forEach((row)=>{
    row.addEventListener("click", (e)=>{
        _forms.removeStoreRow(e);
    });
});

},{"./modules/auth":"i5VXA","./modules/charts":"9VAj8","./modules/forms":"c2A13","./modules/nav":"lXYLZ"}],"i5VXA":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "login", ()=>login);
parcelHelpers.export(exports, "logout", ()=>logout);
parcelHelpers.export(exports, "forgotPassword", ()=>forgotPassword);
var _apiFetch = require("./apiFetch");
var _apiFetchDefault = parcelHelpers.interopDefault(_apiFetch);
var _alerts = require("./alerts");
const login = async (email, password)=>{
    try {
        const res = await (0, _apiFetchDefault.default)("/users/login", "POST", {
            email,
            password
        });
        if (res.status === "success") window.location.assign("/dashboard");
    } catch (err) {
        (0, _alerts.showAlert)("fail", err);
    }
};
const logout = async ()=>{
    try {
        const res = await (0, _apiFetchDefault.default)("/users/logout", "GET");
        if (res.status === "success") {
            (0, _alerts.showAlert)("pass", "Logging out");
            window.setTimeout(()=>{
                window.location.assign("/login");
            }, 1000);
        }
    } catch (err) {
        (0, _alerts.showAlert)("fail", `Error: ${err}. Please try again.`);
    }
};
const forgotPassword = async (email)=>{
    try {
        const res = await (0, _apiFetchDefault.default)("/users/forgotPassword", "POST", {
            email
        });
        if (res.status === "success") {
            // TODO: set a modal to allow longer read time and have user press a button.
            (0, _alerts.showAlert)("pass", `Success!, ${res.message}`);
            window.setTimeout(()=>{
                window.location.assign("/login");
            }, 3000);
        }
    } catch (err) {
        (0, _alerts.showAlert)("fail", `Error: ${err}. Please try again.`);
    }
};

},{"./apiFetch":"j5YSQ","./alerts":"aVYC3","@parcel/transformer-js/src/esmodule-helpers.js":"agWT2"}],"j5YSQ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _config = require("dotenv/config");
const apiFetch = async (endpoint, reqType, dataObj)=>{
    // Get api url from configuration file
    const NODE_ENV = "development", SAPBA_API_URL = "http://192.168.0.3:8000/api/v1";
    const url = SAPBA_API_URL || "http://localhost:8000/api/v1";
    const res = await fetch(`${url}${endpoint}`, {
        method: reqType,
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(dataObj),
        // crendentials: 'include' for CORS
        credentials: NODE_ENV === "production" ? "same-origin" : "include"
    }).then(async (response)=>{
        // Determine if the response has a body
        const isJson = response.headers.get("Content-type")?.includes("application/json");
        // If no body return just the response obj
        const data = isJson ? await response.json() : response;
        // For errors returned in the response body reject with message
        if (!response.ok) {
            const error = data && data.message || response.status;
            return Promise.reject(error);
        }
        return data;
    });
    return res;
};
exports.default = apiFetch;

},{"dotenv/config":"aSGrw","@parcel/transformer-js/src/esmodule-helpers.js":"agWT2"}],"aSGrw":[function(require,module,exports) {
var process = require("process");
(function() {
    require("./lib/main").config(Object.assign({}, require("./lib/env-options"), require("./lib/cli-options")(process.argv)));
})();

},{"process":"6jLl6","./lib/main":"4wzv2","./lib/env-options":"fzeLH","./lib/cli-options":"jJSzD"}],"6jLl6":[function(require,module,exports) {
// shim for using process in browser
var process = module.exports = {};
// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
    throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
    throw new Error("clearTimeout has not been defined");
}
(function() {
    try {
        if (typeof setTimeout === "function") cachedSetTimeout = setTimeout;
        else cachedSetTimeout = defaultSetTimout;
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === "function") cachedClearTimeout = clearTimeout;
        else cachedClearTimeout = defaultClearTimeout;
    } catch (e1) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) //normal enviroments in sane situations
    return setTimeout(fun, 0);
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e1) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) //normal enviroments in sane situations
    return clearTimeout(marker);
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e1) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) return;
    draining = false;
    if (currentQueue.length) queue = currentQueue.concat(queue);
    else queueIndex = -1;
    if (queue.length) drainQueue();
}
function drainQueue() {
    if (draining) return;
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len){
        currentQueue = queue;
        queue = [];
        while(++queueIndex < len)if (currentQueue) currentQueue[queueIndex].run();
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) runTimeout(drainQueue);
};
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
process.title = "browser";
process.browser = true;
process.env = {};
process.argv = [];
process.version = ""; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function(name) {
    return [];
};
process.binding = function(name) {
    throw new Error("process.binding is not supported");
};
process.cwd = function() {
    return "/";
};
process.chdir = function(dir) {
    throw new Error("process.chdir is not supported");
};
process.umask = function() {
    return 0;
};

},{}],"4wzv2":[function(require,module,exports) {
var process = require("process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
// Parser src into an Object
function parse(src) {
    const obj = {};
    // Convert buffer to string
    let lines = src.toString();
    // Convert line breaks to same format
    lines = lines.replace(/\r\n?/mg, "\n");
    let match;
    while((match = LINE.exec(lines)) != null){
        const key = match[1];
        // Default undefined or null to empty string
        let value = match[2] || "";
        // Remove whitespace
        value = value.trim();
        // Check if double quoted
        const maybeQuote = value[0];
        // Remove surrounding quotes
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        // Expand newlines if double quoted
        if (maybeQuote === '"') {
            value = value.replace(/\\n/g, "\n");
            value = value.replace(/\\r/g, "\r");
        }
        // Add to object
        obj[key] = value;
    }
    return obj;
}
function _log(message) {
    console.log(`[dotenv][DEBUG] ${message}`);
}
function _resolveHome(envPath) {
    return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
}
// Populates process.env from .env file
function config(options) {
    let dotenvPath = path.resolve(process.cwd(), ".env");
    let encoding = "utf8";
    const debug = Boolean(options && options.debug);
    const override = Boolean(options && options.override);
    if (options) {
        if (options.path != null) dotenvPath = _resolveHome(options.path);
        if (options.encoding != null) encoding = options.encoding;
    }
    try {
        // Specifying an encoding returns a string instead of a buffer
        const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, {
            encoding
        }));
        Object.keys(parsed).forEach(function(key) {
            if (!Object.prototype.hasOwnProperty.call(process.env, key)) parsed[key];
            else {
                if (override === true) parsed[key];
                if (debug) {
                    if (override === true) _log(`"${key}" is already defined in \`process.env\` and WAS overwritten`);
                    else _log(`"${key}" is already defined in \`process.env\` and was NOT overwritten`);
                }
            }
        });
        return {
            parsed
        };
    } catch (e) {
        if (debug) _log(`Failed to load ${dotenvPath} ${e.message}`);
        return {
            error: e
        };
    }
}
const DotenvModule = {
    config,
    parse
};
module.exports.config = DotenvModule.config;
module.exports.parse = DotenvModule.parse;
module.exports = DotenvModule;

},{"process":"6jLl6","fs":"fkPqL","path":"ib7j5","os":"emNcM"}],"fkPqL":[function(require,module,exports) {
"use strict";

},{}],"ib7j5":[function(require,module,exports) {
var process = require("process");
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
"use strict";
function assertPath(path) {
    if (typeof path !== "string") throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
}
// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
    var res = "";
    var lastSegmentLength = 0;
    var lastSlash = -1;
    var dots = 0;
    var code;
    for(var i = 0; i <= path.length; ++i){
        if (i < path.length) code = path.charCodeAt(i);
        else if (code === 47 /*/*/ ) break;
        else code = 47 /*/*/ ;
        if (code === 47 /*/*/ ) {
            if (lastSlash === i - 1 || dots === 1) ;
            else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/  || res.charCodeAt(res.length - 2) !== 46 /*.*/ ) {
                    if (res.length > 2) {
                        var lastSlashIndex = res.lastIndexOf("/");
                        if (lastSlashIndex !== res.length - 1) {
                            if (lastSlashIndex === -1) {
                                res = "";
                                lastSegmentLength = 0;
                            } else {
                                res = res.slice(0, lastSlashIndex);
                                lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                            }
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += "/..";
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += "/" + path.slice(lastSlash + 1, i);
                else res = path.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        } else if (code === 46 /*.*/  && dots !== -1) ++dots;
        else dots = -1;
    }
    return res;
}
function _format(sep, pathObject) {
    var dir = pathObject.dir || pathObject.root;
    var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base;
    if (dir === pathObject.root) return dir + base;
    return dir + sep + base;
}
var posix = {
    // path.resolve([from ...], to)
    resolve: function resolve() {
        var resolvedPath = "";
        var resolvedAbsolute = false;
        var cwd;
        for(var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--){
            var path;
            if (i >= 0) path = arguments[i];
            else {
                if (cwd === undefined) cwd = process.cwd();
                path = cwd;
            }
            assertPath(path);
            // Skip empty entries
            if (path.length === 0) continue;
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/ ;
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        // Normalize the path
        resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
        if (resolvedAbsolute) {
            if (resolvedPath.length > 0) return "/" + resolvedPath;
            else return "/";
        } else if (resolvedPath.length > 0) return resolvedPath;
        else return ".";
    },
    normalize: function normalize(path) {
        assertPath(path);
        if (path.length === 0) return ".";
        var isAbsolute = path.charCodeAt(0) === 47 /*/*/ ;
        var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/ ;
        // Normalize the path
        path = normalizeStringPosix(path, !isAbsolute);
        if (path.length === 0 && !isAbsolute) path = ".";
        if (path.length > 0 && trailingSeparator) path += "/";
        if (isAbsolute) return "/" + path;
        return path;
    },
    isAbsolute: function isAbsolute(path) {
        assertPath(path);
        return path.length > 0 && path.charCodeAt(0) === 47 /*/*/ ;
    },
    join: function join() {
        if (arguments.length === 0) return ".";
        var joined;
        for(var i = 0; i < arguments.length; ++i){
            var arg = arguments[i];
            assertPath(arg);
            if (arg.length > 0) {
                if (joined === undefined) joined = arg;
                else joined += "/" + arg;
            }
        }
        if (joined === undefined) return ".";
        return posix.normalize(joined);
    },
    relative: function relative(from, to) {
        assertPath(from);
        assertPath(to);
        if (from === to) return "";
        from = posix.resolve(from);
        to = posix.resolve(to);
        if (from === to) return "";
        // Trim any leading backslashes
        var fromStart = 1;
        for(; fromStart < from.length; ++fromStart){
            if (from.charCodeAt(fromStart) !== 47 /*/*/ ) break;
        }
        var fromEnd = from.length;
        var fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        var toStart = 1;
        for(; toStart < to.length; ++toStart){
            if (to.charCodeAt(toStart) !== 47 /*/*/ ) break;
        }
        var toEnd = to.length;
        var toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        var length = fromLen < toLen ? fromLen : toLen;
        var lastCommonSep = -1;
        var i = 0;
        for(; i <= length; ++i){
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === 47 /*/*/ ) // We get here if `from` is the exact base path for `to`.
                    // For example: from='/foo/bar'; to='/foo/bar/baz'
                    return to.slice(toStart + i + 1);
                    else if (i === 0) // We get here if `from` is the root
                    // For example: from='/'; to='/foo'
                    return to.slice(toStart + i);
                } else if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === 47 /*/*/ ) // We get here if `to` is the exact base path for `from`.
                    // For example: from='/foo/bar/baz'; to='/foo/bar'
                    lastCommonSep = i;
                    else if (i === 0) // We get here if `to` is the root.
                    // For example: from='/foo'; to='/'
                    lastCommonSep = 0;
                }
                break;
            }
            var fromCode = from.charCodeAt(fromStart + i);
            var toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode) break;
            else if (fromCode === 47 /*/*/ ) lastCommonSep = i;
        }
        var out = "";
        // Generate the relative path based on the path difference between `to`
        // and `from`
        for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i)if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/ ) {
            if (out.length === 0) out += "..";
            else out += "/..";
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
        else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === 47 /*/*/ ) ++toStart;
            return to.slice(toStart);
        }
    },
    _makeLong: function _makeLong(path) {
        return path;
    },
    dirname: function dirname(path) {
        assertPath(path);
        if (path.length === 0) return ".";
        var code = path.charCodeAt(0);
        var hasRoot = code === 47 /*/*/ ;
        var end = -1;
        var matchedSlash = true;
        for(var i = path.length - 1; i >= 1; --i){
            code = path.charCodeAt(i);
            if (code === 47 /*/*/ ) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            } else // We saw the first non-path separator
            matchedSlash = false;
        }
        if (end === -1) return hasRoot ? "/" : ".";
        if (hasRoot && end === 1) return "//";
        return path.slice(0, end);
    },
    basename: function basename(path, ext) {
        if (ext !== undefined && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
        assertPath(path);
        var start = 0;
        var end = -1;
        var matchedSlash = true;
        var i;
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path) return "";
            var extIdx = ext.length - 1;
            var firstNonSlashEnd = -1;
            for(i = path.length - 1; i >= 0; --i){
                var code = path.charCodeAt(i);
                if (code === 47 /*/*/ ) // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                {
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                } else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) // We matched the extension, so mark this as the end of our path
                            // component
                            end = i;
                        } else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end) end = firstNonSlashEnd;
            else if (end === -1) end = path.length;
            return path.slice(start, end);
        } else {
            for(i = path.length - 1; i >= 0; --i){
                if (path.charCodeAt(i) === 47 /*/*/ ) // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                {
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                } else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1) return "";
            return path.slice(start, end);
        }
    },
    extname: function extname(path) {
        assertPath(path);
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
        for(var i = path.length - 1; i >= 0; --i){
            var code = path.charCodeAt(i);
            if (code === 47 /*/*/ ) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === 46 /*.*/ ) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1) startDot = i;
                else if (preDotState !== 1) preDotState = 1;
            } else if (startDot !== -1) // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) return "";
        return path.slice(startDot, end);
    },
    format: function format(pathObject) {
        if (pathObject === null || typeof pathObject !== "object") throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
        return _format("/", pathObject);
    },
    parse: function parse(path) {
        assertPath(path);
        var ret = {
            root: "",
            dir: "",
            base: "",
            ext: "",
            name: ""
        };
        if (path.length === 0) return ret;
        var code = path.charCodeAt(0);
        var isAbsolute = code === 47 /*/*/ ;
        var start;
        if (isAbsolute) {
            ret.root = "/";
            start = 1;
        } else start = 0;
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
        // Get non-dir info
        for(; i >= start; --i){
            code = path.charCodeAt(i);
            if (code === 47 /*/*/ ) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === 46 /*.*/ ) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1) startDot = i;
                else if (preDotState !== 1) preDotState = 1;
            } else if (startDot !== -1) // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            if (end !== -1) {
                if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
                else ret.base = ret.name = path.slice(startPart, end);
            }
        } else {
            if (startPart === 0 && isAbsolute) {
                ret.name = path.slice(1, startDot);
                ret.base = path.slice(1, end);
            } else {
                ret.name = path.slice(startPart, startDot);
                ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
        }
        if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
        else if (isAbsolute) ret.dir = "/";
        return ret;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
};
posix.posix = posix;
module.exports = posix;

},{"process":"6jLl6"}],"emNcM":[function(require,module,exports) {
exports.endianness = function() {
    return "LE";
};
exports.hostname = function() {
    if (typeof location !== "undefined") return location.hostname;
    else return "";
};
exports.loadavg = function() {
    return [];
};
exports.uptime = function() {
    return 0;
};
exports.freemem = function() {
    return Number.MAX_VALUE;
};
exports.totalmem = function() {
    return Number.MAX_VALUE;
};
exports.cpus = function() {
    return [];
};
exports.type = function() {
    return "Browser";
};
exports.release = function() {
    if (typeof navigator !== "undefined") return navigator.appVersion;
    return "";
};
exports.networkInterfaces = exports.getNetworkInterfaces = function() {
    return {};
};
exports.arch = function() {
    return "javascript";
};
exports.platform = function() {
    return "browser";
};
exports.tmpdir = exports.tmpDir = function() {
    return "/tmp";
};
exports.EOL = "\n";
exports.homedir = function() {
    return "/";
};

},{}],"fzeLH":[function(require,module,exports) {
// ../config.js accepts options via environment variables
const options = {};
module.exports = options;

},{}],"jJSzD":[function(require,module,exports) {
const re = /^dotenv_config_(encoding|path|debug|override)=(.+)$/;
module.exports = function optionMatcher(args) {
    return args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) acc[matches[1]] = matches[2];
        return acc;
    }, {});
};

},{}],"agWT2":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"aVYC3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "hideAlert", ()=>hideAlert);
parcelHelpers.export(exports, "showAlert", ()=>showAlert);
const hideAlert = ()=>{
    const alert = document.querySelector(".alert");
    if (alert) alert.parentElement.removeChild(alert);
};
const showAlert = (type, msg, location)=>{
    // eslint-disable-next-line no-param-reassign
    if (!location) location = "body";
    hideAlert();
    const alert = `<div class="alert alert-${type}">${msg}</div>`;
    document.querySelector(location).insertAdjacentHTML("afterbegin", alert);
    window.setTimeout(hideAlert, 3000);
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"agWT2"}],"9VAj8":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "genStoreCurrentReport", ()=>genStoreCurrentReport);
parcelHelpers.export(exports, "populateCharts", ()=>populateCharts);
var _apiFetch = require("./apiFetch");
var _apiFetchDefault = parcelHelpers.interopDefault(_apiFetch);
// TODO: Add support for thai language
// Departments are Fields for Current Report
const departments = [
    "Grocery",
    "Clothing and Accessories",
    "Beauty and Personal Care",
    "Health and Wellness",
    "Household", 
];
// Helper function // To set data point to appropriate Department
const setDepDatapoint = (product)=>{
    const dataArray = [];
    departments.forEach((dep)=>{
        if (product.department.en === dep) dataArray.push(product.count);
        else dataArray.push(null);
    });
    return dataArray;
};
const rand = (min, max)=>Math.floor(Math.random() * (max - min + 1)) + min;
// eslint-disable-next-line arrow-body-style
const randShadeHSLA = (hue, alpha)=>{
    // hue 0 - 360, sat 50-100%, light 30-60%, a 0.0-1.0
    return `hsla(${hue}, ${rand(50, 100)}%, ${rand(30, 60)}%,${alpha})`;
};
const randShadeByDepartment = (dep)=>{
    switch(dep){
        case departments[0]:
            return randShadeHSLA(120, 0.75);
        case departments[1]:
            return randShadeHSLA(30, 0.75);
        case departments[2]:
            return randShadeHSLA(210, 0.75);
        case departments[3]:
            return randShadeHSLA(360, 0.75);
        case departments[4]:
            return randShadeHSLA(270, 0.75);
        default:
            throw new Error("Not a valid department");
    }
};
const genStoreCurrentReport = async (storeID)=>{
    try {
        const res = await (0, _apiFetchDefault.default)(`/products/mgt?store=${storeID}&sort=product.name.en`, "GET");
        const data = {
            avgCount: 0,
            labels: departments
        };
        // Sorted by name for quick ID between stores.
        data.datasets = res.data.products.map((product)=>{
            data.avgCount += product.count;
            let prodName = product.name.en;
            if (product.size) prodName += ` ${product.size}`;
            return {
                label: prodName,
                data: setDepDatapoint(product),
                backgroundColor: [
                    randShadeByDepartment(product.department.en)
                ],
                borderWidth: 0.5
            };
        });
        data.avgCount /= res.data.products.length;
        return data;
    } catch (err) {
        // TODO: Implement better error handle
        console.log(err);
    }
};
const populateCharts = async (htmlCollection)=>{
    try {
        const charts = [];
        let chartAvgs = 0;
        // eslint-disable-next-line no-restricted-syntax
        for (const el of htmlCollection){
            // eslint-disable-next-line no-await-in-loop
            const { avgCount , ...data } = await genStoreCurrentReport(el.children[1].id);
            chartAvgs += avgCount;
            // eslint-disable-next-line no-undef
            const chart = new Chart(el.children[1], {
                type: "bar",
                data,
                options: {
                    datasets: {
                        bar: {
                            skipNull: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
            charts.push(chart);
        }
        chartAvgs = Math.round(chartAvgs / htmlCollection.length);
        charts.forEach((chart)=>{
            // eslint-disable-next-line no-param-reassign
            chart.options.scales.y.max = chartAvgs * 2; // puts most halfway
            chart.update();
        });
    } catch (err) {
        console.log(err);
    }
};
exports.default = populateCharts;

},{"./apiFetch":"j5YSQ","@parcel/transformer-js/src/esmodule-helpers.js":"agWT2"}],"c2A13":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "removeStoreRow", ()=>removeStoreRow);
parcelHelpers.export(exports, "addStoreRow", ()=>addStoreRow);
parcelHelpers.export(exports, "disableForm", ()=>disableForm);
parcelHelpers.export(exports, "enableForm", ()=>enableForm);
parcelHelpers.export(exports, "submitRequest", ()=>submitRequest);
/* eslint-disable no-param-reassign */ /* eslint-disable no-restricted-syntax */ var _apiFetch = require("./apiFetch");
var _apiFetchDefault = parcelHelpers.interopDefault(_apiFetch);
var _alerts = require("./alerts");
/// DOM ELEMENTS ///
// Global elements
const fields = document.getElementsByClassName("form__group");
const hiddenFeatures = document.getElementsByClassName("hidden");
const cancel = document.createElement("img");
cancel.setAttribute("src", "/img/icons/icons8-close-window-48.png");
cancel.setAttribute("alt", "Cancel editing button");
const edit = document.createElement("img");
edit.setAttribute("src", "/img/icons/icons8-edit-48.png");
edit.setAttribute("alt", "Pencil as an edit button");
// Store elements
const zip = document.getElementById("zip");
const phone = document.getElementById("phone");
// User elements
const active = document.getElementById("active");
// Product elements
const productTable = document.getElementById("product-table");
const tableRow = document.getElementById("hidden-add");
const deletedRow = []; // Holds row that contains document data to be removed
const newRows = []; // Holds rows that are to add new docs
/// FORM FUNCTIONS //
// Model specific form functions
// Store Form Functions
// Store Form preparation to submit
const prepareStoreForm = ()=>{
    zip.value = parseInt(zip.value, 10);
    phone.value = parseInt(phone.value.split("-").join(""), 10);
};
// User Form Functions
// Check for active selection, checkbox unchecked is not added to formData
const prepareUserObj = (obj)=>{
    if (active && !active.checked) obj.active = false;
};
// Product Form Functions
// Pull out the fields common to all the product documents
const extractCommonProductData = (productForm)=>{
    const data = new FormData(productForm);
    data.delete("store");
    data.delete("size");
    data.delete("price");
    data.delete("count");
    return data;
};
const extractProductData = (productForm)=>{
    const data = new FormData(productForm);
    data.delete("name.en");
    data.delete("name.th");
    data.delete("description.en");
    data.delete("description.th");
    data.delete("department.en");
    data.delete("unit.en");
    data.delete("unit.th");
    return data;
};
const removeStoreRow = (e)=>{
    let el = e.target;
    for(let i = 0; i < 5; i++)if (e.target.classList.contains("display")) {
        deletedRow.push(el); // Store row in array for later use to reset or api call.
        el.style.display = "none"; // hide row items
        el = el.previousSibling; // move to next item
    } else {
        el = el.previousSibling; // move to next before deleteing
        el.nextSibling.remove();
    }
};
const addStoreRow = ()=>{
    const newRow = tableRow.cloneNode(true);
    const rowNum = productTable.childNodes.length / 5;
    newRow.childNodes.forEach((child)=>{
        child.id += `${rowNum}`;
    });
    newRow.childNodes.item(4).addEventListener("click", (e)=>removeStoreRow(e));
    newRows.push(...newRow.childNodes); // Store row in array for later use to reset or api call.
    productTable.append(...newRow.childNodes);
};
const disableForm = (editBtn)=>{
    editBtn.form.reset();
    for (const el of fields)el.setAttribute("disabled", null);
    for (const el1 of hiddenFeatures){
        el1.style.visibility = "hidden";
        if (!el1.classList.contains("display")) el1.style.display = "none";
    }
    if (deletedRow || newRows) {
        deletedRow.forEach((el)=>{
            el.style.display = "block";
        });
        newRows.forEach((el)=>{
            el.remove();
        });
    }
    editBtn.replaceChild(edit, editBtn.lastChild);
    editBtn.classList.remove("btn--close");
};
const enableForm = (editBtn)=>{
    // TODO: loops are slow implement better solution for hiding form elements
    if (!editBtn.classList.contains("btn--close")) {
        for (const el of fields)el.removeAttribute("disabled");
        for (const el1 of hiddenFeatures){
            el1.style.visibility = "visible";
            el1.style.display = el1.classList.contains("grid") ? "grid" : "block";
        }
        editBtn.replaceChild(cancel, editBtn.lastChild);
        editBtn.classList.add("btn--close");
    } else disableForm(editBtn);
};
/// Submitting Form Functions ///
// Build object model from FormData object
const buildObj = (formData)=>{
    const obj = {};
    for (const [key, value] of formData)if (key.includes(".")) {
        const [key1, key2] = key.split(".");
        if (!obj[key1]) obj[key1] = {};
        obj[key1][key2] = value;
    } else obj[key] = value;
    return obj;
};
// Product form is different as it contains multiple objects / documents in one page.
const getProductValues = (form)=>{
    const { model , route  } = form.dataset;
    const ids = route ? JSON.parse(route) : [];
    const productValues = []; // will return all objects with reqType and endpoint embedded.
    // 1) parse deletedRows, get index of deleted
    const toDelete = []; // holds row index of rows to be deleted
    deletedRow.forEach((el, i)=>{
        if (i % 5 === 0) toDelete.push(el.id);
    });
    toDelete.forEach((i)=>{
        productValues.push({
            reqType: "DELETE",
            endpoint: `/${model}/${ids[i]}`
        });
    });
    // 2) Parse common lines from form to make obj base.
    const objBase = buildObj(extractCommonProductData(form));
    // 3) filter out the common form data
    const formData = extractProductData(form);
    // track object count, starts at -1 to keep with index number as its incremented at beginning.
    let p = -1;
    let obj; // needed to hold outside the loop
    const totalRows = formData.getAll("store").length - 1; // discard last row, it is a template.
    for (const [key, value] of formData){
        // count table rows, will make first row 0.
        if (key === "store") p += 1;
        if (p === totalRows) break; // stop at last valid row, last one is the template.
        if (toDelete.includes(p.toString())) continue; // don't process rows marked to delete.
        // Building objects with body starts here
        if (key === "store") obj = {};
        obj[key] = value;
        // finish object build and push at end of row, patch/post is determined by ids
        if (key === "count" && p <= ids.length - 1) {
            obj = Object.assign(obj, objBase);
            productValues.push({
                reqType: "PATCH",
                endpoint: `/${model}/${ids[p]}`,
                obj
            });
        } else if (key === "count" && p > ids.length - 1) {
            obj = Object.assign(obj, objBase);
            productValues.push({
                reqType: "POST",
                endpoint: `/${model}`,
                obj
            });
        }
    }
    return productValues;
};
// Dynamically build fetch req return as object
// Buttons will determine if 'DELETE' req type
const buildFetchValues = (model, route)=>{
    // In HTML Form the form must have data attributes
    // model = endpoint, and the id of object to modify if PATCH
    const reqType = route ? "PATCH" : "POST";
    const endpoint = route ? `/${model}/${route}` : `/${model}`;
    return {
        endpoint,
        reqType
    };
};
const buildSaveRequest = (form)=>{
    const { model , route  } = form.dataset;
    if (model === "products") return getProductValues(form);
    if (model === "stores") prepareStoreForm(form); // befor object build
    const obj = buildObj(new FormData(form));
    if (model === "users") prepareUserObj(obj); // after object build
    const { endpoint , reqType  } = buildFetchValues(model, route);
    return {
        reqType,
        endpoint,
        obj
    };
};
const buildDeleteRequest = (form)=>{
    const { model , route  } = form.dataset;
    if (model === "products") {
        const ids = JSON.parse(route);
        return ids.map((prodId)=>({
                endpoint: `/${model}/${prodId}`,
                reqType: "DELETE"
            }));
    }
    return {
        endpoint: `/${model}/${route}`,
        reqType: "DELETE"
    };
};
const submitRequest = async (btn)=>{
    const formRequest = btn.classList.contains("btn--save") ? buildSaveRequest(btn.form) : buildDeleteRequest(btn.form);
    if (!Array.isArray(formRequest)) try {
        const { endpoint , reqType , obj  } = formRequest;
        const res = await (0, _apiFetchDefault.default)(endpoint, reqType, obj);
        if (res.status === "success" || res.status === 204) {
            const action = reqType === "DELETE" ? "Deleted" : "Saved";
            (0, _alerts.showAlert)("pass", `${action} successfully!`);
            if (reqType === "DELETE" && endpoint === "/users/me") window.setTimeout(()=>{
                window.location.assign("/login");
            }, 1000);
            else if (reqType === "DELETE" || reqType === "POST") window.setTimeout(()=>{
                window.location = document.referrer;
            }, 1000);
            else window.setTimeout(()=>{
                window.location.reload();
            }, 1000);
        }
    } catch (err) {
        (0, _alerts.showAlert)("fail", err);
    }
    else try {
        const apiCalls = [];
        for (const doc of formRequest){
            const { endpoint: endpoint1 , reqType: reqType1 , obj: obj1  } = doc;
            apiCalls.push((0, _apiFetchDefault.default)(endpoint1, reqType1, obj1));
        }
        const res1 = await Promise.all(apiCalls);
        if (res1[0].status === "success" || res1[0].status === 204) {
            const action1 = btn.classList.contains("btn--delete") ? "Deleted" : "Saved";
            (0, _alerts.showAlert)("pass", `${action1} successfully!`);
            window.setTimeout(()=>{
                window.location = document.referrer;
            }, 1500);
        }
    } catch (err1) {
        (0, _alerts.showAlert)("fail", err1);
    }
};

},{"./apiFetch":"j5YSQ","./alerts":"aVYC3","@parcel/transformer-js/src/esmodule-helpers.js":"agWT2"}],"lXYLZ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "openNav", ()=>openNav);
parcelHelpers.export(exports, "closeNav", ()=>closeNav);
parcelHelpers.export(exports, "openTab", ()=>openTab);
const openNav = (nav)=>{
    nav.style.width = "250px";
};
const closeNav = (nav)=>{
    nav.style.width = "0";
};
const openTab = (tab, tabIndex)=>{
    const navBarTabs = document.getElementsByClassName("nav-bar-tab");
    const prevSelected = document.querySelector(".nav-bar__item--selected");
    prevSelected.classList.remove("nav-bar__item--selected");
    tab.classList.add("nav-bar__item--selected");
    for(let i = 0; i < navBarTabs.length; i++){
        const el = navBarTabs[i];
        if (i !== tabIndex && !el.classList.contains("hidden")) el.classList.add("hidden");
        else if (i === tabIndex) el.classList.remove("hidden");
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"agWT2"}]},["dyRVe"], "dyRVe", "parcelRequiree437")

//# sourceMappingURL=sapba.js.map
