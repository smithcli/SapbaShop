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
var _sideNav = require("./modules/sideNav");
var _forms = require("./modules/forms");
/// DOM ELEMENTS ///
const menuBtn = document.getElementById("menu");
const closeMenu = document.getElementById("closeMenu");
const sideNav = document.getElementById("side-nav");
const currentReports = document.getElementsByClassName("chart-current-report");
const editForm = document.querySelector(".btn--edit");
const saveForm = document.querySelector(".btn--save");
const deleteForm = document.querySelector(".btn--delete");
/// DELEGATION ///
if (currentReports.length !== 0) // TODO: Develop client side storage or better version for this expensive call / operation
(0, _charts.populateCharts)(currentReports);
// Side Navigation
if (menuBtn && sideNav) menuBtn.addEventListener("click", (e)=>{
    (0, _sideNav.openNav)(sideNav);
});
if (closeMenu && sideNav) closeMenu.addEventListener("click", (e)=>{
    (0, _sideNav.closeNav)(sideNav);
});
if (editForm) editForm.addEventListener("click", (e)=>{
    (0, _forms.enableForm)(editForm);
});
if (saveForm) saveForm.addEventListener("click", (e)=>{
    const formData = (0, _forms.getFormValues)();
    const { endpoint , reqType  } = (0, _forms.buildFetchValues)();
    (0, _forms.submitForm)(endpoint, reqType, formData);
});
if (deleteForm) deleteForm.addEventListener("click", (e)=>{
    const { endpoint  } = (0, _forms.buildFetchValues)();
    (0, _forms.submitForm)(endpoint, "DELETE");
});

},{"./modules/charts":"7xgLb","./modules/sideNav":"g9ixY","./modules/forms":"ccThb"}],"7xgLb":[function(require,module,exports) {
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
    }).then(async (response)=>{
        var ref;
        // Determine if the response has a body
        const isJson = (ref = response.headers.get("Content-type")) === null || ref === void 0 ? void 0 : ref.includes("application/json");
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

},{}],"g9ixY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "openNav", ()=>openNav);
parcelHelpers.export(exports, "closeNav", ()=>closeNav);
const openNav = (nav)=>{
    nav.style.width = "250px";
};
const closeNav = (nav)=>{
    nav.style.width = "0";
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"b3Cpx"}],"ccThb":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "disableForm", ()=>disableForm);
parcelHelpers.export(exports, "enableForm", ()=>enableForm);
parcelHelpers.export(exports, "getFormValues", ()=>getFormValues);
parcelHelpers.export(exports, "buildFetchValues", ()=>buildFetchValues);
parcelHelpers.export(exports, "submitForm", ()=>submitForm);
/* eslint-disable no-param-reassign */ /* eslint-disable no-restricted-syntax */ var _apiFetch = require("./apiFetch");
var _apiFetchDefault = parcelHelpers.interopDefault(_apiFetch);
var _alerts = require("./alerts");
/// DOM ELEMENTS ///
// Global elements
const fields = document.getElementsByClassName("form__group");
const form = document.getElementsByClassName("form")[0];
const formBtns = document.querySelector(".btn-bar");
// Store elements
const zip = document.getElementById("zip");
const phone = document.getElementById("phone");
/// FORM FUNCTIONS //
// Model specific form functions
// Store Form preparation to submit
const prepareStoreForm = ()=>{
    zip.value = parseInt(zip.value, 10);
    phone.value = parseInt(phone.value.split("-").join(""), 10);
};
const disableForm = (editBtn)=>{
    form.reset();
    for (const el of fields)el.setAttribute("disabled", null);
    editBtn.innerHTML = "Edit";
    formBtns.classList.add("btn--hidden");
};
const enableForm = (editBtn)=>{
    if (editBtn.innerHTML === "Edit") {
        for (const el of fields)el.removeAttribute("disabled");
        editBtn.innerHTML = "Cancel";
        formBtns.classList.remove("btn--hidden");
    } else disableForm(editBtn);
};
const getFormValues = ()=>{
    const obj = {};
    prepareStoreForm();
    const formData = new FormData(form);
    for (const [key, value] of formData)if (key.includes(".")) {
        const [key1, key2] = key.split(".");
        if (!obj[key1]) obj[key1] = {};
        obj[key1][key2] = value;
    } else obj[key] = value;
    return obj;
};
const buildFetchValues = ()=>{
    // In HTML Form the form must have data attributes
    // model = endpoint, and the id of object to modify if PATCH
    const { id , model  } = form.dataset;
    const reqType = form.dataset.id ? "PATCH" : "POST";
    return {
        endpoint: `/${model}/${id}`,
        reqType
    };
};
const submitForm = async (endpoint, req, obj)=>{
    try {
        const res = await (0, _apiFetchDefault.default)(endpoint, req, obj);
        if (res.status === "success" || res.status === 204) {
            const action = req === "DELETE" ? "Deleted" : "Saved";
            (0, _alerts.showAlert)("pass", `${action} successfully!`);
            window.setTimeout(()=>{
                window.location = document.referrer;
            }, 1500);
        }
    } catch (err) {
        (0, _alerts.showAlert)("fail", err);
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"b3Cpx","./apiFetch":"3QNti","./alerts":"9Eacu"}],"9Eacu":[function(require,module,exports) {
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
    window.setTimeout(hideAlert, 5000);
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"b3Cpx"}]},["e5jiL"], "e5jiL", "parcelRequiree437")

//# sourceMappingURL=sapba.js.map
