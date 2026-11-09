#!/usr/bin/env node
// -*- coding: utf-8 -*-

import { basename as __WEBPACK_EXTERNAL_MODULE_path_basename__, dirname as __WEBPACK_EXTERNAL_MODULE_path_dirname__, join as __WEBPACK_EXTERNAL_MODULE_path_join__, posix as __WEBPACK_EXTERNAL_MODULE_path_posix__, relative as __WEBPACK_EXTERNAL_MODULE_path_relative__, resolve as __WEBPACK_EXTERNAL_MODULE_path_resolve__, sep as __WEBPACK_EXTERNAL_MODULE_path_sep__ } from "path";
import { parseArgs as __WEBPACK_EXTERNAL_MODULE_util_parseArgs__, promisify as __WEBPACK_EXTERNAL_MODULE_util_promisify__ } from "util";
import { createCipheriv as __WEBPACK_EXTERNAL_MODULE_crypto_createCipheriv__, createDecipheriv as __WEBPACK_EXTERNAL_MODULE_crypto_createDecipheriv__, createHash as __WEBPACK_EXTERNAL_MODULE_crypto_createHash__, hkdfSync as __WEBPACK_EXTERNAL_MODULE_crypto_hkdfSync__, randomBytes as __WEBPACK_EXTERNAL_MODULE_crypto_randomBytes__, scrypt as __WEBPACK_EXTERNAL_MODULE_crypto_scrypt__ } from "crypto";
import { access as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_access__, chmod as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_chmod__, cp as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_cp__, lstat as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_lstat__, mkdir as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__, open as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_open__, readFile as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__, readdir as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readdir__, readlink as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readlink__, rename as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rename__, rm as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__, rmdir as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rmdir__, stat as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_stat__, symlink as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_symlink__, utimes as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_utimes__, writeFile as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_writeFile__ } from "fs/promises";
import { homedir as __WEBPACK_EXTERNAL_MODULE_os_homedir__, hostname as __WEBPACK_EXTERNAL_MODULE_os_hostname__, userInfo as __WEBPACK_EXTERNAL_MODULE_os_userInfo__ } from "os";
import { spawn as __WEBPACK_EXTERNAL_MODULE_child_process_spawn__ } from "child_process";
import { createWriteStream as __WEBPACK_EXTERNAL_MODULE_fs_createWriteStream__, watch as __WEBPACK_EXTERNAL_MODULE_fs_watch__ } from "fs";
import { Readable as __WEBPACK_EXTERNAL_MODULE_stream_Readable__ } from "stream";
import { pipeline as __WEBPACK_EXTERNAL_MODULE_stream_promises_4e08051e_pipeline__ } from "stream/promises";
/******/ var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var NATIVE_BIND = __webpack_require__(3);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),
/* 1 */
/***/ ((module) => {


module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),
/* 2 */
/***/ ((module) => {


// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(1);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = function () { /* empty */ }.bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isNullOrUndefined = __webpack_require__(5);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),
/* 5 */
/***/ ((module) => {


// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),
/* 6 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var trunc = __webpack_require__(16);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),
/* 7 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(0);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.1.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),
/* 8 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(0);
var fails = __webpack_require__(1);
var classof = __webpack_require__(9);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),
/* 9 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(0);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),
/* 10 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(0);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),
/* 11 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aCallable = __webpack_require__(12);
var isNullOrUndefined = __webpack_require__(5);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),
/* 12 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isCallable = __webpack_require__(2);
var tryToString = __webpack_require__(13);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),
/* 13 */
/***/ ((module) => {


var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),
/* 14 */
/***/ ((module) => {


module.exports = false;


/***/ }),
/* 15 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var requireObjectCoercible = __webpack_require__(4);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),
/* 16 */
/***/ ((module) => {


var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),
/* 17 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toIntegerOrInfinity = __webpack_require__(6);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),
/* 18 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(1);
var isCallable = __webpack_require__(2);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),
/* 19 */
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var _cli_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module gocryptfs-standalone *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
// endregion
process.exitCode=await (0,_cli_js__WEBPACK_IMPORTED_MODULE_0__/* .run */ .eF)(process.argv.slice(2));
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  eF: () => (/* binding */ run)
});

// UNUSED EXPORTS: EXIT_CODES, USAGE, defaultOutput, describeAction, findOverlappingPairs, isNested

// MODULE: ./node_modules/core-js/internals/add-to-unscopables.js
var add_to_unscopables_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var wellKnownSymbol = (well_known_symbol_namespaceFn());
var create = (object_create_namespaceFn());
var defineProperty = (object_define_property_namespaceFn().f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] === undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

});

// MODULE: ./node_modules/core-js/internals/an-object.js
var an_object_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var isObject = (is_object_namespaceFn());

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};

});

// MODULE: ./node_modules/core-js/internals/array-includes.js
var array_includes_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var toIndexedObject = (to_indexed_object_namespaceFn());
var toAbsoluteIndex = (to_absolute_index_namespaceFn());
var lengthOfArrayLike = (length_of_array_like_namespaceFn());

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  m: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  q: createMethod(false)
};

});

// MODULE: ./node_modules/core-js/internals/copy-constructor-properties.js
var copy_constructor_properties_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var hasOwn = (has_own_property_namespaceFn());
var ownKeys = (own_keys_namespaceFn());
var getOwnPropertyDescriptorModule = (object_get_own_property_descriptor_namespaceFn());
var definePropertyModule = (object_define_property_namespaceFn());

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

});

// MODULE: ./node_modules/core-js/internals/create-non-enumerable-property.js
var create_non_enumerable_property_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var DESCRIPTORS = (descriptors_namespaceFn());
var definePropertyModule = (object_define_property_namespaceFn());
var createPropertyDescriptor = (create_property_descriptor_namespaceFn());

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

});

// MODULE: ./node_modules/core-js/internals/create-property-descriptor.js
var create_property_descriptor_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

});

// MODULE: ./node_modules/core-js/internals/define-built-in.js
var define_built_in_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var isCallable = (is_callable_namespaceFn());
var definePropertyModule = (object_define_property_namespaceFn());
var makeBuiltIn = (make_built_in_namespaceFn());
var defineGlobalProperty = (define_global_property_namespaceFn());

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};

});

// MODULE: ./node_modules/core-js/internals/define-global-property.js
var define_global_property_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var globalThis = (global_this_namespaceFn());

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis[key] = value;
  } return value;
};

});

// MODULE: ./node_modules/core-js/internals/descriptors.js
var descriptors_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var fails = (fails_namespaceFn());

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});

});

// MODULE: ./node_modules/core-js/internals/document-create-element.js
var document_create_element_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var globalThis = (global_this_namespaceFn());
var isObject = (is_object_namespaceFn());

var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

});

// MODULE: ./node_modules/core-js/internals/enum-bug-keys.js
var enum_bug_keys_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

});

// MODULE: ./node_modules/core-js/internals/environment-user-agent.js
var environment_user_agent_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var globalThis = (global_this_namespaceFn());

var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;

module.exports = userAgent ? String(userAgent) : '';

});

// MODULE: ./node_modules/core-js/internals/environment-v8-version.js
var environment_v8_version_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var globalThis = (global_this_namespaceFn());
var userAgent = (environment_user_agent_namespaceFn());

var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;

});

// MODULE: ./node_modules/core-js/internals/export.js
var export_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var globalThis = (global_this_namespaceFn());
var getOwnPropertyDescriptor = (object_get_own_property_descriptor_namespaceFn().f);
var createNonEnumerableProperty = (create_non_enumerable_property_namespaceFn());
var defineBuiltIn = (define_built_in_namespaceFn());
var defineGlobalProperty = (define_global_property_namespaceFn());
var copyConstructorProperties = (copy_constructor_properties_namespaceFn());
var isForced = (is_forced_namespaceFn());

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = globalThis;
  } else if (STATIC) {
    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = globalThis[TARGET] && globalThis[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/fails.js
var fails_namespaceFn = () => {
	return __webpack_require__(1);
};

// EXTERNAL MODULE: ./node_modules/core-js/internals/function-bind-native.js
var function_bind_native_namespaceFn = () => {
	return __webpack_require__(3);
};

// MODULE: ./node_modules/core-js/internals/function-call.js
var function_call_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var NATIVE_BIND = (function_bind_native_namespaceFn());

var call = Function.prototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};

});

// MODULE: ./node_modules/core-js/internals/function-name.js
var function_name_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var DESCRIPTORS = (descriptors_namespaceFn());
var hasOwn = (has_own_property_namespaceFn());

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && function something() { /* empty */ }.name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  ...(/* unused pure expression */ null && (EXISTS)),
  ...(/* unused pure expression */ null && (PROPER)),
  i2: CONFIGURABLE
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/function-uncurry-this.js
var function_uncurry_this_namespaceFn = () => {
	return __webpack_require__(0);
};

// MODULE: ./node_modules/core-js/internals/get-built-in.js
var get_built_in_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var globalThis = (global_this_namespaceFn());
var isCallable = (is_callable_namespaceFn());

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/get-method.js
var get_method_namespaceFn = () => {
	return __webpack_require__(11);
};

// MODULE: ./node_modules/core-js/internals/global-this.js
var global_this_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module) {

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

});

// MODULE: ./node_modules/core-js/internals/has-own-property.js
var has_own_property_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var uncurryThis = (function_uncurry_this_namespaceFn());
var toObject = (to_object_namespaceFn());

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

});

// MODULE: ./node_modules/core-js/internals/hidden-keys.js
var hidden_keys_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

module.exports = {};

});

// MODULE: ./node_modules/core-js/internals/html.js
var html_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var getBuiltIn = (get_built_in_namespaceFn());

module.exports = getBuiltIn('document', 'documentElement');

});

// MODULE: ./node_modules/core-js/internals/ie8-dom-define.js
var ie8_dom_define_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var DESCRIPTORS = (descriptors_namespaceFn());
var fails = (fails_namespaceFn());
var createElement = (document_create_element_namespaceFn());

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/indexed-object.js
var indexed_object_namespaceFn = () => {
	return __webpack_require__(8);
};

// MODULE: ./node_modules/core-js/internals/inspect-source.js
var inspect_source_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var uncurryThis = (function_uncurry_this_namespaceFn());
var isCallable = (is_callable_namespaceFn());
var store = (shared_store_namespaceFn());

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;

});

// MODULE: ./node_modules/core-js/internals/internal-state.js
var internal_state_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var NATIVE_WEAK_MAP = (weak_map_basic_detection_namespaceFn());
var globalThis = (global_this_namespaceFn());
var isObject = (is_object_namespaceFn());
var createNonEnumerableProperty = (create_non_enumerable_property_namespaceFn());
var hasOwn = (has_own_property_namespaceFn());
var shared = (shared_store_namespaceFn());
var sharedKey = (shared_key_namespaceFn());
var hiddenKeys = (hidden_keys_namespaceFn());

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/is-callable.js
var is_callable_namespaceFn = () => {
	return __webpack_require__(2);
};

// EXTERNAL MODULE: ./node_modules/core-js/internals/is-forced.js
var is_forced_namespaceFn = () => {
	return __webpack_require__(18);
};

// MODULE: ./node_modules/core-js/internals/is-object.js
var is_object_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var isCallable = (is_callable_namespaceFn());

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/is-pure.js
var is_pure_namespaceFn = () => {
	return __webpack_require__(14);
};

// MODULE: ./node_modules/core-js/internals/is-symbol.js
var is_symbol_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var getBuiltIn = (get_built_in_namespaceFn());
var isCallable = (is_callable_namespaceFn());
var isPrototypeOf = (object_is_prototype_of_namespaceFn());
var USE_SYMBOL_AS_UID = (use_symbol_as_uid_namespaceFn());

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};

});

// MODULE: ./node_modules/core-js/internals/length-of-array-like.js
var length_of_array_like_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var toLength = (to_length_namespaceFn());

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};

});

// MODULE: ./node_modules/core-js/internals/make-built-in.js
var make_built_in_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var uncurryThis = (function_uncurry_this_namespaceFn());
var fails = (fails_namespaceFn());
var isCallable = (is_callable_namespaceFn());
var hasOwn = (has_own_property_namespaceFn());
var DESCRIPTORS = (descriptors_namespaceFn());
var CONFIGURABLE_FUNCTION_NAME = (function_name_namespaceFn().i2);
var inspectSource = (inspect_source_namespaceFn());
var InternalStateModule = (internal_state_namespaceFn());

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');

});

// MODULE: ./node_modules/core-js/internals/object-create.js
var object_create_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

/* global ActiveXObject -- old IE, WSH */
var anObject = (an_object_namespaceFn());
var definePropertiesModule = (object_define_properties_namespaceFn());
var enumBugKeys = (enum_bug_keys_namespaceFn());
var hiddenKeys = (hidden_keys_namespaceFn());
var html = (html_namespaceFn());
var documentCreateElement = (document_create_element_namespaceFn());
var sharedKey = (shared_key_namespaceFn());

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  activeXDocument = null;
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};

});

// MODULE: ./node_modules/core-js/internals/object-define-properties.js
var object_define_properties_namespaceFn = /*#__PURE__*/__webpack_require__.cw((__unused_webpack_module, exports) => {

var DESCRIPTORS = (descriptors_namespaceFn());
var V8_PROTOTYPE_DEFINE_BUG = (v8_prototype_define_bug_namespaceFn());
var definePropertyModule = (object_define_property_namespaceFn());
var anObject = (an_object_namespaceFn());
var toIndexedObject = (to_indexed_object_namespaceFn());
var objectKeys = (object_keys_namespaceFn());

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};

});

// MODULE: ./node_modules/core-js/internals/object-define-property.js
var object_define_property_namespaceFn = /*#__PURE__*/__webpack_require__.cw((__unused_webpack_module, exports) => {

var DESCRIPTORS = (descriptors_namespaceFn());
var IE8_DOM_DEFINE = (ie8_dom_define_namespaceFn());
var V8_PROTOTYPE_DEFINE_BUG = (v8_prototype_define_bug_namespaceFn());
var anObject = (an_object_namespaceFn());
var toPropertyKey = (to_property_key_namespaceFn());

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

});

// MODULE: ./node_modules/core-js/internals/object-get-own-property-descriptor.js
var object_get_own_property_descriptor_namespaceFn = /*#__PURE__*/__webpack_require__.cw((__unused_webpack_module, exports) => {

var DESCRIPTORS = (descriptors_namespaceFn());
var call = (function_call_namespaceFn());
var propertyIsEnumerableModule = (object_property_is_enumerable_namespaceFn());
var createPropertyDescriptor = (create_property_descriptor_namespaceFn());
var toIndexedObject = (to_indexed_object_namespaceFn());
var toPropertyKey = (to_property_key_namespaceFn());
var hasOwn = (has_own_property_namespaceFn());
var IE8_DOM_DEFINE = (ie8_dom_define_namespaceFn());

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};

});

// MODULE: ./node_modules/core-js/internals/object-get-own-property-names.js
var object_get_own_property_names_namespaceFn = /*#__PURE__*/__webpack_require__.cw((__unused_webpack_module, exports) => {

var internalObjectKeys = (object_keys_internal_namespaceFn());
var enumBugKeys = (enum_bug_keys_namespaceFn());

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/object-get-own-property-symbols.js
var object_get_own_property_symbols_namespaceFn = () => {
	return __webpack_require__(21);
};

// EXTERNAL MODULE: ./node_modules/core-js/internals/object-is-prototype-of.js
var object_is_prototype_of_namespaceFn = () => {
	return __webpack_require__(10);
};

// MODULE: ./node_modules/core-js/internals/object-keys-internal.js
var object_keys_internal_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var uncurryThis = (function_uncurry_this_namespaceFn());
var hasOwn = (has_own_property_namespaceFn());
var toIndexedObject = (to_indexed_object_namespaceFn());
var indexOf = (array_includes_namespaceFn().q);
var hiddenKeys = (hidden_keys_namespaceFn());

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

});

// MODULE: ./node_modules/core-js/internals/object-keys.js
var object_keys_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var internalObjectKeys = (object_keys_internal_namespaceFn());
var enumBugKeys = (enum_bug_keys_namespaceFn());

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

});

// MODULE: ./node_modules/core-js/internals/object-property-is-enumerable.js
var object_property_is_enumerable_namespaceFn = /*#__PURE__*/__webpack_require__.cw((__unused_webpack_module, exports) => {

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

});

// MODULE: ./node_modules/core-js/internals/ordinary-to-primitive.js
var ordinary_to_primitive_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var call = (function_call_namespaceFn());
var isCallable = (is_callable_namespaceFn());
var isObject = (is_object_namespaceFn());

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};

});

// MODULE: ./node_modules/core-js/internals/own-keys.js
var own_keys_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var getBuiltIn = (get_built_in_namespaceFn());
var uncurryThis = (function_uncurry_this_namespaceFn());
var getOwnPropertyNamesModule = (object_get_own_property_names_namespaceFn());
var getOwnPropertySymbolsModule = (object_get_own_property_symbols_namespaceFn());
var anObject = (an_object_namespaceFn());

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/require-object-coercible.js
var require_object_coercible_namespaceFn = () => {
	return __webpack_require__(4);
};

// MODULE: ./node_modules/core-js/internals/shared-key.js
var shared_key_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var shared = (shared_namespaceFn());
var uid = (uid_namespaceFn());

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

});

// MODULE: ./node_modules/core-js/internals/shared-store.js
var shared_store_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var IS_PURE = (is_pure_namespaceFn());
var globalThis = (global_this_namespaceFn());
var defineGlobalProperty = (define_global_property_namespaceFn());

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.51.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2013–2025 Denis Pushkarev (zloirock.ru), 2025–2026 CoreJS Company (core-js.io). All rights reserved.',
  license: 'https://github.com/zloirock/core-js/blob/v3.51.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

});

// MODULE: ./node_modules/core-js/internals/shared.js
var shared_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var store = (shared_store_namespaceFn());
// eslint-disable-next-line es/no-object-create -- safe
var create = Object.create || Object;

module.exports = function (key, value) {
  return store[key] || (store[key] = value || create(null));
};

});

// MODULE: ./node_modules/core-js/internals/symbol-constructor-detection.js
var symbol_constructor_detection_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = (environment_v8_version_namespaceFn());
var fails = (fails_namespaceFn());
var globalThis = (global_this_namespaceFn());

var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

});

// MODULE: ./node_modules/core-js/internals/to-absolute-index.js
var to_absolute_index_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var toIntegerOrInfinity = (to_integer_or_infinity_namespaceFn());

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

});

// MODULE: ./node_modules/core-js/internals/to-indexed-object.js
var to_indexed_object_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = (indexed_object_namespaceFn());
var requireObjectCoercible = (require_object_coercible_namespaceFn());

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/to-integer-or-infinity.js
var to_integer_or_infinity_namespaceFn = () => {
	return __webpack_require__(6);
};

// EXTERNAL MODULE: ./node_modules/core-js/internals/to-length.js
var to_length_namespaceFn = () => {
	return __webpack_require__(17);
};

// EXTERNAL MODULE: ./node_modules/core-js/internals/to-object.js
var to_object_namespaceFn = () => {
	return __webpack_require__(15);
};

// MODULE: ./node_modules/core-js/internals/to-primitive.js
var to_primitive_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var call = (function_call_namespaceFn());
var isObject = (is_object_namespaceFn());
var isSymbol = (is_symbol_namespaceFn());
var getMethod = (get_method_namespaceFn());
var ordinaryToPrimitive = (ordinary_to_primitive_namespaceFn());
var wellKnownSymbol = (well_known_symbol_namespaceFn());

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

});

// MODULE: ./node_modules/core-js/internals/to-property-key.js
var to_property_key_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var toPrimitive = (to_primitive_namespaceFn());
var isSymbol = (is_symbol_namespaceFn());

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/uid.js
var uid_namespaceFn = () => {
	return __webpack_require__(7);
};

// MODULE: ./node_modules/core-js/internals/use-symbol-as-uid.js
var use_symbol_as_uid_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = (symbol_constructor_detection_namespaceFn());

module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';

});

// MODULE: ./node_modules/core-js/internals/v8-prototype-define-bug.js
var v8_prototype_define_bug_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var DESCRIPTORS = (descriptors_namespaceFn());
var fails = (fails_namespaceFn());

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});

});

// MODULE: ./node_modules/core-js/internals/weak-map-basic-detection.js
var weak_map_basic_detection_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var globalThis = (global_this_namespaceFn());
var isCallable = (is_callable_namespaceFn());

var WeakMap = globalThis.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));

});

// MODULE: ./node_modules/core-js/internals/well-known-symbol.js
var well_known_symbol_namespaceFn = /*#__PURE__*/__webpack_require__.cw((module) => {

var globalThis = (global_this_namespaceFn());
var shared = (shared_namespaceFn());
var hasOwn = (has_own_property_namespaceFn());
var uid = (uid_namespaceFn());
var NATIVE_SYMBOL = (symbol_constructor_detection_namespaceFn());
var USE_SYMBOL_AS_UID = (use_symbol_as_uid_namespaceFn());

var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

});

// MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes_namespaceFn = /*#__PURE__*/__webpack_require__.cw(() => {

var $ = (export_namespaceFn());
var $includes = (array_includes_namespaceFn().m);
var fails = (fails_namespaceFn());
var addToUnscopables = (add_to_unscopables_namespaceFn());

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
  // eslint-disable-next-line es/no-array-prototype-includes -- detection
  return !Array(1).includes();
});

// Safari 26.4- bug
var BROKEN_ON_SPARSE_WITH_FROM_INDEX = fails(function () {
  // eslint-disable-next-line no-sparse-arrays, es/no-array-prototype-includes -- detection
  return [, 1].includes(undefined, 1);
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE || BROKEN_ON_SPARSE_WITH_FROM_INDEX }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

});

;// ./node_modules/core-js/modules/es.array.includes.js
es_array_includes_namespaceFn();

;// external "path"

;// external "util"

;// ./package.json
const package_namespaceObject = {"rE":"0.0.3-1"};
;// external "crypto"

;// external "fs/promises"

