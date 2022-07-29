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
})({"e5jiL":[function(require,module,exports) {
var _charts = require("./modules/charts");
// DOM ELEMENTS
const currentReports = document.getElementsByClassName("chart-current-report");
// DELEGATION
// TODO: Develop client side storage or better version for this expensive call / operation
if (currentReports.length !== 0) (0, _charts.populateCharts)(currentReports);

},{"./modules/charts":"7xgLb"}],"7xgLb":[function(require,module,exports) {
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
        for (const div of htmlCollection){
            // eslint-disable-next-line no-await-in-loop
            const { avgCount , ...data } = await genStoreCurrentReport(div.children[0].id);
            chartAvgs += avgCount;
            // eslint-disable-next-line no-undef
            const chart = new Chart(div.children[0], {
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

},{"./apiFetch":"3QNti","@parcel/transformer-js/src/esmodule-helpers.js":"b3Cpx"}],"3QNti":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const apiFetch = async (endpoint, reqType, dataObj)=>{
    // TODO: Remove hardcoded URL, figure out how to get parcel to work with dotenv
    const res = await fetch(`http://localhost:8000/api/v1${endpoint}`, {
        method: reqType,
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(dataObj)
    }).then((response)=>response.json());
    if (res.status === "success") return res;
    throw new Error(res.message);
};
exports.default = apiFetch;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"b3Cpx"}],"b3Cpx":[function(require,module,exports) {
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

},{}]},["e5jiL"], "e5jiL", "parcelRequiree437")

//# sourceMappingURL=sapba.js.map
