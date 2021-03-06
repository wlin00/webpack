var depRelation = [{
        key: "index.js",
        deps: ["a.js","b.js","style.css"],
        code: function(require, module, exports){
          "use strict";

var _a = _interopRequireDefault(require("./a.js"));

var _b = _interopRequireDefault(require("./b.js"));

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 合理的循环引用
// 编写 css-loader ， style-loader 来支持css文件打包成js
console.log(_a["default"].getB());
console.log(_b["default"].getA());
        }
      },{
        key: "a.js",
        deps: ["b.js"],
        code: function(require, module, exports){
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _b = _interopRequireDefault(require("./b.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var a = {
  value: 'a',
  getB: function getB() {
    return _b["default"].value + 'from a.js';
  }
};
var _default = a;
exports["default"] = _default;
        }
      },{
        key: "b.js",
        deps: ["a.js"],
        code: function(require, module, exports){
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _a = _interopRequireDefault(require("./a.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var b = {
  value: 'b',
  getA: function getA() {
    return _a["default"].value + 'from a.js';
  }
};
var _default = b;
exports["default"] = _default;
        }
      },{
        key: "style.css",
        deps: [],
        code: function(require, module, exports){
          "use strict";

var str = "body {\n  color: red;\n}";

if (document) {
  var style = document.createElement('style');
  style.innerHTML = str;
  document.head.appendChild(style);
}
        }
      }];
var modules = {};
execute(depRelation[0].key)

    function execute(key) { // 找到传入key的依赖，运行内部代码
      if (modules[key]) { return modules[key] } // 若模块中有该key，直接返回
      var dependency = depRelation.find((item) => item.key === key)
      if (!dependency) {
        throw new Error(`${key} is not found`)
      }
      var pathToKey = (path) => {
        var dirname = key.substring(0, key.lastIndexOf('/') + 1)
        var projectPath = (dirname + path).replace(/\.\//g, '').replace(/\/\//, '/')
        return projectPath
      }
      var require = (path) => { // 重点：当前处理的文件中，如果有require引入文件，则递归execute来对模块进行递归打包处理
        return execute(pathToKey(path))
      }
      modules[key] = { __esModule: true } // 缓存当前模块
      var module = { exports: modules[key] } // module用于CommonJs的兼容和约定写法
      dependency.code(require, module, module.exports)
      return modules[key]
    }
  