;// ./src/content.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module content *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function _typeof(o){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return _regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?i<3?(i>1&&(G.n=-1),l(i,u)):G.n=u:G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),_regeneratorDefine2(f),_regeneratorDefine2(f,a,"Generator"),_regeneratorDefine2(f,n,function(){return this}),_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(_regenerator=function _regenerator(){return{w:i,m:p}})()}function _regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},_regeneratorDefine2(e,r,n,t)}function _defineProperties(r,t){for(var o=0;o<t.length;o++){var i=t[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(r,_toPropertyKey(i.key),i)}}function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function _classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}function _inherits(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(r&&r.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),r&&_setPrototypeOf(t,r)}function _callSuper(e,c,p){return c=_getPrototypeOf(c),_possibleConstructorReturn(e,_isNativeReflectConstruct()?Reflect.construct(c,p||[],_getPrototypeOf(e).constructor):c.apply(e,p))}function _possibleConstructorReturn(t,e){if(e&&("object"==_typeof(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(t)}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _wrapNativeSuper(p){var n="function"==typeof Map?new Map:void 0;return _wrapNativeSuper=function _wrapNativeSuper(p){if(null===p||!_isNativeFunction(p))return p;if("function"!=typeof p)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(p))return n.get(p);n.set(p,Wrapper)}function Wrapper(){return _construct(p,arguments,_getPrototypeOf(this).constructor)}return Wrapper.prototype=Object.create(p.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(Wrapper,p)},_wrapNativeSuper(p)}function _construct(e,o,p){if(_isNativeReflectConstruct())return Reflect.construct.apply(null,arguments);var n=[null];n.push.apply(n,o);var l=new(e.bind.apply(e,n));return p&&_setPrototypeOf(l,p.prototype),l}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function _isNativeFunction(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(n){return"function"==typeof t}}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},_setPrototypeOf(t,e)}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},_getPrototypeOf(t)}function _defineProperty(r,t,o){return(t=_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function _toPropertyKey(r){var o=_toPrimitive(r,"string");return"symbol"==_typeof(o)?o:o+""}function _toPrimitive(t,e){if("object"!=_typeof(t)||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}function _asyncIterator(r){var n,t,o,e=2;for("undefined"!=typeof Symbol&&(t=Symbol.asyncIterator,o=Symbol.iterator);e--;){if(t&&null!=(n=r[t]))return n.call(r);if(o&&null!=(n=r[o]))return new AsyncFromSyncIterator(n.call(r));t="@@asyncIterator",o="@@iterator"}throw new TypeError("Object is not async iterable")}function AsyncFromSyncIterator(r){function AsyncFromSyncIteratorContinuation(r){if(Object(r)!==r)return Promise.reject(new TypeError(r+" is not an object."));var n=r.done;return Promise.resolve(r.value).then(function(r){return{value:r,done:n}})}return AsyncFromSyncIterator=function AsyncFromSyncIterator(r){this.s=r,this.n=r.next},AsyncFromSyncIterator.prototype={s:null,n:null,next:function next(){return AsyncFromSyncIteratorContinuation(this.n.apply(this.s,arguments))},return:function _return(r){var n=this.s.return;return void 0===n?Promise.resolve({value:r,done:!0}):AsyncFromSyncIteratorContinuation(n.apply(this.s,arguments))},throw:function _throw(r){var n=this.s.throw;return void 0===n?Promise.reject(r):AsyncFromSyncIteratorContinuation(n.apply(this.s,arguments))}},new AsyncFromSyncIterator(r)}function _awaitAsyncGenerator(r){return new _OverloadYield(r,0)}function _wrapAsyncGenerator(e){return function(){return new AsyncGenerator(e.apply(this,arguments))}}function AsyncGenerator(t){var n,r;function resume(n,r){try{var o=t[n](r),u=o.value,i=u instanceof _OverloadYield;Promise.resolve(i?u.v:u).then(function(e){if(i){var r="return"===n&&u.k?n:"next";if(!u.k||e.done)return resume(r,e);e=t[r](e).value}settle(!!o.done,e)},function(e){resume("throw",e)})}catch(e){settle(2,e)}}function settle(e,t){2===e?n.reject(t):n.resolve({value:t,done:e}),(n=n.next)?resume(n.key,n.arg):r=null}this._invoke=function(e,t){return new Promise(function(o,u){var i={key:e,arg:t,resolve:o,reject:u,next:null};r?r=r.next=i:(n=r=i,resume(e,t))})},"function"!=typeof t.return&&(this.return=void 0)}AsyncGenerator.prototype["function"==typeof Symbol&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},AsyncGenerator.prototype.next=function(e){return this._invoke("next",e)},AsyncGenerator.prototype.throw=function(e){return this._invoke("throw",e)},AsyncGenerator.prototype.return=function(e){return this._invoke("return",e)};function _OverloadYield(e,d){this.v=e,this.k=d};// endregion
/*
    On-disk layout of a gocryptfs (format version 2) file:

    - Empty plaintext results in an empty file (no header).
    - 18 byte header: 2 byte big endian version (2) and a random 16 byte file
      id.
    - 4096 byte plaintext blocks, each stored as 16 byte nonce, ciphertext and
      16 byte authentication tag (AES-256-GCM). The associated data is the
      big endian 8 byte block number followed by the file id.
*/var KEY_LENGTH=32;var VERSION=2;var VERSION_LENGTH=2;var FILE_ID_LENGTH=16;var HEADER_LENGTH=VERSION_LENGTH+FILE_ID_LENGTH;var IV_LENGTH=16;var TAG_LENGTH=16;var BLOCK_OVERHEAD=IV_LENGTH+TAG_LENGTH;var PLAIN_BLOCK_SIZE=4096;var CIPHER_BLOCK_SIZE=PLAIN_BLOCK_SIZE+BLOCK_OVERHEAD;// "info" values gocryptfs mixes into its hkdf derived keys.
var KEY_INFORMATION={content:"AES-GCM file content encryption"};var ALL_ZERO_CIPHER_BLOCK=Buffer.alloc(CIPHER_BLOCK_SIZE);var CorruptFileError=/*#__PURE__*/function(_Error){function CorruptFileError(){var _this;_classCallCheck(this,CorruptFileError);for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key]}_this=_callSuper(this,CorruptFileError,[].concat(args));_defineProperty(_this,"name","CorruptFileError");return _this}_inherits(CorruptFileError,_Error);return _createClass(CorruptFileError)}(/*#__PURE__*/_wrapNativeSuper(Error));/**
 * Derives a sub key from given (master) key like gocryptfs does (HKDF-SHA256
 * without salt).
 * @param key - Input key material.
 * @param information - Context string to bind the derived key to.
 * @returns Derived 32 byte key.
 */var deriveKey=function deriveKey(key,information){return Buffer.from(__WEBPACK_EXTERNAL_MODULE_crypto_hkdfSync__("sha256",key,Buffer.alloc(0),information,KEY_LENGTH))};/**
 * Derives the file content key from given master key.
 * @param masterKey - Unlocked vault master key.
 * @returns Key to en- and decrypt file content blocks.
 */var deriveContentKey=function deriveContentKey(masterKey){return deriveKey(masterKey,KEY_INFORMATION.content)};/**
 * Builds the associated data authenticated with each block.
 * @param blockNumber - Zero based index of the block inside its file.
 * @param fileID - File id from the file's header (none for the master key).
 * @returns Associated data.
 */var getAssociatedData=function getAssociatedData(blockNumber,fileID){var blockNumberBuffer=Buffer.alloc(8);blockNumberBuffer.writeBigUInt64BE(BigInt(blockNumber));return fileID?Buffer.concat([blockNumberBuffer,fileID]):blockNumberBuffer};/**
 * Encrypts one plaintext block.
 * @param key - Content key.
 * @param plaintext - At most "PLAIN_BLOCK_SIZE" bytes.
 * @param blockNumber - Zero based index of the block inside its file.
 * @param fileID - File id from the file's header.
 * @param iv - Nonce to use, a random one will be generated by default.
 * @returns Nonce, ciphertext and authentication tag.
 */var encryptBlock=function encryptBlock(key,plaintext,blockNumber,fileID,iv){if(iv===void 0){iv=__WEBPACK_EXTERNAL_MODULE_crypto_randomBytes__(IV_LENGTH)}if(plaintext.length===0)return plaintext;var cipher=__WEBPACK_EXTERNAL_MODULE_crypto_createCipheriv__("aes-256-gcm",key,iv);cipher.setAAD(getAssociatedData(blockNumber,fileID));return Buffer.concat([iv,cipher.update(plaintext),cipher.final(),cipher.getAuthTag()])};/**
 * Decrypts and authenticates one ciphertext block.
 * @param key - Content key.
 * @param ciphertext - Nonce, ciphertext and authentication tag.
 * @param blockNumber - Zero based index of the block inside its file.
 * @param fileID - File id from the file's header.
 * @returns Plaintext.
 */var decryptBlock=function decryptBlock(key,ciphertext,blockNumber,fileID){if(ciphertext.length===0)return ciphertext;// NOTE: gocryptfs represents file holes as all-zero ciphertext blocks.
if(ciphertext.equals(ALL_ZERO_CIPHER_BLOCK))return Buffer.alloc(PLAIN_BLOCK_SIZE);if(ciphertext.length<=BLOCK_OVERHEAD)throw new CorruptFileError("Block ".concat(String(blockNumber)," is too short ")+"(".concat(String(ciphertext.length)," bytes)."));var iv=ciphertext.subarray(0,IV_LENGTH);if(iv.every(function(value){return value===0}))throw new CorruptFileError("Block ".concat(String(blockNumber)," has an all-zero nonce."));var decipher=__WEBPACK_EXTERNAL_MODULE_crypto_createDecipheriv__("aes-256-gcm",key,iv);decipher.setAAD(getAssociatedData(blockNumber,fileID));decipher.setAuthTag(ciphertext.subarray(-TAG_LENGTH));try{return Buffer.concat([decipher.update(ciphertext.subarray(IV_LENGTH,-TAG_LENGTH)),decipher.final()])}catch(_unused){throw new CorruptFileError("Block ".concat(String(blockNumber)," failed authentication."))}};/**
 * Creates a new file header with a random file id.
 * @returns Header bytes.
 */var createHeader=function createHeader(){var header=Buffer.alloc(HEADER_LENGTH);header.writeUInt16BE(VERSION);__WEBPACK_EXTERNAL_MODULE_crypto_randomBytes__(FILE_ID_LENGTH).copy(header,VERSION_LENGTH);return header};/**
 * Validates given file header and extracts its file id.
 * @param header - First "HEADER_LENGTH" bytes of an encrypted file.
 * @returns File id.
 */var parseHeader=function parseHeader(header){if(header.length!==HEADER_LENGTH)throw new CorruptFileError("Header is truncated (".concat(String(header.length)," bytes)."));var version=header.readUInt16BE();if(version!==VERSION)throw new CorruptFileError("Unsupported file version ".concat(String(version),"."));var fileID=header.subarray(VERSION_LENGTH);if(fileID.every(function(value){return value===0}))throw new CorruptFileError("File id is all-zero.");return fileID};/**
 * Calculates the plaintext size of an encrypted file.
 * @param cipherSize - Size of the encrypted file.
 * @returns Plaintext size.
 */var getPlainSize=function getPlainSize(cipherSize){if(cipherSize<=HEADER_LENGTH)return 0;var payloadSize=cipherSize-HEADER_LENGTH;var fullBlocks=Math.floor(payloadSize/CIPHER_BLOCK_SIZE);var rest=payloadSize%CIPHER_BLOCK_SIZE;return fullBlocks*PLAIN_BLOCK_SIZE+(rest>BLOCK_OVERHEAD?rest-BLOCK_OVERHEAD:0)};/**
 * Calculates the encrypted size of a plaintext file.
 * @param plainSize - Size of the plaintext file.
 * @returns Encrypted size.
 */var getCipherSize=function getCipherSize(plainSize){if(plainSize===0)return 0;var fullBlocks=Math.floor(plainSize/PLAIN_BLOCK_SIZE);var rest=plainSize%PLAIN_BLOCK_SIZE;return HEADER_LENGTH+fullBlocks*CIPHER_BLOCK_SIZE+(rest>0?rest+BLOCK_OVERHEAD:0)};/**
 * Reads given file in chunks of given size.
 * @param path - File to read.
 * @param chunkSize - Maximal chunk size.
 * @param offset - Position to start reading at.
 * @yields {Buffer} Chunks (only the last one may be shorter than "chunkSize").
 */var readChunks=/*#__PURE__*/function(){var _readChunks=_wrapAsyncGenerator(function(path,chunkSize,offset){if(offset===void 0){offset=0}return/*#__PURE__*/_regenerator().m(function _callee(){var fileHandle,position,buffer,length,_yield$_awaitAsyncGen,bytesRead;return _regenerator().w(function(_context){while(1)switch(_context.p=_context.n){case 0:_context.n=1;return _awaitAsyncGenerator(__WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_open__(path,"r"));case 1:fileHandle=_context.v;_context.p=2;position=offset;case 3:buffer=Buffer.alloc(chunkSize);length=0;// NOTE: A read may return less than requested before EOF.
case 4:if(!(length<chunkSize)){_context.n=7;break}_context.n=5;return _awaitAsyncGenerator(fileHandle.read(buffer,length,chunkSize-length,position+length));case 5:_yield$_awaitAsyncGen=_context.v;bytesRead=_yield$_awaitAsyncGen.bytesRead;if(!(bytesRead===0)){_context.n=6;break}return _context.a(3,7);case 6:length+=bytesRead;_context.n=4;break;case 7:if(!(length===0)){_context.n=8;break}return _context.a(2);case 8:position+=length;_context.n=9;return buffer.subarray(0,length);case 9:if(!(length<chunkSize)){_context.n=10;break}return _context.a(2);case 10:_context.n=3;break;case 11:_context.p=11;_context.n=12;return _awaitAsyncGenerator(fileHandle.close());case 12:return _context.f(11);case 13:return _context.a(2)}},_callee,null,[[2,,11,13]])})()});function readChunks(_x,_x2){return _readChunks.apply(this,arguments)}return readChunks}();/**
 * Decrypts given encrypted file block by block.
 * @param key - Content key.
 * @param path - Encrypted file.
 * @yields {Buffer} Plaintext blocks.
 */var decryptFileContent=/*#__PURE__*/function(){var _decryptFileContent=_wrapAsyncGenerator(/*#__PURE__*/_regenerator().m(function _callee2(key,path){var fileID,_iteratorAbruptCompletion,_didIteratorError,_iteratorError,_iterator,_step,header,blockNumber,_iteratorAbruptCompletion2,_didIteratorError2,_iteratorError2,_iterator2,_step2,block,_t,_t2;return _regenerator().w(function(_context2){while(1)switch(_context2.p=_context2.n){case 0:fileID=null;_iteratorAbruptCompletion=false;_didIteratorError=false;_context2.p=1;_iterator=_asyncIterator(readChunks(path,HEADER_LENGTH));case 2:_context2.n=3;return _awaitAsyncGenerator(_iterator.next());case 3:if(!(_iteratorAbruptCompletion=!(_step=_context2.v).done)){_context2.n=5;break}header=_step.value;fileID=parseHeader(header);return _context2.a(3,5);case 4:_iteratorAbruptCompletion=false;_context2.n=2;break;case 5:_context2.n=7;break;case 6:_context2.p=6;_t=_context2.v;_didIteratorError=true;_iteratorError=_t;case 7:_context2.p=7;_context2.p=8;if(!(_iteratorAbruptCompletion&&_iterator.return!=null)){_context2.n=9;break}_context2.n=9;return _awaitAsyncGenerator(_iterator.return());case 9:_context2.p=9;if(!_didIteratorError){_context2.n=10;break}throw _iteratorError;case 10:return _context2.f(9);case 11:return _context2.f(7);case 12:if(fileID){_context2.n=13;break}return _context2.a(2);case 13:blockNumber=0;_iteratorAbruptCompletion2=false;_didIteratorError2=false;_context2.p=14;_iterator2=_asyncIterator(readChunks(path,CIPHER_BLOCK_SIZE,HEADER_LENGTH));case 15:_context2.n=16;return _awaitAsyncGenerator(_iterator2.next());case 16:if(!(_iteratorAbruptCompletion2=!(_step2=_context2.v).done)){_context2.n=19;break}block=_step2.value;_context2.n=17;return decryptBlock(key,block,blockNumber,fileID);case 17:blockNumber+=1;case 18:_iteratorAbruptCompletion2=false;_context2.n=15;break;case 19:_context2.n=21;break;case 20:_context2.p=20;_t2=_context2.v;_didIteratorError2=true;_iteratorError2=_t2;case 21:_context2.p=21;_context2.p=22;if(!(_iteratorAbruptCompletion2&&_iterator2.return!=null)){_context2.n=23;break}_context2.n=23;return _awaitAsyncGenerator(_iterator2.return());case 23:_context2.p=23;if(!_didIteratorError2){_context2.n=24;break}throw _iteratorError2;case 24:return _context2.f(23);case 25:return _context2.f(21);case 26:return _context2.a(2)}},_callee2,null,[[22,,23,25],[14,20,21,26],[8,,9,11],[1,6,7,12]])}));function decryptFileContent(_x3,_x4){return _decryptFileContent.apply(this,arguments)}return decryptFileContent}();/**
 * Encrypts given plaintext file block by block.
 * @param key - Content key.
 * @param path - Plaintext file.
 * @yields {Buffer} Header followed by ciphertext blocks (nothing for empty
 * files).
 */var encryptFileContent=/*#__PURE__*/function(){var _encryptFileContent=_wrapAsyncGenerator(/*#__PURE__*/_regenerator().m(function _callee3(key,path){var fileID,blockNumber,_iteratorAbruptCompletion3,_didIteratorError3,_iteratorError3,_iterator3,_step3,block,header,_t3;return _regenerator().w(function(_context3){while(1)switch(_context3.p=_context3.n){case 0:fileID=null;blockNumber=0;_iteratorAbruptCompletion3=false;_didIteratorError3=false;_context3.p=1;_iterator3=_asyncIterator(readChunks(path,PLAIN_BLOCK_SIZE));case 2:_context3.n=3;return _awaitAsyncGenerator(_iterator3.next());case 3:if(!(_iteratorAbruptCompletion3=!(_step3=_context3.v).done)){_context3.n=7;break}block=_step3.value;if(fileID){_context3.n=4;break}header=createHeader();fileID=header.subarray(VERSION_LENGTH);_context3.n=4;return header;case 4:_context3.n=5;return encryptBlock(key,block,blockNumber,fileID);case 5:blockNumber+=1;case 6:_iteratorAbruptCompletion3=false;_context3.n=2;break;case 7:_context3.n=9;break;case 8:_context3.p=8;_t3=_context3.v;_didIteratorError3=true;_iteratorError3=_t3;case 9:_context3.p=9;_context3.p=10;if(!(_iteratorAbruptCompletion3&&_iterator3.return!=null)){_context3.n=11;break}_context3.n=11;return _awaitAsyncGenerator(_iterator3.return());case 11:_context3.p=11;if(!_didIteratorError3){_context3.n=12;break}throw _iteratorError3;case 12:return _context3.f(11);case 13:return _context3.f(9);case 14:return _context3.a(2)}},_callee3,null,[[10,,11,13],[1,8,9,14]])}));function encryptFileContent(_x5,_x6){return _encryptFileContent.apply(this,arguments)}return encryptFileContent}();
;// ./src/configuration.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module configuration *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function configuration_regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return configuration_regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?i<3?(i>1&&(G.n=-1),l(i,u)):G.n=u:G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(configuration_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,configuration_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,configuration_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),configuration_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",configuration_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),configuration_regeneratorDefine2(f),configuration_regeneratorDefine2(f,a,"Generator"),configuration_regeneratorDefine2(f,n,function(){return this}),configuration_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(configuration_regenerator=function _regenerator(){return{w:i,m:p}})()}function configuration_regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}configuration_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){configuration_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},configuration_regeneratorDefine2(e,r,n,t)}function asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function _asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}};function _createForOfIteratorHelper(e,t){var _n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!_n){if(Array.isArray(e)||(_n=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){_n&&(e=_n);var o=0,F=function F(){};return{s:F,n:function n(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u,i=!0;return{s:function s(){_n=_n.call(e)},n:function n(){i=!0;var r=_n.next();return r.done?{done:!0}:{value:r.value,done:i=!1}},e:function e(r){a=!0,u=r},f:function f(){try{i||null==_n.return||_n.return()}finally{if(a)throw u}}}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}function configuration_typeof(o){"@babel/helpers - typeof";return configuration_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},configuration_typeof(o)}function configuration_defineProperties(r,t){for(var o=0;o<t.length;o++){var i=t[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(r,configuration_toPropertyKey(i.key),i)}}function configuration_createClass(e,r,t){return r&&configuration_defineProperties(e.prototype,r),t&&configuration_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function configuration_classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}function configuration_inherits(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(r&&r.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),r&&configuration_setPrototypeOf(t,r)}function configuration_callSuper(e,c,p){return c=configuration_getPrototypeOf(c),configuration_possibleConstructorReturn(e,configuration_isNativeReflectConstruct()?Reflect.construct(c,p||[],configuration_getPrototypeOf(e).constructor):c.apply(e,p))}function configuration_possibleConstructorReturn(t,e){if(e&&("object"==configuration_typeof(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return configuration_assertThisInitialized(t)}function configuration_assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function configuration_wrapNativeSuper(p){var n="function"==typeof Map?new Map:void 0;return configuration_wrapNativeSuper=function _wrapNativeSuper(p){if(null===p||!configuration_isNativeFunction(p))return p;if("function"!=typeof p)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(p))return n.get(p);n.set(p,Wrapper)}function Wrapper(){return configuration_construct(p,arguments,configuration_getPrototypeOf(this).constructor)}return Wrapper.prototype=Object.create(p.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),configuration_setPrototypeOf(Wrapper,p)},configuration_wrapNativeSuper(p)}function configuration_construct(e,o,p){if(configuration_isNativeReflectConstruct())return Reflect.construct.apply(null,arguments);var n=[null];n.push.apply(n,o);var l=new(e.bind.apply(e,n));return p&&configuration_setPrototypeOf(l,p.prototype),l}function configuration_isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch(t){}return(configuration_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function configuration_isNativeFunction(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(n){return"function"==typeof t}}function configuration_setPrototypeOf(t,e){return configuration_setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},configuration_setPrototypeOf(t,e)}function configuration_getPrototypeOf(t){return configuration_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},configuration_getPrototypeOf(t)}function configuration_defineProperty(r,t,o){return(t=configuration_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function configuration_toPropertyKey(r){var o=configuration_toPrimitive(r,"string");return"symbol"==configuration_typeof(o)?o:o+""}function configuration_toPrimitive(t,e){if("object"!=configuration_typeof(t)||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=configuration_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)};// endregion
var scrypt=__WEBPACK_EXTERNAL_MODULE_util_promisify__(__WEBPACK_EXTERNAL_MODULE_crypto_scrypt__);// Looked up in this order in the vault root, the first one gets created.
var CONFIGURATION_FILE_NAMES=["gocryptfs.conf",".gocryptfs.conf"];var CONFIGURATION_FILE_NAME=CONFIGURATION_FILE_NAMES[0];var SUPPORTED_VERSION=2;/*
    NOTE: Exactly the feature flag set "gocryptfs -init -plaintextnames"
    creates. Everything else is refused so we never damage a vault we do not
    fully understand.
*/var REQUIRED_FEATURE_FLAGS=["GCMIV128","HKDF","PlaintextNames"];var KNOWN_FEATURE_FLAGS=["AESSIV","DirIV","EMENames","FIDO2","GCMIV128","HKDF","LongNameMax","LongNames","PlaintextNames","Raw64","XChaCha20Poly1305"];var CREATOR="gocryptfs-standalone";// Same default cost gocryptfs uses (N = 2^16, needs 64 MiB of memory).
var DEFAULT_SCRYPT_LOG_N=16;// Minimal scrypt parameters gocryptfs accepts.
var MINIMAL_SCRYPT_LOG_N=10;var MINIMAL_SCRYPT_R=8;var MINIMAL_SCRYPT_P=1;var MINIMAL_SALT_LENGTH=32;var UnsupportedVaultError=/*#__PURE__*/function(_Error){function UnsupportedVaultError(){var _this;configuration_classCallCheck(this,UnsupportedVaultError);for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key]}_this=configuration_callSuper(this,UnsupportedVaultError,[].concat(args));configuration_defineProperty(_this,"name","UnsupportedVaultError");return _this}configuration_inherits(UnsupportedVaultError,_Error);return configuration_createClass(UnsupportedVaultError)}(/*#__PURE__*/configuration_wrapNativeSuper(Error));var WrongPasswordError=/*#__PURE__*/function(_Error2){function WrongPasswordError(){var _this2;configuration_classCallCheck(this,WrongPasswordError);for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2]}_this2=configuration_callSuper(this,WrongPasswordError,[].concat(args));configuration_defineProperty(_this2,"name","WrongPasswordError");return _this2}configuration_inherits(WrongPasswordError,_Error2);return configuration_createClass(WrongPasswordError)}(/*#__PURE__*/configuration_wrapNativeSuper(Error));/**
 * Parses and validates given "gocryptfs.conf" content.
 * @param content - Raw json file content.
 * @returns Parsed configuration.
 */var parseConfiguration=function parseConfiguration(content){var _raw$Creator;var raw=JSON.parse(content);if(raw.Version!==SUPPORTED_VERSION)throw new UnsupportedVaultError("Unsupported on-disk format version \"".concat(String(raw.Version),"\" ")+"(only version ".concat(String(SUPPORTED_VERSION)," is supported)."));if(!Array.isArray(raw.FeatureFlags)||typeof raw.EncryptedKey!=="string"||configuration_typeof(raw.ScryptObject)!=="object")throw new UnsupportedVaultError("Configuration file is missing required fields.");var _iterator=_createForOfIteratorHelper(raw.FeatureFlags),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var flag=_step.value;if(!KNOWN_FEATURE_FLAGS.includes(flag))throw new UnsupportedVaultError("Unknown feature flag \"".concat(flag,"\"."))}}catch(err){_iterator.e(err)}finally{_iterator.f()}var featureFlags=raw.FeatureFlags;var missingFlags=REQUIRED_FEATURE_FLAGS.filter(function(flag){return!featureFlags.includes(flag)});var unsupportedFlags=featureFlags.filter(function(flag){return!REQUIRED_FEATURE_FLAGS.includes(flag)});if(missingFlags.length>0||unsupportedFlags.length>0)throw new UnsupportedVaultError("Only vaults created with \"gocryptfs -init -plaintextnames\" "+"are supported (feature flags: "+"".concat(REQUIRED_FEATURE_FLAGS.join(", "),"). Given vault ")+(missingFlags.length>0?"misses: ".concat(missingFlags.join(", ")):"")+(missingFlags.length>0&&unsupportedFlags.length>0?"; ":"")+(unsupportedFlags.length>0?"additionally uses: ".concat(unsupportedFlags.join(", ")):"")+".");var _raw$ScryptObject=raw.ScryptObject,KeyLen=_raw$ScryptObject.KeyLen,N=_raw$ScryptObject.N,P=_raw$ScryptObject.P,R=_raw$ScryptObject.R,Salt=_raw$ScryptObject.Salt;var salt=Buffer.from(Salt,"base64");if(!Number.isInteger(N)||N<Math.pow(2,MINIMAL_SCRYPT_LOG_N)||R<MINIMAL_SCRYPT_R||P<MINIMAL_SCRYPT_P||KeyLen<KEY_LENGTH||salt.length<MINIMAL_SALT_LENGTH)throw new UnsupportedVaultError("Invalid scrypt parameters.");return{creator:(_raw$Creator=raw.Creator)!==null&&_raw$Creator!==void 0?_raw$Creator:"",encryptedKey:Buffer.from(raw.EncryptedKey,"base64"),featureFlags:featureFlags,scrypt:{keyLength:KeyLen,n:N,p:P,r:R,salt:salt},version:raw.Version}};/**
 * Finds the configuration file in given vault directory.
 * @param vaultPath - Encrypted (cipher) directory.
 * @returns Path of the first existing configuration file.
 */var findConfigurationFile=/*#__PURE__*/function(){var _findConfigurationFile=_asyncToGenerator(/*#__PURE__*/configuration_regenerator().m(function _callee(vaultPath){var _i,_CONFIGURATION_FILE_N,name,path,_ref,code,_t;return configuration_regenerator().w(function(_context){while(1)switch(_context.p=_context.n){case 0:_i=0,_CONFIGURATION_FILE_N=CONFIGURATION_FILE_NAMES;case 1:if(!(_i<_CONFIGURATION_FILE_N.length)){_context.n=7;break}name=_CONFIGURATION_FILE_N[_i];path=__WEBPACK_EXTERNAL_MODULE_path_join__(vaultPath,name);_context.p=2;_context.n=3;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_access__(path);case 3:return _context.a(2,path);case 4:_context.p=4;_t=_context.v;_ref=_t,code=_ref.code;/*
                NOTE: A mounted plaintext names vault denies any access to
                "gocryptfs.conf" in its root.
            */if(!(code==="EPERM"&&name===CONFIGURATION_FILE_NAME)){_context.n=5;break}throw new Error("\"".concat(vaultPath,"\" seems to be the decrypted view of a ")+"mounted vault (access to \"gocryptfs.conf\" is denied), "+"give the encrypted directory instead.",{cause:_t});case 5:if(!(code!=="ENOENT")){_context.n=6;break}throw _t;case 6:_i++;_context.n=1;break;case 7:throw new Error("No configuration file (".concat(CONFIGURATION_FILE_NAMES.map(function(name){return"\"".concat(name,"\"")}).join(" or "),") found in \"").concat(vaultPath,"\", give its ")+"path via \"--config\" if it is located elsewhere.");case 8:return _context.a(2)}},_callee,null,[[2,4]])}));function findConfigurationFile(_x){return _findConfigurationFile.apply(this,arguments)}return findConfigurationFile}();/**
 * Loads and validates the configuration file of given vault directory.
 * @param vaultPath - Encrypted (cipher) directory.
 * @param configurationPath - Explicit configuration file path (looked up in
 * the vault directory by default).
 * @returns Parsed configuration.
 */var loadConfiguration=/*#__PURE__*/function(){var _loadConfiguration=_asyncToGenerator(/*#__PURE__*/configuration_regenerator().m(function _callee2(vaultPath,configurationPath){var _t2,_t3,_t4;return configuration_regenerator().w(function(_context2){while(1)switch(_context2.n){case 0:_t2=parseConfiguration;_t3=__WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__;if(!(configurationPath!==null&&configurationPath!==void 0)){_context2.n=1;break}_t4=configurationPath;_context2.n=3;break;case 1:_context2.n=2;return findConfigurationFile(vaultPath);case 2:_t4=_context2.v;case 3:_context2.n=4;return _t3(_t4,{encoding:"utf-8"});case 4:return _context2.a(2,_t2(_context2.v))}},_callee2)}));function loadConfiguration(_x2,_x3){return _loadConfiguration.apply(this,arguments)}return loadConfiguration}();/**
 * Derives the key encryption key from given password and scrypt parameters.
 * @param scryptParameters - Parameters as stored in the configuration.
 * @param password - Vault password.
 * @returns Key to wrap the master key with.
 */var deriveKeyEncryptionKey=/*#__PURE__*/function(){var _deriveKeyEncryptionKey=_asyncToGenerator(/*#__PURE__*/configuration_regenerator().m(function _callee3(scryptParameters,password){var keyLength,n,p,r,salt,scryptHash,keyEncryptionKey;return configuration_regenerator().w(function(_context3){while(1)switch(_context3.n){case 0:keyLength=scryptParameters.keyLength,n=scryptParameters.n,p=scryptParameters.p,r=scryptParameters.r,salt=scryptParameters.salt;_context3.n=1;return scrypt(password,salt,keyLength,// NOTE: Node's default limit (32 MiB) is too low for N = 2^16.
{N:n,maxmem:256*n*r+1024*1024,p:p,r:r});case 1:scryptHash=_context3.v;keyEncryptionKey=deriveKey(scryptHash,KEY_INFORMATION.content);scryptHash.fill(0);return _context3.a(2,keyEncryptionKey)}},_callee3)}));function deriveKeyEncryptionKey(_x4,_x5){return _deriveKeyEncryptionKey.apply(this,arguments)}return deriveKeyEncryptionKey}();/**
 * Derives the key encryption key from given password and unwraps the master
 * key with it.
 * @param configuration - Parsed vault configuration.
 * @param password - Vault password.
 * @returns The 32 byte master key.
 */var unlockMasterKey=/*#__PURE__*/function(){var _unlockMasterKey=_asyncToGenerator(/*#__PURE__*/configuration_regenerator().m(function _callee4(configuration,password){var keyEncryptionKey,_t5;return configuration_regenerator().w(function(_context4){while(1)switch(_context4.p=_context4.n){case 0:_context4.n=1;return deriveKeyEncryptionKey(configuration.scrypt,password);case 1:keyEncryptionKey=_context4.v;_context4.p=2;return _context4.a(2,decryptBlock(keyEncryptionKey,configuration.encryptedKey,0,null));case 3:_context4.p=3;_t5=_context4.v;throw new WrongPasswordError("Password incorrect.");case 4:_context4.p=4;keyEncryptionKey.fill(0);return _context4.f(4);case 5:return _context4.a(2)}},_callee4,null,[[2,3,4,5]])}));function unlockMasterKey(_x6,_x7){return _unlockMasterKey.apply(this,arguments)}return unlockMasterKey}();/**
 * Parses a master key as printed by "gocryptfs -init" or
 * "gocryptfs-xray -dumpmasterkey" (hex, optionally grouped by dashes).
 * @param value - Master key representation.
 * @returns The 32 byte master key.
 */var parseMasterKey=function parseMasterKey(value){var hex=value.replace(/[\s-]/g,"");if(!/^[0-9a-fA-F]{64}$/.test(hex))throw new Error("A master key has to consist of 64 hex digits.");return Buffer.from(hex,"hex")};/**
 * Serializes given configuration exactly like gocryptfs does (tab indented
 * json with its field order and a trailing newline).
 * @param configuration - Configuration to serialize.
 * @returns File content.
 */var serializeConfiguration=function serializeConfiguration(configuration){var raw={Creator:configuration.creator,EncryptedKey:configuration.encryptedKey.toString("base64"),ScryptObject:{Salt:configuration.scrypt.salt.toString("base64"),N:configuration.scrypt.n,R:configuration.scrypt.r,P:configuration.scrypt.p,KeyLen:configuration.scrypt.keyLength},Version:configuration.version,FeatureFlags:configuration.featureFlags};return"".concat(JSON.stringify(raw,null,"\t"),"\n")};/**
 * Creates a new plaintext names vault configuration protecting given (or a
 * new random) master key with given password.
 * @param password - Vault password.
 * @param scryptLogN - Binary logarithm of the scrypt cost parameter N.
 * @param masterKey - Master key to protect, a random one by default.
 * @returns Configuration and its (unprotected) master key.
 */var createConfiguration=/*#__PURE__*/function(){var _createConfiguration=_asyncToGenerator(/*#__PURE__*/configuration_regenerator().m(function _callee5(password,scryptLogN,masterKey){var scryptParameters,keyEncryptionKey,featureFlags,configuration;return configuration_regenerator().w(function(_context5){while(1)switch(_context5.n){case 0:if(scryptLogN===void 0){scryptLogN=DEFAULT_SCRYPT_LOG_N}if(masterKey===void 0){masterKey=__WEBPACK_EXTERNAL_MODULE_crypto_randomBytes__(KEY_LENGTH)}if(!(!Number.isInteger(scryptLogN)||scryptLogN<MINIMAL_SCRYPT_LOG_N||scryptLogN>28)){_context5.n=1;break}throw new Error("The scrypt cost has to be an integer between "+"".concat(String(MINIMAL_SCRYPT_LOG_N)," and 28."));case 1:if(!(password.length===0)){_context5.n=2;break}throw new Error("Password is empty.");case 2:scryptParameters={keyLength:KEY_LENGTH,n:Math.pow(2,scryptLogN),p:MINIMAL_SCRYPT_P,r:MINIMAL_SCRYPT_R,salt:__WEBPACK_EXTERNAL_MODULE_crypto_randomBytes__(MINIMAL_SALT_LENGTH)};_context5.n=3;return deriveKeyEncryptionKey(scryptParameters,password);case 3:keyEncryptionKey=_context5.v;// NOTE: Same order gocryptfs sets these flags in.
featureFlags=["HKDF","GCMIV128","PlaintextNames"];configuration={creator:CREATOR,encryptedKey:encryptBlock(keyEncryptionKey,masterKey,0,null),featureFlags:featureFlags,scrypt:scryptParameters,version:SUPPORTED_VERSION};keyEncryptionKey.fill(0);return _context5.a(2,{configuration:configuration,masterKey:masterKey})}},_callee5)}));function createConfiguration(_x8,_x9,_x0){return _createConfiguration.apply(this,arguments)}return createConfiguration}();/**
 * Initializes a new plaintext names vault in given (empty or not yet
 * existing) directory.
 * @param vaultPath - Directory to create the vault in.
 * @param password - Vault password.
 * @param scryptLogN - Binary logarithm of the scrypt cost parameter N.
 * @param filePath - Path of the configuration file to create (in the vault
 * directory by default).
 * @returns The new vault's master key.
 */var initializeVault=/*#__PURE__*/function(){var _initializeVault=_asyncToGenerator(/*#__PURE__*/configuration_regenerator().m(function _callee6(vaultPath,password,scryptLogN,filePath){var _yield$createConfigur,configuration,masterKey,temporaryFilePath,_t6,_t7;return configuration_regenerator().w(function(_context6){while(1)switch(_context6.p=_context6.n){case 0:if(filePath===void 0){filePath=__WEBPACK_EXTERNAL_MODULE_path_join__(vaultPath,CONFIGURATION_FILE_NAME)}_context6.n=1;return createConfiguration(password,scryptLogN);case 1:_yield$createConfigur=_context6.v;configuration=_yield$createConfigur.configuration;masterKey=_yield$createConfigur.masterKey;_context6.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(vaultPath,{recursive:true});case 2:_context6.n=3;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readdir__(vaultPath);case 3:_t6=_context6.v.length;if(!(_t6>0)){_context6.n=4;break}throw new Error("Directory \"".concat(vaultPath,"\" is not empty."));case 4:temporaryFilePath="".concat(filePath,".tmp");_context6.p=5;_context6.n=6;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_writeFile__(temporaryFilePath,serializeConfiguration(configuration),{flag:"wx",mode:256});case 6:_context6.n=7;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rename__(temporaryFilePath,filePath);case 7:_context6.n=10;break;case 8:_context6.p=8;_t7=_context6.v;_context6.n=9;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(temporaryFilePath,{force:true});case 9:throw _t7;case 10:return _context6.a(2,masterKey)}},_callee6,null,[[5,8]])}));function initializeVault(_x1,_x10,_x11,_x12){return _initializeVault.apply(this,arguments)}return initializeVault}();/**
 * Formats given master key like gocryptfs does to make it easier to note
 * down.
 * @param masterKey - Key to format.
 * @returns Dash separated groups of eight hex digits on two lines.
 */var formatMasterKey=function formatMasterKey(masterKey){var _masterKey$toString$m;var groups=(_masterKey$toString$m=masterKey.toString("hex").match(/.{8}/g))!==null&&_masterKey$toString$m!==void 0?_masterKey$toString$m:[];return"".concat(groups.slice(0,4).join("-"),"-\n").concat(groups.slice(4).join("-"))};
