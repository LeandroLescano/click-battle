"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./components/Alerts.tsx":
/*!*******************************!*\
  !*** ./components/Alerts.tsx ***!
  \*******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"requestPassword\": function() { return /* binding */ requestPassword; }\n/* harmony export */ });\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime */ \"./node_modules/regenerator-runtime/runtime.js\");\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sweetalert2 */ \"./node_modules/sweetalert2/dist/sweetalert2.all.js\");\n/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _services_encode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/encode */ \"./services/encode.tsx\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {\n    try {\n        var info = gen[key](arg);\n        var value = info.value;\n    } catch (error) {\n        reject(error);\n        return;\n    }\n    if (info.done) {\n        resolve(value);\n    } else {\n        Promise.resolve(value).then(_next, _throw);\n    }\n}\nfunction _asyncToGenerator(fn) {\n    return function() {\n        var self = this, args = arguments;\n        return new Promise(function(resolve, reject) {\n            var gen = fn.apply(self, args);\n            function _next(value) {\n                asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value);\n            }\n            function _throw(err) {\n                asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err);\n            }\n            _next(undefined);\n        });\n    };\n}\nvar requestPassword = _asyncToGenerator(regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee(password) {\n    return regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_ctx) {\n        while(1)switch(_ctx.prev = _ctx.next){\n            case 0:\n                _ctx.next = 2;\n                return sweetalert2__WEBPACK_IMPORTED_MODULE_1___default().fire({\n                    title: \"Enter the password\",\n                    input: \"password\",\n                    showCancelButton: true,\n                    cancelButtonText: \"Cancel\",\n                    confirmButtonText: \"Enter\",\n                    inputValidator: function(val) {\n                        if (!val) {\n                            return \"Plese enter the password\";\n                        }\n                        return null;\n                    },\n                    showLoaderOnConfirm: true,\n                    preConfirm: function(pass) {\n                        return (0,_services_encode__WEBPACK_IMPORTED_MODULE_2__.sha256)(pass).then(function(hash) {\n                            if (hash !== password) {\n                                sweetalert2__WEBPACK_IMPORTED_MODULE_1___default().showValidationMessage(\"Incorrect password\");\n                                return false;\n                            }\n                            return true;\n                        });\n                    }\n                }).then(function(val) {\n                    return console.log(val);\n                });\n            case 2:\n            case \"end\":\n                return _ctx.stop();\n        }\n    }, _callee);\n}));\n\n\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0FsZXJ0cy50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBOEI7QUFDYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRTNDLEdBQUssQ0FBQ0UsZUFBZSxxRkFBRyxRQUFRLFNBQURDLFFBQWdCLEVBQXVCLENBQUM7Ozs7O3VCQUMvREgsdURBQVMsQ0FBQyxDQUFDO29CQUNmSyxLQUFLLEVBQUUsQ0FBb0I7b0JBQzNCQyxLQUFLLEVBQUUsQ0FBVTtvQkFDakJDLGdCQUFnQixFQUFFLElBQUk7b0JBQ3RCQyxnQkFBZ0IsRUFBRSxDQUFRO29CQUMxQkMsaUJBQWlCLEVBQUUsQ0FBTztvQkFDMUJDLGNBQWMsRUFBRSxRQUFRLENBQVBDLEdBQUcsRUFBSyxDQUFDO3dCQUN4QixFQUFFLEdBQUdBLEdBQUcsRUFBRSxDQUFDOzRCQUNULE1BQU0sQ0FBQyxDQUEwQjt3QkFDbkMsQ0FBQzt3QkFDRCxNQUFNLENBQUMsSUFBSTtvQkFDYixDQUFDO29CQUNEQyxtQkFBbUIsRUFBRSxJQUFJO29CQUN6QkMsVUFBVSxFQUFFLFFBQVEsQ0FBUEMsSUFBSSxFQUFLLENBQUM7d0JBQ3JCLE1BQU0sQ0FBQ2Isd0RBQU0sQ0FBQ2EsSUFBSSxFQUFFQyxJQUFJLENBQUMsUUFBUSxDQUFQQyxJQUFJLEVBQUssQ0FBQzs0QkFDbEMsRUFBRSxFQUFFQSxJQUFJLEtBQUtiLFFBQVEsRUFBRSxDQUFDO2dDQUN0Qkgsd0VBQTBCLENBQUMsQ0FBb0I7Z0NBQy9DLE1BQU0sQ0FBQyxLQUFLOzRCQUNkLENBQUM7NEJBQ0QsTUFBTSxDQUFDLElBQUk7d0JBQ2IsQ0FBQztvQkFDSCxDQUFDO2dCQUNILENBQUMsRUFBRWUsSUFBSSxDQUFDLFFBQVEsQ0FBUEosR0FBRztvQkFBS08sTUFBTSxDQUFOQSxPQUFPLENBQUNDLEdBQUcsQ0FBQ1IsR0FBRzs7Ozs7OztBQUNsQyxDQUFDO0FBRTBCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2NvbXBvbmVudHMvQWxlcnRzLnRzeD8zZjJhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTd2FsIGZyb20gXCJzd2VldGFsZXJ0MlwiO1xyXG5pbXBvcnQgeyBzaGEyNTYgfSBmcm9tIFwiLi4vc2VydmljZXMvZW5jb2RlXCI7XHJcblxyXG5jb25zdCByZXF1ZXN0UGFzc3dvcmQgPSBhc3luYyAocGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gIGF3YWl0IFN3YWwuZmlyZSh7XHJcbiAgICB0aXRsZTogXCJFbnRlciB0aGUgcGFzc3dvcmRcIixcclxuICAgIGlucHV0OiBcInBhc3N3b3JkXCIsXHJcbiAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcclxuICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIkVudGVyXCIsXHJcbiAgICBpbnB1dFZhbGlkYXRvcjogKHZhbCkgPT4ge1xyXG4gICAgICBpZiAoIXZhbCkge1xyXG4gICAgICAgIHJldHVybiBcIlBsZXNlIGVudGVyIHRoZSBwYXNzd29yZFwiO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSxcclxuICAgIHNob3dMb2FkZXJPbkNvbmZpcm06IHRydWUsXHJcbiAgICBwcmVDb25maXJtOiAocGFzcykgPT4ge1xyXG4gICAgICByZXR1cm4gc2hhMjU2KHBhc3MpLnRoZW4oKGhhc2gpID0+IHtcclxuICAgICAgICBpZiAoaGFzaCAhPT0gcGFzc3dvcmQpIHtcclxuICAgICAgICAgIFN3YWwuc2hvd1ZhbGlkYXRpb25NZXNzYWdlKFwiSW5jb3JyZWN0IHBhc3N3b3JkXCIpO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gIH0pLnRoZW4oKHZhbCkgPT4gY29uc29sZS5sb2codmFsKSk7XHJcbn07XHJcblxyXG5leHBvcnQgeyByZXF1ZXN0UGFzc3dvcmQgfTtcclxuIl0sIm5hbWVzIjpbIlN3YWwiLCJzaGEyNTYiLCJyZXF1ZXN0UGFzc3dvcmQiLCJwYXNzd29yZCIsImZpcmUiLCJ0aXRsZSIsImlucHV0Iiwic2hvd0NhbmNlbEJ1dHRvbiIsImNhbmNlbEJ1dHRvblRleHQiLCJjb25maXJtQnV0dG9uVGV4dCIsImlucHV0VmFsaWRhdG9yIiwidmFsIiwic2hvd0xvYWRlck9uQ29uZmlybSIsInByZUNvbmZpcm0iLCJwYXNzIiwidGhlbiIsImhhc2giLCJzaG93VmFsaWRhdGlvbk1lc3NhZ2UiLCJjb25zb2xlIiwibG9nIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/Alerts.tsx\n");

/***/ })

});