;// external "os"

;// ./src/state.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module state *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function state_createForOfIteratorHelper(e,t){var _n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!_n){if(Array.isArray(e)||(_n=state_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){_n&&(e=_n);var o=0,F=function F(){};return{s:F,n:function n(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u,i=!0;return{s:function s(){_n=_n.call(e)},n:function n(){i=!0;var r=_n.next();return r.done?{done:!0}:{value:r.value,done:i=!1}},e:function e(r){a=!0,u=r},f:function f(){try{i||null==_n.return||_n.return()}finally{if(a)throw u}}}}function state_unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return state_arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?state_arrayLikeToArray(t,e):void 0}}function state_arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}function state_regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return state_regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?i<3?(i>1&&(G.n=-1),l(i,u)):G.n=u:G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(state_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,state_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,state_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),state_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",state_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),state_regeneratorDefine2(f),state_regeneratorDefine2(f,a,"Generator"),state_regeneratorDefine2(f,n,function(){return this}),state_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(state_regenerator=function _regenerator(){return{w:i,m:p}})()}function state_regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}state_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){state_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},state_regeneratorDefine2(e,r,n,t)}function state_typeof(o){"@babel/helpers - typeof";return state_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},state_typeof(o)}function state_asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function state_asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){state_asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){state_asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}}function state_defineProperties(r,t){for(var o=0;o<t.length;o++){var i=t[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(r,state_toPropertyKey(i.key),i)}}function state_createClass(e,r,t){return r&&state_defineProperties(e.prototype,r),t&&state_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function state_classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}function state_inherits(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(r&&r.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),r&&state_setPrototypeOf(t,r)}function state_callSuper(e,c,p){return c=state_getPrototypeOf(c),state_possibleConstructorReturn(e,state_isNativeReflectConstruct()?Reflect.construct(c,p||[],state_getPrototypeOf(e).constructor):c.apply(e,p))}function state_possibleConstructorReturn(t,e){if(e&&("object"==state_typeof(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return state_assertThisInitialized(t)}function state_assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function state_wrapNativeSuper(p){var n="function"==typeof Map?new Map:void 0;return state_wrapNativeSuper=function _wrapNativeSuper(p){if(null===p||!state_isNativeFunction(p))return p;if("function"!=typeof p)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(p))return n.get(p);n.set(p,Wrapper)}function Wrapper(){return state_construct(p,arguments,state_getPrototypeOf(this).constructor)}return Wrapper.prototype=Object.create(p.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),state_setPrototypeOf(Wrapper,p)},state_wrapNativeSuper(p)}function state_construct(e,o,p){if(state_isNativeReflectConstruct())return Reflect.construct.apply(null,arguments);var n=[null];n.push.apply(n,o);var l=new(e.bind.apply(e,n));return p&&state_setPrototypeOf(l,p.prototype),l}function state_isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch(t){}return(state_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function state_isNativeFunction(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(n){return"function"==typeof t}}function state_setPrototypeOf(t,e){return state_setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},state_setPrototypeOf(t,e)}function state_getPrototypeOf(t){return state_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},state_getPrototypeOf(t)}function state_defineProperty(r,t,o){return(t=state_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function state_toPropertyKey(r){var o=state_toPrimitive(r,"string");return"symbol"==state_typeof(o)?o:o+""}function state_toPrimitive(t,e){if("object"!=state_typeof(t)||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=state_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)};// endregion
var APPLICATION_NAME="gocryptfs-standalone";var CONFIGURATION_DIRECTORY_ENVIRONMENT_VARIABLE_NAME="GOCRYPTFS_STANDALONE_CONFIGURATION_DIRECTORY";var STATE_FILE_NAME="state.json";var LOCK_FILE_NAME="lock";// Held by a daemon as long as it watches the pair.
var DAEMON_LOCK_FILE_NAME="daemon.lock";var TRASH_DIRECTORY_NAME="trash";var DEFAULT_TRASH_RETENTION_IN_DAYS=30;var LockedError=/*#__PURE__*/function(_Error){function LockedError(){var _this;state_classCallCheck(this,LockedError);for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key]}_this=state_callSuper(this,LockedError,[].concat(args));state_defineProperty(_this,"name","LockedError");return _this}state_inherits(LockedError,_Error);return state_createClass(LockedError)}(/*#__PURE__*/state_wrapNativeSuper(Error));/**
 * Determines the user specific configuration directory of this application:
 * "%APPDATA%" on windows, "$XDG_CONFIG_HOME" or "~/.config" elsewhere.
 * @param environment - Environment variables.
 * @param platform - Operating system.
 * @param home - Home directory of the current user.
 * @returns Absolute directory path.
 */var getConfigurationDirectory=function getConfigurationDirectory(environment,platform,home){var _environment$APPDATA,_environment$XDG_CONF;if(environment===void 0){environment=process.env}if(platform===void 0){platform=process.platform}if(home===void 0){home=__WEBPACK_EXTERNAL_MODULE_os_homedir__()}var explicitPath=environment[CONFIGURATION_DIRECTORY_ENVIRONMENT_VARIABLE_NAME];if(explicitPath)return explicitPath;if(platform==="win32")return __WEBPACK_EXTERNAL_MODULE_path_join__((_environment$APPDATA=environment.APPDATA)!==null&&_environment$APPDATA!==void 0?_environment$APPDATA:__WEBPACK_EXTERNAL_MODULE_path_join__(home,"AppData","Roaming"),APPLICATION_NAME);return __WEBPACK_EXTERNAL_MODULE_path_join__((_environment$XDG_CONF=environment.XDG_CONFIG_HOME)!==null&&_environment$XDG_CONF!==void 0?_environment$XDG_CONF:__WEBPACK_EXTERNAL_MODULE_path_join__(home,".config"),APPLICATION_NAME)};/**
 * Determines the directory holding state, lock and trash of given pair.
 * @param plainPath - Absolute plaintext directory path.
 * @param vaultPath - Absolute vault directory path.
 * @param configurationDirectory - Application configuration directory.
 * @returns Absolute directory path.
 */var getPairDirectory=function getPairDirectory(plainPath,vaultPath,configurationDirectory){if(configurationDirectory===void 0){configurationDirectory=getConfigurationDirectory()}return __WEBPACK_EXTERNAL_MODULE_path_join__(configurationDirectory,"pairs",__WEBPACK_EXTERNAL_MODULE_crypto_createHash__("sha256").update("".concat(plainPath,"\0").concat(vaultPath)).digest("hex").slice(0,16))};/**
 * Creates an empty state for given pair.
 * @param plainPath - Absolute plaintext directory path.
 * @param vaultPath - Absolute vault directory path.
 * @returns Empty state.
 */var createState=function createState(plainPath,vaultPath){return{entries:{},plainPath:plainPath,synchronizedAt:null,vaultPath:vaultPath,version:1}};/**
 * Loads the state of the last synchronization. A missing or unreadable state
 * results in an empty one, which only merges both sides and never deletes.
 * @param pairDirectory - Directory of the pair.
 * @param plainPath - Absolute plaintext directory path.
 * @param vaultPath - Absolute vault directory path.
 * @returns State and a warning if an existing state could not be used.
 */var loadState=/*#__PURE__*/function(){var _loadState=state_asyncToGenerator(/*#__PURE__*/state_regenerator().m(function _callee(pairDirectory,plainPath,vaultPath){var content,state,_t,_t2;return state_regenerator().w(function(_context){while(1)switch(_context.p=_context.n){case 0:_context.p=0;_context.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__(__WEBPACK_EXTERNAL_MODULE_path_join__(pairDirectory,STATE_FILE_NAME),{encoding:"utf-8"});case 1:content=_context.v;_context.n=4;break;case 2:_context.p=2;_t=_context.v;if(!(_t.code==="ENOENT")){_context.n=3;break}return _context.a(2,{state:createState(plainPath,vaultPath)});case 3:throw _t;case 4:_context.p=4;state=JSON.parse(content);if(!(state.version!==1||state_typeof(state.entries)!=="object"||state.plainPath!==plainPath||state.vaultPath!==vaultPath)){_context.n=5;break}throw new Error("Unexpected content.");case 5:return _context.a(2,{state:state});case 6:_context.p=6;_t2=_context.v;return _context.a(2,{state:createState(plainPath,vaultPath),warning:"Ignoring unusable synchronization state, both sides "+"get merged without deleting anything."})}},_callee,null,[[4,6],[0,2]])}));function loadState(_x,_x2,_x3){return _loadState.apply(this,arguments)}return loadState}();/**
 * Saves given state atomically.
 * @param pairDirectory - Directory of the pair.
 * @param state - State to save.
 * @returns Promise resolving when saved.
 */var saveState=/*#__PURE__*/function(){var _saveState=state_asyncToGenerator(/*#__PURE__*/state_regenerator().m(function _callee2(pairDirectory,state){var filePath,temporaryFilePath;return state_regenerator().w(function(_context2){while(1)switch(_context2.n){case 0:_context2.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(pairDirectory,{recursive:true});case 1:filePath=__WEBPACK_EXTERNAL_MODULE_path_join__(pairDirectory,STATE_FILE_NAME);temporaryFilePath="".concat(filePath,".tmp");_context2.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_writeFile__(temporaryFilePath,JSON.stringify(state),{mode:384});case 2:_context2.n=3;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rename__(temporaryFilePath,filePath);case 3:return _context2.a(2)}},_callee2)}));function saveState(_x4,_x5){return _saveState.apply(this,arguments)}return saveState}();/**
 * Checks whether a process with given id is running.
 * @param pid - Process id.
 * @returns Indicates whether the process exists.
 */var isRunning=function isRunning(pid){try{process.kill(pid,0);return true}catch(error){// NOTE: "EPERM" means it exists but belongs to someone else.
return error.code==="EPERM"}};/**
 * Acquires the lock of given pair so only one synchronization (or with
 * another lock file name one daemon) runs at a time. Locks of no longer
 * running processes get taken over.
 * @param pairDirectory - Directory of the pair.
 * @param fileName - Name of the lock file.
 * @param holder - Describes the process holding the lock for errors.
 * @returns Function to release the lock.
 */var acquireLock=/*#__PURE__*/function(){var _acquireLock=state_asyncToGenerator(/*#__PURE__*/state_regenerator().m(function _callee3(pairDirectory,fileName,holder){var filePath,attempt,pid,_t3,_t4;return state_regenerator().w(function(_context3){while(1)switch(_context3.p=_context3.n){case 0:if(fileName===void 0){fileName=LOCK_FILE_NAME}if(holder===void 0){holder="Another synchronization of this pair is running"}_context3.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(pairDirectory,{recursive:true});case 1:filePath=__WEBPACK_EXTERNAL_MODULE_path_join__(pairDirectory,fileName);attempt=0;case 2:if(!(attempt<2)){_context3.n=10;break}_context3.p=3;_context3.n=4;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_writeFile__(filePath,String(process.pid),{flag:"wx"});case 4:return _context3.a(2,function(){return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(filePath,{force:true})});case 5:_context3.p=5;_t3=_context3.v;if(!(_t3.code!=="EEXIST")){_context3.n=6;break}throw _t3;case 6:_t4=Number;_context3.n=7;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__(filePath,{encoding:"utf-8"});case 7:pid=_t4(_context3.v);if(!(Number.isInteger(pid)&&pid>0&&isRunning(pid))){_context3.n=8;break}throw new LockedError("".concat(holder," (process ").concat(String(pid),")."));case 8:_context3.n=9;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(filePath,{force:true});case 9:attempt+=1;_context3.n=2;break;case 10:throw new LockedError("Could not acquire the synchronization lock.");case 11:return _context3.a(2)}},_callee3,null,[[3,5]])}));function acquireLock(_x6,_x7,_x8){return _acquireLock.apply(this,arguments)}return acquireLock}();/**
 * Moves given path, falling back to copy and delete across file systems.
 * @param source - Path to move.
 * @param target - New path.
 * @returns Promise resolving when moved.
 */var move=/*#__PURE__*/function(){var _move=state_asyncToGenerator(/*#__PURE__*/state_regenerator().m(function _callee4(source,target){var _t5;return state_regenerator().w(function(_context4){while(1)switch(_context4.p=_context4.n){case 0:_context4.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(__WEBPACK_EXTERNAL_MODULE_path_dirname__(target),{recursive:true});case 1:_context4.p=1;_context4.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rename__(source,target);case 2:_context4.n=6;break;case 3:_context4.p=3;_t5=_context4.v;if(!(_t5.code!=="EXDEV")){_context4.n=4;break}throw _t5;case 4:_context4.n=5;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_cp__(source,target,{preserveTimestamps:true,recursive:true,verbatimSymlinks:true});case 5:_context4.n=6;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(source,{force:true,recursive:true});case 6:return _context4.a(2)}},_callee4,null,[[1,3]])}));function move(_x9,_x0){return _move.apply(this,arguments)}return move}();/**
 * Determines the trash directory for given side and synchronization run.
 * Vault files stay encrypted in the trash.
 * @param pairDirectory - Directory of the pair.
 * @param date - Time of the synchronization.
 * @param side - Side the trashed entries belong to.
 * @returns Absolute directory path.
 */var getTrashDirectory=function getTrashDirectory(pairDirectory,date,side){return __WEBPACK_EXTERNAL_MODULE_path_join__(pairDirectory,TRASH_DIRECTORY_NAME,// NOTE: Sortable and valid on every platform.
date.toISOString().replace(/:/g,"-"),side==="plain"?"plaintext":"vault")};/**
 * Removes trash of synchronization runs older than given number of days.
 * @param pairDirectory - Directory of the pair.
 * @param retentionInDays - Days to keep trashed entries.
 * @param now - Current time.
 * @returns Promise resolving when purged.
 */var purgeTrash=/*#__PURE__*/function(){var _purgeTrash=state_asyncToGenerator(/*#__PURE__*/state_regenerator().m(function _callee5(pairDirectory,retentionInDays,now){var trashPath,names,limit,_iterator,_step,name,timestamp,_t6,_t7;return state_regenerator().w(function(_context5){while(1)switch(_context5.p=_context5.n){case 0:if(retentionInDays===void 0){retentionInDays=DEFAULT_TRASH_RETENTION_IN_DAYS}if(now===void 0){now=new Date}trashPath=__WEBPACK_EXTERNAL_MODULE_path_join__(pairDirectory,TRASH_DIRECTORY_NAME);_context5.p=1;_context5.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readdir__(trashPath);case 2:names=_context5.v;_context5.n=4;break;case 3:_context5.p=3;_t6=_context5.v;return _context5.a(2);case 4:limit=now.getTime()-retentionInDays*24*60*60*1000;_iterator=state_createForOfIteratorHelper(names);_context5.p=5;_iterator.s();case 6:if((_step=_iterator.n()).done){_context5.n=8;break}name=_step.value;timestamp=Date.parse(name.replace(/T(\d\d)-(\d\d)-(\d\d)/,"T$1:$2:$3"));if(!(!Number.isNaN(timestamp)&&timestamp<limit)){_context5.n=7;break}_context5.n=7;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(__WEBPACK_EXTERNAL_MODULE_path_join__(trashPath,name),{force:true,recursive:true});case 7:_context5.n=6;break;case 8:_context5.n=10;break;case 9:_context5.p=9;_t7=_context5.v;_iterator.e(_t7);case 10:_context5.p=10;_iterator.f();return _context5.f(10);case 11:return _context5.a(2)}},_callee5,null,[[5,9,10,11],[1,3]])}));function purgeTrash(_x1,_x10,_x11){return _purgeTrash.apply(this,arguments)}return purgeTrash}();
;// ./src/daemon.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module daemon *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||daemon_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(r){var e="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){for(var t,o=[],a=e.call(r);!(t=a.next()).done;)o.push(t.value);return o}}function _arrayWithoutHoles(a){if(Array.isArray(a))return daemon_arrayLikeToArray(a)}function daemon_createForOfIteratorHelper(e,t){var _n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!_n){if(Array.isArray(e)||(_n=daemon_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){_n&&(e=_n);var o=0,F=function F(){};return{s:F,n:function n(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u,i=!0;return{s:function s(){_n=_n.call(e)},n:function n(){i=!0;var r=_n.next();return r.done?{done:!0}:{value:r.value,done:i=!1}},e:function e(r){a=!0,u=r},f:function f(){try{i||null==_n.return||_n.return()}finally{if(a)throw u}}}}function daemon_unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return daemon_arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?daemon_arrayLikeToArray(t,e):void 0}}function daemon_arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}function daemon_regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return daemon_regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?i<3?(i>1&&(G.n=-1),l(i,u)):G.n=u:G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(daemon_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,daemon_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,daemon_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),daemon_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",daemon_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),daemon_regeneratorDefine2(f),daemon_regeneratorDefine2(f,a,"Generator"),daemon_regeneratorDefine2(f,n,function(){return this}),daemon_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(daemon_regenerator=function _regenerator(){return{w:i,m:p}})()}function daemon_regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}daemon_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){daemon_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},daemon_regeneratorDefine2(e,r,n,t)}function daemon_asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function daemon_asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){daemon_asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){daemon_asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}};// endregion
// Waits for this long without further changes before synchronizing.
var QUIET_PERIOD_IN_MILLISECONDS=2*1000;// Synchronizes at the latest after this long while changes keep coming.
var MAXIMAL_CHANGE_DELAY_IN_MILLISECONDS=30*1000;// Restarts a failed watcher after this long.
var WATCH_RETRY_INTERVAL_IN_MILLISECONDS=5*60*1000;// Retries a run after this long while another process synchronizes the pair.
var LOCKED_RETRY_INTERVAL_IN_MILLISECONDS=10*1000;/**
 * Waits given time or until given signal aborts.
 * @param milliseconds - Time to wait.
 * @param signal - Abort signal.
 * @returns Promise resolving after the time or on abort.
 */var sleep=function sleep(milliseconds,signal){return new Promise(function(resolve){if(signal.aborted){resolve();return}var _done=function done(){clearTimeout(timer);signal.removeEventListener("abort",_done);resolve()};var timer=setTimeout(_done,milliseconds);signal.addEventListener("abort",_done)})};/**
 * Synchronizes all given pairs right away and afterwards each one shortly
 * after changes (if watched) or at the latest in its own interval until given
 * signal aborts. Runs never overlap, so a slow pair delays the others instead
 * of competing for disk and cpu. Failures are logged and retried in the next
 * interval (shortly if another process synchronizes the pair), failed
 * watchers get restarted periodically.
 * @param options - Pairs, synchronization, watching and logging.
 * @returns Promise resolving after the abort when no run is active anymore.
 */var runDaemon=/*#__PURE__*/function(){var _runDaemon=daemon_asyncToGenerator(/*#__PURE__*/daemon_regenerator().m(function _callee2(options){var LOCKED_RETRY_INTERVAL,MAXIMAL_CHANGE_DELAY,QUIET_PERIOD,WATCH_RETRY_INTERVAL,isSynchronized,_options$lockedRetryI,lockedRetryIntervalInMilliseconds,log,_options$maximalChang,maximalChangeDelayInMilliseconds,pairs,_options$quietPeriodI,quietPeriodInMilliseconds,signal,synchronizePair,watchPair,_options$watchRetryIn,watchRetryIntervalInMilliseconds,states,getState,wakeUp,getMessage,getSynchronizationDueAt,isAlreadySynchronized,stopWatching,startWatching,isStopped,_iterator,_step,pair,state,changes,isDueByChangesOnly,nextRunIn,summary,nextAt,_iterator2,_step2,_state$watcher,_state,_t2,_t3,_t4;return daemon_regenerator().w(function(_context2){while(1)switch(_context2.p=_context2.n){case 0:LOCKED_RETRY_INTERVAL=LOCKED_RETRY_INTERVAL_IN_MILLISECONDS;MAXIMAL_CHANGE_DELAY=MAXIMAL_CHANGE_DELAY_IN_MILLISECONDS;QUIET_PERIOD=QUIET_PERIOD_IN_MILLISECONDS;WATCH_RETRY_INTERVAL=WATCH_RETRY_INTERVAL_IN_MILLISECONDS;isSynchronized=options.isSynchronized,_options$lockedRetryI=options.lockedRetryIntervalInMilliseconds,lockedRetryIntervalInMilliseconds=_options$lockedRetryI===void 0?LOCKED_RETRY_INTERVAL:_options$lockedRetryI,log=options.log,_options$maximalChang=options.maximalChangeDelayInMilliseconds,maximalChangeDelayInMilliseconds=_options$maximalChang===void 0?MAXIMAL_CHANGE_DELAY:_options$maximalChang,pairs=options.pairs,_options$quietPeriodI=options.quietPeriodInMilliseconds,quietPeriodInMilliseconds=_options$quietPeriodI===void 0?QUIET_PERIOD:_options$quietPeriodI,signal=options.signal,synchronizePair=options.synchronizePair,watchPair=options.watchPair,_options$watchRetryIn=options.watchRetryIntervalInMilliseconds,watchRetryIntervalInMilliseconds=_options$watchRetryIn===void 0?WATCH_RETRY_INTERVAL:_options$watchRetryIn;states=new Map(pairs.map(function(pair){return[pair.name,{changes:new Map,dueAt:0,watchAt:watchPair&&pair.watch?0:undefined,watchFailed:false}]}));getState=function getState(pair){return states.get(pair.name)};// Interrupts waiting when something changed.
wakeUp=new AbortController;getMessage=function getMessage(error){return error instanceof Error?error.message:String(error)};getSynchronizationDueAt=function getSynchronizationDueAt(state){var _state$lastChangedAt;return state.changedAt===undefined?state.dueAt:Math.min(state.dueAt,((_state$lastChangedAt=state.lastChangedAt)!==null&&_state$lastChangedAt!==void 0?_state$lastChangedAt:state.changedAt)+quietPeriodInMilliseconds,state.changedAt+maximalChangeDelayInMilliseconds)};// NOTE: Any doubt (including a failing check) leads to a run.
isAlreadySynchronized=/*#__PURE__*/function(){var _isAlreadySynchronized=daemon_asyncToGenerator(/*#__PURE__*/daemon_regenerator().m(function _callee(pair,changes){var _t;return daemon_regenerator().w(function(_context){while(1)switch(_context.p=_context.n){case 0:if(!(!isSynchronized||changes.length===0)){_context.n=1;break}return _context.a(2,false);case 1:_context.p=1;_context.n=2;return isSynchronized(pair,changes);case 2:return _context.a(2,_context.v);case 3:_context.p=3;_t=_context.v;return _context.a(2,false)}},_callee,null,[[1,3]])}));function isAlreadySynchronized(_x2,_x3){return _isAlreadySynchronized.apply(this,arguments)}return isAlreadySynchronized}();stopWatching=function stopWatching(pair,error){var state=getState(pair);// NOTE: Both sides may report the same problem.
if(!state.watcher)return;state.watcher.close();state.watcher=undefined;state.watchAt=Date.now()+watchRetryIntervalInMilliseconds;state.watchFailed=true;log("\"".concat(pair.name,"\": watching for changes failed ")+"(".concat(getMessage(error),"), synchronizing in its interval until ")+"watching works again.");wakeUp.abort()};startWatching=function startWatching(pair){var state=getState(pair);try{var watcher=watchPair(pair,function(change){var _state$changedAt;var now=Date.now();(_state$changedAt=state.changedAt)!==null&&_state$changedAt!==void 0?_state$changedAt:state.changedAt=now;state.lastChangedAt=now;state.changes.set(JSON.stringify([change.side,change.path]),change);wakeUp.abort()},function(error){stopWatching(pair,error)});state.watcher=watcher;state.watchAt=undefined;if(state.watchFailed){state.watchFailed=false;log("\"".concat(pair.name,"\": watching for changes again."));// Catch up with changes missed in the meantime.
state.dueAt=Date.now()}}catch(error){state.watchAt=Date.now()+watchRetryIntervalInMilliseconds;// Repeated failures are only logged once.
if(!state.watchFailed){state.watchFailed=true;log("\"".concat(pair.name,"\": watching for changes failed ")+"(".concat(getMessage(error),"), synchronizing in its interval ")+"until watching works again.")}}};log("Started synchronizing ".concat(pairs.map(function(pair){return"\"".concat(pair.name,"\" every ")+"".concat(String(pair.intervalInMilliseconds/1000),"s")+(getState(pair).watchAt===undefined?"":" and on changes")}).join(", "),"."));// NOTE: A function to not let the compiler narrow the flag once.
isStopped=function isStopped(){return signal.aborted};_context2.p=1;case 2:if(isStopped()){_context2.n=19;break}_iterator=daemon_createForOfIteratorHelper(pairs);_context2.p=3;_iterator.s();case 4:if((_step=_iterator.n()).done){_context2.n=14;break}pair=_step.value;if(!isStopped()){_context2.n=5;break}return _context2.a(3,14);case 5:state=getState(pair);if(!(getSynchronizationDueAt(state)<=Date.now())){_context2.n=12;break}changes=_toConsumableArray(state.changes.values());isDueByChangesOnly=state.dueAt>Date.now();/*
                        NOTE: Changes during the run (including our own
                        writes) get collected for the next check.
                    */state.changedAt=undefined;state.lastChangedAt=undefined;state.changes=new Map;// Skips runs only caused by our own (former) writes.
_t2=!isDueByChangesOnly;if(_t2){_context2.n=7;break}_context2.n=6;return isAlreadySynchronized(pair,changes);case 6:_t2=!_context2.v;case 7:if(!_t2){_context2.n=12;break}nextRunIn=pair.intervalInMilliseconds;_context2.p=8;_context2.n=9;return synchronizePair(pair);case 9:summary=_context2.v;if(summary)log("\"".concat(pair.name,"\": ").concat(summary));_context2.n=11;break;case 10:_context2.p=10;_t3=_context2.v;if(_t3 instanceof LockedError){/*
                                    NOTE: A full run follows, so the
                                    collected changes are covered.
                                */nextRunIn=Math.min(nextRunIn,lockedRetryIntervalInMilliseconds);log("\"".concat(pair.name,"\": ").concat(_t3.message," ")+"Retrying in ".concat(String(nextRunIn/1000),"s."))}else log("\"".concat(pair.name,"\" failed: ")+getMessage(_t3));case 11:state.dueAt=Date.now()+nextRunIn;case 12:// NOTE: Started after the first run created missing roots.
if(!isStopped()&&state.watchAt!==undefined&&state.watchAt<=Date.now())startWatching(pair);case 13:_context2.n=4;break;case 14:_context2.n=16;break;case 15:_context2.p=15;_t4=_context2.v;_iterator.e(_t4);case 16:_context2.p=16;_iterator.f();return _context2.f(16);case 17:nextAt=Math.min.apply(Math,_toConsumableArray(_toConsumableArray(states.values()).map(function(state){var _state$watchAt;return Math.min(getSynchronizationDueAt(state),(_state$watchAt=state.watchAt)!==null&&_state$watchAt!==void 0?_state$watchAt:Infinity)})));_context2.n=18;return sleep(Math.max(0,nextAt-Date.now()),AbortSignal.any([signal,wakeUp.signal]));case 18:if(wakeUp.signal.aborted)wakeUp=new AbortController;_context2.n=2;break;case 19:_context2.p=19;_iterator2=daemon_createForOfIteratorHelper(states.values());try{for(_iterator2.s();!(_step2=_iterator2.n()).done;){_state=_step2.value;(_state$watcher=_state.watcher)===null||_state$watcher===void 0||_state$watcher.close()}}catch(err){_iterator2.e(err)}finally{_iterator2.f()}return _context2.f(19);case 20:log("Stopped.");case 21:return _context2.a(2)}},_callee2,null,[[8,10],[3,15,16,17],[1,,19,20]])}));function runDaemon(_x){return _runDaemon.apply(this,arguments)}return runDaemon}();
;// ./src/exclude.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module exclude *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
// endregion
/**
 * Creates a matcher for gitignore like glob patterns ("*", "**", "?",
 * "[...]" and "{a,b}"):
 *
 * - Patterns without a slash match the name at any depth ("*.tmp").
 * - Patterns containing a slash match the path relative to the root
 *   ("docs/*.pdf"), a leading slash only anchors ("/build").
 * - A trailing slash only matches directories ("cache/").
 *
 * Matching is case insensitive on platforms with case insensitive file
 * systems by default (macOS, Windows).
 * @param patterns - Glob patterns.
 * @returns Function checking a relative posix path.
 */var createExcludeMatcher=function createExcludeMatcher(patterns){var rules=patterns.map(function(pattern){var glob=pattern.trim();if(glob===""||glob==="/")throw new Error("Invalid exclude pattern \"".concat(pattern,"\"."));var directoryOnly=glob.endsWith("/");if(directoryOnly)glob=glob.slice(0,-1);var anchored=glob.startsWith("/")||glob.includes("/");if(glob.startsWith("/"))glob=glob.slice(1);return{anchored:anchored,directoryOnly:directoryOnly,glob:glob}});return function(relativePath,isDirectory){return rules.some(function(_ref){var anchored=_ref.anchored,directoryOnly=_ref.directoryOnly,glob=_ref.glob;return(!directoryOnly||isDirectory)&&__WEBPACK_EXTERNAL_MODULE_path_posix__.matchesGlob(anchored?relativePath:__WEBPACK_EXTERNAL_MODULE_path_posix__.basename(relativePath),glob)})}};/**
 * Matcher excluding nothing.
 * @returns Always false.
 */var excludeNothing=function excludeNothing(){return false};
;// external "child_process"

;// ./src/keychain.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module keychain *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function keychain_typeof(o){"@babel/helpers - typeof";return keychain_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},keychain_typeof(o)}function keychain_toConsumableArray(a){return keychain_arrayWithoutHoles(a)||keychain_iterableToArray(a)||keychain_unsupportedIterableToArray(a)||keychain_nonIterableSpread()}function keychain_nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function keychain_unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return keychain_arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?keychain_arrayLikeToArray(t,e):void 0}}function keychain_iterableToArray(r){var e="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){for(var t,o=[],a=e.call(r);!(t=a.next()).done;)o.push(t.value);return o}}function keychain_arrayWithoutHoles(a){if(Array.isArray(a))return keychain_arrayLikeToArray(a)}function keychain_arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}function keychain_regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return keychain_regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?i<3?(i>1&&(G.n=-1),l(i,u)):G.n=u:G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(keychain_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,keychain_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,keychain_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),keychain_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",keychain_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),keychain_regeneratorDefine2(f),keychain_regeneratorDefine2(f,a,"Generator"),keychain_regeneratorDefine2(f,n,function(){return this}),keychain_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(keychain_regenerator=function _regenerator(){return{w:i,m:p}})()}function keychain_regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}keychain_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){keychain_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},keychain_regeneratorDefine2(e,r,n,t)}function keychain_asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function keychain_asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){keychain_asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){keychain_asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}}function keychain_defineProperties(r,t){for(var o=0;o<t.length;o++){var i=t[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(r,keychain_toPropertyKey(i.key),i)}}function keychain_createClass(e,r,t){return r&&keychain_defineProperties(e.prototype,r),t&&keychain_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function keychain_classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}function keychain_inherits(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(r&&r.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),r&&keychain_setPrototypeOf(t,r)}function keychain_callSuper(e,c,p){return c=keychain_getPrototypeOf(c),keychain_possibleConstructorReturn(e,keychain_isNativeReflectConstruct()?Reflect.construct(c,p||[],keychain_getPrototypeOf(e).constructor):c.apply(e,p))}function keychain_possibleConstructorReturn(t,e){if(e&&("object"==keychain_typeof(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return keychain_assertThisInitialized(t)}function keychain_assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function keychain_wrapNativeSuper(p){var n="function"==typeof Map?new Map:void 0;return keychain_wrapNativeSuper=function _wrapNativeSuper(p){if(null===p||!keychain_isNativeFunction(p))return p;if("function"!=typeof p)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(p))return n.get(p);n.set(p,Wrapper)}function Wrapper(){return keychain_construct(p,arguments,keychain_getPrototypeOf(this).constructor)}return Wrapper.prototype=Object.create(p.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),keychain_setPrototypeOf(Wrapper,p)},keychain_wrapNativeSuper(p)}function keychain_construct(e,o,p){if(keychain_isNativeReflectConstruct())return Reflect.construct.apply(null,arguments);var n=[null];n.push.apply(n,o);var l=new(e.bind.apply(e,n));return p&&keychain_setPrototypeOf(l,p.prototype),l}function keychain_isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch(t){}return(keychain_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function keychain_isNativeFunction(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(n){return"function"==typeof t}}function keychain_setPrototypeOf(t,e){return keychain_setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},keychain_setPrototypeOf(t,e)}function keychain_getPrototypeOf(t){return keychain_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},keychain_getPrototypeOf(t)}function keychain_defineProperty(r,t,o){return(t=keychain_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function keychain_toPropertyKey(r){var o=keychain_toPrimitive(r,"string");return"symbol"==keychain_typeof(o)?o:o+""}function keychain_toPrimitive(t,e){if("object"!=keychain_typeof(t)||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=keychain_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)};// endregion
/*
    Stores passwords in the operating system's credential store without
    native modules by using the tools every user can run:

    - macOS: "security" (login keychain)
    - Linux: "secret-tool" (Secret Service, e.g. GNOME Keyring, KWallet)
    - Windows: PowerShell's DPAPI binding ("ConvertFrom-SecureString"), only
      the current user on the current machine can decrypt the stored blob.

    Secrets are always handed over via standard input, never as command line
    argument (visible in process listings). They are stored hex encoded to
    avoid any quoting or console encoding issues.
*/var KeychainError=/*#__PURE__*/function(_Error){function KeychainError(){var _this;keychain_classCallCheck(this,KeychainError);for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key]}_this=keychain_callSuper(this,KeychainError,[].concat(args));keychain_defineProperty(_this,"name","KeychainError");return _this}keychain_inherits(KeychainError,_Error);return keychain_createClass(KeychainError)}(/*#__PURE__*/keychain_wrapNativeSuper(Error));/**
 * Runs given command without shell, feeding given input to it.
 * @param command - Program to run.
 * @param parameters - Its arguments.
 * @param input - Standard input content.
 * @returns Exit code and outputs.
 */var runCommand=function runCommand(command,parameters,input){return new Promise(function(resolve,reject){var child=__WEBPACK_EXTERNAL_MODULE_child_process_spawn__(command,parameters,{stdio:["pipe","pipe","pipe"],windowsHide:true});var stdout=[];var stderr=[];child.stdout.on("data",function(chunk){return stdout.push(chunk)});child.stderr.on("data",function(chunk){return stderr.push(chunk)});child.on("error",function(error){reject(error.code==="ENOENT"?new KeychainError("\"".concat(command,"\" is not available on this system, use a ")+"password file or command instead."):error)});child.on("close",function(code){resolve({code:code,stderr:Buffer.concat(stderr).toString("utf-8"),stdout:Buffer.concat(stdout).toString("utf-8")})});child.stdin.end(input!==null&&input!==void 0?input:"")})};var encode=function encode(password){return Buffer.from(password,"utf-8").toString("hex")};var decode=function decode(secret){var hex=secret.trim();if(!/^(?:[0-9a-f]{2})+$/.test(hex))throw new KeychainError("Stored password has an unexpected format.");return Buffer.from(hex,"hex").toString("utf-8")};var keychain_check=function check(result,action,name){if(result.code!==0)throw new KeychainError("Could not ".concat(action," the password of \"").concat(name,"\" ")+"(".concat(result.stderr.trim()||"exit code ".concat(String(result.code)),")."));return result};/**
 * Creates a keychain for the macOS login keychain.
 * @param run - Command runner.
 * @returns Keychain.
 */var createMacOSKeychain=function createMacOSKeychain(run){if(run===void 0){run=runCommand}return{delete:function(){var _delete2=keychain_asyncToGenerator(/*#__PURE__*/keychain_regenerator().m(function _callee(name){var _t;return keychain_regenerator().w(function(_context){while(1)switch(_context.n){case 0:_t=keychain_check;_context.n=1;return run("security",["delete-generic-password","-a",name,"-s",APPLICATION_NAME]);case 1:_t(_context.v,"delete",name);case 2:return _context.a(2)}},_callee)}));function _delete(_x){return _delete2.apply(this,arguments)}return _delete}(),load:function(){var _load=keychain_asyncToGenerator(/*#__PURE__*/keychain_regenerator().m(function _callee2(name){var _t2,_t3;return keychain_regenerator().w(function(_context2){while(1)switch(_context2.n){case 0:_t2=decode;_t3=keychain_check;_context2.n=1;return run("security",["find-generic-password","-a",name,"-s",APPLICATION_NAME,"-w"]);case 1:return _context2.a(2,_t2(_t3(_context2.v,"load",name).stdout))}},_callee2)}));function load(_x2){return _load.apply(this,arguments)}return load}(),store:function(){var _store=keychain_asyncToGenerator(/*#__PURE__*/keychain_regenerator().m(function _callee3(name,password){var _t4;return keychain_regenerator().w(function(_context3){while(1)switch(_context3.n){case 0:_t4=keychain_check;_context3.n=1;return run("security",["-i"],"add-generic-password -U -a ".concat(name," -s ").concat(APPLICATION_NAME," ")+"-l ".concat(APPLICATION_NAME,"-").concat(name," -w ").concat(encode(password),"\n"));case 1:_t4(_context3.v,"store",name);case 2:return _context3.a(2)}},_callee3)}));function store(_x3,_x4){return _store.apply(this,arguments)}return store}()}};/**
 * Creates a keychain for the freedesktop Secret Service.
 * @param run - Command runner.
 * @returns Keychain.
 */var createLinuxKeychain=function createLinuxKeychain(run){if(run===void 0){run=runCommand}var attributes=function attributes(name){return["service",APPLICATION_NAME,"account",name]};return{delete:function(){var _delete3=keychain_asyncToGenerator(/*#__PURE__*/keychain_regenerator().m(function _callee4(name){var _t5;return keychain_regenerator().w(function(_context4){while(1)switch(_context4.n){case 0:_t5=keychain_check;_context4.n=1;return run("secret-tool",["clear"].concat(keychain_toConsumableArray(attributes(name))));case 1:_t5(_context4.v,"delete",name);case 2:return _context4.a(2)}},_callee4)}));function _delete(_x5){return _delete3.apply(this,arguments)}return _delete}(),load:function(){var _load2=keychain_asyncToGenerator(/*#__PURE__*/keychain_regenerator().m(function _callee5(name){var _t6,_t7;return keychain_regenerator().w(function(_context5){while(1)switch(_context5.n){case 0:_t6=decode;_t7=keychain_check;_context5.n=1;return run("secret-tool",["lookup"].concat(keychain_toConsumableArray(attributes(name))));case 1:return _context5.a(2,_t6(_t7(_context5.v,"load",name).stdout))}},_callee5)}));function load(_x6){return _load2.apply(this,arguments)}return load}(),store:function(){var _store2=keychain_asyncToGenerator(/*#__PURE__*/keychain_regenerator().m(function _callee6(name,password){var _t8;return keychain_regenerator().w(function(_context6){while(1)switch(_context6.n){case 0:_t8=keychain_check;_context6.n=1;return run("secret-tool",["store","--label=".concat(APPLICATION_NAME," ").concat(name)].concat(keychain_toConsumableArray(attributes(name))),encode(password));case 1:_t8(_context6.v,"store",name);case 2:return _context6.a(2)}},_callee6)}));function store(_x7,_x8){return _store2.apply(this,arguments)}return store}()}};/**
 * Creates a keychain storing DPAPI protected blobs in the configuration
 * directory.
 * @param configurationDirectory - Application configuration directory.
 * @param run - Command runner.
 * @returns Keychain.
 */var createWindowsKeychain=function createWindowsKeychain(configurationDirectory,run){if(configurationDirectory===void 0){configurationDirectory=getConfigurationDirectory()}if(run===void 0){run=runCommand}var getPath=function getPath(name){return __WEBPACK_EXTERNAL_MODULE_path_join__(configurationDirectory,"credentials","".concat(name,".dpapi"))};var powerShell=function powerShell(script,input){return run("powershell.exe",["-NoLogo","-NoProfile","-NonInteractive","-Command",script],"".concat(input,"\n"))};return{delete:function _delete(name){return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(getPath(name),{force:true})},load:function(){var _load3=keychain_asyncToGenerator(/*#__PURE__*/keychain_regenerator().m(function _callee7(name){var blob,_t9,_t0,_t1;return keychain_regenerator().w(function(_context7){while(1)switch(_context7.p=_context7.n){case 0:_context7.p=0;_context7.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__(getPath(name),{encoding:"utf-8"});case 1:blob=_context7.v;_context7.n=3;break;case 2:_context7.p=2;_t9=_context7.v;throw new KeychainError("No password of \"".concat(name,"\" stored in the keychain."));case 3:_t0=decode;_t1=keychain_check;_context7.n=4;return powerShell("$secure = ConvertTo-SecureString -String "+"(@($input)[0]); "+"(New-Object "+"System.Management.Automation.PSCredential 'x',"+" $secure).GetNetworkCredential().Password",blob.trim());case 4:return _context7.a(2,_t0(_t1(_context7.v,"load",name).stdout))}},_callee7,null,[[0,2]])}));function load(_x9){return _load3.apply(this,arguments)}return load}(),store:function(){var _store3=keychain_asyncToGenerator(/*#__PURE__*/keychain_regenerator().m(function _callee8(name,password){var blob,_t10;return keychain_regenerator().w(function(_context8){while(1)switch(_context8.n){case 0:_t10=keychain_check;_context8.n=1;return powerShell("ConvertTo-SecureString -String (@($input)[0]) "+"-AsPlainText -Force | ConvertFrom-SecureString",encode(password));case 1:blob=_t10(_context8.v,"store",name).stdout.trim();_context8.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(__WEBPACK_EXTERNAL_MODULE_path_join__(configurationDirectory,"credentials"),{recursive:true});case 2:_context8.n=3;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_writeFile__(getPath(name),"".concat(blob,"\n"),{mode:384});case 3:return _context8.a(2)}},_callee8)}));function store(_x0,_x1){return _store3.apply(this,arguments)}return store}()}};/**
 * Creates the keychain of the current platform.
 * @param platform - Operating system.
 * @param configurationDirectory - Application configuration directory.
 * @param run - Command runner.
 * @returns Keychain.
 */var createKeychain=function createKeychain(platform,configurationDirectory,run){if(platform===void 0){platform=process.platform}if(run===void 0){run=runCommand}if(platform==="darwin")return createMacOSKeychain(run);if(platform==="win32")return createWindowsKeychain(configurationDirectory,run);return createLinuxKeychain(run)};
;// ./src/password.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module password *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function password_regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return password_regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?i<3?(i>1&&(G.n=-1),l(i,u)):G.n=u:G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(password_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,password_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,password_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),password_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",password_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),password_regeneratorDefine2(f),password_regeneratorDefine2(f,a,"Generator"),password_regeneratorDefine2(f,n,function(){return this}),password_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(password_regenerator=function _regenerator(){return{w:i,m:p}})()}function password_regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}password_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){password_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},password_regeneratorDefine2(e,r,n,t)}function password_asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function password_asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){password_asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){password_asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}}function password_createForOfIteratorHelper(e,t){var _n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!_n){if(Array.isArray(e)||(_n=password_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){_n&&(e=_n);var o=0,F=function F(){};return{s:F,n:function n(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u,i=!0;return{s:function s(){_n=_n.call(e)},n:function n(){i=!0;var r=_n.next();return r.done?{done:!0}:{value:r.value,done:i=!1}},e:function e(r){a=!0,u=r},f:function f(){try{i||null==_n.return||_n.return()}finally{if(a)throw u}}}}function password_unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return password_arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?password_arrayLikeToArray(t,e):void 0}}function password_arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n};// endregion
var PASSWORD_ENVIRONMENT_VARIABLE_NAME="GOCRYPTFS_PASSWORD";/**
 * Takes the first line of given text like gocryptfs does for "-passfile" and
 * "-extpass".
 * @param text - Text to extract the password from.
 * @param source - Source description for error messages.
 * @returns Password.
 */var getFirstLine=function getFirstLine(text,source){var password=text.split(/\r?\n/,1)[0];if(password==="")throw new Error("Password from ".concat(source," is empty."));return password};/**
 * Runs given shell command and returns the first line of its output.
 * @param command - Command line to run.
 * @returns Password.
 */var runExternalProgram=function runExternalProgram(command){return new Promise(function(resolve,reject){var child=__WEBPACK_EXTERNAL_MODULE_child_process_spawn__(command,{shell:true,stdio:["inherit","pipe","inherit"]});var chunks=[];child.stdout.on("data",function(chunk){chunks.push(chunk)});child.on("error",reject);child.on("close",function(code){if(code===0)try{resolve(getFirstLine(Buffer.concat(chunks).toString("utf-8"),"external program"))}catch(error){reject(error instanceof Error?error:new Error(String(error)))}else reject(new Error("External password program exited with code "+"".concat(String(code),".")))})})};/**
 * Reads a line from the terminal without echoing it.
 * @param question - Prompt to show.
 * @returns Entered text.
 */var promptHidden=function promptHidden(question){return new Promise(function(resolve,reject){var input=process.stdin;if(!input.isTTY){reject(new Error("No terminal available to ask for a password. Use "+"\"--passfile\", \"--extpass\" or \"".concat(PASSWORD_ENVIRONMENT_VARIABLE_NAME,"\".")));return}process.stderr.write(question);input.setRawMode(true);input.resume();input.setEncoding("utf-8");var value="";var finish=function finish(error){input.setRawMode(false);input.pause();input.removeListener("data",onData);process.stderr.write("\n");if(error)reject(error);else resolve(value)};var onData=function onData(data){var _iterator=password_createForOfIteratorHelper(data),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var character=_step.value;if(character==="\r"||character==="\n"){finish();return}else if(character==="\x03")finish(new Error("Aborted."));else if(character==="\x7F"||character==="\b")value=value.slice(0,-1);else value+=character}}catch(err){_iterator.e(err)}finally{_iterator.f()}};input.on("data",onData)})};/**
 * Determines the vault password from the first available source in order:
 * password file, external program, environment variable, interactive prompt.
 * @param sources - Configured sources.
 * @returns Password.
 */var getPassword=/*#__PURE__*/function(){var _getPassword=password_asyncToGenerator(/*#__PURE__*/password_regenerator().m(function _callee(sources){var _sources$environment,_sources$prompt;var environmentValue,prompt,password,_t,_t2,_t3,_t4;return password_regenerator().w(function(_context){while(1)switch(_context.n){case 0:if(!sources.file){_context.n=2;break}_t=getFirstLine;_context.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__(sources.file,{encoding:"utf-8"});case 1:return _context.a(2,_t(_context.v,"file \"".concat(sources.file,"\"")));case 2:if(!sources.externalProgram){_context.n=3;break}return _context.a(2,runExternalProgram(sources.externalProgram));case 3:environmentValue=((_sources$environment=sources.environment)!==null&&_sources$environment!==void 0?_sources$environment:process.env)[PASSWORD_ENVIRONMENT_VARIABLE_NAME];if(!environmentValue){_context.n=4;break}return _context.a(2,environmentValue);case 4:prompt=(_sources$prompt=sources.prompt)!==null&&_sources$prompt!==void 0?_sources$prompt:promptHidden;_context.n=5;return prompt("Password: ");case 5:password=_context.v;if(!(password==="")){_context.n=6;break}throw new Error("Password is empty.");case 6:_t2=sources.confirm;if(!_t2){_context.n=8;break}_context.n=7;return prompt("Repeat: ");case 7:_t3=_context.v;_t4=password;_t2=_t3!==_t4;case 8:if(!_t2){_context.n=9;break}throw new Error("Passwords do not match.");case 9:return _context.a(2,password)}},_callee)}));function getPassword(_x){return _getPassword.apply(this,arguments)}return getPassword}();/**
 * Determines the password of a configured pair from its source.
 * @param source - Configured password source.
 * @param name - Name of the pair.
 * @param keychain - Credential store to use for "keychain".
 * @param environment - Environment variables.
 * @param prompt - Interactive prompt to use for "prompt".
 * @returns Password.
 */var getPairPassword=/*#__PURE__*/function(){var _getPairPassword=password_asyncToGenerator(/*#__PURE__*/password_regenerator().m(function _callee2(source,name,keychain,environment,prompt){var password,_password,_t5;return password_regenerator().w(function(_context2){while(1)switch(_context2.n){case 0:if(environment===void 0){environment=process.env}if(prompt===void 0){prompt=promptHidden}if(!(source==="keychain")){_context2.n=1;break}return _context2.a(2,keychain.load(name));case 1:if(!(source==="environment")){_context2.n=3;break}password=environment[PASSWORD_ENVIRONMENT_VARIABLE_NAME];if(password){_context2.n=2;break}throw new Error("Pair \"".concat(name,"\" expects its password in ")+"\"".concat(PASSWORD_ENVIRONMENT_VARIABLE_NAME,"\"."));case 2:return _context2.a(2,password);case 3:if(!(source==="prompt")){_context2.n=6;break}_context2.n=4;return prompt("Password of \"".concat(name,"\": "));case 4:_password=_context2.v;if(!(_password==="")){_context2.n=5;break}throw new Error("Password is empty.");case 5:return _context2.a(2,_password);case 6:if(!("file"in source)){_context2.n=8;break}_t5=getFirstLine;_context2.n=7;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__(source.file,{encoding:"utf-8"});case 7:return _context2.a(2,_t5(_context2.v,"file \"".concat(source.file,"\"")));case 8:return _context2.a(2,runExternalProgram(source.command))}},_callee2)}));function getPairPassword(_x2,_x3,_x4,_x5,_x6){return _getPairPassword.apply(this,arguments)}return getPairPassword}();
;// ./src/service.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module service *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function service_typeof(o){"@babel/helpers - typeof";return service_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},service_typeof(o)}function service_ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function _objectSpread(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?service_ownKeys(Object(o),!0).forEach(function(t){service_defineProperty(r,t,o[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):service_ownKeys(Object(o)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(o,e))})}return r}function service_defineProperty(r,t,o){return(t=service_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function service_toPropertyKey(r){var o=service_toPrimitive(r,"string");return"symbol"==service_typeof(o)?o:o+""}function service_toPrimitive(t,e){if("object"!=service_typeof(t)||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=service_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}function service_regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return service_regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?i<3?(i>1&&(G.n=-1),l(i,u)):G.n=u:G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(service_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,service_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,service_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),service_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",service_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),service_regeneratorDefine2(f),service_regeneratorDefine2(f,a,"Generator"),service_regeneratorDefine2(f,n,function(){return this}),service_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(service_regenerator=function _regenerator(){return{w:i,m:p}})()}function service_regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}service_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){service_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},service_regeneratorDefine2(e,r,n,t)}function service_asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function service_asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){service_asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){service_asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}}function service_toConsumableArray(a){return service_arrayWithoutHoles(a)||service_iterableToArray(a)||service_unsupportedIterableToArray(a)||service_nonIterableSpread()}function service_nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function service_iterableToArray(r){var e="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){for(var t,o=[],a=e.call(r);!(t=a.next()).done;)o.push(t.value);return o}}function service_arrayWithoutHoles(a){if(Array.isArray(a))return service_arrayLikeToArray(a)}function _slicedToArray(e,i){return _iterableToArrayLimit(e,i)||service_unsupportedIterableToArray(e,i)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function service_unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return service_arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?service_arrayLikeToArray(t,e):void 0}}function service_arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}function _iterableToArrayLimit(r,t){var e=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){var l,n,i,a,u=[],o=!0,f=!1;try{if(i=(e=e.call(r)).next,0===t){if(Object(e)!==e)return;o=!1}else for(;!(o=(l=i.call(e)).done)&&(u.push(l.value),u.length!==t);o=!0);}catch(r){f=!0,n=r}finally{try{if(!o&&null!=e.return&&(a=e.return(),Object(a)!==a))return}finally{if(f)throw n}}return u}};// endregion
/*
    Per user autostart of "daemon" without admin rights:

    - macOS: launchd agent in "~/Library/LaunchAgents"
    - Linux: systemd user unit in "~/.config/systemd/user"
    - Windows: command file in the user's startup folder (Task Scheduler log
      on triggers need admin rights)
*/var LAUNCHD_LABEL="com.tsickert.".concat(APPLICATION_NAME);var LOG_FILE_NAME="daemon.log";/**
 * Determines how this application was started: a single executable or a
 * script run by node.
 * @param execPath - Path of the running executable.
 * @param argv - Process arguments.
 * @returns Program and arguments to start it again.
 */var getProgram=function getProgram(execPath,argv){if(execPath===void 0){execPath=process.execPath}if(argv===void 0){argv=process.argv}return argv[1]&&__WEBPACK_EXTERNAL_MODULE_path_resolve__(argv[1])!==execPath?[execPath,__WEBPACK_EXTERNAL_MODULE_path_resolve__(argv[1])]:[execPath]};/**
 * Escapes given text for xml content.
 * @param text - Text to escape.
 * @returns Escaped text.
 */var escapeXML=function escapeXML(text){return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")};/**
 * Creates the launchd agent definition.
 * @param program - Program and arguments to run.
 * @param logPath - File to write output to.
 * @param environment - Environment variables to set.
 * @returns Property list content.
 */var createLaunchdPlist=function createLaunchdPlist(program,logPath,environment){var strings=function strings(values){return values.map(function(value){return"        <string>".concat(escapeXML(value),"</string>")}).join("\n")};var variables=Object.entries(environment).map(function(_ref){var _ref2=_slicedToArray(_ref,2),key=_ref2[0],value=_ref2[1];return"        <key>".concat(escapeXML(key),"</key>\n")+"        <string>".concat(escapeXML(value),"</string>")}).join("\n");return"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n<dict>\n    <key>Label</key>\n    <string>".concat(LAUNCHD_LABEL,"</string>\n    <key>ProgramArguments</key>\n    <array>\n").concat(strings([].concat(service_toConsumableArray(program),["daemon"])),"\n    </array>\n    <key>EnvironmentVariables</key>\n    <dict>\n").concat(variables,"\n    </dict>\n    <key>RunAtLoad</key>\n    <true/>\n    <key>KeepAlive</key>\n    <dict>\n        <key>SuccessfulExit</key>\n        <false/>\n    </dict>\n    <key>ThrottleInterval</key>\n    <integer>60</integer>\n    <key>ProcessType</key>\n    <string>Background</string>\n    <key>StandardOutPath</key>\n    <string>").concat(escapeXML(logPath),"</string>\n    <key>StandardErrorPath</key>\n    <string>").concat(escapeXML(logPath),"</string>\n</dict>\n</plist>\n")};/**
 * Creates the systemd user unit.
 * @param program - Program and arguments to run.
 * @param environment - Environment variables to set.
 * @returns Unit file content.
 */var createSystemdUnit=function createSystemdUnit(program,environment){var quote=function quote(value){return"\"".concat(value.replace(/\\/g,"\\\\").replace(/"/g,"\\\""),"\"")};return"[Unit]\nDescription=".concat(APPLICATION_NAME,": synchronizes gocryptfs vaults\n\n[Service]\nExecStart=").concat([].concat(service_toConsumableArray(program),["daemon"]).map(quote).join(" "),"\n").concat(Object.entries(environment).map(function(_ref3){var _ref4=_slicedToArray(_ref3,2),key=_ref4[0],value=_ref4[1];return"Environment=".concat(quote("".concat(key,"=").concat(value)),"\n")}).join(""),"Restart=on-failure\nRestartSec=60\n\n[Install]\nWantedBy=default.target\n")};/**
 * Creates the windows startup command file starting the daemon minimized.
 * @param program - Program and arguments to run.
 * @param logPath - File to write output to.
 * @param environment - Environment variables to set.
 * @returns Command file content.
 */var createWindowsStartupScript=function createWindowsStartupScript(program,logPath,environment){return"@echo off\r\n"+Object.entries(environment).map(function(_ref5){var _ref6=_slicedToArray(_ref5,2),key=_ref6[0],value=_ref6[1];return"set \"".concat(key,"=").concat(value,"\"\r\n")}).join("")+"start \"".concat(APPLICATION_NAME,"\" /min cmd /c \"")+[].concat(service_toConsumableArray(program),["daemon"]).map(function(value){return"\"".concat(value,"\"")}).join(" ")+" >> \"".concat(logPath,"\" 2>&1\"\r\n")};/**
 * Checks whether given path exists.
 * @param path - Path to check.
 * @returns Indicates existence.
 */var service_exists=/*#__PURE__*/function(){var _exists=service_asyncToGenerator(/*#__PURE__*/service_regenerator().m(function _callee(path){var _t;return service_regenerator().w(function(_context){while(1)switch(_context.p=_context.n){case 0:_context.p=0;_context.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_stat__(path);case 1:return _context.a(2,true);case 2:_context.p=2;_t=_context.v;return _context.a(2,false)}},_callee,null,[[0,2]])}));function exists(_x){return _exists.apply(this,arguments)}return exists}();/**
 * Creates the autostart service of the current platform.
 * @param givenEnvironment - Platform details (defaults to the running one).
 * @returns Service controls, each resolving with a message for the user.
 */var createService=function createService(givenEnvironment){var _process$getuid,_process$getuid2,_process,_environment$environm2;if(givenEnvironment===void 0){givenEnvironment={}}var environment=_objectSpread({configurationDirectory:getConfigurationDirectory(),configurationDirectoryOverride:process.env[CONFIGURATION_DIRECTORY_ENVIRONMENT_VARIABLE_NAME],environment:process.env,home:__WEBPACK_EXTERNAL_MODULE_os_homedir__(),platform:process.platform,program:getProgram(),run:runCommand,uid:(_process$getuid=(_process$getuid2=(_process=process).getuid)===null||_process$getuid2===void 0?void 0:_process$getuid2.call(_process))!==null&&_process$getuid!==void 0?_process$getuid:__WEBPACK_EXTERNAL_MODULE_os_userInfo__().uid},givenEnvironment);var configurationDirectory=environment.configurationDirectory,home=environment.home,platform=environment.platform,program=environment.program,run=environment.run,uid=environment.uid;var logPath=__WEBPACK_EXTERNAL_MODULE_path_join__(configurationDirectory,LOG_FILE_NAME);var variables=environment.configurationDirectoryOverride?service_defineProperty({},CONFIGURATION_DIRECTORY_ENVIRONMENT_VARIABLE_NAME,environment.configurationDirectoryOverride):{};if(platform==="darwin"){var _path=__WEBPACK_EXTERNAL_MODULE_path_join__(home,"Library/LaunchAgents","".concat(LAUNCHD_LABEL,".plist"));var target="gui/".concat(String(uid));var service="".concat(target,"/").concat(LAUNCHD_LABEL);return{install:function(){var _install=service_asyncToGenerator(/*#__PURE__*/service_regenerator().m(function _callee2(){var result;return service_regenerator().w(function(_context2){while(1)switch(_context2.n){case 0:_context2.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(__WEBPACK_EXTERNAL_MODULE_path_join__(home,"Library/LaunchAgents"),{recursive:true});case 1:_context2.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(configurationDirectory,{recursive:true});case 2:_context2.n=3;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_writeFile__(_path,createLaunchdPlist(program,logPath,variables));case 3:_context2.n=4;return run("launchctl",["bootout",service]);case 4:_context2.n=5;return run("launchctl",["bootstrap",target,_path]);case 5:result=_context2.v;if(!(result.code!==0)){_context2.n=6;break}throw new Error("Could not load \"".concat(_path,"\": ").concat(result.stderr.trim()));case 6:return _context2.a(2,"Installed and started \"".concat(_path,"\", logging to ")+"\"".concat(logPath,"\"."))}},_callee2)}));function install(){return _install.apply(this,arguments)}return install}(),status:function(){var _status=service_asyncToGenerator(/*#__PURE__*/service_regenerator().m(function _callee3(){var _exec;var result,state;return service_regenerator().w(function(_context3){while(1)switch(_context3.n){case 0:_context3.n=1;return service_exists(_path);case 1:if(_context3.v){_context3.n=2;break}return _context3.a(2,"Not installed.");case 2:_context3.n=3;return run("launchctl",["print",service]);case 3:result=_context3.v;state=(_exec=/^\s*state = (.+)$/m.exec(result.stdout))===null||_exec===void 0?void 0:_exec[1];return _context3.a(2,"Installed (\"".concat(_path,"\"), ")+(result.code===0?"state: ".concat(state!==null&&state!==void 0?state:"unknown"):"not loaded")+", log: \"".concat(logPath,"\"."))}},_callee3)}));function status(){return _status.apply(this,arguments)}return status}(),uninstall:function(){var _uninstall=service_asyncToGenerator(/*#__PURE__*/service_regenerator().m(function _callee4(){return service_regenerator().w(function(_context4){while(1)switch(_context4.n){case 0:_context4.n=1;return run("launchctl",["bootout",service]);case 1:_context4.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(_path,{force:true});case 2:return _context4.a(2,"Stopped and removed \"".concat(_path,"\"."))}},_callee4)}));function uninstall(){return _uninstall.apply(this,arguments)}return uninstall}()}}if(platform==="win32"){var _environment$environm;var _path2=__WEBPACK_EXTERNAL_MODULE_path_join__((_environment$environm=environment.environment.APPDATA)!==null&&_environment$environm!==void 0?_environment$environm:__WEBPACK_EXTERNAL_MODULE_path_join__(home,"AppData/Roaming"),"Microsoft/Windows/Start Menu/Programs/Startup","".concat(APPLICATION_NAME,".cmd"));return{install:function(){var _install2=service_asyncToGenerator(/*#__PURE__*/service_regenerator().m(function _callee5(){return service_regenerator().w(function(_context5){while(1)switch(_context5.n){case 0:_context5.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(configurationDirectory,{recursive:true});case 1:_context5.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_writeFile__(_path2,createWindowsStartupScript(program,logPath,variables));case 2:__WEBPACK_EXTERNAL_MODULE_child_process_spawn__("cmd.exe",["/c",_path2],{detached:true,stdio:"ignore",windowsHide:true}).unref();return _context5.a(2,"Installed and started \"".concat(_path2,"\", logging to ")+"\"".concat(logPath,"\"."))}},_callee5)}));function install(){return _install2.apply(this,arguments)}return install}(),status:function(){var _status2=service_asyncToGenerator(/*#__PURE__*/service_regenerator().m(function _callee6(){var _t2;return service_regenerator().w(function(_context6){while(1)switch(_context6.n){case 0:_context6.n=1;return service_exists(_path2);case 1:if(!_context6.v){_context6.n=2;break}_t2="Installed (\"".concat(_path2,"\"), log: \"").concat(logPath,"\".");_context6.n=3;break;case 2:_t2="Not installed.";case 3:return _context6.a(2,_t2)}},_callee6)}));function status(){return _status2.apply(this,arguments)}return status}(),uninstall:function(){var _uninstall2=service_asyncToGenerator(/*#__PURE__*/service_regenerator().m(function _callee7(){return service_regenerator().w(function(_context7){while(1)switch(_context7.n){case 0:_context7.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(_path2,{force:true});case 1:return _context7.a(2,"Removed \"".concat(_path2,"\". A running daemon stops with the ")+"next log off or can be ended in the task manager.")}},_callee7)}));function uninstall(){return _uninstall2.apply(this,arguments)}return uninstall}()}}var unitName="".concat(APPLICATION_NAME,".service");var path=__WEBPACK_EXTERNAL_MODULE_path_join__((_environment$environm2=environment.environment.XDG_CONFIG_HOME)!==null&&_environment$environm2!==void 0?_environment$environm2:__WEBPACK_EXTERNAL_MODULE_path_join__(home,".config"),"systemd/user",unitName);var systemctl=/*#__PURE__*/function(){var _systemctl=service_asyncToGenerator(/*#__PURE__*/service_regenerator().m(function _callee8(parameters){var result;return service_regenerator().w(function(_context8){while(1)switch(_context8.n){case 0:_context8.n=1;return run("systemctl",["--user"].concat(service_toConsumableArray(parameters)));case 1:result=_context8.v;if(!(result.code!==0)){_context8.n=2;break}throw new Error("\"systemctl --user ".concat(parameters.join(" "),"\" failed: ")+result.stderr.trim());case 2:return _context8.a(2,result)}},_callee8)}));function systemctl(_x2){return _systemctl.apply(this,arguments)}return systemctl}();return{install:function(){var _install3=service_asyncToGenerator(/*#__PURE__*/service_regenerator().m(function _callee9(){return service_regenerator().w(function(_context9){while(1)switch(_context9.n){case 0:_context9.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(__WEBPACK_EXTERNAL_MODULE_path_join__(path,".."),{recursive:true});case 1:_context9.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_writeFile__(path,createSystemdUnit(program,variables));case 2:_context9.n=3;return systemctl(["daemon-reload"]);case 3:_context9.n=4;return systemctl(["enable","--now",unitName]);case 4:_context9.n=5;return systemctl(["restart",unitName]);case 5:return _context9.a(2,"Installed and started \"".concat(path,"\" (log: \"journalctl ")+"--user -u ".concat(unitName,"\"). To keep it running while logged ")+"out: \"loginctl enable-linger\".")}},_callee9)}));function install(){return _install3.apply(this,arguments)}return install}(),status:function(){var _status3=service_asyncToGenerator(/*#__PURE__*/service_regenerator().m(function _callee0(){var result;return service_regenerator().w(function(_context0){while(1)switch(_context0.n){case 0:_context0.n=1;return service_exists(path);case 1:if(_context0.v){_context0.n=2;break}return _context0.a(2,"Not installed.");case 2:_context0.n=3;return run("systemctl",["--user","is-active",unitName]);case 3:result=_context0.v;return _context0.a(2,"Installed (\"".concat(path,"\"), state: ").concat(result.stdout.trim(),"."))}},_callee0)}));function status(){return _status3.apply(this,arguments)}return status}(),uninstall:function(){var _uninstall3=service_asyncToGenerator(/*#__PURE__*/service_regenerator().m(function _callee1(){return service_regenerator().w(function(_context1){while(1)switch(_context1.n){case 0:_context1.n=1;return run("systemctl",["--user","disable","--now",unitName]);case 1:_context1.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(path,{force:true});case 2:_context1.n=3;return run("systemctl",["--user","daemon-reload"]);case 3:return _context1.a(2,"Stopped and removed \"".concat(path,"\"."))}},_callee1)}));function uninstall(){return _uninstall3.apply(this,arguments)}return uninstall}()}};
;// ./src/settings.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module settings *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function settings_regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return settings_regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?i<3?(i>1&&(G.n=-1),l(i,u)):G.n=u:G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(settings_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,settings_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,settings_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),settings_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",settings_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),settings_regeneratorDefine2(f),settings_regeneratorDefine2(f,a,"Generator"),settings_regeneratorDefine2(f,n,function(){return this}),settings_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(settings_regenerator=function _regenerator(){return{w:i,m:p}})()}function settings_regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}settings_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){settings_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},settings_regeneratorDefine2(e,r,n,t)}function settings_asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function settings_asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){settings_asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){settings_asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}}function settings_toConsumableArray(a){return settings_arrayWithoutHoles(a)||settings_iterableToArray(a)||settings_unsupportedIterableToArray(a)||settings_nonIterableSpread()}function settings_nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function settings_unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return settings_arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?settings_arrayLikeToArray(t,e):void 0}}function settings_iterableToArray(r){var e="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){for(var t,o=[],a=e.call(r);!(t=a.next()).done;)o.push(t.value);return o}}function settings_arrayWithoutHoles(a){if(Array.isArray(a))return settings_arrayLikeToArray(a)}function settings_arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}function settings_ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function settings_objectSpread(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?settings_ownKeys(Object(o),!0).forEach(function(t){settings_defineProperty(r,t,o[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):settings_ownKeys(Object(o)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(o,e))})}return r}function settings_defineProperty(r,t,o){return(t=settings_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function settings_toPropertyKey(r){var o=settings_toPrimitive(r,"string");return"symbol"==settings_typeof(o)?o:o+""}function settings_toPrimitive(t,e){if("object"!=settings_typeof(t)||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=settings_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}function settings_typeof(o){"@babel/helpers - typeof";return settings_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},settings_typeof(o)};// endregion
var SETTINGS_FILE_NAME="configuration.json";var DEFAULT_INTERVAL="10m";var MINIMAL_INTERVAL_IN_MILLISECONDS=10*1000;// Typical operating system and office leftovers not worth synchronizing.
var DEFAULT_EXCLUDES=[".DS_Store","._*",".~lock.*#","Thumbs.db","desktop.ini","~$*"];var PAIR_NAME_PATTERN=/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/;/**
 * Where a pair's password comes from:
 * - "keychain": operating system's credential store (see "keychain" module)
 * - "prompt": asked interactively (once per daemon start)
 * - "environment": environment variable "GOCRYPTFS_PASSWORD"
 * - {file}: first line of given file
 * - {command}: first line of given command's output.
 */// A pair with all defaults applied.
/**
 * Creates the settings of a fresh installation.
 * @returns Default settings.
 */var createSettings=function createSettings(){return{defaults:{excludes:[].concat(DEFAULT_EXCLUDES),interval:DEFAULT_INTERVAL,trashDays:30,watch:true},pairs:{}}};/**
 * Parses an interval like "30s", "10m", "2h" or a number of minutes.
 * @param value - Interval representation.
 * @returns Interval in milliseconds.
 */var parseInterval=function parseInterval(value){var _ref;var match=/^\s*(\d+(?:\.\d+)?)\s*(s|m|h)?\s*$/.exec(String(value));if(!match)throw new Error("Invalid interval \"".concat(String(value),"\" (examples: 30s, 10m, 2h)."));var milliseconds=Number(match[1])*{h:3600,m:60,s:1}[(_ref=match[2])!==null&&_ref!==void 0?_ref:"m"]*1000;if(milliseconds<MINIMAL_INTERVAL_IN_MILLISECONDS)throw new Error("Interval \"".concat(String(value),"\" is shorter than the minimum of ")+"".concat(String(MINIMAL_INTERVAL_IN_MILLISECONDS/1000)," seconds."));return milliseconds};/**
 * Validates a password source.
 * @param value - Value to check.
 * @returns Given value typed.
 */var validatePasswordSource=function validatePasswordSource(value){if(value==="environment"||value==="keychain"||value==="prompt")return value;if(settings_typeof(value)==="object"&&value!==null){var _ref2=value,command=_ref2.command,file=_ref2.file;if(typeof file==="string"&&file!==""&&command===undefined)return{file:file};if(typeof command==="string"&&command!==""&&file===undefined)return{command:command}}throw new Error("Invalid password source ".concat(JSON.stringify(value),", use \"keychain\", ")+"\"prompt\", \"environment\", {\"file\": \"<path>\"} or "+"{\"command\": \"<command line>\"}.")};/**
 * Applies defaults to given pair and validates it.
 * @param settings - All settings.
 * @param name - Name of the pair.
 * @returns Resolved pair.
 */var resolvePair=function resolvePair(settings,name){var _pair$trashDays,_pair$watch,_pair$excludes,_pair$interval,_pair$password;if(!Object.prototype.hasOwnProperty.call(settings.pairs,name))throw new Error("Unknown pair \"".concat(name,"\" (known: ").concat(Object.keys(settings.pairs).join(", ")||"none",")."));var pair=settings.pairs[name];if(typeof pair.plaintext!=="string"||typeof pair.vault!=="string")throw new Error("Pair \"".concat(name,"\" needs a \"plaintext\" and a \"vault\" path."));if(pair.config!==undefined&&(typeof pair.config!=="string"||pair.config===""))throw new Error("Pair \"".concat(name,"\": \"config\" has to be a path."));var trashDays=(_pair$trashDays=pair.trashDays)!==null&&_pair$trashDays!==void 0?_pair$trashDays:settings.defaults.trashDays;if(!Number.isInteger(trashDays)||trashDays<0)throw new Error("Pair \"".concat(name,"\": \"trashDays\" has to be a non negative integer."));var watch=(_pair$watch=pair.watch)!==null&&_pair$watch!==void 0?_pair$watch:settings.defaults.watch;if(typeof watch!=="boolean")throw new Error("Pair \"".concat(name,"\": \"watch\" has to be true or false."));return settings_objectSpread(settings_objectSpread({},pair.config===undefined?{}:{config:pair.config}),{},{excludes:[].concat(settings_toConsumableArray(settings.defaults.excludes),settings_toConsumableArray((_pair$excludes=pair.excludes)!==null&&_pair$excludes!==void 0?_pair$excludes:[])),intervalInMilliseconds:parseInterval((_pair$interval=pair.interval)!==null&&_pair$interval!==void 0?_pair$interval:settings.defaults.interval),name:name,password:validatePasswordSource((_pair$password=pair.password)!==null&&_pair$password!==void 0?_pair$password:"prompt"),plaintext:pair.plaintext,trashDays:trashDays,vault:pair.vault,watch:watch})};/**
 * Determines the settings file path.
 * @param configurationDirectory - Application configuration directory.
 * @returns Absolute file path.
 */var getSettingsPath=function getSettingsPath(configurationDirectory){if(configurationDirectory===void 0){configurationDirectory=getConfigurationDirectory()}return __WEBPACK_EXTERNAL_MODULE_path_join__(configurationDirectory,SETTINGS_FILE_NAME)};/**
 * Loads the settings, a missing file results in default settings.
 * @param configurationDirectory - Application configuration directory.
 * @returns Settings.
 */var loadSettings=/*#__PURE__*/function(){var _loadSettings=settings_asyncToGenerator(/*#__PURE__*/settings_regenerator().m(function _callee(configurationDirectory){var _given$pairs;var path,content,given,defaults,settings,_i,_Object$keys,name,_t,_t2;return settings_regenerator().w(function(_context){while(1)switch(_context.p=_context.n){case 0:if(configurationDirectory===void 0){configurationDirectory=getConfigurationDirectory()}path=getSettingsPath(configurationDirectory);_context.p=1;_context.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readFile__(path,{encoding:"utf-8"});case 2:content=_context.v;_context.n=5;break;case 3:_context.p=3;_t=_context.v;if(!(_t.code==="ENOENT")){_context.n=4;break}return _context.a(2,createSettings());case 4:throw _t;case 5:_context.p=5;given=JSON.parse(content);_context.n=7;break;case 6:_context.p=6;_t2=_context.v;throw new Error("Invalid json in \"".concat(path,"\": ").concat(_t2.message),{cause:_t2});case 7:defaults=createSettings().defaults;settings={defaults:settings_objectSpread(settings_objectSpread({},defaults),given.defaults),pairs:(_given$pairs=given.pairs)!==null&&_given$pairs!==void 0?_given$pairs:{}};// Validate everything early to fail on start, not later in a daemon.
for(_i=0,_Object$keys=Object.keys(settings.pairs);_i<_Object$keys.length;_i++){name=_Object$keys[_i];resolvePair(settings,name)}return _context.a(2,settings)}},_callee,null,[[5,6],[1,3]])}));function loadSettings(_x){return _loadSettings.apply(this,arguments)}return loadSettings}();/**
 * Saves given settings atomically.
 * @param settings - Settings to save.
 * @param configurationDirectory - Application configuration directory.
 * @returns Promise resolving when saved.
 */var saveSettings=/*#__PURE__*/function(){var _saveSettings=settings_asyncToGenerator(/*#__PURE__*/settings_regenerator().m(function _callee2(settings,configurationDirectory){var path;return settings_regenerator().w(function(_context2){while(1)switch(_context2.n){case 0:if(configurationDirectory===void 0){configurationDirectory=getConfigurationDirectory()}_context2.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(configurationDirectory,{recursive:true});case 1:path=getSettingsPath(configurationDirectory);_context2.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_writeFile__("".concat(path,".tmp"),"".concat(JSON.stringify(settings,null,4),"\n"),{mode:384});case 2:_context2.n=3;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rename__("".concat(path,".tmp"),path);case 3:return _context2.a(2)}},_callee2)}));function saveSettings(_x2,_x3){return _saveSettings.apply(this,arguments)}return saveSettings}();
;// ./src/plan.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module plan *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function plan_typeof(o){"@babel/helpers - typeof";return plan_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},plan_typeof(o)}function plan_createForOfIteratorHelper(e,t){var _n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!_n){if(Array.isArray(e)||(_n=plan_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){_n&&(e=_n);var o=0,F=function F(){};return{s:F,n:function n(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u,i=!0;return{s:function s(){_n=_n.call(e)},n:function n(){i=!0;var r=_n.next();return r.done?{done:!0}:{value:r.value,done:i=!1}},e:function e(r){a=!0,u=r},f:function f(){try{i||null==_n.return||_n.return()}finally{if(a)throw u}}}}function plan_toConsumableArray(a){return plan_arrayWithoutHoles(a)||plan_iterableToArray(a)||plan_unsupportedIterableToArray(a)||plan_nonIterableSpread()}function plan_nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function plan_unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return plan_arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?plan_arrayLikeToArray(t,e):void 0}}function plan_iterableToArray(r){var e="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){for(var t,o=[],a=e.call(r);!(t=a.next()).done;)o.push(t.value);return o}}function plan_arrayWithoutHoles(a){if(Array.isArray(a))return plan_arrayLikeToArray(a)}function plan_arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}function plan_ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function plan_objectSpread(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?plan_ownKeys(Object(o),!0).forEach(function(t){plan_defineProperty(r,t,o[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):plan_ownKeys(Object(o)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(o,e))})}return r}function plan_defineProperty(r,t,o){return(t=plan_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function plan_toPropertyKey(r){var o=plan_toPrimitive(r,"string");return"symbol"==plan_typeof(o)?o:o+""}function plan_toPrimitive(t,e){if("object"!=plan_typeof(t)||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=plan_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)};// endregion
// Order in which planned actions have to be applied.
var ACTION_ORDER=["skip",// NOTE: Deletions first, so case-only renames on case insensitive file
// systems do not trash freshly transferred files.
"trash","removeDirectory","createDirectory","conflict","compare","transfer","record","forget"];/**
 * Checks whether two snapshots describe the same entry state.
 * @param first - First snapshot.
 * @param second - Second snapshot.
 * @returns Indicates equality.
 */var isSameSnapshot=function isSameSnapshot(first,second){return first===second||first!==undefined&&second!==undefined&&first.type===second.type&&first.size===second.size&&first.mtimeMs===second.mtimeMs&&first.target===second.target};/**
 * Returns the other side of a pair.
 * @param side - Given side.
 * @returns Opposite side.
 */var getOtherSide=function getOtherSide(side){return side==="plain"?"cipher":"plain"};/**
 * Formats given date for conflict file names (local time, no characters
 * which are invalid on any supported platform).
 * @param date - Date to format.
 * @returns Formatted date.
 */var formatConflictDate=function formatConflictDate(date){var pad=function pad(value){return String(value).padStart(2,"0")};return"".concat(String(date.getFullYear()),"-").concat(pad(date.getMonth()+1),"-")+"".concat(pad(date.getDate())," ").concat(pad(date.getHours()),"-")+"".concat(pad(date.getMinutes()),"-").concat(pad(date.getSeconds()))};/**
 * Derives a not yet taken conflict copy name for given path.
 * @param path - Relative (posix) path of the conflicting entry.
 * @param host - Name of this machine.
 * @param date - Time of the synchronization.
 * @param isTaken - Checks whether a relative path is already in use.
 * @returns Relative conflict copy path.
 */var getConflictPath=function getConflictPath(path,host,date,isTaken){var directory=__WEBPACK_EXTERNAL_MODULE_path_posix__.dirname(path);var name=__WEBPACK_EXTERNAL_MODULE_path_posix__.basename(path);// NOTE: Dot files like ".bashrc" have no extension.
var extension=__WEBPACK_EXTERNAL_MODULE_path_posix__.extname(name);var stem=name.slice(0,name.length-extension.length);for(var counter=1;;counter+=1){var candidate=__WEBPACK_EXTERNAL_MODULE_path_posix__.join(directory,"".concat(stem," (conflict ").concat(host," ").concat(formatConflictDate(date))+"".concat(counter>1?" ".concat(String(counter)):"",")").concat(extension));if(!isTaken(candidate))return candidate}};/**
 * Decides how to synchronize both sides based on their current state and
 * the state after the last synchronization.
 * @param plain - Current entries of the plaintext directory.
 * @param cipher - Current entries of the vault.
 * @param state - Entries after the last synchronization.
 * @param host - Name of this machine (used for conflict copies).
 * @param date - Time of the synchronization (used for conflict copies).
 * @returns Actions sorted in the order to apply them.
 */var createPlan=function createPlan(plain,cipher,state,host,date){var actions=[];var conflictPaths=new Set;var resolveConflict=function resolveConflict(path,plainSnapshot,cipherSnapshot){var conflictPath=getConflictPath(path,host,date,function(candidate){return plain.has(candidate)||cipher.has(candidate)||Object.prototype.hasOwnProperty.call(state,candidate)||conflictPaths.has(candidate)});conflictPaths.add(conflictPath);return{conflictPath:conflictPath,// The older version gets renamed (local version wins ties).
loser:plainSnapshot.mtimeMs<cipherSnapshot.mtimeMs?"plain":"cipher"}};// Both sides exist and differ from the last known state (or are new).
var planDivergence=function planDivergence(path,plainSnapshot,cipherSnapshot){if(plainSnapshot.type==="directory")actions.push({type:"record",path:path});else if(plainSnapshot.type==="symbolicLink")actions.push(plainSnapshot.target===cipherSnapshot.target?{type:"record",path:path}:plan_objectSpread({type:"conflict",path:path},resolveConflict(path,plainSnapshot,cipherSnapshot)));else actions.push(plan_objectSpread({// Different sizes can never have the same content.
type:getPlainSize(cipherSnapshot.size)===plainSnapshot.size?"compare":"conflict",path:path},resolveConflict(path,plainSnapshot,cipherSnapshot)))};// Entry only exists on given side.
var planCopy=function planCopy(path,snapshot,from){actions.push(snapshot.type==="directory"?{type:"createDirectory",path:path,side:getOtherSide(from)}:{type:"transfer",path:path,from:from})};// Entry was deleted on the other side than given.
var planDeletion=function planDeletion(path,snapshot,side,changed){if(changed)// NOTE: A modification beats a deletion, nothing gets lost.
planCopy(path,snapshot,side);else actions.push({type:snapshot.type==="directory"?"removeDirectory":"trash",path:path,side:side})};var paths=new Set([].concat(plan_toConsumableArray(plain.keys()),plan_toConsumableArray(cipher.keys())));for(var _i=0,_Object$keys=Object.keys(state);_i<_Object$keys.length;_i++){var path=_Object$keys[_i];paths.add(path)}var _iterator=plan_createForOfIteratorHelper(plan_toConsumableArray(paths).sort()),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var _path=_step.value;var plainSnapshot=plain.get(_path);var cipherSnapshot=cipher.get(_path);var entry=Object.prototype.hasOwnProperty.call(state,_path)?state[_path]:undefined;if(plainSnapshot&&cipherSnapshot&&plainSnapshot.type!==cipherSnapshot.type){actions.push({type:"skip",path:_path,reason:"Type differs: ".concat(plainSnapshot.type," in plaintext ")+"directory, ".concat(cipherSnapshot.type," in vault.")});continue}if(!entry){if(plainSnapshot&&cipherSnapshot)planDivergence(_path,plainSnapshot,cipherSnapshot);else if(plainSnapshot)planCopy(_path,plainSnapshot,"plain");else if(cipherSnapshot)planCopy(_path,cipherSnapshot,"cipher");continue}if(!plainSnapshot&&!cipherSnapshot)actions.push({type:"forget",path:_path});else if(!plainSnapshot&&cipherSnapshot)planDeletion(_path,cipherSnapshot,"cipher",!isSameSnapshot(cipherSnapshot,entry.cipher));else if(plainSnapshot&&!cipherSnapshot)planDeletion(_path,plainSnapshot,"plain",!isSameSnapshot(plainSnapshot,entry.plain));else if(plainSnapshot&&cipherSnapshot){var plainChanged=!isSameSnapshot(plainSnapshot,entry.plain);var cipherChanged=!isSameSnapshot(cipherSnapshot,entry.cipher);if(plainChanged&&cipherChanged)planDivergence(_path,plainSnapshot,cipherSnapshot);else if(plainChanged)actions.push({type:"transfer",path:_path,from:"plain"});else if(cipherChanged)actions.push({type:"transfer",path:_path,from:"cipher"})}}}catch(err){_iterator.e(err)}finally{_iterator.f()}var getRank=function getRank(action){return ACTION_ORDER.indexOf(action.type)};var getDepth=function getDepth(path){return path.split("/").length};return actions.sort(function(first,second){return getRank(first)-getRank(second)||(// Remove nested directories before their parents.
first.type==="removeDirectory"?getDepth(second.path)-getDepth(first.path):0)||(first.path<second.path?-1:first.path>second.path?1:0)})};
;// external "fs"

;// external "stream"

;// external "stream/promises"

;// ./src/tree.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module tree *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function tree_createForOfIteratorHelper(e,t){var _n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!_n){if(Array.isArray(e)||(_n=tree_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){_n&&(e=_n);var o=0,F=function F(){};return{s:F,n:function n(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u,i=!0;return{s:function s(){_n=_n.call(e)},n:function n(){i=!0;var r=_n.next();return r.done?{done:!0}:{value:r.value,done:i=!1}},e:function e(r){a=!0,u=r},f:function f(){try{i||null==_n.return||_n.return()}finally{if(a)throw u}}}}function tree_unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return tree_arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?tree_arrayLikeToArray(t,e):void 0}}function tree_arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n};function tree_regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return tree_regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?i<3?(i>1&&(G.n=-1),l(i,u)):G.n=u:G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(tree_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,tree_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,tree_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),tree_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",tree_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),tree_regeneratorDefine2(f),tree_regeneratorDefine2(f,a,"Generator"),tree_regeneratorDefine2(f,n,function(){return this}),tree_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(tree_regenerator=function _regenerator(){return{w:i,m:p}})()}function tree_regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}tree_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){tree_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},tree_regeneratorDefine2(e,r,n,t)}function tree_asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function tree_asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){tree_asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){tree_asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}};// endregion
var TEMPORARY_FILE_PREFIX=".gocryptfs-standalone-";/**
 * Writes given content to a temporary file next to the target and moves it
 * into place afterwards so the target is never observed half written.
 * Modification time and permissions of given source are applied. Sources
 * changing while being read are rejected.
 * @param transform - Content producer (en- or decrypting).
 * @param key - Content key.
 * @param sourcePath - File to read.
 * @param targetPath - File to (over)write.
 * @param beforeCommit - Called right before the target gets replaced, may
 * throw to abort.
 * @returns Promise resolving when the target is in place.
 */var transformFile=/*#__PURE__*/function(){var _transformFile=tree_asyncToGenerator(/*#__PURE__*/tree_regenerator().m(function _callee(transform,key,sourcePath,targetPath,beforeCommit){var sourceStats,temporaryPath,currentSourceStats,_t;return tree_regenerator().w(function(_context){while(1)switch(_context.p=_context.n){case 0:_context.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_lstat__(sourcePath);case 1:sourceStats=_context.v;temporaryPath=__WEBPACK_EXTERNAL_MODULE_path_join__(__WEBPACK_EXTERNAL_MODULE_path_dirname__(targetPath),"".concat(TEMPORARY_FILE_PREFIX).concat(__WEBPACK_EXTERNAL_MODULE_crypto_randomBytes__(8).toString("hex"),"-")+__WEBPACK_EXTERNAL_MODULE_path_basename__(targetPath));_context.p=2;_context.n=3;return __WEBPACK_EXTERNAL_MODULE_stream_promises_4e08051e_pipeline__(__WEBPACK_EXTERNAL_MODULE_stream_Readable__.from(transform(key,sourcePath)),__WEBPACK_EXTERNAL_MODULE_fs_createWriteStream__(temporaryPath,{mode:384}));case 3:_context.n=4;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_lstat__(sourcePath);case 4:currentSourceStats=_context.v;if(!(currentSourceStats.size!==sourceStats.size||currentSourceStats.mtimeMs!==sourceStats.mtimeMs)){_context.n=5;break}throw new Error("File changed while being processed, it will be retried.");case 5:_context.n=6;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_chmod__(temporaryPath,sourceStats.mode&511);case 6:_context.n=7;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_utimes__(temporaryPath,sourceStats.atimeMs/1000,sourceStats.mtimeMs/1000);case 7:_context.n=8;return beforeCommit===null||beforeCommit===void 0?void 0:beforeCommit();case 8:_context.n=9;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rename__(temporaryPath,targetPath);case 9:_context.n=12;break;case 10:_context.p=10;_t=_context.v;_context.n=11;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(temporaryPath,{force:true});case 11:throw _t;case 12:return _context.a(2)}},_callee,null,[[2,10]])}));function transformFile(_x,_x2,_x3,_x4,_x5){return _transformFile.apply(this,arguments)}return transformFile}();/**
 * Decrypts given encrypted file into given target path.
 * @param key - Content key.
 * @param cipherPath - Encrypted file.
 * @param plainPath - Plaintext target file.
 * @returns Promise resolving when the target is in place.
 */var decryptFile=function decryptFile(key,cipherPath,plainPath){return transformFile(decryptFileContent,key,cipherPath,plainPath)};/**
 * Encrypts given plaintext file into given target path.
 * @param key - Content key.
 * @param plainPath - Plaintext file.
 * @param cipherPath - Encrypted target file.
 * @returns Promise resolving when the target is in place.
 */var encryptFile=function encryptFile(key,plainPath,cipherPath){return transformFile(encryptFileContent,key,plainPath,cipherPath)};/**
 * Decides whether given path relative to the vault root is internal vault
 * data or a leftover of an interrupted run.
 * @param relativePath - Path relative to the vault root.
 * @returns Indicates whether to ignore the path.
 */var isInternalPath=function isInternalPath(relativePath){return CONFIGURATION_FILE_NAMES.includes(relativePath)||isTemporaryPath(relativePath)};/**
 * Decides whether given path is a leftover of an interrupted run.
 * @param path - Path to check.
 * @returns Indicates whether given path is a temporary file.
 */var isTemporaryPath=function isTemporaryPath(path){return __WEBPACK_EXTERNAL_MODULE_path_basename__(path).startsWith(TEMPORARY_FILE_PREFIX)};/**
 * Recursively mirrors given source directory into given target directory by
 * transforming each file (one way, existing files get overwritten, nothing
 * gets deleted). Modification times and permissions are carried over,
 * symbolic links are copied as they are (plaintext names vaults store link
 * targets unencrypted).
 * @param transform - Transforms one file.
 * @param sourceRoot - Directory to read.
 * @param targetRoot - Directory to write.
 * @param classify - Decides whether to process ("true"), silently ignore
 * ("false") or skip with given reason (string) a relative source path
 * (gets the path and whether it is a directory).
 * @param onProgress - Called with each processed relative path.
 * @returns Statistics and skipped entries.
 */var transformTree=/*#__PURE__*/function(){var _transformTree=tree_asyncToGenerator(/*#__PURE__*/tree_regenerator().m(function _callee3(transform,sourceRoot,targetRoot,classify,onProgress){var result,_walk;return tree_regenerator().w(function(_context3){while(1)switch(_context3.n){case 0:if(onProgress===void 0){onProgress=function onProgress(){// Nothing to report by default.
}}result={directories:0,files:0,skipped:[],symbolicLinks:0};_walk=/*#__PURE__*/function(){var _walk2=tree_asyncToGenerator(/*#__PURE__*/tree_regenerator().m(function _callee2(sourceDirectory){var targetDirectory,_iterator,_step,entry,sourcePath,relativePath,classification,targetPath,stats,_t2,_t3,_t4,_t5;return tree_regenerator().w(function(_context2){while(1)switch(_context2.p=_context2.n){case 0:targetDirectory=__WEBPACK_EXTERNAL_MODULE_path_join__(targetRoot,__WEBPACK_EXTERNAL_MODULE_path_relative__(sourceRoot,sourceDirectory));_context2.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(targetDirectory,{recursive:true});case 1:_t2=tree_createForOfIteratorHelper;_context2.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readdir__(sourceDirectory,{withFileTypes:true});case 2:_iterator=_t2(_context2.v);_context2.p=3;_iterator.s();case 4:if((_step=_iterator.n()).done){_context2.n=19;break}entry=_step.value;sourcePath=__WEBPACK_EXTERNAL_MODULE_path_join__(sourceDirectory,entry.name);relativePath=__WEBPACK_EXTERNAL_MODULE_path_relative__(sourceRoot,sourcePath).split(__WEBPACK_EXTERNAL_MODULE_path_sep__).join("/");classification=classify(relativePath,entry.isDirectory());if(!(classification===false)){_context2.n=5;break}return _context2.a(3,18);case 5:if(!(typeof classification==="string")){_context2.n=6;break}result.skipped.push({path:relativePath,reason:classification});return _context2.a(3,18);case 6:targetPath=__WEBPACK_EXTERNAL_MODULE_path_join__(targetDirectory,entry.name);onProgress(relativePath);_context2.p=7;if(!entry.isDirectory()){_context2.n=9;break}_context2.n=8;return _walk(sourcePath);case 8:result.directories+=1;_context2.n=16;break;case 9:if(!entry.isFile()){_context2.n=11;break}_context2.n=10;return transform(sourcePath,targetPath);case 10:result.files+=1;_context2.n=16;break;case 11:if(!entry.isSymbolicLink()){_context2.n=15;break}_context2.n=12;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(targetPath,{force:true});case 12:_t3=__WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_symlink__;_context2.n=13;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readlink__(sourcePath);case 13:_context2.n=14;return _t3(_context2.v,targetPath);case 14:result.symbolicLinks+=1;_context2.n=16;break;case 15:result.skipped.push({path:relativePath,reason:"Unsupported file type."});case 16:_context2.n=18;break;case 17:_context2.p=17;_t4=_context2.v;result.skipped.push({path:relativePath,reason:_t4 instanceof Error?_t4.message:String(_t4)});case 18:_context2.n=4;break;case 19:_context2.n=21;break;case 20:_context2.p=20;_t5=_context2.v;_iterator.e(_t5);case 21:_context2.p=21;_iterator.f();return _context2.f(21);case 22:_context2.n=23;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_lstat__(sourceDirectory);case 23:stats=_context2.v;if(!(sourceDirectory!==sourceRoot)){_context2.n=24;break}_context2.n=24;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_chmod__(targetDirectory,stats.mode&511);case 24:_context2.n=25;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_utimes__(targetDirectory,stats.atimeMs/1000,stats.mtimeMs/1000);case 25:return _context2.a(2)}},_callee2,null,[[7,17],[3,20,21,22]])}));function walk(_x1){return _walk2.apply(this,arguments)}return walk}();_context3.n=1;return _walk(sourceRoot);case 1:return _context3.a(2,result)}},_callee3)}));function transformTree(_x6,_x7,_x8,_x9,_x0){return _transformTree.apply(this,arguments)}return transformTree}();/**
 * Recursively decrypts given vault directory into given plaintext directory.
 * @param key - Content key.
 * @param cipherRoot - Encrypted vault directory.
 * @param plainRoot - Target directory.
 * @param isExcluded - Decides which relative paths to leave out.
 * @param onProgress - Called with each processed relative path.
 * @returns Statistics and skipped entries.
 */var decryptTree=function decryptTree(key,cipherRoot,plainRoot,isExcluded,onProgress){if(isExcluded===void 0){isExcluded=excludeNothing}return transformTree(function(sourcePath,targetPath){return decryptFile(key,sourcePath,targetPath)},cipherRoot,plainRoot,function(relativePath,isDirectory){return!isInternalPath(relativePath)&&!isExcluded(relativePath,isDirectory)},onProgress)};/**
 * Recursively encrypts given plaintext directory into given vault directory.
 * @param key - Content key.
 * @param plainRoot - Plaintext directory.
 * @param cipherRoot - Encrypted vault directory.
 * @param isExcluded - Decides which relative paths to leave out.
 * @param onProgress - Called with each processed relative path.
 * @returns Statistics and skipped entries.
 */var encryptTree=function encryptTree(key,plainRoot,cipherRoot,isExcluded,onProgress){if(isExcluded===void 0){isExcluded=excludeNothing}return transformTree(function(sourcePath,targetPath){return encryptFile(key,sourcePath,targetPath)},plainRoot,cipherRoot,function(relativePath,isDirectory){if(isExcluded(relativePath,isDirectory))return false;if(CONFIGURATION_FILE_NAMES.includes(relativePath))return"The name \"".concat(relativePath,"\" is reserved in the vault ")+"root.";return!isTemporaryPath(relativePath)},onProgress)};/**
 * Finds any non-empty encrypted file in given vault (breadth first).
 * @param cipherRoot - Encrypted vault directory.
 * @returns Path of the first found file or null if there is none.
 */var findSampleFile=/*#__PURE__*/function(){var _findSampleFile=tree_asyncToGenerator(/*#__PURE__*/tree_regenerator().m(function _callee4(cipherRoot){var directories,_i,_directories,directory,_iterator2,_step2,entry,_path,_t6,_t7,_t8,_t9;return tree_regenerator().w(function(_context4){while(1)switch(_context4.p=_context4.n){case 0:directories=[cipherRoot];_i=0,_directories=directories;case 1:if(!(_i<_directories.length)){_context4.n=14;break}directory=_directories[_i];_t6=tree_createForOfIteratorHelper;_context4.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readdir__(directory,{withFileTypes:true});case 2:_iterator2=_t6(_context4.v);_context4.p=3;_iterator2.s();case 4:if((_step2=_iterator2.n()).done){_context4.n=10;break}entry=_step2.value;_path=__WEBPACK_EXTERNAL_MODULE_path_join__(directory,entry.name);if(!isInternalPath(__WEBPACK_EXTERNAL_MODULE_path_relative__(cipherRoot,_path))){_context4.n=5;break}return _context4.a(3,9);case 5:if(!entry.isDirectory()){_context4.n=6;break}directories.push(_path);_context4.n=9;break;case 6:_t7=entry.isFile();if(!_t7){_context4.n=8;break}_context4.n=7;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_lstat__(_path);case 7:_t8=_context4.v.size;_t7=_t8>0;case 8:if(!_t7){_context4.n=9;break}return _context4.a(2,_path);case 9:_context4.n=4;break;case 10:_context4.n=12;break;case 11:_context4.p=11;_t9=_context4.v;_iterator2.e(_t9);case 12:_context4.p=12;_iterator2.f();return _context4.f(12);case 13:_i++;_context4.n=1;break;case 14:return _context4.a(2,null)}},_callee4,null,[[3,11,12,13]])}));function findSampleFile(_x10){return _findSampleFile.apply(this,arguments)}return findSampleFile}();
;// ./src/synchronize.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module synchronize *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function synchronize_slicedToArray(e,i){return synchronize_iterableToArrayLimit(e,i)||synchronize_unsupportedIterableToArray(e,i)||synchronize_nonIterableRest()}function synchronize_nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function synchronize_iterableToArrayLimit(r,t){var e=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){var l,n,i,a,u=[],o=!0,f=!1;try{if(i=(e=e.call(r)).next,0===t){if(Object(e)!==e)return;o=!1}else for(;!(o=(l=i.call(e)).done)&&(u.push(l.value),u.length!==t);o=!0);}catch(r){f=!0,n=r}finally{try{if(!o&&null!=e.return&&(a=e.return(),Object(a)!==a))return}finally{if(f)throw n}}return u}}function synchronize_toConsumableArray(a){return synchronize_arrayWithoutHoles(a)||synchronize_iterableToArray(a)||synchronize_unsupportedIterableToArray(a)||synchronize_nonIterableSpread()}function synchronize_nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function synchronize_iterableToArray(r){var e="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){for(var t,o=[],a=e.call(r);!(t=a.next()).done;)o.push(t.value);return o}}function synchronize_arrayWithoutHoles(a){if(Array.isArray(a))return synchronize_arrayLikeToArray(a)};function synchronize_createForOfIteratorHelper(e,t){var _n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!_n){if(Array.isArray(e)||(_n=synchronize_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){_n&&(e=_n);var o=0,F=function F(){};return{s:F,n:function n(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u,i=!0;return{s:function s(){_n=_n.call(e)},n:function n(){i=!0;var r=_n.next();return r.done?{done:!0}:{value:r.value,done:i=!1}},e:function e(r){a=!0,u=r},f:function f(){try{i||null==_n.return||_n.return()}finally{if(a)throw u}}}}function synchronize_unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return synchronize_arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?synchronize_arrayLikeToArray(t,e):void 0}}function synchronize_arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}function synchronize_regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return synchronize_regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?i<3?(i>1&&(G.n=-1),l(i,u)):G.n=u:G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(synchronize_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,synchronize_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,synchronize_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),synchronize_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",synchronize_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),synchronize_regeneratorDefine2(f),synchronize_regeneratorDefine2(f,a,"Generator"),synchronize_regeneratorDefine2(f,n,function(){return this}),synchronize_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(synchronize_regenerator=function _regenerator(){return{w:i,m:p}})()}function synchronize_regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}synchronize_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){synchronize_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},synchronize_regeneratorDefine2(e,r,n,t)}function synchronize_asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function synchronize_asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){synchronize_asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){synchronize_asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}}function synchronize_asyncIterator(r){var n,t,o,e=2;for("undefined"!=typeof Symbol&&(t=Symbol.asyncIterator,o=Symbol.iterator);e--;){if(t&&null!=(n=r[t]))return n.call(r);if(o&&null!=(n=r[o]))return new synchronize_AsyncFromSyncIterator(n.call(r));t="@@asyncIterator",o="@@iterator"}throw new TypeError("Object is not async iterable")}function synchronize_AsyncFromSyncIterator(r){function AsyncFromSyncIteratorContinuation(r){if(Object(r)!==r)return Promise.reject(new TypeError(r+" is not an object."));var n=r.done;return Promise.resolve(r.value).then(function(r){return{value:r,done:n}})}return synchronize_AsyncFromSyncIterator=function AsyncFromSyncIterator(r){this.s=r,this.n=r.next},synchronize_AsyncFromSyncIterator.prototype={s:null,n:null,next:function next(){return AsyncFromSyncIteratorContinuation(this.n.apply(this.s,arguments))},return:function _return(r){var n=this.s.return;return void 0===n?Promise.resolve({value:r,done:!0}):AsyncFromSyncIteratorContinuation(n.apply(this.s,arguments))},throw:function _throw(r){var n=this.s.throw;return void 0===n?Promise.reject(r):AsyncFromSyncIteratorContinuation(n.apply(this.s,arguments))}},new synchronize_AsyncFromSyncIterator(r)};// endregion
/**
 * Creates the snapshot of given file system entry.
 * @param path - Absolute path.
 * @returns Snapshot or undefined if the entry does not exist or has an
 * unsupported type.
 */var getSnapshot=/*#__PURE__*/function(){var _getSnapshot=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee(path){var stats,_t,_t2;return synchronize_regenerator().w(function(_context){while(1)switch(_context.p=_context.n){case 0:_context.p=0;_context.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_lstat__(path);case 1:stats=_context.v;_context.n=4;break;case 2:_context.p=2;_t=_context.v;if(!(_t.code==="ENOENT")){_context.n=3;break}return _context.a(2,undefined);case 3:throw _t;case 4:if(!stats.isDirectory()){_context.n=5;break}return _context.a(2,{mtimeMs:0,size:0,type:"directory"});case 5:if(!stats.isSymbolicLink()){_context.n=7;break}_context.n=6;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readlink__(path);case 6:_t2=_context.v;return _context.a(2,{mtimeMs:0,size:0,target:_t2,type:"symbolicLink"});case 7:if(!stats.isFile()){_context.n=8;break}return _context.a(2,{mtimeMs:stats.mtimeMs,size:stats.size,type:"file"});case 8:return _context.a(2,undefined)}},_callee,null,[[0,2]])}));function getSnapshot(_x){return _getSnapshot.apply(this,arguments)}return getSnapshot}();/**
 * Collects snapshots of all entries below given root.
 * @param root - Directory to scan.
 * @param side - Side the directory belongs to.
 * @param isExcluded - Decides which relative paths to leave out.
 * @returns Snapshots by relative posix path and skipped entries.
 */var scan=/*#__PURE__*/function(){var _scan=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee3(root,side,isExcluded){var result,_walk;return synchronize_regenerator().w(function(_context3){while(1)switch(_context3.n){case 0:if(isExcluded===void 0){isExcluded=excludeNothing}result={skipped:[],snapshots:new Map};_walk=/*#__PURE__*/function(){var _walk2=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee2(directory,prefix){var _iterator2,_step2,entry,path,snapshot,_t3,_t4;return synchronize_regenerator().w(function(_context2){while(1)switch(_context2.p=_context2.n){case 0:_t3=synchronize_createForOfIteratorHelper;_context2.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_readdir__(directory,{withFileTypes:true});case 1:_iterator2=_t3(_context2.v);_context2.p=2;_iterator2.s();case 3:if((_step2=_iterator2.n()).done){_context2.n=9;break}entry=_step2.value;path=prefix?"".concat(prefix,"/").concat(entry.name):entry.name;if(!((side==="cipher"?isInternalPath(path):isTemporaryPath(path))||isExcluded(path,entry.isDirectory()))){_context2.n=4;break}return _context2.a(3,8);case 4:if(!(side==="plain"&&CONFIGURATION_FILE_NAMES.includes(path))){_context2.n=5;break}result.skipped.push({path:path,reason:"The name \"".concat(path,"\" is reserved in the vault root.")});return _context2.a(3,8);case 5:_context2.n=6;return getSnapshot(__WEBPACK_EXTERNAL_MODULE_path_join__(directory,entry.name));case 6:snapshot=_context2.v;if(snapshot){_context2.n=7;break}result.skipped.push({path:path,reason:"Unsupported file type."});return _context2.a(3,8);case 7:result.snapshots.set(path,snapshot);if(!(snapshot.type==="directory")){_context2.n=8;break}_context2.n=8;return _walk(__WEBPACK_EXTERNAL_MODULE_path_join__(directory,entry.name),path);case 8:_context2.n=3;break;case 9:_context2.n=11;break;case 10:_context2.p=10;_t4=_context2.v;_iterator2.e(_t4);case 11:_context2.p=11;_iterator2.f();return _context2.f(11);case 12:return _context2.a(2)}},_callee2,null,[[2,10,11,12]])}));function walk(_x5,_x6){return _walk2.apply(this,arguments)}return walk}();_context3.n=1;return _walk(root,"");case 1:return _context3.a(2,result)}},_callee3)}));function scan(_x2,_x3,_x4){return _scan.apply(this,arguments)}return scan}();/**
 * Detects whether given directory lives on a case insensitive file system.
 * @param directory - Existing writable directory.
 * @returns Indicates case insensitivity.
 */var isCaseInsensitive=/*#__PURE__*/function(){var _isCaseInsensitive=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee4(directory){var name,path,_t5,_t6;return synchronize_regenerator().w(function(_context4){while(1)switch(_context4.p=_context4.n){case 0:name="".concat(TEMPORARY_FILE_PREFIX,"case-probe-").concat(String(process.pid));path=__WEBPACK_EXTERNAL_MODULE_path_join__(directory,name);_context4.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_writeFile__(path,"");case 1:_context4.p=1;_context4.n=2;return getSnapshot(__WEBPACK_EXTERNAL_MODULE_path_join__(directory,name.toUpperCase()));case 2:_t5=_context4.v;_t6=undefined;return _context4.a(2,_t5!==_t6);case 3:_context4.p=3;_context4.n=4;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(path,{force:true});case 4:return _context4.f(3);case 5:return _context4.a(2)}},_callee4,null,[[1,,3,5]])}));function isCaseInsensitive(_x7){return _isCaseInsensitive.apply(this,arguments)}return isCaseInsensitive}();/**
 * Finds entries whose paths only differ in case.
 * @param paths - Relative paths.
 * @returns Colliding paths.
 */var findCaseCollisions=function findCaseCollisions(paths){var byLowerCase=new Map;var _iterator3=synchronize_createForOfIteratorHelper(paths),_step3;try{for(_iterator3.s();!(_step3=_iterator3.n()).done;){var _byLowerCase$get;var path=_step3.value;var key=path.toLowerCase();byLowerCase.set(key,[].concat(synchronize_toConsumableArray((_byLowerCase$get=byLowerCase.get(key))!==null&&_byLowerCase$get!==void 0?_byLowerCase$get:[]),[path]))}}catch(err){_iterator3.e(err)}finally{_iterator3.f()}return new Set(synchronize_toConsumableArray(byLowerCase.values()).filter(function(group){return group.length>1}).flat())};/**
 * Checks whether a decrypted file equals its plaintext counterpart.
 * @param key - Content key.
 * @param plainPath - Plaintext file.
 * @param cipherPath - Encrypted file.
 * @returns Indicates equal content.
 */var hasSameContent=/*#__PURE__*/function(){var _hasSameContent=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee5(key,plainPath,cipherPath){var fileHandle,position,_iteratorAbruptCompletion,_didIteratorError,_iteratorError,_iterator,_step,block,buffer,_yield$fileHandle$rea,_bytesRead,_yield$fileHandle$rea2,bytesRead,_t7;return synchronize_regenerator().w(function(_context5){while(1)switch(_context5.p=_context5.n){case 0:_context5.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_open__(plainPath,"r");case 1:fileHandle=_context5.v;_context5.p=2;position=0;_iteratorAbruptCompletion=false;_didIteratorError=false;_context5.p=3;_iterator=synchronize_asyncIterator(decryptFileContent(key,cipherPath));case 4:_context5.n=5;return _iterator.next();case 5:if(!(_iteratorAbruptCompletion=!(_step=_context5.v).done)){_context5.n=9;break}block=_step.value;buffer=Buffer.alloc(block.length);_context5.n=6;return fileHandle.read(buffer,0,block.length,position);case 6:_yield$fileHandle$rea=_context5.v;_bytesRead=_yield$fileHandle$rea.bytesRead;if(!(_bytesRead!==block.length||!buffer.equals(block))){_context5.n=7;break}return _context5.a(2,false);case 7:position+=block.length;case 8:_iteratorAbruptCompletion=false;_context5.n=4;break;case 9:_context5.n=11;break;case 10:_context5.p=10;_t7=_context5.v;_didIteratorError=true;_iteratorError=_t7;case 11:_context5.p=11;_context5.p=12;if(!(_iteratorAbruptCompletion&&_iterator.return!=null)){_context5.n=13;break}_context5.n=13;return _iterator.return();case 13:_context5.p=13;if(!_didIteratorError){_context5.n=14;break}throw _iteratorError;case 14:return _context5.f(13);case 15:return _context5.f(11);case 16:_context5.n=17;return fileHandle.read(Buffer.alloc(1),0,1,position);case 17:_yield$fileHandle$rea2=_context5.v;bytesRead=_yield$fileHandle$rea2.bytesRead;return _context5.a(2,bytesRead===0);case 18:_context5.p=18;_context5.n=19;return fileHandle.close();case 19:return _context5.f(18);case 20:return _context5.a(2)}},_callee5,null,[[12,,13,15],[3,10,11,16],[2,,18,20]])}));function hasSameContent(_x8,_x9,_x0){return _hasSameContent.apply(this,arguments)}return hasSameContent}();/**
 * Checks whether all given changed entries still look like after the last
 * synchronization, which is the case for changes made by the synchronization
 * itself. Unknown paths and an unusable state never count as synchronized.
 * @param options - Pair locations.
 * @param changes - Reported changes.
 * @returns Indicates whether a synchronization would find nothing to do for
 * given changes.
 */var synchronize_isSynchronized=/*#__PURE__*/function(){var _isSynchronized=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee6(options,changes){var _options$configuratio;var roots,pairDirectory,_yield$loadState,state,warning,_iterator4,_step4,_step4$value,path,side,entry,_t8,_t9;return synchronize_regenerator().w(function(_context6){while(1)switch(_context6.p=_context6.n){case 0:roots={cipher:__WEBPACK_EXTERNAL_MODULE_path_resolve__(options.vaultPath),plain:__WEBPACK_EXTERNAL_MODULE_path_resolve__(options.plainPath)};pairDirectory=getPairDirectory(roots.plain,roots.cipher,(_options$configuratio=options.configurationDirectory)!==null&&_options$configuratio!==void 0?_options$configuratio:getConfigurationDirectory());_context6.n=1;return loadState(pairDirectory,roots.plain,roots.cipher);case 1:_yield$loadState=_context6.v;state=_yield$loadState.state;warning=_yield$loadState.warning;if(!warning){_context6.n=2;break}return _context6.a(2,false);case 2:_iterator4=synchronize_createForOfIteratorHelper(changes);_context6.p=3;_iterator4.s();case 4:if((_step4=_iterator4.n()).done){_context6.n=8;break}_step4$value=_step4.value,path=_step4$value.path,side=_step4$value.side;if(path){_context6.n=5;break}return _context6.a(2,false);case 5:/*
            NOTE: Synchronizing refreshes the state of all touched entries
            from disk, so only foreign changes differ from it.
        */entry=Object.prototype.hasOwnProperty.call(state.entries,path)?state.entries[path]:undefined;_t8=isSameSnapshot;_context6.n=6;return getSnapshot(__WEBPACK_EXTERNAL_MODULE_path_join__.apply(void 0,[roots[side]].concat(synchronize_toConsumableArray(path.split("/")))));case 6:if(_t8(_context6.v,entry===null||entry===void 0?void 0:entry[side])){_context6.n=7;break}return _context6.a(2,false);case 7:_context6.n=4;break;case 8:_context6.n=10;break;case 9:_context6.p=9;_t9=_context6.v;_iterator4.e(_t9);case 10:_context6.p=10;_iterator4.f();return _context6.f(10);case 11:return _context6.a(2,true)}},_callee6,null,[[3,9,10,11]])}));function isSynchronized(_x1,_x10){return _isSynchronized.apply(this,arguments)}return isSynchronized}();/**
 * Synchronizes a plaintext directory with a vault in both directions.
 * @param options - Pair, key and behavior.
 * @returns Planned (or applied) actions and failures.
 */var synchronize=/*#__PURE__*/function(){var _synchronize=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee11(options){var _options$date,_options$host,_options$configuratio2;var _options$dryRun,dryRun,_options$excludes,excludes,key,_options$onAction,onAction,_options$trashRetenti,trashRetentionInDays,date,host,roots,pairDirectory,releaseLock,_yield$loadState2,state,warning,scans,snapshots,excluded,_i,_arr,_arr$_i,path,reason,_iterator5,_step5,_path,plannedActions,actions,_result,_iterator6,_step6,action,getPath,assertUnchanged,transfer,resolveConflict,apply,refresh,touched,_iterator7,_step7,_action,_i2,_arr2,_path2,current,_iterator8,_step8,_path3,_t11,_t12,_t13,_t14,_t15;return synchronize_regenerator().w(function(_context11){while(1)switch(_context11.p=_context11.n){case 0:_options$dryRun=options.dryRun,dryRun=_options$dryRun===void 0?false:_options$dryRun,_options$excludes=options.excludes,excludes=_options$excludes===void 0?excludeNothing:_options$excludes,key=options.key,_options$onAction=options.onAction,onAction=_options$onAction===void 0?function(){// Nothing to report by default.
}:_options$onAction,_options$trashRetenti=options.trashRetentionInDays,trashRetentionInDays=_options$trashRetenti===void 0?DEFAULT_TRASH_RETENTION_IN_DAYS:_options$trashRetenti;date=(_options$date=options.date)!==null&&_options$date!==void 0?_options$date:new Date;host=(_options$host=options.host)!==null&&_options$host!==void 0?_options$host:__WEBPACK_EXTERNAL_MODULE_os_hostname__().replace(/\..*$/,"");roots={cipher:__WEBPACK_EXTERNAL_MODULE_path_resolve__(options.vaultPath),plain:__WEBPACK_EXTERNAL_MODULE_path_resolve__(options.plainPath)};pairDirectory=getPairDirectory(roots.plain,roots.cipher,(_options$configuratio2=options.configurationDirectory)!==null&&_options$configuratio2!==void 0?_options$configuratio2:getConfigurationDirectory());_context11.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(roots.plain,{recursive:true});case 1:_context11.n=2;return acquireLock(pairDirectory);case 2:releaseLock=_context11.v;_context11.p=3;if(dryRun){_context11.n=4;break}_context11.n=4;return purgeTrash(pairDirectory,trashRetentionInDays,date);case 4:_context11.n=5;return loadState(pairDirectory,roots.plain,roots.cipher);case 5:_yield$loadState2=_context11.v;state=_yield$loadState2.state;warning=_yield$loadState2.warning;_context11.n=6;return scan(roots.cipher,"cipher",excludes);case 6:_t11=_context11.v;_context11.n=7;return scan(roots.plain,"plain",excludes);case 7:_t12=_context11.v;scans={cipher:_t11,plain:_t12};snapshots={cipher:scans.cipher.snapshots,plain:scans.plain.snapshots};// Never act on entries we could not (fully) see.
excluded=new Map;for(_i=0,_arr=[].concat(synchronize_toConsumableArray(scans.cipher.skipped),synchronize_toConsumableArray(scans.plain.skipped));_i<_arr.length;_i++){_arr$_i=_arr[_i],path=_arr$_i.path,reason=_arr$_i.reason;excluded.set(path,reason)}_context11.n=8;return isCaseInsensitive(roots.plain);case 8:if(!_context11.v){_context11.n=9;break}_iterator5=synchronize_createForOfIteratorHelper(findCaseCollisions(snapshots.cipher.keys()));try{for(_iterator5.s();!(_step5=_iterator5.n()).done;){_path=_step5.value;excluded.set(_path,"Names only differ in case in the vault, which the "+"plaintext file system can not represent.")}}catch(err){_iterator5.e(err)}finally{_iterator5.f()}case 9:plannedActions=createPlan(snapshots.plain,snapshots.cipher,state.entries,host,date);actions=[].concat(synchronize_toConsumableArray(synchronize_toConsumableArray(excluded).map(function(_ref){var _ref2=synchronize_slicedToArray(_ref,2),path=_ref2[0],reason=_ref2[1];return{type:"skip",path:path,reason:reason}})),synchronize_toConsumableArray(plannedActions.filter(function(action){return!excluded.has(action.path)})));_result={actions:actions,failed:[],warning:warning};if(!dryRun){_context11.n=10;break}_iterator6=synchronize_createForOfIteratorHelper(actions);try{for(_iterator6.s();!(_step6=_iterator6.n()).done;){action=_step6.value;onAction(action)}}catch(err){_iterator6.e(err)}finally{_iterator6.f()}return _context11.a(2,_result);case 10:getPath=function getPath(side,path){return __WEBPACK_EXTERNAL_MODULE_path_join__.apply(void 0,[roots[side]].concat(synchronize_toConsumableArray(path.split("/"))))};// Ensures an entry did not change since it was scanned.
assertUnchanged=/*#__PURE__*/function(){var _assertUnchanged=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee7(side,path,expected){var _t0;return synchronize_regenerator().w(function(_context7){while(1)switch(_context7.n){case 0:_t0=isSameSnapshot;_context7.n=1;return getSnapshot(getPath(side,path));case 1:if(_t0(_context7.v,expected)){_context7.n=2;break}throw new Error("Changed in ".concat(side==="plain"?"plaintext":"vault"," ")+"during synchronization, it will be retried.");case 2:return _context7.a(2)}},_callee7)}));function assertUnchanged(_x12,_x13,_x14){return _assertUnchanged.apply(this,arguments)}return assertUnchanged}();// NOTE: An undefined expected snapshot means "must not exist".
transfer=/*#__PURE__*/function(){var _transfer=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee9(path,from,expectedSource,expectedTarget){var to,sourcePath,targetPath,_expectedSource$targe;return synchronize_regenerator().w(function(_context9){while(1)switch(_context9.n){case 0:to=getOtherSide(from);sourcePath=getPath(from,path);targetPath=getPath(to,path);_context9.n=1;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(__WEBPACK_EXTERNAL_MODULE_path_dirname__(targetPath),{recursive:true});case 1:if(!((expectedSource===null||expectedSource===void 0?void 0:expectedSource.type)==="symbolicLink")){_context9.n=6;break}_context9.n=2;return assertUnchanged(from,path,expectedSource);case 2:_context9.n=3;return assertUnchanged(to,path,expectedTarget);case 3:_context9.n=4;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rm__(targetPath,{force:true});case 4:_context9.n=5;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_symlink__((_expectedSource$targe=expectedSource.target)!==null&&_expectedSource$targe!==void 0?_expectedSource$targe:"",targetPath);case 5:return _context9.a(2);case 6:_context9.n=7;return transformFile(from==="plain"?encryptFileContent:decryptFileContent,key,sourcePath,targetPath,/*#__PURE__*/synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee8(){return synchronize_regenerator().w(function(_context8){while(1)switch(_context8.n){case 0:_context8.n=1;return assertUnchanged(from,path,expectedSource);case 1:_context8.n=2;return assertUnchanged(to,path,expectedTarget);case 2:return _context8.a(2)}},_callee8)})));case 7:return _context9.a(2)}},_callee9)}));function transfer(_x15,_x16,_x17,_x18){return _transfer.apply(this,arguments)}return transfer}();resolveConflict=/*#__PURE__*/function(){var _resolveConflict=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee0(path,_ref4){var conflictPath,loser,winner,loserSnapshot;return synchronize_regenerator().w(function(_context0){while(1)switch(_context0.n){case 0:conflictPath=_ref4.conflictPath,loser=_ref4.loser;winner=getOtherSide(loser);loserSnapshot=snapshots[loser].get(path);_context0.n=1;return assertUnchanged(loser,path,loserSnapshot);case 1:_context0.n=2;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rename__(getPath(loser,path),getPath(loser,conflictPath));case 2:_context0.n=3;return transfer(path,winner,snapshots[winner].get(path),undefined);case 3:_context0.n=4;return transfer(conflictPath,loser,loserSnapshot,undefined);case 4:return _context0.a(2)}},_callee0)}));function resolveConflict(_x19,_x20){return _resolveConflict.apply(this,arguments)}return resolveConflict}();apply=/*#__PURE__*/function(){var _apply=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee1(action){var _code,_t1,_t10;return synchronize_regenerator().w(function(_context1){while(1)switch(_context1.p=_context1.n){case 0:_t1=action.type;_context1.n=_t1==="transfer"?1:_t1==="createDirectory"?3:_t1==="trash"?5:_t1==="removeDirectory"?8:_t1==="compare"?12:_t1==="conflict"?15:_t1==="record"?17:_t1==="forget"?17:_t1==="skip"?17:18;break;case 1:_context1.n=2;return transfer(action.path,action.from,snapshots[action.from].get(action.path),snapshots[getOtherSide(action.from)].get(action.path));case 2:return _context1.a(3,18);case 3:_context1.n=4;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_mkdir__(getPath(action.side,action.path),{recursive:true});case 4:return _context1.a(3,18);case 5:_context1.n=6;return assertUnchanged(action.side,action.path,snapshots[action.side].get(action.path));case 6:_context1.n=7;return move(getPath(action.side,action.path),__WEBPACK_EXTERNAL_MODULE_path_join__.apply(void 0,[getTrashDirectory(pairDirectory,date,action.side)].concat(synchronize_toConsumableArray(action.path.split("/")))));case 7:return _context1.a(3,18);case 8:_context1.p=8;_context1.n=9;return __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3_rmdir__(getPath(action.side,action.path));case 9:_context1.n=11;break;case 10:_context1.p=10;_t10=_context1.v;if(["ENOENT","ENOTEMPTY","EEXIST"].includes((_code=_t10.code)!==null&&_code!==void 0?_code:"")){_context1.n=11;break}throw _t10;case 11:return _context1.a(3,18);case 12:_context1.n=13;return hasSameContent(key,getPath("plain",action.path),getPath("cipher",action.path));case 13:if(_context1.v){_context1.n=14;break}_context1.n=14;return resolveConflict(action.path,action);case 14:return _context1.a(3,18);case 15:_context1.n=16;return resolveConflict(action.path,action);case 16:return _context1.a(3,18);case 17:return _context1.a(3,18);case 18:return _context1.a(2)}},_callee1,null,[[8,10]])}));function apply(_x21){return _apply.apply(this,arguments)}return apply}();// Updates the state of given path from what is on disk now.
refresh=/*#__PURE__*/function(){var _refresh=synchronize_asyncToGenerator(/*#__PURE__*/synchronize_regenerator().m(function _callee10(path){var plain,cipher;return synchronize_regenerator().w(function(_context10){while(1)switch(_context10.n){case 0:_context10.n=1;return getSnapshot(getPath("plain",path));case 1:plain=_context10.v;_context10.n=2;return getSnapshot(getPath("cipher",path));case 2:cipher=_context10.v;if(plain&&cipher&&plain.type===cipher.type)state.entries[path]={cipher:cipher,plain:plain};else if(!plain&&!cipher)delete state.entries[path];// NOTE: One sided leftovers keep their old state to be retried.
case 3:return _context10.a(2)}},_callee10)}));function refresh(_x22){return _refresh.apply(this,arguments)}return refresh}();touched=new Set;_iterator7=synchronize_createForOfIteratorHelper(actions);_context11.p=11;_iterator7.s();case 12:if((_step7=_iterator7.n()).done){_context11.n=18;break}_action=_step7.value;onAction(_action);if(!(_action.type==="skip")){_context11.n=13;break}return _context11.a(3,17);case 13:_context11.p=13;_context11.n=14;return apply(_action);case 14:_context11.n=16;break;case 15:_context11.p=15;_t13=_context11.v;_result.failed.push({path:_action.path,reason:_t13 instanceof Error?_t13.message:String(_t13)});case 16:for(_i2=0,_arr2=[_action.path].concat(synchronize_toConsumableArray("conflictPath"in _action?[_action.conflictPath]:[]));_i2<_arr2.length;_i2++){_path2=_arr2[_i2];for(current=_path2;current!==".";current=__WEBPACK_EXTERNAL_MODULE_path_posix__.dirname(current))touched.add(current)}case 17:_context11.n=12;break;case 18:_context11.n=20;break;case 19:_context11.p=19;_t14=_context11.v;_iterator7.e(_t14);case 20:_context11.p=20;_iterator7.f();return _context11.f(20);case 21:_iterator8=synchronize_createForOfIteratorHelper(touched);_context11.p=22;_iterator8.s();case 23:if((_step8=_iterator8.n()).done){_context11.n=25;break}_path3=_step8.value;_context11.n=24;return refresh(_path3);case 24:_context11.n=23;break;case 25:_context11.n=27;break;case 26:_context11.p=26;_t15=_context11.v;_iterator8.e(_t15);case 27:_context11.p=27;_iterator8.f();return _context11.f(27);case 28:state.synchronizedAt=date.toISOString();_context11.n=29;return saveState(pairDirectory,state);case 29:return _context11.a(2,_result);case 30:_context11.p=30;_context11.n=31;return releaseLock();case 31:return _context11.f(30);case 32:return _context11.a(2)}},_callee11,null,[[22,26,27,28],[13,15],[11,19,20,21],[3,,30,32]])}));function synchronize(_x11){return _synchronize.apply(this,arguments)}return synchronize}();
;// ./src/watch.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module watch *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 09.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function watch_slicedToArray(e,i){return watch_iterableToArrayLimit(e,i)||watch_unsupportedIterableToArray(e,i)||watch_nonIterableRest()}function watch_nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function watch_iterableToArrayLimit(r,t){var e=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){var l,n,i,a,u=[],o=!0,f=!1;try{if(i=(e=e.call(r)).next,0===t){if(Object(e)!==e)return;o=!1}else for(;!(o=(l=i.call(e)).done)&&(u.push(l.value),u.length!==t);o=!0);}catch(r){f=!0,n=r}finally{try{if(!o&&null!=e.return&&(a=e.return(),Object(a)!==a))return}finally{if(f)throw n}}return u}}function watch_createForOfIteratorHelper(e,t){var _n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!_n){if(Array.isArray(e)||(_n=watch_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){_n&&(e=_n);var o=0,F=function F(){};return{s:F,n:function n(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u,i=!0;return{s:function s(){_n=_n.call(e)},n:function n(){i=!0;var r=_n.next();return r.done?{done:!0}:{value:r.value,done:i=!1}},e:function e(r){a=!0,u=r},f:function f(){try{i||null==_n.return||_n.return()}finally{if(a)throw u}}}}function watch_unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return watch_arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?watch_arrayLikeToArray(t,e):void 0}}function watch_arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n};// endregion
/**
 * Watches given directory recursively.
 * @param path - Directory to watch.
 * @param onChange - Called with the changed path relative to given directory
 * (posix separated) or null if the operating system does not tell.
 * @param onError - Called when watching does not work anymore.
 * @returns Watcher to stop watching.
 *//**
 * Watches given directory recursively via the operating system's file
 * system events (FSEvents, ReadDirectoryChangesW or inotify).
 * @param path - Directory to watch.
 * @param onChange - Called with the changed relative posix path or null.
 * @param onError - Called when watching does not work anymore.
 * @returns Watcher to stop watching.
 */var watchDirectory=function watchDirectory(path,onChange,onError){// NOTE: Not persistent, the daemon's timers keep the process alive.
var watcher=__WEBPACK_EXTERNAL_MODULE_fs_watch__(path,{encoding:"utf-8",persistent:false,recursive:true},function(_,fileName){onChange(fileName===null?null:fileName.split(__WEBPACK_EXTERNAL_MODULE_path_sep__).join("/"))});watcher.on("error",onError);return{close:function close(){watcher.close()}}};/**
 * Decides whether a change of given path can affect the synchronization.
 * Our own temporary files, internal vault data and excluded entries
 * (including everything inside excluded directories) are irrelevant.
 * @param relativePath - Changed posix path relative to the side's root or
 * null if unknown.
 * @param side - Side the path belongs to.
 * @param isExcluded - Decides which relative paths are left out.
 * @returns Indicates whether a synchronization is needed.
 */var isRelevantChange=function isRelevantChange(relativePath,side,isExcluded){// An unknown path could be anything.
if(relativePath===null||relativePath==="")return true;if(isTemporaryPath(relativePath)||side==="cipher"&&isInternalPath(relativePath))return false;var segments=relativePath.split("/");for(var index=1;index<=segments.length;index+=1){var _path=segments.slice(0,index).join("/");/*
            NOTE: Whether the changed entry itself is a directory is unknown
            (it may be gone already), so both variants are checked.
        */if(isExcluded(_path,true)||index===segments.length&&isExcluded(_path,false))return false}return true};/**
 * Watches both sides of given pair for relevant changes.
 * @param pair - Pair to watch.
 * @param onChange - Called with each relevant change.
 * @param onError - Called when watching does not work anymore.
 * @param watchGivenDirectory - Watches one directory (replaceable for
 * testing).
 * @returns Watcher to stop watching both sides.
 */var watchPair=function watchPair(pair,onChange,onError,watchGivenDirectory){if(watchGivenDirectory===void 0){watchGivenDirectory=watchDirectory}var isExcluded=createExcludeMatcher(pair.excludes);var watchers=[];var close=function close(){for(var _i=0,_watchers=watchers;_i<_watchers.length;_i++){var watcher=_watchers[_i];watcher.close()}};try{var _iterator=watch_createForOfIteratorHelper([["plain",pair.plaintext],["cipher",pair.vault]]),_step;try{var _loop=function _loop(){var _step$value=watch_slicedToArray(_step.value,2),side=_step$value[0],path=_step$value[1];watchers.push(watchGivenDirectory(path,function(relativePath){if(isRelevantChange(relativePath,side,isExcluded))onChange({path:relativePath,side:side})},onError))};for(_iterator.s();!(_step=_iterator.n()).done;){_loop()}}catch(err){_iterator.e(err)}finally{_iterator.f()}}catch(error){close();throw error}return{close:close}};
;// ./src/cli.ts
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module cli *//* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
function cli_typeof(o){"@babel/helpers - typeof";return cli_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},cli_typeof(o)}function cli_toConsumableArray(a){return cli_arrayWithoutHoles(a)||cli_iterableToArray(a)||cli_unsupportedIterableToArray(a)||cli_nonIterableSpread()}function cli_nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function cli_arrayWithoutHoles(a){if(Array.isArray(a))return cli_arrayLikeToArray(a)}function cli_ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function cli_objectSpread(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?cli_ownKeys(Object(o),!0).forEach(function(t){cli_defineProperty(r,t,o[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):cli_ownKeys(Object(o)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(o,e))})}return r};function cli_regenerator(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var r,e,o="function"==typeof Symbol?Symbol:{},n=o.iterator||"@@iterator",a=o.toStringTag||"@@toStringTag";function i(o,n,a,i){var u=n&&n.prototype instanceof Generator?n:Generator,f=Object.create(u.prototype);return cli_regeneratorDefine2(f,"_invoke",function(t,o,n){var a,i,u,f=0,p=n||[],y=!1,G={p:0,n:0,v:r,a:l,f:l.bind(r,4),d:function d(t,e){return a=t,i=0,u=r,G.n=e,c}};function l(t,o){for(i=t,u=o,e=0;!y&&f&&!n&&e<p.length;e++){var n,a=p[e],l=G.p,F=a[2];t>3?(n=F===o)&&(u=a[(i=a[4])?5:(i=3,3)],a[4]=a[5]=r):a[0]<=l&&((n=t<2&&l<a[1])?(i=0,G.v=o,G.n=a[1]):l<F&&(n=t<3||a[0]>o||o>F)&&(a[4]=t,a[5]=o,G.n=F,i=0))}if(n||t>1)return c;throw y=!0,o}return function(n,p,F){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&l(p,F),i=p,u=F;(e=i<2?r:u)||!y;){a||(i?i<3?(i>1&&(G.n=-1),l(i,u)):G.n=u:G.v=u);try{if(f=2,a){if(i||(n="next"),e=a[n]){if(!(e=e.call(a,u)))throw TypeError("iterator result is not an object");if(!e.done)return e;u=e.value,i<2&&(i=0)}else 1===i&&(e=a.return)&&e.call(a),i<2&&(u=TypeError("The iterator does not provide a '"+n+"' method"),i=1);a=r}else if((e=(y=G.n<0)?u:t.call(o,G))!==c)break}catch(t){a=r,i=1,u=t}finally{f=1}}return{value:e,done:y}}}(o,a,i),!0),f}var c={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}e=Object.getPrototypeOf;var u=[][n]?e(e([][n]())):(cli_regeneratorDefine2(e={},n,function(){return this}),e),f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function p(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,GeneratorFunctionPrototype):(r.__proto__=GeneratorFunctionPrototype,cli_regeneratorDefine2(r,a,"GeneratorFunction")),r.prototype=Object.create(f),r}return GeneratorFunction.prototype=GeneratorFunctionPrototype,cli_regeneratorDefine2(f,"constructor",GeneratorFunctionPrototype),cli_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",cli_regeneratorDefine2(GeneratorFunctionPrototype,a,"GeneratorFunction"),cli_regeneratorDefine2(f),cli_regeneratorDefine2(f,a,"Generator"),cli_regeneratorDefine2(f,n,function(){return this}),cli_regeneratorDefine2(f,"toString",function(){return"[object Generator]"}),(cli_regenerator=function _regenerator(){return{w:i,m:p}})()}function cli_regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{})}catch(e){i=0}cli_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){cli_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e)})}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2))},cli_regeneratorDefine2(e,r,n,t)}function _toArray(e){return cli_iterableToArray(e)||cli_unsupportedIterableToArray(e)||cli_nonIterableRest()}function cli_iterableToArray(r){var e="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){for(var t,o=[],a=e.call(r);!(t=a.next()).done;)o.push(t.value);return o}}function cli_asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value}catch(n){return void e(n)}i.done?t(u):Promise.resolve(u).then(r,o)}function cli_asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){cli_asyncGeneratorStep(a,r,o,_next,_throw,"next",n)}function _throw(n){cli_asyncGeneratorStep(a,r,o,_next,_throw,"throw",n)}_next(void 0)})}}function cli_slicedToArray(e,i){return cli_iterableToArrayLimit(e,i)||cli_unsupportedIterableToArray(e,i)||cli_nonIterableRest()}function cli_nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function cli_iterableToArrayLimit(r,t){var e=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(Array.isArray(r)&&(null==e||e===("undefined"!=typeof Symbol&&[][Symbol.iterator])||e===[]["@@iterator"]))return r;if(null!=e){var l,n,i,a,u=[],o=!0,f=!1;try{if(i=(e=e.call(r)).next,0===t){if(Object(e)!==e)return;o=!1}else for(;!(o=(l=i.call(e)).done)&&(u.push(l.value),u.length!==t);o=!0);}catch(r){f=!0,n=r}finally{try{if(!o&&null!=e.return&&(a=e.return(),Object(a)!==a))return}finally{if(f)throw n}}return u}}function cli_createForOfIteratorHelper(e,t){var _n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!_n){if(Array.isArray(e)||(_n=cli_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){_n&&(e=_n);var o=0,F=function F(){};return{s:F,n:function n(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function e(r){throw r},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u,i=!0;return{s:function s(){_n=_n.call(e)},n:function n(){i=!0;var r=_n.next();return r.done?{done:!0}:{value:r.value,done:i=!1}},e:function e(r){a=!0,u=r},f:function f(){try{i||null==_n.return||_n.return()}finally{if(a)throw u}}}}function cli_unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return cli_arrayLikeToArray(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?cli_arrayLikeToArray(t,e):void 0}}function cli_arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}function cli_defineProperties(r,t){for(var o=0;o<t.length;o++){var i=t[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(r,cli_toPropertyKey(i.key),i)}}function cli_createClass(e,r,t){return r&&cli_defineProperties(e.prototype,r),t&&cli_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function cli_classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}function cli_inherits(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(r&&r.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),r&&cli_setPrototypeOf(t,r)}function cli_callSuper(e,c,p){return c=cli_getPrototypeOf(c),cli_possibleConstructorReturn(e,cli_isNativeReflectConstruct()?Reflect.construct(c,p||[],cli_getPrototypeOf(e).constructor):c.apply(e,p))}function cli_possibleConstructorReturn(t,e){if(e&&("object"==cli_typeof(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return cli_assertThisInitialized(t)}function cli_assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function cli_wrapNativeSuper(p){var n="function"==typeof Map?new Map:void 0;return cli_wrapNativeSuper=function _wrapNativeSuper(p){if(null===p||!cli_isNativeFunction(p))return p;if("function"!=typeof p)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(p))return n.get(p);n.set(p,Wrapper)}function Wrapper(){return cli_construct(p,arguments,cli_getPrototypeOf(this).constructor)}return Wrapper.prototype=Object.create(p.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),cli_setPrototypeOf(Wrapper,p)},cli_wrapNativeSuper(p)}function cli_construct(e,o,p){if(cli_isNativeReflectConstruct())return Reflect.construct.apply(null,arguments);var n=[null];n.push.apply(n,o);var l=new(e.bind.apply(e,n));return p&&cli_setPrototypeOf(l,p.prototype),l}function cli_isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch(t){}return(cli_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function cli_isNativeFunction(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(n){return"function"==typeof t}}function cli_setPrototypeOf(t,e){return cli_setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},cli_setPrototypeOf(t,e)}function cli_getPrototypeOf(t){return cli_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},cli_getPrototypeOf(t)}function cli_defineProperty(r,t,o){return(t=cli_toPropertyKey(t))in r?Object.defineProperty(r,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[t]=o,r}function cli_toPropertyKey(r){var o=cli_toPrimitive(r,"string");return"symbol"==cli_typeof(o)?o:o+""}function cli_toPrimitive(t,e){if("object"!=cli_typeof(t)||!t)return t;var r;if("undefined"!=typeof Symbol&&void 0!==(r=t[Symbol.toPrimitive])){var i=r.call(t,e||"default");if("object"!=cli_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}function cli_asyncIterator(r){var n,t,o,e=2;for("undefined"!=typeof Symbol&&(t=Symbol.asyncIterator,o=Symbol.iterator);e--;){if(t&&null!=(n=r[t]))return n.call(r);if(o&&null!=(n=r[o]))return new cli_AsyncFromSyncIterator(n.call(r));t="@@asyncIterator",o="@@iterator"}throw new TypeError("Object is not async iterable")}function cli_AsyncFromSyncIterator(r){function AsyncFromSyncIteratorContinuation(r){if(Object(r)!==r)return Promise.reject(new TypeError(r+" is not an object."));var n=r.done;return Promise.resolve(r.value).then(function(r){return{value:r,done:n}})}return cli_AsyncFromSyncIterator=function AsyncFromSyncIterator(r){this.s=r,this.n=r.next},cli_AsyncFromSyncIterator.prototype={s:null,n:null,next:function next(){return AsyncFromSyncIteratorContinuation(this.n.apply(this.s,arguments))},return:function _return(r){var n=this.s.return;return void 0===n?Promise.resolve({value:r,done:!0}):AsyncFromSyncIteratorContinuation(n.apply(this.s,arguments))},throw:function _throw(r){var n=this.s.throw;return void 0===n?Promise.reject(r):AsyncFromSyncIteratorContinuation(n.apply(this.s,arguments))}},new cli_AsyncFromSyncIterator(r)};// endregion
// Exit codes aligned with gocryptfs where an equivalent exists.
var EXIT_CODES={error:1,usage:2,unsupportedVault:3,locked:4,wrongPassword:12};var USAGE="Usage: gocryptfs-standalone <command> [options]\n\nWorks with gocryptfs vaults created with \"gocryptfs -init -plaintextnames\"\nwithout FUSE.\n\nCommands:\n  init <vault>                   Create a new vault (directory must be empty).\n  info <vault>                   Show vault configuration.\n  cat <vault> <path>             Decrypt one file to standard output.\n  decrypt <vault> <target>       Decrypt the whole vault into target.\n  encrypt <source> <vault>       Encrypt the whole source into the vault.\n  sync <plaintext> <vault>       Synchronize both directions (see below).\n  sync [<pair>]                  Synchronize given or all configured pairs.\n\n  pair add <name> <plaintext> <vault>\n                                 Configure a pair (verifies the password and\n                                 stores it in the keychain by default).\n  pair remove <name>             Remove a pair (keeps its trash).\n  pair list                      Show configured pairs.\n  daemon [<pair>...]             Synchronize pairs shortly after changes and\n                                 in their intervals until stopped.\n  service install|uninstall|status\n                                 Start \"daemon\" automatically after log in\n                                 (per user, no admin rights needed).\n\nOptions:\n  --config <path>                Configuration file of the vault (default:\n                                 \"gocryptfs.conf\" or \".gocryptfs.conf\" in\n                                 the vault, \"init\" creates the former).\n  --passfile <path>              Read the password from the file's first line.\n  --extpass <command>            Read the password from a command's output.\n  --masterkey <hex>              Use the master key instead of a password.\n  --scryptn <number>             Scrypt cost as binary logarithm for \"init\"\n                                 (default ".concat(String(DEFAULT_SCRYPT_LOG_N),").\n  --exclude <pattern>            Leave out matching entries on both sides\n                                 (repeatable, see below).\n  --dry-run                      Only show what \"sync\" would do.\n  --trash-days <number>          Days to keep entries \"sync\" moved into the\n                                 trash (default ").concat(String(DEFAULT_TRASH_RETENTION_IN_DAYS),").\n  --interval <duration>          Synchronization interval of a pair, e.g.\n                                 \"30s\", \"10m\" (default) or \"2h\".\n  --no-watch                     Synchronize a pair only in its interval, not\n                                 shortly after file system changes.\n  --password <source>            Password source of a pair: \"keychain\"\n                                 (default), \"prompt\" or \"environment\".\n                                 \"--passfile\" and \"--extpass\" configure a\n                                 file or command instead.\n  -h, --help                     Show this help.\n  -v, --version                  Show the version.\n\nThe password can also be given via the environment variable\n\"GOCRYPTFS_PASSWORD\". Without any source it is asked for interactively.\n\n\"sync\" remembers the state after each run (in the user's configuration\ndirectory). Changes on one side are copied to the other side, deletions are\nmoved into a trash directory there, and changes on both sides keep both\nversions (the older one as conflict copy).\n\nExclude patterns follow gitignore conventions: without a slash they match\nnames at any depth (\"*.tmp\", \".DS_Store\"), with a slash paths relative to\nthe root (\"docs/*.pdf\", \"/build\"), a trailing slash only matches directories\n(\"cache/\"). Supported globs: \"*\", \"**\", \"?\", \"[...]\" and \"{a,b}\".\n\nPairs, their intervals, excludes and password sources are configured in\n\"configuration.json\" in the user's configuration directory (see readme).\n");var defaultOutput={error:function error(text){process.stderr.write("".concat(text,"\n"))},isTerminal:process.stderr.isTTY,log:function log(text){process.stderr.write("".concat(text,"\n"))},write:function write(data){return new Promise(function(resolve,reject){process.stdout.write(data,function(error){if(error)reject(error);else resolve()})})}};var UsageError=/*#__PURE__*/function(_Error){function UsageError(){var _this;cli_classCallCheck(this,UsageError);for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key]}_this=cli_callSuper(this,UsageError,[].concat(args));cli_defineProperty(_this,"name","UsageError");return _this}cli_inherits(UsageError,_Error);return cli_createClass(UsageError)}(/*#__PURE__*/cli_wrapNativeSuper(Error));/**
 * Checks whether one of given paths is located inside the other one.
 * @param first - First absolute path.
 * @param second - Second absolute path.
 * @returns Indicates whether the paths overlap.
 */var isNested=function isNested(first,second){return first===second||first.startsWith(__WEBPACK_EXTERNAL_MODULE_path_join__(second,"/"))||second.startsWith(__WEBPACK_EXTERNAL_MODULE_path_join__(first,"/"))};/**
 * Finds two pairs whose directories (plaintext or vault) are located inside
 * each other, so they would synchronize each other's files.
 * @param pairs - Configured pairs by name.
 * @returns Names of the first two overlapping pairs or null.
 */var findOverlappingPairs=function findOverlappingPairs(pairs){var entries=Object.entries(pairs);var _iterator3=cli_createForOfIteratorHelper(entries.entries()),_step3;try{for(_iterator3.s();!(_step3=_iterator3.n()).done;){var _step3$value=cli_slicedToArray(_step3.value,2),index=_step3$value[0],_step3$value$=cli_slicedToArray(_step3$value[1],2),firstName=_step3$value$[0],first=_step3$value$[1];var _iterator4=cli_createForOfIteratorHelper(entries.slice(index+1)),_step4;try{for(_iterator4.s();!(_step4=_iterator4.n()).done;){var _step4$value=cli_slicedToArray(_step4.value,2),secondName=_step4$value[0],second=_step4$value[1];for(var _i=0,_arr=[first.plaintext,first.vault];_i<_arr.length;_i++){var firstPath=_arr[_i];for(var _i2=0,_arr2=[second.plaintext,second.vault];_i2<_arr2.length;_i2++){var secondPath=_arr2[_i2];if(isNested(__WEBPACK_EXTERNAL_MODULE_path_resolve__(firstPath),__WEBPACK_EXTERNAL_MODULE_path_resolve__(secondPath)))return[firstName,secondName]}}}}catch(err){_iterator4.e(err)}finally{_iterator4.f()}}}catch(err){_iterator3.e(err)}finally{_iterator3.f()}return null};/**
 * Ensures that no configured pairs overlap.
 * @param pairs - Configured pairs by name.
 */var assertNoOverlappingPairs=function assertNoOverlappingPairs(pairs){var overlapping=findOverlappingPairs(pairs);if(overlapping)throw new UsageError("Pairs \"".concat(overlapping[0],"\" and \"").concat(overlapping[1],"\" overlap, ")+"their directories must not be located inside each other.")};/**
 * Describes given synchronization action for humans.
 * @param action - Action to describe.
 * @returns Description or null for pure bookkeeping actions.
 */var describeAction=function describeAction(action){var sideName=function sideName(side){return side==="plain"?"plaintext":"vault"};switch(action.type){case"transfer":return"".concat(action.from==="plain"?"encrypt":"decrypt"," ")+action.path;case"createDirectory":return"create directory in ".concat(sideName(action.side)," ").concat(action.path);case"trash":return"trash in ".concat(sideName(action.side)," ").concat(action.path);case"removeDirectory":return"remove directory in ".concat(sideName(action.side)," ").concat(action.path);case"compare":case"conflict":return(action.type==="compare"?"compare (on difference: ":"")+"conflict ".concat(action.path," -> ").concat(sideName(action.loser)," version ")+"kept as \"".concat(action.conflictPath,"\"")+(action.type==="compare"?")":"");case"skip":return"skip ".concat(action.path,": ").concat(action.reason);default:return null}};/**
 * Prints a summary of given tree transformation.
 * @param output - Output channels.
 * @param verb - Describes the transformation.
 * @param result - Transformation result.
 * @returns Exit code.
 */var report=function report(output,verb,result){output.log("".concat(verb," ").concat(String(result.files)," files, ")+"".concat(String(result.directories)," directories and ")+"".concat(String(result.symbolicLinks)," symbolic links."));var _iterator5=cli_createForOfIteratorHelper(result.skipped),_step5;try{for(_iterator5.s();!(_step5=_iterator5.n()).done;){var _step5$value=_step5.value,path=_step5$value.path,reason=_step5$value.reason;output.error("Skipped \"".concat(path,"\": ").concat(reason))}}catch(err){_iterator5.e(err)}finally{_iterator5.f()}return result.skipped.length>0?EXIT_CODES.error:0};/**
 * Runs the command line interface.
 * @param argv - Arguments without node and script path.
 * @param output - Output channels.
 * @param givenDependencies - Replaces platform integrations (for testing).
 * @returns Exit code.
 */var run=/*#__PURE__*/function(){var _run=cli_asyncToGenerator(/*#__PURE__*/cli_regenerator().m(function _callee6(argv,output,givenDependencies){var getKeychain,_values$exclude,_ref,_values$extpass,_parseArgs,positionals,values,_positionals,command,parameters,isExcluded,expectParameters,getPasswordBuffer,hasExplicitPassword,getContentKey,parseTrashDays,_synchronizePair2,getPairs,masterKey,configuration,_parameters,vaultPath,path,contentKey,_iteratorAbruptCompletion,_didIteratorError,_iteratorError,_iterator,_step,block,_parameters$map,_parameters$map2,_vaultPath,targetPath,_contentKey,result,_parameters$map3,_parameters$map4,sourcePath,_vaultPath2,_contentKey2,_result,pairs,_values$exclude3,_parseTrashDays,_parameters$map5,_parameters$map6,plaintext,vault,_dryRun,failed,_iterator7,_step7,_pair,_contentKey3,_result2,_parameters2,subcommand,pairParameters,settings,names,_i3,_names,name,_pair2,_pairParameters,_name,_pair3,_values$password,_pairParameters2,_name2,plaintextPath,_vaultPath3,_plaintext,_vault,password,config,_configuration,givenPassword,_pairs,_iterator8,_step8,_pair6,releaseLocks,_givenDependencies$si,_iterator9,_step9,_pair4,contentKeys,_iterator0,_step0,_pair5,abortController,stop,signal,_iterator1,_step1,_name3,log,_givenDependencies$wa,_iterator10,_step10,_name4,_iterator11,_step11,key,_i4,_releaseLocks,releaseLock,_givenDependencies$se,_parameters3,_subcommand,service,_pairs2,interactive,_code,message,_t9,_t0,_t1,_t10,_t11,_t12,_t13,_t14,_t15,_t16,_t17,_t18,_t19,_t20,_t21;return cli_regenerator().w(function(_context6){while(1)switch(_context6.p=_context6.n){case 0:if(output===void 0){output=defaultOutput}if(givenDependencies===void 0){givenDependencies={}}getKeychain=function getKeychain(){var _givenDependencies$ke;return(_givenDependencies$ke=givenDependencies.keychain)!==null&&_givenDependencies$ke!==void 0?_givenDependencies$ke:createKeychain()};_context6.p=1;_parseArgs=__WEBPACK_EXTERNAL_MODULE_util_parseArgs__({// NOTE: Allows "--no-watch".
allowNegative:true,allowPositionals:true,args:argv,options:{config:{type:"string"},extpass:{type:"string"},help:{short:"h",type:"boolean"},masterkey:{type:"string"},passfile:{type:"string"},scryptn:{type:"string"},"dry-run":{type:"boolean"},exclude:{multiple:true,type:"string"},"trash-days":{type:"string"},interval:{type:"string"},password:{type:"string"},version:{short:"v",type:"boolean"},watch:{type:"boolean"}}}),positionals=_parseArgs.positionals,values=_parseArgs.values;if(!values.version){_context6.n=3;break}_context6.n=2;return output.write(Buffer.from("".concat(package_namespaceObject.rE,"\n")));case 2:return _context6.a(2,0);case 3:_positionals=_toArray(positionals),command=_positionals[0],parameters=cli_arrayLikeToArray(_positionals).slice(1);if(!values.help){_context6.n=5;break}_context6.n=4;return output.write(Buffer.from(USAGE));case 4:return _context6.a(2,0);case 5:if(command){_context6.n=6;break}output.error(USAGE);return _context6.a(2,EXIT_CODES.usage);case 6:isExcluded=createExcludeMatcher((_values$exclude=values.exclude)!==null&&_values$exclude!==void 0?_values$exclude:[]);expectParameters=function expectParameters(names){if(parameters.length!==names.length)throw new UsageError("Command \"".concat(command,"\" expects: ")+names.map(function(name){return"<".concat(name,">")}).join(" "))};getPasswordBuffer=/*#__PURE__*/function(){var _getPasswordBuffer=cli_asyncToGenerator(/*#__PURE__*/cli_regenerator().m(function _callee(confirm){var _t;return cli_regenerator().w(function(_context){while(1)switch(_context.n){case 0:if(confirm===void 0){confirm=false}_t=Buffer;_context.n=1;return getPassword({confirm:confirm,externalProgram:values.extpass,file:values.passfile});case 1:return _context.a(2,_t.from.call(_t,_context.v))}},_callee)}));function getPasswordBuffer(_x4){return _getPasswordBuffer.apply(this,arguments)}return getPasswordBuffer}();hasExplicitPassword=Boolean((_ref=(_values$extpass=values.extpass)!==null&&_values$extpass!==void 0?_values$extpass:values.masterkey)!==null&&_ref!==void 0?_ref:values.passfile);/*
            NOTE: Password options given on the command line take precedence
            over the one configured for a pair.
        */getContentKey=/*#__PURE__*/function(){var _getContentKey=cli_asyncToGenerator(/*#__PURE__*/cli_regenerator().m(function _callee2(vaultPath,pair,configurationPath){var configuration,masterKey,contentKey,samplePath,_iteratorAbruptCompletion2,_didIteratorError2,_iteratorError2,_iterator2,_step2,_,_t2,_t3,_t4,_t5,_t6,_t7,_t8;return cli_regenerator().w(function(_context2){while(1)switch(_context2.p=_context2.n){case 0:if(configurationPath===void 0){configurationPath=pair?pair.config:values.config}_context2.n=1;return loadConfiguration(vaultPath,configurationPath);case 1:configuration=_context2.v;if(!values.masterkey){_context2.n=2;break}_t2=parseMasterKey(values.masterkey);_context2.n=8;break;case 2:_t3=unlockMasterKey;_t4=configuration;if(!(pair&&!hasExplicitPassword)){_context2.n=4;break}_t6=Buffer;_context2.n=3;return getPairPassword(pair.password,pair.name,getKeychain());case 3:_t5=_t6.from.call(_t6,_context2.v);_context2.n=6;break;case 4:_context2.n=5;return getPasswordBuffer();case 5:_t5=_context2.v;case 6:_context2.n=7;return _t3(_t4,_t5);case 7:_t2=_context2.v;case 8:masterKey=_t2;contentKey=deriveContentKey(masterKey);masterKey.fill(0);if(!values.masterkey){_context2.n=25;break}_context2.n=9;return findSampleFile(vaultPath);case 9:samplePath=_context2.v;if(!samplePath){_context2.n=25;break}_context2.p=10;_iteratorAbruptCompletion2=false;_didIteratorError2=false;_context2.p=11;_iterator2=cli_asyncIterator(decryptFileContent(contentKey,samplePath));case 12:_context2.n=13;return _iterator2.next();case 13:if(!(_iteratorAbruptCompletion2=!(_step2=_context2.v).done)){_context2.n=15;break}_=_step2.value;return _context2.a(3,15);case 14:_iteratorAbruptCompletion2=false;_context2.n=12;break;case 15:_context2.n=17;break;case 16:_context2.p=16;_t7=_context2.v;_didIteratorError2=true;_iteratorError2=_t7;case 17:_context2.p=17;_context2.p=18;if(!(_iteratorAbruptCompletion2&&_iterator2.return!=null)){_context2.n=19;break}_context2.n=19;return _iterator2.return();case 19:_context2.p=19;if(!_didIteratorError2){_context2.n=20;break}throw _iteratorError2;case 20:return _context2.f(19);case 21:return _context2.f(17);case 22:_context2.n=25;break;case 23:_context2.p=23;_t8=_context2.v;if(!(_t8 instanceof CorruptFileError)){_context2.n=24;break}throw new WrongPasswordError("Master key does not match the vault content.");case 24:throw _t8;case 25:return _context2.a(2,contentKey)}},_callee2,null,[[18,,19,21],[11,16,17,22],[10,23]])}));function getContentKey(_x5,_x6,_x7){return _getContentKey.apply(this,arguments)}return getContentKey}();parseTrashDays=function parseTrashDays(){if(values["trash-days"]===undefined)return undefined;var days=Number(values["trash-days"]);if(!Number.isInteger(days)||days<0)throw new UsageError("\"--trash-days\" has to be a non negative integer.");return days};_synchronizePair2=/*#__PURE__*/function(){var _synchronizePair=cli_asyncToGenerator(/*#__PURE__*/cli_regenerator().m(function _callee3(pair,contentKey,log,dryRun){var result,_iterator6,_step6,_step6$value,path,reason,changes;return cli_regenerator().w(function(_context3){while(1)switch(_context3.n){case 0:if(dryRun===void 0){dryRun=false}_context3.n=1;return synchronize({dryRun:dryRun,excludes:createExcludeMatcher(pair.excludes),key:contentKey,onAction:function onAction(action){var description=describeAction(action);if(description)log(description)},plainPath:pair.plaintext,trashRetentionInDays:pair.trashDays,vaultPath:pair.vault});case 1:result=_context3.v;if(result.warning)output.error(result.warning);_iterator6=cli_createForOfIteratorHelper(result.failed);try{for(_iterator6.s();!(_step6=_iterator6.n()).done;){_step6$value=_step6.value,path=_step6$value.path,reason=_step6$value.reason;output.error("Failed \"".concat(path,"\": ").concat(reason))}}catch(err){_iterator6.e(err)}finally{_iterator6.f()}changes=result.actions.filter(function(action){return!["forget","record","skip"].includes(action.type)}).length;return _context3.a(2,{changes:changes,failed:result.failed.length>0||result.actions.some(function(action){return action.type==="skip"}),summary:"".concat(dryRun?"Would apply":"Applied"," ")+"".concat(String(changes-result.failed.length)," changes")+(result.failed.length>0?", ".concat(String(result.failed.length)," failed"):"")+"."})}},_callee3)}));function synchronizePair(_x8,_x9,_x0,_x1){return _synchronizePair.apply(this,arguments)}return synchronizePair}();getPairs=/*#__PURE__*/function(){var _getPairs=cli_asyncToGenerator(/*#__PURE__*/cli_regenerator().m(function _callee4(names){var settings,pairNames,trashDays;return cli_regenerator().w(function(_context4){while(1)switch(_context4.n){case 0:_context4.n=1;return loadSettings();case 1:settings=_context4.v;// NOTE: Also checks pairs not given, they may run elsewhere.
assertNoOverlappingPairs(settings.pairs);pairNames=names.length>0?names:Object.keys(settings.pairs);if(!(pairNames.length===0)){_context4.n=2;break}throw new UsageError("No pairs configured, see \"pair add\" or give a "+"plaintext directory and a vault.");case 2:if(!(values.config!==undefined)){_context4.n=3;break}throw new UsageError("\"--config\" applies to a given vault only, configure "+"\"config\" of the pair instead.");case 3:trashDays=parseTrashDays();return _context4.a(2,pairNames.map(function(name){var _values$exclude2,_values$watch;var pair=resolvePair(settings,name);return cli_objectSpread(cli_objectSpread(cli_objectSpread({},pair),pair.config===undefined?{}:{config:__WEBPACK_EXTERNAL_MODULE_path_resolve__(pair.config)}),{},{excludes:[].concat(cli_toConsumableArray(pair.excludes),cli_toConsumableArray((_values$exclude2=values.exclude)!==null&&_values$exclude2!==void 0?_values$exclude2:[])),plaintext:__WEBPACK_EXTERNAL_MODULE_path_resolve__(pair.plaintext),trashDays:trashDays!==null&&trashDays!==void 0?trashDays:pair.trashDays,vault:__WEBPACK_EXTERNAL_MODULE_path_resolve__(pair.vault),watch:(_values$watch=values.watch)!==null&&_values$watch!==void 0?_values$watch:pair.watch})}))}},_callee4)}));function getPairs(_x10){return _getPairs.apply(this,arguments)}return getPairs}();_t9=command;_context6.n=_t9==="init"?7:_t9==="info"?11:_t9==="cat"?13:_t9==="decrypt"?28:_t9==="encrypt"?32:_t9==="sync"?36:_t9==="pair"?53:_t9==="daemon"?74:_t9==="service"?107:112;break;case 7:expectParameters(["vault"]);if(!values.masterkey){_context6.n=8;break}throw new UsageError("A new vault always gets a new random master key.");case 8:_t0=initializeVault;_t1=parameters[0];_context6.n=9;return getPasswordBuffer(true);case 9:_context6.n=10;return _t0(_t1,_context6.v,values.scryptn===undefined?undefined:Number(values.scryptn),values.config);case 10:masterKey=_context6.v;output.log("Created vault in \"".concat(parameters[0],"\"."));if(output.isTerminal)output.log("\nYour master key is:\n\n    "+formatMasterKey(masterKey).replace("\n","\n    ")+"\n\nIf the configuration file gets lost or the "+"password forgotten, it is\nthe only way to access the "+"data. Keep it somewhere safe.");masterKey.fill(0);return _context6.a(2,0);case 11:expectParameters(["vault"]);_context6.n=12;return loadConfiguration(parameters[0],values.config);case 12:configuration=_context6.v;output.log("Creator:       ".concat(configuration.creator,"\n")+"Version:       ".concat(String(configuration.version),"\n")+"Feature flags: "+"".concat(configuration.featureFlags.join(" "),"\n")+"Scrypt:        N=".concat(String(configuration.scrypt.n)," ")+"R=".concat(String(configuration.scrypt.r)," ")+"P=".concat(String(configuration.scrypt.p)));return _context6.a(2,0);case 13:expectParameters(["vault","path"]);_parameters=cli_slicedToArray(parameters,2),vaultPath=_parameters[0],path=_parameters[1];if(!isInternalPath(path)){_context6.n=14;break}throw new UsageError("\"".concat(path,"\" is internal vault data."));case 14:_context6.n=15;return getContentKey(vaultPath);case 15:contentKey=_context6.v;_iteratorAbruptCompletion=false;_didIteratorError=false;_context6.p=16;_iterator=cli_asyncIterator(decryptFileContent(contentKey,__WEBPACK_EXTERNAL_MODULE_path_join__(vaultPath,path)));case 17:_context6.n=18;return _iterator.next();case 18:if(!(_iteratorAbruptCompletion=!(_step=_context6.v).done)){_context6.n=20;break}block=_step.value;_context6.n=19;return output.write(block);case 19:_iteratorAbruptCompletion=false;_context6.n=17;break;case 20:_context6.n=22;break;case 21:_context6.p=21;_t10=_context6.v;_didIteratorError=true;_iteratorError=_t10;case 22:_context6.p=22;_context6.p=23;if(!(_iteratorAbruptCompletion&&_iterator.return!=null)){_context6.n=24;break}_context6.n=24;return _iterator.return();case 24:_context6.p=24;if(!_didIteratorError){_context6.n=25;break}throw _iteratorError;case 25:return _context6.f(24);case 26:return _context6.f(22);case 27:return _context6.a(2,0);case 28:expectParameters(["vault","target"]);_parameters$map=parameters.map(function(path){return __WEBPACK_EXTERNAL_MODULE_path_resolve__(path)}),_parameters$map2=cli_slicedToArray(_parameters$map,2),_vaultPath=_parameters$map2[0],targetPath=_parameters$map2[1];if(!isNested(_vaultPath,targetPath)){_context6.n=29;break}throw new UsageError("Vault and target must not be located inside each other.");case 29:_context6.n=30;return getContentKey(_vaultPath);case 30:_contentKey=_context6.v;_context6.n=31;return decryptTree(_contentKey,_vaultPath,targetPath,isExcluded);case 31:result=_context6.v;_contentKey.fill(0);return _context6.a(2,report(output,"Decrypted",result));case 32:expectParameters(["source","vault"]);_parameters$map3=parameters.map(function(path){return __WEBPACK_EXTERNAL_MODULE_path_resolve__(path)}),_parameters$map4=cli_slicedToArray(_parameters$map3,2),sourcePath=_parameters$map4[0],_vaultPath2=_parameters$map4[1];if(!isNested(sourcePath,_vaultPath2)){_context6.n=33;break}throw new UsageError("Source and vault must not be located inside each other.");case 33:_context6.n=34;return getContentKey(_vaultPath2);case 34:_contentKey2=_context6.v;_context6.n=35;return encryptTree(_contentKey2,sourcePath,_vaultPath2,isExcluded);case 35:_result=_context6.v;_contentKey2.fill(0);return _context6.a(2,report(output,"Encrypted",_result));case 36:if(!(parameters.length===2)){_context6.n=37;break}_parameters$map5=parameters.map(function(path){return __WEBPACK_EXTERNAL_MODULE_path_resolve__(path)}),_parameters$map6=cli_slicedToArray(_parameters$map5,2),plaintext=_parameters$map6[0],vault=_parameters$map6[1];pairs=[cli_objectSpread(cli_objectSpread({},values.config===undefined?{}:{config:values.config}),{},{excludes:(_values$exclude3=values.exclude)!==null&&_values$exclude3!==void 0?_values$exclude3:[],intervalInMilliseconds:0,name:"command line",password:"prompt",plaintext:plaintext,trashDays:(_parseTrashDays=parseTrashDays())!==null&&_parseTrashDays!==void 0?_parseTrashDays:DEFAULT_TRASH_RETENTION_IN_DAYS,vault:vault,watch:false})];_context6.n=40;break;case 37:if(!(parameters.length<2)){_context6.n=39;break}_context6.n=38;return getPairs(parameters);case 38:pairs=_context6.v;_context6.n=40;break;case 39:throw new UsageError("Command \"sync\" expects: [<pair>] or <plaintext> <vault>");case 40:_dryRun=Boolean(values["dry-run"]);failed=false;_iterator7=cli_createForOfIteratorHelper(pairs);_context6.p=41;_iterator7.s();case 42:if((_step7=_iterator7.n()).done){_context6.n=49;break}_pair=_step7.value;if(!isNested(_pair.plaintext,_pair.vault)){_context6.n=43;break}throw new UsageError("Plaintext directory and vault must not be located "+"inside each other.");case 43:if(pairs.length>1)output.log("Pair \"".concat(_pair.name,"\":"));_context6.n=44;return getContentKey(_pair.vault,parameters.length===2?undefined:_pair,_pair.config);case 44:_contentKey3=_context6.v;_context6.p=45;_context6.n=46;return _synchronizePair2(_pair,_contentKey3,output.log,_dryRun);case 46:_result2=_context6.v;output.log(_result2.summary);failed||(failed=_result2.failed);case 47:_context6.p=47;_contentKey3.fill(0);return _context6.f(47);case 48:_context6.n=42;break;case 49:_context6.n=51;break;case 50:_context6.p=50;_t11=_context6.v;_iterator7.e(_t11);case 51:_context6.p=51;_iterator7.f();return _context6.f(51);case 52:return _context6.a(2,failed?EXIT_CODES.error:0);case 53:_parameters2=_toArray(parameters),subcommand=_parameters2[0],pairParameters=cli_arrayLikeToArray(_parameters2).slice(1);_context6.n=54;return loadSettings();case 54:settings=_context6.v;if(!(subcommand==="list"&&pairParameters.length===0)){_context6.n=55;break}names=Object.keys(settings.pairs);if(names.length===0)output.log("No pairs configured.");for(_i3=0,_names=names;_i3<_names.length;_i3++){name=_names[_i3];_pair2=resolvePair(settings,name);output.log("".concat(name,":\n")+"    plaintext: ".concat(_pair2.plaintext,"\n")+"    vault:     ".concat(_pair2.vault,"\n")+(_pair2.config===undefined?"":"    config:    ".concat(_pair2.config,"\n"))+"    interval:  "+"".concat(String(_pair2.intervalInMilliseconds/1000),"s\n")+"    password:  "+"".concat(JSON.stringify(_pair2.password),"\n")+"    trash:     ".concat(String(_pair2.trashDays)," days\n")+"    watch:     ".concat(_pair2.watch?"yes":"no","\n")+"    excludes:  ".concat(_pair2.excludes.join(" ")))}return _context6.a(2,0);case 55:if(!(subcommand==="remove"&&pairParameters.length===1)){_context6.n=61;break}_pairParameters=cli_slicedToArray(pairParameters,1),_name=_pairParameters[0];_pair3=resolvePair(settings,_name);delete settings.pairs[_name];_context6.n=56;return saveSettings(settings);case 56:if(!(_pair3.password==="keychain")){_context6.n=60;break}_context6.p=57;_context6.n=58;return getKeychain().delete(_name);case 58:_context6.n=60;break;case 59:_context6.p=59;_t12=_context6.v;output.error("Could not remove the password from the "+"keychain: ".concat(_t12.message));case 60:output.log("Removed pair \"".concat(_name,"\"."));return _context6.a(2,0);case 61:if(!(subcommand==="add"&&pairParameters.length===3)){_context6.n=73;break}_pairParameters2=cli_slicedToArray(pairParameters,3),_name2=_pairParameters2[0],plaintextPath=_pairParameters2[1],_vaultPath3=_pairParameters2[2];if(PAIR_NAME_PATTERN.test(_name2)){_context6.n=62;break}throw new UsageError("Invalid pair name \"".concat(_name2,"\" (letters, digits, ")+"\".\", \"_\" and \"-\" only).");case 62:if(!Object.prototype.hasOwnProperty.call(settings.pairs,_name2)){_context6.n=63;break}throw new UsageError("Pair \"".concat(_name2,"\" already exists."));case 63:_plaintext=__WEBPACK_EXTERNAL_MODULE_path_resolve__(plaintextPath);_vault=__WEBPACK_EXTERNAL_MODULE_path_resolve__(_vaultPath3);if(!isNested(_plaintext,_vault)){_context6.n=64;break}throw new UsageError("Plaintext directory and vault must not be located "+"inside each other.");case 64:assertNoOverlappingPairs(cli_objectSpread(cli_objectSpread({},settings.pairs),{},cli_defineProperty({},_name2,{plaintext:_plaintext,vault:_vault})));if(values.interval!==undefined)parseInterval(values.interval);password=values.passfile?{file:__WEBPACK_EXTERNAL_MODULE_path_resolve__(values.passfile)}:values.extpass?{command:values.extpass}:validatePasswordSource((_values$password=values.password)!==null&&_values$password!==void 0?_values$password:"keychain");config=values.config===undefined?undefined:__WEBPACK_EXTERNAL_MODULE_path_resolve__(values.config);// Verify the password before anything gets saved.
_context6.n=65;return loadConfiguration(_vault,config);case 65:_configuration=_context6.v;if(!(password!=="prompt"&&password!=="environment")){_context6.n=71;break}if(!(password==="keychain")){_context6.n=67;break}_context6.n=66;return getPassword({});case 66:_t13=_context6.v;_context6.n=69;break;case 67:_context6.n=68;return getPairPassword(password,_name2,getKeychain());case 68:_t13=_context6.v;case 69:givenPassword=_t13;_context6.n=70;return unlockMasterKey(_configuration,Buffer.from(givenPassword));case 70:_context6.v.fill(0);if(!(password==="keychain")){_context6.n=71;break}_context6.n=71;return getKeychain().store(_name2,givenPassword);case 71:settings.pairs[_name2]=cli_objectSpread(cli_objectSpread(cli_objectSpread(cli_objectSpread(cli_objectSpread({},config===undefined?{}:{config:config}),values.exclude?{excludes:values.exclude}:{}),values.interval?{interval:values.interval}:{}),{},{password:password,plaintext:_plaintext},values["trash-days"]===undefined?{}:{trashDays:parseTrashDays()}),{},{vault:_vault},values.watch===undefined?{}:{watch:values.watch});// Validates the complete pair before saving.
resolvePair(settings,_name2);_context6.n=72;return saveSettings(settings);case 72:output.log("Added pair \"".concat(_name2,"\"."));return _context6.a(2,0);case 73:throw new UsageError("Command \"pair\" expects: add <name> <plaintext> <vault>, "+"remove <name> or list");case 74:_context6.n=75;return getPairs(parameters);case 75:_pairs=_context6.v;_iterator8=cli_createForOfIteratorHelper(_pairs);_context6.p=76;_iterator8.s();case 77:if((_step8=_iterator8.n()).done){_context6.n=79;break}_pair6=_step8.value;if(!isNested(_pair6.plaintext,_pair6.vault)){_context6.n=78;break}throw new UsageError("Pair \"".concat(_pair6.name,"\": plaintext directory and vault ")+"must not be located inside each other.");case 78:_context6.n=77;break;case 79:_context6.n=81;break;case 80:_context6.p=80;_t14=_context6.v;_iterator8.e(_t14);case 81:_context6.p=81;_iterator8.f();return _context6.f(81);case 82:// NOTE: Taken before asking for passwords, a second daemon stops.
releaseLocks=[];_context6.p=83;_iterator9=cli_createForOfIteratorHelper(_pairs);_context6.p=84;_iterator9.s();case 85:if((_step9=_iterator9.n()).done){_context6.n=88;break}_pair4=_step9.value;_t15=releaseLocks;_context6.n=86;return acquireLock(getPairDirectory(_pair4.plaintext,_pair4.vault),DAEMON_LOCK_FILE_NAME,"Pair \"".concat(_pair4.name,"\" is already watched by another ")+"daemon");case 86:_t15.push.call(_t15,_context6.v);case 87:_context6.n=85;break;case 88:_context6.n=90;break;case 89:_context6.p=89;_t16=_context6.v;_iterator9.e(_t16);case 90:_context6.p=90;_iterator9.f();return _context6.f(90);case 91:// Unlock everything first so wrong passwords stop the start.
contentKeys=new Map;_iterator0=cli_createForOfIteratorHelper(_pairs);_context6.p=92;_iterator0.s();case 93:if((_step0=_iterator0.n()).done){_context6.n=96;break}_pair5=_step0.value;_t17=contentKeys;_t18=_pair5.name;_context6.n=94;return getContentKey(_pair5.vault,_pair5);case 94:_t17.set.call(_t17,_t18,_context6.v);case 95:_context6.n=93;break;case 96:_context6.n=98;break;case 97:_context6.p=97;_t19=_context6.v;_iterator0.e(_t19);case 98:_context6.p=98;_iterator0.f();return _context6.f(98);case 99:abortController=new AbortController;stop=function stop(){abortController.abort()};signal=(_givenDependencies$si=givenDependencies.signal)!==null&&_givenDependencies$si!==void 0?_givenDependencies$si:abortController.signal;if(!givenDependencies.signal){_iterator1=cli_createForOfIteratorHelper(["SIGINT","SIGTERM"]);try{for(_iterator1.s();!(_step1=_iterator1.n()).done;){_name3=_step1.value;process.once(_name3,stop)}}catch(err){_iterator1.e(err)}finally{_iterator1.f()}}log=function log(text){output.log("".concat((new Date).toISOString()," ").concat(text))};_context6.p=100;_context6.n=101;return runDaemon({isSynchronized:function isSynchronized(pair,changes){return synchronize_isSynchronized({plainPath:pair.plaintext,vaultPath:pair.vault},changes)},log:log,pairs:_pairs,signal:signal,watchPair:(_givenDependencies$wa=givenDependencies.watchPair)!==null&&_givenDependencies$wa!==void 0?_givenDependencies$wa:watchPair,synchronizePair:function(){var _synchronizePair3=cli_asyncToGenerator(/*#__PURE__*/cli_regenerator().m(function _callee5(pair){var result;return cli_regenerator().w(function(_context5){while(1)switch(_context5.n){case 0:_context5.n=1;return _synchronizePair2(pair,contentKeys.get(pair.name),function(text){log("\"".concat(pair.name,"\": ").concat(text))});case 1:result=_context5.v;return _context5.a(2,result.changes>0||result.failed?result.summary:null)}},_callee5)}));function synchronizePair(_x11){return _synchronizePair3.apply(this,arguments)}return synchronizePair}()});case 101:_context6.p=101;_iterator10=cli_createForOfIteratorHelper(["SIGINT","SIGTERM"]);try{for(_iterator10.s();!(_step10=_iterator10.n()).done;){_name4=_step10.value;process.removeListener(_name4,stop)}}catch(err){_iterator10.e(err)}finally{_iterator10.f()}_iterator11=cli_createForOfIteratorHelper(contentKeys.values());try{for(_iterator11.s();!(_step11=_iterator11.n()).done;){key=_step11.value;key.fill(0)}}catch(err){_iterator11.e(err)}finally{_iterator11.f()}return _context6.f(101);case 102:return _context6.a(2,0);case 103:_context6.p=103;_i4=0,_releaseLocks=releaseLocks;case 104:if(!(_i4<_releaseLocks.length)){_context6.n=106;break}releaseLock=_releaseLocks[_i4];_context6.n=105;return releaseLock();case 105:_i4++;_context6.n=104;break;case 106:return _context6.f(103);case 107:_parameters3=cli_slicedToArray(parameters,1),_subcommand=_parameters3[0];if(!(parameters.length!==1||!["install","status","uninstall"].includes(_subcommand))){_context6.n=108;break}throw new UsageError("Command \"service\" expects: install, uninstall or status");case 108:service=(_givenDependencies$se=givenDependencies.service)!==null&&_givenDependencies$se!==void 0?_givenDependencies$se:createService();if(!(_subcommand==="install")){_context6.n=110;break}_context6.n=109;return getPairs([]);case 109:_pairs2=_context6.v;interactive=_pairs2.filter(function(_ref2){var password=_ref2.password;return password==="prompt"});if(!(interactive.length>0)){_context6.n=110;break}throw new UsageError("A service can not ask for passwords, pairs "+interactive.map(function(_ref3){var name=_ref3.name;return"\"".concat(name,"\"")}).join(", ")+" need another password source.");case 110:_t20=output;_context6.n=111;return service[_subcommand]();case 111:_t20.log.call(_t20,_context6.v);return _context6.a(2,0);case 112:throw new UsageError("Unknown command \"".concat(command,"\"."));case 113:_context6.n=119;break;case 114:_context6.p=114;_t21=_context6.v;message=_t21 instanceof Error?_t21.message:String(_t21);output.error(message);if(!(_t21 instanceof UsageError||_t21!==null&&_t21!==void 0&&(_code=_t21.code)!==null&&_code!==void 0&&_code.toString().startsWith("ERR_PARSE_ARGS"))){_context6.n=115;break}return _context6.a(2,EXIT_CODES.usage);case 115:if(!(_t21 instanceof UnsupportedVaultError)){_context6.n=116;break}return _context6.a(2,EXIT_CODES.unsupportedVault);case 116:if(!(_t21 instanceof WrongPasswordError)){_context6.n=117;break}return _context6.a(2,EXIT_CODES.wrongPassword);case 117:if(!(_t21 instanceof LockedError)){_context6.n=118;break}return _context6.a(2,EXIT_CODES.locked);case 118:return _context6.a(2,EXIT_CODES.error);case 119:return _context6.a(2)}},_callee6,null,[[100,,101,102],[92,97,98,99],[84,89,90,91],[83,,103,107],[76,80,81,82],[57,59],[45,,47,48],[41,50,51,52],[23,,24,26],[16,21,22,27],[1,114]])}));function run(_x,_x2,_x3){return _run.apply(this,arguments)}return run}();

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {


// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ })
/******/ ]);
/************************************************************************/
/******/ // The module cache
/******/ const __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	const cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	const module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	const webpackQueues = Symbol("webpack queues");
/******/ 	const webpackExports = Symbol("webpack exports");
/******/ 	const webpackError = Symbol("webpack error");
/******/ 	
/******/ 	const resolveQueue = (queue) => {
/******/ 		if(queue?.d < 1) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	const wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 	
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				const queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				const obj = {};
/******/ 	
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		const ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__webpack_require__.a = (module, body, hasAwait) => {
/******/ 		let queue;
/******/ 		hasAwait && ((queue = []).d = -1);
/******/ 		const depQueues = new Set();
/******/ 		const exports = module.exports;
/******/ 		let currentDeps;
/******/ 		let outerResolve;
/******/ 		let reject;
/******/ 		const promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		const handle = (deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			let fn;
/******/ 			const getResult = () => (currentDeps.map((d) => {
/******/ 	
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			const promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				const fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.forEach((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}
/******/ 		const done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 	
/******/ 		body(handle, done);
/******/ 		queue?.d < 0 && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/concatenation wrap */
/******/ // wrap a concatenated module body as a lazy, memoized accessor; mod is
/******/ // set before the body runs so re-entrant calls (require cycles) observe
/******/ // the partial exports like Node.js
/******/ __webpack_require__.cw = (body) => {
/******/ 	var mod;
/******/ 	return () => {
/******/ 		if (body) {
/******/ 			var fn = body;
/******/ 			body = 0;
/******/ 			mod = { exports: {} };
/******/ 			fn.call(mod.exports, mod, mod.exports);
/******/ 		}
/******/ 		return mod.exports;
/******/ 	};
/******/ };
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ // define getter/value functions for harmony exports
/******/ __webpack_require__.d = (exports, definition) => {
/******/ 	for(var key in definition) {
/******/ 		if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 			Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 		}
/******/ 	}
/******/ };
/******/ 
/******/ /* webpack/runtime/global */
/******/ __webpack_require__.g = (function() {
/******/ 	if (typeof globalThis === 'object') return globalThis;
/******/ 	try {
/******/ 		return this || new Function('return this')();
/******/ 	} catch (e) {
/******/ 		if (typeof window === 'object') return window;
/******/ 	}
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ let __webpack_exports__ = __webpack_require__(19);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ 
