(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DKFDS = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * array-foreach
 *   Array#forEach ponyfill for older browsers
 *   (Ponyfill: A polyfill that doesn't overwrite the native method)
 * 
 * https://github.com/twada/array-foreach
 *
 * Copyright (c) 2015-2016 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/array-foreach/blob/master/MIT-LICENSE
 */
'use strict';

module.exports = function forEach(ary, callback, thisArg) {
  if (ary.forEach) {
    ary.forEach(callback, thisArg);
    return;
  }
  for (var i = 0; i < ary.length; i += 1) {
    callback.call(thisArg, ary[i], i, ary);
  }
};

},{}],2:[function(require,module,exports){
"use strict";

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in window.self) {
  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {
    (function (view) {
      "use strict";

      if (!('Element' in view)) return;
      var classListProp = "classList",
        protoProp = "prototype",
        elemCtrProto = view.Element[protoProp],
        objCtr = Object,
        strTrim = String[protoProp].trim || function () {
          return this.replace(/^\s+|\s+$/g, "");
        },
        arrIndexOf = Array[protoProp].indexOf || function (item) {
          var i = 0,
            len = this.length;
          for (; i < len; i++) {
            if (i in this && this[i] === item) {
              return i;
            }
          }
          return -1;
        }
        // Vendors: please allow content code to instantiate DOMExceptions
        ,
        DOMEx = function DOMEx(type, message) {
          this.name = type;
          this.code = DOMException[type];
          this.message = message;
        },
        checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
          if (token === "") {
            throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
          }
          if (/\s/.test(token)) {
            throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
          }
          return arrIndexOf.call(classList, token);
        },
        ClassList = function ClassList(elem) {
          var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
            i = 0,
            len = classes.length;
          for (; i < len; i++) {
            this.push(classes[i]);
          }
          this._updateClassName = function () {
            elem.setAttribute("class", this.toString());
          };
        },
        classListProto = ClassList[protoProp] = [],
        classListGetter = function classListGetter() {
          return new ClassList(this);
        };
      // Most DOMException implementations don't allow calling DOMException's toString()
      // on non-DOMExceptions. Error's toString() is sufficient here.
      DOMEx[protoProp] = Error[protoProp];
      classListProto.item = function (i) {
        return this[i] || null;
      };
      classListProto.contains = function (token) {
        token += "";
        return checkTokenAndGetIndex(this, token) !== -1;
      };
      classListProto.add = function () {
        var tokens = arguments,
          i = 0,
          l = tokens.length,
          token,
          updated = false;
        do {
          token = tokens[i] + "";
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        } while (++i < l);
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.remove = function () {
        var tokens = arguments,
          i = 0,
          l = tokens.length,
          token,
          updated = false,
          index;
        do {
          token = tokens[i] + "";
          index = checkTokenAndGetIndex(this, token);
          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        } while (++i < l);
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.toggle = function (token, force) {
        token += "";
        var result = this.contains(token),
          method = result ? force !== true && "remove" : force !== false && "add";
        if (method) {
          this[method](token);
        }
        if (force === true || force === false) {
          return force;
        } else {
          return !result;
        }
      };
      classListProto.toString = function () {
        return this.join(" ");
      };
      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter,
          enumerable: true,
          configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) {
          // IE 8 doesn't support enumerable:true
          // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
          // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
          if (ex.number === undefined || ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }
    })(window.self);
  }

  // There is full or partial native classList support, so just check if we need
  // to normalize the add/remove and toggle APIs.

  (function () {
    "use strict";

    var testElement = document.createElement("_");
    testElement.classList.add("c1", "c2");

    // Polyfill for IE 10/11 and Firefox <26, where classList.add and
    // classList.remove exist but support only one argument at a time.
    if (!testElement.classList.contains("c2")) {
      var createMethod = function createMethod(method) {
        var original = DOMTokenList.prototype[method];
        DOMTokenList.prototype[method] = function (token) {
          var i,
            len = arguments.length;
          for (i = 0; i < len; i++) {
            token = arguments[i];
            original.call(this, token);
          }
        };
      };
      createMethod('add');
      createMethod('remove');
    }
    testElement.classList.toggle("c3", false);

    // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
    // support the second argument.
    if (testElement.classList.contains("c3")) {
      var _toggle = DOMTokenList.prototype.toggle;
      DOMTokenList.prototype.toggle = function (token, force) {
        if (1 in arguments && !this.contains(token) === !force) {
          return force;
        } else {
          return _toggle.call(this, token);
        }
      };
    }
    testElement = null;
  })();
}

},{}],3:[function(require,module,exports){
"use strict";

require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":10,"../../modules/es6.array.from":58,"../../modules/es6.string.iterator":60}],4:[function(require,module,exports){
"use strict";

require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":10,"../../modules/es6.object.assign":59}],5:[function(require,module,exports){
"use strict";

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],6:[function(require,module,exports){
"use strict";

var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":27}],7:[function(require,module,exports){
"use strict";

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    }
    return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":49,"./_to-iobject":51,"./_to-length":52}],8:[function(require,module,exports){
"use strict";

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};
module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? cof(O)
  // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":9,"./_wks":56}],9:[function(require,module,exports){
"use strict";

var toString = {}.toString;
module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],10:[function(require,module,exports){
"use strict";

var core = module.exports = {
  version: '2.6.12'
};
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],11:[function(require,module,exports){
'use strict';

var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

},{"./_object-dp":36,"./_property-desc":43}],12:[function(require,module,exports){
"use strict";

// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function /* ...args */
  () {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":5}],13:[function(require,module,exports){
"use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],14:[function(require,module,exports){
"use strict";

// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

},{"./_fails":18}],15:[function(require,module,exports){
"use strict";

var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":20,"./_is-object":27}],16:[function(require,module,exports){
"use strict";

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],17:[function(require,module,exports){
"use strict";

var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';
var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":10,"./_ctx":12,"./_global":20,"./_hide":22,"./_redefine":44}],18:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],19:[function(require,module,exports){
"use strict";

module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":47}],20:[function(require,module,exports){
"use strict";

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
// eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],21:[function(require,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],22:[function(require,module,exports){
"use strict";

var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":14,"./_object-dp":36,"./_property-desc":43}],23:[function(require,module,exports){
"use strict";

var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":20}],24:[function(require,module,exports){
"use strict";

module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

},{"./_descriptors":14,"./_dom-create":15,"./_fails":18}],25:[function(require,module,exports){
"use strict";

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":9}],26:[function(require,module,exports){
"use strict";

// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":32,"./_wks":56}],27:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
module.exports = function (it) {
  return _typeof(it) === 'object' ? it !== null : typeof it === 'function';
};

},{}],28:[function(require,module,exports){
"use strict";

// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":6}],29:[function(require,module,exports){
'use strict';

var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () {
  return this;
});
module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, {
    next: descriptor(1, next)
  });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":22,"./_object-create":35,"./_property-desc":43,"./_set-to-string-tag":45,"./_wks":56}],30:[function(require,module,exports){
'use strict';

var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';
var returnThis = function returnThis() {
  return this;
};
module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }
    return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":17,"./_hide":22,"./_iter-create":29,"./_iterators":32,"./_library":33,"./_object-gpo":39,"./_redefine":44,"./_set-to-string-tag":45,"./_wks":56}],31:[function(require,module,exports){
"use strict";

var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;
try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}
module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () {
      return {
        done: safe = true
      };
    };
    arr[ITERATOR] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

},{"./_wks":56}],32:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],33:[function(require,module,exports){
"use strict";

module.exports = false;

},{}],34:[function(require,module,exports){
'use strict';

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = require('./_descriptors');
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  }
  return T;
} : $assign;

},{"./_descriptors":14,"./_fails":18,"./_iobject":25,"./_object-gops":38,"./_object-keys":41,"./_object-pie":42,"./_to-object":53}],35:[function(require,module,exports){
"use strict";

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function Empty() {/* empty */};
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) delete _createDict[PROTOTYPE][enumBugKeys[i]];
  return _createDict();
};
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":6,"./_dom-create":15,"./_enum-bug-keys":16,"./_html":23,"./_object-dps":37,"./_shared-key":46}],36:[function(require,module,exports){
"use strict";

var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;
exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_ie8-dom-define":24,"./_to-primitive":54}],37:[function(require,module,exports){
"use strict";

var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');
module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_object-dp":36,"./_object-keys":41}],38:[function(require,module,exports){
"use strict";

exports.f = Object.getOwnPropertySymbols;

},{}],39:[function(require,module,exports){
"use strict";

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;
module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }
  return O instanceof Object ? ObjectProto : null;
};

},{"./_has":21,"./_shared-key":46,"./_to-object":53}],40:[function(require,module,exports){
"use strict";

var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');
module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":7,"./_has":21,"./_shared-key":46,"./_to-iobject":51}],41:[function(require,module,exports){
"use strict";

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');
module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":16,"./_object-keys-internal":40}],42:[function(require,module,exports){
"use strict";

exports.f = {}.propertyIsEnumerable;

},{}],43:[function(require,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],44:[function(require,module,exports){
"use strict";

var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var $toString = require('./_function-to-string');
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);
require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};
(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":10,"./_function-to-string":19,"./_global":20,"./_has":21,"./_hide":22,"./_uid":55}],45:[function(require,module,exports){
"use strict";

var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');
module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
    configurable: true,
    value: tag
  });
};

},{"./_has":21,"./_object-dp":36,"./_wks":56}],46:[function(require,module,exports){
"use strict";

var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":47,"./_uid":55}],47:[function(require,module,exports){
"use strict";

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":10,"./_global":20,"./_library":33}],48:[function(require,module,exports){
"use strict";

var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":13,"./_to-integer":50}],49:[function(require,module,exports){
"use strict";

var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":50}],50:[function(require,module,exports){
"use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],51:[function(require,module,exports){
"use strict";

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":13,"./_iobject":25}],52:[function(require,module,exports){
"use strict";

// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":50}],53:[function(require,module,exports){
"use strict";

// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":13}],54:[function(require,module,exports){
"use strict";

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":27}],55:[function(require,module,exports){
"use strict";

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],56:[function(require,module,exports){
"use strict";

var store = require('./_shared')('wks');
var uid = require('./_uid');
var _Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof _Symbol == 'function';
var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};
$exports.store = store;

},{"./_global":20,"./_shared":47,"./_uid":55}],57:[function(require,module,exports){
"use strict";

var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":8,"./_core":10,"./_iterators":32,"./_wks":56}],58:[function(require,module,exports){
'use strict';

var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');
$export($export.S + $export.F * !require('./_iter-detect')(function (iter) {
  Array.from(iter);
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":11,"./_ctx":12,"./_export":17,"./_is-array-iter":26,"./_iter-call":28,"./_iter-detect":31,"./_to-length":52,"./_to-object":53,"./core.get-iterator-method":57}],59:[function(require,module,exports){
"use strict";

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');
$export($export.S + $export.F, 'Object', {
  assign: require('./_object-assign')
});

},{"./_export":17,"./_object-assign":34}],60:[function(require,module,exports){
'use strict';

var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return {
    value: undefined,
    done: true
  };
  point = $at(O, index);
  this._i += point.length;
  return {
    value: point,
    done: false
  };
});

},{"./_iter-define":30,"./_string-at":48}],61:[function(require,module,exports){
"use strict";

/* global define, KeyboardEvent, module */

(function () {
  var keyboardeventKeyPolyfill = {
    polyfill: polyfill,
    keys: {
      3: 'Cancel',
      6: 'Help',
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      28: 'Convert',
      29: 'NonConvert',
      30: 'Accept',
      31: 'ModeChange',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      41: 'Select',
      42: 'Print',
      43: 'Execute',
      44: 'PrintScreen',
      45: 'Insert',
      46: 'Delete',
      48: ['0', ')'],
      49: ['1', '!'],
      50: ['2', '@'],
      51: ['3', '#'],
      52: ['4', '$'],
      53: ['5', '%'],
      54: ['6', '^'],
      55: ['7', '&'],
      56: ['8', '*'],
      57: ['9', '('],
      91: 'OS',
      93: 'ContextMenu',
      144: 'NumLock',
      145: 'ScrollLock',
      181: 'VolumeMute',
      182: 'VolumeDown',
      183: 'VolumeUp',
      186: [';', ':'],
      187: ['=', '+'],
      188: [',', '<'],
      189: ['-', '_'],
      190: ['.', '>'],
      191: ['/', '?'],
      192: ['`', '~'],
      219: ['[', '{'],
      220: ['\\', '|'],
      221: [']', '}'],
      222: ["'", '"'],
      224: 'Meta',
      225: 'AltGraph',
      246: 'Attn',
      247: 'CrSel',
      248: 'ExSel',
      249: 'EraseEof',
      250: 'Play',
      251: 'ZoomOut'
    }
  };

  // Function keys (F1-24).
  var i;
  for (i = 1; i < 25; i++) {
    keyboardeventKeyPolyfill.keys[111 + i] = 'F' + i;
  }

  // Printable ASCII characters.
  var letter = '';
  for (i = 65; i < 91; i++) {
    letter = String.fromCharCode(i);
    keyboardeventKeyPolyfill.keys[i] = [letter.toLowerCase(), letter.toUpperCase()];
  }
  function polyfill() {
    if (!('KeyboardEvent' in window) || 'key' in KeyboardEvent.prototype) {
      return false;
    }

    // Polyfill `key` on `KeyboardEvent`.
    var proto = {
      get: function get(x) {
        var key = keyboardeventKeyPolyfill.keys[this.which || this.keyCode];
        if (Array.isArray(key)) {
          key = key[+this.shiftKey];
        }
        return key;
      }
    };
    Object.defineProperty(KeyboardEvent.prototype, 'key', proto);
    return proto;
  }
  if (typeof define === 'function' && define.amd) {
    define('keyboardevent-key-polyfill', keyboardeventKeyPolyfill);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = keyboardeventKeyPolyfill;
  } else if (window) {
    window.keyboardeventKeyPolyfill = keyboardeventKeyPolyfill;
  }
})();

},{}],62:[function(require,module,exports){
'use strict';

var proto = typeof Element !== 'undefined' ? Element.prototype : {};
var vendor = proto.matches || proto.matchesSelector || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector;
module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}

},{}],63:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }
  return Object(val);
}
function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }

    // Detect buggy property enumeration order in older V8 versions.

    // https://bugs.chromium.org/p/v8/issues/detail?id=4118
    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
    test1[5] = 'de';
    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test2 = {};
    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });
    if (order2.join('') !== '0123456789') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }
    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}
module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;
  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);
    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }
  return to;
};

},{}],64:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var assign = require('object-assign');
var delegate = require('./delegate');
var delegateAll = require('./delegateAll');
var DELEGATE_PATTERN = /^(.+):delegate\((.+)\)$/;
var SPACE = ' ';
var getListeners = function getListeners(type, handler) {
  var match = type.match(DELEGATE_PATTERN);
  var selector;
  if (match) {
    type = match[1];
    selector = match[2];
  }
  var options;
  if (_typeof(handler) === 'object') {
    options = {
      capture: popKey(handler, 'capture'),
      passive: popKey(handler, 'passive')
    };
  }
  var listener = {
    selector: selector,
    delegate: _typeof(handler) === 'object' ? delegateAll(handler) : selector ? delegate(selector, handler) : handler,
    options: options
  };
  if (type.indexOf(SPACE) > -1) {
    return type.split(SPACE).map(function (_type) {
      return assign({
        type: _type
      }, listener);
    });
  } else {
    listener.type = type;
    return [listener];
  }
};
var popKey = function popKey(obj, key) {
  var value = obj[key];
  delete obj[key];
  return value;
};
module.exports = function behavior(events, props) {
  var listeners = Object.keys(events).reduce(function (memo, type) {
    var listeners = getListeners(type, events[type]);
    return memo.concat(listeners);
  }, []);
  return assign({
    add: function addBehavior(element) {
      listeners.forEach(function (listener) {
        element.addEventListener(listener.type, listener.delegate, listener.options);
      });
    },
    remove: function removeBehavior(element) {
      listeners.forEach(function (listener) {
        element.removeEventListener(listener.type, listener.delegate, listener.options);
      });
    }
  }, props);
};

},{"./delegate":67,"./delegateAll":68,"object-assign":63}],65:[function(require,module,exports){
"use strict";

var matches = require('matches-selector');
module.exports = function (element, selector) {
  do {
    if (matches(element, selector)) {
      return element;
    }
  } while ((element = element.parentNode) && element.nodeType === 1);
};

},{"matches-selector":62}],66:[function(require,module,exports){
"use strict";

module.exports = function compose(functions) {
  return function (e) {
    return functions.some(function (fn) {
      return fn.call(this, e) === false;
    }, this);
  };
};

},{}],67:[function(require,module,exports){
"use strict";

var closest = require('./closest');
module.exports = function delegate(selector, fn) {
  return function delegation(event) {
    var target = closest(event.target, selector);
    if (target) {
      return fn.call(target, event);
    }
  };
};

},{"./closest":65}],68:[function(require,module,exports){
"use strict";

var delegate = require('./delegate');
var compose = require('./compose');
var SPLAT = '*';
module.exports = function delegateAll(selectors) {
  var keys = Object.keys(selectors);

  // XXX optimization: if there is only one handler and it applies to
  // all elements (the "*" CSS selector), then just return that
  // handler
  if (keys.length === 1 && keys[0] === SPLAT) {
    return selectors[SPLAT];
  }
  var delegates = keys.reduce(function (memo, selector) {
    memo.push(delegate(selector, selectors[selector]));
    return memo;
  }, []);
  return compose(delegates);
};

},{"./compose":66,"./delegate":67}],69:[function(require,module,exports){
"use strict";

module.exports = function ignore(element, fn) {
  return function ignorance(e) {
    if (element !== e.target && !element.contains(e.target)) {
      return fn.call(this, e);
    }
  };
};

},{}],70:[function(require,module,exports){
'use strict';

module.exports = {
  behavior: require('./behavior'),
  delegate: require('./delegate'),
  delegateAll: require('./delegateAll'),
  ignore: require('./ignore'),
  keymap: require('./keymap')
};

},{"./behavior":64,"./delegate":67,"./delegateAll":68,"./ignore":69,"./keymap":71}],71:[function(require,module,exports){
"use strict";

require('keyboardevent-key-polyfill');

// these are the only relevant modifiers supported on all platforms,
// according to MDN:
// <https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState>
var MODIFIERS = {
  'Alt': 'altKey',
  'Control': 'ctrlKey',
  'Ctrl': 'ctrlKey',
  'Shift': 'shiftKey'
};
var MODIFIER_SEPARATOR = '+';
var getEventKey = function getEventKey(event, hasModifiers) {
  var key = event.key;
  if (hasModifiers) {
    for (var modifier in MODIFIERS) {
      if (event[MODIFIERS[modifier]] === true) {
        key = [modifier, key].join(MODIFIER_SEPARATOR);
      }
    }
  }
  return key;
};
module.exports = function keymap(keys) {
  var hasModifiers = Object.keys(keys).some(function (key) {
    return key.indexOf(MODIFIER_SEPARATOR) > -1;
  });
  return function (event) {
    var key = getEventKey(event, hasModifiers);
    return [key, key.toLowerCase()].reduce(function (result, _key) {
      if (_key in keys) {
        result = keys[key].call(this, event);
      }
      return result;
    }, undefined);
  };
};
module.exports.MODIFIERS = MODIFIERS;

},{"keyboardevent-key-polyfill":61}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("../polyfills/Function/prototype/bind");
var toggle = require('../utils/toggle');
var isElementInViewport = require('../utils/is-in-viewport');
var BUTTON = ".accordion-button[aria-controls]";
var EXPANDED = 'aria-expanded';
var BULK_FUNCTION_ACTION_ATTRIBUTE = "data-accordion-bulk-expand";
var TEXT_ACCORDION = {
  "open_all": "Åbn alle",
  "close_all": "Luk alle"
};

/**
 * Adds click functionality to accordion list
 * @param {HTMLElement} $accordion the accordion ul element
 * @param {JSON} strings Translate labels: {"open_all": "Åbn alle", "close_all": "Luk alle"}
 */
function Accordion($accordion) {
  var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TEXT_ACCORDION;
  if (!$accordion) {
    throw new Error("Missing accordion group element");
  }
  this.accordion = $accordion;
  this.text = strings;
}

/**
 * Set eventlisteners on click elements in accordion list
 */
Accordion.prototype.init = function () {
  this.buttons = this.accordion.querySelectorAll(BUTTON);
  if (this.buttons.length == 0) {
    throw new Error("Missing accordion buttons");
  }

  // loop buttons in list
  for (var i = 0; i < this.buttons.length; i++) {
    var currentButton = this.buttons[i];

    // Verify state on button and state on panel
    var expanded = currentButton.getAttribute(EXPANDED) === 'true';
    this.toggleButton(currentButton, expanded);

    // Set click event on accordion buttons
    currentButton.removeEventListener('click', this.eventOnClick.bind(this, currentButton), false);
    currentButton.addEventListener('click', this.eventOnClick.bind(this, currentButton), false);
  }
  // Set click event on bulk button if present
  var prevSibling = this.accordion.previousElementSibling;
  if (prevSibling !== null && prevSibling.classList.contains('accordion-bulk-button')) {
    this.bulkFunctionButton = prevSibling;
    this.bulkFunctionButton.addEventListener('click', this.bulkEvent.bind(this));
  }
};

/**
 * Bulk event handler: Triggered when clicking on .accordion-bulk-button
 */
Accordion.prototype.bulkEvent = function () {
  var $module = this;
  if (!$module.accordion.classList.contains('accordion')) {
    throw new Error("Could not find accordion.");
  }
  if ($module.buttons.length == 0) {
    throw new Error("Missing accordion buttons");
  }
  var expand = true;
  if ($module.bulkFunctionButton.getAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE) === "false") {
    expand = false;
  }
  for (var i = 0; i < $module.buttons.length; i++) {
    $module.toggleButton($module.buttons[i], expand, true);
  }
  $module.bulkFunctionButton.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, !expand);
  if (!expand === true) {
    $module.bulkFunctionButton.innerText = this.text.open_all;
  } else {
    $module.bulkFunctionButton.innerText = this.text.close_all;
  }
};

/**
 * Accordion button event handler: Toggles accordion
 * @param {HTMLButtonElement} $button 
 * @param {PointerEvent} e 
 */
Accordion.prototype.eventOnClick = function ($button, e) {
  var $module = this;
  e.stopPropagation();
  e.preventDefault();
  $module.toggleButton($button);
  if ($button.getAttribute(EXPANDED) === 'true') {
    // We were just expanded, but if another accordion was also just
    // collapsed, we may no longer be in the viewport. This ensures
    // that we are still visible, so the user isn't confused.
    if (!isElementInViewport($button)) $button.scrollIntoView();
  }
};

/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */
Accordion.prototype.toggleButton = function (button, expanded) {
  var bulk = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var accordion = null;
  if (button.parentNode.parentNode.classList.contains('accordion')) {
    accordion = button.parentNode.parentNode;
  } else if (button.parentNode.parentNode.parentNode.classList.contains('accordion')) {
    accordion = button.parentNode.parentNode.parentNode;
  }
  expanded = toggle(button, expanded);
  if (expanded) {
    var eventOpen = new Event('fds.accordion.open');
    button.dispatchEvent(eventOpen);
  } else {
    var eventClose = new Event('fds.accordion.close');
    button.dispatchEvent(eventClose);
  }
  if (accordion !== null) {
    var bulkFunction = accordion.previousElementSibling;
    if (bulkFunction !== null && bulkFunction.classList.contains('accordion-bulk-button')) {
      var buttons = accordion.querySelectorAll(BUTTON);
      if (bulk === false) {
        var buttonsOpen = accordion.querySelectorAll(BUTTON + '[aria-expanded="true"]');
        var newStatus = true;
        if (buttons.length === buttonsOpen.length) {
          newStatus = false;
        }
        bulkFunction.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, newStatus);
        if (newStatus === true) {
          bulkFunction.innerText = this.text.open_all;
        } else {
          bulkFunction.innerText = this.text.close_all;
        }
      }
    }
  }
};
var _default = Accordion;
exports["default"] = _default;

},{"../polyfills/Function/prototype/bind":93,"../utils/is-in-viewport":102,"../utils/toggle":105}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function Alert(alert) {
  this.alert = alert;
}
Alert.prototype.init = function () {
  var close = this.alert.getElementsByClassName('alert-close');
  if (close.length === 1) {
    close[0].addEventListener('click', this.hide.bind(this));
  }
};
Alert.prototype.hide = function () {
  this.alert.classList.add('d-none');
  var eventHide = new Event('fds.alert.hide');
  this.alert.dispatchEvent(eventHide);
};
Alert.prototype.show = function () {
  this.alert.classList.remove('d-none');
  var eventShow = new Event('fds.alert.show');
  this.alert.dispatchEvent(eventShow);
};
var _default = Alert;
exports["default"] = _default;

},{}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function BackToTop(backtotop) {
  this.backtotop = backtotop;
}
BackToTop.prototype.init = function () {
  var backtotopbutton = this.backtotop;
  updateBackToTopButton(backtotopbutton);
  var observer = new MutationObserver(function (list) {
    var evt = new CustomEvent('dom-changed', {
      detail: list
    });
    document.body.dispatchEvent(evt);
  });

  // Which mutations to observe
  var config = {
    attributes: true,
    attributeOldValue: false,
    characterData: true,
    characterDataOldValue: false,
    childList: true,
    subtree: true
  };

  // DOM changes
  observer.observe(document.body, config);
  document.body.addEventListener('dom-changed', function (e) {
    updateBackToTopButton(backtotopbutton);
  });

  // Scroll actions
  window.addEventListener('scroll', function (e) {
    updateBackToTopButton(backtotopbutton);
  });

  // Window resizes
  window.addEventListener('resize', function (e) {
    updateBackToTopButton(backtotopbutton);
  });
};
function updateBackToTopButton(button) {
  var docBody = document.body;
  var docElem = document.documentElement;
  var heightOfViewport = Math.max(docElem.clientHeight || 0, window.innerHeight || 0);
  var heightOfPage = Math.max(docBody.scrollHeight, docBody.offsetHeight, docBody.getBoundingClientRect().height, docElem.scrollHeight, docElem.offsetHeight, docElem.getBoundingClientRect().height, docElem.clientHeight);
  var limit = heightOfViewport * 2; // The threshold selected to determine whether a back-to-top-button should be displayed

  // Never show the button if the page is too short
  if (limit > heightOfPage) {
    if (!button.classList.contains('d-none')) {
      button.classList.add('d-none');
    }
  }
  // If the page is long, calculate when to show the button
  else {
    if (button.classList.contains('d-none')) {
      button.classList.remove('d-none');
    }
    var lastKnownScrollPosition = window.scrollY;
    var footer = document.getElementsByTagName("footer")[0]; // If there are several footers, the code only applies to the first footer

    // Show the button, if the user has scrolled too far down
    if (lastKnownScrollPosition >= limit) {
      if (!isFooterVisible(footer) && button.classList.contains('footer-sticky')) {
        button.classList.remove('footer-sticky');
      } else if (isFooterVisible(footer) && !button.classList.contains('footer-sticky')) {
        button.classList.add('footer-sticky');
      }
    }
    // If there's a sidenav, we might want to show the button anyway
    else {
      var sidenav = document.querySelector('.sidenav-list'); // Finds side navigations (left menus) and step guides

      if (sidenav && sidenav.offsetParent !== null) {
        var _sidenav$closest, _sidenav$closest$prev, _sidenav$closest2, _sidenav$closest2$pre;
        // Only react to sidenavs, which are always visible (i.e. not opened from overflow-menu buttons)
        if (!(((_sidenav$closest = sidenav.closest(".overflow-menu-inner")) === null || _sidenav$closest === void 0 ? void 0 : (_sidenav$closest$prev = _sidenav$closest.previousElementSibling) === null || _sidenav$closest$prev === void 0 ? void 0 : _sidenav$closest$prev.getAttribute('aria-expanded')) === "true" && ((_sidenav$closest2 = sidenav.closest(".overflow-menu-inner")) === null || _sidenav$closest2 === void 0 ? void 0 : (_sidenav$closest2$pre = _sidenav$closest2.previousElementSibling) === null || _sidenav$closest2$pre === void 0 ? void 0 : _sidenav$closest2$pre.offsetParent) !== null)) {
          var rect = sidenav.getBoundingClientRect();
          if (rect.bottom < 0) {
            if (!isFooterVisible(footer) && button.classList.contains('footer-sticky')) {
              button.classList.remove('footer-sticky');
            } else if (isFooterVisible(footer) && !button.classList.contains('footer-sticky')) {
              button.classList.add('footer-sticky');
            }
          } else {
            if (!button.classList.contains('footer-sticky')) {
              button.classList.add('footer-sticky');
            }
          }
        }
      }
      // There's no sidenav and we know the user hasn't reached the scroll limit: Ensure the button is hidden
      else {
        if (!button.classList.contains('footer-sticky')) {
          button.classList.add('footer-sticky');
        }
      }
    }
  }
}
function isFooterVisible(footerElement) {
  if (footerElement !== null && footerElement !== void 0 && footerElement.querySelector('.footer')) {
    var rect = footerElement.querySelector('.footer').getBoundingClientRect();

    // Footer is visible or partly visible
    if (rect.top < window.innerHeight || rect.top < document.documentElement.clientHeight) {
      return true;
    }
    // Footer is hidden
    else {
      return false;
    }
  } else {
    return false;
  }
}
var _default = BackToTop;
exports["default"] = _default;

},{}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var MAX_LENGTH = 'data-maxlength';
var TEXT_CHARACTERLIMIT = {
  "character_remaining": "Du har {value} tegn tilbage",
  "characters_remaining": "Du har {value} tegn tilbage",
  "character_too_many": "Du har {value} tegn for meget",
  "characters_too_many": "Du har {value} tegn for meget"
};

/**
 * Show number of characters left in a field
 * @param {HTMLElement} containerElement 
 * @param {JSON} strings Translate labels: {"character_remaining": "Du har {value} tegn tilbage", "characters_remaining": "Du har {value} tegn tilbage", "character_too_many": "Du har {value} tegn for meget", "characters_too_many": "Du har {value} tegn for meget"}
 */
function CharacterLimit(containerElement) {
  var _this = this;
  var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TEXT_CHARACTERLIMIT;
  if (!containerElement) {
    throw new Error("Missing form-limit element");
  }
  this.container = containerElement;
  this.input = containerElement.getElementsByClassName('form-input')[0];
  this.maxlength = this.container.getAttribute(MAX_LENGTH);
  this.text = strings;
  var lastKeyUpTimestamp = null;
  var oldValue = this.input.value;
  var intervalID = null;
  var handleKeyUp = function handleKeyUp() {
    updateVisibleMessage(_this);
    lastKeyUpTimestamp = Date.now();
  };
  var handleFocus = function handleFocus() {
    /* Reset the screen reader message on focus to force an update of the message.
    This ensures that a screen reader informs the user of how many characters there is left
    on focus and not just what the character limit is. */
    if (_this.input.value !== "") {
      var sr_message = _this.container.getElementsByClassName('character-limit-sr-only')[0];
      sr_message.innerHTML = '';
    }
    intervalID = setInterval(function () {
      /* Don't update the Screen Reader message unless it's been awhile
      since the last key up event. Otherwise, the user will be spammed
      with audio notifications while typing. */
      if (!lastKeyUpTimestamp || Date.now() - 500 >= lastKeyUpTimestamp) {
        var _sr_message = this.container.getElementsByClassName('character-limit-sr-only')[0].innerHTML;
        var visible_message = this.container.getElementsByClassName('character-limit')[0].innerHTML;

        /* Don't update the messages unless the input has changed or if there
        is a mismatch between the visible message and the screen reader message. */
        if (oldValue !== this.input.value || _sr_message !== visible_message) {
          oldValue = this.input.value;
          this.updateMessages();
        }
      }
    }.bind(_this), 1000);
  };
  var handleBlur = function handleBlur() {
    clearInterval(intervalID);
    // Don't update the messages on blur unless the value of the textarea/text input has changed
    if (oldValue !== _this.input.value) {
      oldValue = _this.input.value;
      _this.updateMessages();
    }
  };
  this.init = function () {
    var _this2 = this;
    if (!this.maxlength) {
      throw new Error("Character limit is missing attribute ".concat(MAX_LENGTH));
    }
    this.input.addEventListener('keyup', function () {
      handleKeyUp();
    });
    this.input.addEventListener('focus', function () {
      handleFocus();
    });
    this.input.addEventListener('blur', function () {
      handleBlur();
    });

    /* If the browser supports the pageshow event, use it to update the character limit
    message and sr-message once a page has loaded. Second best, use the DOMContentLoaded event. 
    This ensures that if the user navigates to another page in the browser and goes back, the 
    message and sr-message will show/tell the correct amount of characters left. */
    if ('onpageshow' in window) {
      window.addEventListener('pageshow', function () {
        _this2.updateMessages();
      });
    } else {
      window.addEventListener('DOMContentLoaded', function () {
        _this2.updateMessages();
      });
    }
  };
}
CharacterLimit.prototype.charactersLeft = function () {
  var current_length = this.input.value.length;
  return this.maxlength - current_length;
};
function characterLimitMessage(formLimit) {
  var count_message = "";
  var characters_left = formLimit.charactersLeft();
  if (characters_left === -1) {
    var exceeded = Math.abs(characters_left);
    count_message = formLimit.text.character_too_many.replace(/{value}/, exceeded);
  } else if (characters_left === 1) {
    count_message = formLimit.text.character_remaining.replace(/{value}/, characters_left);
  } else if (characters_left >= 0) {
    count_message = formLimit.text.characters_remaining.replace(/{value}/, characters_left);
  } else {
    var _exceeded = Math.abs(characters_left);
    count_message = formLimit.text.characters_too_many.replace(/{value}/, _exceeded);
  }
  return count_message;
}
function updateVisibleMessage(formLimit) {
  var characters_left = formLimit.charactersLeft();
  var count_message = characterLimitMessage(formLimit);
  var character_label = formLimit.container.getElementsByClassName('character-limit')[0];
  if (characters_left < 0) {
    if (!character_label.classList.contains('limit-exceeded')) {
      character_label.classList.add('limit-exceeded');
    }
    if (!formLimit.input.classList.contains('form-limit-error')) {
      formLimit.input.classList.add('form-limit-error');
    }
  } else {
    if (character_label.classList.contains('limit-exceeded')) {
      character_label.classList.remove('limit-exceeded');
    }
    if (formLimit.input.classList.contains('form-limit-error')) {
      formLimit.input.classList.remove('form-limit-error');
    }
  }
  character_label.innerHTML = count_message;
}
function updateScreenReaderMessage(formLimit) {
  var count_message = characterLimitMessage(formLimit);
  var character_label = formLimit.container.getElementsByClassName('character-limit-sr-only')[0];
  character_label.innerHTML = count_message;
}
CharacterLimit.prototype.updateMessages = function () {
  updateVisibleMessage(this);
  updateScreenReaderMessage(this);
};
var _default = CharacterLimit;
exports["default"] = _default;

},{}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("../polyfills/Function/prototype/bind");
var TOGGLE_TARGET_ATTRIBUTE = 'data-aria-controls';

/**
 * Adds click functionality to checkbox collapse component
 * @param {HTMLInputElement} checkboxElement 
 */
function CheckboxToggleContent(checkboxElement) {
  this.checkboxElement = checkboxElement;
  this.targetElement = null;
}

/**
 * Set events on checkbox state change
 */
CheckboxToggleContent.prototype.init = function () {
  this.checkboxElement.addEventListener('change', this.toggle.bind(this));
  this.toggle();
};

/**
 * Toggle checkbox content
 */
CheckboxToggleContent.prototype.toggle = function () {
  var $module = this;
  var targetAttr = this.checkboxElement.getAttribute(TOGGLE_TARGET_ATTRIBUTE);
  var targetEl = document.getElementById(targetAttr);
  if (targetEl === null || targetEl === undefined) {
    throw new Error("Could not find panel element. Verify value of attribute " + TOGGLE_TARGET_ATTRIBUTE);
  }
  if (this.checkboxElement.checked) {
    $module.expand(this.checkboxElement, targetEl);
  } else {
    $module.collapse(this.checkboxElement, targetEl);
  }
};

/**
 * Expand content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */
CheckboxToggleContent.prototype.expand = function (checkboxElement, contentElement) {
  if (checkboxElement !== null && checkboxElement !== undefined && contentElement !== null && contentElement !== undefined) {
    checkboxElement.setAttribute('data-aria-expanded', 'true');
    contentElement.classList.remove('collapsed');
    contentElement.setAttribute('aria-hidden', 'false');
    var eventOpen = new Event('fds.collapse.expanded');
    checkboxElement.dispatchEvent(eventOpen);
  }
};

/**
 * Collapse content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */
CheckboxToggleContent.prototype.collapse = function (triggerEl, targetEl) {
  if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
    triggerEl.setAttribute('data-aria-expanded', 'false');
    targetEl.classList.add('collapsed');
    targetEl.setAttribute('aria-hidden', 'true');
    var eventClose = new Event('fds.collapse.collapsed');
    triggerEl.dispatchEvent(eventClose);
  }
};
var _default = CheckboxToggleContent;
exports["default"] = _default;

},{"../polyfills/Function/prototype/bind":93}],77:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _receptor = require("receptor");
var _CLICK, _keydown, _focusout, _datePickerEvents;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var behavior = require("../utils/behavior");
var select = require("../utils/select");
var _require = require("../config"),
  PREFIX = _require.prefix;
var _require2 = require("../events"),
  CLICK = _require2.CLICK;
var activeElement = require("../utils/active-element");
var isIosDevice = require("../utils/is-ios-device");
var DATE_PICKER_CLASS = "date-picker";
var DATE_PICKER_WRAPPER_CLASS = "".concat(DATE_PICKER_CLASS, "__wrapper");
var DATE_PICKER_INITIALIZED_CLASS = "".concat(DATE_PICKER_CLASS, "--initialized");
var DATE_PICKER_ACTIVE_CLASS = "".concat(DATE_PICKER_CLASS, "--active");
var DATE_PICKER_INTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__internal-input");
var DATE_PICKER_EXTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__external-input");
var DATE_PICKER_BUTTON_CLASS = "".concat(DATE_PICKER_CLASS, "__button");
var DATE_PICKER_CALENDAR_CLASS = "".concat(DATE_PICKER_CLASS, "__calendar");
var DATE_PICKER_STATUS_CLASS = "".concat(DATE_PICKER_CLASS, "__status");
var DATE_PICKER_GUIDE_CLASS = "".concat(DATE_PICKER_CLASS, "__guide");
var CALENDAR_DATE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date");
var DIALOG_WRAPPER_CLASS = "dialog-wrapper";
var DATE_PICKER_DIALOG_WRAPPER = ".".concat(DIALOG_WRAPPER_CLASS);
var CALENDAR_DATE_FOCUSED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--focused");
var CALENDAR_DATE_SELECTED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--selected");
var CALENDAR_DATE_PREVIOUS_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--previous-month");
var CALENDAR_DATE_CURRENT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--current-month");
var CALENDAR_DATE_NEXT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--next-month");
var CALENDAR_DATE_RANGE_DATE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date");
var CALENDAR_DATE_TODAY_CLASS = "".concat(CALENDAR_DATE_CLASS, "--today");
var CALENDAR_DATE_RANGE_DATE_START_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-start");
var CALENDAR_DATE_RANGE_DATE_END_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-end");
var CALENDAR_DATE_WITHIN_RANGE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--within-range");
var CALENDAR_PREVIOUS_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year");
var CALENDAR_PREVIOUS_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-month");
var CALENDAR_NEXT_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year");
var CALENDAR_NEXT_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-month");
var CALENDAR_MONTH_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-selection");
var CALENDAR_YEAR_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-selection");
var CALENDAR_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month");
var CALENDAR_MONTH_FOCUSED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--focused");
var CALENDAR_MONTH_SELECTED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--selected");
var CALENDAR_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year");
var CALENDAR_YEAR_FOCUSED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--focused");
var CALENDAR_YEAR_SELECTED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--selected");
var CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year-chunk");
var CALENDAR_NEXT_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year-chunk");
var CALENDAR_DATE_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date-picker");
var CALENDAR_MONTH_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-picker");
var CALENDAR_YEAR_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-picker");
var CALENDAR_TABLE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__table");
var CALENDAR_ROW_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__row");
var CALENDAR_CELL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__cell");
var CALENDAR_CELL_CENTER_ITEMS_CLASS = "".concat(CALENDAR_CELL_CLASS, "--center-items");
var CALENDAR_MONTH_LABEL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-label");
var CALENDAR_DAY_OF_WEEK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__day-of-week");
var DATE_PICKER = ".".concat(DATE_PICKER_CLASS);
var DATE_PICKER_BUTTON = ".".concat(DATE_PICKER_BUTTON_CLASS);
var DATE_PICKER_INTERNAL_INPUT = ".".concat(DATE_PICKER_INTERNAL_INPUT_CLASS);
var DATE_PICKER_EXTERNAL_INPUT = ".".concat(DATE_PICKER_EXTERNAL_INPUT_CLASS);
var DATE_PICKER_CALENDAR = ".".concat(DATE_PICKER_CALENDAR_CLASS);
var DATE_PICKER_STATUS = ".".concat(DATE_PICKER_STATUS_CLASS);
var DATE_PICKER_GUIDE = ".".concat(DATE_PICKER_GUIDE_CLASS);
var CALENDAR_DATE = ".".concat(CALENDAR_DATE_CLASS);
var CALENDAR_DATE_FOCUSED = ".".concat(CALENDAR_DATE_FOCUSED_CLASS);
var CALENDAR_DATE_CURRENT_MONTH = ".".concat(CALENDAR_DATE_CURRENT_MONTH_CLASS);
var CALENDAR_PREVIOUS_YEAR = ".".concat(CALENDAR_PREVIOUS_YEAR_CLASS);
var CALENDAR_PREVIOUS_MONTH = ".".concat(CALENDAR_PREVIOUS_MONTH_CLASS);
var CALENDAR_NEXT_YEAR = ".".concat(CALENDAR_NEXT_YEAR_CLASS);
var CALENDAR_NEXT_MONTH = ".".concat(CALENDAR_NEXT_MONTH_CLASS);
var CALENDAR_YEAR_SELECTION = ".".concat(CALENDAR_YEAR_SELECTION_CLASS);
var CALENDAR_MONTH_SELECTION = ".".concat(CALENDAR_MONTH_SELECTION_CLASS);
var CALENDAR_MONTH = ".".concat(CALENDAR_MONTH_CLASS);
var CALENDAR_YEAR = ".".concat(CALENDAR_YEAR_CLASS);
var CALENDAR_PREVIOUS_YEAR_CHUNK = ".".concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS);
var CALENDAR_NEXT_YEAR_CHUNK = ".".concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS);
var CALENDAR_DATE_PICKER = ".".concat(CALENDAR_DATE_PICKER_CLASS);
var CALENDAR_MONTH_PICKER = ".".concat(CALENDAR_MONTH_PICKER_CLASS);
var CALENDAR_YEAR_PICKER = ".".concat(CALENDAR_YEAR_PICKER_CLASS);
var CALENDAR_MONTH_FOCUSED = ".".concat(CALENDAR_MONTH_FOCUSED_CLASS);
var CALENDAR_YEAR_FOCUSED = ".".concat(CALENDAR_YEAR_FOCUSED_CLASS);
var text = {
  "open_calendar": "Åbn kalender",
  "choose_a_date": "Vælg en dato",
  "choose_a_date_between": "Vælg en dato mellem {minDay}. {minMonthStr} {minYear} og {maxDay}. {maxMonthStr} {maxYear}",
  "choose_a_date_before": "Vælg en dato. Der kan vælges indtil {maxDay}. {maxMonthStr} {maxYear}.",
  "choose_a_date_after": "Vælg en dato. Der kan vælges fra {minDay}. {minMonthStr} {minYear} og fremad.",
  "aria_label_date": "{dayStr} den {day}. {monthStr} {year}",
  "current_month_displayed": "Viser {monthLabel} {focusedYear}",
  "first_possible_date": "Første valgbare dato",
  "last_possible_date": "Sidste valgbare dato",
  "previous_year": "Navigér ét år tilbage",
  "previous_month": "Navigér én måned tilbage",
  "next_month": "Navigér én måned frem",
  "next_year": "Navigér ét år frem",
  "select_month": "Vælg måned",
  "select_year": "Vælg år",
  "previous_years": "Navigér {years} år tilbage",
  "next_years": "Navigér {years} år frem",
  "guide": "Navigerer du med tastatur, kan du skifte dag med højre og venstre piletaster, uger med op og ned piletaster, måneder med page up og page down-tasterne og år med shift-tasten plus page up eller page down. Home og end-tasten navigerer til start eller slutning af en uge.",
  "months_displayed": "Vælg en måned",
  "years_displayed": "Viser år {start} til {end}. Vælg et år.",
  "january": "januar",
  "february": "februar",
  "march": "marts",
  "april": "april",
  "may": "maj",
  "june": "juni",
  "july": "juli",
  "august": "august",
  "september": "september",
  "october": "oktober",
  "november": "november",
  "december": "december",
  "monday": "mandag",
  "tuesday": "tirsdag",
  "wednesday": "onsdag",
  "thursday": "torsdag",
  "friday": "fredag",
  "saturday": "lørdag",
  "sunday": "søndag"
};
var VALIDATION_MESSAGE = "Indtast venligst en gyldig dato";
var MONTH_LABELS = [text.january, text.february, text.march, text.april, text.may, text.june, text.july, text.august, text.september, text.october, text.november, text.december];
var DAY_OF_WEEK_LABELS = [text.monday, text.tuesday, text.wednesday, text.thursday, text.friday, text.saturday, text.sunday];
var ENTER_KEYCODE = 13;
var YEAR_CHUNK = 12;
var DEFAULT_MIN_DATE = "0000-01-01";
var DATE_FORMAT_OPTION_1 = "DD/MM/YYYY";
var DATE_FORMAT_OPTION_2 = "DD-MM-YYYY";
var DATE_FORMAT_OPTION_3 = "DD.MM.YYYY";
var DATE_FORMAT_OPTION_4 = "DD MM YYYY";
var DATE_FORMAT_OPTION_5 = "DD/MM-YYYY";
var INTERNAL_DATE_FORMAT = "YYYY-MM-DD";
var NOT_DISABLED_SELECTOR = ":not([disabled])";
var processFocusableSelectors = function processFocusableSelectors() {
  for (var _len = arguments.length, selectors = new Array(_len), _key = 0; _key < _len; _key++) {
    selectors[_key] = arguments[_key];
  }
  return selectors.map(function (query) {
    return query + NOT_DISABLED_SELECTOR;
  }).join(", ");
};
var DATE_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR, CALENDAR_PREVIOUS_MONTH, CALENDAR_YEAR_SELECTION, CALENDAR_MONTH_SELECTION, CALENDAR_NEXT_YEAR, CALENDAR_NEXT_MONTH, CALENDAR_DATE_FOCUSED);
var MONTH_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_MONTH_FOCUSED);
var YEAR_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR_CHUNK, CALENDAR_NEXT_YEAR_CHUNK, CALENDAR_YEAR_FOCUSED);

// #region Date Manipulation Functions

/**
 * Keep date within month. Month would only be over by 1 to 3 days
 *
 * @param {Date} dateToCheck the date object to check
 * @param {number} month the correct month
 * @returns {Date} the date, corrected if needed
 */
var keepDateWithinMonth = function keepDateWithinMonth(dateToCheck, month) {
  if (month !== dateToCheck.getMonth()) {
    dateToCheck.setDate(0);
  }
  return dateToCheck;
};

/**
 * Set date from month day year
 *
 * @param {number} year the year to set
 * @param {number} month the month to set (zero-indexed)
 * @param {number} date the date to set
 * @returns {Date} the set date
 */
var setDate = function setDate(year, month, date) {
  var newDate = new Date(0);
  newDate.setFullYear(year, month, date);
  return newDate;
};

/**
 * todays date
 *
 * @returns {Date} todays date
 */
var today = function today() {
  var newDate = new Date();
  var day = newDate.getDate();
  var month = newDate.getMonth();
  var year = newDate.getFullYear();
  return setDate(year, month, day);
};

/**
 * Set date to first day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */
var startOfMonth = function startOfMonth(date) {
  var newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth(), 1);
  return newDate;
};

/**
 * Set date to last day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */
var lastDayOfMonth = function lastDayOfMonth(date) {
  var newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  return newDate;
};

/**
 * Add days to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */
var addDays = function addDays(_date, numDays) {
  var newDate = new Date(_date.getTime());
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

/**
 * Subtract days from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */
var subDays = function subDays(_date, numDays) {
  return addDays(_date, -numDays);
};

/**
 * Add weeks to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
var addWeeks = function addWeeks(_date, numWeeks) {
  return addDays(_date, numWeeks * 7);
};

/**
 * Subtract weeks from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
var subWeeks = function subWeeks(_date, numWeeks) {
  return addWeeks(_date, -numWeeks);
};

/**
 * Set date to the start of the week (Monday)
 *
 * @param {Date} _date the date to adjust
 * @returns {Date} the adjusted date
 */
var startOfWeek = function startOfWeek(_date) {
  var dayOfWeek = _date.getDay() - 1;
  if (dayOfWeek === -1) {
    dayOfWeek = 6;
  }
  return subDays(_date, dayOfWeek);
};

/**
 * Set date to the end of the week (Sunday)
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
var endOfWeek = function endOfWeek(_date) {
  var dayOfWeek = _date.getDay();
  return addDays(_date, 7 - dayOfWeek);
};

/**
 * Add months to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */
var addMonths = function addMonths(_date, numMonths) {
  var newDate = new Date(_date.getTime());
  var dateMonth = (newDate.getMonth() + 12 + numMonths) % 12;
  newDate.setMonth(newDate.getMonth() + numMonths);
  keepDateWithinMonth(newDate, dateMonth);
  return newDate;
};

/**
 * Subtract months from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */
var subMonths = function subMonths(_date, numMonths) {
  return addMonths(_date, -numMonths);
};

/**
 * Add years to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */
var addYears = function addYears(_date, numYears) {
  return addMonths(_date, numYears * 12);
};

/**
 * Subtract years from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */
var subYears = function subYears(_date, numYears) {
  return addYears(_date, -numYears);
};

/**
 * Set months of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} month zero-indexed month to set
 * @returns {Date} the adjusted date
 */
var setMonth = function setMonth(_date, month) {
  var newDate = new Date(_date.getTime());
  newDate.setMonth(month);
  keepDateWithinMonth(newDate, month);
  return newDate;
};

/**
 * Set year of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} year the year to set
 * @returns {Date} the adjusted date
 */
var setYear = function setYear(_date, year) {
  var newDate = new Date(_date.getTime());
  var month = newDate.getMonth();
  newDate.setFullYear(year);
  keepDateWithinMonth(newDate, month);
  return newDate;
};

/**
 * Return the earliest date
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {Date} the earliest date
 */
var min = function min(dateA, dateB) {
  var newDate = dateA;
  if (dateB < dateA) {
    newDate = dateB;
  }
  return new Date(newDate.getTime());
};

/**
 * Return the latest date
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {Date} the latest date
 */
var max = function max(dateA, dateB) {
  var newDate = dateA;
  if (dateB > dateA) {
    newDate = dateB;
  }
  return new Date(newDate.getTime());
};

/**
 * Check if dates are the in the same year
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {boolean} are dates in the same year
 */
var isSameYear = function isSameYear(dateA, dateB) {
  return dateA && dateB && dateA.getFullYear() === dateB.getFullYear();
};

/**
 * Check if dates are the in the same month
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {boolean} are dates in the same month
 */
var isSameMonth = function isSameMonth(dateA, dateB) {
  return isSameYear(dateA, dateB) && dateA.getMonth() === dateB.getMonth();
};

/**
 * Check if dates are the same date
 *
 * @param {Date} dateA the date to compare
 * @param {Date} dateB the date to compare
 * @returns {boolean} are dates the same date
 */
var isSameDay = function isSameDay(dateA, dateB) {
  return isSameMonth(dateA, dateB) && dateA.getDate() === dateB.getDate();
};

/**
 * return a new date within minimum and maximum date
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @returns {Date} the date between min and max
 */
var keepDateBetweenMinAndMax = function keepDateBetweenMinAndMax(date, minDate, maxDate) {
  var newDate = date;
  if (date < minDate) {
    newDate = minDate;
  } else if (maxDate && date > maxDate) {
    newDate = maxDate;
  }
  return new Date(newDate.getTime());
};

/**
 * Check if dates is valid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is there a day within the month within min and max dates
 */
var isDateWithinMinAndMax = function isDateWithinMinAndMax(date, minDate, maxDate) {
  return date >= minDate && (!maxDate || date <= maxDate);
};

/**
 * Check if dates month is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */
var isDatesMonthOutsideMinOrMax = function isDatesMonthOutsideMinOrMax(date, minDate, maxDate) {
  return lastDayOfMonth(date) < minDate || maxDate && startOfMonth(date) > maxDate;
};

/**
 * Check if dates year is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */
var isDatesYearOutsideMinOrMax = function isDatesYearOutsideMinOrMax(date, minDate, maxDate) {
  return lastDayOfMonth(setMonth(date, 11)) < minDate || maxDate && startOfMonth(setMonth(date, 0)) > maxDate;
};

/**
 * Parse a date with format D-M-YY
 *
 * @param {string} dateString the date string to parse
 * @param {string} dateFormat the format of the date string
 * @param {boolean} adjustDate should the date be adjusted
 * @returns {Date} the parsed date
 */
var parseDateString = function parseDateString(dateString) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;
  var adjustDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var date;
  var month;
  var day;
  var year;
  var parsed;
  if (dateString) {
    var monthStr, dayStr, yearStr;
    if (dateFormat === DATE_FORMAT_OPTION_1 || dateFormat === DATE_FORMAT_OPTION_2 || dateFormat === DATE_FORMAT_OPTION_3 || dateFormat === DATE_FORMAT_OPTION_4 || dateFormat === DATE_FORMAT_OPTION_5) {
      var _dateString$split = dateString.split(/-|\.|\/|\s/);
      var _dateString$split2 = _slicedToArray(_dateString$split, 3);
      dayStr = _dateString$split2[0];
      monthStr = _dateString$split2[1];
      yearStr = _dateString$split2[2];
    } else {
      var _dateString$split3 = dateString.split("-");
      var _dateString$split4 = _slicedToArray(_dateString$split3, 3);
      yearStr = _dateString$split4[0];
      monthStr = _dateString$split4[1];
      dayStr = _dateString$split4[2];
    }
    if (yearStr) {
      parsed = parseInt(yearStr, 10);
      if (!Number.isNaN(parsed)) {
        year = parsed;
        if (adjustDate) {
          year = Math.max(0, year);
          if (yearStr.length < 3) {
            var currentYear = today().getFullYear();
            var currentYearStub = currentYear - currentYear % Math.pow(10, yearStr.length);
            year = currentYearStub + parsed;
          }
        }
      }
    }
    if (monthStr) {
      parsed = parseInt(monthStr, 10);
      if (!Number.isNaN(parsed)) {
        month = parsed;
        if (adjustDate) {
          month = Math.max(1, month);
          month = Math.min(12, month);
        }
      }
    }
    if (month && dayStr && year != null) {
      parsed = parseInt(dayStr, 10);
      if (!Number.isNaN(parsed)) {
        day = parsed;
        if (adjustDate) {
          var lastDayOfTheMonth = setDate(year, month, 0).getDate();
          day = Math.max(1, day);
          day = Math.min(lastDayOfTheMonth, day);
        }
      }
    }
    if (month && day && year != null) {
      date = setDate(year, month - 1, day);
    }
  }
  return date;
};

/**
 * Format a date to format DD-MM-YYYY
 *
 * @param {Date} date the date to format
 * @param {string} dateFormat the format of the date string
 * @returns {string} the formatted date string
 */
var formatDate = function formatDate(date) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;
  var padZeros = function padZeros(value, length) {
    return "0000".concat(value).slice(-length);
  };
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  if (dateFormat === DATE_FORMAT_OPTION_1) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join("/");
  } else if (dateFormat === DATE_FORMAT_OPTION_2) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join("-");
  } else if (dateFormat === DATE_FORMAT_OPTION_3) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join(".");
  } else if (dateFormat === DATE_FORMAT_OPTION_4) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join(" ");
  } else if (dateFormat === DATE_FORMAT_OPTION_5) {
    var tempDayMonth = [padZeros(day, 2), padZeros(month, 2)].join("/");
    return [tempDayMonth, padZeros(year, 4)].join("-");
  }
  return [padZeros(year, 4), padZeros(month, 2), padZeros(day, 2)].join("-");
};

// #endregion Date Manipulation Functions

/**
 * Create a grid string from an array of html strings
 *
 * @param {string[]} htmlArray the array of html items
 * @param {number} rowSize the length of a row
 * @returns {string} the grid string
 */
var listToGridHtml = function listToGridHtml(htmlArray, rowSize) {
  var grid = [];
  var row = [];
  var i = 0;
  while (i < htmlArray.length) {
    row = [];
    while (i < htmlArray.length && row.length < rowSize) {
      row.push("<td>".concat(htmlArray[i], "</td>"));
      i += 1;
    }
    grid.push("<tr>".concat(row.join(""), "</tr>"));
  }
  return grid.join("");
};

/**
 * set the value of the element and dispatch a change event
 *
 * @param {HTMLInputElement} el The element to update
 * @param {string} value The new value of the element
 */
var changeElementValue = function changeElementValue(el) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var elementToChange = el;
  elementToChange.value = value;
  var event = new Event('change');
  elementToChange.dispatchEvent(event);
};

/**
 * The properties and elements within the date picker.
 * @typedef {Object} DatePickerContext
 * @property {HTMLDivElement} calendarEl
 * @property {HTMLElement} datePickerEl
 * @property {HTMLDivElement} dialogEl
 * @property {HTMLInputElement} internalInputEl
 * @property {HTMLInputElement} externalInputEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLDivElement} guideEl
 * @property {HTMLDivElement} firstYearChunkEl
 * @property {Date} calendarDate
 * @property {Date} minDate
 * @property {Date} maxDate
 * @property {Date} selectedDate
 * @property {Date} rangeDate
 * @property {Date} defaultDate
 */

/**
 * Get an object of the properties and elements belonging directly to the given
 * date picker component.
 *
 * @param {HTMLElement} el the element within the date picker
 * @returns {DatePickerContext} elements
 */
var getDatePickerContext = function getDatePickerContext(el) {
  var datePickerEl = el.closest(DATE_PICKER);
  if (!datePickerEl) {
    throw new Error("Element is missing outer ".concat(DATE_PICKER));
  }
  var internalInputEl = datePickerEl.querySelector(DATE_PICKER_INTERNAL_INPUT);
  var externalInputEl = datePickerEl.querySelector(DATE_PICKER_EXTERNAL_INPUT);
  var calendarEl = datePickerEl.querySelector(DATE_PICKER_CALENDAR);
  var toggleBtnEl = datePickerEl.querySelector(DATE_PICKER_BUTTON);
  var statusEl = datePickerEl.querySelector(DATE_PICKER_STATUS);
  var guideEl = datePickerEl.querySelector(DATE_PICKER_GUIDE);
  var firstYearChunkEl = datePickerEl.querySelector(CALENDAR_YEAR);
  var dialogEl = datePickerEl.querySelector(DATE_PICKER_DIALOG_WRAPPER);

  // Set date format
  var selectedDateFormat = DATE_FORMAT_OPTION_1;
  if (datePickerEl.hasAttribute("data-dateformat")) {
    switch (datePickerEl.dataset.dateformat) {
      case DATE_FORMAT_OPTION_1:
        selectedDateFormat = DATE_FORMAT_OPTION_1;
        break;
      case DATE_FORMAT_OPTION_2:
        selectedDateFormat = DATE_FORMAT_OPTION_2;
        break;
      case DATE_FORMAT_OPTION_3:
        selectedDateFormat = DATE_FORMAT_OPTION_3;
        break;
      case DATE_FORMAT_OPTION_4:
        selectedDateFormat = DATE_FORMAT_OPTION_4;
        break;
      case DATE_FORMAT_OPTION_5:
        selectedDateFormat = DATE_FORMAT_OPTION_5;
    }
  }
  var dateFormatOption = selectedDateFormat;
  var inputDate = parseDateString(externalInputEl.value, dateFormatOption, true);
  var selectedDate = parseDateString(internalInputEl.value);
  var calendarDate = parseDateString(calendarEl.dataset.value);
  var minDate = parseDateString(datePickerEl.dataset.minDate);
  var maxDate = parseDateString(datePickerEl.dataset.maxDate);
  var rangeDate = parseDateString(datePickerEl.dataset.rangeDate);
  var defaultDate = parseDateString(datePickerEl.dataset.defaultDate);
  if (minDate && maxDate && minDate > maxDate) {
    throw new Error("Minimum date cannot be after maximum date");
  }
  return {
    calendarDate: calendarDate,
    minDate: minDate,
    toggleBtnEl: toggleBtnEl,
    dialogEl: dialogEl,
    selectedDate: selectedDate,
    maxDate: maxDate,
    firstYearChunkEl: firstYearChunkEl,
    datePickerEl: datePickerEl,
    inputDate: inputDate,
    internalInputEl: internalInputEl,
    externalInputEl: externalInputEl,
    calendarEl: calendarEl,
    rangeDate: rangeDate,
    defaultDate: defaultDate,
    statusEl: statusEl,
    guideEl: guideEl,
    dateFormatOption: dateFormatOption
  };
};

/**
 * Disable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var disable = function disable(el) {
  var _getDatePickerContext = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext.externalInputEl,
    toggleBtnEl = _getDatePickerContext.toggleBtnEl;
  toggleBtnEl.disabled = true;
  externalInputEl.disabled = true;
};

/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var enable = function enable(el) {
  var _getDatePickerContext2 = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext2.externalInputEl,
    toggleBtnEl = _getDatePickerContext2.toggleBtnEl;
  toggleBtnEl.disabled = false;
  externalInputEl.disabled = false;
};

// #region Validation

/**
 * Validate the value in the input as a valid date of format D/M/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var isDateInputInvalid = function isDateInputInvalid(el) {
  var _getDatePickerContext3 = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext3.externalInputEl,
    minDate = _getDatePickerContext3.minDate,
    maxDate = _getDatePickerContext3.maxDate;
  var dateString = externalInputEl.value;
  var isInvalid = false;
  if (dateString) {
    isInvalid = true;
    var dateStringParts = dateString.split(/-|\.|\/|\s/);
    var _dateStringParts$map = dateStringParts.map(function (str) {
        var value;
        var parsed = parseInt(str, 10);
        if (!Number.isNaN(parsed)) value = parsed;
        return value;
      }),
      _dateStringParts$map2 = _slicedToArray(_dateStringParts$map, 3),
      day = _dateStringParts$map2[0],
      month = _dateStringParts$map2[1],
      year = _dateStringParts$map2[2];
    if (month && day && year != null) {
      var checkDate = setDate(year, month - 1, day);
      if (checkDate.getMonth() === month - 1 && checkDate.getDate() === day && checkDate.getFullYear() === year && dateStringParts[2].length === 4 && isDateWithinMinAndMax(checkDate, minDate, maxDate)) {
        isInvalid = false;
      }
    }
  }
  return isInvalid;
};

/**
 * Validate the value in the input as a valid date of format M/D/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var validateDateInput = function validateDateInput(el) {
  var _getDatePickerContext4 = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext4.externalInputEl;
  var isInvalid = isDateInputInvalid(externalInputEl);
  if (isInvalid && !externalInputEl.validationMessage) {
    externalInputEl.setCustomValidity(VALIDATION_MESSAGE);
  }
  if (!isInvalid && externalInputEl.validationMessage === VALIDATION_MESSAGE) {
    externalInputEl.setCustomValidity("");
  }
};

// #endregion Validation

/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var reconcileInputValues = function reconcileInputValues(el) {
  var _getDatePickerContext5 = getDatePickerContext(el),
    internalInputEl = _getDatePickerContext5.internalInputEl,
    inputDate = _getDatePickerContext5.inputDate;
  var newValue = "";
  if (inputDate && !isDateInputInvalid(el)) {
    newValue = formatDate(inputDate);
  }
  if (internalInputEl.value !== newValue) {
    changeElementValue(internalInputEl, newValue);
  }
};

/**
 * Select the value of the date picker inputs.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {string} dateString The date string to update in YYYY-MM-DD format
 */
var setCalendarValue = function setCalendarValue(el, dateString) {
  var parsedDate = parseDateString(dateString);
  if (parsedDate) {
    var _getDatePickerContext6 = getDatePickerContext(el),
      datePickerEl = _getDatePickerContext6.datePickerEl,
      internalInputEl = _getDatePickerContext6.internalInputEl,
      externalInputEl = _getDatePickerContext6.externalInputEl,
      dateFormatOption = _getDatePickerContext6.dateFormatOption;
    var formattedDate = formatDate(parsedDate, dateFormatOption);
    changeElementValue(internalInputEl, dateString);
    changeElementValue(externalInputEl, formattedDate);
    validateDateInput(datePickerEl);
  }
};

/**
 * Enhance an input with the date picker elements
 *
 * @param {HTMLElement} el The initial wrapping element of the date picker component
 */
var enhanceDatePicker = function enhanceDatePicker(el) {
  var datePickerEl = el.closest(DATE_PICKER);
  var defaultValue = datePickerEl.dataset.defaultValue;
  var internalInputEl = datePickerEl.querySelector("input");
  if (!internalInputEl) {
    throw new Error("".concat(DATE_PICKER, " is missing inner input"));
  }
  var minDate = parseDateString(datePickerEl.dataset.minDate || internalInputEl.getAttribute("min"));
  datePickerEl.dataset.minDate = minDate ? formatDate(minDate) : DEFAULT_MIN_DATE;
  var maxDate = parseDateString(datePickerEl.dataset.maxDate || internalInputEl.getAttribute("max"));
  if (maxDate) {
    datePickerEl.dataset.maxDate = formatDate(maxDate);
  }
  var calendarWrapper = document.createElement("div");
  calendarWrapper.classList.add(DATE_PICKER_WRAPPER_CLASS);
  calendarWrapper.tabIndex = "-1";
  var externalInputEl = internalInputEl.cloneNode();
  externalInputEl.classList.add(DATE_PICKER_EXTERNAL_INPUT_CLASS);
  externalInputEl.type = "text";
  externalInputEl.name = "";
  var dialogTitle = text.choose_a_date;
  var hasMinDate = minDate !== undefined && minDate !== "";
  var isDefaultMinDate = minDate !== undefined && minDate !== "" && parseDateString(DEFAULT_MIN_DATE).getTime() === minDate.getTime();
  var hasMaxDate = maxDate !== undefined && maxDate !== "";
  if (hasMinDate && !isDefaultMinDate && hasMaxDate) {
    var minDay = minDate.getDate();
    var minMonth = minDate.getMonth();
    var minMonthStr = MONTH_LABELS[minMonth];
    var minYear = minDate.getFullYear();
    var maxDay = maxDate.getDate();
    var maxMonth = maxDate.getMonth();
    var maxMonthStr = MONTH_LABELS[maxMonth];
    var maxYear = maxDate.getFullYear();
    dialogTitle = text.choose_a_date_between.replace(/{minDay}/, minDay).replace(/{minMonthStr}/, minMonthStr).replace(/{minYear}/, minYear).replace(/{maxDay}/, maxDay).replace(/{maxMonthStr}/, maxMonthStr).replace(/{maxYear}/, maxYear);
  } else if (hasMinDate && !isDefaultMinDate && !hasMaxDate) {
    var _minDay = minDate.getDate();
    var _minMonth = minDate.getMonth();
    var _minMonthStr = MONTH_LABELS[_minMonth];
    var _minYear = minDate.getFullYear();
    dialogTitle = text.choose_a_date_after.replace(/{minDay}/, _minDay).replace(/{minMonthStr}/, _minMonthStr).replace(/{minYear}/, _minYear);
  } else if (hasMaxDate) {
    var _maxDay = maxDate.getDate();
    var _maxMonth = maxDate.getMonth();
    var _maxMonthStr = MONTH_LABELS[_maxMonth];
    var _maxYear = maxDate.getFullYear();
    dialogTitle = text.choose_a_date_before.replace(/{maxDay}/, _maxDay).replace(/{maxMonthStr}/, _maxMonthStr).replace(/{maxYear}/, _maxYear);
  }
  var guideID = externalInputEl.getAttribute("id") + "-guide";
  calendarWrapper.appendChild(externalInputEl);
  calendarWrapper.insertAdjacentHTML("beforeend", ["<button type=\"button\" class=\"".concat(DATE_PICKER_BUTTON_CLASS, "\" aria-haspopup=\"true\" aria-label=\"").concat(text.open_calendar, "\">&nbsp;</button>"), "<div class=\"".concat(DIALOG_WRAPPER_CLASS, "\" role=\"dialog\" aria-modal=\"true\" aria-label=\"").concat(dialogTitle, "\" aria-describedby=\"").concat(guideID, "\" hidden><div role=\"application\"><div class=\"").concat(DATE_PICKER_CALENDAR_CLASS, "\" hidden></div></div></div>"), "<div class=\"sr-only ".concat(DATE_PICKER_STATUS_CLASS, "\" role=\"status\" aria-live=\"polite\"></div>"), "<div class=\"sr-only ".concat(DATE_PICKER_GUIDE_CLASS, "\" id=\"").concat(guideID, "\" hidden>").concat(text.guide, "</div>")].join(""));
  internalInputEl.setAttribute("aria-hidden", "true");
  internalInputEl.setAttribute("tabindex", "-1");
  internalInputEl.classList.add("sr-only", DATE_PICKER_INTERNAL_INPUT_CLASS);
  internalInputEl.removeAttribute('id');
  internalInputEl.required = false;
  datePickerEl.appendChild(calendarWrapper);
  datePickerEl.classList.add(DATE_PICKER_INITIALIZED_CLASS);
  if (defaultValue) {
    setCalendarValue(datePickerEl, defaultValue);
  }
  if (internalInputEl.disabled) {
    disable(datePickerEl);
    internalInputEl.disabled = false;
  }
  if (externalInputEl.value) {
    validateDateInput(externalInputEl);
  }
};

// #region Calendar - Date Selection View

/**
 * render the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 * @param {Date} _dateToDisplay a date to render on the calendar
 * @returns {HTMLElement} a reference to the new calendar element
 */
var renderCalendar = function renderCalendar(el, _dateToDisplay) {
  var _getDatePickerContext7 = getDatePickerContext(el),
    datePickerEl = _getDatePickerContext7.datePickerEl,
    calendarEl = _getDatePickerContext7.calendarEl,
    statusEl = _getDatePickerContext7.statusEl,
    selectedDate = _getDatePickerContext7.selectedDate,
    maxDate = _getDatePickerContext7.maxDate,
    minDate = _getDatePickerContext7.minDate,
    rangeDate = _getDatePickerContext7.rangeDate,
    dialogEl = _getDatePickerContext7.dialogEl,
    guideEl = _getDatePickerContext7.guideEl;
  var todaysDate = today();
  var dateToDisplay = _dateToDisplay || todaysDate;
  var calendarWasHidden = calendarEl.hidden;
  var focusedDate = addDays(dateToDisplay, 0);
  var focusedMonth = dateToDisplay.getMonth();
  var focusedYear = dateToDisplay.getFullYear();
  var prevMonth = subMonths(dateToDisplay, 1);
  var nextMonth = addMonths(dateToDisplay, 1);
  var currentFormattedDate = formatDate(dateToDisplay);
  var firstOfMonth = startOfMonth(dateToDisplay);
  var prevButtonsDisabled = isSameMonth(dateToDisplay, minDate);
  var nextButtonsDisabled = isSameMonth(dateToDisplay, maxDate);
  var rangeConclusionDate = selectedDate || dateToDisplay;
  var rangeStartDate = rangeDate && min(rangeConclusionDate, rangeDate);
  var rangeEndDate = rangeDate && max(rangeConclusionDate, rangeDate);
  var withinRangeStartDate = rangeDate && addDays(rangeStartDate, 1);
  var withinRangeEndDate = rangeDate && subDays(rangeEndDate, 1);
  var monthLabel = MONTH_LABELS[focusedMonth];
  var generateDateHtml = function generateDateHtml(dateToRender) {
    var classes = [CALENDAR_DATE_CLASS];
    var day = dateToRender.getDate();
    var month = dateToRender.getMonth();
    var year = dateToRender.getFullYear();
    var dayOfWeek = dateToRender.getDay() - 1;
    if (dayOfWeek === -1) {
      dayOfWeek = 6;
    }
    var formattedDate = formatDate(dateToRender);
    var tabindex = "-1";
    var isDisabled = !isDateWithinMinAndMax(dateToRender, minDate, maxDate);
    var isSelected = isSameDay(dateToRender, selectedDate);
    if (isSameMonth(dateToRender, prevMonth)) {
      classes.push(CALENDAR_DATE_PREVIOUS_MONTH_CLASS);
    }
    if (isSameMonth(dateToRender, focusedDate)) {
      classes.push(CALENDAR_DATE_CURRENT_MONTH_CLASS);
    }
    if (isSameMonth(dateToRender, nextMonth)) {
      classes.push(CALENDAR_DATE_NEXT_MONTH_CLASS);
    }
    if (isSelected) {
      classes.push(CALENDAR_DATE_SELECTED_CLASS);
    }
    if (isSameDay(dateToRender, todaysDate)) {
      classes.push(CALENDAR_DATE_TODAY_CLASS);
    }
    if (rangeDate) {
      if (isSameDay(dateToRender, rangeDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_CLASS);
      }
      if (isSameDay(dateToRender, rangeStartDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_START_CLASS);
      }
      if (isSameDay(dateToRender, rangeEndDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_END_CLASS);
      }
      if (isDateWithinMinAndMax(dateToRender, withinRangeStartDate, withinRangeEndDate)) {
        classes.push(CALENDAR_DATE_WITHIN_RANGE_CLASS);
      }
    }
    if (isSameDay(dateToRender, focusedDate)) {
      tabindex = "0";
      classes.push(CALENDAR_DATE_FOCUSED_CLASS);
    }
    var monthStr = MONTH_LABELS[month];
    var dayStr = DAY_OF_WEEK_LABELS[dayOfWeek];
    var ariaLabelDate = text.aria_label_date.replace(/{dayStr}/, dayStr).replace(/{day}/, day).replace(/{monthStr}/, monthStr).replace(/{year}/, year);
    return "<button\n      type=\"button\"\n      tabindex=\"".concat(tabindex, "\"\n      class=\"").concat(classes.join(" "), "\" \n      data-day=\"").concat(day, "\" \n      data-month=\"").concat(month + 1, "\" \n      data-year=\"").concat(year, "\" \n      data-value=\"").concat(formattedDate, "\"\n      aria-label=\"").concat(ariaLabelDate, "\"\n      aria-current=\"").concat(isSelected ? "date" : "false", "\"\n      ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n    >").concat(day, "</button>");
  };
  // set date to first rendered day
  dateToDisplay = startOfWeek(firstOfMonth);
  var days = [];
  while (days.length < 28 || dateToDisplay.getMonth() === focusedMonth || days.length % 7 !== 0) {
    days.push(generateDateHtml(dateToDisplay));
    dateToDisplay = addDays(dateToDisplay, 1);
  }
  var datesHtml = listToGridHtml(days, 7);
  var newCalendar = calendarEl.cloneNode();
  newCalendar.dataset.value = currentFormattedDate;
  newCalendar.style.top = "".concat(datePickerEl.offsetHeight, "px");
  newCalendar.hidden = false;
  var content = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_DATE_PICKER_CLASS, "\">\n      <div class=\"").concat(CALENDAR_ROW_CLASS, "\">\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_YEAR_CLASS, "\"\n            aria-label=\"").concat(text.previous_year, "\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_MONTH_CLASS, "\"\n            aria-label=\"").concat(text.previous_month, "\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_MONTH_LABEL_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_MONTH_SELECTION_CLASS, "\" aria-label=\"").concat(monthLabel, ". ").concat(text.select_month, ".\"\n          >").concat(monthLabel, "</button>\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_YEAR_SELECTION_CLASS, "\" aria-label=\"").concat(focusedYear, ". ").concat(text.select_year, ".\"\n          >").concat(focusedYear, "</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_MONTH_CLASS, "\"\n            aria-label=\"").concat(text.next_month, "\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_YEAR_CLASS, "\"\n            aria-label=\"").concat(text.next_year, "\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n      </div>\n      <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <thead>\n          <tr>");
  for (var d in DAY_OF_WEEK_LABELS) {
    content += "<th class=\"".concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"").concat(DAY_OF_WEEK_LABELS[d], "\">").concat(DAY_OF_WEEK_LABELS[d].charAt(0), "</th>");
  }
  content += "</tr>\n        </thead>\n        <tbody>\n          ".concat(datesHtml, "\n        </tbody>\n      </table>\n    </div>");
  newCalendar.innerHTML = content;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  datePickerEl.classList.add(DATE_PICKER_ACTIVE_CLASS);
  if (dialogEl.hidden === true) {
    dialogEl.hidden = false;
    if (guideEl.hidden) {
      guideEl.hidden = false;
    }
  }
  var statuses = [];
  if (calendarWasHidden) {
    statusEl.textContent = "";
  } else if (_dateToDisplay.getTime() === minDate.getTime()) {
    statuses.push(text.first_possible_date);
  } else if (maxDate !== undefined && maxDate !== "" && _dateToDisplay.getTime() === maxDate.getTime()) {
    statuses.push(text.last_possible_date);
  } else {
    statuses.push(text.current_month_displayed.replace(/{monthLabel}/, monthLabel).replace(/{focusedYear}/, focusedYear));
  }
  statusEl.textContent = statuses.join(". ");
  return newCalendar;
};

/**
 * Navigate back one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayPreviousYear = function displayPreviousYear(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext8 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext8.calendarEl,
    calendarDate = _getDatePickerContext8.calendarDate,
    minDate = _getDatePickerContext8.minDate,
    maxDate = _getDatePickerContext8.maxDate;
  var date = subYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate back one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayPreviousMonth = function displayPreviousMonth(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext9 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext9.calendarEl,
    calendarDate = _getDatePickerContext9.calendarDate,
    minDate = _getDatePickerContext9.minDate,
    maxDate = _getDatePickerContext9.maxDate;
  var date = subMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_MONTH);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayNextMonth = function displayNextMonth(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext10 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext10.calendarEl,
    calendarDate = _getDatePickerContext10.calendarDate,
    minDate = _getDatePickerContext10.minDate,
    maxDate = _getDatePickerContext10.maxDate;
  var date = addMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_MONTH);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayNextYear = function displayNextYear(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext11 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext11.calendarEl,
    calendarDate = _getDatePickerContext11.calendarDate,
    minDate = _getDatePickerContext11.minDate,
    maxDate = _getDatePickerContext11.maxDate;
  var date = addYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var hideCalendar = function hideCalendar(el) {
  var _getDatePickerContext12 = getDatePickerContext(el),
    datePickerEl = _getDatePickerContext12.datePickerEl,
    calendarEl = _getDatePickerContext12.calendarEl,
    statusEl = _getDatePickerContext12.statusEl;
  datePickerEl.classList.remove(DATE_PICKER_ACTIVE_CLASS);
  calendarEl.hidden = true;
  statusEl.textContent = "";
};

/**
 * Select a date within the date picker component.
 *
 * @param {HTMLButtonElement} calendarDateEl A date element within the date picker component
 */
var selectDate = function selectDate(calendarDateEl) {
  if (calendarDateEl.disabled) return;
  var _getDatePickerContext13 = getDatePickerContext(calendarDateEl),
    datePickerEl = _getDatePickerContext13.datePickerEl,
    externalInputEl = _getDatePickerContext13.externalInputEl,
    dialogEl = _getDatePickerContext13.dialogEl,
    guideEl = _getDatePickerContext13.guideEl;
  setCalendarValue(calendarDateEl, calendarDateEl.dataset.value);
  hideCalendar(datePickerEl);
  dialogEl.hidden = true;
  guideEl.hidden = true;
  externalInputEl.focus();
};

/**
 * Toggle the calendar.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
var toggleCalendar = function toggleCalendar(el) {
  if (el.disabled) return;
  var _getDatePickerContext14 = getDatePickerContext(el),
    dialogEl = _getDatePickerContext14.dialogEl,
    calendarEl = _getDatePickerContext14.calendarEl,
    inputDate = _getDatePickerContext14.inputDate,
    minDate = _getDatePickerContext14.minDate,
    maxDate = _getDatePickerContext14.maxDate,
    defaultDate = _getDatePickerContext14.defaultDate,
    guideEl = _getDatePickerContext14.guideEl;
  if (calendarEl.hidden) {
    var dateToDisplay = keepDateBetweenMinAndMax(inputDate || defaultDate || today(), minDate, maxDate);
    var newCalendar = renderCalendar(calendarEl, dateToDisplay);
    newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
  } else {
    hideCalendar(el);
    dialogEl.hidden = true;
    guideEl.hidden = true;
  }
};

/**
 * Update the calendar when visible.
 *
 * @param {HTMLElement} el an element within the date picker
 */
var updateCalendarIfVisible = function updateCalendarIfVisible(el) {
  var _getDatePickerContext15 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext15.calendarEl,
    inputDate = _getDatePickerContext15.inputDate,
    minDate = _getDatePickerContext15.minDate,
    maxDate = _getDatePickerContext15.maxDate;
  var calendarShown = !calendarEl.hidden;
  if (calendarShown && inputDate) {
    var dateToDisplay = keepDateBetweenMinAndMax(inputDate, minDate, maxDate);
    renderCalendar(calendarEl, dateToDisplay);
  }
};

// #endregion Calendar - Date Selection View

// #region Calendar - Month Selection View
/**
 * Display the month selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @returns {HTMLElement} a reference to the new calendar element
 */
var displayMonthSelection = function displayMonthSelection(el, monthToDisplay) {
  var _getDatePickerContext16 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext16.calendarEl,
    statusEl = _getDatePickerContext16.statusEl,
    calendarDate = _getDatePickerContext16.calendarDate,
    minDate = _getDatePickerContext16.minDate,
    maxDate = _getDatePickerContext16.maxDate;
  var selectedMonth = calendarDate.getMonth();
  var focusedMonth = monthToDisplay == null ? selectedMonth : monthToDisplay;
  var months = MONTH_LABELS.map(function (month, index) {
    var monthToCheck = setMonth(calendarDate, index);
    var isDisabled = isDatesMonthOutsideMinOrMax(monthToCheck, minDate, maxDate);
    var tabindex = "-1";
    var classes = [CALENDAR_MONTH_CLASS];
    var isSelected = index === selectedMonth;
    if (index === focusedMonth) {
      tabindex = "0";
      classes.push(CALENDAR_MONTH_FOCUSED_CLASS);
    }
    if (isSelected) {
      classes.push(CALENDAR_MONTH_SELECTED_CLASS);
    }
    return "<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(index, "\"\n        data-label=\"").concat(month, "\"\n        aria-current=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(month, "</button>");
  });
  var monthsHtml = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_MONTH_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n      <tbody>\n        ").concat(listToGridHtml(months, 3), "\n      </tbody>\n    </table>\n  </div>");
  var newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = monthsHtml;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  statusEl.textContent = text.months_displayed;
  return newCalendar;
};

/**
 * Select a month in the date picker component.
 *
 * @param {HTMLButtonElement} monthEl An month element within the date picker component
 */
var selectMonth = function selectMonth(monthEl) {
  if (monthEl.disabled) return;
  var _getDatePickerContext17 = getDatePickerContext(monthEl),
    calendarEl = _getDatePickerContext17.calendarEl,
    calendarDate = _getDatePickerContext17.calendarDate,
    minDate = _getDatePickerContext17.minDate,
    maxDate = _getDatePickerContext17.maxDate;
  var selectedMonth = parseInt(monthEl.dataset.value, 10);
  var date = setMonth(calendarDate, selectedMonth);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar - Month Selection View

// #region Calendar - Year Selection View

/**
 * Display the year selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {number} yearToDisplay year to display in year selection
 * @returns {HTMLElement} a reference to the new calendar element
 */
var displayYearSelection = function displayYearSelection(el, yearToDisplay) {
  var _getDatePickerContext18 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext18.calendarEl,
    statusEl = _getDatePickerContext18.statusEl,
    calendarDate = _getDatePickerContext18.calendarDate,
    minDate = _getDatePickerContext18.minDate,
    maxDate = _getDatePickerContext18.maxDate;
  var selectedYear = calendarDate.getFullYear();
  var focusedYear = yearToDisplay == null ? selectedYear : yearToDisplay;
  var yearToChunk = focusedYear;
  yearToChunk -= yearToChunk % YEAR_CHUNK;
  yearToChunk = Math.max(0, yearToChunk);
  var prevYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk - 1), minDate, maxDate);
  var nextYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk + YEAR_CHUNK), minDate, maxDate);
  var years = [];
  var yearIndex = yearToChunk;
  while (years.length < YEAR_CHUNK) {
    var isDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearIndex), minDate, maxDate);
    var tabindex = "-1";
    var classes = [CALENDAR_YEAR_CLASS];
    var isSelected = yearIndex === selectedYear;
    if (yearIndex === focusedYear) {
      tabindex = "0";
      classes.push(CALENDAR_YEAR_FOCUSED_CLASS);
    }
    if (isSelected) {
      classes.push(CALENDAR_YEAR_SELECTED_CLASS);
    }
    years.push("<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(yearIndex, "\"\n        aria-current=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(yearIndex, "</button>"));
    yearIndex += 1;
  }
  var yearsHtml = listToGridHtml(years, 3);
  var ariaLabelPreviousYears = text.previous_years.replace(/{years}/, YEAR_CHUNK);
  var ariaLabelNextYears = text.next_years.replace(/{years}/, YEAR_CHUNK);
  var announceYears = text.years_displayed.replace(/{start}/, yearToChunk).replace(/{end}/, yearToChunk + YEAR_CHUNK - 1);
  var newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_YEAR_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <tbody>\n          <tr>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"").concat(ariaLabelPreviousYears, "\"\n                ").concat(prevYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n            <td colspan=\"3\">\n              <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n                <tbody>\n                  ").concat(yearsHtml, "\n                </tbody>\n              </table>\n            </td>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"").concat(ariaLabelNextYears, "\"\n                ").concat(nextYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>");
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  statusEl.textContent = announceYears;
  return newCalendar;
};

/**
 * Navigate back by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
var displayPreviousYearChunk = function displayPreviousYearChunk(el) {
  if (el.disabled) return;
  var _getDatePickerContext19 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext19.calendarEl,
    calendarDate = _getDatePickerContext19.calendarDate,
    minDate = _getDatePickerContext19.minDate,
    maxDate = _getDatePickerContext19.maxDate;
  var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  var selectedYear = parseInt(yearEl.textContent, 10);
  var adjustedYear = selectedYear - YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);
  var date = setYear(calendarDate, adjustedYear);
  var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR_CHUNK);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate forward by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
var displayNextYearChunk = function displayNextYearChunk(el) {
  if (el.disabled) return;
  var _getDatePickerContext20 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext20.calendarEl,
    calendarDate = _getDatePickerContext20.calendarDate,
    minDate = _getDatePickerContext20.minDate,
    maxDate = _getDatePickerContext20.maxDate;
  var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  var selectedYear = parseInt(yearEl.textContent, 10);
  var adjustedYear = selectedYear + YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);
  var date = setYear(calendarDate, adjustedYear);
  var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR_CHUNK);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Select a year in the date picker component.
 *
 * @param {HTMLButtonElement} yearEl A year element within the date picker component
 */
var selectYear = function selectYear(yearEl) {
  if (yearEl.disabled) return;
  var _getDatePickerContext21 = getDatePickerContext(yearEl),
    calendarEl = _getDatePickerContext21.calendarEl,
    calendarDate = _getDatePickerContext21.calendarDate,
    minDate = _getDatePickerContext21.minDate,
    maxDate = _getDatePickerContext21.maxDate;
  var selectedYear = parseInt(yearEl.innerHTML, 10);
  var date = setYear(calendarDate, selectedYear);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar - Year Selection View

// #region Calendar Event Handling

/**
 * Hide the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEscapeFromCalendar = function handleEscapeFromCalendar(event) {
  var _getDatePickerContext22 = getDatePickerContext(event.target),
    datePickerEl = _getDatePickerContext22.datePickerEl,
    externalInputEl = _getDatePickerContext22.externalInputEl,
    dialogEl = _getDatePickerContext22.dialogEl,
    guideEl = _getDatePickerContext22.guideEl;
  hideCalendar(datePickerEl);
  dialogEl.hidden = true;
  guideEl.hidden = true;
  externalInputEl.focus();
  event.preventDefault();
};

// #endregion Calendar Event Handling

// #region Calendar Date Event Handling

/**
 * Adjust the date and display the calendar if needed.
 *
 * @param {function} adjustDateFn function that returns the adjusted date
 */
var adjustCalendar = function adjustCalendar(adjustDateFn) {
  return function (event) {
    var _getDatePickerContext23 = getDatePickerContext(event.target),
      calendarEl = _getDatePickerContext23.calendarEl,
      calendarDate = _getDatePickerContext23.calendarDate,
      minDate = _getDatePickerContext23.minDate,
      maxDate = _getDatePickerContext23.maxDate;
    var date = adjustDateFn(calendarDate);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameDay(calendarDate, cappedDate)) {
      var newCalendar = renderCalendar(calendarEl, cappedDate);
      newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
    }
    event.preventDefault();
  };
};

/**
 * Navigate back one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleUpFromDate = adjustCalendar(function (date) {
  return subWeeks(date, 1);
});

/**
 * Navigate forward one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleDownFromDate = adjustCalendar(function (date) {
  return addWeeks(date, 1);
});

/**
 * Navigate back one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleLeftFromDate = adjustCalendar(function (date) {
  return subDays(date, 1);
});

/**
 * Navigate forward one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleRightFromDate = adjustCalendar(function (date) {
  return addDays(date, 1);
});

/**
 * Navigate to the start of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleHomeFromDate = adjustCalendar(function (date) {
  return startOfWeek(date);
});

/**
 * Navigate to the end of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEndFromDate = adjustCalendar(function (date) {
  return endOfWeek(date);
});

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageDownFromDate = adjustCalendar(function (date) {
  return addMonths(date, 1);
});

/**
 * Navigate back one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageUpFromDate = adjustCalendar(function (date) {
  return subMonths(date, 1);
});

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleShiftPageDownFromDate = adjustCalendar(function (date) {
  return addYears(date, 1);
});

/**
 * Navigate back one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleShiftPageUpFromDate = adjustCalendar(function (date) {
  return subYears(date, 1);
});

/**
 * display the calendar for the mousemove date.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A date element within the date picker component
 */
var handleMousemoveFromDate = function handleMousemoveFromDate(dateEl) {
  if (dateEl.disabled) return;
  var calendarEl = dateEl.closest(DATE_PICKER_CALENDAR);
  var currentCalendarDate = calendarEl.dataset.value;
  var hoverDate = dateEl.dataset.value;
  if (hoverDate === currentCalendarDate) return;
  var dateToDisplay = parseDateString(hoverDate);
  var newCalendar = renderCalendar(calendarEl, dateToDisplay);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar Date Event Handling

// #region Calendar Month Event Handling

/**
 * Adjust the month and display the month selection screen if needed.
 *
 * @param {function} adjustMonthFn function that returns the adjusted month
 */
var adjustMonthSelectionScreen = function adjustMonthSelectionScreen(adjustMonthFn) {
  return function (event) {
    var monthEl = event.target;
    var selectedMonth = parseInt(monthEl.dataset.value, 10);
    var _getDatePickerContext24 = getDatePickerContext(monthEl),
      calendarEl = _getDatePickerContext24.calendarEl,
      calendarDate = _getDatePickerContext24.calendarDate,
      minDate = _getDatePickerContext24.minDate,
      maxDate = _getDatePickerContext24.maxDate;
    var currentDate = setMonth(calendarDate, selectedMonth);
    var adjustedMonth = adjustMonthFn(selectedMonth);
    adjustedMonth = Math.max(0, Math.min(11, adjustedMonth));
    var date = setMonth(calendarDate, adjustedMonth);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameMonth(currentDate, cappedDate)) {
      var newCalendar = displayMonthSelection(calendarEl, cappedDate.getMonth());
      newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
    }
    event.preventDefault();
  };
};

/**
 * Navigate back three months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleUpFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - 3;
});

/**
 * Navigate forward three months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleDownFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 3;
});

/**
 * Navigate back one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleLeftFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - 1;
});

/**
 * Navigate forward one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleRightFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 1;
});

/**
 * Navigate to the start of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleHomeFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - month % 3;
});

/**
 * Navigate to the end of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEndFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 2 - month % 3;
});

/**
 * Navigate to the last month (December) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageDownFromMonth = adjustMonthSelectionScreen(function () {
  return 11;
});

/**
 * Navigate to the first month (January) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageUpFromMonth = adjustMonthSelectionScreen(function () {
  return 0;
});

/**
 * update the focus on a month when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} monthEl A month element within the date picker component
 */
var handleMousemoveFromMonth = function handleMousemoveFromMonth(monthEl) {
  if (monthEl.disabled) return;
  if (monthEl.classList.contains(CALENDAR_MONTH_FOCUSED_CLASS)) return;
  var focusMonth = parseInt(monthEl.dataset.value, 10);
  var newCalendar = displayMonthSelection(monthEl, focusMonth);
  newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
};

// #endregion Calendar Month Event Handling

// #region Calendar Year Event Handling

/**
 * Adjust the year and display the year selection screen if needed.
 *
 * @param {function} adjustYearFn function that returns the adjusted year
 */
var adjustYearSelectionScreen = function adjustYearSelectionScreen(adjustYearFn) {
  return function (event) {
    var yearEl = event.target;
    var selectedYear = parseInt(yearEl.dataset.value, 10);
    var _getDatePickerContext25 = getDatePickerContext(yearEl),
      calendarEl = _getDatePickerContext25.calendarEl,
      calendarDate = _getDatePickerContext25.calendarDate,
      minDate = _getDatePickerContext25.minDate,
      maxDate = _getDatePickerContext25.maxDate;
    var currentDate = setYear(calendarDate, selectedYear);
    var adjustedYear = adjustYearFn(selectedYear);
    adjustedYear = Math.max(0, adjustedYear);
    var date = setYear(calendarDate, adjustedYear);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameYear(currentDate, cappedDate)) {
      var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
      newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
    }
    event.preventDefault();
  };
};

/**
 * Navigate back three years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleUpFromYear = adjustYearSelectionScreen(function (year) {
  return year - 3;
});

/**
 * Navigate forward three years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleDownFromYear = adjustYearSelectionScreen(function (year) {
  return year + 3;
});

/**
 * Navigate back one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleLeftFromYear = adjustYearSelectionScreen(function (year) {
  return year - 1;
});

/**
 * Navigate forward one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleRightFromYear = adjustYearSelectionScreen(function (year) {
  return year + 1;
});

/**
 * Navigate to the start of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleHomeFromYear = adjustYearSelectionScreen(function (year) {
  return year - year % 3;
});

/**
 * Navigate to the end of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEndFromYear = adjustYearSelectionScreen(function (year) {
  return year + 2 - year % 3;
});

/**
 * Navigate to back 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageUpFromYear = adjustYearSelectionScreen(function (year) {
  return year - YEAR_CHUNK;
});

/**
 * Navigate forward 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageDownFromYear = adjustYearSelectionScreen(function (year) {
  return year + YEAR_CHUNK;
});

/**
 * update the focus on a year when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A year element within the date picker component
 */
var handleMousemoveFromYear = function handleMousemoveFromYear(yearEl) {
  if (yearEl.disabled) return;
  if (yearEl.classList.contains(CALENDAR_YEAR_FOCUSED_CLASS)) return;
  var focusYear = parseInt(yearEl.dataset.value, 10);
  var newCalendar = displayYearSelection(yearEl, focusYear);
  newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
};

// #endregion Calendar Year Event Handling

// #region Focus Handling Event Handling

var tabHandler = function tabHandler(focusable) {
  var getFocusableContext = function getFocusableContext(el) {
    var _getDatePickerContext26 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext26.calendarEl;
    var focusableElements = select(focusable, calendarEl);
    var firstTabIndex = 0;
    var lastTabIndex = focusableElements.length - 1;
    var firstTabStop = focusableElements[firstTabIndex];
    var lastTabStop = focusableElements[lastTabIndex];
    var focusIndex = focusableElements.indexOf(activeElement());
    var isLastTab = focusIndex === lastTabIndex;
    var isFirstTab = focusIndex === firstTabIndex;
    var isNotFound = focusIndex === -1;
    return {
      focusableElements: focusableElements,
      isNotFound: isNotFound,
      firstTabStop: firstTabStop,
      isFirstTab: isFirstTab,
      lastTabStop: lastTabStop,
      isLastTab: isLastTab
    };
  };
  return {
    tabAhead: function tabAhead(event) {
      var _getFocusableContext = getFocusableContext(event.target),
        firstTabStop = _getFocusableContext.firstTabStop,
        isLastTab = _getFocusableContext.isLastTab,
        isNotFound = _getFocusableContext.isNotFound;
      if (isLastTab || isNotFound) {
        event.preventDefault();
        firstTabStop.focus();
      }
    },
    tabBack: function tabBack(event) {
      var _getFocusableContext2 = getFocusableContext(event.target),
        lastTabStop = _getFocusableContext2.lastTabStop,
        isFirstTab = _getFocusableContext2.isFirstTab,
        isNotFound = _getFocusableContext2.isNotFound;
      if (isFirstTab || isNotFound) {
        event.preventDefault();
        lastTabStop.focus();
      }
    }
  };
};
var datePickerTabEventHandler = tabHandler(DATE_PICKER_FOCUSABLE);
var monthPickerTabEventHandler = tabHandler(MONTH_PICKER_FOCUSABLE);
var yearPickerTabEventHandler = tabHandler(YEAR_PICKER_FOCUSABLE);

// #endregion Focus Handling Event Handling

// #region Date Picker Event Delegation Registration / Component

var datePickerEvents = (_datePickerEvents = {}, _defineProperty(_datePickerEvents, CLICK, (_CLICK = {}, _defineProperty(_CLICK, DATE_PICKER_BUTTON, function () {
  toggleCalendar(this);
}), _defineProperty(_CLICK, CALENDAR_DATE, function () {
  selectDate(this);
}), _defineProperty(_CLICK, CALENDAR_MONTH, function () {
  selectMonth(this);
}), _defineProperty(_CLICK, CALENDAR_YEAR, function () {
  selectYear(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_MONTH, function () {
  displayPreviousMonth(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_MONTH, function () {
  displayNextMonth(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_YEAR, function () {
  displayPreviousYear(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_YEAR, function () {
  displayNextYear(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_YEAR_CHUNK, function () {
  displayPreviousYearChunk(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_YEAR_CHUNK, function () {
  displayNextYearChunk(this);
}), _defineProperty(_CLICK, CALENDAR_MONTH_SELECTION, function () {
  var newCalendar = displayMonthSelection(this);
  newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
}), _defineProperty(_CLICK, CALENDAR_YEAR_SELECTION, function () {
  var newCalendar = displayYearSelection(this);
  newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
}), _CLICK)), _defineProperty(_datePickerEvents, "keyup", _defineProperty({}, DATE_PICKER_CALENDAR, function (event) {
  var keydown = this.dataset.keydownKeyCode;
  if ("".concat(event.keyCode) !== keydown) {
    event.preventDefault();
  }
})), _defineProperty(_datePickerEvents, "keydown", (_keydown = {}, _defineProperty(_keydown, DATE_PICKER_EXTERNAL_INPUT, function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    validateDateInput(this);
  }
}), _defineProperty(_keydown, CALENDAR_DATE, (0, _receptor.keymap)({
  Up: handleUpFromDate,
  ArrowUp: handleUpFromDate,
  Down: handleDownFromDate,
  ArrowDown: handleDownFromDate,
  Left: handleLeftFromDate,
  ArrowLeft: handleLeftFromDate,
  Right: handleRightFromDate,
  ArrowRight: handleRightFromDate,
  Home: handleHomeFromDate,
  End: handleEndFromDate,
  PageDown: handlePageDownFromDate,
  PageUp: handlePageUpFromDate,
  "Shift+PageDown": handleShiftPageDownFromDate,
  "Shift+PageUp": handleShiftPageUpFromDate
})), _defineProperty(_keydown, CALENDAR_DATE_PICKER, (0, _receptor.keymap)({
  Tab: datePickerTabEventHandler.tabAhead,
  "Shift+Tab": datePickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_MONTH, (0, _receptor.keymap)({
  Up: handleUpFromMonth,
  ArrowUp: handleUpFromMonth,
  Down: handleDownFromMonth,
  ArrowDown: handleDownFromMonth,
  Left: handleLeftFromMonth,
  ArrowLeft: handleLeftFromMonth,
  Right: handleRightFromMonth,
  ArrowRight: handleRightFromMonth,
  Home: handleHomeFromMonth,
  End: handleEndFromMonth,
  PageDown: handlePageDownFromMonth,
  PageUp: handlePageUpFromMonth
})), _defineProperty(_keydown, CALENDAR_MONTH_PICKER, (0, _receptor.keymap)({
  Tab: monthPickerTabEventHandler.tabAhead,
  "Shift+Tab": monthPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_YEAR, (0, _receptor.keymap)({
  Up: handleUpFromYear,
  ArrowUp: handleUpFromYear,
  Down: handleDownFromYear,
  ArrowDown: handleDownFromYear,
  Left: handleLeftFromYear,
  ArrowLeft: handleLeftFromYear,
  Right: handleRightFromYear,
  ArrowRight: handleRightFromYear,
  Home: handleHomeFromYear,
  End: handleEndFromYear,
  PageDown: handlePageDownFromYear,
  PageUp: handlePageUpFromYear
})), _defineProperty(_keydown, CALENDAR_YEAR_PICKER, (0, _receptor.keymap)({
  Tab: yearPickerTabEventHandler.tabAhead,
  "Shift+Tab": yearPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, DATE_PICKER_CALENDAR, function (event) {
  this.dataset.keydownKeyCode = event.keyCode;
}), _defineProperty(_keydown, DATE_PICKER, function (event) {
  var keyMap = (0, _receptor.keymap)({
    Escape: handleEscapeFromCalendar
  });
  keyMap(event);
}), _keydown)), _defineProperty(_datePickerEvents, "focusout", (_focusout = {}, _defineProperty(_focusout, DATE_PICKER_EXTERNAL_INPUT, function () {
  validateDateInput(this);
}), _defineProperty(_focusout, DATE_PICKER, function (event) {
  if (!this.contains(event.relatedTarget)) {
    hideCalendar(this);
  }
}), _focusout)), _defineProperty(_datePickerEvents, "input", _defineProperty({}, DATE_PICKER_EXTERNAL_INPUT, function () {
  reconcileInputValues(this);
  updateCalendarIfVisible(this);
})), _datePickerEvents);
if (!isIosDevice()) {
  var _datePickerEvents$mou;
  datePickerEvents.mousemove = (_datePickerEvents$mou = {}, _defineProperty(_datePickerEvents$mou, CALENDAR_DATE_CURRENT_MONTH, function () {
    handleMousemoveFromDate(this);
  }), _defineProperty(_datePickerEvents$mou, CALENDAR_MONTH, function () {
    handleMousemoveFromMonth(this);
  }), _defineProperty(_datePickerEvents$mou, CALENDAR_YEAR, function () {
    handleMousemoveFromYear(this);
  }), _datePickerEvents$mou);
}
var datePicker = behavior(datePickerEvents, {
  init: function init(root) {
    select(DATE_PICKER, root).forEach(function (datePickerEl) {
      if (!datePickerEl.classList.contains(DATE_PICKER_INITIALIZED_CLASS)) {
        enhanceDatePicker(datePickerEl);
      }
    });
  },
  setLanguage: function setLanguage(strings) {
    text = strings;
    MONTH_LABELS = [text.january, text.february, text.march, text.april, text.may, text.june, text.july, text.august, text.september, text.october, text.november, text.december];
    DAY_OF_WEEK_LABELS = [text.monday, text.tuesday, text.wednesday, text.thursday, text.friday, text.saturday, text.sunday];
  },
  getDatePickerContext: getDatePickerContext,
  disable: disable,
  enable: enable,
  isDateInputInvalid: isDateInputInvalid,
  setCalendarValue: setCalendarValue,
  validateDateInput: validateDateInput,
  renderCalendar: renderCalendar,
  updateCalendarIfVisible: updateCalendarIfVisible
});

// #endregion Date Picker Event Delegation Registration / Component

module.exports = datePicker;

},{"../config":90,"../events":92,"../utils/active-element":99,"../utils/behavior":100,"../utils/is-ios-device":103,"../utils/select":104,"receptor":70}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dropdown = _interopRequireDefault(require("./dropdown"));
require("../polyfills/Function/prototype/bind");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Add functionality to sorting variant of Overflow menu component
 * @param {HTMLElement} container .overflow-menu element
 */
function DropdownSort(container) {
  this.container = container;
  this.button = container.getElementsByClassName('button-overflow-menu')[0];

  // if no value is selected, choose first option
  if (!this.container.querySelector('.overflow-list li button[aria-current="true"]')) {
    this.container.querySelectorAll('.overflow-list li button')[0].setAttribute('aria-current', "true");
  }
  this.updateSelectedValue();
}

/**
 * Add click events on overflow menu and options in menu
 */
DropdownSort.prototype.init = function () {
  this.overflowMenu = new _dropdown["default"](this.button).init();
  var sortingOptions = this.container.querySelectorAll('.overflow-list li button');
  for (var s = 0; s < sortingOptions.length; s++) {
    var option = sortingOptions[s];
    option.addEventListener('click', this.onOptionClick.bind(this));
  }
};

/**
 * Update button text to selected value
 */
DropdownSort.prototype.updateSelectedValue = function () {
  var selectedItem = this.container.querySelector('.overflow-list li button[aria-current="true"]');
  this.container.getElementsByClassName('button-overflow-menu')[0].getElementsByClassName('selected-value')[0].innerText = selectedItem.innerText;
};

/**
 * Triggers when choosing option in menu
 * @param {PointerEvent} e
 */
DropdownSort.prototype.onOptionClick = function (e) {
  var li = e.target.parentNode;
  li.parentNode.querySelector('li button[aria-current="true"]').removeAttribute('aria-current');
  li.querySelectorAll('.overflow-list li button')[0].setAttribute('aria-current', 'true');
  var button = li.parentNode.parentNode.parentNode.getElementsByClassName('button-overflow-menu')[0];
  var eventSelected = new Event('fds.dropdown.selected');
  eventSelected.detail = this.target;
  button.dispatchEvent(eventSelected);
  this.updateSelectedValue();

  // hide menu
  var overflowMenu = new _dropdown["default"](button);
  overflowMenu.hide();
};
var _default = DropdownSort;
exports["default"] = _default;

},{"../polyfills/Function/prototype/bind":93,"./dropdown":79}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var breakpoints = require('../utils/breakpoints');
var BUTTON = '.button-overflow-menu';
var jsDropdownCollapseModifier = 'js-dropdown--responsive-collapse'; //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
var TARGET = 'data-js-target';

/**
 * Add functionality to overflow menu component
 * @param {HTMLButtonElement} buttonElement Overflow menu button
 */
function Dropdown(buttonElement) {
  this.buttonElement = buttonElement;
  this.targetEl = null;
  this.responsiveListCollapseEnabled = false;
  if (this.buttonElement === null || this.buttonElement === undefined) {
    throw new Error("Could not find button for overflow menu component.");
  }
  var targetAttr = this.buttonElement.getAttribute(TARGET);
  if (targetAttr === null || targetAttr === undefined) {
    throw new Error('Attribute could not be found on overflow menu component: ' + TARGET);
  }
  var targetEl = document.getElementById(targetAttr.replace('#', ''));
  if (targetEl === null || targetEl === undefined) {
    throw new Error('Panel for overflow menu component could not be found.');
  }
  this.targetEl = targetEl;
}

/**
 * Set click events
 */
Dropdown.prototype.init = function () {
  if (this.buttonElement !== null && this.buttonElement !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
    if (this.buttonElement.parentNode.classList.contains('overflow-menu--md-no-responsive') || this.buttonElement.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
      this.responsiveListCollapseEnabled = true;
    }

    //Clicked outside dropdown -> close it
    document.getElementsByTagName('body')[0].removeEventListener('click', outsideClose);
    document.getElementsByTagName('body')[0].addEventListener('click', outsideClose);
    //Clicked on dropdown open button --> toggle it
    this.buttonElement.removeEventListener('click', toggleDropdown);
    this.buttonElement.addEventListener('click', toggleDropdown);
    var $module = this;
    // set aria-hidden correctly for screenreaders (Tringuide responsive)
    if (this.responsiveListCollapseEnabled) {
      var element = this.buttonElement;
      if (window.IntersectionObserver) {
        // trigger event when button changes visibility
        var observer = new IntersectionObserver(function (entries) {
          // button is visible
          if (entries[0].intersectionRatio) {
            if (element.getAttribute('aria-expanded') === 'false') {
              $module.targetEl.setAttribute('aria-hidden', 'true');
            }
          } else {
            // button is not visible
            if ($module.targetEl.getAttribute('aria-hidden') === 'true') {
              $module.targetEl.setAttribute('aria-hidden', 'false');
            }
          }
        }, {
          root: document.body
        });
        observer.observe(element);
      } else {
        // IE: IntersectionObserver is not supported, so we listen for window resize and grid breakpoint instead
        if (doResponsiveCollapse($module.triggerEl)) {
          // small screen
          if (element.getAttribute('aria-expanded') === 'false') {
            $module.targetEl.setAttribute('aria-hidden', 'true');
          } else {
            $module.targetEl.setAttribute('aria-hidden', 'false');
          }
        } else {
          // Large screen
          $module.targetEl.setAttribute('aria-hidden', 'false');
        }
        window.addEventListener('resize', function () {
          if (doResponsiveCollapse($module.triggerEl)) {
            if (element.getAttribute('aria-expanded') === 'false') {
              $module.targetEl.setAttribute('aria-hidden', 'true');
            } else {
              $module.targetEl.setAttribute('aria-hidden', 'false');
            }
          } else {
            $module.targetEl.setAttribute('aria-hidden', 'false');
          }
        });
      }
    }
    document.removeEventListener('keyup', closeOnEscape);
    document.addEventListener('keyup', closeOnEscape);
  }
};

/**
 * Hide overflow menu
 */
Dropdown.prototype.hide = function () {
  toggle(this.buttonElement);
};

/**
 * Show overflow menu
 */
Dropdown.prototype.show = function () {
  toggle(this.buttonElement);
};
var closeOnEscape = function closeOnEscape(event) {
  var key = event.which || event.keyCode;
  if (key === 27) {
    closeAll(event);
  }
};

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param parent accordion element
 * @returns {NodeListOf<SVGElementTagNameMap[[string]]> | NodeListOf<HTMLElementTagNameMap[[string]]> | NodeListOf<Element>}
 */
var getButtons = function getButtons(parent) {
  return parent.querySelectorAll(BUTTON);
};

/**
 * Close all overflow menus
 * @param {event} event default is null
 */
var closeAll = function closeAll() {
  var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var changed = false;
  var body = document.querySelector('body');
  var overflowMenuEl = document.getElementsByClassName('overflow-menu');
  for (var oi = 0; oi < overflowMenuEl.length; oi++) {
    var currentOverflowMenuEL = overflowMenuEl[oi];
    var triggerEl = currentOverflowMenuEL.querySelector(BUTTON + '[aria-expanded="true"]');
    if (triggerEl !== null) {
      changed = true;
      var targetEl = currentOverflowMenuEL.querySelector('#' + triggerEl.getAttribute(TARGET).replace('#', ''));
      if (targetEl !== null && triggerEl !== null) {
        if (doResponsiveCollapse(triggerEl)) {
          if (triggerEl.getAttribute('aria-expanded') === true) {
            var eventClose = new Event('fds.dropdown.close');
            triggerEl.dispatchEvent(eventClose);
          }
          triggerEl.setAttribute('aria-expanded', 'false');
          targetEl.classList.add('collapsed');
          targetEl.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }
  if (changed && event !== null) {
    event.stopImmediatePropagation();
  }
};
var offset = function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};
var toggleDropdown = function toggleDropdown(event) {
  var forceClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  event.stopPropagation();
  event.preventDefault();
  toggle(this, forceClose);
};
var toggle = function toggle(button) {
  var forceClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var triggerEl = button;
  var targetEl = null;
  if (triggerEl !== null && triggerEl !== undefined) {
    var targetAttr = triggerEl.getAttribute(TARGET);
    if (targetAttr !== null && targetAttr !== undefined) {
      targetEl = document.getElementById(targetAttr.replace('#', ''));
    }
  }
  if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
    //change state

    targetEl.style.left = null;
    targetEl.style.right = null;
    if (triggerEl.getAttribute('aria-expanded') === 'true' || forceClose) {
      //close
      triggerEl.setAttribute('aria-expanded', 'false');
      targetEl.classList.add('collapsed');
      targetEl.setAttribute('aria-hidden', 'true');
      var eventClose = new Event('fds.dropdown.close');
      triggerEl.dispatchEvent(eventClose);
    } else {
      if (!document.getElementsByTagName('body')[0].classList.contains('mobile_nav-active')) {
        closeAll();
      }
      //open
      triggerEl.setAttribute('aria-expanded', 'true');
      targetEl.classList.remove('collapsed');
      targetEl.setAttribute('aria-hidden', 'false');
      var eventOpen = new Event('fds.dropdown.open');
      triggerEl.dispatchEvent(eventOpen);
      var targetOffset = offset(targetEl);
      if (targetOffset.left < 0) {
        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      var right = targetOffset.left + targetEl.offsetWidth;
      if (right > window.innerWidth) {
        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }
      var offsetAgain = offset(targetEl);
      if (offsetAgain.left < 0) {
        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      right = offsetAgain.left + targetEl.offsetWidth;
      if (right > window.innerWidth) {
        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }
    }
  }
};
var hasParent = function hasParent(child, parentTagName) {
  if (child.parentNode.tagName === parentTagName) {
    return true;
  } else if (parentTagName !== 'BODY' && child.parentNode.tagName !== 'BODY') {
    return hasParent(child.parentNode, parentTagName);
  } else {
    return false;
  }
};
var outsideClose = function outsideClose(evt) {
  if (!document.getElementsByTagName('body')[0].classList.contains('mobile_nav-active')) {
    if (document.querySelector('body.mobile_nav-active') === null && !evt.target.classList.contains('button-menu-close')) {
      var openDropdowns = document.querySelectorAll(BUTTON + '[aria-expanded=true]');
      for (var i = 0; i < openDropdowns.length; i++) {
        var triggerEl = openDropdowns[i];
        var targetEl = null;
        var targetAttr = triggerEl.getAttribute(TARGET);
        if (targetAttr !== null && targetAttr !== undefined) {
          if (targetAttr.indexOf('#') !== -1) {
            targetAttr = targetAttr.replace('#', '');
          }
          targetEl = document.getElementById(targetAttr);
        }
        if (doResponsiveCollapse(triggerEl) || hasParent(triggerEl, 'HEADER') && !evt.target.classList.contains('overlay')) {
          //closes dropdown when clicked outside
          if (evt.target !== triggerEl) {
            //clicked outside trigger, force close
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');
            targetEl.setAttribute('aria-hidden', 'true');
            var eventClose = new Event('fds.dropdown.close');
            triggerEl.dispatchEvent(eventClose);
          }
        }
      }
    }
  }
};
var doResponsiveCollapse = function doResponsiveCollapse(triggerEl) {
  if (!triggerEl.classList.contains(jsDropdownCollapseModifier)) {
    // not nav overflow menu
    if (triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive') || triggerEl.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
      // trinindikator overflow menu
      if (window.innerWidth <= getTringuideBreakpoint(triggerEl)) {
        // overflow menu på responsiv tringuide aktiveret
        return true;
      }
    } else {
      // normal overflow menu
      return true;
    }
  }
  return false;
};
var getTringuideBreakpoint = function getTringuideBreakpoint(button) {
  if (button.parentNode.classList.contains('overflow-menu--md-no-responsive')) {
    return breakpoints.md;
  }
  if (button.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
    return breakpoints.lg;
  }
};
var _default = Dropdown;
exports["default"] = _default;

},{"../utils/breakpoints":101}],80:[function(require,module,exports){
'use strict';

/**
 * Handle focus on input elements upon clicking link in error message
 * @param {HTMLElement} element Error summary element
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function ErrorSummary(element) {
  this.element = element;
}

/**
 * Set events on links in error summary
 */
ErrorSummary.prototype.init = function () {
  if (!this.element) {
    return;
  }
  this.element.focus();
  this.element.addEventListener('click', this.handleClick.bind(this));
};

/**
* Click event handler
*
* @param {MouseEvent} event - Click event
*/
ErrorSummary.prototype.handleClick = function (event) {
  var target = event.target;
  if (this.focusTarget(target)) {
    event.preventDefault();
  }
};

/**
 * Focus the target element
 *
 * By default, the browser will scroll the target into view. Because our labels
 * or legends appear above the input, this means the user will be presented with
 * an input without any context, as the label or legend will be off the top of
 * the screen.
 *
 * Manually handling the click event, scrolling the question into view and then
 * focussing the element solves this.
 *
 * This also results in the label and/or legend being announced correctly in
 * NVDA (as tested in 2018.3.2) - without this only the field type is announced
 * (e.g. "Edit, has autocomplete").
 *
 * @param {HTMLElement} $target - Event target
 * @returns {boolean} True if the target was able to be focussed
 */
ErrorSummary.prototype.focusTarget = function ($target) {
  // If the element that was clicked was not a link, return early
  if ($target.tagName !== 'A' || $target.href === false) {
    return false;
  }
  var inputId = this.getFragmentFromUrl($target.href);
  var $input = document.getElementById(inputId);
  if (!$input) {
    return false;
  }
  var $legendOrLabel = this.getAssociatedLegendOrLabel($input);
  if (!$legendOrLabel) {
    return false;
  }

  // Scroll the legend or label into view *before* calling focus on the input to
  // avoid extra scrolling in browsers that don't support `preventScroll` (which
  // at time of writing is most of them...)
  $legendOrLabel.scrollIntoView();
  $input.focus({
    preventScroll: true
  });
  return true;
};

/**
 * Get fragment from URL
 *
 * Extract the fragment (everything after the hash) from a URL, but not including
 * the hash.
 *
 * @param {string} url - URL
 * @returns {string} Fragment from URL, without the hash
 */
ErrorSummary.prototype.getFragmentFromUrl = function (url) {
  if (url.indexOf('#') === -1) {
    return false;
  }
  return url.split('#').pop();
};

/**
 * Get associated legend or label
 *
 * Returns the first element that exists from this list:
 *
 * - The `<legend>` associated with the closest `<fieldset>` ancestor, as long
 *   as the top of it is no more than half a viewport height away from the
 *   bottom of the input
 * - The first `<label>` that is associated with the input using for="inputId"
 * - The closest parent `<label>`
 *
 * @param {HTMLElement} $input - The input
 * @returns {HTMLElement} Associated legend or label, or null if no associated
 *                        legend or label can be found
 */
ErrorSummary.prototype.getAssociatedLegendOrLabel = function ($input) {
  var $fieldset = $input.closest('fieldset');
  if ($fieldset) {
    var legends = $fieldset.getElementsByTagName('legend');
    if (legends.length) {
      var $candidateLegend = legends[0];

      // If the input type is radio or checkbox, always use the legend if there
      // is one.
      if ($input.type === 'checkbox' || $input.type === 'radio') {
        return $candidateLegend;
      }

      // For other input types, only scroll to the fieldset’s legend (instead of
      // the label associated with the input) if the input would end up in the
      // top half of the screen.
      //
      // This should avoid situations where the input either ends up off the
      // screen, or obscured by a software keyboard.
      var legendTop = $candidateLegend.getBoundingClientRect().top;
      var inputRect = $input.getBoundingClientRect();

      // If the browser doesn't support Element.getBoundingClientRect().height
      // or window.innerHeight (like IE8), bail and just link to the label.
      if (inputRect.height && window.innerHeight) {
        var inputBottom = inputRect.top + inputRect.height;
        if (inputBottom - legendTop < window.innerHeight / 2) {
          return $candidateLegend;
        }
      }
    }
  }
  return document.querySelector("label[for='" + $input.getAttribute('id') + "']") || $input.closest('label');
};
var _default = ErrorSummary;
exports["default"] = _default;

},{}],81:[function(require,module,exports){
'use strict';

/**
 * Adds click functionality to modal
 * @param {HTMLElement} $modal Modal element
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function Modal($modal) {
  this.$modal = $modal;
  var id = this.$modal.getAttribute('id');
  this.triggers = document.querySelectorAll('[data-module="modal"][data-target="' + id + '"]');
}

/**
 * Set events
 */
Modal.prototype.init = function () {
  var triggers = this.triggers;
  for (var i = 0; i < triggers.length; i++) {
    var trigger = triggers[i];
    trigger.addEventListener('click', this.show.bind(this));
  }
  var closers = this.$modal.querySelectorAll('[data-modal-close]');
  for (var c = 0; c < closers.length; c++) {
    var closer = closers[c];
    closer.addEventListener('click', this.hide.bind(this));
  }
};

/**
 * Hide modal
 */
Modal.prototype.hide = function () {
  var modalElement = this.$modal;
  if (modalElement !== null) {
    modalElement.setAttribute('aria-hidden', 'true');
    var eventClose = document.createEvent('Event');
    eventClose.initEvent('fds.modal.hidden', true, true);
    modalElement.dispatchEvent(eventClose);
    var $backdrop = document.querySelector('#modal-backdrop');
    $backdrop.parentNode.removeChild($backdrop);
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
    document.removeEventListener('keydown', trapFocus, true);
    if (!hasForcedAction(modalElement)) {
      document.removeEventListener('keyup', handleEscape);
    }
    var dataModalOpener = modalElement.getAttribute('data-modal-opener');
    if (dataModalOpener !== null) {
      var opener = document.getElementById(dataModalOpener);
      if (opener !== null) {
        opener.focus();
      }
      modalElement.removeAttribute('data-modal-opener');
    }
  }
};

/**
 * Show modal
 */
Modal.prototype.show = function () {
  var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var modalElement = this.$modal;
  if (modalElement !== null) {
    if (e !== null) {
      var openerId = e.target.getAttribute('id');
      if (openerId === null) {
        openerId = 'modal-opener-' + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        e.target.setAttribute('id', openerId);
      }
      modalElement.setAttribute('data-modal-opener', openerId);
    }

    // Hide open modals - FDS do not recommend more than one open modal at a time
    // @Brams - overriding this, no reason to not allow the developer to control it themselves.

    // let activeModals = document.querySelectorAll('.fds-modal[aria-hidden=false]');
    // for(let i = 0; i < activeModals.length; i++){
    //   new Modal(activeModals[i]).hide();
    // }

    modalElement.setAttribute('aria-hidden', 'false');
    modalElement.setAttribute('tabindex', '-1');
    var eventOpen = document.createEvent('Event');
    eventOpen.initEvent('fds.modal.shown', true, true);
    modalElement.dispatchEvent(eventOpen);
    var $backdrop = document.createElement('div');
    $backdrop.classList.add('modal-backdrop');
    $backdrop.setAttribute('id', "modal-backdrop");
    document.getElementsByTagName('body')[0].appendChild($backdrop);
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    modalElement.focus();
    document.addEventListener('keydown', trapFocus, true);
    if (!hasForcedAction(modalElement)) {
      document.addEventListener('keyup', handleEscape);
    }
  }
};

/**
 * Close modal when hitting ESC
 * @param {KeyboardEvent} event 
 */
var handleEscape = function handleEscape(event) {
  var key = event.which || event.keyCode;
  var modalElement = document.querySelector('.fds-modal[aria-hidden=false]');
  var currentModal = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));
  if (key === 27) {
    var possibleOverflowMenus = modalElement.querySelectorAll('.button-overflow-menu[aria-expanded="true"]');
    if (possibleOverflowMenus.length === 0) {
      currentModal.hide();
    }
  }
};

/**
 * Trap focus in modal when open
 * @param {PointerEvent} e
 */
function trapFocus(e) {
  var currentDialog = document.querySelector('.fds-modal[aria-hidden=false]');
  if (currentDialog !== null) {
    var focusableElements = currentDialog.querySelectorAll('a[href]:not([disabled]):not([aria-hidden=true]), button:not([disabled]):not([aria-hidden=true]), textarea:not([disabled]):not([aria-hidden=true]), input:not([type=hidden]):not([disabled]):not([aria-hidden=true]), select:not([disabled]):not([aria-hidden=true]), details:not([disabled]):not([aria-hidden=true]), [tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden=true])');
    var firstFocusableElement = focusableElements[0];
    var lastFocusableElement = focusableElements[focusableElements.length - 1];
    var isTabPressed = e.key === 'Tab' || e.keyCode === 9;
    if (!isTabPressed) {
      return;
    }
    if (e.shiftKey) /* shift + tab */{
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else /* tab */{
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
  }
}
;
function hasForcedAction(modal) {
  if (modal.getAttribute('data-modal-forced-action') === null) {
    return false;
  }
  return true;
}
var _default = Modal;
exports["default"] = _default;

},{}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var forEach = require('array-foreach');
var select = require('../utils/select');
var NAV = ".nav";
var NAV_LINKS = "".concat(NAV, " a");
var OPENERS = ".js-menu-open";
var CLOSE_BUTTON = ".js-menu-close";
var OVERLAY = ".overlay";
var CLOSERS = "".concat(CLOSE_BUTTON, ", .overlay");
var TOGGLES = [NAV, OVERLAY].join(', ');
var ACTIVE_CLASS = 'mobile_nav-active';
var VISIBLE_CLASS = 'is-visible';

/**
 * Add mobile menu functionality
 */
var Navigation = /*#__PURE__*/function () {
  function Navigation() {
    _classCallCheck(this, Navigation);
  }
  _createClass(Navigation, [{
    key: "init",
    value:
    /**
     * Set events
     */
    function init() {
      window.addEventListener('resize', mobileMenu, false);
      mobileMenu();
    }

    /**
     * Remove events
     */
  }, {
    key: "teardown",
    value: function teardown() {
      window.removeEventListener('resize', mobileMenu, false);
    }
  }]);
  return Navigation;
}();
/**
 * Add functionality to mobile menu
 */
var mobileMenu = function mobileMenu() {
  var mobile = false;
  var openers = document.querySelectorAll(OPENERS);
  for (var o = 0; o < openers.length; o++) {
    if (window.getComputedStyle(openers[o], null).display !== 'none') {
      openers[o].addEventListener('click', toggleNav);
      mobile = true;
    }
  }

  // if mobile
  if (mobile) {
    var closers = document.querySelectorAll(CLOSERS);
    for (var c = 0; c < closers.length; c++) {
      closers[c].addEventListener('click', toggleNav);
    }
    var navLinks = document.querySelectorAll(NAV_LINKS);
    for (var n = 0; n < navLinks.length; n++) {
      navLinks[n].addEventListener('click', function () {
        // A navigation link has been clicked! We want to collapse any
        // hierarchical navigation UI it's a part of, so that the user
        // can focus on whatever they've just selected.

        // Some navigation links are inside dropdowns; when they're
        // clicked, we want to collapse those dropdowns.

        // If the mobile navigation menu is active, we want to hide it.
        if (isActive()) {
          toggleNav.call(this, false);
        }
      });
    }
    var trapContainers = document.querySelectorAll(NAV);
    for (var i = 0; i < trapContainers.length; i++) {
      focusTrap = _focusTrap(trapContainers[i]);
    }
  }
  var closer = document.body.querySelector(CLOSE_BUTTON);
  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // The mobile nav is active, but the close box isn't visible, which
    // means the user's viewport has been resized so that it is no longer
    // in mobile mode. Let's make the page state consistent by
    // deactivating the mobile nav.
    toggleNav.call(closer, false);
  }
};

/**
 * Check if mobile menu is active
 * @returns true if mobile menu is active and false if not active
 */
var isActive = function isActive() {
  return document.body.classList.contains(ACTIVE_CLASS);
};

/**
 * Trap focus in mobile menu if active
 * @param {HTMLElement} trapContainer 
 */
var _focusTrap = function _focusTrap(trapContainer) {
  // Find all focusable children
  var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  var focusableElements = trapContainer.querySelectorAll(focusableElementsString);
  var firstTabStop = focusableElements[0];
  function trapTabKey(e) {
    var key = event.which || event.keyCode;
    // Check for TAB key press
    if (key === 9) {
      var lastTabStop = null;
      for (var i = 0; i < focusableElements.length; i++) {
        var number = focusableElements.length - 1;
        var element = focusableElements[number - i];
        if (element.offsetWidth > 0 && element.offsetHeight > 0) {
          lastTabStop = element;
          break;
        }
      }

      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }

        // TAB
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    // ESCAPE
    if (e.key === 'Escape') {
      toggleNav.call(this, false);
    }
  }
  return {
    enable: function enable() {
      // Focus first child
      firstTabStop.focus();
      // Listen for and trap the keyboard
      document.addEventListener('keydown', trapTabKey);
    },
    release: function release() {
      document.removeEventListener('keydown', trapTabKey);
    }
  };
};
var focusTrap;
var toggleNav = function toggleNav(active) {
  var body = document.body;
  if (typeof active !== 'boolean') {
    active = !isActive();
  }
  body.classList.toggle(ACTIVE_CLASS, active);
  forEach(select(TOGGLES), function (el) {
    el.classList.toggle(VISIBLE_CLASS, active);
  });
  if (active) {
    focusTrap.enable();
  } else {
    focusTrap.release();
  }
  var closeButton = body.querySelector(CLOSE_BUTTON);
  var menuButton = body.querySelector(OPENERS);
  if (active && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (!active && document.activeElement === closeButton && menuButton) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }
  return active;
};
var _default = Navigation;
exports["default"] = _default;

},{"../utils/select":104,"array-foreach":1}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var TOGGLE_ATTRIBUTE = 'data-controls';

/**
 * Adds click functionality to radiobutton collapse list
 * @param {HTMLElement} containerElement 
 */
function RadioToggleGroup(containerElement) {
  this.radioGroup = containerElement;
  this.radioEls = null;
  this.targetEl = null;
}

/**
 * Set events
 */
RadioToggleGroup.prototype.init = function () {
  this.radioEls = this.radioGroup.querySelectorAll('input[type="radio"]');
  if (this.radioEls.length === 0) {
    throw new Error('No radiobuttons found in radiobutton group.');
  }
  var that = this;
  for (var i = 0; i < this.radioEls.length; i++) {
    var radio = this.radioEls[i];
    radio.addEventListener('change', function () {
      for (var a = 0; a < that.radioEls.length; a++) {
        that.toggle(that.radioEls[a]);
      }
    });
    this.toggle(radio);
  }
};

/**
 * Toggle radiobutton content
 * @param {HTMLInputElement} radioInputElement 
 */
RadioToggleGroup.prototype.toggle = function (radioInputElement) {
  var contentId = radioInputElement.getAttribute(TOGGLE_ATTRIBUTE);
  if (contentId !== null && contentId !== undefined && contentId !== "") {
    var contentElement = document.querySelector(contentId);
    if (contentElement === null || contentElement === undefined) {
      throw new Error("Could not find panel element. Verify value of attribute " + TOGGLE_ATTRIBUTE);
    }
    if (radioInputElement.checked) {
      this.expand(radioInputElement, contentElement);
    } else {
      this.collapse(radioInputElement, contentElement);
    }
  }
};

/**
 * Expand radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */
RadioToggleGroup.prototype.expand = function (radioInputElement, contentElement) {
  if (radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined) {
    radioInputElement.setAttribute('data-expanded', 'true');
    contentElement.setAttribute('aria-hidden', 'false');
    var eventOpen = new Event('fds.radio.expanded');
    radioInputElement.dispatchEvent(eventOpen);
  }
};
/**
 * Collapse radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */
RadioToggleGroup.prototype.collapse = function (radioInputElement, contentElement) {
  if (radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined) {
    radioInputElement.setAttribute('data-expanded', 'false');
    contentElement.setAttribute('aria-hidden', 'true');
    var eventClose = new Event('fds.radio.collapsed');
    radioInputElement.dispatchEvent(eventClose);
  }
};
var _default = RadioToggleGroup;
exports["default"] = _default;

},{}],84:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var modifierState = {
  shift: false,
  alt: false,
  ctrl: false,
  command: false
};
/*
* Prevents the user from inputting based on a regex.
* Does not work the same way af <input pattern="">, this pattern is only used for validation, not to prevent input.
* Usecase: number input for date-component.
* Example - number only: <input type="text" data-input-regex="^\d*$">
*/
var InputRegexMask = /*#__PURE__*/_createClass(function InputRegexMask(element) {
  _classCallCheck(this, InputRegexMask);
  element.addEventListener('paste', regexMask);
  element.addEventListener('keydown', regexMask);
});
var regexMask = function regexMask(event) {
  if (modifierState.ctrl || modifierState.command) {
    return;
  }
  var newChar = null;
  if (typeof event.key !== 'undefined') {
    if (event.key.length === 1) {
      newChar = event.key;
    }
  } else {
    if (!event.charCode) {
      newChar = String.fromCharCode(event.keyCode);
    } else {
      newChar = String.fromCharCode(event.charCode);
    }
  }
  var regexStr = this.getAttribute('data-input-regex');
  if (event.type !== undefined && event.type === 'paste') {
    //console.log('paste');
  } else {
    var element = null;
    if (event.target !== undefined) {
      element = event.target;
    }
    if (newChar !== null && element !== null) {
      if (newChar.length > 0) {
        var newValue = this.value;
        if (element.type === 'number') {
          newValue = this.value; //Note input[type=number] does not have .selectionStart/End (Chrome).
        } else {
          newValue = this.value.slice(0, element.selectionStart) + this.value.slice(element.selectionEnd) + newChar; //removes the numbers selected by the user, then adds new char.
        }

        var r = new RegExp(regexStr);
        if (r.exec(newValue) === null) {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            event.returnValue = false;
          }
        }
      }
    }
  }
};
var _default = InputRegexMask;
exports["default"] = _default;

},{}],85:[function(require,module,exports){
'use strict';

/**
 * 
 * @param {HTMLTableElement} table Table Element
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function TableSelectableRows(table) {
  this.table = table;
}

/**
 * Initialize eventlisteners for checkboxes in table
 */
TableSelectableRows.prototype.init = function () {
  this.groupCheckbox = this.getGroupCheckbox();
  this.tbodyCheckboxList = this.getCheckboxList();
  if (this.tbodyCheckboxList.length !== 0) {
    for (var c = 0; c < this.tbodyCheckboxList.length; c++) {
      var checkbox = this.tbodyCheckboxList[c];
      checkbox.removeEventListener('change', updateGroupCheck);
      checkbox.addEventListener('change', updateGroupCheck);
    }
  }
  if (this.groupCheckbox !== false) {
    this.groupCheckbox.removeEventListener('change', updateCheckboxList);
    this.groupCheckbox.addEventListener('change', updateCheckboxList);
  }
};

/**
 * Get group checkbox in table header
 * @returns element on true - false if not found
 */
TableSelectableRows.prototype.getGroupCheckbox = function () {
  var checkbox = this.table.getElementsByTagName('thead')[0].getElementsByClassName('form-checkbox');
  if (checkbox.length === 0) {
    return false;
  }
  return checkbox[0];
};
/**
 * Get table body checkboxes
 * @returns HTMLCollection
 */
TableSelectableRows.prototype.getCheckboxList = function () {
  return this.table.getElementsByTagName('tbody')[0].getElementsByClassName('form-checkbox');
};

/**
 * Update checkboxes in table body when group checkbox is changed
 * @param {Event} e 
 */
function updateCheckboxList(e) {
  var checkbox = e.target;
  checkbox.removeAttribute('aria-checked');
  var table = e.target.parentNode.parentNode.parentNode.parentNode;
  var tableSelectableRows = new TableSelectableRows(table);
  var checkboxList = tableSelectableRows.getCheckboxList();
  var checkedNumber = 0;
  if (checkbox.checked) {
    for (var c = 0; c < checkboxList.length; c++) {
      checkboxList[c].checked = true;
      checkboxList[c].parentNode.parentNode.classList.add('table-row-selected');
    }
    checkedNumber = checkboxList.length;
  } else {
    for (var _c = 0; _c < checkboxList.length; _c++) {
      checkboxList[_c].checked = false;
      checkboxList[_c].parentNode.parentNode.classList.remove('table-row-selected');
    }
  }
  var event = new CustomEvent("fds.table.selectable.updated", {
    bubbles: true,
    cancelable: true,
    detail: {
      checkedNumber: checkedNumber
    }
  });
  table.dispatchEvent(event);
}

/**
 * Update group checkbox when checkbox in table body is changed
 * @param {Event} e 
 */
function updateGroupCheck(e) {
  // update label for event checkbox
  if (e.target.checked) {
    e.target.parentNode.parentNode.classList.add('table-row-selected');
  } else {
    e.target.parentNode.parentNode.classList.remove('table-row-selected');
  }
  var table = e.target.parentNode.parentNode.parentNode.parentNode;
  var tableSelectableRows = new TableSelectableRows(table);
  var groupCheckbox = tableSelectableRows.getGroupCheckbox();
  if (groupCheckbox !== false) {
    var checkboxList = tableSelectableRows.getCheckboxList();

    // how many row has been selected
    var checkedNumber = 0;
    for (var c = 0; c < checkboxList.length; c++) {
      var loopedCheckbox = checkboxList[c];
      if (loopedCheckbox.checked) {
        checkedNumber++;
      }
    }
    if (checkedNumber === checkboxList.length) {
      // if all rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = true;
    } else if (checkedNumber == 0) {
      // if no rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = false;
    } else {
      // if some but not all rows has been selected
      groupCheckbox.setAttribute('aria-checked', 'mixed');
      groupCheckbox.checked = false;
    }
    var event = new CustomEvent("fds.table.selectable.updated", {
      bubbles: true,
      cancelable: true,
      detail: {
        checkedNumber: checkedNumber
      }
    });
    table.dispatchEvent(event);
  }
}
var _default = TableSelectableRows;
exports["default"] = _default;

},{}],86:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var select = require('../utils/select');

/**
 * Set data-title on cells, where the attribute is missing
 */
var ResponsiveTable = /*#__PURE__*/_createClass(function ResponsiveTable(table) {
  _classCallCheck(this, ResponsiveTable);
  insertHeaderAsAttributes(table);
});
/**
 * Add data attributes needed for responsive mode.
 * @param {HTMLTableElement} tableEl Table element
 */
function insertHeaderAsAttributes(tableEl) {
  if (!tableEl) return;
  var header = tableEl.getElementsByTagName('thead');
  if (header.length !== 0) {
    var headerCellEls = header[0].getElementsByTagName('th');
    if (headerCellEls.length == 0) {
      headerCellEls = header[0].getElementsByTagName('td');
    }
    if (headerCellEls.length > 0) {
      var bodyRowEls = select('tbody tr', tableEl);
      Array.from(bodyRowEls).forEach(function (rowEl) {
        var cellEls = rowEl.children;
        if (cellEls.length === headerCellEls.length) {
          Array.from(headerCellEls).forEach(function (headerCellEl, i) {
            // Grab header cell text and use it body cell data title.
            if (!cellEls[i].hasAttribute('data-title') && headerCellEl.tagName === "TH" && !headerCellEl.classList.contains("sr-header")) {
              cellEls[i].setAttribute('data-title', headerCellEl.textContent);
            }
          });
        }
      });
    }
  }
}
var _default = ResponsiveTable;
exports["default"] = _default;

},{"../utils/select":104}],87:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};

// For easy reference
var keys = {
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  "delete": 46
};

// Add or substract depending on key pressed
var direction = {
  37: -1,
  38: -1,
  39: 1,
  40: 1
};

/**
 * Add functionality to tabnav component
 * @param {HTMLElement} tabnav Tabnav container
 */
function Tabnav(tabnav) {
  this.tabnav = tabnav;
  this.tabs = this.tabnav.querySelectorAll('button.tabnav-item');
}

/**
 * Set event on component
 */
Tabnav.prototype.init = function () {
  if (this.tabs.length === 0) {
    throw new Error("Tabnav HTML seems to be missing tabnav-item. Add tabnav items to ensure each panel has a button in the tabnavs navigation.");
  }

  // if no hash is set on load, set active tab
  if (!setActiveHashTab()) {
    // set first tab as active
    var tab = this.tabs[0];

    // check no other tabs as been set at default
    var alreadyActive = getActiveTabs(this.tabnav);
    if (alreadyActive.length === 0) {
      tab = alreadyActive[0];
    }

    // activate and deactivate tabs
    this.activateTab(tab, false);
  }
  var $module = this;
  // add eventlisteners on buttons
  for (var t = 0; t < this.tabs.length; t++) {
    this.tabs[t].addEventListener('click', function () {
      $module.activateTab(this, false);
    });
    this.tabs[t].addEventListener('keydown', keydownEventListener);
    this.tabs[t].addEventListener('keyup', keyupEventListener);
  }
};

/***
 * Show tab and hide others
 * @param {HTMLButtonElement} tab button element
 * @param {boolean} setFocus True if tab button should be focused
 */
Tabnav.prototype.activateTab = function (tab, setFocus) {
  var tabs = getAllTabsInList(tab);

  // close all tabs except selected
  for (var i = 0; i < this.tabs.length; i++) {
    if (tabs[i] === tab) {
      continue;
    }
    if (tabs[i].getAttribute('aria-selected') === 'true') {
      var eventClose = new Event('fds.tabnav.close');
      tabs[i].dispatchEvent(eventClose);
    }
    tabs[i].setAttribute('tabindex', '-1');
    tabs[i].setAttribute('aria-selected', 'false');
    var _tabpanelID = tabs[i].getAttribute('aria-controls');
    var _tabpanel = document.getElementById(_tabpanelID);
    if (_tabpanel === null) {
      throw new Error("Could not find tabpanel.");
    }
    _tabpanel.setAttribute('aria-hidden', 'true');
  }

  // Set selected tab to active
  var tabpanelID = tab.getAttribute('aria-controls');
  var tabpanel = document.getElementById(tabpanelID);
  if (tabpanel === null) {
    throw new Error("Could not find accordion panel.");
  }
  tab.setAttribute('aria-selected', 'true');
  tabpanel.setAttribute('aria-hidden', 'false');
  tab.removeAttribute('tabindex');

  // Set focus when required
  if (setFocus) {
    tab.focus();
  }
  var eventChanged = new Event('fds.tabnav.changed');
  tab.parentNode.dispatchEvent(eventChanged);
  var eventOpen = new Event('fds.tabnav.open');
  tab.dispatchEvent(eventOpen);
};

/**
 * Add keydown events to tabnav component
 * @param {KeyboardEvent} event 
 */
function keydownEventListener(event) {
  var key = event.keyCode;
  switch (key) {
    case keys.end:
      event.preventDefault();
      // Activate last tab
      focusLastTab(event.target);
      break;
    case keys.home:
      event.preventDefault();
      // Activate first tab
      focusFirstTab(event.target);
      break;
    // Up and down are in keydown
    // because we need to prevent page scroll >:)
    case keys.up:
    case keys.down:
      determineOrientation(event);
      break;
  }
}

/**
 * Add keyup events to tabnav component
 * @param {KeyboardEvent} event 
 */
function keyupEventListener(event) {
  var key = event.keyCode;
  switch (key) {
    case keys.left:
    case keys.right:
      determineOrientation(event);
      break;
    case keys["delete"]:
      break;
    case keys.enter:
    case keys.space:
      new Tabnav(event.target.parentNode).activateTab(event.target, true);
      break;
  }
}

/**
 * When a tablist aria-orientation is set to vertical,
 * only up and down arrow should function.
 * In all other cases only left and right arrow function.
 */
function determineOrientation(event) {
  var key = event.keyCode;
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;
  var vertical = x < breakpoints.md;
  var proceed = false;
  if (vertical) {
    if (key === keys.up || key === keys.down) {
      event.preventDefault();
      proceed = true;
    }
  } else {
    if (key === keys.left || key === keys.right) {
      proceed = true;
    }
  }
  if (proceed) {
    switchTabOnArrowPress(event);
  }
}

/**
 * Either focus the next, previous, first, or last tab
 * depending on key pressed
 */
function switchTabOnArrowPress(event) {
  var pressed = event.keyCode;
  if (direction[pressed]) {
    var target = event.target;
    var tabs = getAllTabsInList(target);
    var index = getIndexOfElementInList(target, tabs);
    if (index !== -1) {
      if (tabs[index + direction[pressed]]) {
        tabs[index + direction[pressed]].focus();
      } else if (pressed === keys.left || pressed === keys.up) {
        focusLastTab(target);
      } else if (pressed === keys.right || pressed == keys.down) {
        focusFirstTab(target);
      }
    }
  }
}

/**
 * Get all active tabs in list
 * @param tabnav parent .tabnav element
 * @returns returns list of active tabs if any
 */
function getActiveTabs(tabnav) {
  return tabnav.querySelectorAll('button.tabnav-item[aria-selected=true]');
}

/**
 * Get a list of all button tabs in current tablist
 * @param tab Button tab element
 * @returns {*} return array of tabs
 */
function getAllTabsInList(tab) {
  var parentNode = tab.parentNode;
  if (parentNode.classList.contains('tabnav')) {
    return parentNode.querySelectorAll('button.tabnav-item');
  }
  return [];
}

/**
 * Get index of element in list
 * @param {HTMLElement} element 
 * @param {HTMLCollection} list 
 * @returns {index}
 */
function getIndexOfElementInList(element, list) {
  var index = -1;
  for (var i = 0; i < list.length; i++) {
    if (list[i] === element) {
      index = i;
      break;
    }
  }
  return index;
}

/**
 * Checks if there is a tab hash in the url and activates the tab accordingly
 * @returns {boolean} returns true if tab has been set - returns false if no tab has been set to active
 */
function setActiveHashTab() {
  var hash = location.hash.replace('#', '');
  if (hash !== '') {
    var tab = document.querySelector('button.tabnav-item[aria-controls="#' + hash + '"]');
    if (tab !== null) {
      activateTab(tab, false);
      return true;
    }
  }
  return false;
}

/**
 * Get first tab by tab in list
 * @param {HTMLButtonElement} tab 
 */
function focusFirstTab(tab) {
  getAllTabsInList(tab)[0].focus();
}

/**
 * Get last tab by tab in list
 * @param {HTMLButtonElement} tab 
 */
function focusLastTab(tab) {
  var tabs = getAllTabsInList(tab);
  tabs[tabs.length - 1].focus();
}
var _default = Tabnav;
exports["default"] = _default;

},{}],88:[function(require,module,exports){
'use strict';

/**
 * Show/hide toast component
 * @param {HTMLElement} element 
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function Toast(element) {
  this.element = element;
}

/**
 * Show toast
 */
Toast.prototype.show = function () {
  this.element.classList.remove('hide');
  this.element.classList.add('showing');
  this.element.getElementsByClassName('toast-close')[0].addEventListener('click', function () {
    var toast = this.parentNode.parentNode;
    new Toast(toast).hide();
  });
  requestAnimationFrame(showToast);
};

/**
 * Hide toast
 */
Toast.prototype.hide = function () {
  this.element.classList.remove('show');
  this.element.classList.add('hide');
};

/**
 * Adds classes to make show animation
 */
function showToast() {
  var toasts = document.querySelectorAll('.toast.showing');
  for (var t = 0; t < toasts.length; t++) {
    var toast = toasts[t];
    toast.classList.remove('showing');
    toast.classList.add('show');
  }
}
var _default = Toast;
exports["default"] = _default;

},{}],89:[function(require,module,exports){
'use strict';

/**
 * Set tooltip on element
 * @param {HTMLElement} element Element which has tooltip
 */
function Tooltip(element) {
  this.element = element;
  if (this.element.getAttribute('data-tooltip') === null) {
    throw new Error("Tooltip text is missing. Add attribute data-tooltip and the content of the tooltip as value.");
  }
}

/**
 * Set eventlisteners
 */
Tooltip.prototype.init = function () {
  var module = this;
  this.element.addEventListener('mouseenter', function (e) {
    var trigger = e.target;
    if (trigger.classList.contains('tooltip-hover') === false && trigger.classList.contains('tooltip-focus') === false) {
      closeAllTooltips(e);
      trigger.classList.add("tooltip-hover");
      setTimeout(function () {
        if (trigger.classList.contains('tooltip-hover')) {
          var element = e.target;
          if (element.getAttribute('aria-describedby') !== null) return;
          addTooltip(element);
        }
      }, 300);
    }
  });
  this.element.addEventListener('mouseleave', function (e) {
    var trigger = e.target;
    if (trigger.classList.contains('tooltip-hover')) {
      trigger.classList.remove('tooltip-hover');
      var tooltipId = trigger.getAttribute('aria-describedby');
      var tooltipElement = document.getElementById(tooltipId);
      if (tooltipElement !== null) {
        closeHoverTooltip(trigger);
      }
    }
  });
  this.element.addEventListener('keyup', function (event) {
    var key = event.which || event.keyCode;
    if (key === 27) {
      var tooltip = this.getAttribute('aria-describedby');
      if (tooltip !== null && document.getElementById(tooltip) !== null) {
        document.body.removeChild(document.getElementById(tooltip));
      }
      this.classList.remove('active');
      this.removeAttribute('aria-describedby');
    }
  });
  if (this.element.getAttribute('data-tooltip-trigger') === 'click') {
    this.element.addEventListener('click', function (e) {
      var trigger = e.target;
      closeAllTooltips(e);
      trigger.classList.add('tooltip-focus');
      trigger.classList.remove('tooltip-hover');
      if (trigger.getAttribute('aria-describedby') !== null) return;
      addTooltip(trigger);
    });
  }
  document.getElementsByTagName('body')[0].removeEventListener('click', closeAllTooltips);
  document.getElementsByTagName('body')[0].addEventListener('click', closeAllTooltips);
};

/**
 * Close all tooltips
 */
function closeAll() {
  var elements = document.querySelectorAll('.js-tooltip[aria-describedby]');
  for (var i = 0; i < elements.length; i++) {
    var popper = elements[i].getAttribute('aria-describedby');
    elements[i].removeAttribute('aria-describedby');
    document.body.removeChild(document.getElementById(popper));
  }
}
function addTooltip(trigger) {
  var pos = trigger.getAttribute('data-tooltip-position') || 'top';
  var tooltip = createTooltip(trigger, pos);
  document.body.appendChild(tooltip);
  positionAt(trigger, tooltip, pos);
}

/**
 * Create tooltip element
 * @param {HTMLElement} element Element which the tooltip is attached
 * @param {string} pos Position of tooltip (top | bottom)
 * @returns 
 */
function createTooltip(element, pos) {
  var tooltip = document.createElement('div');
  tooltip.className = 'tooltip-popper';
  var poppers = document.getElementsByClassName('tooltip-popper');
  var id = 'tooltip-' + poppers.length + 1;
  tooltip.setAttribute('id', id);
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('x-placement', pos);
  element.setAttribute('aria-describedby', id);
  var tooltipInner = document.createElement('div');
  tooltipInner.className = 'tooltip';
  var tooltipArrow = document.createElement('div');
  tooltipArrow.className = 'tooltip-arrow';
  tooltipInner.appendChild(tooltipArrow);
  var tooltipContent = document.createElement('div');
  tooltipContent.className = 'tooltip-content';
  tooltipContent.innerHTML = element.getAttribute('data-tooltip');
  tooltipInner.appendChild(tooltipContent);
  tooltip.appendChild(tooltipInner);
  return tooltip;
}

/**
 * Positions the tooltip.
 *
 * @param {object} parent - The trigger of the tooltip.
 * @param {object} tooltip - The tooltip itself.
 * @param {string} posHorizontal - Desired horizontal position of the tooltip relatively to the trigger (left/center/right)
 * @param {string} posVertical - Desired vertical position of the tooltip relatively to the trigger (top/center/bottom)
 *
 */
function positionAt(parent, tooltip, pos) {
  var trigger = parent;
  var arrow = tooltip.getElementsByClassName('tooltip-arrow')[0];
  var triggerPosition = parent.getBoundingClientRect();
  var parentCoords = parent.getBoundingClientRect(),
    left,
    top;
  var tooltipWidth = tooltip.offsetWidth;
  var dist = 12;
  var arrowDirection = "down";
  left = parseInt(parentCoords.left) + (parent.offsetWidth - tooltip.offsetWidth) / 2;
  switch (pos) {
    case 'bottom':
      top = parseInt(parentCoords.bottom) + dist;
      arrowDirection = "up";
      break;
    default:
    case 'top':
      top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
  }

  // if tooltip is out of bounds on left side
  if (left < 0) {
    left = dist;
    var endPositionOnPage = triggerPosition.left + trigger.offsetWidth / 2;
    var tooltipArrowHalfWidth = 8;
    var arrowLeftPosition = endPositionOnPage - dist - tooltipArrowHalfWidth;
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.left = arrowLeftPosition + 'px';
  }

  // if tooltip is out of bounds on the bottom of the page
  if (top + tooltip.offsetHeight >= window.innerHeight) {
    top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
    arrowDirection = "down";
  }

  // if tooltip is out of bounds on the top of the page
  if (top < 0) {
    top = parseInt(parentCoords.bottom) + dist;
    arrowDirection = "up";
  }
  if (window.innerWidth < left + tooltipWidth) {
    tooltip.style.right = dist + 'px';
    var _endPositionOnPage = triggerPosition.right - trigger.offsetWidth / 2;
    var _tooltipArrowHalfWidth = 8;
    var arrowRightPosition = window.innerWidth - _endPositionOnPage - dist - _tooltipArrowHalfWidth;
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.right = arrowRightPosition + 'px';
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.left = 'auto';
  } else {
    tooltip.style.left = left + 'px';
  }
  tooltip.style.top = top + pageYOffset + 'px';
  tooltip.getElementsByClassName('tooltip-arrow')[0].classList.add(arrowDirection);
}
function closeAllTooltips(event) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (force || !event.target.classList.contains('js-tooltip') && !event.target.classList.contains('tooltip') && !event.target.classList.contains('tooltip-content')) {
    var elements = document.querySelectorAll('.tooltip-popper');
    for (var i = 0; i < elements.length; i++) {
      var trigger = document.querySelector('[aria-describedby=' + elements[i].getAttribute('id') + ']');
      trigger.removeAttribute('data-tooltip-active');
      trigger.removeAttribute('aria-describedby');
      trigger.classList.remove('tooltip-focus');
      trigger.classList.remove('tooltip-hover');
      document.body.removeChild(elements[i]);
    }
  }
}
function closeHoverTooltip(trigger) {
  var tooltipId = trigger.getAttribute('aria-describedby');
  var tooltipElement = document.getElementById(tooltipId);
  tooltipElement.removeEventListener('mouseenter', onTooltipHover);
  tooltipElement.addEventListener('mouseenter', onTooltipHover);
  setTimeout(function () {
    var tooltipElement = document.getElementById(tooltipId);
    if (tooltipElement !== null) {
      if (!trigger.classList.contains("tooltip-hover")) {
        removeTooltip(trigger);
      }
    }
  }, 300);
}
function onTooltipHover(e) {
  var tooltipElement = this;
  var trigger = document.querySelector('[aria-describedby=' + tooltipElement.getAttribute('id') + ']');
  trigger.classList.add('tooltip-hover');
  tooltipElement.addEventListener('mouseleave', function () {
    var trigger = document.querySelector('[aria-describedby=' + tooltipElement.getAttribute('id') + ']');
    if (trigger !== null) {
      trigger.classList.remove('tooltip-hover');
      closeHoverTooltip(trigger);
    }
  });
}
function removeTooltip(trigger) {
  var tooltipId = trigger.getAttribute('aria-describedby');
  var tooltipElement = document.getElementById(tooltipId);
  if (tooltipId !== null && tooltipElement !== null) {
    document.body.removeChild(tooltipElement);
  }
  trigger.removeAttribute('aria-describedby');
  trigger.classList.remove('tooltip-hover');
  trigger.classList.remove('tooltip-focus');
}
module.exports = Tooltip;

},{}],90:[function(require,module,exports){
"use strict";

module.exports = {
  prefix: ''
};

},{}],91:[function(require,module,exports){
'use strict';

var _accordion = _interopRequireDefault(require("./components/accordion"));
var _alert = _interopRequireDefault(require("./components/alert"));
var _backToTop = _interopRequireDefault(require("./components/back-to-top"));
var _characterLimit = _interopRequireDefault(require("./components/character-limit"));
var _checkboxToggleContent = _interopRequireDefault(require("./components/checkbox-toggle-content"));
var _dropdown = _interopRequireDefault(require("./components/dropdown"));
var _dropdownSort = _interopRequireDefault(require("./components/dropdown-sort"));
var _errorSummary = _interopRequireDefault(require("./components/error-summary"));
var _regexInputMask = _interopRequireDefault(require("./components/regex-input-mask"));
var _modal = _interopRequireDefault(require("./components/modal"));
var _navigation = _interopRequireDefault(require("./components/navigation"));
var _radioToggleContent = _interopRequireDefault(require("./components/radio-toggle-content"));
var _table = _interopRequireDefault(require("./components/table"));
var _tabnav = _interopRequireDefault(require("./components/tabnav"));
var _selectableTable = _interopRequireDefault(require("./components/selectable-table"));
var _toast = _interopRequireDefault(require("./components/toast"));
var _tooltip = _interopRequireDefault(require("./components/tooltip"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var datePicker = require('./components/date-picker');
/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

/**
 * Init all components
 * @param {JSON} options {scope: HTMLElement} - Init all components within scope (default is document)
 */
var init = function init(options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {};

  // Allow the user to initialise FDS in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document;

  /*
  ---------------------
  Accordions
  ---------------------
  */
  var jsSelectorAccordion = scope.getElementsByClassName('accordion');
  for (var c = 0; c < jsSelectorAccordion.length; c++) {
    new _accordion["default"](jsSelectorAccordion[c]).init();
  }
  var jsSelectorAccordionBordered = scope.querySelectorAll('.accordion-bordered:not(.accordion)');
  for (var _c = 0; _c < jsSelectorAccordionBordered.length; _c++) {
    new _accordion["default"](jsSelectorAccordionBordered[_c]).init();
  }

  /*
  ---------------------
  Alerts
  ---------------------
  */

  var alertsWithCloseButton = scope.querySelectorAll('.alert.has-close');
  for (var _c2 = 0; _c2 < alertsWithCloseButton.length; _c2++) {
    new _alert["default"](alertsWithCloseButton[_c2]).init();
  }

  /*
  ---------------------
  Back to top button
  ---------------------
  */

  var backToTopButtons = scope.getElementsByClassName('back-to-top-button');
  for (var _c3 = 0; _c3 < backToTopButtons.length; _c3++) {
    new _backToTop["default"](backToTopButtons[_c3]).init();
  }

  /*
  ---------------------
  Character limit
  ---------------------
  */
  var jsCharacterLimit = scope.getElementsByClassName('form-limit');
  for (var _c4 = 0; _c4 < jsCharacterLimit.length; _c4++) {
    new _characterLimit["default"](jsCharacterLimit[_c4]).init();
  }

  /*
  ---------------------
  Checkbox collapse
  ---------------------
  */
  var jsSelectorCheckboxCollapse = scope.getElementsByClassName('js-checkbox-toggle-content');
  for (var _c5 = 0; _c5 < jsSelectorCheckboxCollapse.length; _c5++) {
    new _checkboxToggleContent["default"](jsSelectorCheckboxCollapse[_c5]).init();
  }

  /*
  ---------------------
  Overflow menu
  ---------------------
  */
  var jsSelectorDropdown = scope.getElementsByClassName('js-dropdown');
  for (var _c6 = 0; _c6 < jsSelectorDropdown.length; _c6++) {
    new _dropdown["default"](jsSelectorDropdown[_c6]).init();
  }

  /*
  ---------------------
  Overflow menu sort
  ---------------------
  */
  var jsSelectorDropdownSort = scope.getElementsByClassName('overflow-menu--sort');
  for (var _c7 = 0; _c7 < jsSelectorDropdownSort.length; _c7++) {
    new _dropdownSort["default"](jsSelectorDropdownSort[_c7]).init();
  }

  /*
  ---------------------
  Datepicker
  ---------------------
  */
  datePicker.on(scope);

  /*
  ---------------------
  Error summary
  ---------------------
  */
  var $errorSummary = scope.querySelector('[data-module="error-summary"]');
  new _errorSummary["default"]($errorSummary).init();

  /*
  ---------------------
  Input Regex - used on date fields
  ---------------------
  */
  var jsSelectorRegex = scope.querySelectorAll('input[data-input-regex]');
  for (var _c8 = 0; _c8 < jsSelectorRegex.length; _c8++) {
    new _regexInputMask["default"](jsSelectorRegex[_c8]);
  }

  /*
  ---------------------
  Modal
  ---------------------
  */
  var modals = scope.querySelectorAll('.fds-modal');
  for (var d = 0; d < modals.length; d++) {
    new _modal["default"](modals[d]).init();
  }

  /*
  ---------------------
  Navigation
  ---------------------
  */
  new _navigation["default"]().init();

  /*
  ---------------------
  Radiobutton group collapse
  ---------------------
  */
  var jsSelectorRadioCollapse = scope.getElementsByClassName('js-radio-toggle-group');
  for (var _c9 = 0; _c9 < jsSelectorRadioCollapse.length; _c9++) {
    new _radioToggleContent["default"](jsSelectorRadioCollapse[_c9]).init();
  }

  /*
  ---------------------
  Responsive tables
  ---------------------
  */
  var jsSelectorTable = scope.querySelectorAll('table.table--responsive-headers, table.table-sm-responsive-headers, table.table-md-responsive-headers, table.table-lg-responsive-headers');
  for (var _c10 = 0; _c10 < jsSelectorTable.length; _c10++) {
    new _table["default"](jsSelectorTable[_c10]);
  }

  /*
  ---------------------
  Selectable rows in table
  ---------------------
  */
  var jsSelectableTable = scope.querySelectorAll('table.table--selectable');
  for (var _c11 = 0; _c11 < jsSelectableTable.length; _c11++) {
    new _selectableTable["default"](jsSelectableTable[_c11]).init();
  }

  /*
  ---------------------
  Tabnav
  ---------------------
  */
  var jsSelectorTabnav = scope.getElementsByClassName('tabnav');
  for (var _c12 = 0; _c12 < jsSelectorTabnav.length; _c12++) {
    new _tabnav["default"](jsSelectorTabnav[_c12]).init();
  }

  /*
  ---------------------
  Tooltip
  ---------------------
  */
  var jsSelectorTooltip = scope.getElementsByClassName('js-tooltip');
  for (var _c13 = 0; _c13 < jsSelectorTooltip.length; _c13++) {
    new _tooltip["default"](jsSelectorTooltip[_c13]).init();
  }
};
module.exports = {
  init: init,
  Accordion: _accordion["default"],
  Alert: _alert["default"],
  BackToTop: _backToTop["default"],
  CharacterLimit: _characterLimit["default"],
  CheckboxToggleContent: _checkboxToggleContent["default"],
  Dropdown: _dropdown["default"],
  DropdownSort: _dropdownSort["default"],
  datePicker: datePicker,
  ErrorSummary: _errorSummary["default"],
  InputRegexMask: _regexInputMask["default"],
  Modal: _modal["default"],
  Navigation: _navigation["default"],
  RadioToggleGroup: _radioToggleContent["default"],
  ResponsiveTable: _table["default"],
  TableSelectableRows: _selectableTable["default"],
  Tabnav: _tabnav["default"],
  Toast: _toast["default"],
  Tooltip: _tooltip["default"]
};

},{"./components/accordion":72,"./components/alert":73,"./components/back-to-top":74,"./components/character-limit":75,"./components/checkbox-toggle-content":76,"./components/date-picker":77,"./components/dropdown":79,"./components/dropdown-sort":78,"./components/error-summary":80,"./components/modal":81,"./components/navigation":82,"./components/radio-toggle-content":83,"./components/regex-input-mask":84,"./components/selectable-table":85,"./components/table":86,"./components/tabnav":87,"./components/toast":88,"./components/tooltip":89,"./polyfills":97}],92:[function(require,module,exports){
"use strict";

module.exports = {
  // This used to be conditionally dependent on whether the
  // browser supported touch events; if it did, `CLICK` was set to
  // `touchstart`.  However, this had downsides:
  //
  // * It pre-empted mobile browsers' default behavior of detecting
  //   whether a touch turned into a scroll, thereby preventing
  //   users from using some of our components as scroll surfaces.
  //
  // * Some devices, such as the Microsoft Surface Pro, support *both*
  //   touch and clicks. This meant the conditional effectively dropped
  //   support for the user's mouse, frustrating users who preferred
  //   it on those systems.
  CLICK: 'click'
};

},{}],93:[function(require,module,exports){
(function (global){(function (){
"use strict";

require("../../Object/defineProperty");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
(function (undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
  var detect = ('bind' in Function.prototype);
  if (detect) return;

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always
  Object.defineProperty(Function.prototype, 'bind', {
    value: function bind(that) {
      // .length is 1
      // add necessary es5-shim utilities
      var $Array = Array;
      var $Object = Object;
      var ObjectPrototype = $Object.prototype;
      var ArrayPrototype = $Array.prototype;
      var Empty = function Empty() {};
      var to_string = ObjectPrototype.toString;
      var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';
      var isCallable; /* inlined from https://npmjs.com/is-callable */
      var fnToStr = Function.prototype.toString,
        tryFunctionObject = function tryFunctionObject(value) {
          try {
            fnToStr.call(value);
            return true;
          } catch (e) {
            return false;
          }
        },
        fnClass = '[object Function]',
        genClass = '[object GeneratorFunction]';
      isCallable = function isCallable(value) {
        if (typeof value !== 'function') {
          return false;
        }
        if (hasToStringTag) {
          return tryFunctionObject(value);
        }
        var strClass = to_string.call(value);
        return strClass === fnClass || strClass === genClass;
      };
      var array_slice = ArrayPrototype.slice;
      var array_concat = ArrayPrototype.concat;
      var array_push = ArrayPrototype.push;
      var max = Math.max;
      // /add necessary es5-shim utilities

      // 1. Let Target be the this value.
      var target = this;
      // 2. If IsCallable(Target) is false, throw a TypeError exception.
      if (!isCallable(target)) {
        throw new TypeError('Function.prototype.bind called on incompatible ' + target);
      }
      // 3. Let A be a new (possibly empty) internal list of all of the
      //   argument values provided after thisArg (arg1, arg2 etc), in order.
      // XXX slicedArgs will stand in for "A" if used
      var args = array_slice.call(arguments, 1); // for normal call
      // 4. Let F be a new native ECMAScript object.
      // 11. Set the [[Prototype]] internal property of F to the standard
      //   built-in Function prototype object as specified in 15.3.3.1.
      // 12. Set the [[Call]] internal property of F as described in
      //   15.3.4.5.1.
      // 13. Set the [[Construct]] internal property of F as described in
      //   15.3.4.5.2.
      // 14. Set the [[HasInstance]] internal property of F as described in
      //   15.3.4.5.3.
      var bound;
      var binder = function binder() {
        if (this instanceof bound) {
          // 15.3.4.5.2 [[Construct]]
          // When the [[Construct]] internal method of a function object,
          // F that was created using the bind function is called with a
          // list of arguments ExtraArgs, the following steps are taken:
          // 1. Let target be the value of F's [[TargetFunction]]
          //   internal property.
          // 2. If target has no [[Construct]] internal method, a
          //   TypeError exception is thrown.
          // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
          //   property.
          // 4. Let args be a new list containing the same values as the
          //   list boundArgs in the same order followed by the same
          //   values as the list ExtraArgs in the same order.
          // 5. Return the result of calling the [[Construct]] internal
          //   method of target providing args as the arguments.

          var result = target.apply(this, array_concat.call(args, array_slice.call(arguments)));
          if ($Object(result) === result) {
            return result;
          }
          return this;
        } else {
          // 15.3.4.5.1 [[Call]]
          // When the [[Call]] internal method of a function object, F,
          // which was created using the bind function is called with a
          // this value and a list of arguments ExtraArgs, the following
          // steps are taken:
          // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
          //   property.
          // 2. Let boundThis be the value of F's [[BoundThis]] internal
          //   property.
          // 3. Let target be the value of F's [[TargetFunction]] internal
          //   property.
          // 4. Let args be a new list containing the same values as the
          //   list boundArgs in the same order followed by the same
          //   values as the list ExtraArgs in the same order.
          // 5. Return the result of calling the [[Call]] internal method
          //   of target providing boundThis as the this value and
          //   providing args as the arguments.

          // equiv: target.call(this, ...boundArgs, ...args)
          return target.apply(that, array_concat.call(args, array_slice.call(arguments)));
        }
      };

      // 15. If the [[Class]] internal property of Target is "Function", then
      //     a. Let L be the length property of Target minus the length of A.
      //     b. Set the length own property of F to either 0 or L, whichever is
      //       larger.
      // 16. Else set the length own property of F to 0.

      var boundLength = max(0, target.length - args.length);

      // 17. Set the attributes of the length own property of F to the values
      //   specified in 15.3.5.1.
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        array_push.call(boundArgs, '$' + i);
      }

      // XXX Build a dynamic function with desired amount of arguments is the only
      // way to set the length property of a function.
      // In environments where Content Security Policies enabled (Chrome extensions,
      // for ex.) all use of eval or Function costructor throws an exception.
      // However in all of these environments Function.prototype.bind exists
      // and so this code will never be executed.
      bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);
      if (target.prototype) {
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        // Clean up dangling references.
        Empty.prototype = null;
      }

      // TODO
      // 18. Set the [[Extensible]] internal property of F to true.

      // TODO
      // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
      // 20. Call the [[DefineOwnProperty]] internal method of F with
      //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
      //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
      //   false.
      // 21. Call the [[DefineOwnProperty]] internal method of F with
      //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
      //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
      //   and false.

      // TODO
      // NOTE Function objects created using Function.prototype.bind do not
      // have a prototype property or the [[Code]], [[FormalParameters]], and
      // [[Scope]] internal properties.
      // XXX can't delete prototype in pure-js.

      // 22. Return F.
      return bound;
    }
  });
}).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof global === "undefined" ? "undefined" : _typeof(global)) && global || {});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../Object/defineProperty":94}],94:[function(require,module,exports){
(function (global){(function (){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
(function (undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
  var detect =
  // In IE8, defineProperty could only act on DOM elements, so full support
  // for the feature requires the ability to set a property on an arbitrary object
  'defineProperty' in Object && function () {
    try {
      var a = {};
      Object.defineProperty(a, 'test', {
        value: 42
      });
      return true;
    } catch (e) {
      return false;
    }
  }();
  if (detect) return;

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
  (function (nativeDefineProperty) {
    var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
    var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
    var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';
    Object.defineProperty = function defineProperty(object, property, descriptor) {
      // Where native support exists, assume it
      if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
        return nativeDefineProperty(object, property, descriptor);
      }
      if (object === null || !(object instanceof Object || _typeof(object) === 'object')) {
        throw new TypeError('Object.defineProperty called on non-object');
      }
      if (!(descriptor instanceof Object)) {
        throw new TypeError('Property description must be an object');
      }
      var propertyString = String(property);
      var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
      var getterType = 'get' in descriptor && _typeof(descriptor.get);
      var setterType = 'set' in descriptor && _typeof(descriptor.set);

      // handle descriptor.get
      if (getterType) {
        if (getterType !== 'function') {
          throw new TypeError('Getter must be a function');
        }
        if (!supportsAccessors) {
          throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
        }
        if (hasValueOrWritable) {
          throw new TypeError(ERR_VALUE_ACCESSORS);
        }
        Object.__defineGetter__.call(object, propertyString, descriptor.get);
      } else {
        object[propertyString] = descriptor.value;
      }

      // handle descriptor.set
      if (setterType) {
        if (setterType !== 'function') {
          throw new TypeError('Setter must be a function');
        }
        if (!supportsAccessors) {
          throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
        }
        if (hasValueOrWritable) {
          throw new TypeError(ERR_VALUE_ACCESSORS);
        }
        Object.__defineSetter__.call(object, propertyString, descriptor.set);
      }

      // OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
      if ('value' in descriptor) {
        object[propertyString] = descriptor.value;
      }
      return object;
    };
  })(Object.defineProperty);
}).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof global === "undefined" ? "undefined" : _typeof(global)) && global || {});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],95:[function(require,module,exports){
"use strict";

/* eslint-disable consistent-return */
/* eslint-disable func-names */
(function () {
  if (typeof window.CustomEvent === "function") return false;
  function CustomEvent(event, _params) {
    var params = _params || {
      bubbles: false,
      cancelable: false,
      detail: null
    };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  window.CustomEvent = CustomEvent;
})();

},{}],96:[function(require,module,exports){
'use strict';

var elproto = window.HTMLElement.prototype;
var HIDDEN = 'hidden';
if (!(HIDDEN in elproto)) {
  Object.defineProperty(elproto, HIDDEN, {
    get: function get() {
      return this.hasAttribute(HIDDEN);
    },
    set: function set(value) {
      if (value) {
        this.setAttribute(HIDDEN, '');
      } else {
        this.removeAttribute(HIDDEN);
      }
    }
  });
}

},{}],97:[function(require,module,exports){
'use strict';

// polyfills HTMLElement.prototype.classList and DOMTokenList
require('classlist-polyfill');
// polyfills HTMLElement.prototype.hidden
require('./element-hidden');

// polyfills Number.isNaN()
require("./number-is-nan");

// polyfills CustomEvent
require("./custom-event");
require('core-js/fn/object/assign');
require('core-js/fn/array/from');

},{"./custom-event":95,"./element-hidden":96,"./number-is-nan":98,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],98:[function(require,module,exports){
"use strict";

Number.isNaN = Number.isNaN || function isNaN(input) {
  // eslint-disable-next-line no-self-compare
  return typeof input === "number" && input !== input;
};

},{}],99:[function(require,module,exports){
"use strict";

module.exports = function () {
  var htmlDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  return htmlDocument.activeElement;
};

},{}],100:[function(require,module,exports){
"use strict";

var assign = require("object-assign");
var receptor = require("receptor");

/**
 * @name sequence
 * @param {...Function} seq an array of functions
 * @return { closure } callHooks
 */
// We use a named function here because we want it to inherit its lexical scope
// from the behavior props object, not from the module
var sequence = function sequence() {
  for (var _len = arguments.length, seq = new Array(_len), _key = 0; _key < _len; _key++) {
    seq[_key] = arguments[_key];
  }
  return function callHooks() {
    var _this = this;
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    seq.forEach(function (method) {
      if (typeof _this[method] === "function") {
        _this[method].call(_this, target);
      }
    });
  };
};

/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = function (events, props) {
  return receptor.behavior(events, assign({
    on: sequence("init", "add"),
    off: sequence("teardown", "remove")
  }, props));
};

},{"object-assign":63,"receptor":70}],101:[function(require,module,exports){
'use strict';

var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};
module.exports = breakpoints;

},{}],102:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;
  var rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}
module.exports = isElementInViewport;

},{}],103:[function(require,module,exports){
"use strict";

// iOS detection from: http://stackoverflow.com/a/9039885/177710
function isIosDevice() {
  return typeof navigator !== "undefined" && (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
}
module.exports = isIosDevice;

},{}],104:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/**
 * @name isElement
 * @desc returns whether or not the given argument is a DOM element.
 * @param {any} value
 * @return {boolean}
 */
var isElement = function isElement(value) {
  return value && _typeof(value) === "object" && value.nodeType === 1;
};

/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {Document|HTMLElement?} context - The context to traverse the DOM
 *   in. If not provided, it defaults to the document.
 * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
 */
module.exports = function (selector, context) {
  if (typeof selector !== "string") {
    return [];
  }
  if (!context || !isElement(context)) {
    context = window.document; // eslint-disable-line no-param-reassign
  }

  var selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
};

},{}],105:[function(require,module,exports){
'use strict';

var EXPANDED = 'aria-expanded';
var CONTROLS = 'aria-controls';
var HIDDEN = 'aria-hidden';
module.exports = function (button, expanded) {
  if (typeof expanded !== 'boolean') {
    expanded = button.getAttribute(EXPANDED) === 'false';
  }
  button.setAttribute(EXPANDED, expanded);
  var id = button.getAttribute(CONTROLS);
  var controls = document.getElementById(id);
  if (!controls) {
    throw new Error('No toggle target found with id: "' + id + '"');
  }
  controls.setAttribute(HIDDEN, !expanded);
  return expanded;
};

},{}]},{},[91])(91)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2JlaGF2aW9yLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jb21wb3NlLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvZGVsZWdhdGVBbGwuanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2lnbm9yZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2tleW1hcC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FsZXJ0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYmFjay10by10b3AuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGFyYWN0ZXItbGltaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RhdGUtcGlja2VyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeS5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzay5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYm5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RvYXN0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvT2JqZWN0L2RlZmluZVByb3BlcnR5LmpzIiwic3JjL2pzL3BvbHlmaWxscy9jdXN0b20tZXZlbnQuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvbnVtYmVyLWlzLW5hbi5qcyIsInNyYy9qcy91dGlscy9hY3RpdmUtZWxlbWVudC5qcyIsInNyYy9qcy91dGlscy9iZWhhdmlvci5qcyIsInNyYy9qcy91dGlscy9icmVha3BvaW50cy5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9pcy1pb3MtZGV2aWNlLmpzIiwic3JjL2pzL3V0aWxzL3NlbGVjdC5qcyIsInNyYy9qcy91dGlscy90b2dnbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTs7QUFFWixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMs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Q0FBQyxHQUFHLFNBQVM7SUFDL0MsSUFBSSxPQUFPLEdBQUcsS0FBSyxLQUFLLFNBQVM7SUFDakMsSUFBSSxLQUFLLEdBQUcsQ0FBQztJQUNiLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDekIsSUFBSSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRO0lBQ2xDLElBQUksT0FBTyxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDdkU7SUFDQSxJQUFJLE1BQU0sSUFBSSxTQUFTLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO01BQy9ELEtBQUssUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN6RixjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDeEc7SUFDRixDQUFDLE1BQU07TUFDTCxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7TUFDM0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNwRCxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMs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QUFBLEVBQUEsR0FBQSxRQUFBLEdBQUEsWUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLElBQUE7QUFBQSxTQUFBLHNCQUFBLEdBQUEsRUFBQSxDQUFBLFFBQUEsRUFBQSxXQUFBLEdBQUEsZ0NBQUEsTUFBQSxJQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxLQUFBLEdBQUEsNEJBQUEsRUFBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsaUJBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsR0FBQSxJQUFBLFFBQUEsQ0FBQSxRQUFBLE1BQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxVQUFBLEVBQUEsdUJBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsR0FBQSxJQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsS0FBQSxHQUFBLElBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsaUJBQUEsR0FBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsR0FBQSx5QkFBQSxFQUFBLFlBQUEsRUFBQSxlQUFBLEVBQUEsR0FBQSxFQUFBLGNBQUEsTUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBLDJCQUFBLEVBQUEsUUFBQSxFQUFBLGFBQUEsSUFBQTtBQUFBLFNBQUEsZ0JBQUEsR0FBQSxRQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxVQUFBLEdBQUE7QUFDaEMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDO0FBQzdDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztBQUN6QyxJQUFBLFFBQUEsR0FBMkIsT0FBTyxDQUFDLFdBQVcsQ0FBQztFQUEvQixNQUFNLEdBQUEsUUFBQSxDQUFkLE1BQU07QUFDZCxJQUFBLFNBQUEsR0FBa0IsT0FBTyxDQUFDLFdBQVcsQ0FBQztFQUE5QixLQUFLLEdBQUEsU0FBQSxDQUFMLEtBQUs7QUFDYixJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUM7QUFDeEQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDO0FBRXJELElBQU0saUJBQWlCLGdCQUFnQjtBQUN2QyxJQUFNLHlCQUF5QixNQUFBLE1BQUEsQ0FBTSxpQkFBaUIsY0FBVztBQUNqRSxJQUFNLDZCQUE2QixNQUFBLE1BQUEsQ0FBTSxpQkFBaUIsa0JBQWU7QUFDekUsSUFBTSx3QkFBd0IsTUFBQSxNQUFBLENBQU0saUJBQWlCLGFBQVU7QUFDL0QsSUFBTSxnQ0FBZ0MsTUFBQSxNQUFBLENBQU0saUJBQWlCLHFCQUFrQjtBQUMvRSxJQUFNLGdDQUFnQyxNQUFBLE1BQUEsQ0FBTSxpQkFBaUIscUJBQWtCO0FBQy9FLElBQU0sd0JBQXdCLE1BQUEsTUFBQSxDQUFNLGlCQUFpQixhQUFVO0FBQy9ELElBQU0sMEJBQTBCLE1BQUEsTUFBQSxDQUFNLGlCQUFpQixlQUFZO0FBQ25FLElBQU0sd0JBQXdCLE1BQUEsTUFBQSxDQUFNLGlCQUFpQixhQUFVO0FBQy9ELElBQU0sdUJBQXVCLE1BQUEsTUFBQSxDQUFNLGlCQUFpQixZQUFTO0FBQzdELElBQU0sbUJBQW1CLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixXQUFRO0FBRWpFLElBQU0sb0JBQW9CLG1CQUFtQjtBQUM3QyxJQUFNLDBCQUEwQixPQUFBLE1BQUEsQ0FBTyxvQkFBb0IsQ0FBRTtBQUU3RCxJQUFNLDJCQUEyQixNQUFBLE1BQUEsQ0FBTSxtQkFBbUIsY0FBVztBQUNyRSxJQUFNLDRCQUE0QixNQUFBLE1BQUEsQ0FBTSxtQkFBbUIsZUFBWTtBQUN2RSxJQUFNLGtDQUFrQyxNQUFBLE1BQUEsQ0FBTSxtQkFBbUIscUJBQWtCO0FBQ25GLElBQU0saUNBQWlDLE1BQUEsTUFBQSxDQUFNLG1CQUFtQixvQkFBaUI7QUFDakYsSUFBTSw4QkFBOEIsTUFBQSxNQUFBLENBQU0sbUJBQW1CLGlCQUFjO0FBQzNFLElBQU0sOEJBQThCLE1BQUEsTUFBQSxDQUFNLG1CQUFtQixpQkFBYztBQUMzRSxJQUFNLHlCQUF5QixNQUFBLE1BQUEsQ0FBTSxtQkFBbUIsWUFBUztBQUNqRSxJQUFNLG9DQUFvQyxNQUFBLE1BQUEsQ0FBTSxtQkFBbUIsdUJBQW9CO0FBQ3ZGLElBQU0sa0NBQWtDLE1BQUEsTUFBQSxDQUFNLG1CQUFtQixxQkFBa0I7QUFDbkYsSUFBTSxnQ0FBZ0MsTUFBQSxNQUFBLENBQU0sbUJBQW1CLG1CQUFnQjtBQUMvRSxJQUFNLDRCQUE0QixNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsb0JBQWlCO0FBQ25GLElBQU0sNkJBQTZCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixxQkFBa0I7QUFDckYsSUFBTSx3QkFBd0IsTUFBQSxNQUFBLENBQU0sMEJBQTBCLGdCQUFhO0FBQzNFLElBQU0seUJBQXlCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixpQkFBYztBQUM3RSxJQUFNLDhCQUE4QixNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsc0JBQW1CO0FBQ3ZGLElBQU0sNkJBQTZCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixxQkFBa0I7QUFDckYsSUFBTSxvQkFBb0IsTUFBQSxNQUFBLENBQU0sMEJBQTBCLFlBQVM7QUFDbkUsSUFBTSw0QkFBNEIsTUFBQSxNQUFBLENBQU0sb0JBQW9CLGNBQVc7QUFDdkUsSUFBTSw2QkFBNkIsTUFBQSxNQUFBLENBQU0sb0JBQW9CLGVBQVk7QUFDekUsSUFBTSxtQkFBbUIsTUFBQSxNQUFBLENBQU0sMEJBQTBCLFdBQVE7QUFDakUsSUFBTSwyQkFBMkIsTUFBQSxNQUFBLENBQU0sbUJBQW1CLGNBQVc7QUFDckUsSUFBTSw0QkFBNEIsTUFBQSxNQUFBLENBQU0sbUJBQW1CLGVBQVk7QUFDdkUsSUFBTSxrQ0FBa0MsTUFBQSxNQUFBLENBQU0sMEJBQTBCLDBCQUF1QjtBQUMvRixJQUFNLDhCQUE4QixNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsc0JBQW1CO0FBQ3ZGLElBQU0sMEJBQTBCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixrQkFBZTtBQUMvRSxJQUFNLDJCQUEyQixNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsbUJBQWdCO0FBQ2pGLElBQU0sMEJBQTBCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixrQkFBZTtBQUMvRSxJQUFNLG9CQUFvQixNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsWUFBUztBQUNuRSxJQUFNLGtCQUFrQixNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsVUFBTztBQUMvRCxJQUFNLG1CQUFtQixNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsV0FBUTtBQUNqRSxJQUFNLGdDQUFnQyxNQUFBLE1BQUEsQ0FBTSxtQkFBbUIsbUJBQWdCO0FBQy9FLElBQU0sMEJBQTBCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixrQkFBZTtBQUMvRSxJQUFNLDBCQUEwQixNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsa0JBQWU7QUFFL0UsSUFBTSxXQUFXLE9BQUEsTUFBQSxDQUFPLGlCQUFpQixDQUFFO0FBQzNDLElBQU0sa0JBQWtCLE9BQUEsTUFBQSxDQUFPLHdCQUF3QixDQUFFO0FBQ3pELElBQU0sMEJBQTBCLE9BQUEsTUFBQSxDQUFPLGdDQUFnQyxDQUFFO0FBQ3pFLElBQU0sMEJBQTBCLE9BQUEsTUFBQSxDQUFPLGdDQUFnQyxDQUFFO0FBQ3pFLElBQU0sb0JBQW9CLE9BQUEsTUFBQSxDQUFPLDBCQUEwQixDQUFFO0FBQzdELElBQU0sa0JBQWtCLE9BQUEsTUFBQSxDQUFPLHdCQUF3QixDQUFFO0FBQ3pELElBQU0saUJBQWlCLE9BQUEsTUFBQSxDQUFPLHVCQUF1QixDQUFFO0FBQ3ZELElBQU0sYUFBYSxPQUFBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBRTtBQUMvQyxJQUFNLHFCQUFxQixPQUFBLE1BQUEsQ0FBTywyQkFBMkIsQ0FBRTtBQUMvRCxJQUFNLDJCQUEyQixPQUFBLE1BQUEsQ0FBTyxpQ0FBaUMsQ0FBRTtBQUMzRSxJQUFNLHNCQUFzQixPQUFBLE1BQUEsQ0FBTyw0QkFBNEIsQ0FBRTtBQUNqRSxJQUFNLHVCQUF1QixPQUFBLE1BQUEsQ0FBTyw2QkFBNkIsQ0FBRTtBQUNuRSxJQUFNLGtCQUFrQixPQUFBLE1BQUEsQ0FBTyx3QkFBd0IsQ0FBRTtBQUN6RCxJQUFNLG1CQUFtQixPQUFBLE1BQUEsQ0FBTyx5QkFBeUIsQ0FBRTtBQUMzRCxJQUFNLHVCQUF1QixPQUFBLE1BQUEsQ0FBTyw2QkFBNkIsQ0FBRTtBQUNuRSxJQUFNLHdCQUF3QixPQUFBLE1BQUEsQ0FBTyw4QkFBOEIsQ0FBRTtBQUNyRSxJQUFNLGNBQWMsT0FBQSxNQUFBLENBQU8sb0JBQW9CLENBQUU7QUFDakQsSUFBTSxhQUFhLE9BQUEsTUFBQSxDQUFPLG1CQUFtQixDQUFFO0FBQy9DLElBQU0sNEJBQTRCLE9BQUEsTUFBQSxDQUFPLGtDQUFrQyxDQUFFO0FBQzdFLElBQU0sd0JBQXdCLE9BQUEsTUFBQSxDQUFPLDhCQUE4QixDQUFFO0FBQ3JFLElBQU0sb0JBQW9CLE9BQUEsTUFBQSxDQUFPLDBCQUEwQixDQUFFO0FBQzdELElBQU0scUJBQXFCLE9BQUEsTUFBQSxDQUFPLDJCQUEyQixDQUFFO0FBQy9ELElBQU0sb0JBQW9CLE9BQUEsTUFBQSxDQUFPLDBCQUEwQixDQUFFO0FBQzdELElBQU0sc0JBQXNCLE9BQUEsTUFBQSxDQUFPLDRCQUE0QixDQUFFO0FBQ2pFLElBQU0scUJBQXFCLE9BQUEsTUFBQSxDQUFPLDJCQUEyQixDQUFFO0FBRS9ELElBQUksSUFBSSxHQUFHO0VBQ1QsZUFBZSxFQUFFLGNBQWM7RUFDL0IsZUFBZSxFQUFFLGNBQWM7RUFDL0IsdUJBQXVCLEVBQUUsNEZBQTRGO0VBQ3JILHNCQUFzQixFQUFFLHdFQUF3RTtFQUNoRyxxQkFBcUIsRUFBRSwrRUFBK0U7RUFDdEcsaUJBQWlCLEVBQUUsdUNBQXVDO0VBQzFELHlCQUF5QixFQUFFLGtDQUFrQztFQUM3RCxxQkFBcUIsRUFBRSxzQkFBc0I7RUFDN0Msb0JBQW9CLEVBQUUsc0JBQXNCO0VBQzVDLGVBQWUsRUFBRSx1QkFBdUI7RUFDeEMsZ0JBQWdCLEVBQUUsMEJBQTBCO0VBQzVDLFlBQVksRUFBRSx1QkFBdUI7RUFDckMsV0FBVyxFQUFFLG9CQUFvQjtFQUNqQyxjQUFjLEVBQUUsWUFBWTtFQUM1QixhQUFhLEVBQUUsU0FBUztFQUN4QixnQkFBZ0IsRUFBRSw0QkFBNEI7RUFDOUMsWUFBWSxFQUFFLHlCQUF5QjtFQUN2QyxPQUFPLEVBQUUsOFFBQThRO0VBQ3ZSLGtCQUFrQixFQUFFLGVBQWU7RUFDbkMsaUJBQWlCLEVBQUUseUNBQXlDO0VBQzVELFNBQVMsRUFBRSxRQUFRO0VBQ25CLFVBQVUsRUFBRSxTQUFTO0VBQ3JCLE9BQU8sRUFBRSxPQUFPO0VBQ2hCLE9BQU8sRUFBRSxPQUFPO0VBQ2hCLEtBQUssRUFBRSxLQUFLO0VBQ1osTUFBTSxFQUFFLE1BQU07RUFDZCxNQUFNLEVBQUUsTUFBTTtFQUNkLFFBQVEsRUFBRSxRQUFRO0VBQ2xCLFdBQVcsRUFBRSxXQUFXO0VBQ3hCLFNBQVMsRUFBRSxTQUFTO0VBQ3BCLFVBQVUsRUFBRSxVQUFVO0VBQ3RCLFVBQVUsRUFBRSxVQUFVO0VBQ3RCLFFBQVEsRUFBRSxRQUFRO0VBQ2xCLFNBQVMsRUFBRSxTQUFTO0VBQ3BCLFdBQVcsRUFBRSxRQUFRO0VBQ3JCLFVBQVUsRUFBRSxTQUFTO0VBQ3JCLFFBQVEsRUFBRSxRQUFRO0VBQ2xCLFVBQVUsRUFBRSxRQUFRO0VBQ3BCLFFBQVEsRUFBRTtBQUNaLENBQUM7QUFFRCxJQUFNLGtCQUFrQixHQUFHLGlDQUFpQztBQUU1RCxJQUFJLFlBQVksR0FBRyxDQUNqQixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLFNBQVMsRUFDZCxJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FDZDtBQUVELElBQUksa0JBQWtCLEdBQUcsQ0FDdkIsSUFBSSxDQUFDLE1BQU0sRUFDWCxJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FDWjtBQUVELElBQU0sYUFBYSxHQUFHLEVBQUU7QUFFeEIsSUFBTSxVQUFVLEdBQUcsRUFBRTtBQUVyQixJQUFNLGdCQUFnQixHQUFHLFlBQVk7QUFDckMsSUFBTSxvQkFBb0IsR0FBRyxZQUFZO0FBQ3pDLElBQU0sb0JBQW9CLEdBQUcsWUFBWTtBQUN6QyxJQUFNLG9CQUFvQixHQUFHLFlBQVk7QUFDekMsSUFBTSxvQkFBb0IsR0FBRyxZQUFZO0FBQ3pDLElBQU0sb0JBQW9CLEdBQUcsWUFBWTtBQUN6QyxJQUFNLG9CQUFvQixHQUFHLFlBQVk7QUFFekMsSUFBTSxxQkFBcUIsR0FBRyxrQkFBa0I7QUFFaEQsSUFBTSx5QkFBeUIsR0FBRyxTQUE1Qix5QkFBeUIsQ0FBQTtFQUFBLFNBQUEsSUFBQSxHQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQU8sU0FBUyxPQUFBLEtBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxNQUFBLElBQUEsR0FBQSxJQUFBLEVBQUEsSUFBQTtJQUFULFNBQVMsQ0FBQSxJQUFBLElBQUEsU0FBQSxDQUFBLElBQUE7RUFBQTtFQUFBLE9BQzdDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLO0lBQUEsT0FBSyxLQUFLLEdBQUcscUJBQXFCO0VBQUEsRUFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFBQTtBQUVwRSxJQUFNLHFCQUFxQixHQUFHLHlCQUF5QixDQUNyRCxzQkFBc0IsRUFDdEIsdUJBQXVCLEVBQ3ZCLHVCQUF1QixFQUN2Qix3QkFBd0IsRUFDeEIsa0JBQWtCLEVBQ2xCLG1CQUFtQixFQUNuQixxQkFDRixDQUFDO0FBRUQsSUFBTSxzQkFBc0IsR0FBRyx5QkFBeUIsQ0FDdEQsc0JBQ0YsQ0FBQztBQUVELElBQU0scUJBQXFCLEdBQUcseUJBQXlCLENBQ3JELDRCQUE0QixFQUM1Qix3QkFBd0IsRUFDeEIscUJBQ0YsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sbUJBQW1CLEdBQUcsU0FBdEIsbUJBQW1CLENBQUksV0FBVyxFQUFFLEtBQUssRUFBSztFQUNsRCxJQUFJLEtBQUssS0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtJQUNwQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUN4QjtFQUVBLE9BQU8sV0FBVztBQUNwQixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBSztFQUNyQyxJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDM0IsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQztFQUN0QyxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxLQUFLLEdBQUcsU0FBUixLQUFLLENBQUEsRUFBUztFQUNsQixJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDO0VBQzFCLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUM3QixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDaEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQ2xDLE9BQU8sT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDO0FBQ2xDLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksSUFBSSxFQUFLO0VBQzdCLElBQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztFQUMzQixPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUMzRCxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLENBQUksSUFBSSxFQUFLO0VBQy9CLElBQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztFQUMzQixPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDL0QsT0FBTyxPQUFPO0FBQ2hCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxLQUFLLEVBQUUsT0FBTyxFQUFLO0VBQ2xDLElBQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ3pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0VBQzVDLE9BQU8sT0FBTztBQUNoQixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksS0FBSyxFQUFFLE9BQU87RUFBQSxPQUFLLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFBQTs7QUFFNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxLQUFLLEVBQUUsUUFBUTtFQUFBLE9BQUssT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQUE7O0FBRWxFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksS0FBSyxFQUFFLFFBQVE7RUFBQSxPQUFLLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUM7QUFBQTs7QUFFaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQUksS0FBSyxFQUFLO0VBQzdCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFDLENBQUM7RUFDaEMsSUFBRyxTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUM7SUFDbEIsU0FBUyxHQUFHLENBQUM7RUFDZjtFQUNBLE9BQU8sT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7QUFDbEMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLEtBQUssRUFBSztFQUMzQixJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDaEMsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUM7QUFDdEMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLEtBQUssRUFBRSxTQUFTLEVBQUs7RUFDdEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFFekMsSUFBTSxTQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxJQUFJLEVBQUU7RUFDNUQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7RUFDaEQsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztFQUV2QyxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLEtBQUssRUFBRSxTQUFTO0VBQUEsT0FBSyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDO0FBQUE7O0FBRXBFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksS0FBSyxFQUFFLFFBQVE7RUFBQSxPQUFLLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUFBOztBQUVyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFJLEtBQUssRUFBRSxRQUFRO0VBQUEsT0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDO0FBQUE7O0FBRWhFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksS0FBSyxFQUFFLEtBQUssRUFBSztFQUNqQyxJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUV6QyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztFQUN2QixtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO0VBRW5DLE9BQU8sT0FBTztBQUNoQixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksS0FBSyxFQUFFLElBQUksRUFBSztFQUMvQixJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUV6QyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDaEMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7RUFDekIsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztFQUVuQyxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLEtBQUssRUFBRSxLQUFLLEVBQUs7RUFDNUIsSUFBSSxPQUFPLEdBQUcsS0FBSztFQUVuQixJQUFJLEtBQUssR0FBRyxLQUFLLEVBQUU7SUFDakIsT0FBTyxHQUFHLEtBQUs7RUFDakI7RUFFQSxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBSSxLQUFLLEVBQUUsS0FBSyxFQUFLO0VBQzVCLElBQUksT0FBTyxHQUFHLEtBQUs7RUFFbkIsSUFBSSxLQUFLLEdBQUcsS0FBSyxFQUFFO0lBQ2pCLE9BQU8sR0FBRyxLQUFLO0VBQ2pCO0VBRUEsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUksS0FBSyxFQUFFLEtBQUssRUFBSztFQUNuQyxPQUFPLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3RFLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLFdBQVcsR0FBRyxTQUFkLFdBQVcsQ0FBSSxLQUFLLEVBQUUsS0FBSyxFQUFLO0VBQ3BDLE9BQU8sVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUUsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLEtBQUssRUFBRSxLQUFLLEVBQUs7RUFDbEMsT0FBTyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLHdCQUF3QixHQUFHLFNBQTNCLHdCQUF3QixDQUFJLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFLO0VBQzNELElBQUksT0FBTyxHQUFHLElBQUk7RUFFbEIsSUFBSSxJQUFJLEdBQUcsT0FBTyxFQUFFO0lBQ2xCLE9BQU8sR0FBRyxPQUFPO0VBQ25CLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxJQUFJLEdBQUcsT0FBTyxFQUFFO0lBQ3BDLE9BQU8sR0FBRyxPQUFPO0VBQ25CO0VBRUEsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFJLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTztFQUFBLE9BQ25ELElBQUksSUFBSSxPQUFPLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQztBQUFBOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSwyQkFBMkIsR0FBRyxTQUE5QiwyQkFBMkIsQ0FBSSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBSztFQUM5RCxPQUNFLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLElBQUssT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFRO0FBRS9FLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sMEJBQTBCLEdBQUcsU0FBN0IsMEJBQTBCLENBQUksSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUs7RUFDN0QsT0FDRSxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLE9BQU8sSUFDM0MsT0FBTyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBUTtBQUUxRCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQ25CLFVBQVUsRUFHUDtFQUFBLElBRkgsVUFBVSxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsb0JBQW9CO0VBQUEsSUFDakMsVUFBVSxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsS0FBSztFQUVsQixJQUFJLElBQUk7RUFDUixJQUFJLEtBQUs7RUFDVCxJQUFJLEdBQUc7RUFDUCxJQUFJLElBQUk7RUFDUixJQUFJLE1BQU07RUFFVixJQUFJLFVBQVUsRUFBRTtJQUNkLElBQUksUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPO0lBQzdCLElBQUksVUFBVSxLQUFLLG9CQUFvQixJQUFJLFVBQVUsS0FBSyxvQkFBb0IsSUFBSSxVQUFVLEtBQUssb0JBQW9CLElBQUksVUFBVSxLQUFLLG9CQUFvQixJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtNQUFBLElBQUEsaUJBQUEsR0FDckssVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7TUFBQSxJQUFBLGtCQUFBLEdBQUEsY0FBQSxDQUFBLGlCQUFBO01BQTNELE1BQU0sR0FBQSxrQkFBQTtNQUFFLFFBQVEsR0FBQSxrQkFBQTtNQUFFLE9BQU8sR0FBQSxrQkFBQTtJQUM1QixDQUFDLE1BQU07TUFBQSxJQUFBLGtCQUFBLEdBQ3lCLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO01BQUEsSUFBQSxrQkFBQSxHQUFBLGNBQUEsQ0FBQSxrQkFBQTtNQUFsRCxPQUFPLEdBQUEsa0JBQUE7TUFBRSxRQUFRLEdBQUEsa0JBQUE7TUFBRSxNQUFNLEdBQUEsa0JBQUE7SUFDNUI7SUFFQSxJQUFJLE9BQU8sRUFBRTtNQUNYLE1BQU0sR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztNQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN6QixJQUFJLEdBQUcsTUFBTTtRQUNiLElBQUksVUFBVSxFQUFFO1VBQ2QsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztVQUN4QixJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3RCLElBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekMsSUFBTSxlQUFlLEdBQ25CLFdBQVcsR0FBSSxXQUFXLEdBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBRyxFQUFFLEVBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUNwRCxJQUFJLEdBQUcsZUFBZSxHQUFHLE1BQU07VUFDakM7UUFDRjtNQUNGO0lBQ0Y7SUFFQSxJQUFJLFFBQVEsRUFBRTtNQUNaLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztNQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN6QixLQUFLLEdBQUcsTUFBTTtRQUNkLElBQUksVUFBVSxFQUFFO1VBQ2QsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztVQUMxQixLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDO1FBQzdCO01BQ0Y7SUFDRjtJQUVBLElBQUksS0FBSyxJQUFJLE1BQU0sSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO01BQ25DLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztNQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN6QixHQUFHLEdBQUcsTUFBTTtRQUNaLElBQUksVUFBVSxFQUFFO1VBQ2QsSUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztVQUMzRCxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO1VBQ3RCLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQztRQUN4QztNQUNGO0lBQ0Y7SUFFQSxJQUFJLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtNQUNoQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUN0QztFQUNGO0VBRUEsT0FBTyxJQUFJO0FBQ2IsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLElBQUksRUFBd0M7RUFBQSxJQUF0QyxVQUFVLEdBQUEsU0FBQSxDQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsTUFBRyxvQkFBb0I7RUFDekQsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksS0FBSyxFQUFFLE1BQU0sRUFBSztJQUNsQyxPQUFPLE9BQUEsTUFBQSxDQUFPLEtBQUssRUFBRyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDdEMsQ0FBQztFQUVELElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDakMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQzFCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUUvQixJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtJQUN2QyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0VBQzVFLENBQUMsTUFDSSxJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtJQUM1QyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0VBQzVFLENBQUMsTUFDSSxJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtJQUM1QyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0VBQzVFLENBQUMsTUFDSSxJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtJQUM1QyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0VBQzVFLENBQUMsTUFDSSxJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtJQUM1QyxJQUFJLFlBQVksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDbkUsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztFQUNwRDtFQUVBLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDNUUsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBSSxTQUFTLEVBQUUsT0FBTyxFQUFLO0VBQzdDLElBQU0sSUFBSSxHQUFHLEVBQUU7RUFDZixJQUFJLEdBQUcsR0FBRyxFQUFFO0VBRVosSUFBSSxDQUFDLEdBQUcsQ0FBQztFQUNULE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDM0IsR0FBRyxHQUFHLEVBQUU7SUFDUixPQUFPLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsT0FBTyxFQUFFO01BQ25ELEdBQUcsQ0FBQyxJQUFJLFFBQUEsTUFBQSxDQUFRLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBTyxDQUFDO01BQ3BDLENBQUMsSUFBSSxDQUFDO0lBQ1I7SUFDQSxJQUFJLENBQUMsSUFBSSxRQUFBLE1BQUEsQ0FBUSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFPLENBQUM7RUFDdkM7RUFFQSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ3RCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBa0IsQ0FBSSxFQUFFLEVBQWlCO0VBQUEsSUFBZixLQUFLLEdBQUEsU0FBQSxDQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsTUFBRyxFQUFFO0VBQ3hDLElBQU0sZUFBZSxHQUFHLEVBQUU7RUFDMUIsZUFBZSxDQUFDLEtBQUssR0FBRyxLQUFLO0VBRzdCLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQztFQUMvQixlQUFlLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztBQUN0QyxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sb0JBQW9CLEdBQUcsU0FBdkIsb0JBQW9CLENBQUksRUFBRSxFQUFLO0VBQ25DLElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO0VBRTVDLElBQUksQ0FBQyxZQUFZLEVBQUU7SUFDakIsTUFBTSxJQUFJLEtBQUssNkJBQUEsTUFBQSxDQUE2QixXQUFXLENBQUUsQ0FBQztFQUM1RDtFQUVBLElBQU0sZUFBZSxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQ2hELDBCQUNGLENBQUM7RUFDRCxJQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUNoRCwwQkFDRixDQUFDO0VBQ0QsSUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztFQUNuRSxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0VBQ2xFLElBQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUM7RUFDL0QsSUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztFQUM3RCxJQUFNLGdCQUFnQixHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO0VBQ2xFLElBQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUM7O0VBRXZFO0VBQ0EsSUFBSSxrQkFBa0IsR0FBRyxvQkFBb0I7RUFDN0MsSUFBSSxZQUFZLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7SUFDaEQsUUFBUSxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVU7TUFDckMsS0FBSyxvQkFBb0I7UUFDdkIsa0JBQWtCLEdBQUcsb0JBQW9CO1FBQ3pDO01BQ0YsS0FBSyxvQkFBb0I7UUFDdkIsa0JBQWtCLEdBQUcsb0JBQW9CO1FBQ3pDO01BQ0YsS0FBSyxvQkFBb0I7UUFDdkIsa0JBQWtCLEdBQUcsb0JBQW9CO1FBQ3pDO01BQ0YsS0FBSyxvQkFBb0I7UUFDdkIsa0JBQWtCLEdBQUcsb0JBQW9CO1FBQ3pDO01BQ0YsS0FBSyxvQkFBb0I7UUFDdkIsa0JBQWtCLEdBQUcsb0JBQW9CO0lBQzdDO0VBQ0Y7RUFDQSxJQUFNLGdCQUFnQixHQUFHLGtCQUFrQjtFQUUzQyxJQUFNLFNBQVMsR0FBRyxlQUFlLENBQy9CLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLGdCQUFnQixFQUNoQixJQUNGLENBQUM7RUFDRCxJQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztFQUUzRCxJQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7RUFDOUQsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0VBQzdELElBQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztFQUM3RCxJQUFNLFNBQVMsR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7RUFDakUsSUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO0VBRXJFLElBQUksT0FBTyxJQUFJLE9BQU8sSUFBSSxPQUFPLEdBQUcsT0FBTyxFQUFFO0lBQzNDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUM7RUFDOUQ7RUFFQSxPQUFPO0lBQ0wsWUFBWSxFQUFaLFlBQVk7SUFDWixPQUFPLEVBQVAsT0FBTztJQUNQLFdBQVcsRUFBWCxXQUFXO0lBQ1gsUUFBUSxFQUFSLFFBQVE7SUFDUixZQUFZLEVBQVosWUFBWTtJQUNaLE9BQU8sRUFBUCxPQUFPO0lBQ1AsZ0JBQWdCLEVBQWhCLGdCQUFnQjtJQUNoQixZQUFZLEVBQVosWUFBWTtJQUNaLFNBQVMsRUFBVCxTQUFTO0lBQ1QsZUFBZSxFQUFmLGVBQWU7SUFDZixlQUFlLEVBQWYsZUFBZTtJQUNmLFVBQVUsRUFBVixVQUFVO0lBQ1YsU0FBUyxFQUFULFNBQVM7SUFDVCxXQUFXLEVBQVgsV0FBVztJQUNYLFFBQVEsRUFBUixRQUFRO0lBQ1IsT0FBTyxFQUFQLE9BQU87SUFDUCxnQkFBZ0IsRUFBaEI7RUFDRixDQUFDO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksRUFBRSxFQUFLO0VBQ3RCLElBQUEscUJBQUEsR0FBeUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO0lBQXpELGVBQWUsR0FBQSxxQkFBQSxDQUFmLGVBQWU7SUFBRSxXQUFXLEdBQUEscUJBQUEsQ0FBWCxXQUFXO0VBRXBDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSTtFQUMzQixlQUFlLENBQUMsUUFBUSxHQUFHLElBQUk7QUFDakMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksRUFBRSxFQUFLO0VBQ3JCLElBQUEsc0JBQUEsR0FBeUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO0lBQXpELGVBQWUsR0FBQSxzQkFBQSxDQUFmLGVBQWU7SUFBRSxXQUFXLEdBQUEsc0JBQUEsQ0FBWCxXQUFXO0VBRXBDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsS0FBSztFQUM1QixlQUFlLENBQUMsUUFBUSxHQUFHLEtBQUs7QUFDbEMsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBa0IsQ0FBSSxFQUFFLEVBQUs7RUFDakMsSUFBQSxzQkFBQSxHQUE4QyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7SUFBOUQsZUFBZSxHQUFBLHNCQUFBLENBQWYsZUFBZTtJQUFFLE9BQU8sR0FBQSxzQkFBQSxDQUFQLE9BQU87SUFBRSxPQUFPLEdBQUEsc0JBQUEsQ0FBUCxPQUFPO0VBRXpDLElBQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxLQUFLO0VBQ3hDLElBQUksU0FBUyxHQUFHLEtBQUs7RUFFckIsSUFBSSxVQUFVLEVBQUU7SUFDZCxTQUFTLEdBQUcsSUFBSTtJQUVoQixJQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztJQUN0RCxJQUFBLG9CQUFBLEdBQTJCLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLEVBQUs7UUFDdEQsSUFBSSxLQUFLO1FBQ1QsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxHQUFHLE1BQU07UUFDekMsT0FBTyxLQUFLO01BQ2QsQ0FBQyxDQUFDO01BQUEscUJBQUEsR0FBQSxjQUFBLENBQUEsb0JBQUE7TUFMSyxHQUFHLEdBQUEscUJBQUE7TUFBRSxLQUFLLEdBQUEscUJBQUE7TUFBRSxJQUFJLEdBQUEscUJBQUE7SUFPdkIsSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7TUFDaEMsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQztNQUUvQyxJQUNFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLElBQ2xDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFDM0IsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUNoQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsSUFDL0IscUJBQXFCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFDbEQ7UUFDQSxTQUFTLEdBQUcsS0FBSztNQUNuQjtJQUNGO0VBQ0Y7RUFFQSxPQUFPLFNBQVM7QUFDbEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBSSxFQUFFLEVBQUs7RUFDaEMsSUFBQSxzQkFBQSxHQUE0QixvQkFBb0IsQ0FBQyxFQUFFLENBQUM7SUFBNUMsZUFBZSxHQUFBLHNCQUFBLENBQWYsZUFBZTtFQUN2QixJQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxlQUFlLENBQUM7RUFFckQsSUFBSSxTQUFTLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEVBQUU7SUFDbkQsZUFBZSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDO0VBQ3ZEO0VBRUEsSUFBSSxDQUFDLFNBQVMsSUFBSSxlQUFlLENBQUMsaUJBQWlCLEtBQUssa0JBQWtCLEVBQUU7SUFDMUUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQztFQUN2QztBQUNGLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sb0JBQW9CLEdBQUcsU0FBdkIsb0JBQW9CLENBQUksRUFBRSxFQUFLO0VBQ25DLElBQUEsc0JBQUEsR0FBdUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO0lBQXZELGVBQWUsR0FBQSxzQkFBQSxDQUFmLGVBQWU7SUFBRSxTQUFTLEdBQUEsc0JBQUEsQ0FBVCxTQUFTO0VBQ2xDLElBQUksUUFBUSxHQUFHLEVBQUU7RUFFakIsSUFBSSxTQUFTLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN4QyxRQUFRLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQztFQUNsQztFQUVBLElBQUksZUFBZSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7SUFDdEMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQztFQUMvQztBQUNGLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxFQUFFLEVBQUUsVUFBVSxFQUFLO0VBQzNDLElBQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUM7RUFFOUMsSUFBSSxVQUFVLEVBQUU7SUFFZCxJQUFBLHNCQUFBLEdBS0ksb0JBQW9CLENBQUMsRUFBRSxDQUFDO01BSjFCLFlBQVksR0FBQSxzQkFBQSxDQUFaLFlBQVk7TUFDWixlQUFlLEdBQUEsc0JBQUEsQ0FBZixlQUFlO01BQ2YsZUFBZSxHQUFBLHNCQUFBLENBQWYsZUFBZTtNQUNmLGdCQUFnQixHQUFBLHNCQUFBLENBQWhCLGdCQUFnQjtJQUdsQixJQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDO0lBRTlELGtCQUFrQixDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUM7SUFDL0Msa0JBQWtCLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQztJQUVsRCxpQkFBaUIsQ0FBQyxZQUFZLENBQUM7RUFDakM7QUFDRixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFJLEVBQUUsRUFBSztFQUNoQyxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztFQUM1QyxJQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVk7RUFFdEQsSUFBTSxlQUFlLEdBQUcsWUFBWSxDQUFDLGFBQWEsUUFBUSxDQUFDO0VBRTNELElBQUksQ0FBQyxlQUFlLEVBQUU7SUFDcEIsTUFBTSxJQUFJLEtBQUssSUFBQSxNQUFBLENBQUksV0FBVyw0QkFBeUIsQ0FBQztFQUMxRDtFQUVBLElBQU0sT0FBTyxHQUFHLGVBQWUsQ0FDN0IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksZUFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQ3BFLENBQUM7RUFDRCxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQ2xDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FDbkIsZ0JBQWdCO0VBRXBCLElBQU0sT0FBTyxHQUFHLGVBQWUsQ0FDN0IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksZUFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQ3BFLENBQUM7RUFDRCxJQUFJLE9BQU8sRUFBRTtJQUNYLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7RUFDcEQ7RUFFQSxJQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUNyRCxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQztFQUN4RCxlQUFlLENBQUMsUUFBUSxHQUFHLElBQUk7RUFFL0IsSUFBTSxlQUFlLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ25ELGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDO0VBQy9ELGVBQWUsQ0FBQyxJQUFJLEdBQUcsTUFBTTtFQUM3QixlQUFlLENBQUMsSUFBSSxHQUFHLEVBQUU7RUFFekIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWE7RUFDcEMsSUFBTSxVQUFVLEdBQUcsT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssRUFBRTtFQUMxRCxJQUFNLGdCQUFnQixHQUFJLE9BQU8sS0FBSyxTQUFTLElBQUksT0FBTyxLQUFLLEVBQUUsSUFBSSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUN0SSxJQUFNLFVBQVUsR0FBRyxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sS0FBSyxFQUFFO0VBRTFELElBQUksVUFBVSxJQUFJLENBQUMsZ0JBQWdCLElBQUksVUFBVSxFQUFFO0lBQ2pELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoQyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsSUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztJQUMxQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQzFDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxXQUFXLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQztFQUMxTyxDQUFDLE1BQ0ksSUFBSSxVQUFVLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLFVBQVUsRUFBRTtJQUN2RCxJQUFNLE9BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEMsSUFBTSxTQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLElBQU0sWUFBVyxHQUFHLFlBQVksQ0FBQyxTQUFRLENBQUM7SUFDMUMsSUFBTSxRQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JDLFdBQVcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLFlBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsUUFBTyxDQUFDO0VBQ3hJLENBQUMsTUFDSSxJQUFJLFVBQVUsRUFBRTtJQUNuQixJQUFNLE9BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEMsSUFBTSxTQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLElBQU0sWUFBVyxHQUFHLFlBQVksQ0FBQyxTQUFRLENBQUM7SUFDMUMsSUFBTSxRQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JDLFdBQVcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLFlBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsUUFBTyxDQUFDO0VBQ3pJO0VBRUEsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRO0VBRTdELGVBQWUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDO0VBQzVDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FDaEMsV0FBVyxFQUNYLG9DQUFBLE1BQUEsQ0FDa0Msd0JBQXdCLDZDQUFBLE1BQUEsQ0FBc0MsSUFBSSxDQUFDLGFBQWEseUNBQUEsTUFBQSxDQUNqRyxvQkFBb0IsMERBQUEsTUFBQSxDQUFpRCxXQUFXLDRCQUFBLE1BQUEsQ0FBdUIsT0FBTyx1REFBQSxNQUFBLENBQWdELDBCQUEwQiwyREFBQSxNQUFBLENBQ2hMLHdCQUF3Qiw2RUFBQSxNQUFBLENBQ3hCLHVCQUF1QixjQUFBLE1BQUEsQ0FBUyxPQUFPLGdCQUFBLE1BQUEsQ0FBWSxJQUFJLENBQUMsS0FBSyxZQUNyRixDQUFDLElBQUksQ0FBQyxFQUFFLENBQ1gsQ0FBQztFQUVELGVBQWUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQztFQUNuRCxlQUFlLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7RUFDOUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQzNCLFNBQVMsRUFDVCxnQ0FDRixDQUFDO0VBQ0QsZUFBZSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7RUFDckMsZUFBZSxDQUFDLFFBQVEsR0FBRyxLQUFLO0VBRWhDLFlBQVksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDO0VBQ3pDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDO0VBRXpELElBQUksWUFBWSxFQUFFO0lBQ2hCLGdCQUFnQixDQUFDLFlBQVksRUFBRSxZQUFZLENBQUM7RUFDOUM7RUFFQSxJQUFJLGVBQWUsQ0FBQyxRQUFRLEVBQUU7SUFDNUIsT0FBTyxDQUFDLFlBQVksQ0FBQztJQUNyQixlQUFlLENBQUMsUUFBUSxHQUFHLEtBQUs7RUFDbEM7RUFFQSxJQUFJLGVBQWUsQ0FBQyxLQUFLLEVBQUU7SUFDekIsaUJBQWlCLENBQUMsZUFBZSxDQUFDO0VBQ3BDO0FBQ0YsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBSSxFQUFFLEVBQUUsY0FBYyxFQUFLO0VBQzdDLElBQUEsc0JBQUEsR0FVSSxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7SUFUMUIsWUFBWSxHQUFBLHNCQUFBLENBQVosWUFBWTtJQUNaLFVBQVUsR0FBQSxzQkFBQSxDQUFWLFVBQVU7SUFDVixRQUFRLEdBQUEsc0JBQUEsQ0FBUixRQUFRO0lBQ1IsWUFBWSxHQUFBLHNCQUFBLENBQVosWUFBWTtJQUNaLE9BQU8sR0FBQSxzQkFBQSxDQUFQLE9BQU87SUFDUCxPQUFPLEdBQUEsc0JBQUEsQ0FBUCxPQUFPO0lBQ1AsU0FBUyxHQUFBLHNCQUFBLENBQVQsU0FBUztJQUNULFFBQVEsR0FBQSxzQkFBQSxDQUFSLFFBQVE7SUFDUixPQUFPLEdBQUEsc0JBQUEsQ0FBUCxPQUFPO0VBRVQsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUM7RUFDMUIsSUFBSSxhQUFhLEdBQUcsY0FBYyxJQUFJLFVBQVU7RUFFaEQsSUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsTUFBTTtFQUUzQyxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztFQUM3QyxJQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDN0MsSUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBRS9DLElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0VBQzdDLElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0VBRTdDLElBQU0sb0JBQW9CLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztFQUV0RCxJQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDO0VBQ2hELElBQU0sbUJBQW1CLEdBQUcsV0FBVyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUM7RUFDL0QsSUFBTSxtQkFBbUIsR0FBRyxXQUFXLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQztFQUUvRCxJQUFNLG1CQUFtQixHQUFHLFlBQVksSUFBSSxhQUFhO0VBQ3pELElBQU0sY0FBYyxHQUFHLFNBQVMsSUFBSSxHQUFHLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDO0VBQ3ZFLElBQU0sWUFBWSxHQUFHLFNBQVMsSUFBSSxHQUFHLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDO0VBRXJFLElBQU0sb0JBQW9CLEdBQUcsU0FBUyxJQUFJLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0VBQ3BFLElBQU0sa0JBQWtCLEdBQUcsU0FBUyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0VBRWhFLElBQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUM7RUFFN0MsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxZQUFZLEVBQUs7SUFDekMsSUFBTSxPQUFPLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQztJQUNyQyxJQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsSUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JDLElBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2QyxJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ3pDLElBQUksU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO01BQ3BCLFNBQVMsR0FBRyxDQUFDO0lBQ2Y7SUFFQSxJQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO0lBRTlDLElBQUksUUFBUSxHQUFHLElBQUk7SUFFbkIsSUFBTSxVQUFVLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUN6RSxJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztJQUV4RCxJQUFJLFdBQVcsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLEVBQUU7TUFDeEMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQztJQUNsRDtJQUVBLElBQUksV0FBVyxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsRUFBRTtNQUMxQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDO0lBQ2pEO0lBRUEsSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxFQUFFO01BQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUM7SUFDOUM7SUFFQSxJQUFJLFVBQVUsRUFBRTtNQUNkLE9BQU8sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUM7SUFDNUM7SUFFQSxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLEVBQUU7TUFDdkMsT0FBTyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztJQUN6QztJQUVBLElBQUksU0FBUyxFQUFFO01BQ2IsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxFQUFFO1FBQ3RDLE9BQU8sQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUM7TUFDOUM7TUFFQSxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLEVBQUU7UUFDM0MsT0FBTyxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQztNQUNwRDtNQUVBLElBQUksU0FBUyxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsRUFBRTtRQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDO01BQ2xEO01BRUEsSUFDRSxxQkFBcUIsQ0FDbkIsWUFBWSxFQUNaLG9CQUFvQixFQUNwQixrQkFDRixDQUFDLEVBQ0Q7UUFDQSxPQUFPLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDO01BQ2hEO0lBQ0Y7SUFFQSxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLEVBQUU7TUFDeEMsUUFBUSxHQUFHLEdBQUc7TUFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDO0lBQzNDO0lBRUEsSUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztJQUNwQyxJQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7SUFDNUMsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQztJQUVwSiwyREFBQSxNQUFBLENBRWMsUUFBUSx3QkFBQSxNQUFBLENBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsNEJBQUEsTUFBQSxDQUNkLEdBQUcsOEJBQUEsTUFBQSxDQUNELEtBQUssR0FBRyxDQUFDLDZCQUFBLE1BQUEsQ0FDVixJQUFJLDhCQUFBLE1BQUEsQ0FDSCxhQUFhLDZCQUFBLE1BQUEsQ0FDYixhQUFhLCtCQUFBLE1BQUEsQ0FDWCxVQUFVLEdBQUcsTUFBTSxHQUFHLE9BQU8sZ0JBQUEsTUFBQSxDQUMzQyxVQUFVLDZCQUEyQixFQUFFLGFBQUEsTUFBQSxDQUN4QyxHQUFHO0VBQ1IsQ0FBQztFQUNEO0VBQ0EsYUFBYSxHQUFHLFdBQVcsQ0FBQyxZQUFZLENBQUM7RUFFekMsSUFBTSxJQUFJLEdBQUcsRUFBRTtFQUVmLE9BQ0UsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLElBQ2hCLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLFlBQVksSUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUNyQjtJQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDMUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0VBQzNDO0VBQ0EsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7RUFFekMsSUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLG9CQUFvQjtFQUNoRCxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBQSxNQUFBLENBQU0sWUFBWSxDQUFDLFlBQVksT0FBSTtFQUN4RCxXQUFXLENBQUMsTUFBTSxHQUFHLEtBQUs7RUFDMUIsSUFBSSxPQUFPLG1DQUFBLE1BQUEsQ0FBZ0MsMEJBQTBCLDhCQUFBLE1BQUEsQ0FDbkQsa0JBQWtCLGdDQUFBLE1BQUEsQ0FDaEIsbUJBQW1CLE9BQUEsTUFBQSxDQUFJLGdDQUFnQyxnRkFBQSxNQUFBLENBR3hELDRCQUE0QixtQ0FBQSxNQUFBLENBQ3ZCLElBQUksQ0FBQyxhQUFhLHNCQUFBLE1BQUEsQ0FDOUIsbUJBQW1CLDZCQUEyQixFQUFFLHlFQUFBLE1BQUEsQ0FHeEMsbUJBQW1CLE9BQUEsTUFBQSxDQUFJLGdDQUFnQyxnRkFBQSxNQUFBLENBR3hELDZCQUE2QixtQ0FBQSxNQUFBLENBQ3hCLElBQUksQ0FBQyxjQUFjLHNCQUFBLE1BQUEsQ0FDL0IsbUJBQW1CLDZCQUEyQixFQUFFLHlFQUFBLE1BQUEsQ0FHeEMsbUJBQW1CLE9BQUEsTUFBQSxDQUFJLDBCQUEwQixnRkFBQSxNQUFBLENBR2xELDhCQUE4QixzQkFBQSxNQUFBLENBQWlCLFVBQVUsUUFBQSxNQUFBLENBQUssSUFBSSxDQUFDLFlBQVksc0JBQUEsTUFBQSxDQUN2RixVQUFVLHNGQUFBLE1BQUEsQ0FHRiw2QkFBNkIsc0JBQUEsTUFBQSxDQUFpQixXQUFXLFFBQUEsTUFBQSxDQUFLLElBQUksQ0FBQyxXQUFXLHNCQUFBLE1BQUEsQ0FDdEYsV0FBVyxzREFBQSxNQUFBLENBRUYsbUJBQW1CLE9BQUEsTUFBQSxDQUFJLGdDQUFnQyxnRkFBQSxNQUFBLENBR3hELHlCQUF5QixtQ0FBQSxNQUFBLENBQ3BCLElBQUksQ0FBQyxVQUFVLHNCQUFBLE1BQUEsQ0FDM0IsbUJBQW1CLDZCQUEyQixFQUFFLHlFQUFBLE1BQUEsQ0FHeEMsbUJBQW1CLE9BQUEsTUFBQSxDQUFJLGdDQUFnQyxnRkFBQSxNQUFBLENBR3hELHdCQUF3QixtQ0FBQSxNQUFBLENBQ25CLElBQUksQ0FBQyxTQUFTLHNCQUFBLE1BQUEsQ0FDMUIsbUJBQW1CLDZCQUEyQixFQUFFLHVGQUFBLE1BQUEsQ0FJeEMsb0JBQW9CLCtEQUUzQjtFQUNiLEtBQUksSUFBSSxDQUFDLElBQUksa0JBQWtCLEVBQUM7SUFDOUIsT0FBTyxtQkFBQSxNQUFBLENBQWtCLDBCQUEwQixvQ0FBQSxNQUFBLENBQTZCLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxTQUFBLE1BQUEsQ0FBSyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQU87RUFDbEo7RUFDQSxPQUFPLDJEQUFBLE1BQUEsQ0FHRyxTQUFTLG1EQUdWO0VBQ1QsV0FBVyxDQUFDLFNBQVMsR0FBRyxPQUFPO0VBQy9CLFVBQVUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUM7RUFFM0QsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUM7RUFDcEQsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtJQUM1QixRQUFRLENBQUMsTUFBTSxHQUFHLEtBQUs7SUFDdkIsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO01BQ2xCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSztJQUN4QjtFQUNGO0VBRUEsSUFBTSxRQUFRLEdBQUcsRUFBRTtFQUVuQixJQUFJLGlCQUFpQixFQUFFO0lBQ3JCLFFBQVEsQ0FBQyxXQUFXLEdBQUcsRUFBRTtFQUMzQixDQUFDLE1BQ0ksSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRTtJQUN2RCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztFQUN6QyxDQUFDLE1BQ0ksSUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sS0FBSyxFQUFFLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUU7SUFDbEcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7RUFDeEMsQ0FBQyxNQUNJO0lBQ0gsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0VBQ3ZIO0VBRUEsUUFBUSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztFQUUxQyxPQUFPLFdBQVc7QUFDcEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsQ0FBSSxTQUFTLEVBQUs7RUFDekMsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFO0VBQ3hCLElBQUEsc0JBQUEsR0FBdUQsb0JBQW9CLENBQ3pFLFNBQ0YsQ0FBQztJQUZPLFVBQVUsR0FBQSxzQkFBQSxDQUFWLFVBQVU7SUFBRSxZQUFZLEdBQUEsc0JBQUEsQ0FBWixZQUFZO0lBQUUsT0FBTyxHQUFBLHNCQUFBLENBQVAsT0FBTztJQUFFLE9BQU8sR0FBQSxzQkFBQSxDQUFQLE9BQU87RUFHbEQsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7RUFDcEMsSUFBSSxHQUFHLHdCQUF3QixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0VBQ3ZELElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO0VBRXBELElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUM7RUFDbkUsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO0lBQ3hCLFdBQVcsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDO0VBQy9EO0VBQ0EsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sb0JBQW9CLEdBQUcsU0FBdkIsb0JBQW9CLENBQUksU0FBUyxFQUFLO0VBQzFDLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRTtFQUN4QixJQUFBLHNCQUFBLEdBQXVELG9CQUFvQixDQUN6RSxTQUNGLENBQUM7SUFGTyxVQUFVLEdBQUEsc0JBQUEsQ0FBVixVQUFVO0lBQUUsWUFBWSxHQUFBLHNCQUFBLENBQVosWUFBWTtJQUFFLE9BQU8sR0FBQSxzQkFBQSxDQUFQLE9BQU87SUFBRSxPQUFPLEdBQUEsc0JBQUEsQ0FBUCxPQUFPO0VBR2xELElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0VBQ3JDLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztFQUN2RCxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztFQUVwRCxJQUFJLFdBQVcsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDO0VBQ3BFLElBQUksV0FBVyxDQUFDLFFBQVEsRUFBRTtJQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztFQUMvRDtFQUNBLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFnQixDQUFJLFNBQVMsRUFBSztFQUN0QyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUU7RUFDeEIsSUFBQSx1QkFBQSxHQUF1RCxvQkFBb0IsQ0FDekUsU0FDRixDQUFDO0lBRk8sVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtJQUFFLFlBQVksR0FBQSx1QkFBQSxDQUFaLFlBQVk7SUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0lBQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztFQUdsRCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztFQUNyQyxJQUFJLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7RUFDdkQsSUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7RUFFcEQsSUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztFQUNoRSxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUU7SUFDeEIsV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUM7RUFDL0Q7RUFDQSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLFNBQVMsRUFBSztFQUNyQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUU7RUFDeEIsSUFBQSx1QkFBQSxHQUF1RCxvQkFBb0IsQ0FDekUsU0FDRixDQUFDO0lBRk8sVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtJQUFFLFlBQVksR0FBQSx1QkFBQSxDQUFaLFlBQVk7SUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0lBQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztFQUdsRCxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztFQUNwQyxJQUFJLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7RUFDdkQsSUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7RUFFcEQsSUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztFQUMvRCxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUU7SUFDeEIsV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUM7RUFDL0Q7RUFDQSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksRUFBRSxFQUFLO0VBQzNCLElBQUEsdUJBQUEsR0FBK0Msb0JBQW9CLENBQUMsRUFBRSxDQUFDO0lBQS9ELFlBQVksR0FBQSx1QkFBQSxDQUFaLFlBQVk7SUFBRSxVQUFVLEdBQUEsdUJBQUEsQ0FBVixVQUFVO0lBQUUsUUFBUSxHQUFBLHVCQUFBLENBQVIsUUFBUTtFQUUxQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQztFQUN2RCxVQUFVLENBQUMsTUFBTSxHQUFHLElBQUk7RUFDeEIsUUFBUSxDQUFDLFdBQVcsR0FBRyxFQUFFO0FBQzNCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLGNBQWMsRUFBSztFQUNyQyxJQUFJLGNBQWMsQ0FBQyxRQUFRLEVBQUU7RUFFN0IsSUFBQSx1QkFBQSxHQUE2RCxvQkFBb0IsQ0FDL0UsY0FDRixDQUFDO0lBRk8sWUFBWSxHQUFBLHVCQUFBLENBQVosWUFBWTtJQUFFLGVBQWUsR0FBQSx1QkFBQSxDQUFmLGVBQWU7SUFBRSxRQUFRLEdBQUEsdUJBQUEsQ0FBUixRQUFRO0lBQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztFQUd4RCxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7RUFDOUQsWUFBWSxDQUFDLFlBQVksQ0FBQztFQUMxQixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUk7RUFDdEIsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJO0VBRXJCLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLENBQUksRUFBRSxFQUFLO0VBQzdCLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtFQUNqQixJQUFBLHVCQUFBLEdBUUksb0JBQW9CLENBQUMsRUFBRSxDQUFDO0lBUDFCLFFBQVEsR0FBQSx1QkFBQSxDQUFSLFFBQVE7SUFDUixVQUFVLEdBQUEsdUJBQUEsQ0FBVixVQUFVO0lBQ1YsU0FBUyxHQUFBLHVCQUFBLENBQVQsU0FBUztJQUNULE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87SUFDUCxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0lBQ1AsV0FBVyxHQUFBLHVCQUFBLENBQVgsV0FBVztJQUNYLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87RUFHVCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7SUFDckIsSUFBTSxhQUFhLEdBQUcsd0JBQXdCLENBQzVDLFNBQVMsSUFBSSxXQUFXLElBQUksS0FBSyxDQUFDLENBQUMsRUFDbkMsT0FBTyxFQUNQLE9BQ0YsQ0FBQztJQUNELElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDO0lBQzdELFdBQVcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUMxRCxDQUFDLE1BQU07SUFDTCxZQUFZLENBQUMsRUFBRSxDQUFDO0lBQ2hCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSTtJQUN0QixPQUFPLENBQUMsTUFBTSxHQUFHLElBQUk7RUFDdkI7QUFDRixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLHVCQUF1QixHQUFHLFNBQTFCLHVCQUF1QixDQUFJLEVBQUUsRUFBSztFQUN0QyxJQUFBLHVCQUFBLEdBQW9ELG9CQUFvQixDQUFDLEVBQUUsQ0FBQztJQUFwRSxVQUFVLEdBQUEsdUJBQUEsQ0FBVixVQUFVO0lBQUUsU0FBUyxHQUFBLHVCQUFBLENBQVQsU0FBUztJQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87SUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0VBQy9DLElBQU0sYUFBYSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU07RUFFeEMsSUFBSSxhQUFhLElBQUksU0FBUyxFQUFFO0lBQzlCLElBQU0sYUFBYSxHQUFHLHdCQUF3QixDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0lBQzNFLGNBQWMsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDO0VBQzNDO0FBQ0YsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0scUJBQXFCLEdBQUcsU0FBeEIscUJBQXFCLENBQUksRUFBRSxFQUFFLGNBQWMsRUFBSztFQUNwRCxJQUFBLHVCQUFBLEdBTUksb0JBQW9CLENBQUMsRUFBRSxDQUFDO0lBTDFCLFVBQVUsR0FBQSx1QkFBQSxDQUFWLFVBQVU7SUFDVixRQUFRLEdBQUEsdUJBQUEsQ0FBUixRQUFRO0lBQ1IsWUFBWSxHQUFBLHVCQUFBLENBQVosWUFBWTtJQUNaLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87SUFDUCxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0VBR1QsSUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQzdDLElBQU0sWUFBWSxHQUFHLGNBQWMsSUFBSSxJQUFJLEdBQUcsYUFBYSxHQUFHLGNBQWM7RUFFNUUsSUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7SUFDaEQsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUM7SUFFbEQsSUFBTSxVQUFVLEdBQUcsMkJBQTJCLENBQzVDLFlBQVksRUFDWixPQUFPLEVBQ1AsT0FDRixDQUFDO0lBRUQsSUFBSSxRQUFRLEdBQUcsSUFBSTtJQUVuQixJQUFNLE9BQU8sR0FBRyxDQUFDLG9CQUFvQixDQUFDO0lBQ3RDLElBQU0sVUFBVSxHQUFHLEtBQUssS0FBSyxhQUFhO0lBRTFDLElBQUksS0FBSyxLQUFLLFlBQVksRUFBRTtNQUMxQixRQUFRLEdBQUcsR0FBRztNQUNkLE9BQU8sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUM7SUFDNUM7SUFFQSxJQUFJLFVBQVUsRUFBRTtNQUNkLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUM7SUFDN0M7SUFFQSxnRUFBQSxNQUFBLENBRWdCLFFBQVEsMEJBQUEsTUFBQSxDQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGdDQUFBLE1BQUEsQ0FDWixLQUFLLCtCQUFBLE1BQUEsQ0FDTCxLQUFLLGlDQUFBLE1BQUEsQ0FDSCxVQUFVLEdBQUcsTUFBTSxHQUFHLE9BQU8sa0JBQUEsTUFBQSxDQUMzQyxVQUFVLDZCQUEyQixFQUFFLGVBQUEsTUFBQSxDQUN4QyxLQUFLO0VBQ1osQ0FBQyxDQUFDO0VBRUYsSUFBTSxVQUFVLG1DQUFBLE1BQUEsQ0FBZ0MsMkJBQTJCLDhCQUFBLE1BQUEsQ0FDekQsb0JBQW9CLHdEQUFBLE1BQUEsQ0FFOUIsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsNkNBRzFCO0VBRVAsSUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsVUFBVTtFQUNsQyxVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDO0VBRTNELFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjtFQUU1QyxPQUFPLFdBQVc7QUFDcEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQUksT0FBTyxFQUFLO0VBQy9CLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtFQUN0QixJQUFBLHVCQUFBLEdBQXVELG9CQUFvQixDQUN6RSxPQUNGLENBQUM7SUFGTyxVQUFVLEdBQUEsdUJBQUEsQ0FBVixVQUFVO0lBQUUsWUFBWSxHQUFBLHVCQUFBLENBQVosWUFBWTtJQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87SUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0VBR2xELElBQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7RUFDekQsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7RUFDaEQsSUFBSSxHQUFHLHdCQUF3QixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0VBQ3ZELElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO0VBQ3BELFdBQVcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRCxDQUFDOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBb0IsQ0FBSSxFQUFFLEVBQUUsYUFBYSxFQUFLO0VBQ2xELElBQUEsdUJBQUEsR0FNSSxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7SUFMMUIsVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtJQUNWLFFBQVEsR0FBQSx1QkFBQSxDQUFSLFFBQVE7SUFDUixZQUFZLEdBQUEsdUJBQUEsQ0FBWixZQUFZO0lBQ1osT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztJQUNQLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87RUFHVCxJQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDL0MsSUFBTSxXQUFXLEdBQUcsYUFBYSxJQUFJLElBQUksR0FBRyxZQUFZLEdBQUcsYUFBYTtFQUV4RSxJQUFJLFdBQVcsR0FBRyxXQUFXO0VBQzdCLFdBQVcsSUFBSSxXQUFXLEdBQUcsVUFBVTtFQUN2QyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDO0VBRXRDLElBQU0scUJBQXFCLEdBQUcsMEJBQTBCLENBQ3RELE9BQU8sQ0FBQyxZQUFZLEVBQUUsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUN0QyxPQUFPLEVBQ1AsT0FDRixDQUFDO0VBRUQsSUFBTSxxQkFBcUIsR0FBRywwQkFBMEIsQ0FDdEQsT0FBTyxDQUFDLFlBQVksRUFBRSxXQUFXLEdBQUcsVUFBVSxDQUFDLEVBQy9DLE9BQU8sRUFDUCxPQUNGLENBQUM7RUFFRCxJQUFNLEtBQUssR0FBRyxFQUFFO0VBQ2hCLElBQUksU0FBUyxHQUFHLFdBQVc7RUFDM0IsT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLFVBQVUsRUFBRTtJQUNoQyxJQUFNLFVBQVUsR0FBRywwQkFBMEIsQ0FDM0MsT0FBTyxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsRUFDaEMsT0FBTyxFQUNQLE9BQ0YsQ0FBQztJQUVELElBQUksUUFBUSxHQUFHLElBQUk7SUFFbkIsSUFBTSxPQUFPLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQztJQUNyQyxJQUFNLFVBQVUsR0FBRyxTQUFTLEtBQUssWUFBWTtJQUU3QyxJQUFJLFNBQVMsS0FBSyxXQUFXLEVBQUU7TUFDN0IsUUFBUSxHQUFHLEdBQUc7TUFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDO0lBQzNDO0lBRUEsSUFBSSxVQUFVLEVBQUU7TUFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDO0lBQzVDO0lBRUEsS0FBSyxDQUFDLElBQUksMERBQUEsTUFBQSxDQUdNLFFBQVEsMEJBQUEsTUFBQSxDQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGdDQUFBLE1BQUEsQ0FDWixTQUFTLGlDQUFBLE1BQUEsQ0FDUCxVQUFVLEdBQUcsTUFBTSxHQUFHLE9BQU8sa0JBQUEsTUFBQSxDQUMzQyxVQUFVLDZCQUEyQixFQUFFLGVBQUEsTUFBQSxDQUN4QyxTQUFTLGNBQ2QsQ0FBQztJQUNELFNBQVMsSUFBSSxDQUFDO0VBQ2hCO0VBRUEsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7RUFDMUMsSUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDO0VBQ2pGLElBQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQztFQUN6RSxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQztFQUV6SCxJQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDMUMsV0FBVyxDQUFDLFNBQVMsbUNBQUEsTUFBQSxDQUFnQywwQkFBMEIsOEJBQUEsTUFBQSxDQUM3RCxvQkFBb0Isb0tBQUEsTUFBQSxDQU1mLGtDQUFrQyx3Q0FBQSxNQUFBLENBQzdCLHNCQUFzQiwwQkFBQSxNQUFBLENBQ2xDLHFCQUFxQiw2QkFBMkIsRUFBRSx3SEFBQSxNQUFBLENBSXRDLG9CQUFvQiw0RUFBQSxNQUFBLENBRTlCLFNBQVMsK0tBQUEsTUFBQSxDQU9KLDhCQUE4Qix3Q0FBQSxNQUFBLENBQ3pCLGtCQUFrQiwwQkFBQSxNQUFBLENBQzlCLHFCQUFxQiw2QkFBMkIsRUFBRSx1SEFNekQ7RUFDVCxVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDO0VBRTNELFFBQVEsQ0FBQyxXQUFXLEdBQUcsYUFBYTtFQUVwQyxPQUFPLFdBQVc7QUFDcEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSx3QkFBd0IsR0FBRyxTQUEzQix3QkFBd0IsQ0FBSSxFQUFFLEVBQUs7RUFDdkMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0VBRWpCLElBQUEsdUJBQUEsR0FBdUQsb0JBQW9CLENBQ3pFLEVBQ0YsQ0FBQztJQUZPLFVBQVUsR0FBQSx1QkFBQSxDQUFWLFVBQVU7SUFBRSxZQUFZLEdBQUEsdUJBQUEsQ0FBWixZQUFZO0lBQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztJQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87RUFHbEQsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztFQUM5RCxJQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7RUFFckQsSUFBSSxZQUFZLEdBQUcsWUFBWSxHQUFHLFVBQVU7RUFDNUMsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQztFQUV4QyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztFQUNoRCxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztFQUNuRSxJQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FDdEMsVUFBVSxFQUNWLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FDekIsQ0FBQztFQUVELElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsNEJBQTRCLENBQUM7RUFDekUsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO0lBQ3hCLFdBQVcsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDO0VBQy9EO0VBQ0EsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sb0JBQW9CLEdBQUcsU0FBdkIsb0JBQW9CLENBQUksRUFBRSxFQUFLO0VBQ25DLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtFQUVqQixJQUFBLHVCQUFBLEdBQXVELG9CQUFvQixDQUN6RSxFQUNGLENBQUM7SUFGTyxVQUFVLEdBQUEsdUJBQUEsQ0FBVixVQUFVO0lBQUUsWUFBWSxHQUFBLHVCQUFBLENBQVosWUFBWTtJQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87SUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0VBR2xELElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUM7RUFDOUQsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO0VBRXJELElBQUksWUFBWSxHQUFHLFlBQVksR0FBRyxVQUFVO0VBQzVDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUM7RUFFeEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUM7RUFDaEQsSUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7RUFDbkUsSUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQ3RDLFVBQVUsRUFDVixVQUFVLENBQUMsV0FBVyxDQUFDLENBQ3pCLENBQUM7RUFFRCxJQUFJLFdBQVcsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDO0VBQ3JFLElBQUksV0FBVyxDQUFDLFFBQVEsRUFBRTtJQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztFQUMvRDtFQUNBLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxNQUFNLEVBQUs7RUFDN0IsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO0VBQ3JCLElBQUEsdUJBQUEsR0FBdUQsb0JBQW9CLENBQ3pFLE1BQ0YsQ0FBQztJQUZPLFVBQVUsR0FBQSx1QkFBQSxDQUFWLFVBQVU7SUFBRSxZQUFZLEdBQUEsdUJBQUEsQ0FBWixZQUFZO0lBQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztJQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87RUFHbEQsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO0VBQ25ELElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO0VBQzlDLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztFQUN2RCxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztFQUNwRCxXQUFXLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUQsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSx3QkFBd0IsR0FBRyxTQUEzQix3QkFBd0IsQ0FBSSxLQUFLLEVBQUs7RUFDMUMsSUFBQSx1QkFBQSxHQUE2RCxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQXZGLFlBQVksR0FBQSx1QkFBQSxDQUFaLFlBQVk7SUFBRSxlQUFlLEdBQUEsdUJBQUEsQ0FBZixlQUFlO0lBQUUsUUFBUSxHQUFBLHVCQUFBLENBQVIsUUFBUTtJQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87RUFFeEQsWUFBWSxDQUFDLFlBQVksQ0FBQztFQUMxQixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUk7RUFDdEIsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJO0VBQ3JCLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUV2QixLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDeEIsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFJLFlBQVksRUFBSztFQUN2QyxPQUFPLFVBQUMsS0FBSyxFQUFLO0lBQ2hCLElBQUEsdUJBQUEsR0FBdUQsb0JBQW9CLENBQ3pFLEtBQUssQ0FBQyxNQUNSLENBQUM7TUFGTyxVQUFVLEdBQUEsdUJBQUEsQ0FBVixVQUFVO01BQUUsWUFBWSxHQUFBLHVCQUFBLENBQVosWUFBWTtNQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87TUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0lBSWxELElBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUM7SUFFdkMsSUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7SUFDbkUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLEVBQUU7TUFDeEMsSUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7TUFDMUQsV0FBVyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFEO0lBQ0EsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0VBQ3hCLENBQUM7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGdCQUFnQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUk7RUFBQSxPQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQUEsRUFBQzs7QUFFcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sa0JBQWtCLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBSTtFQUFBLE9BQUssUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFBQSxFQUFDOztBQUV0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFJO0VBQUEsT0FBSyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQUM7O0FBRXJFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLG1CQUFtQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUk7RUFBQSxPQUFLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQUEsRUFBQzs7QUFFdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sa0JBQWtCLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBSTtFQUFBLE9BQUssV0FBVyxDQUFDLElBQUksQ0FBQztBQUFBLEVBQUM7O0FBRXRFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUk7RUFBQSxPQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFBQSxFQUFDOztBQUVuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxzQkFBc0IsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFJO0VBQUEsT0FBSyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQUM7O0FBRTNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLG9CQUFvQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUk7RUFBQSxPQUFLLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQUEsRUFBQzs7QUFFekU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sMkJBQTJCLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBSTtFQUFBLE9BQUssUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFBQSxFQUFDOztBQUUvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSx5QkFBeUIsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFJO0VBQUEsT0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQUM7O0FBRTdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sdUJBQXVCLEdBQUcsU0FBMUIsdUJBQXVCLENBQUksTUFBTSxFQUFLO0VBQzFDLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtFQUVyQixJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDO0VBRXZELElBQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLO0VBQ3BELElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSztFQUV0QyxJQUFJLFNBQVMsS0FBSyxtQkFBbUIsRUFBRTtFQUV2QyxJQUFNLGFBQWEsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDO0VBQ2hELElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDO0VBQzdELFdBQVcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRCxDQUFDOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLDBCQUEwQixHQUFHLFNBQTdCLDBCQUEwQixDQUFJLGFBQWEsRUFBSztFQUNwRCxPQUFPLFVBQUMsS0FBSyxFQUFLO0lBQ2hCLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNO0lBQzVCLElBQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7SUFDekQsSUFBQSx1QkFBQSxHQUF1RCxvQkFBb0IsQ0FDekUsT0FDRixDQUFDO01BRk8sVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtNQUFFLFlBQVksR0FBQSx1QkFBQSxDQUFaLFlBQVk7TUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO01BQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztJQUdsRCxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztJQUV6RCxJQUFJLGFBQWEsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBQ2hELGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUV4RCxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztJQUNsRCxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUNuRSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsRUFBRTtNQUN6QyxJQUFNLFdBQVcsR0FBRyxxQkFBcUIsQ0FDdkMsVUFBVSxFQUNWLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FDdEIsQ0FBQztNQUNELFdBQVcsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzRDtJQUNBLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUN4QixDQUFDO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxpQkFBaUIsR0FBRywwQkFBMEIsQ0FBQyxVQUFDLEtBQUs7RUFBQSxPQUFLLEtBQUssR0FBRyxDQUFDO0FBQUEsRUFBQzs7QUFFMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sbUJBQW1CLEdBQUcsMEJBQTBCLENBQUMsVUFBQyxLQUFLO0VBQUEsT0FBSyxLQUFLLEdBQUcsQ0FBQztBQUFBLEVBQUM7O0FBRTVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLG1CQUFtQixHQUFHLDBCQUEwQixDQUFDLFVBQUMsS0FBSztFQUFBLE9BQUssS0FBSyxHQUFHLENBQUM7QUFBQSxFQUFDOztBQUU1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxvQkFBb0IsR0FBRywwQkFBMEIsQ0FBQyxVQUFDLEtBQUs7RUFBQSxPQUFLLEtBQUssR0FBRyxDQUFDO0FBQUEsRUFBQzs7QUFFN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sbUJBQW1CLEdBQUcsMEJBQTBCLENBQ3BELFVBQUMsS0FBSztFQUFBLE9BQUssS0FBSyxHQUFJLEtBQUssR0FBRyxDQUFFO0FBQUEsQ0FDaEMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxrQkFBa0IsR0FBRywwQkFBMEIsQ0FDbkQsVUFBQyxLQUFLO0VBQUEsT0FBSyxLQUFLLEdBQUcsQ0FBQyxHQUFJLEtBQUssR0FBRyxDQUFFO0FBQUEsQ0FDcEMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSx1QkFBdUIsR0FBRywwQkFBMEIsQ0FBQztFQUFBLE9BQU0sRUFBRTtBQUFBLEVBQUM7O0FBRXBFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLHFCQUFxQixHQUFHLDBCQUEwQixDQUFDO0VBQUEsT0FBTSxDQUFDO0FBQUEsRUFBQzs7QUFFakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSx3QkFBd0IsR0FBRyxTQUEzQix3QkFBd0IsQ0FBSSxPQUFPLEVBQUs7RUFDNUMsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO0VBQ3RCLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsRUFBRTtFQUU5RCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO0VBRXRELElBQU0sV0FBVyxHQUFHLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7RUFDOUQsV0FBVyxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNELENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0seUJBQXlCLEdBQUcsU0FBNUIseUJBQXlCLENBQUksWUFBWSxFQUFLO0VBQ2xELE9BQU8sVUFBQyxLQUFLLEVBQUs7SUFDaEIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU07SUFDM0IsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztJQUN2RCxJQUFBLHVCQUFBLEdBQXVELG9CQUFvQixDQUN6RSxNQUNGLENBQUM7TUFGTyxVQUFVLEdBQUEsdUJBQUEsQ0FBVixVQUFVO01BQUUsWUFBWSxHQUFBLHVCQUFBLENBQVosWUFBWTtNQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87TUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0lBR2xELElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO0lBRXZELElBQUksWUFBWSxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUM7SUFDN0MsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQztJQUV4QyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztJQUNoRCxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUNuRSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsRUFBRTtNQUN4QyxJQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FDdEMsVUFBVSxFQUNWLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FDekIsQ0FBQztNQUNELFdBQVcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRDtJQUNBLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUN4QixDQUFDO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxnQkFBZ0IsR0FBRyx5QkFBeUIsQ0FBQyxVQUFDLElBQUk7RUFBQSxPQUFLLElBQUksR0FBRyxDQUFDO0FBQUEsRUFBQzs7QUFFdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sa0JBQWtCLEdBQUcseUJBQXlCLENBQUMsVUFBQyxJQUFJO0VBQUEsT0FBSyxJQUFJLEdBQUcsQ0FBQztBQUFBLEVBQUM7O0FBRXhFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGtCQUFrQixHQUFHLHlCQUF5QixDQUFDLFVBQUMsSUFBSTtFQUFBLE9BQUssSUFBSSxHQUFHLENBQUM7QUFBQSxFQUFDOztBQUV4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxtQkFBbUIsR0FBRyx5QkFBeUIsQ0FBQyxVQUFDLElBQUk7RUFBQSxPQUFLLElBQUksR0FBRyxDQUFDO0FBQUEsRUFBQzs7QUFFekU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sa0JBQWtCLEdBQUcseUJBQXlCLENBQ2xELFVBQUMsSUFBSTtFQUFBLE9BQUssSUFBSSxHQUFJLElBQUksR0FBRyxDQUFFO0FBQUEsQ0FDN0IsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxpQkFBaUIsR0FBRyx5QkFBeUIsQ0FDakQsVUFBQyxJQUFJO0VBQUEsT0FBSyxJQUFJLEdBQUcsQ0FBQyxHQUFJLElBQUksR0FBRyxDQUFFO0FBQUEsQ0FDakMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyx5QkFBeUIsQ0FDcEQsVUFBQyxJQUFJO0VBQUEsT0FBSyxJQUFJLEdBQUcsVUFBVTtBQUFBLENBQzdCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sc0JBQXNCLEdBQUcseUJBQXlCLENBQ3RELFVBQUMsSUFBSTtFQUFBLE9BQUssSUFBSSxHQUFHLFVBQVU7QUFBQSxDQUM3QixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sdUJBQXVCLEdBQUcsU0FBMUIsdUJBQXVCLENBQUksTUFBTSxFQUFLO0VBQzFDLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtFQUNyQixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLDJCQUEyQixDQUFDLEVBQUU7RUFFNUQsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztFQUVwRCxJQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDO0VBQzNELFdBQVcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRCxDQUFDOztBQUVEOztBQUVBOztBQUVBLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLFNBQVMsRUFBSztFQUNoQyxJQUFNLG1CQUFtQixHQUFHLFNBQXRCLG1CQUFtQixDQUFJLEVBQUUsRUFBSztJQUNsQyxJQUFBLHVCQUFBLEdBQXVCLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztNQUF2QyxVQUFVLEdBQUEsdUJBQUEsQ0FBVixVQUFVO0lBQ2xCLElBQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUM7SUFFdkQsSUFBTSxhQUFhLEdBQUcsQ0FBQztJQUN2QixJQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQztJQUNqRCxJQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxhQUFhLENBQUM7SUFDckQsSUFBTSxXQUFXLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxDQUFDO0lBQ25ELElBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBRTdELElBQU0sU0FBUyxHQUFHLFVBQVUsS0FBSyxZQUFZO0lBQzdDLElBQU0sVUFBVSxHQUFHLFVBQVUsS0FBSyxhQUFhO0lBQy9DLElBQU0sVUFBVSxHQUFHLFVBQVUsS0FBSyxDQUFDLENBQUM7SUFFcEMsT0FBTztNQUNMLGlCQUFpQixFQUFqQixpQkFBaUI7TUFDakIsVUFBVSxFQUFWLFVBQVU7TUFDVixZQUFZLEVBQVosWUFBWTtNQUNaLFVBQVUsRUFBVixVQUFVO01BQ1YsV0FBVyxFQUFYLFdBQVc7TUFDWCxTQUFTLEVBQVQ7SUFDRixDQUFDO0VBQ0gsQ0FBQztFQUVELE9BQU87SUFDTCxRQUFRLFdBQUEsU0FBQyxLQUFLLEVBQUU7TUFDZCxJQUFBLG9CQUFBLEdBQWdELG1CQUFtQixDQUNqRSxLQUFLLENBQUMsTUFDUixDQUFDO1FBRk8sWUFBWSxHQUFBLG9CQUFBLENBQVosWUFBWTtRQUFFLFNBQVMsR0FBQSxvQkFBQSxDQUFULFNBQVM7UUFBRSxVQUFVLEdBQUEsb0JBQUEsQ0FBVixVQUFVO01BSTNDLElBQUksU0FBUyxJQUFJLFVBQVUsRUFBRTtRQUMzQixLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEIsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3RCO0lBQ0YsQ0FBQztJQUNELE9BQU8sV0FBQSxRQUFDLEtBQUssRUFBRTtNQUNiLElBQUEscUJBQUEsR0FBZ0QsbUJBQW1CLENBQ2pFLEtBQUssQ0FBQyxNQUNSLENBQUM7UUFGTyxXQUFXLEdBQUEscUJBQUEsQ0FBWCxXQUFXO1FBQUUsVUFBVSxHQUFBLHFCQUFBLENBQVYsVUFBVTtRQUFFLFVBQVUsR0FBQSxxQkFBQSxDQUFWLFVBQVU7TUFJM0MsSUFBSSxVQUFVLElBQUksVUFBVSxFQUFFO1FBQzVCLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0QixXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDckI7SUFDRjtFQUNGLENBQUM7QUFDSCxDQUFDO0FBRUQsSUFBTSx5QkFBeUIsR0FBRyxVQUFVLENBQUMscUJBQXFCLENBQUM7QUFDbkUsSUFBTSwwQkFBMEIsR0FBRyxVQUFVLENBQUMsc0JBQXNCLENBQUM7QUFDckUsSUFBTSx5QkFBeUIsR0FBRyxVQUFVLENBQUMscUJBQXFCLENBQUM7O0FBRW5FOztBQUVBOztBQUVBLElBQU0sZ0JBQWdCLElBQUEsaUJBQUEsT0FBQSxlQUFBLENBQUEsaUJBQUEsRUFDbkIsS0FBSyxHQUFBLE1BQUEsT0FBQSxlQUFBLENBQUEsTUFBQSxFQUNILGtCQUFrQixjQUFJO0VBQ3JCLGNBQWMsQ0FBQyxJQUFJLENBQUM7QUFDdEIsQ0FBQyxHQUFBLGVBQUEsQ0FBQSxNQUFBLEVBQ0EsYUFBYSxjQUFJO0VBQ2hCLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDbEIsQ0FBQyxHQUFBLGVBQUEsQ0FBQSxNQUFBLEVBQ0EsY0FBYyxjQUFJO0VBQ2pCLFdBQVcsQ0FBQyxJQUFJLENBQUM7QUFDbkIsQ0FBQyxHQUFBLGVBQUEsQ0FBQSxNQUFBLEVBQ0EsYUFBYSxjQUFJO0VBQ2hCLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDbEIsQ0FBQyxHQUFBLGVBQUEsQ0FBQSxNQUFBLEVBQ0EsdUJBQXVCLGNBQUk7RUFDMUIsb0JBQW9CLENBQUMsSUFBSSxDQUFDO0FBQzVCLENBQUMsR0FBQSxlQUFBLENBQUEsTUFBQSxFQUNBLG1CQUFtQixjQUFJO0VBQ3RCLGdCQUFnQixDQUFDLElBQUksQ0FBQztBQUN4QixDQUFDLEdBQUEsZUFBQSxDQUFBLE1BQUEsRUFDQSxzQkFBc0IsY0FBSTtFQUN6QixtQkFBbUIsQ0FBQyxJQUFJLENBQUM7QUFDM0IsQ0FBQyxHQUFBLGVBQUEsQ0FBQSxNQUFBLEVBQ0Esa0JBQWtCLGNBQUk7RUFDckIsZUFBZSxDQUFDLElBQUksQ0FBQztBQUN2QixDQUFDLEdBQUEsZUFBQSxDQUFBLE1BQUEsRUFDQSw0QkFBNEIsY0FBSTtFQUMvQix3QkFBd0IsQ0FBQyxJQUFJLENBQUM7QUFDaEMsQ0FBQyxHQUFBLGVBQUEsQ0FBQSxNQUFBLEVBQ0Esd0JBQXdCLGNBQUk7RUFDM0Isb0JBQW9CLENBQUMsSUFBSSxDQUFDO0FBQzVCLENBQUMsR0FBQSxlQUFBLENBQUEsTUFBQSxFQUNBLHdCQUF3QixjQUFJO0VBQzNCLElBQU0sV0FBVyxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQztFQUMvQyxXQUFXLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0QsQ0FBQyxHQUFBLGVBQUEsQ0FBQSxNQUFBLEVBQ0EsdUJBQXVCLGNBQUk7RUFDMUIsSUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDO0VBQzlDLFdBQVcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRCxDQUFDLEdBQUEsTUFBQSxJQUFBLGVBQUEsQ0FBQSxpQkFBQSxXQUFBLGVBQUEsS0FHQSxvQkFBb0IsWUFBRSxLQUFLLEVBQUU7RUFDNUIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjO0VBQzNDLElBQUksR0FBQSxNQUFBLENBQUcsS0FBSyxDQUFDLE9BQU8sTUFBTyxPQUFPLEVBQUU7SUFDbEMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0VBQ3hCO0FBQ0YsQ0FBQyxJQUFBLGVBQUEsQ0FBQSxpQkFBQSxjQUFBLFFBQUEsT0FBQSxlQUFBLENBQUEsUUFBQSxFQUdBLDBCQUEwQixZQUFFLEtBQUssRUFBRTtFQUNsQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssYUFBYSxFQUFFO0lBQ25DLGlCQUFpQixDQUFDLElBQUksQ0FBQztFQUN6QjtBQUNGLENBQUMsR0FBQSxlQUFBLENBQUEsUUFBQSxFQUNBLGFBQWEsRUFBRyxJQUFBLGdCQUFNLEVBQUM7RUFDdEIsRUFBRSxFQUFFLGdCQUFnQjtFQUNwQixPQUFPLEVBQUUsZ0JBQWdCO0VBQ3pCLElBQUksRUFBRSxrQkFBa0I7RUFDeEIsU0FBUyxFQUFFLGtCQUFrQjtFQUM3QixJQUFJLEVBQUUsa0JBQWtCO0VBQ3hCLFNBQVMsRUFBRSxrQkFBa0I7RUFDN0IsS0FBSyxFQUFFLG1CQUFtQjtFQUMxQixVQUFVLEVBQUUsbUJBQW1CO0VBQy9CLElBQUksRUFBRSxrQkFBa0I7RUFDeEIsR0FBRyxFQUFFLGlCQUFpQjtFQUN0QixRQUFRLEVBQUUsc0JBQXNCO0VBQ2hDLE1BQU0sRUFBRSxvQkFBb0I7RUFDNUIsZ0JBQWdCLEVBQUUsMkJBQTJCO0VBQzdDLGNBQWMsRUFBRTtBQUNsQixDQUFDLENBQUMsR0FBQSxlQUFBLENBQUEsUUFBQSxFQUNELG9CQUFvQixFQUFHLElBQUEsZ0JBQU0sRUFBQztFQUM3QixHQUFHLEVBQUUseUJBQXlCLENBQUMsUUFBUTtFQUN2QyxXQUFXLEVBQUUseUJBQXlCLENBQUM7QUFDekMsQ0FBQyxDQUFDLEdBQUEsZUFBQSxDQUFBLFFBQUEsRUFDRCxjQUFjLEVBQUcsSUFBQSxnQkFBTSxFQUFDO0VBQ3ZCLEVBQUUsRUFBRSxpQkFBaUI7RUFDckIsT0FBTyxFQUFFLGlCQUFpQjtFQUMxQixJQUFJLEVBQUUsbUJBQW1CO0VBQ3pCLFNBQVMsRUFBRSxtQkFBbUI7RUFDOUIsSUFBSSxFQUFFLG1CQUFtQjtFQUN6QixTQUFTLEVBQUUsbUJBQW1CO0VBQzlCLEtBQUssRUFBRSxvQkFBb0I7RUFDM0IsVUFBVSxFQUFFLG9CQUFvQjtFQUNoQyxJQUFJLEVBQUUsbUJBQW1CO0VBQ3pCLEdBQUcsRUFBRSxrQkFBa0I7RUFDdkIsUUFBUSxFQUFFLHVCQUF1QjtFQUNqQyxNQUFNLEVBQUU7QUFDVixDQUFDLENBQUMsR0FBQSxlQUFBLENBQUEsUUFBQSxFQUNELHFCQUFxQixFQUFHLElBQUEsZ0JBQU0sRUFBQztFQUM5QixHQUFHLEVBQUUsMEJBQTBCLENBQUMsUUFBUTtFQUN4QyxXQUFXLEVBQUUsMEJBQTBCLENBQUM7QUFDMUMsQ0FBQyxDQUFDLEdBQUEsZUFBQSxDQUFBLFFBQUEsRUFDRCxhQUFhLEVBQUcsSUFBQSxnQkFBTSxFQUFDO0VBQ3RCLEVBQUUsRUFBRSxnQkFBZ0I7RUFDcEIsT0FBTyxFQUFFLGdCQUFnQjtFQUN6QixJQUFJLEVBQUUsa0JBQWtCO0VBQ3hCLFNBQVMsRUFBRSxrQkFBa0I7RUFDN0IsSUFBSSxFQUFFLGtCQUFrQjtFQUN4QixTQUFTLEVBQUUsa0JBQWtCO0VBQzdCLEtBQUssRUFBRSxtQkFBbUI7RUFDMUIsVUFBVSxFQUFFLG1CQUFtQjtFQUMvQixJQUFJLEVBQUUsa0JBQWtCO0VBQ3hCLEdBQUcsRUFBRSxpQkFBaUI7RUFDdEIsUUFBUSxFQUFFLHNCQUFzQjtFQUNoQyxNQUFNLEVBQUU7QUFDVixDQUFDLENBQUMsR0FBQSxlQUFBLENBQUEsUUFBQSxFQUNELG9CQUFvQixFQUFHLElBQUEsZ0JBQU0sRUFBQztFQUM3QixHQUFHLEVBQUUseUJBQXlCLENBQUMsUUFBUTtFQUN2QyxXQUFXLEVBQUUseUJBQXlCLENBQUM7QUFDekMsQ0FBQyxDQUFDLEdBQUEsZUFBQSxDQUFBLFFBQUEsRUFDRCxvQkFBb0IsWUFBRSxLQUFLLEVBQUU7RUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLE9BQU87QUFDN0MsQ0FBQyxHQUFBLGVBQUEsQ0FBQSxRQUFBLEVBQ0EsV0FBVyxZQUFFLEtBQUssRUFBRTtFQUNuQixJQUFNLE1BQU0sR0FBRyxJQUFBLGdCQUFNLEVBQUM7SUFDcEIsTUFBTSxFQUFFO0VBQ1YsQ0FBQyxDQUFDO0VBRUYsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUMsR0FBQSxRQUFBLElBQUEsZUFBQSxDQUFBLGlCQUFBLGVBQUEsU0FBQSxPQUFBLGVBQUEsQ0FBQSxTQUFBLEVBR0EsMEJBQTBCLGNBQUk7RUFDN0IsaUJBQWlCLENBQUMsSUFBSSxDQUFDO0FBQ3pCLENBQUMsR0FBQSxlQUFBLENBQUEsU0FBQSxFQUNBLFdBQVcsWUFBRSxLQUFLLEVBQUU7RUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFO0lBQ3ZDLFlBQVksQ0FBQyxJQUFJLENBQUM7RUFDcEI7QUFDRixDQUFDLEdBQUEsU0FBQSxJQUFBLGVBQUEsQ0FBQSxpQkFBQSxXQUFBLGVBQUEsS0FHQSwwQkFBMEIsY0FBSTtFQUM3QixvQkFBb0IsQ0FBQyxJQUFJLENBQUM7RUFDMUIsdUJBQXVCLENBQUMsSUFBSSxDQUFDO0FBQy9CLENBQUMsSUFBQSxpQkFBQSxDQUVKO0FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUU7RUFBQSxJQUFBLHFCQUFBO0VBQ2xCLGdCQUFnQixDQUFDLFNBQVMsSUFBQSxxQkFBQSxPQUFBLGVBQUEsQ0FBQSxxQkFBQSxFQUN2QiwyQkFBMkIsY0FBSTtJQUM5Qix1QkFBdUIsQ0FBQyxJQUFJLENBQUM7RUFDL0IsQ0FBQyxHQUFBLGVBQUEsQ0FBQSxxQkFBQSxFQUNBLGNBQWMsY0FBSTtJQUNqQix3QkFBd0IsQ0FBQyxJQUFJLENBQUM7RUFDaEMsQ0FBQyxHQUFBLGVBQUEsQ0FBQSxxQkFBQSxFQUNBLGFBQWEsY0FBSTtJQUNoQix1QkFBdUIsQ0FBQyxJQUFJLENBQUM7RUFDL0IsQ0FBQyxHQUFBLHFCQUFBLENBQ0Y7QUFDSDtBQUVBLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtFQUM1QyxJQUFJLFdBQUEsS0FBQyxJQUFJLEVBQUU7SUFDVCxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFlBQVksRUFBSztNQUNsRCxJQUFHLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsNkJBQTZCLENBQUMsRUFBQztRQUNqRSxpQkFBaUIsQ0FBQyxZQUFZLENBQUM7TUFDakM7SUFDRixDQUFDLENBQUM7RUFDSixDQUFDO0VBQ0QsV0FBVyxXQUFBLFlBQUMsT0FBTyxFQUFFO0lBQ25CLElBQUksR0FBRyxPQUFPO0lBQ2QsWUFBWSxHQUFHLENBQ2IsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxLQUFLLEVBQ1YsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsR0FBRyxFQUNSLElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxRQUFRLENBQ2Q7SUFDRCxrQkFBa0IsR0FBRyxDQUNuQixJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFNBQVMsRUFDZCxJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsTUFBTSxDQUNaO0VBQ0gsQ0FBQztFQUNELG9CQUFvQixFQUFwQixvQkFBb0I7RUFDcEIsT0FBTyxFQUFQLE9BQU87RUFDUCxNQUFNLEVBQU4sTUFBTTtFQUNOLGtCQUFrQixFQUFsQixrQkFBa0I7RUFDbEIsZ0JBQWdCLEVBQWhCLGdCQUFnQjtFQUNoQixpQkFBaUIsRUFBakIsaUJBQWlCO0VBQ2pCLGNBQWMsRUFBZCxjQUFjO0VBQ2QsdUJBQXVCLEVBQXZCO0FBQ0YsQ0FBQyxDQUFDOztBQUVGOztBQUVBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVTs7O0FDOXhFM0IsWUFBWTs7QUFBQyxNQUFBLENBQUEsY0FBQSxDQUFBLE9BQUE7RUFBQSxLQUFBO0FBQUE7QUFBQSxPQUFBO0FBQ2IsSUFBQSxTQUFBLEdBQUEsc0JBQUEsQ0FBQSxPQUFBO0FBQ0EsT0FBQTtBQUE4QyxTQUFBLHVCQUFBLEdBQUEsV0FBQSxHQUFBLElBQUEsR0FBQSxDQUFBLFVBQUEsR0FBQSxHQUFBLGdCQUFBLEdBQUE7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFlBQVksQ0FBRSxTQUFTLEVBQUM7RUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTO0VBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLHNCQUFzQixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDOztFQUV6RTtFQUNBLElBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQywrQ0FBK0MsQ0FBQyxFQUFDO0lBQzlFLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQztFQUN2RztFQUVBLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzlCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVU7RUFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLG9CQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBRXBELElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsMEJBQTBCLENBQUM7RUFDaEYsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7SUFDMUMsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUM5QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ25FO0FBQ0osQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxZQUFZLENBQUMsU0FBUyxDQUFDLG1CQUFtQixHQUFHLFlBQVU7RUFDbkQsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsK0NBQStDLENBQUM7RUFDaEcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxTQUFTO0FBQ25KLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxVQUFTLENBQUMsRUFBQztFQUM5QyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVU7RUFDNUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDO0VBQzdGLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDO0VBRXZGLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNsRyxJQUFJLGFBQWEsR0FBRyxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQztFQUN0RCxhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNO0VBQ2xDLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO0VBQ25DLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztFQUUxQjtFQUNBLElBQUksWUFBWSxHQUFHLElBQUksb0JBQVEsQ0FBQyxNQUFNLENBQUM7RUFDdkMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFBQSxJQUFBLFFBQUEsR0FFYyxZQUFZO0FBQUEsT0FBQSxjQUFBLFFBQUE7OztBQzdEM0IsWUFBWTs7QUFBQyxNQUFBLENBQUEsY0FBQSxDQUFBLE9BQUE7RUFBQSxLQUFBO0FBQUE7QUFBQSxPQUFBO0FBQ2IsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDO0FBQ25ELElBQU0sTUFBTSxHQUFHLHVCQUF1QjtBQUN0QyxJQUFNLDBCQUEwQixHQUFHLGtDQUFrQyxDQUFDLENBQUM7QUFDdkUsSUFBTSxNQUFNLEdBQUcsZ0JBQWdCOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsUUFBUSxDQUFFLGFBQWEsRUFBRTtFQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWE7RUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJO0VBQ3BCLElBQUksQ0FBQyw2QkFBNkIsR0FBRyxLQUFLO0VBRTFDLElBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSyxJQUFJLElBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTLEVBQUM7SUFDaEUsTUFBTSxJQUFJLEtBQUsscURBQXFELENBQUM7RUFDdkU7RUFDQSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7RUFDeEQsSUFBRyxVQUFVLEtBQUssSUFBSSxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUM7SUFDakQsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsR0FBQyxNQUFNLENBQUM7RUFDckY7RUFDQSxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ25FLElBQUcsUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFDO0lBQzdDLE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUM7RUFDMUU7RUFDQSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVE7QUFDMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsWUFBVztFQUNuQyxJQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFDO0lBRTFILElBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQ0FBaUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsaUNBQWlDLENBQUMsRUFBQztNQUM1SyxJQUFJLENBQUMsNkJBQTZCLEdBQUcsSUFBSTtJQUMzQzs7SUFFQTtJQUNBLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO0lBQ3JGLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO0lBQ2xGO0lBQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDO0lBQy9ELElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQztJQUM1RCxJQUFJLE9BQU8sR0FBRyxJQUFJO0lBQ2xCO0lBQ0EsSUFBRyxJQUFJLENBQUMsNkJBQTZCLEVBQUU7TUFDckMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWE7TUFDaEMsSUFBSSxNQUFNLENBQUMsb0JBQW9CLEVBQUU7UUFDL0I7UUFDQSxJQUFJLFFBQVEsR0FBRyxJQUFJLG9CQUFvQixDQUFDLFVBQVUsT0FBTyxFQUFFO1VBQ3pEO1VBQ0EsSUFBSSxPQUFPLENBQUUsQ0FBQyxDQUFFLENBQUMsaUJBQWlCLEVBQUU7WUFDbEMsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLE9BQU8sRUFBRTtjQUNyRCxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO1lBQ3REO1VBQ0YsQ0FBQyxNQUFNO1lBQ0w7WUFDQSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxLQUFLLE1BQU0sRUFBRTtjQUMzRCxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO1lBQ3ZEO1VBQ0Y7UUFDRixDQUFDLEVBQUU7VUFDRCxJQUFJLEVBQUUsUUFBUSxDQUFDO1FBQ2pCLENBQUMsQ0FBQztRQUNGLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO01BQzNCLENBQUMsTUFBTTtRQUNMO1FBQ0EsSUFBSSxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7VUFDM0M7VUFDQSxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssT0FBTyxFQUFFO1lBQ3JELE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7VUFDdEQsQ0FBQyxNQUFLO1lBQ0osT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQztVQUN2RDtRQUNGLENBQUMsTUFBTTtVQUNMO1VBQ0EsT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQztRQUN2RDtRQUNBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBWTtVQUM1QyxJQUFJLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMzQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssT0FBTyxFQUFFO2NBQ3JELE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7WUFDdEQsQ0FBQyxNQUFLO2NBQ0osT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQztZQUN2RDtVQUNGLENBQUMsTUFBTTtZQUNMLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUM7VUFDdkQ7UUFDRixDQUFDLENBQUM7TUFDSjtJQUNGO0lBR0EsUUFBUSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUM7SUFDcEQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUM7RUFDbkQ7QUFDRixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVU7RUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7QUFDNUIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFVO0VBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQzVCLENBQUM7QUFFRCxJQUFJLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQVksS0FBSyxFQUFDO0VBQ2pDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU87RUFDdEMsSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFO0lBQ2QsUUFBUSxDQUFDLEtBQUssQ0FBQztFQUNqQjtBQUNGLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQWEsTUFBTSxFQUFFO0VBQ2pDLE9BQU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQztBQUN4QyxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUEsRUFBMEI7RUFBQSxJQUFiLEtBQUssR0FBQSxTQUFBLENBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBLEdBQUEsU0FBQSxNQUFHLElBQUk7RUFDbkMsSUFBSSxPQUFPLEdBQUcsS0FBSztFQUNuQixJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztFQUUzQyxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDO0VBQ3JFLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO0lBQ2pELElBQUkscUJBQXFCLEdBQUcsY0FBYyxDQUFFLEVBQUUsQ0FBRTtJQUNoRCxJQUFJLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFDLHdCQUF3QixDQUFDO0lBQ3BGLElBQUcsU0FBUyxLQUFLLElBQUksRUFBQztNQUNwQixPQUFPLEdBQUcsSUFBSTtNQUNkLElBQUksUUFBUSxHQUFHLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BRXJHLElBQUksUUFBUSxLQUFLLElBQUksSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO1FBQzNDLElBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUM7VUFDakMsSUFBRyxTQUFTLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLElBQUksRUFBQztZQUNsRCxJQUFJLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztZQUNoRCxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztVQUNyQztVQUNBLFNBQVMsQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQztVQUNoRCxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7VUFDbkMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO1FBQzlDO01BQ0Y7SUFDSjtFQUNGO0VBRUEsSUFBRyxPQUFPLElBQUksS0FBSyxLQUFLLElBQUksRUFBQztJQUMzQixLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztFQUNsQztBQUNGLENBQUM7QUFDRCxJQUFJLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBYSxFQUFFLEVBQUU7RUFDekIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDbkMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVO0lBQ3RFLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxJQUFJLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUztFQUN0RSxPQUFPO0lBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUztJQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHO0VBQVcsQ0FBQztBQUNwRSxDQUFDO0FBRUQsSUFBSSxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFhLEtBQUssRUFBc0I7RUFBQSxJQUFwQixVQUFVLEdBQUEsU0FBQSxDQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsTUFBRyxLQUFLO0VBQ3RELEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztFQUN2QixLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7RUFFdEIsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUM7QUFFMUIsQ0FBQztBQUVELElBQUksTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFZLE1BQU0sRUFBcUI7RUFBQSxJQUFuQixVQUFVLEdBQUEsU0FBQSxDQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsTUFBRyxLQUFLO0VBQzlDLElBQUksU0FBUyxHQUFHLE1BQU07RUFDdEIsSUFBSSxRQUFRLEdBQUcsSUFBSTtFQUNuQixJQUFHLFNBQVMsS0FBSyxJQUFJLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBQztJQUMvQyxJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztJQUMvQyxJQUFHLFVBQVUsS0FBSyxJQUFJLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBQztNQUNqRCxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNqRTtFQUNGO0VBQ0EsSUFBRyxTQUFTLEtBQUssSUFBSSxJQUFJLFNBQVMsS0FBSyxTQUFTLElBQUksUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFDO0lBQzlGOztJQUVBLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUk7SUFDMUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSTtJQUUzQixJQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssTUFBTSxJQUFJLFVBQVUsRUFBQztNQUNsRTtNQUNBLFNBQVMsQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQztNQUNoRCxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7TUFDbkMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO01BQzVDLElBQUksVUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDO01BQ2hELFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ3JDLENBQUMsTUFBSTtNQUVILElBQUcsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDO1FBQ25GLFFBQVEsQ0FBQyxDQUFDO01BQ1o7TUFDQTtNQUNBLFNBQVMsQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQztNQUMvQyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7TUFDdEMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO01BQzdDLElBQUksU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDO01BQzlDLFNBQVMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO01BQ2xDLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7TUFFbkMsSUFBRyxZQUFZLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBQztRQUN2QixRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLO1FBQzNCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU07TUFDL0I7TUFDQSxJQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXO01BQ3BELElBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUM7UUFDM0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTTtRQUM1QixRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLO01BQzlCO01BRUEsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztNQUVsQyxJQUFHLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFDO1FBRXRCLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUs7UUFDM0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTTtNQUMvQjtNQUNBLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXO01BQy9DLElBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUM7UUFFM0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTTtRQUM1QixRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLO01BQzlCO0lBQ0Y7RUFFRjtBQUNGLENBQUM7QUFFRCxJQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBYSxLQUFLLEVBQUUsYUFBYSxFQUFDO0VBQzdDLElBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEtBQUssYUFBYSxFQUFDO0lBQzVDLE9BQU8sSUFBSTtFQUNiLENBQUMsTUFBTSxJQUFHLGFBQWEsS0FBSyxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEtBQUssTUFBTSxFQUFDO0lBQ3hFLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDO0VBQ25ELENBQUMsTUFBSTtJQUNILE9BQU8sS0FBSztFQUNkO0FBQ0YsQ0FBQztBQUVELElBQUksWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFhLEdBQUcsRUFBQztFQUMvQixJQUFHLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsRUFBQztJQUNuRixJQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsRUFBRTtNQUNuSCxJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFDLHNCQUFzQixDQUFDO01BQzVFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzdDLElBQUksU0FBUyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxRQUFRLEdBQUcsSUFBSTtRQUNuQixJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUMvQyxJQUFJLFVBQVUsS0FBSyxJQUFJLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtVQUNuRCxJQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUM7WUFDaEMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztVQUMxQztVQUNBLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQztRQUNoRDtRQUNBLElBQUksb0JBQW9CLENBQUMsU0FBUyxDQUFDLElBQUssU0FBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUUsRUFBRTtVQUNwSDtVQUNBLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDNUI7WUFDQSxTQUFTLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUM7WUFDaEQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1lBQ25DLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQztZQUM1QyxJQUFJLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztZQUNoRCxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztVQUNyQztRQUNGO01BQ0Y7SUFDRjtFQUNGO0FBQ0YsQ0FBQztBQUVELElBQUksb0JBQW9CLEdBQUcsU0FBdkIsb0JBQW9CLENBQWEsU0FBUyxFQUFDO0VBQzdDLElBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQyxFQUFDO0lBQzNEO0lBQ0EsSUFBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsaUNBQWlDLENBQUMsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsaUNBQWlDLENBQUMsRUFBRTtNQUMzSjtNQUNBLElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMxRDtRQUNBLE9BQU8sSUFBSTtNQUNiO0lBQ0YsQ0FBQyxNQUFLO01BQ0o7TUFDQSxPQUFPLElBQUk7SUFDYjtFQUNGO0VBRUEsT0FBTyxLQUFLO0FBQ2QsQ0FBQztBQUVELElBQUksc0JBQXNCLEdBQUcsU0FBekIsc0JBQXNCLENBQWEsTUFBTSxFQUFDO0VBQzVDLElBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLEVBQUM7SUFDekUsT0FBTyxXQUFXLENBQUMsRUFBRTtFQUN2QjtFQUNBLElBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLEVBQUM7SUFDekUsT0FBTyxXQUFXLENBQUMsRUFBRTtFQUN2QjtBQUNGLENBQUM7QUFBQyxJQUFBLFFBQUEsR0FFYSxRQUFRO0FBQUEsT0FBQSxjQUFBLFFBQUE7OztBQ3RUdkIsWUFBWTs7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUhBLE1BQUEsQ0FBQSxjQUFBLENBQUEsT0FBQTtFQUFBLEtBQUE7QUFBQTtBQUFBLE9BQUE7QUFJQSxTQUFTLFlBQVksQ0FBRSxPQUFPLEVBQUU7RUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPO0FBQ3hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVk7RUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDakI7RUFDRjtFQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7RUFFcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckUsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxLQUFLLEVBQUU7RUFDcEQsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU07RUFDekIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0lBQzVCLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUN4QjtBQUNGLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxPQUFPLEVBQUU7RUFDdEQ7RUFDQSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO0lBQ3JELE9BQU8sS0FBSztFQUNkO0VBRUEsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7RUFDbkQsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7RUFDN0MsSUFBSSxDQUFDLE1BQU0sRUFBRTtJQUNYLE9BQU8sS0FBSztFQUNkO0VBRUEsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQztFQUM1RCxJQUFJLENBQUMsY0FBYyxFQUFFO0lBQ25CLE9BQU8sS0FBSztFQUNkOztFQUVBO0VBQ0E7RUFDQTtFQUNBLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQUUsYUFBYSxFQUFFO0VBQUssQ0FBQyxDQUFDO0VBRXJDLE9BQU8sSUFBSTtBQUNiLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLEdBQUcsRUFBRTtFQUN6RCxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7SUFDM0IsT0FBTyxLQUFLO0VBQ2Q7RUFFQSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLENBQUMsU0FBUyxDQUFDLDBCQUEwQixHQUFHLFVBQVUsTUFBTSxFQUFFO0VBQ3BFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0VBRTFDLElBQUksU0FBUyxFQUFFO0lBQ2IsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQztJQUV0RCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7TUFDbEIsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDOztNQUVqQztNQUNBO01BQ0EsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtRQUN6RCxPQUFPLGdCQUFnQjtNQUN6Qjs7TUFFQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQSxJQUFJLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsR0FBRztNQUM1RCxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7TUFFOUM7TUFDQTtNQUNBLElBQUksU0FBUyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFO1FBQzFDLElBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU07UUFFbEQsSUFBSSxXQUFXLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxFQUFFO1VBQ3BELE9BQU8sZ0JBQWdCO1FBQ3pCO01BQ0Y7SUFDRjtFQUNGO0VBRUEsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUM3RSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUMzQixDQUFDO0FBQUEsSUFBQSxRQUFBLEdBRWMsWUFBWTtBQUFBLE9BQUEsY0FBQSxRQUFBOzs7QUNySjNCLFlBQVk7O0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFIQSxNQUFBLENBQUEsY0FBQSxDQUFBLE9BQUE7RUFBQSxLQUFBO0FBQUE7QUFBQSxPQUFBO0FBSUEsU0FBUyxLQUFLLENBQUUsTUFBTSxFQUFFO0VBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTTtFQUNwQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7RUFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMscUNBQXFDLEdBQUMsRUFBRSxHQUFDLElBQUksQ0FBQztBQUM1Rjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFZO0VBQ2pDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRO0VBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO0lBQ3ZDLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBRSxDQUFDLENBQUU7SUFDM0IsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUN6RDtFQUNBLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUM7RUFDaEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7SUFDdEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFFLENBQUMsQ0FBRTtJQUN6QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3hEO0FBQ0YsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFXO0VBQ2hDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNO0VBQzlCLElBQUcsWUFBWSxLQUFLLElBQUksRUFBQztJQUN2QixZQUFZLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7SUFFaEQsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7SUFDOUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDO0lBQ3BELFlBQVksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO0lBRXRDLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUM7SUFDekQsU0FBUyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO0lBRTNDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUN2RSxRQUFRLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUM7SUFFeEQsSUFBRyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsRUFBQztNQUNoQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztJQUNyRDtJQUNBLElBQUksZUFBZSxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUM7SUFDcEUsSUFBRyxlQUFlLEtBQUssSUFBSSxFQUFDO01BQzFCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDO01BQ3JELElBQUcsTUFBTSxLQUFLLElBQUksRUFBQztRQUNqQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDaEI7TUFDQSxZQUFZLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDO0lBQ25EO0VBQ0Y7QUFDRixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQW1CO0VBQUEsSUFBVCxDQUFDLEdBQUEsU0FBQSxDQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsTUFBRyxJQUFJO0VBQ3ZDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNO0VBQzlCLElBQUcsWUFBWSxLQUFLLElBQUksRUFBQztJQUN2QixJQUFHLENBQUMsS0FBSyxJQUFJLEVBQUM7TUFDWixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7TUFDMUMsSUFBRyxRQUFRLEtBQUssSUFBSSxFQUFDO1FBQ25CLFFBQVEsR0FBRyxlQUFlLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUMvRSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO01BQ3ZDO01BQ0EsWUFBWSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxRQUFRLENBQUM7SUFDMUQ7O0lBRUE7SUFDQTs7SUFFQTtJQUNBO0lBQ0E7SUFDQTs7SUFFQSxZQUFZLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUM7SUFDakQsWUFBWSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO0lBRTNDLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO0lBQzdDLFNBQVMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQztJQUNsRCxZQUFZLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUVyQyxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztJQUM3QyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztJQUN6QyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQztJQUM5QyxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztJQUUvRCxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7SUFFcEUsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXBCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQztJQUNyRCxJQUFHLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxFQUFDO01BQ2hDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO0lBQ2xEO0VBRUY7QUFDRixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQWEsS0FBSyxFQUFFO0VBQ2xDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU87RUFDdEMsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQztFQUMxRSxJQUFJLFlBQVksR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLCtCQUErQixDQUFDLENBQUM7RUFDckYsSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFDO0lBQ2IsSUFBSSxxQkFBcUIsR0FBRyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsNkNBQTZDLENBQUM7SUFDeEcsSUFBRyxxQkFBcUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFDO01BQ3BDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQjtFQUNGO0FBQ0YsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNDLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBQztFQUNwQixJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLCtCQUErQixDQUFDO0VBQzNFLElBQUcsYUFBYSxLQUFLLElBQUksRUFBQztJQUN4QixJQUFJLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQywrWEFBK1gsQ0FBQztJQUV2YixJQUFJLHFCQUFxQixHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUNoRCxJQUFJLG9CQUFvQixHQUFHLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFMUUsSUFBSSxZQUFZLEdBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFFO0lBRXZELElBQUksQ0FBQyxZQUFZLEVBQUU7TUFDakI7SUFDRjtJQUVBLElBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRyxpQkFBa0I7UUFDbEMsSUFBSSxRQUFRLENBQUMsYUFBYSxLQUFLLHFCQUFxQixFQUFFO1VBQ3BELG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1VBQzFCLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0QjtNQUNGLENBQUMsTUFBTSxTQUFVO1FBQ2YsSUFBSSxRQUFRLENBQUMsYUFBYSxLQUFLLG9CQUFvQixFQUFFO1VBQ25ELHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1VBQzNCLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0QjtNQUNGO0VBQ0Y7QUFDRjtBQUFDO0FBRUQsU0FBUyxlQUFlLENBQUUsS0FBSyxFQUFDO0VBQzlCLElBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLElBQUksRUFBQztJQUN6RCxPQUFPLEtBQUs7RUFDZDtFQUNBLE9BQU8sSUFBSTtBQUNiO0FBQUMsSUFBQSxRQUFBLEdBRWMsS0FBSztBQUFBLE9BQUEsY0FBQSxRQUFBOzs7QUNqS3BCLFlBQVk7O0FBQUMsTUFBQSxDQUFBLGNBQUEsQ0FBQSxPQUFBO0VBQUEsS0FBQTtBQUFBO0FBQUEsT0FBQTtBQUFBLFNBQUEsUUFBQSxHQUFBLHNDQUFBLE9BQUEsd0JBQUEsTUFBQSx1QkFBQSxNQUFBLENBQUEsUUFBQSxhQUFBLEdBQUEsa0JBQUEsR0FBQSxnQkFBQSxHQUFBLFdBQUEsR0FBQSx5QkFBQSxNQUFBLElBQUEsR0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsR0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLEdBQUEsS0FBQSxPQUFBLENBQUEsR0FBQTtBQUFBLFNBQUEsZ0JBQUEsUUFBQSxFQUFBLFdBQUEsVUFBQSxRQUFBLFlBQUEsV0FBQSxlQUFBLFNBQUE7QUFBQSxTQUFBLGtCQUFBLE1BQUEsRUFBQSxLQUFBLGFBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsVUFBQSxVQUFBLEdBQUEsS0FBQSxDQUFBLENBQUEsR0FBQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLFdBQUEsVUFBQSxDQUFBLFlBQUEsd0JBQUEsVUFBQSxFQUFBLFVBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxNQUFBLEVBQUEsY0FBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQTtBQUFBLFNBQUEsYUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsUUFBQSxVQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLENBQUEsU0FBQSxFQUFBLFVBQUEsT0FBQSxXQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLEVBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsV0FBQSxpQkFBQSxRQUFBLG1CQUFBLFdBQUE7QUFBQSxTQUFBLGVBQUEsR0FBQSxRQUFBLEdBQUEsR0FBQSxZQUFBLENBQUEsR0FBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSxpQkFBQSxHQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUE7QUFBQSxTQUFBLGFBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxPQUFBLENBQUEsS0FBQSxrQkFBQSxLQUFBLGtCQUFBLEtBQUEsTUFBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLE9BQUEsSUFBQSxLQUFBLFNBQUEsUUFBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLEVBQUEsSUFBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSx1QkFBQSxHQUFBLFlBQUEsU0FBQSw0REFBQSxJQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBLEVBQUEsS0FBQTtBQUNiLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7QUFDeEMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDO0FBRXpDLElBQU0sR0FBRyxTQUFTO0FBQ2xCLElBQU0sU0FBUyxNQUFBLE1BQUEsQ0FBTSxHQUFHLE9BQUk7QUFDNUIsSUFBTSxPQUFPLGtCQUFrQjtBQUMvQixJQUFNLFlBQVksbUJBQW1CO0FBQ3JDLElBQU0sT0FBTyxhQUFhO0FBQzFCLElBQU0sT0FBTyxNQUFBLE1BQUEsQ0FBTSxZQUFZLGVBQVk7QUFDM0MsSUFBTSxPQUFPLEdBQUcsQ0FBRSxHQUFHLEVBQUUsT0FBTyxDQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUUzQyxJQUFNLFlBQVksR0FBRyxtQkFBbUI7QUFDeEMsSUFBTSxhQUFhLEdBQUcsWUFBWTs7QUFFbEM7QUFDQTtBQUNBO0FBRkEsSUFHTSxVQUFVO0VBQUEsU0FBQSxXQUFBO0lBQUEsZUFBQSxPQUFBLFVBQUE7RUFBQTtFQUFBLFlBQUEsQ0FBQSxVQUFBO0lBQUEsR0FBQTtJQUFBLEtBQUE7SUFDZDtBQUNGO0FBQ0E7SUFDRSxTQUFBLEtBQUEsRUFBUTtNQUNOLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQztNQUNwRCxVQUFVLENBQUMsQ0FBQztJQUNkOztJQUVBO0FBQ0Y7QUFDQTtFQUZFO0lBQUEsR0FBQTtJQUFBLEtBQUEsRUFHQSxTQUFBLFNBQUEsRUFBWTtNQUNWLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQztJQUN6RDtFQUFDO0VBQUEsT0FBQSxVQUFBO0FBQUE7QUFHSDtBQUNBO0FBQ0E7QUFDQSxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBQSxFQUFjO0VBQzVCLElBQUksTUFBTSxHQUFHLEtBQUs7RUFDbEIsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztFQUNoRCxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN0QyxJQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLE1BQU0sRUFBRTtNQUMvRCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztNQUMvQyxNQUFNLEdBQUcsSUFBSTtJQUNmO0VBQ0Y7O0VBRUE7RUFDQSxJQUFHLE1BQU0sRUFBQztJQUNSLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7SUFDaEQsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDdEMsT0FBTyxDQUFFLENBQUMsQ0FBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUM7SUFDbkQ7SUFFQSxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO0lBQ25ELEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3ZDLFFBQVEsQ0FBRSxDQUFDLENBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBVTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFHQTtRQUNBLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRTtVQUNkLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztRQUM3QjtNQUNGLENBQUMsQ0FBQztJQUNKO0lBRUEsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztJQUNyRCxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztNQUM1QyxTQUFTLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQztFQUVGO0VBRUEsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO0VBRXhELElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO0lBQ3RFO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO0VBQy9CO0FBQ0YsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFBO0VBQUEsT0FBUyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO0FBQUE7O0FBRXJFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUksYUFBYSxFQUFLO0VBRXBDO0VBQ0EsSUFBTSx1QkFBdUIsR0FBRyxnTEFBZ0w7RUFDaE4sSUFBSSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLENBQUM7RUFDL0UsSUFBSSxZQUFZLEdBQUcsaUJBQWlCLENBQUUsQ0FBQyxDQUFFO0VBRXpDLFNBQVMsVUFBVSxDQUFFLENBQUMsRUFBRTtJQUN0QixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPO0lBQ3RDO0lBQ0EsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO01BRWIsSUFBSSxXQUFXLEdBQUcsSUFBSTtNQUN0QixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO1FBQy9DLElBQUksTUFBTSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQ3pDLElBQUksT0FBTyxHQUFHLGlCQUFpQixDQUFFLE1BQU0sR0FBRyxDQUFDLENBQUU7UUFDN0MsSUFBSSxPQUFPLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsWUFBWSxHQUFHLENBQUMsRUFBRTtVQUN2RCxXQUFXLEdBQUcsT0FBTztVQUNyQjtRQUNGO01BQ0Y7O01BRUE7TUFDQSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUU7UUFDZCxJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQUssWUFBWSxFQUFFO1VBQzNDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNsQixXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckI7O1FBRUY7TUFDQSxDQUFDLE1BQU07UUFDTCxJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQUssV0FBVyxFQUFFO1VBQzFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNsQixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEI7TUFDRjtJQUNGOztJQUVBO0lBQ0EsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLFFBQVEsRUFBRTtNQUN0QixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7SUFDN0I7RUFDRjtFQUVBLE9BQU87SUFDTCxNQUFNLFdBQUEsT0FBQSxFQUFJO01BQ047TUFDQSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDdEI7TUFDQSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQztJQUNsRCxDQUFDO0lBRUQsT0FBTyxXQUFBLFFBQUEsRUFBSTtNQUNULFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDO0lBQ3JEO0VBQ0YsQ0FBQztBQUNILENBQUM7QUFFRCxJQUFJLFNBQVM7QUFFYixJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBYSxNQUFNLEVBQUU7RUFDbEMsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUk7RUFDMUIsSUFBSSxPQUFPLE1BQU0sS0FBSyxTQUFTLEVBQUU7SUFDL0IsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDdEI7RUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO0VBRTNDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsVUFBQSxFQUFFLEVBQUk7SUFDN0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQztFQUM1QyxDQUFDLENBQUM7RUFDRixJQUFJLE1BQU0sRUFBRTtJQUNWLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNwQixDQUFDLE1BQU07SUFDTCxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDckI7RUFFQSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztFQUNwRCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztFQUU5QyxJQUFJLE1BQU0sSUFBSSxXQUFXLEVBQUU7SUFDekI7SUFDQTtJQUNBLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNyQixDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsYUFBYSxLQUFLLFdBQVcsSUFDakQsVUFBVSxFQUFFO0lBQ3JCO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDcEI7RUFFQSxPQUFPLE1BQU07QUFDZixDQUFDO0FBQUMsSUFBQSxRQUFBLEdBRWEsVUFBVTtBQUFBLE9BQUEsY0FBQSxRQUFBOzs7QUNyTXpCLFlBQVk7O0FBQUMsTUFBQSxDQUFBLGNBQUEsQ0FBQSxPQUFBO0VBQUEsS0FBQTtBQUFBO0FBQUEsT0FBQTtBQUNiLElBQU0sZ0JBQWdCLEdBQUcsZUFBZTs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGdCQUFnQixDQUFDLGdCQUFnQixFQUFDO0VBQ3ZDLElBQUksQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCO0VBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSTtFQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUk7QUFDeEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFXO0VBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQztFQUN2RSxJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBQztJQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDO0VBQ2xFO0VBQ0EsSUFBSSxJQUFJLEdBQUcsSUFBSTtFQUVmLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztJQUN6QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFFLENBQUMsQ0FBRTtJQUU5QixLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQVc7TUFDeEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDLENBQUUsQ0FBQztNQUNuQztJQUNKLENBQUMsQ0FBQztJQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0VBQ3RCO0FBQ0osQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxpQkFBaUIsRUFBQztFQUM1RCxJQUFJLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUM7RUFDaEUsSUFBRyxTQUFTLEtBQUssSUFBSSxJQUFJLFNBQVMsS0FBSyxTQUFTLElBQUksU0FBUyxLQUFLLEVBQUUsRUFBQztJQUNqRSxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUN0RCxJQUFHLGNBQWMsS0FBSyxJQUFJLElBQUksY0FBYyxLQUFLLFNBQVMsRUFBQztNQUN2RCxNQUFNLElBQUksS0FBSyxDQUFDLDZEQUE0RCxnQkFBZ0IsQ0FBQztJQUNqRztJQUNBLElBQUcsaUJBQWlCLENBQUMsT0FBTyxFQUFDO01BQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDO0lBQ2xELENBQUMsTUFBSTtNQUNELElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDO0lBQ3BEO0VBQ0o7QUFDSixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsaUJBQWlCLEVBQUUsY0FBYyxFQUFDO0VBQzVFLElBQUcsaUJBQWlCLEtBQUssSUFBSSxJQUFJLGlCQUFpQixLQUFLLFNBQVMsSUFBSSxjQUFjLEtBQUssSUFBSSxJQUFJLGNBQWMsS0FBSyxTQUFTLEVBQUM7SUFDeEgsaUJBQWlCLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUM7SUFDdkQsY0FBYyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO0lBQ25ELElBQUksU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDO0lBQy9DLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFDOUM7QUFDSixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBUyxpQkFBaUIsRUFBRSxjQUFjLEVBQUM7RUFDN0UsSUFBRyxpQkFBaUIsS0FBSyxJQUFJLElBQUksaUJBQWlCLEtBQUssU0FBUyxJQUFJLGNBQWMsS0FBSyxJQUFJLElBQUksY0FBYyxLQUFLLFNBQVMsRUFBQztJQUN4SCxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQztJQUN4RCxjQUFjLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7SUFDbEQsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUM7SUFDakQsaUJBQWlCLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztFQUMvQztBQUNKLENBQUM7QUFBQSxJQUFBLFFBQUEsR0FFYyxnQkFBZ0I7QUFBQSxPQUFBLGNBQUEsUUFBQTs7O0FDakYvQixZQUFZOztBQUFDLFNBQUEsUUFBQSxHQUFBLHNDQUFBLE9BQUEsd0JBQUEsTUFBQSx1QkFBQSxNQUFBLENBQUEsUUFBQSxhQUFBLEdBQUEsa0JBQUEsR0FBQSxnQkFBQSxHQUFBLFdBQUEsR0FBQSx5QkFBQSxNQUFBLElBQUEsR0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsR0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLEdBQUEsS0FBQSxPQUFBLENBQUEsR0FBQTtBQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsT0FBQTtFQUFBLEtBQUE7QUFBQTtBQUFBLE9BQUE7QUFBQSxTQUFBLGtCQUFBLE1BQUEsRUFBQSxLQUFBLGFBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsVUFBQSxVQUFBLEdBQUEsS0FBQSxDQUFBLENBQUEsR0FBQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLFdBQUEsVUFBQSxDQUFBLFlBQUEsd0JBQUEsVUFBQSxFQUFBLFVBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxNQUFBLEVBQUEsY0FBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQTtBQUFBLFNBQUEsYUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsUUFBQSxVQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLENBQUEsU0FBQSxFQUFBLFVBQUEsT0FBQSxXQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLEVBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsV0FBQSxpQkFBQSxRQUFBLG1CQUFBLFdBQUE7QUFBQSxTQUFBLGVBQUEsR0FBQSxRQUFBLEdBQUEsR0FBQSxZQUFBLENBQUEsR0FBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSxpQkFBQSxHQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUE7QUFBQSxTQUFBLGFBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxPQUFBLENBQUEsS0FBQSxrQkFBQSxLQUFBLGtCQUFBLEtBQUEsTUFBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLE9BQUEsSUFBQSxLQUFBLFNBQUEsUUFBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLEVBQUEsSUFBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSx1QkFBQSxHQUFBLFlBQUEsU0FBQSw0REFBQSxJQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBLEVBQUEsS0FBQTtBQUFBLFNBQUEsZ0JBQUEsUUFBQSxFQUFBLFdBQUEsVUFBQSxRQUFBLFlBQUEsV0FBQSxlQUFBLFNBQUE7QUFDYixJQUFNLGFBQWEsR0FBRztFQUNwQixLQUFLLEVBQUUsS0FBSztFQUNaLEdBQUcsRUFBRSxLQUFLO0VBQ1YsSUFBSSxFQUFFLEtBQUs7RUFDWCxPQUFPLEVBQUU7QUFDWCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEEsSUFNTSxjQUFjLGdCQUFBLFlBQUEsQ0FDbEIsU0FBQSxlQUFhLE9BQU8sRUFBQztFQUFBLGVBQUEsT0FBQSxjQUFBO0VBQ25CLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO0VBQzVDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO0FBQ2hELENBQUM7QUFFSCxJQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBYSxLQUFLLEVBQUU7RUFDL0IsSUFBRyxhQUFhLENBQUMsSUFBSSxJQUFJLGFBQWEsQ0FBQyxPQUFPLEVBQUU7SUFDOUM7RUFDRjtFQUNBLElBQUksT0FBTyxHQUFHLElBQUk7RUFDbEIsSUFBRyxPQUFPLEtBQUssQ0FBQyxHQUFHLEtBQUssV0FBVyxFQUFDO0lBQ2xDLElBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFDO01BQ3hCLE9BQU8sR0FBRyxLQUFLLENBQUMsR0FBRztJQUNyQjtFQUNGLENBQUMsTUFBTTtJQUNMLElBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFDO01BQ2pCLE9BQU8sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDOUMsQ0FBQyxNQUFNO01BQ0wsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztJQUMvQztFQUNGO0VBRUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQztFQUVwRCxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFDO0lBQ3BEO0VBQUEsQ0FDRCxNQUFLO0lBQ0osSUFBSSxPQUFPLEdBQUcsSUFBSTtJQUNsQixJQUFHLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFDO01BQzVCLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTTtJQUN4QjtJQUNBLElBQUcsT0FBTyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO01BQ3ZDLElBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7UUFDcEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFDekIsSUFBRyxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBQztVQUMzQixRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4QixDQUFDLE1BQUk7VUFDSCxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFDN0c7O1FBRUEsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzVCLElBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUM7VUFDM0IsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFO1lBQ3hCLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUN4QixDQUFDLE1BQU07WUFDTCxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUs7VUFDM0I7UUFDRjtNQUNGO0lBQ0Y7RUFDRjtBQUNGLENBQUM7QUFBQyxJQUFBLFFBQUEsR0FFYSxjQUFjO0FBQUEsT0FBQSxjQUFBLFFBQUE7OztBQ25FN0IsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUhBLE1BQUEsQ0FBQSxjQUFBLENBQUEsT0FBQTtFQUFBLEtBQUE7QUFBQTtBQUFBLE9BQUE7QUFJQSxTQUFTLG1CQUFtQixDQUFFLEtBQUssRUFBRTtFQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFVO0VBQzdDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDNUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztFQUMvQyxJQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFDO0lBQ3JDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO01BQ3BELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7TUFDeEMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQztNQUN4RCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDO0lBQ3ZEO0VBQ0Y7RUFDQSxJQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssS0FBSyxFQUFDO0lBQzlCLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDO0lBQ3BFLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDO0VBQ25FO0FBQ0YsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxZQUFVO0VBQ3pELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDO0VBQ2xHLElBQUcsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUM7SUFDdkIsT0FBTyxLQUFLO0VBQ2Q7RUFDQSxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRyxZQUFVO0VBQ3hELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUM7QUFDNUYsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsa0JBQWtCLENBQUMsQ0FBQyxFQUFDO0VBQzVCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNO0VBQ3ZCLFFBQVEsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDO0VBQ3hDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVTtFQUNoRSxJQUFJLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDO0VBQ3hELElBQUksWUFBWSxHQUFHLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0VBQ3hELElBQUksYUFBYSxHQUFHLENBQUM7RUFDckIsSUFBRyxRQUFRLENBQUMsT0FBTyxFQUFDO0lBQ2xCLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO01BQzFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSTtNQUM5QixZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDO0lBQzNFO0lBRUEsYUFBYSxHQUFHLFlBQVksQ0FBQyxNQUFNO0VBQ3JDLENBQUMsTUFBSztJQUNKLEtBQUksSUFBSSxFQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUMsRUFBRSxFQUFDO01BQzFDLFlBQVksQ0FBQyxFQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSztNQUMvQixZQUFZLENBQUMsRUFBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0lBQzlFO0VBQ0Y7RUFFQSxJQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyw4QkFBOEIsRUFBRTtJQUM1RCxPQUFPLEVBQUUsSUFBSTtJQUNiLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE1BQU0sRUFBRTtNQUFDLGFBQWEsRUFBYjtJQUFhO0VBQ3hCLENBQUMsQ0FBQztFQUNGLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO0FBQzVCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUM7RUFDMUI7RUFDQSxJQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFDO0lBQ2xCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDO0VBQ3BFLENBQUMsTUFBSztJQUNKLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0VBQ3ZFO0VBQ0EsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVO0VBQ2hFLElBQUksbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7RUFDeEQsSUFBSSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUMxRCxJQUFHLGFBQWEsS0FBSyxLQUFLLEVBQUM7SUFDekIsSUFBSSxZQUFZLEdBQUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDLENBQUM7O0lBRXhEO0lBQ0EsSUFBSSxhQUFhLEdBQUcsQ0FBQztJQUNyQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztNQUMxQyxJQUFJLGNBQWMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO01BQ3BDLElBQUcsY0FBYyxDQUFDLE9BQU8sRUFBQztRQUN4QixhQUFhLEVBQUU7TUFDakI7SUFDRjtJQUVBLElBQUcsYUFBYSxLQUFLLFlBQVksQ0FBQyxNQUFNLEVBQUM7TUFBRTtNQUN6QyxhQUFhLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQztNQUM3QyxhQUFhLENBQUMsT0FBTyxHQUFHLElBQUk7SUFDOUIsQ0FBQyxNQUFNLElBQUcsYUFBYSxJQUFJLENBQUMsRUFBQztNQUFFO01BQzdCLGFBQWEsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDO01BQzdDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsS0FBSztJQUMvQixDQUFDLE1BQUs7TUFBRTtNQUNOLGFBQWEsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQztNQUNuRCxhQUFhLENBQUMsT0FBTyxHQUFHLEtBQUs7SUFDL0I7SUFDQSxJQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyw4QkFBOEIsRUFBRTtNQUM1RCxPQUFPLEVBQUUsSUFBSTtNQUNiLFVBQVUsRUFBRSxJQUFJO01BQ2hCLE1BQU0sRUFBRTtRQUFDLGFBQWEsRUFBYjtNQUFhO0lBQ3hCLENBQUMsQ0FBQztJQUNGLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQzVCO0FBQ0Y7QUFBQyxJQUFBLFFBQUEsR0FFYyxtQkFBbUI7QUFBQSxPQUFBLGNBQUEsUUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FDOUhsQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7O0FBRXpDO0FBQ0E7QUFDQTtBQUZBLElBR00sZUFBZSxnQkFBQSxZQUFBLENBQ2pCLFNBQUEsZ0JBQVksS0FBSyxFQUFFO0VBQUEsZUFBQSxPQUFBLGVBQUE7RUFDZix3QkFBd0IsQ0FBQyxLQUFLLENBQUM7QUFDbkMsQ0FBQztBQUdMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUU7RUFDdkMsSUFBSSxDQUFDLE9BQU8sRUFBRTtFQUVkLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUM7RUFDbEQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtJQUNyQixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO0lBQ3hELElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7TUFDM0IsYUFBYSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7SUFDeEQ7SUFFQSxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQzFCLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO01BQzlDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxFQUFJO1FBQ3BDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFRO1FBQzVCLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxhQUFhLENBQUMsTUFBTSxFQUFFO1VBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsWUFBWSxFQUFFLENBQUMsRUFBSztZQUNuRDtZQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLFlBQVksQ0FBQyxPQUFPLEtBQUssSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7Y0FDMUgsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQztZQUNuRTtVQUNKLENBQUMsQ0FBQztRQUNOO01BQ0osQ0FBQyxDQUFDO0lBQ047RUFDSjtBQUNKO0FBQUMsSUFBQSxRQUFBLEdBRWMsZUFBZTtBQUFBLE9BQUEsY0FBQSxRQUFBOzs7QUMxQzlCLFlBQVk7O0FBQUMsTUFBQSxDQUFBLGNBQUEsQ0FBQSxPQUFBO0VBQUEsS0FBQTtBQUFBO0FBQUEsT0FBQTtBQUNiLElBQUksV0FBVyxHQUFHO0VBQ2hCLElBQUksRUFBRSxDQUFDO0VBQ1AsSUFBSSxFQUFFLEdBQUc7RUFDVCxJQUFJLEVBQUUsR0FBRztFQUNULElBQUksRUFBRSxHQUFHO0VBQ1QsSUFBSSxFQUFFO0FBQ1IsQ0FBQzs7QUFFRDtBQUNBLElBQUksSUFBSSxHQUFHO0VBQ1QsR0FBRyxFQUFFLEVBQUU7RUFDUCxJQUFJLEVBQUUsRUFBRTtFQUNSLElBQUksRUFBRSxFQUFFO0VBQ1IsRUFBRSxFQUFFLEVBQUU7RUFDTixLQUFLLEVBQUUsRUFBRTtFQUNULElBQUksRUFBRSxFQUFFO0VBQ1IsVUFBUTtBQUNWLENBQUM7O0FBRUQ7QUFDQSxJQUFJLFNBQVMsR0FBRztFQUNkLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDTixFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ04sRUFBRSxFQUFFLENBQUM7RUFDTCxFQUFFLEVBQUU7QUFDTixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxNQUFNLENBQUUsTUFBTSxFQUFFO0VBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTTtFQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUM7QUFDaEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsWUFBVTtFQUNoQyxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBQztJQUN4QixNQUFNLElBQUksS0FBSyw2SEFBNkgsQ0FBQztFQUMvSTs7RUFFQTtFQUNBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUU7SUFDdkI7SUFDQSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRTs7SUFFeEI7SUFDQSxJQUFJLGFBQWEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM5QyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQzlCLEdBQUcsR0FBRyxhQUFhLENBQUUsQ0FBQyxDQUFFO0lBQzFCOztJQUVBO0lBQ0EsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDO0VBQzlCO0VBQ0EsSUFBSSxPQUFPLEdBQUcsSUFBSTtFQUNsQjtFQUNBLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUcsRUFBQztJQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFVO01BQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO0lBQUEsQ0FBQyxDQUFDO0lBQ3RGLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDO0lBQ2hFLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDO0VBQzlEO0FBQ0YsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBUyxHQUFHLEVBQUUsUUFBUSxFQUFFO0VBQ3RELElBQUksSUFBSSxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQzs7RUFFaEM7RUFDQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDekMsSUFBSSxJQUFJLENBQUUsQ0FBQyxDQUFFLEtBQUssR0FBRyxFQUFFO01BQ3JCO0lBQ0Y7SUFFQSxJQUFJLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssTUFBTSxFQUFFO01BQ3RELElBQUksVUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDO01BQzlDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ3JDO0lBRUEsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO0lBQ3hDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQztJQUNoRCxJQUFJLFdBQVUsR0FBRyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQztJQUN4RCxJQUFJLFNBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVUsQ0FBQztJQUNsRCxJQUFHLFNBQVEsS0FBSyxJQUFJLEVBQUM7TUFDbkIsTUFBTSxJQUFJLEtBQUssMkJBQTJCLENBQUM7SUFDN0M7SUFDQSxTQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7RUFDOUM7O0VBRUE7RUFDQSxJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQztFQUNsRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQztFQUNsRCxJQUFHLFFBQVEsS0FBSyxJQUFJLEVBQUM7SUFDbkIsTUFBTSxJQUFJLEtBQUssa0NBQWtDLENBQUM7RUFDcEQ7RUFFQSxHQUFHLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUM7RUFDekMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO0VBQzdDLEdBQUcsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDOztFQUUvQjtFQUNBLElBQUksUUFBUSxFQUFFO0lBQ1osR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ2I7RUFFQSxJQUFJLFlBQVksR0FBRyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztFQUNsRCxHQUFHLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7RUFFMUMsSUFBSSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUM7RUFDNUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7QUFDOUIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsb0JBQW9CLENBQUUsS0FBSyxFQUFFO0VBQ3BDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPO0VBRXZCLFFBQVEsR0FBRztJQUNULEtBQUssSUFBSSxDQUFDLEdBQUc7TUFDWCxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7TUFDdEI7TUFDQSxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztNQUMxQjtJQUNGLEtBQUssSUFBSSxDQUFDLElBQUk7TUFDWixLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7TUFDdEI7TUFDQSxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztNQUMzQjtJQUNGO0lBQ0E7SUFDQSxLQUFLLElBQUksQ0FBQyxFQUFFO0lBQ1osS0FBSyxJQUFJLENBQUMsSUFBSTtNQUNaLG9CQUFvQixDQUFDLEtBQUssQ0FBQztNQUMzQjtFQUNKO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGtCQUFrQixDQUFFLEtBQUssRUFBRTtFQUNsQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTztFQUV2QixRQUFRLEdBQUc7SUFDVCxLQUFLLElBQUksQ0FBQyxJQUFJO0lBQ2QsS0FBSyxJQUFJLENBQUMsS0FBSztNQUNiLG9CQUFvQixDQUFDLEtBQUssQ0FBQztNQUMzQjtJQUNGLEtBQUssSUFBSSxVQUFPO01BQ2Q7SUFDRixLQUFLLElBQUksQ0FBQyxLQUFLO0lBQ2YsS0FBSyxJQUFJLENBQUMsS0FBSztNQUNiLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO01BQ25FO0VBQ0o7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxvQkFBb0IsQ0FBRSxLQUFLLEVBQUU7RUFDcEMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU87RUFFdkIsSUFBSSxDQUFDLEdBQUMsTUFBTTtJQUNWLENBQUMsR0FBQyxRQUFRO0lBQ1YsQ0FBQyxHQUFDLENBQUMsQ0FBQyxlQUFlO0lBQ25CLENBQUMsR0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUUsQ0FBQyxDQUFFO0lBQ3JDLENBQUMsR0FBQyxDQUFDLENBQUMsVUFBVSxJQUFFLENBQUMsQ0FBQyxXQUFXLElBQUUsQ0FBQyxDQUFDLFdBQVc7SUFDNUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxXQUFXLElBQUUsQ0FBQyxDQUFDLFlBQVksSUFBRSxDQUFDLENBQUMsWUFBWTtFQUVqRCxJQUFJLFFBQVEsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLEVBQUU7RUFDakMsSUFBSSxPQUFPLEdBQUcsS0FBSztFQUVuQixJQUFJLFFBQVEsRUFBRTtJQUNaLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFDeEMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO01BQ3RCLE9BQU8sR0FBRyxJQUFJO0lBQ2hCO0VBQ0YsQ0FBQyxNQUNJO0lBQ0gsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRTtNQUMzQyxPQUFPLEdBQUcsSUFBSTtJQUNoQjtFQUNGO0VBQ0EsSUFBSSxPQUFPLEVBQUU7SUFDWCxxQkFBcUIsQ0FBQyxLQUFLLENBQUM7RUFDOUI7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMscUJBQXFCLENBQUUsS0FBSyxFQUFFO0VBQ3JDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPO0VBQzNCLElBQUksU0FBUyxDQUFFLE9BQU8sQ0FBRSxFQUFFO0lBQ3hCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNO0lBQ3pCLElBQUksSUFBSSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQztJQUNuQyxJQUFJLEtBQUssR0FBRyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO0lBQ2pELElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO01BQ2hCLElBQUksSUFBSSxDQUFFLEtBQUssR0FBRyxTQUFTLENBQUUsT0FBTyxDQUFFLENBQUUsRUFBRTtRQUN4QyxJQUFJLENBQUUsS0FBSyxHQUFHLFNBQVMsQ0FBRSxPQUFPLENBQUUsQ0FBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzlDLENBQUMsTUFDSSxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsRUFBRSxFQUFFO1FBQ3JELFlBQVksQ0FBQyxNQUFNLENBQUM7TUFDdEIsQ0FBQyxNQUNJLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDdkQsYUFBYSxDQUFDLE1BQU0sQ0FBQztNQUN2QjtJQUNGO0VBQ0Y7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxhQUFhLENBQUUsTUFBTSxFQUFFO0VBQzlCLE9BQU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLHdDQUF3QyxDQUFDO0FBQzFFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGdCQUFnQixDQUFFLEdBQUcsRUFBRTtFQUM5QixJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVTtFQUMvQixJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0lBQzNDLE9BQU8sVUFBVSxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDO0VBQzFEO0VBQ0EsT0FBTyxFQUFFO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyx1QkFBdUIsQ0FBRSxPQUFPLEVBQUUsSUFBSSxFQUFDO0VBQzlDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztFQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3BDLElBQUcsSUFBSSxDQUFFLENBQUMsQ0FBRSxLQUFLLE9BQU8sRUFBQztNQUN2QixLQUFLLEdBQUcsQ0FBQztNQUNUO0lBQ0Y7RUFDRjtFQUVBLE9BQU8sS0FBSztBQUNkOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxnQkFBZ0IsQ0FBQSxFQUFJO0VBQzNCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7RUFDekMsSUFBSSxJQUFJLEtBQUssRUFBRSxFQUFFO0lBQ2YsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxxQ0FBcUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JGLElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtNQUNoQixXQUFXLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQztNQUN2QixPQUFPLElBQUk7SUFDYjtFQUNGO0VBQ0EsT0FBTyxLQUFLO0FBQ2Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGFBQWEsQ0FBRSxHQUFHLEVBQUU7RUFDM0IsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFlBQVksQ0FBRSxHQUFHLEVBQUU7RUFDMUIsSUFBSSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO0VBQ2hDLElBQUksQ0FBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pDO0FBQUMsSUFBQSxRQUFBLEdBRWMsTUFBTTtBQUFBLE9BQUEsY0FBQSxRQUFBOzs7QUMzU3JCLFlBQVk7O0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFIQSxNQUFBLENBQUEsY0FBQSxDQUFBLE9BQUE7RUFBQSxLQUFBO0FBQUE7QUFBQSxPQUFBO0FBSUEsU0FBUyxLQUFLLENBQUUsT0FBTyxFQUFDO0VBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTztBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFVO0VBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7RUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztFQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFVO0lBQ3RGLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVTtJQUN0QyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUMzQixDQUFDLENBQUM7RUFDRixxQkFBcUIsQ0FBQyxTQUFTLENBQUM7QUFDcEMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFVO0VBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7RUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUN0QyxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFNBQVMsU0FBUyxDQUFBLEVBQUU7RUFDaEIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDO0VBQ3hELEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO0lBQ2xDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ2pDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztFQUMvQjtBQUNKO0FBQUMsSUFBQSxRQUFBLEdBRWMsS0FBSztBQUFBLE9BQUEsY0FBQSxRQUFBOzs7QUMxQ3BCLFlBQVk7O0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLE9BQU8sQ0FBQyxPQUFPLEVBQUU7RUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPO0VBQ3RCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ3BELE1BQU0sSUFBSSxLQUFLLCtGQUErRixDQUFDO0VBQ25IO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsWUFBWTtFQUNqQyxJQUFJLE1BQU0sR0FBRyxJQUFJO0VBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxFQUFFO0lBQ3JELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNO0lBQ3RCLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssS0FBSyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEtBQUssRUFBRTtNQUNoSCxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7TUFDbkIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO01BQ3RDLFVBQVUsQ0FBQyxZQUFZO1FBQ25CLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUU7VUFDN0MsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU07VUFFdEIsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLEtBQUssSUFBSSxFQUFFO1VBQ3ZELFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDdkI7TUFDSixDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQ1g7RUFDSixDQUFDLENBQUM7RUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsRUFBRTtJQUNyRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTTtJQUN0QixJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFO01BQzdDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztNQUN6QyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDO01BQ3hELElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDO01BQ3ZELElBQUksY0FBYyxLQUFLLElBQUksRUFBRTtRQUN6QixpQkFBaUIsQ0FBQyxPQUFPLENBQUM7TUFDOUI7SUFDSjtFQUNKLENBQUMsQ0FBQztFQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0lBQ3BELElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU87SUFDdEMsSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFO01BQ1osSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQztNQUNuRCxJQUFJLE9BQU8sS0FBSyxJQUFJLElBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDL0QsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUMvRDtNQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztNQUMvQixJQUFJLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDO0lBQzVDO0VBQ0osQ0FBQyxDQUFDO0VBRUYsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLE9BQU8sRUFBRTtJQUMvRCxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsRUFBRTtNQUNoRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTTtNQUN0QixnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7TUFDbkIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO01BQ3RDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztNQUN6QyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsS0FBSyxJQUFJLEVBQUU7TUFDdkQsVUFBVSxDQUFDLE9BQU8sQ0FBQztJQUN2QixDQUFDLENBQUM7RUFDTjtFQUVBLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUM7RUFDdkYsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQztBQUN4RixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFNBQVMsUUFBUSxDQUFBLEVBQUc7RUFDaEIsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLCtCQUErQixDQUFDO0VBQ3pFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3RDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUM7SUFDekQsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQztJQUMvQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzlEO0FBQ0o7QUFFQSxTQUFTLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDekIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEtBQUs7RUFFaEUsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUM7RUFFekMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO0VBRWxDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQztBQUNyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0VBQ2pDLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQzNDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCO0VBQ3BDLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQztFQUMvRCxJQUFJLEVBQUUsR0FBRyxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDO0VBQ3hDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztFQUM5QixPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7RUFDdkMsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDO0VBQ3hDLE9BQU8sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDO0VBRTVDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQ2hELFlBQVksQ0FBQyxTQUFTLEdBQUcsU0FBUztFQUVsQyxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUNoRCxZQUFZLENBQUMsU0FBUyxHQUFHLGVBQWU7RUFDeEMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7RUFFdEMsSUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDbEQsY0FBYyxDQUFDLFNBQVMsR0FBRyxpQkFBaUI7RUFDNUMsY0FBYyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQztFQUMvRCxZQUFZLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQztFQUN4QyxPQUFPLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztFQUVqQyxPQUFPLE9BQU87QUFDbEI7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUU7RUFDdEMsSUFBSSxPQUFPLEdBQUcsTUFBTTtFQUNwQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlELElBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0VBRXBELElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQUUsSUFBSTtJQUFFLEdBQUc7RUFFNUQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFdBQVc7RUFFdEMsSUFBSSxJQUFJLEdBQUcsRUFBRTtFQUNiLElBQUksY0FBYyxHQUFHLE1BQU07RUFDM0IsSUFBSSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLElBQUksQ0FBRTtFQUVyRixRQUFRLEdBQUc7SUFDUCxLQUFLLFFBQVE7TUFDVCxHQUFHLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJO01BQzFDLGNBQWMsR0FBRyxJQUFJO01BQ3JCO0lBRUo7SUFDQSxLQUFLLEtBQUs7TUFDTixHQUFHLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsWUFBWSxHQUFHLElBQUk7RUFDdEU7O0VBRUE7RUFDQSxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7SUFDVixJQUFJLEdBQUcsSUFBSTtJQUNYLElBQUksaUJBQWlCLEdBQUcsZUFBZSxDQUFDLElBQUksR0FBSSxPQUFPLENBQUMsV0FBVyxHQUFHLENBQUU7SUFDeEUsSUFBSSxxQkFBcUIsR0FBRyxDQUFDO0lBQzdCLElBQUksaUJBQWlCLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxHQUFHLHFCQUFxQjtJQUN4RSxPQUFPLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxpQkFBaUIsR0FBRyxJQUFJO0VBQzVGOztFQUVBO0VBQ0EsSUFBSyxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksSUFBSyxNQUFNLENBQUMsV0FBVyxFQUFFO0lBQ3BELEdBQUcsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSTtJQUM5RCxjQUFjLEdBQUcsTUFBTTtFQUMzQjs7RUFFQTtFQUNBLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtJQUNULEdBQUcsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUk7SUFDMUMsY0FBYyxHQUFHLElBQUk7RUFDekI7RUFFQSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEdBQUksSUFBSSxHQUFHLFlBQWEsRUFBRTtJQUMzQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsSUFBSTtJQUNqQyxJQUFJLGtCQUFpQixHQUFHLGVBQWUsQ0FBQyxLQUFLLEdBQUksT0FBTyxDQUFDLFdBQVcsR0FBRyxDQUFFO0lBQ3pFLElBQUksc0JBQXFCLEdBQUcsQ0FBQztJQUM3QixJQUFJLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsa0JBQWlCLEdBQUcsSUFBSSxHQUFHLHNCQUFxQjtJQUM3RixPQUFPLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxrQkFBa0IsR0FBRyxJQUFJO0lBQzFGLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU07RUFDMUUsQ0FBQyxNQUFNO0lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUk7RUFDcEM7RUFDQSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsV0FBVyxHQUFHLElBQUk7RUFDNUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ3BGO0FBR0EsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQWlCO0VBQUEsSUFBZixLQUFLLEdBQUEsU0FBQSxDQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsTUFBRyxLQUFLO0VBQzFDLElBQUksS0FBSyxJQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFFLEVBQUU7SUFDakssSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDO0lBQzNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3RDLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7TUFDakcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQztNQUM5QyxPQUFPLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDO01BQzNDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztNQUN6QyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7TUFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDO0VBQ0o7QUFDSjtBQUVBLFNBQVMsaUJBQWlCLENBQUMsT0FBTyxFQUFFO0VBQ2hDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUM7RUFDeEQsSUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUM7RUFDdkQsY0FBYyxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxjQUFjLENBQUM7RUFDaEUsY0FBYyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxjQUFjLENBQUM7RUFDN0QsVUFBVSxDQUFDLFlBQVk7SUFDbkIsSUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUM7SUFDdkQsSUFBSSxjQUFjLEtBQUssSUFBSSxFQUFFO01BQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRTtRQUM5QyxhQUFhLENBQUMsT0FBTyxDQUFDO01BQzFCO0lBQ0o7RUFDSixDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQ1g7QUFFQSxTQUFTLGNBQWMsQ0FBQyxDQUFDLEVBQUU7RUFDdkIsSUFBSSxjQUFjLEdBQUcsSUFBSTtFQUV6QixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLG9CQUFvQixHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO0VBQ3BHLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztFQUV0QyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFlBQVk7SUFDdEQsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsR0FBRyxjQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUNwRyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7TUFDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDO01BQ3pDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQztJQUM5QjtFQUNKLENBQUMsQ0FBQztBQUNOO0FBRUEsU0FBUyxhQUFhLENBQUMsT0FBTyxFQUFFO0VBQzVCLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUM7RUFDeEQsSUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUM7RUFFdkQsSUFBSSxTQUFTLEtBQUssSUFBSSxJQUFJLGNBQWMsS0FBSyxJQUFJLEVBQUU7SUFDL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDO0VBQzdDO0VBQ0EsT0FBTyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQztFQUMzQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7RUFDekMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDO0FBQzdDO0FBRUEsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPOzs7OztBQzVQeEIsTUFBTSxDQUFDLE9BQU8sR0FBRztFQUNmLE1BQU0sRUFBRTtBQUNWLENBQUM7OztBQ0ZELFlBQVk7O0FBQ1osSUFBQSxVQUFBLEdBQUEsc0JBQUEsQ0FBQSxPQUFBO0FBQ0EsSUFBQSxNQUFBLEdBQUEsc0JBQUEsQ0FBQSxPQUFBO0FBQ0EsSUFBQSxVQUFBLEdBQUEsc0JBQUEsQ0FBQSxPQUFBO0FBQ0EsSUFBQSxlQUFBLEdBQUEsc0JBQUEsQ0FBQSxPQUFBO0FBQ0EsSUFBQSxzQkFBQSxHQUFBLHNCQUFBLENBQUEsT0FBQTtBQUNBLElBQUEsU0FBQSxHQUFBLHNCQUFBLENBQUEsT0FBQTtBQUNBLElBQUEsYUFBQSxHQUFBLHNCQUFBLENBQUEsT0FBQTtBQUNBLElBQUEsYUFBQSxHQUFBLHNCQUFBLENBQUEsT0FBQTtBQUNBLElBQUEsZUFBQSxHQUFBLHNCQUFBLENBQUEsT0FBQTtBQUNBLElBQUEsTUFBQSxHQUFBLHNCQUFBLENBQUEsT0FBQTtBQUNBLElBQUEsV0FBQSxHQUFBLHNCQUFBLENBQUEsT0FBQTtBQUNBLElBQUEsbUJBQUEsR0FBQSxzQkFBQSxDQUFBLE9BQUE7QUFDQSxJQUFBLE1BQUEsR0FBQSxzQkFBQSxDQUFBLE9BQUE7QUFDQSxJQUFBLE9BQUEsR0FBQSxzQkFBQSxDQUFBLE9BQUE7QUFDQSxJQUFBLGdCQUFBLEdBQUEsc0JBQUEsQ0FBQSxPQUFBO0FBQ0EsSUFBQSxNQUFBLEdBQUEsc0JBQUEsQ0FBQSxPQUFBO0FBQ0EsSUFBQSxRQUFBLEdBQUEsc0JBQUEsQ0FBQSxPQUFBO0FBQTJDLFNBQUEsdUJBQUEsR0FBQSxXQUFBLEdBQUEsSUFBQSxHQUFBLENBQUEsVUFBQSxHQUFBLEdBQUEsZ0JBQUEsR0FBQTtBQUMzQyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUM7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLENBQUMsYUFBYSxDQUFDOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxDQUFhLE9BQU8sRUFBRTtFQUM1QjtFQUNBLE9BQU8sR0FBRyxPQUFPLE9BQU8sS0FBSyxXQUFXLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQzs7RUFFdkQ7RUFDQTtFQUNBLElBQUksS0FBSyxHQUFHLE9BQU8sT0FBTyxDQUFDLEtBQUssS0FBSyxXQUFXLEdBQUcsT0FBTyxDQUFDLEtBQUssR0FBRyxRQUFROztFQUUzRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0VBQ0UsSUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDO0VBQ3JFLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7SUFDakQsSUFBSSxxQkFBUyxDQUFDLG1CQUFtQixDQUFFLENBQUMsQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDaEQ7RUFDQSxJQUFNLDJCQUEyQixHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxxQ0FBcUMsQ0FBQztFQUNqRyxLQUFJLElBQUksRUFBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEdBQUcsMkJBQTJCLENBQUMsTUFBTSxFQUFFLEVBQUMsRUFBRSxFQUFDO0lBQ3pELElBQUkscUJBQVMsQ0FBQywyQkFBMkIsQ0FBRSxFQUFDLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3hEOztFQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0VBRUUsSUFBTSxxQkFBcUIsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7RUFDeEUsS0FBSSxJQUFJLEdBQUMsR0FBRyxDQUFDLEVBQUUsR0FBQyxHQUFHLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxHQUFDLEVBQUUsRUFBQztJQUNuRCxJQUFJLGlCQUFLLENBQUMscUJBQXFCLENBQUUsR0FBQyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM5Qzs7RUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztFQUVFLElBQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixDQUFDLG9CQUFvQixDQUFDO0VBQzNFLEtBQUksSUFBSSxHQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBQyxFQUFFLEVBQUM7SUFDOUMsSUFBSSxxQkFBUyxDQUFDLGdCQUFnQixDQUFFLEdBQUMsQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0M7O0VBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtFQUNFLElBQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQztFQUNuRSxLQUFJLElBQUksR0FBQyxHQUFHLENBQUMsRUFBRSxHQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRSxFQUFDO0lBRTlDLElBQUksMEJBQWMsQ0FBQyxnQkFBZ0IsQ0FBRSxHQUFDLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2xEOztFQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7RUFDRSxJQUFNLDBCQUEwQixHQUFHLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyw0QkFBNEIsQ0FBQztFQUM3RixLQUFJLElBQUksR0FBQyxHQUFHLENBQUMsRUFBRSxHQUFDLEdBQUcsMEJBQTBCLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRSxFQUFDO0lBQ3hELElBQUksaUNBQXFCLENBQUMsMEJBQTBCLENBQUUsR0FBQyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNuRTs7RUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0VBQ0UsSUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDO0VBQ3RFLEtBQUksSUFBSSxHQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUMsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsR0FBQyxFQUFFLEVBQUM7SUFDaEQsSUFBSSxvQkFBUSxDQUFDLGtCQUFrQixDQUFFLEdBQUMsQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDOUM7O0VBR0E7QUFDRjtBQUNBO0FBQ0E7QUFDQTtFQUNFLElBQU0sc0JBQXNCLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixDQUFDLHFCQUFxQixDQUFDO0VBQ2xGLEtBQUksSUFBSSxHQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUMsR0FBRyxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsR0FBQyxFQUFFLEVBQUM7SUFDcEQsSUFBSSx3QkFBWSxDQUFDLHNCQUFzQixDQUFFLEdBQUMsQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDdEQ7O0VBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtFQUNFLFVBQVUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDOztFQUVwQjtBQUNGO0FBQ0E7QUFDQTtBQUNBO0VBQ0UsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQztFQUN4RSxJQUFJLHdCQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7O0VBRXRDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7RUFDRSxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMseUJBQXlCLENBQUM7RUFDekUsS0FBSSxJQUFJLEdBQUMsR0FBRyxDQUFDLEVBQUUsR0FBQyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsR0FBQyxFQUFFLEVBQUM7SUFDN0MsSUFBSSwwQkFBYyxDQUFDLGVBQWUsQ0FBRSxHQUFDLENBQUUsQ0FBQztFQUMxQzs7RUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0VBQ0UsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQztFQUNuRCxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNyQyxJQUFJLGlCQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0I7O0VBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtFQUNFLElBQUksc0JBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7O0VBRXZCO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7RUFDRSxJQUFNLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyx1QkFBdUIsQ0FBQztFQUNyRixLQUFJLElBQUksR0FBQyxHQUFHLENBQUMsRUFBRSxHQUFDLEdBQUcsdUJBQXVCLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRSxFQUFDO0lBQ3JELElBQUksOEJBQWdCLENBQUMsdUJBQXVCLENBQUUsR0FBQyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUMzRDs7RUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0VBQ0UsSUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLDBJQUEwSSxDQUFDO0VBQzFMLEtBQUksSUFBSSxJQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUMsR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUMsRUFBRSxFQUFDO0lBQzdDLElBQUksaUJBQWUsQ0FBQyxlQUFlLENBQUUsSUFBQyxDQUFFLENBQUM7RUFDM0M7O0VBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtFQUNFLElBQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDO0VBQzNFLEtBQUksSUFBSSxJQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsSUFBQyxFQUFFLEVBQUM7SUFDL0MsSUFBSSwyQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBRSxJQUFDLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3hEOztFQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7RUFDRSxJQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUM7RUFDL0QsS0FBSSxJQUFJLElBQUMsR0FBRyxDQUFDLEVBQUUsSUFBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFDLEVBQUUsRUFBQztJQUM5QyxJQUFJLGtCQUFNLENBQUMsZ0JBQWdCLENBQUUsSUFBQyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUMxQzs7RUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0VBQ0UsSUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDO0VBQ3BFLEtBQUksSUFBSSxJQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsSUFBQyxFQUFFLEVBQUM7SUFDL0MsSUFBSSxtQkFBTyxDQUFDLGlCQUFpQixDQUFFLElBQUMsQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDNUM7QUFFRixDQUFDO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRztFQUFFLElBQUksRUFBSixJQUFJO0VBQUUsU0FBUyxFQUFULHFCQUFTO0VBQUUsS0FBSyxFQUFMLGlCQUFLO0VBQUUsU0FBUyxFQUFULHFCQUFTO0VBQUUsY0FBYyxFQUFkLDBCQUFjO0VBQUUscUJBQXFCLEVBQXJCLGlDQUFxQjtFQUFFLFFBQVEsRUFBUixvQkFBUTtFQUFFLFlBQVksRUFBWix3QkFBWTtFQUFFLFVBQVUsRUFBVixVQUFVO0VBQUUsWUFBWSxFQUFaLHdCQUFZO0VBQUUsY0FBYyxFQUFkLDBCQUFjO0VBQUUsS0FBSyxFQUFMLGlCQUFLO0VBQUUsVUFBVSxFQUFWLHNCQUFVO0VBQUUsZ0JBQWdCLEVBQWhCLDhCQUFnQjtFQUFFLGVBQWUsRUFBZixpQkFBZTtFQUFFLG1CQUFtQixFQUFuQiwyQkFBbUI7RUFBRSxNQUFNLEVBQU4sa0JBQU07RUFBRSxLQUFLLEVBQUwsaUJBQUs7RUFBRSxPQUFPLEVBQVA7QUFBTyxDQUFDOzs7OztBQ2pOalEsTUFBTSxDQUFDLE9BQU8sR0FBRztFQUNmO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEtBQUssRUFBRTtBQUNULENBQUM7Ozs7OztBQ2RELE9BQUE7QUFBb0MsU0FBQSxRQUFBLEdBQUEsc0NBQUEsT0FBQSx3QkFBQSxNQUFBLHVCQUFBLE1BQUEsQ0FBQSxRQUFBLGFBQUEsR0FBQSxrQkFBQSxHQUFBLGdCQUFBLEdBQUEsV0FBQSxHQUFBLHlCQUFBLE1BQUEsSUFBQSxHQUFBLENBQUEsV0FBQSxLQUFBLE1BQUEsSUFBQSxHQUFBLEtBQUEsTUFBQSxDQUFBLFNBQUEscUJBQUEsR0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBO0FBRXBDLENBQUMsVUFBUyxTQUFTLEVBQUU7RUFDbkI7RUFDQSxJQUFJLE1BQU0sSUFBRyxNQUFNLElBQUksUUFBUSxDQUFDLFNBQVM7RUFFekMsSUFBSSxNQUFNLEVBQUU7O0VBRVo7RUFDQSxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFO0lBQzlDLEtBQUssRUFBRSxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFBRTtNQUN6QjtNQUNBLElBQUksTUFBTSxHQUFHLEtBQUs7TUFDbEIsSUFBSSxPQUFPLEdBQUcsTUFBTTtNQUNwQixJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsU0FBUztNQUN2QyxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsU0FBUztNQUNyQyxJQUFJLEtBQUssR0FBRyxTQUFTLEtBQUssQ0FBQSxFQUFHLENBQUMsQ0FBQztNQUMvQixJQUFJLFNBQVMsR0FBRyxlQUFlLENBQUMsUUFBUTtNQUN4QyxJQUFJLGNBQWMsR0FBRyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksT0FBQSxDQUFPLE1BQU0sQ0FBQyxXQUFXLE1BQUssUUFBUTtNQUMzRixJQUFJLFVBQVUsQ0FBQyxDQUFDO01BQWlELElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUTtRQUFFLGlCQUFpQixHQUFHLFNBQVMsaUJBQWlCLENBQUMsS0FBSyxFQUFFO1VBQUUsSUFBSTtZQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJO1VBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQUUsT0FBTyxLQUFLO1VBQUU7UUFBRSxDQUFDO1FBQUUsT0FBTyxHQUFHLG1CQUFtQjtRQUFFLFFBQVEsR0FBRyw0QkFBNEI7TUFBRSxVQUFVLEdBQUcsU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFO1FBQUUsSUFBSSxPQUFPLEtBQUssS0FBSyxVQUFVLEVBQUU7VUFBRSxPQUFPLEtBQUs7UUFBRTtRQUFFLElBQUksY0FBYyxFQUFFO1VBQUUsT0FBTyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7UUFBRTtRQUFFLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQUUsT0FBTyxRQUFRLEtBQUssT0FBTyxJQUFJLFFBQVEsS0FBSyxRQUFRO01BQUUsQ0FBQztNQUN4aUIsSUFBSSxXQUFXLEdBQUcsY0FBYyxDQUFDLEtBQUs7TUFDdEMsSUFBSSxZQUFZLEdBQUcsY0FBYyxDQUFDLE1BQU07TUFDeEMsSUFBSSxVQUFVLEdBQUcsY0FBYyxDQUFDLElBQUk7TUFDcEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUc7TUFDbEI7O01BRUE7TUFDQSxJQUFJLE1BQU0sR0FBRyxJQUFJO01BQ2pCO01BQ0EsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNyQixNQUFNLElBQUksU0FBUyxDQUFDLGlEQUFpRCxHQUFHLE1BQU0sQ0FBQztNQUNuRjtNQUNBO01BQ0E7TUFDQTtNQUNBLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDM0M7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0EsSUFBSSxLQUFLO01BQ1QsSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUEsRUFBZTtRQUVyQixJQUFJLElBQUksWUFBWSxLQUFLLEVBQUU7VUFDdkI7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQ3JCLElBQUksRUFDSixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUN2RCxDQUFDO1VBQ0QsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssTUFBTSxFQUFFO1lBQzVCLE9BQU8sTUFBTTtVQUNqQjtVQUNBLE9BQU8sSUFBSTtRQUVmLENBQUMsTUFBTTtVQUNIO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQ2YsSUFBSSxFQUNKLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQ3ZELENBQUM7UUFFTDtNQUVKLENBQUM7O01BRUQ7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFFQSxJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7TUFFckQ7TUFDQTtNQUNBLElBQUksU0FBUyxHQUFHLEVBQUU7TUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO01BQ3ZDOztNQUVBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsNENBQTRDLENBQUMsQ0FBQyxNQUFNLENBQUM7TUFFNUgsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVM7UUFDbEMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDO1FBQzdCO1FBQ0EsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJO01BQzFCOztNQUVBO01BQ0E7O01BRUE7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7O01BRUE7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFFQTtNQUNBLE9BQU8sS0FBSztJQUNoQjtFQUNKLENBQUMsQ0FBQztBQUNKLENBQUMsRUFDQSxJQUFJLENBQUMsUUFBUSxhQUFZLE1BQU0saUNBQUEsT0FBQSxDQUFOLE1BQU0sTUFBSSxNQUFNLElBQUksUUFBUSxhQUFZLElBQUksaUNBQUEsT0FBQSxDQUFKLElBQUksTUFBSSxJQUFJLElBQUksUUFBUSxhQUFZLE1BQU0saUNBQUEsT0FBQSxDQUFOLE1BQU0sTUFBSSxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7OztBQzlKN0gsQ0FBQyxVQUFTLFNBQVMsRUFBRTtFQUVyQjtFQUNBLElBQUksTUFBTTtFQUNSO0VBQ0E7RUFDQSxnQkFBZ0IsSUFBSSxNQUFNLElBQUssWUFBVztJQUN6QyxJQUFJO01BQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ1YsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFO1FBQUMsS0FBSyxFQUFDO01BQUUsQ0FBQyxDQUFDO01BQzVDLE9BQU8sSUFBSTtJQUNaLENBQUMsQ0FBQyxPQUFNLENBQUMsRUFBRTtNQUNWLE9BQU8sS0FBSztJQUNiO0VBQ0QsQ0FBQyxDQUFDLENBQ0g7RUFFRCxJQUFJLE1BQU0sRUFBRTs7RUFFWjtFQUNDLFdBQVUsb0JBQW9CLEVBQUU7SUFFaEMsSUFBSSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQztJQUMzRSxJQUFJLDJCQUEyQixHQUFHLCtEQUErRDtJQUNqRyxJQUFJLG1CQUFtQixHQUFHLHVFQUF1RTtJQUVqRyxNQUFNLENBQUMsY0FBYyxHQUFHLFNBQVMsY0FBYyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFO01BRTdFO01BQ0EsSUFBSSxvQkFBb0IsS0FBSyxNQUFNLEtBQUssTUFBTSxJQUFJLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxLQUFLLE9BQU8sQ0FBQyxTQUFTLElBQUksTUFBTSxZQUFZLE9BQU8sQ0FBQyxFQUFFO1FBQ3BJLE9BQU8sb0JBQW9CLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUM7TUFDMUQ7TUFFQSxJQUFJLE1BQU0sS0FBSyxJQUFJLElBQUksRUFBRSxNQUFNLFlBQVksTUFBTSxJQUFJLE9BQUEsQ0FBTyxNQUFNLE1BQUssUUFBUSxDQUFDLEVBQUU7UUFDakYsTUFBTSxJQUFJLFNBQVMsQ0FBQyw0Q0FBNEMsQ0FBQztNQUNsRTtNQUVBLElBQUksRUFBRSxVQUFVLFlBQVksTUFBTSxDQUFDLEVBQUU7UUFDcEMsTUFBTSxJQUFJLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQztNQUM5RDtNQUVBLElBQUksY0FBYyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7TUFDckMsSUFBSSxrQkFBa0IsR0FBRyxPQUFPLElBQUksVUFBVSxJQUFJLFVBQVUsSUFBSSxVQUFVO01BQzFFLElBQUksVUFBVSxHQUFHLEtBQUssSUFBSSxVQUFVLElBQUEsT0FBQSxDQUFXLFVBQVUsQ0FBQyxHQUFHO01BQzdELElBQUksVUFBVSxHQUFHLEtBQUssSUFBSSxVQUFVLElBQUEsT0FBQSxDQUFXLFVBQVUsQ0FBQyxHQUFHOztNQUU3RDtNQUNBLElBQUksVUFBVSxFQUFFO1FBQ2YsSUFBSSxVQUFVLEtBQUssVUFBVSxFQUFFO1VBQzlCLE1BQU0sSUFBSSxTQUFTLENBQUMsMkJBQTJCLENBQUM7UUFDakQ7UUFDQSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7VUFDdkIsTUFBTSxJQUFJLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQztRQUNqRDtRQUNBLElBQUksa0JBQWtCLEVBQUU7VUFDdkIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQztRQUN6QztRQUNBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDO01BQ3JFLENBQUMsTUFBTTtRQUNOLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSztNQUMxQzs7TUFFQTtNQUNBLElBQUksVUFBVSxFQUFFO1FBQ2YsSUFBSSxVQUFVLEtBQUssVUFBVSxFQUFFO1VBQzlCLE1BQU0sSUFBSSxTQUFTLENBQUMsMkJBQTJCLENBQUM7UUFDakQ7UUFDQSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7VUFDdkIsTUFBTSxJQUFJLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQztRQUNqRDtRQUNBLElBQUksa0JBQWtCLEVBQUU7VUFDdkIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQztRQUN6QztRQUNBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDO01BQ3JFOztNQUVBO01BQ0EsSUFBSSxPQUFPLElBQUksVUFBVSxFQUFFO1FBQzFCLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSztNQUMxQztNQUVBLE9BQU8sTUFBTTtJQUNkLENBQUM7RUFDRixDQUFDLEVBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUN4QixDQUFDLEVBQ0EsSUFBSSxDQUFDLFFBQVEsYUFBWSxNQUFNLGlDQUFBLE9BQUEsQ0FBTixNQUFNLE1BQUksTUFBTSxJQUFJLFFBQVEsYUFBWSxJQUFJLGlDQUFBLE9BQUEsQ0FBSixJQUFJLE1BQUksSUFBSSxJQUFJLFFBQVEsYUFBWSxNQUFNLGlDQUFBLE9BQUEsQ0FBTixNQUFNLE1BQUksTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7Ozs7O0FDckY3SDtBQUNBO0FBQ0EsQ0FBQyxZQUFZO0VBQ1gsSUFBSSxPQUFPLE1BQU0sQ0FBQyxXQUFXLEtBQUssVUFBVSxFQUFFLE9BQU8sS0FBSztFQUUxRCxTQUFTLFdBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0lBQ25DLElBQU0sTUFBTSxHQUFHLE9BQU8sSUFBSTtNQUN4QixPQUFPLEVBQUUsS0FBSztNQUNkLFVBQVUsRUFBRSxLQUFLO01BQ2pCLE1BQU0sRUFBRTtJQUNWLENBQUM7SUFDRCxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztJQUMvQyxHQUFHLENBQUMsZUFBZSxDQUNqQixLQUFLLEVBQ0wsTUFBTSxDQUFDLE9BQU8sRUFDZCxNQUFNLENBQUMsVUFBVSxFQUNqQixNQUFNLENBQUMsTUFDVCxDQUFDO0lBQ0QsT0FBTyxHQUFHO0VBQ1o7RUFFQSxNQUFNLENBQUMsV0FBVyxHQUFHLFdBQVc7QUFDbEMsQ0FBQyxFQUFFLENBQUM7OztBQ3RCSixZQUFZOztBQUNaLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUztBQUM1QyxJQUFNLE1BQU0sR0FBRyxRQUFRO0FBRXZCLElBQUksRUFBRSxNQUFNLElBQUksT0FBTyxDQUFDLEVBQUU7RUFDeEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO0lBQ3JDLEdBQUcsRUFBRSxTQUFBLElBQUEsRUFBWTtNQUNmLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7SUFDbEMsQ0FBQztJQUNELEdBQUcsRUFBRSxTQUFBLElBQVUsS0FBSyxFQUFFO01BQ3BCLElBQUksS0FBSyxFQUFFO1FBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO01BQy9CLENBQUMsTUFBTTtRQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO01BQzlCO0lBQ0Y7RUFDRixDQUFDLENBQUM7QUFDSjs7O0FDakJBLFlBQVk7O0FBQ1o7QUFDQSxPQUFPLENBQUMsb0JBQW9CLENBQUM7QUFDN0I7QUFDQSxPQUFPLENBQUMsa0JBQWtCLENBQUM7O0FBRTNCO0FBQ0EsT0FBTyxDQUFDLGlCQUFpQixDQUFDOztBQUUxQjtBQUNBLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztBQUV6QixPQUFPLENBQUMsMEJBQTBCLENBQUM7QUFDbkMsT0FBTyxDQUFDLHVCQUF1QixDQUFDOzs7OztBQ2JoQyxNQUFNLENBQUMsS0FBSyxHQUNWLE1BQU0sQ0FBQyxLQUFLLElBQ1osU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFO0VBQ3BCO0VBQ0EsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLEtBQUs7QUFDckQsQ0FBQzs7Ozs7QUNMSCxNQUFNLENBQUMsT0FBTyxHQUFHO0VBQUEsSUFBQyxZQUFZLEdBQUEsU0FBQSxDQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsTUFBRyxRQUFRO0VBQUEsT0FBSyxZQUFZLENBQUMsYUFBYTtBQUFBOzs7OztBQ0F4RSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO0FBQ3ZDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUE7RUFBQSxTQUFBLElBQUEsR0FBQSxTQUFBLENBQUEsTUFBQSxFQUFPLEdBQUcsT0FBQSxLQUFBLENBQUEsSUFBQSxHQUFBLElBQUEsTUFBQSxJQUFBLEdBQUEsSUFBQSxFQUFBLElBQUE7SUFBSCxHQUFHLENBQUEsSUFBQSxJQUFBLFNBQUEsQ0FBQSxJQUFBO0VBQUE7RUFBQSxPQUN0QixTQUFTLFNBQVMsQ0FBQSxFQUF5QjtJQUFBLElBQUEsS0FBQTtJQUFBLElBQXhCLE1BQU0sR0FBQSxTQUFBLENBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBLEdBQUEsU0FBQSxNQUFHLFFBQVEsQ0FBQyxJQUFJO0lBQ3ZDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUs7TUFDdEIsSUFBSSxPQUFPLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxVQUFVLEVBQUU7UUFDdEMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLEVBQUUsTUFBTSxDQUFDO01BQ2pDO0lBQ0YsQ0FBQyxDQUFDO0VBQ0osQ0FBQztBQUFBOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBQyxNQUFNLEVBQUUsS0FBSztFQUFBLE9BQzdCLFFBQVEsQ0FBQyxRQUFRLENBQ2YsTUFBTSxFQUNOLE1BQU0sQ0FDSjtJQUNFLEVBQUUsRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztJQUMzQixHQUFHLEVBQUUsUUFBUSxDQUFDLFVBQVUsRUFBRSxRQUFRO0VBQ3BDLENBQUMsRUFDRCxLQUNGLENBQ0YsQ0FBQztBQUFBOzs7QUNuQ0gsWUFBWTs7QUFDWixJQUFJLFdBQVcsR0FBRztFQUNoQixJQUFJLEVBQUUsQ0FBQztFQUNQLElBQUksRUFBRSxHQUFHO0VBQ1QsSUFBSSxFQUFFLEdBQUc7RUFDVCxJQUFJLEVBQUUsR0FBRztFQUNULElBQUksRUFBRTtBQUNSLENBQUM7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVc7Ozs7O0FDVDVCO0FBQ0EsU0FBUyxtQkFBbUIsQ0FBRSxFQUFFLEVBQzhCO0VBQUEsSUFENUIsR0FBRyxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUMsTUFBTTtFQUFBLElBQ2QsS0FBSyxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUMsUUFBUSxDQUFDLGVBQWU7RUFDMUQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLENBQUM7RUFFckMsT0FDRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFDYixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFDZCxJQUFJLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUN0RCxJQUFJLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUV2RDtBQUVBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsbUJBQW1COzs7OztBQ2JwQztBQUNBLFNBQVMsV0FBVyxDQUFBLEVBQUc7RUFDckIsT0FDRSxPQUFPLFNBQVMsS0FBSyxXQUFXLEtBQy9CLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQzlDLFNBQVMsQ0FBQyxRQUFRLEtBQUssVUFBVSxJQUFJLFNBQVMsQ0FBQyxjQUFjLEdBQUcsQ0FBRSxDQUFDLElBQ3RFLENBQUMsTUFBTSxDQUFDLFFBQVE7QUFFcEI7QUFFQSxNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVc7Ozs7OztBQ1Y1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxLQUFLO0VBQUEsT0FDdEIsS0FBSyxJQUFJLE9BQUEsQ0FBTyxLQUFLLE1BQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssQ0FBQztBQUFBOztBQUU1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUs7RUFDdEMsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7SUFDaEMsT0FBTyxFQUFFO0VBQ1g7RUFFQSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ25DLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDN0I7O0VBRUEsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztFQUNwRCxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDOUMsQ0FBQzs7O0FDNUJELFlBQVk7O0FBQ1osSUFBTSxRQUFRLEdBQUcsZUFBZTtBQUNoQyxJQUFNLFFBQVEsR0FBRyxlQUFlO0FBQ2hDLElBQU0sTUFBTSxHQUFHLGFBQWE7QUFFNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUs7RUFFckMsSUFBSSxPQUFPLFFBQVEsS0FBSyxTQUFTLEVBQUU7SUFDakMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssT0FBTztFQUN0RDtFQUNBLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztFQUN2QyxJQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztFQUN4QyxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztFQUM1QyxJQUFJLENBQUMsUUFBUSxFQUFFO0lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FDYixtQ0FBbUMsR0FBRyxFQUFFLEdBQUcsR0FDN0MsQ0FBQztFQUNIO0VBRUEsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7RUFDeEMsT0FBTyxRQUFRO0FBQ2pCLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGFycmF5LWZvcmVhY2hcbiAqICAgQXJyYXkjZm9yRWFjaCBwb255ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqICAgKFBvbnlmaWxsOiBBIHBvbHlmaWxsIHRoYXQgZG9lc24ndCBvdmVyd3JpdGUgdGhlIG5hdGl2ZSBtZXRob2QpXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LTIwMTYgVGFrdXRvIFdhZGFcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2gvYmxvYi9tYXN0ZXIvTUlULUxJQ0VOU0VcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2ggKGFyeSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBpZiAoYXJ5LmZvckVhY2gpIHtcbiAgICAgICAgYXJ5LmZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGFyeVtpXSwgaSwgYXJ5KTtcbiAgICB9XG59O1xuIiwiLypcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxuICogMS4xLjIwMTcwNDI3XG4gKlxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuICogTGljZW5zZTogRGVkaWNhdGVkIHRvIHRoZSBwdWJsaWMgZG9tYWluLlxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXG5cbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzICovXG5cbmlmIChcImRvY3VtZW50XCIgaW4gd2luZG93LnNlbGYpIHtcblxuLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuLy8gSW5jbHVkaW5nIElFIDwgRWRnZSBtaXNzaW5nIFNWR0VsZW1lbnQuY2xhc3NMaXN0XG5pZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpKSBcblx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKSkpIHtcblxuKGZ1bmN0aW9uICh2aWV3KSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5pZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxudmFyXG5cdCAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcblx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdCwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cblx0LCBvYmpDdHIgPSBPYmplY3Rcblx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG5cdH1cblx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIGkgPSAwXG5cdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHQsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcblx0XHR0aGlzLm5hbWUgPSB0eXBlO1xuXHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRpZiAodG9rZW4gPT09IFwiXCIpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHQsIFwiQW4gaW52YWxpZCBvciBpbGxlZ2FsIHN0cmluZyB3YXMgc3BlY2lmaWVkXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcblx0XHRcdFx0LCBcIlN0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlclwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuXHR9XG5cdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuXHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuXHRcdH1cblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XG5cdFx0fTtcblx0fVxuXHQsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuXHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcblx0fVxuO1xuLy8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxuLy8gb24gbm9uLURPTUV4Y2VwdGlvbnMuIEVycm9yJ3MgdG9TdHJpbmcoKSBpcyBzdWZmaWNpZW50IGhlcmUuXG5ET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcbmNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xuXHRyZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xufTtcbmNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cdHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcbn07XG5jbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuXHRcdFx0dGhpcy5wdXNoKHRva2VuKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdCwgaW5kZXhcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR3aGlsZSAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cblx0dmFyXG5cdFx0ICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuXHRcdCwgbWV0aG9kID0gcmVzdWx0ID9cblx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHQ6XG5cdFx0XHRmb3JjZSAhPT0gZmFsc2UgJiYgXCJhZGRcIlxuXHQ7XG5cblx0aWYgKG1ldGhvZCkge1xuXHRcdHRoaXNbbWV0aG9kXSh0b2tlbik7XG5cdH1cblxuXHRpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIGZvcmNlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiAhcmVzdWx0O1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xufTtcblxuaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHR2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG5cdFx0ICBnZXQ6IGNsYXNzTGlzdEdldHRlclxuXHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdCwgY29uZmlndXJhYmxlOiB0cnVlXG5cdH07XG5cdHRyeSB7XG5cdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHR9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcblx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdC8vIG1vZGVybmllIElFOC1NU1c3IG1hY2hpbmUgaGFzIElFOCA4LjAuNjAwMS4xODcwMiBhbmQgaXMgYWZmZWN0ZWRcblx0XHRpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuXHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdH1cblx0fVxufSBlbHNlIGlmIChvYmpDdHJbcHJvdG9Qcm9wXS5fX2RlZmluZUdldHRlcl9fKSB7XG5cdGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG59XG5cbn0od2luZG93LnNlbGYpKTtcblxufVxuXG4vLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcbi8vIHRvIG5vcm1hbGl6ZSB0aGUgYWRkL3JlbW92ZSBhbmQgdG9nZ2xlIEFQSXMuXG5cbihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO1xuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG5cdC8vIGNsYXNzTGlzdC5yZW1vdmUgZXhpc3QgYnV0IHN1cHBvcnQgb25seSBvbmUgYXJndW1lbnQgYXQgYSB0aW1lLlxuXHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0dmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdO1xuXG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHR2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdGNyZWF0ZU1ldGhvZCgnYWRkJyk7XG5cdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0fVxuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjM1wiLCBmYWxzZSk7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHQvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjM1wiKSkge1xuXHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuXHRcdFx0aWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XG5cdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fVxuXG5cdHRlc3RFbGVtZW50ID0gbnVsbDtcbn0oKSk7XG5cbn1cbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjYuMTInIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ25hdGl2ZS1mdW5jdGlvbi10by1zdHJpbmcnLCBGdW5jdGlvbi50b1N0cmluZyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcykge1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBkZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmIHR5cGVvZiBJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwidmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24gKCkgeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMsIHNraXBDbG9zaW5nKSB7XG4gIGlmICghc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBbN107XG4gICAgdmFyIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geyBkb25lOiBzYWZlID0gdHJ1ZSB9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgUyA9IFN5bWJvbCgpO1xuICB2YXIgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICB3aGlsZSAoYUxlbiA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikge1xuICAgICAga2V5ID0ga2V5c1tqKytdO1xuICAgICAgaWYgKCFERVNDUklQVE9SUyB8fCBpc0VudW0uY2FsbChTLCBrZXkpKSBUW2tleV0gPSBTW2tleV07XG4gICAgfVxuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTykpIHJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYgKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgU1JDID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpO1xudmFyICR0b1N0cmluZyA9IHJlcXVpcmUoJy4vX2Z1bmN0aW9uLXRvLXN0cmluZycpO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgVFBMID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsLCBzYWZlKSB7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZiAoT1trZXldID09PSB2YWwpIHJldHVybjtcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKCFzYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChPW2tleV0pIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246IGNvcmUudmVyc2lvbixcbiAgbW9kZTogcmVxdWlyZSgnLi9fbGlicmFyeScpID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMjAgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHsgYXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8qIGdsb2JhbCBkZWZpbmUsIEtleWJvYXJkRXZlbnQsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gIHZhciBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSB7XG4gICAgcG9seWZpbGw6IHBvbHlmaWxsLFxuICAgIGtleXM6IHtcbiAgICAgIDM6ICdDYW5jZWwnLFxuICAgICAgNjogJ0hlbHAnLFxuICAgICAgODogJ0JhY2tzcGFjZScsXG4gICAgICA5OiAnVGFiJyxcbiAgICAgIDEyOiAnQ2xlYXInLFxuICAgICAgMTM6ICdFbnRlcicsXG4gICAgICAxNjogJ1NoaWZ0JyxcbiAgICAgIDE3OiAnQ29udHJvbCcsXG4gICAgICAxODogJ0FsdCcsXG4gICAgICAxOTogJ1BhdXNlJyxcbiAgICAgIDIwOiAnQ2Fwc0xvY2snLFxuICAgICAgMjc6ICdFc2NhcGUnLFxuICAgICAgMjg6ICdDb252ZXJ0JyxcbiAgICAgIDI5OiAnTm9uQ29udmVydCcsXG4gICAgICAzMDogJ0FjY2VwdCcsXG4gICAgICAzMTogJ01vZGVDaGFuZ2UnLFxuICAgICAgMzI6ICcgJyxcbiAgICAgIDMzOiAnUGFnZVVwJyxcbiAgICAgIDM0OiAnUGFnZURvd24nLFxuICAgICAgMzU6ICdFbmQnLFxuICAgICAgMzY6ICdIb21lJyxcbiAgICAgIDM3OiAnQXJyb3dMZWZ0JyxcbiAgICAgIDM4OiAnQXJyb3dVcCcsXG4gICAgICAzOTogJ0Fycm93UmlnaHQnLFxuICAgICAgNDA6ICdBcnJvd0Rvd24nLFxuICAgICAgNDE6ICdTZWxlY3QnLFxuICAgICAgNDI6ICdQcmludCcsXG4gICAgICA0MzogJ0V4ZWN1dGUnLFxuICAgICAgNDQ6ICdQcmludFNjcmVlbicsXG4gICAgICA0NTogJ0luc2VydCcsXG4gICAgICA0NjogJ0RlbGV0ZScsXG4gICAgICA0ODogWycwJywgJyknXSxcbiAgICAgIDQ5OiBbJzEnLCAnISddLFxuICAgICAgNTA6IFsnMicsICdAJ10sXG4gICAgICA1MTogWyczJywgJyMnXSxcbiAgICAgIDUyOiBbJzQnLCAnJCddLFxuICAgICAgNTM6IFsnNScsICclJ10sXG4gICAgICA1NDogWyc2JywgJ14nXSxcbiAgICAgIDU1OiBbJzcnLCAnJiddLFxuICAgICAgNTY6IFsnOCcsICcqJ10sXG4gICAgICA1NzogWyc5JywgJygnXSxcbiAgICAgIDkxOiAnT1MnLFxuICAgICAgOTM6ICdDb250ZXh0TWVudScsXG4gICAgICAxNDQ6ICdOdW1Mb2NrJyxcbiAgICAgIDE0NTogJ1Njcm9sbExvY2snLFxuICAgICAgMTgxOiAnVm9sdW1lTXV0ZScsXG4gICAgICAxODI6ICdWb2x1bWVEb3duJyxcbiAgICAgIDE4MzogJ1ZvbHVtZVVwJyxcbiAgICAgIDE4NjogWyc7JywgJzonXSxcbiAgICAgIDE4NzogWyc9JywgJysnXSxcbiAgICAgIDE4ODogWycsJywgJzwnXSxcbiAgICAgIDE4OTogWyctJywgJ18nXSxcbiAgICAgIDE5MDogWycuJywgJz4nXSxcbiAgICAgIDE5MTogWycvJywgJz8nXSxcbiAgICAgIDE5MjogWydgJywgJ34nXSxcbiAgICAgIDIxOTogWydbJywgJ3snXSxcbiAgICAgIDIyMDogWydcXFxcJywgJ3wnXSxcbiAgICAgIDIyMTogWyddJywgJ30nXSxcbiAgICAgIDIyMjogW1wiJ1wiLCAnXCInXSxcbiAgICAgIDIyNDogJ01ldGEnLFxuICAgICAgMjI1OiAnQWx0R3JhcGgnLFxuICAgICAgMjQ2OiAnQXR0bicsXG4gICAgICAyNDc6ICdDclNlbCcsXG4gICAgICAyNDg6ICdFeFNlbCcsXG4gICAgICAyNDk6ICdFcmFzZUVvZicsXG4gICAgICAyNTA6ICdQbGF5JyxcbiAgICAgIDI1MTogJ1pvb21PdXQnXG4gICAgfVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIGtleXMgKEYxLTI0KS5cbiAgdmFyIGk7XG4gIGZvciAoaSA9IDE7IGkgPCAyNTsgaSsrKSB7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbMTExICsgaV0gPSAnRicgKyBpO1xuICB9XG5cbiAgLy8gUHJpbnRhYmxlIEFTQ0lJIGNoYXJhY3RlcnMuXG4gIHZhciBsZXR0ZXIgPSAnJztcbiAgZm9yIChpID0gNjU7IGkgPCA5MTsgaSsrKSB7XG4gICAgbGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1tpXSA9IFtsZXR0ZXIudG9Mb3dlckNhc2UoKSwgbGV0dGVyLnRvVXBwZXJDYXNlKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gcG9seWZpbGwgKCkge1xuICAgIGlmICghKCdLZXlib2FyZEV2ZW50JyBpbiB3aW5kb3cpIHx8XG4gICAgICAgICdrZXknIGluIEtleWJvYXJkRXZlbnQucHJvdG90eXBlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gUG9seWZpbGwgYGtleWAgb24gYEtleWJvYXJkRXZlbnRgLlxuICAgIHZhciBwcm90byA9IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW3RoaXMud2hpY2ggfHwgdGhpcy5rZXlDb2RlXTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAga2V5ID0ga2V5Wyt0aGlzLnNoaWZ0S2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUsICdrZXknLCBwcm90byk7XG4gICAgcmV0dXJuIHByb3RvO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnLCBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9IGVsc2UgaWYgKHdpbmRvdykge1xuICAgIHdpbmRvdy5rZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH1cblxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHByb3RvID0gdHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnID8gRWxlbWVudC5wcm90b3R5cGUgOiB7fTtcbnZhciB2ZW5kb3IgPSBwcm90by5tYXRjaGVzXG4gIHx8IHByb3RvLm1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm9NYXRjaGVzU2VsZWN0b3I7XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2g7XG5cbi8qKlxuICogTWF0Y2ggYGVsYCB0byBgc2VsZWN0b3JgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gbWF0Y2goZWwsIHNlbGVjdG9yKSB7XG4gIGlmICghZWwgfHwgZWwubm9kZVR5cGUgIT09IDEpIHJldHVybiBmYWxzZTtcbiAgaWYgKHZlbmRvcikgcmV0dXJuIHZlbmRvci5jYWxsKGVsLCBzZWxlY3Rvcik7XG4gIHZhciBub2RlcyA9IGVsLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJjb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5jb25zdCBkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcbmNvbnN0IGRlbGVnYXRlQWxsID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZUFsbCcpO1xuXG5jb25zdCBERUxFR0FURV9QQVRURVJOID0gL14oLispOmRlbGVnYXRlXFwoKC4rKVxcKSQvO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5cbmNvbnN0IGdldExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgdmFyIG1hdGNoID0gdHlwZS5tYXRjaChERUxFR0FURV9QQVRURVJOKTtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0eXBlID0gbWF0Y2hbMV07XG4gICAgc2VsZWN0b3IgPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHZhciBvcHRpb25zO1xuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGNhcHR1cmU6IHBvcEtleShoYW5kbGVyLCAnY2FwdHVyZScpLFxuICAgICAgcGFzc2l2ZTogcG9wS2V5KGhhbmRsZXIsICdwYXNzaXZlJylcbiAgICB9O1xuICB9XG5cbiAgdmFyIGxpc3RlbmVyID0ge1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICBkZWxlZ2F0ZTogKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0JylcbiAgICAgID8gZGVsZWdhdGVBbGwoaGFuZGxlcilcbiAgICAgIDogc2VsZWN0b3JcbiAgICAgICAgPyBkZWxlZ2F0ZShzZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgOiBoYW5kbGVyLFxuICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgfTtcblxuICBpZiAodHlwZS5pbmRleE9mKFNQQUNFKSA+IC0xKSB7XG4gICAgcmV0dXJuIHR5cGUuc3BsaXQoU1BBQ0UpLm1hcChmdW5jdGlvbihfdHlwZSkge1xuICAgICAgcmV0dXJuIGFzc2lnbih7dHlwZTogX3R5cGV9LCBsaXN0ZW5lcik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdGVuZXIudHlwZSA9IHR5cGU7XG4gICAgcmV0dXJuIFtsaXN0ZW5lcl07XG4gIH1cbn07XG5cbnZhciBwb3BLZXkgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgZGVsZXRlIG9ialtrZXldO1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJlaGF2aW9yKGV2ZW50cywgcHJvcHMpIHtcbiAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmtleXMoZXZlbnRzKVxuICAgIC5yZWR1Y2UoZnVuY3Rpb24obWVtbywgdHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IGdldExpc3RlbmVycyh0eXBlLCBldmVudHNbdHlwZV0pO1xuICAgICAgcmV0dXJuIG1lbW8uY29uY2F0KGxpc3RlbmVycyk7XG4gICAgfSwgW10pO1xuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIGFkZDogZnVuY3Rpb24gYWRkQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZUJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgcHJvcHMpO1xufTtcbiIsImNvbnN0IG1hdGNoZXMgPSByZXF1aXJlKCdtYXRjaGVzLXNlbGVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgZG8ge1xuICAgIGlmIChtYXRjaGVzKGVsZW1lbnQsIHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuICB9IHdoaWxlICgoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gMSk7XG59O1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBvc2UoZnVuY3Rpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlKSA9PT0gZmFsc2U7XG4gICAgfSwgdGhpcyk7XG4gIH07XG59O1xuIiwiY29uc3QgY2xvc2VzdCA9IHJlcXVpcmUoJy4vY2xvc2VzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlKHNlbGVjdG9yLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZGVsZWdhdGlvbihldmVudCkge1xuICAgIHZhciB0YXJnZXQgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3IpO1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRhcmdldCwgZXZlbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsImNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuY29uc3QgY29tcG9zZSA9IHJlcXVpcmUoJy4vY29tcG9zZScpO1xuXG5jb25zdCBTUExBVCA9ICcqJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZUFsbChzZWxlY3RvcnMpIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHNlbGVjdG9ycylcblxuICAvLyBYWFggb3B0aW1pemF0aW9uOiBpZiB0aGVyZSBpcyBvbmx5IG9uZSBoYW5kbGVyIGFuZCBpdCBhcHBsaWVzIHRvXG4gIC8vIGFsbCBlbGVtZW50cyAodGhlIFwiKlwiIENTUyBzZWxlY3RvciksIHRoZW4ganVzdCByZXR1cm4gdGhhdFxuICAvLyBoYW5kbGVyXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMSAmJiBrZXlzWzBdID09PSBTUExBVCkge1xuICAgIHJldHVybiBzZWxlY3RvcnNbU1BMQVRdO1xuICB9XG5cbiAgY29uc3QgZGVsZWdhdGVzID0ga2V5cy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgc2VsZWN0b3IpIHtcbiAgICBtZW1vLnB1c2goZGVsZWdhdGUoc2VsZWN0b3IsIHNlbGVjdG9yc1tzZWxlY3Rvcl0pKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfSwgW10pO1xuICByZXR1cm4gY29tcG9zZShkZWxlZ2F0ZXMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaWdub3JlKGVsZW1lbnQsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBpZ25vcmFuY2UoZSkge1xuICAgIGlmIChlbGVtZW50ICE9PSBlLnRhcmdldCAmJiAhZWxlbWVudC5jb250YWlucyhlLnRhcmdldCkpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpO1xuICAgIH1cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBiZWhhdmlvcjogcmVxdWlyZSgnLi9iZWhhdmlvcicpLFxuICBkZWxlZ2F0ZTogcmVxdWlyZSgnLi9kZWxlZ2F0ZScpLFxuICBkZWxlZ2F0ZUFsbDogcmVxdWlyZSgnLi9kZWxlZ2F0ZUFsbCcpLFxuICBpZ25vcmU6IHJlcXVpcmUoJy4vaWdub3JlJyksXG4gIGtleW1hcDogcmVxdWlyZSgnLi9rZXltYXAnKSxcbn07XG4iLCJyZXF1aXJlKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcpO1xuXG4vLyB0aGVzZSBhcmUgdGhlIG9ubHkgcmVsZXZhbnQgbW9kaWZpZXJzIHN1cHBvcnRlZCBvbiBhbGwgcGxhdGZvcm1zLFxuLy8gYWNjb3JkaW5nIHRvIE1ETjpcbi8vIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudC9nZXRNb2RpZmllclN0YXRlPlxuY29uc3QgTU9ESUZJRVJTID0ge1xuICAnQWx0JzogICAgICAnYWx0S2V5JyxcbiAgJ0NvbnRyb2wnOiAgJ2N0cmxLZXknLFxuICAnQ3RybCc6ICAgICAnY3RybEtleScsXG4gICdTaGlmdCc6ICAgICdzaGlmdEtleSdcbn07XG5cbmNvbnN0IE1PRElGSUVSX1NFUEFSQVRPUiA9ICcrJztcblxuY29uc3QgZ2V0RXZlbnRLZXkgPSBmdW5jdGlvbihldmVudCwgaGFzTW9kaWZpZXJzKSB7XG4gIHZhciBrZXkgPSBldmVudC5rZXk7XG4gIGlmIChoYXNNb2RpZmllcnMpIHtcbiAgICBmb3IgKHZhciBtb2RpZmllciBpbiBNT0RJRklFUlMpIHtcbiAgICAgIGlmIChldmVudFtNT0RJRklFUlNbbW9kaWZpZXJdXSA9PT0gdHJ1ZSkge1xuICAgICAgICBrZXkgPSBbbW9kaWZpZXIsIGtleV0uam9pbihNT0RJRklFUl9TRVBBUkFUT1IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4ga2V5O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBrZXltYXAoa2V5cykge1xuICBjb25zdCBoYXNNb2RpZmllcnMgPSBPYmplY3Qua2V5cyhrZXlzKS5zb21lKGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBrZXkuaW5kZXhPZihNT0RJRklFUl9TRVBBUkFUT1IpID4gLTE7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIga2V5ID0gZ2V0RXZlbnRLZXkoZXZlbnQsIGhhc01vZGlmaWVycyk7XG4gICAgcmV0dXJuIFtrZXksIGtleS50b0xvd2VyQ2FzZSgpXVxuICAgICAgLnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIF9rZXkpIHtcbiAgICAgICAgaWYgKF9rZXkgaW4ga2V5cykge1xuICAgICAgICAgIHJlc3VsdCA9IGtleXNba2V5XS5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSwgdW5kZWZpbmVkKTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLk1PRElGSUVSUyA9IE1PRElGSUVSUztcbiIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCAnLi4vcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kJztcbmNvbnN0IHRvZ2dsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3RvZ2dsZScpO1xuY29uc3QgaXNFbGVtZW50SW5WaWV3cG9ydCA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzLWluLXZpZXdwb3J0Jyk7XG5jb25zdCBCVVRUT04gPSBgLmFjY29yZGlvbi1idXR0b25bYXJpYS1jb250cm9sc11gO1xuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XG5jb25zdCBCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUgPSBcImRhdGEtYWNjb3JkaW9uLWJ1bGstZXhwYW5kXCI7XG5jb25zdCBURVhUX0FDQ09SRElPTiA9IHtcbiAgICBcIm9wZW5fYWxsXCI6IFwiw4VibiBhbGxlXCIsXG4gICAgXCJjbG9zZV9hbGxcIjogXCJMdWsgYWxsZVwiXG59XG5cbi8qKlxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIGFjY29yZGlvbiBsaXN0XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkYWNjb3JkaW9uIHRoZSBhY2NvcmRpb24gdWwgZWxlbWVudFxuICogQHBhcmFtIHtKU09OfSBzdHJpbmdzIFRyYW5zbGF0ZSBsYWJlbHM6IHtcIm9wZW5fYWxsXCI6IFwiw4VibiBhbGxlXCIsIFwiY2xvc2VfYWxsXCI6IFwiTHVrIGFsbGVcIn1cbiAqL1xuZnVuY3Rpb24gQWNjb3JkaW9uKCRhY2NvcmRpb24sIHN0cmluZ3MgPSBURVhUX0FDQ09SRElPTikge1xuICAgIGlmICghJGFjY29yZGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGdyb3VwIGVsZW1lbnRgKTtcbiAgICB9XG4gICAgdGhpcy5hY2NvcmRpb24gPSAkYWNjb3JkaW9uO1xuICAgIHRoaXMudGV4dCA9IHN0cmluZ3M7XG59XG5cbi8qKlxuICogU2V0IGV2ZW50bGlzdGVuZXJzIG9uIGNsaWNrIGVsZW1lbnRzIGluIGFjY29yZGlvbiBsaXN0XG4gKi9cbkFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmJ1dHRvbnMgPSB0aGlzLmFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XG4gICAgaWYgKHRoaXMuYnV0dG9ucy5sZW5ndGggPT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGJ1dHRvbnNgKTtcbiAgICB9XG5cbiAgICAvLyBsb29wIGJ1dHRvbnMgaW4gbGlzdFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zW2ldO1xuXG4gICAgICAgIC8vIFZlcmlmeSBzdGF0ZSBvbiBidXR0b24gYW5kIHN0YXRlIG9uIHBhbmVsXG4gICAgICAgIGxldCBleHBhbmRlZCA9IGN1cnJlbnRCdXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnO1xuICAgICAgICB0aGlzLnRvZ2dsZUJ1dHRvbihjdXJyZW50QnV0dG9uLCBleHBhbmRlZCk7XG5cbiAgICAgICAgLy8gU2V0IGNsaWNrIGV2ZW50IG9uIGFjY29yZGlvbiBidXR0b25zXG4gICAgICAgIGN1cnJlbnRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmV2ZW50T25DbGljay5iaW5kKHRoaXMsIGN1cnJlbnRCdXR0b24pLCBmYWxzZSk7XG4gICAgICAgIGN1cnJlbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmV2ZW50T25DbGljay5iaW5kKHRoaXMsIGN1cnJlbnRCdXR0b24pLCBmYWxzZSk7XG4gICAgfVxuICAgIC8vIFNldCBjbGljayBldmVudCBvbiBidWxrIGJ1dHRvbiBpZiBwcmVzZW50XG4gICAgbGV0IHByZXZTaWJsaW5nID0gdGhpcy5hY2NvcmRpb24ucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICBpZiAocHJldlNpYmxpbmcgIT09IG51bGwgJiYgcHJldlNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24tYnVsay1idXR0b24nKSkge1xuICAgICAgICB0aGlzLmJ1bGtGdW5jdGlvbkJ1dHRvbiA9IHByZXZTaWJsaW5nO1xuICAgICAgICB0aGlzLmJ1bGtGdW5jdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnVsa0V2ZW50LmJpbmQodGhpcykpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBCdWxrIGV2ZW50IGhhbmRsZXI6IFRyaWdnZXJlZCB3aGVuIGNsaWNraW5nIG9uIC5hY2NvcmRpb24tYnVsay1idXR0b25cbiAqL1xuQWNjb3JkaW9uLnByb3RvdHlwZS5idWxrRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRtb2R1bGUgPSB0aGlzO1xuICAgIGlmICghJG1vZHVsZS5hY2NvcmRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFjY29yZGlvbi5gKTtcbiAgICB9XG4gICAgaWYgKCRtb2R1bGUuYnV0dG9ucy5sZW5ndGggPT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGJ1dHRvbnNgKTtcbiAgICB9XG5cbiAgICBsZXQgZXhwYW5kID0gdHJ1ZTtcbiAgICBpZiAoJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uZ2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSkgPT09IFwiZmFsc2VcIikge1xuICAgICAgICBleHBhbmQgPSBmYWxzZTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkbW9kdWxlLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgJG1vZHVsZS50b2dnbGVCdXR0b24oJG1vZHVsZS5idXR0b25zW2ldLCBleHBhbmQsIHRydWUpO1xuICAgIH1cblxuICAgICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLnNldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUsICFleHBhbmQpO1xuICAgIGlmICghZXhwYW5kID09PSB0cnVlKSB7XG4gICAgICAgICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLmlubmVyVGV4dCA9IHRoaXMudGV4dC5vcGVuX2FsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5pbm5lclRleHQgPSB0aGlzLnRleHQuY2xvc2VfYWxsO1xuICAgIH1cbn1cblxuLyoqXG4gKiBBY2NvcmRpb24gYnV0dG9uIGV2ZW50IGhhbmRsZXI6IFRvZ2dsZXMgYWNjb3JkaW9uXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSAkYnV0dG9uIFxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGUgXG4gKi9cbkFjY29yZGlvbi5wcm90b3R5cGUuZXZlbnRPbkNsaWNrID0gZnVuY3Rpb24gKCRidXR0b24sIGUpIHtcbiAgICB2YXIgJG1vZHVsZSA9IHRoaXM7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJG1vZHVsZS50b2dnbGVCdXR0b24oJGJ1dHRvbik7XG4gICAgaWYgKCRidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIC8vIFdlIHdlcmUganVzdCBleHBhbmRlZCwgYnV0IGlmIGFub3RoZXIgYWNjb3JkaW9uIHdhcyBhbHNvIGp1c3RcbiAgICAgICAgLy8gY29sbGFwc2VkLCB3ZSBtYXkgbm8gbG9uZ2VyIGJlIGluIHRoZSB2aWV3cG9ydC4gVGhpcyBlbnN1cmVzXG4gICAgICAgIC8vIHRoYXQgd2UgYXJlIHN0aWxsIHZpc2libGUsIHNvIHRoZSB1c2VyIGlzbid0IGNvbmZ1c2VkLlxuICAgICAgICBpZiAoIWlzRWxlbWVudEluVmlld3BvcnQoJGJ1dHRvbikpICRidXR0b24uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICB9XG59XG5cbi8qKlxuICogVG9nZ2xlIGEgYnV0dG9uJ3MgXCJwcmVzc2VkXCIgc3RhdGUsIG9wdGlvbmFsbHkgcHJvdmlkaW5nIGEgdGFyZ2V0XG4gKiBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxuICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRoZSByZXN1bHRpbmcgc3RhdGVcbiAqL1xuQWNjb3JkaW9uLnByb3RvdHlwZS50b2dnbGVCdXR0b24gPSBmdW5jdGlvbiAoYnV0dG9uLCBleHBhbmRlZCwgYnVsayA9IGZhbHNlKSB7XG4gICAgbGV0IGFjY29yZGlvbiA9IG51bGw7XG4gICAgaWYgKGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSkge1xuICAgICAgICBhY2NvcmRpb24gPSBidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgIH0gZWxzZSBpZiAoYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpIHtcbiAgICAgICAgYWNjb3JkaW9uID0gYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgIH1cbiAgICBleHBhbmRlZCA9IHRvZ2dsZShidXR0b24sIGV4cGFuZGVkKTtcbiAgICBpZiAoZXhwYW5kZWQpIHtcbiAgICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmFjY29yZGlvbi5vcGVuJyk7XG4gICAgICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnKTtcbiAgICAgICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XG4gICAgfVxuXG4gICAgaWYgKGFjY29yZGlvbiAhPT0gbnVsbCkge1xuICAgICAgICBsZXQgYnVsa0Z1bmN0aW9uID0gYWNjb3JkaW9uLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGlmIChidWxrRnVuY3Rpb24gIT09IG51bGwgJiYgYnVsa0Z1bmN0aW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uLWJ1bGstYnV0dG9uJykpIHtcbiAgICAgICAgICAgIGxldCBidXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcbiAgICAgICAgICAgIGlmIChidWxrID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGxldCBidXR0b25zT3BlbiA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTiArICdbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3U3RhdHVzID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChidXR0b25zLmxlbmd0aCA9PT0gYnV0dG9uc09wZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0YXR1cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJ1bGtGdW5jdGlvbi5zZXRBdHRyaWJ1dGUoQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFLCBuZXdTdGF0dXMpO1xuICAgICAgICAgICAgICAgIGlmIChuZXdTdGF0dXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IHRoaXMudGV4dC5vcGVuX2FsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBidWxrRnVuY3Rpb24uaW5uZXJUZXh0ID0gdGhpcy50ZXh0LmNsb3NlX2FsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBY2NvcmRpb247IiwiJ3VzZSBzdHJpY3QnO1xuZnVuY3Rpb24gQWxlcnQoYWxlcnQpe1xuICAgIHRoaXMuYWxlcnQgPSBhbGVydDtcbn1cblxuQWxlcnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgIGxldCBjbG9zZSA9IHRoaXMuYWxlcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWxlcnQtY2xvc2UnKTtcbiAgICBpZihjbG9zZS5sZW5ndGggPT09IDEpe1xuICAgICAgICBjbG9zZVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcbiAgICB9XG59XG5cbkFsZXJ0LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLmFsZXJ0LmNsYXNzTGlzdC5hZGQoJ2Qtbm9uZScpO1xuICAgIGxldCBldmVudEhpZGUgPSBuZXcgRXZlbnQoJ2Zkcy5hbGVydC5oaWRlJyk7XG4gICAgdGhpcy5hbGVydC5kaXNwYXRjaEV2ZW50KGV2ZW50SGlkZSk7XG59O1xuXG5BbGVydC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5hbGVydC5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcbiAgICBcbiAgICBsZXQgZXZlbnRTaG93ID0gbmV3IEV2ZW50KCdmZHMuYWxlcnQuc2hvdycpO1xuICAgIHRoaXMuYWxlcnQuZGlzcGF0Y2hFdmVudChldmVudFNob3cpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxlcnQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBCYWNrVG9Ub3AoYmFja3RvdG9wKXtcbiAgICB0aGlzLmJhY2t0b3RvcCA9IGJhY2t0b3RvcDtcbn1cblxuQmFja1RvVG9wLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGJhY2t0b3RvcGJ1dHRvbiA9IHRoaXMuYmFja3RvdG9wO1xuXG4gICAgdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJhY2t0b3RvcGJ1dHRvbik7XG5cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCBsaXN0ID0+IHtcbiAgICAgICAgY29uc3QgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCdkb20tY2hhbmdlZCcsIHtkZXRhaWw6IGxpc3R9KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5kaXNwYXRjaEV2ZW50KGV2dClcbiAgICB9KTtcblxuICAgIC8vIFdoaWNoIG11dGF0aW9ucyB0byBvYnNlcnZlXG4gICAgbGV0IGNvbmZpZyA9IHtcbiAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICAgIDogdHJ1ZSxcbiAgICAgICAgYXR0cmlidXRlT2xkVmFsdWUgICAgIDogZmFsc2UsXG4gICAgICAgIGNoYXJhY3RlckRhdGEgICAgICAgICA6IHRydWUsXG4gICAgICAgIGNoYXJhY3RlckRhdGFPbGRWYWx1ZSA6IGZhbHNlLFxuICAgICAgICBjaGlsZExpc3QgICAgICAgICAgICAgOiB0cnVlLFxuICAgICAgICBzdWJ0cmVlICAgICAgICAgICAgICAgOiB0cnVlXG4gICAgfTtcblxuICAgIC8vIERPTSBjaGFuZ2VzXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCBjb25maWcpO1xuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignZG9tLWNoYW5nZWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHVwZGF0ZUJhY2tUb1RvcEJ1dHRvbihiYWNrdG90b3BidXR0b24pO1xuICAgIH0pO1xuXG4gICAgLy8gU2Nyb2xsIGFjdGlvbnNcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oZSkge1xuICAgICAgICB1cGRhdGVCYWNrVG9Ub3BCdXR0b24oYmFja3RvdG9wYnV0dG9uKTtcbiAgICB9KTtcblxuICAgIC8vIFdpbmRvdyByZXNpemVzXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJhY2t0b3RvcGJ1dHRvbik7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJhY2tUb1RvcEJ1dHRvbihidXR0b24pIHtcbiAgICBsZXQgZG9jQm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgbGV0IGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgbGV0IGhlaWdodE9mVmlld3BvcnQgPSBNYXRoLm1heChkb2NFbGVtLmNsaWVudEhlaWdodCB8fCAwLCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMCk7XG4gICAgbGV0IGhlaWdodE9mUGFnZSA9IE1hdGgubWF4KGRvY0JvZHkuc2Nyb2xsSGVpZ2h0LCBkb2NCb2R5Lm9mZnNldEhlaWdodCwgZG9jQm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsZW0uc2Nyb2xsSGVpZ2h0LCBkb2NFbGVtLm9mZnNldEhlaWdodCwgZG9jRWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsIGRvY0VsZW0uY2xpZW50SGVpZ2h0KTtcbiAgICBcbiAgICBsZXQgbGltaXQgPSBoZWlnaHRPZlZpZXdwb3J0ICogMjsgLy8gVGhlIHRocmVzaG9sZCBzZWxlY3RlZCB0byBkZXRlcm1pbmUgd2hldGhlciBhIGJhY2stdG8tdG9wLWJ1dHRvbiBzaG91bGQgYmUgZGlzcGxheWVkXG4gICAgXG4gICAgLy8gTmV2ZXIgc2hvdyB0aGUgYnV0dG9uIGlmIHRoZSBwYWdlIGlzIHRvbyBzaG9ydFxuICAgIGlmIChsaW1pdCA+IGhlaWdodE9mUGFnZSkge1xuICAgICAgICBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Qtbm9uZScpKSB7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZC1ub25lJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gSWYgdGhlIHBhZ2UgaXMgbG9uZywgY2FsY3VsYXRlIHdoZW4gdG8gc2hvdyB0aGUgYnV0dG9uXG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdkLW5vbmUnKSkge1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Qtbm9uZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxhc3RLbm93blNjcm9sbFBvc2l0aW9uID0gd2luZG93LnNjcm9sbFk7XG4gICAgICAgIGxldCBmb290ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImZvb3RlclwiKVswXTsgLy8gSWYgdGhlcmUgYXJlIHNldmVyYWwgZm9vdGVycywgdGhlIGNvZGUgb25seSBhcHBsaWVzIHRvIHRoZSBmaXJzdCBmb290ZXJcblxuICAgICAgICAvLyBTaG93IHRoZSBidXR0b24sIGlmIHRoZSB1c2VyIGhhcyBzY3JvbGxlZCB0b28gZmFyIGRvd25cbiAgICAgICAgaWYgKGxhc3RLbm93blNjcm9sbFBvc2l0aW9uID49IGxpbWl0KSB7XG4gICAgICAgICAgICBpZiAoIWlzRm9vdGVyVmlzaWJsZShmb290ZXIpICYmIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmb290ZXItc3RpY2t5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0Zvb3RlclZpc2libGUoZm9vdGVyKSAmJiAhYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGVyZSdzIGEgc2lkZW5hdiwgd2UgbWlnaHQgd2FudCB0byBzaG93IHRoZSBidXR0b24gYW55d2F5XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNpZGVuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2lkZW5hdi1saXN0Jyk7IC8vIEZpbmRzIHNpZGUgbmF2aWdhdGlvbnMgKGxlZnQgbWVudXMpIGFuZCBzdGVwIGd1aWRlc1xuXG4gICAgICAgICAgICBpZiAoc2lkZW5hdiAmJiBzaWRlbmF2Lm9mZnNldFBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIE9ubHkgcmVhY3QgdG8gc2lkZW5hdnMsIHdoaWNoIGFyZSBhbHdheXMgdmlzaWJsZSAoaS5lLiBub3Qgb3BlbmVkIGZyb20gb3ZlcmZsb3ctbWVudSBidXR0b25zKVxuICAgICAgICAgICAgICAgIGlmICghKHNpZGVuYXYuY2xvc2VzdChcIi5vdmVyZmxvdy1tZW51LWlubmVyXCIpPy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nPy5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gXCJ0cnVlXCIgJiZcbiAgICAgICAgICAgICAgICBzaWRlbmF2LmNsb3Nlc3QoXCIub3ZlcmZsb3ctbWVudS1pbm5lclwiKT8ucHJldmlvdXNFbGVtZW50U2libGluZz8ub2Zmc2V0UGFyZW50ICE9PSBudWxsKSkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBzaWRlbmF2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVjdC5ib3R0b20gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRm9vdGVyVmlzaWJsZShmb290ZXIpICYmIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmb290ZXItc3RpY2t5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpc0Zvb3RlclZpc2libGUoZm9vdGVyKSAmJiAhYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVGhlcmUncyBubyBzaWRlbmF2IGFuZCB3ZSBrbm93IHRoZSB1c2VyIGhhc24ndCByZWFjaGVkIHRoZSBzY3JvbGwgbGltaXQ6IEVuc3VyZSB0aGUgYnV0dG9uIGlzIGhpZGRlblxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdmb290ZXItc3RpY2t5JykpIHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gaXNGb290ZXJWaXNpYmxlKGZvb3RlckVsZW1lbnQpIHtcbiAgICBpZiAoZm9vdGVyRWxlbWVudD8ucXVlcnlTZWxlY3RvcignLmZvb3RlcicpKSB7XG4gICAgICAgIGxldCByZWN0ID0gZm9vdGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyJykuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgLy8gRm9vdGVyIGlzIHZpc2libGUgb3IgcGFydGx5IHZpc2libGVcbiAgICAgICAgaWYgKChyZWN0LnRvcCA8IHdpbmRvdy5pbm5lckhlaWdodCB8fCByZWN0LnRvcCA8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGb290ZXIgaXMgaGlkZGVuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCYWNrVG9Ub3A7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBNQVhfTEVOR1RIID0gJ2RhdGEtbWF4bGVuZ3RoJztcbmNvbnN0IFRFWFRfQ0hBUkFDVEVSTElNSVQgPSB7XG4gICAgXCJjaGFyYWN0ZXJfcmVtYWluaW5nXCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiB0aWxiYWdlXCIsXG4gICAgXCJjaGFyYWN0ZXJzX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLFxuICAgIFwiY2hhcmFjdGVyX3Rvb19tYW55XCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiBmb3IgbWVnZXRcIixcbiAgICBcImNoYXJhY3RlcnNfdG9vX21hbnlcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIGZvciBtZWdldFwiXG59O1xuXG4vKipcbiAqIFNob3cgbnVtYmVyIG9mIGNoYXJhY3RlcnMgbGVmdCBpbiBhIGZpZWxkXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJFbGVtZW50IFxuICogQHBhcmFtIHtKU09OfSBzdHJpbmdzIFRyYW5zbGF0ZSBsYWJlbHM6IHtcImNoYXJhY3Rlcl9yZW1haW5pbmdcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIHRpbGJhZ2VcIiwgXCJjaGFyYWN0ZXJzX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLCBcImNoYXJhY3Rlcl90b29fbWFueVwiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gZm9yIG1lZ2V0XCIsIFwiY2hhcmFjdGVyc190b29fbWFueVwiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gZm9yIG1lZ2V0XCJ9XG4gKi9cbiBmdW5jdGlvbiBDaGFyYWN0ZXJMaW1pdChjb250YWluZXJFbGVtZW50LCBzdHJpbmdzID0gVEVYVF9DSEFSQUNURVJMSU1JVCkge1xuICAgIGlmICghY29udGFpbmVyRWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZm9ybS1saW1pdCBlbGVtZW50YCk7XG4gICAgfVxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyRWxlbWVudDtcbiAgICB0aGlzLmlucHV0ID0gY29udGFpbmVyRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWlucHV0JylbMF07XG4gICAgdGhpcy5tYXhsZW5ndGggPSB0aGlzLmNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoTUFYX0xFTkdUSCk7XG4gICAgdGhpcy50ZXh0ID0gc3RyaW5ncztcblxuICAgIGxldCBsYXN0S2V5VXBUaW1lc3RhbXAgPSBudWxsO1xuICAgIGxldCBvbGRWYWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XG4gICAgbGV0IGludGVydmFsSUQgPSBudWxsO1xuXG4gICAgbGV0IGhhbmRsZUtleVVwID0gKCkgPT4ge1xuICAgICAgICB1cGRhdGVWaXNpYmxlTWVzc2FnZSh0aGlzKTtcbiAgICAgICAgbGFzdEtleVVwVGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICB9XG5cbiAgICBsZXQgaGFuZGxlRm9jdXMgPSAoKSA9PiB7XG4gICAgICAgIC8qIFJlc2V0IHRoZSBzY3JlZW4gcmVhZGVyIG1lc3NhZ2Ugb24gZm9jdXMgdG8gZm9yY2UgYW4gdXBkYXRlIG9mIHRoZSBtZXNzYWdlLlxuICAgICAgICBUaGlzIGVuc3VyZXMgdGhhdCBhIHNjcmVlbiByZWFkZXIgaW5mb3JtcyB0aGUgdXNlciBvZiBob3cgbWFueSBjaGFyYWN0ZXJzIHRoZXJlIGlzIGxlZnRcbiAgICAgICAgb24gZm9jdXMgYW5kIG5vdCBqdXN0IHdoYXQgdGhlIGNoYXJhY3RlciBsaW1pdCBpcy4gKi9cbiAgICAgICAgaWYgKHRoaXMuaW5wdXQudmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGxldCBzcl9tZXNzYWdlID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0LXNyLW9ubHknKVswXTtcbiAgICAgICAgICAgIHNyX21lc3NhZ2UuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8qIERvbid0IHVwZGF0ZSB0aGUgU2NyZWVuIFJlYWRlciBtZXNzYWdlIHVubGVzcyBpdCdzIGJlZW4gYXdoaWxlXG4gICAgICAgICAgICBzaW5jZSB0aGUgbGFzdCBrZXkgdXAgZXZlbnQuIE90aGVyd2lzZSwgdGhlIHVzZXIgd2lsbCBiZSBzcGFtbWVkXG4gICAgICAgICAgICB3aXRoIGF1ZGlvIG5vdGlmaWNhdGlvbnMgd2hpbGUgdHlwaW5nLiAqL1xuICAgICAgICAgICAgaWYgKCFsYXN0S2V5VXBUaW1lc3RhbXAgfHwgKERhdGUubm93KCkgLSA1MDApID49IGxhc3RLZXlVcFRpbWVzdGFtcCkge1xuICAgICAgICAgICAgICAgIGxldCBzcl9tZXNzYWdlID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0LXNyLW9ubHknKVswXS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgbGV0IHZpc2libGVfbWVzc2FnZSA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NoYXJhY3Rlci1saW1pdCcpWzBdLmlubmVySFRNTDsgICAgIFxuICAgIFxuICAgICAgICAgICAgICAgIC8qIERvbid0IHVwZGF0ZSB0aGUgbWVzc2FnZXMgdW5sZXNzIHRoZSBpbnB1dCBoYXMgY2hhbmdlZCBvciBpZiB0aGVyZVxuICAgICAgICAgICAgICAgIGlzIGEgbWlzbWF0Y2ggYmV0d2VlbiB0aGUgdmlzaWJsZSBtZXNzYWdlIGFuZCB0aGUgc2NyZWVuIHJlYWRlciBtZXNzYWdlLiAqL1xuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdGhpcy5pbnB1dC52YWx1ZSB8fCBzcl9tZXNzYWdlICE9PSB2aXNpYmxlX21lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWUgPSB0aGlzLmlucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU1lc3NhZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyksIDEwMDApO1xuICAgIH1cbiAgICBcbiAgICBsZXQgaGFuZGxlQmx1ciA9ICgpID0+IHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElEKTtcbiAgICAgICAgLy8gRG9uJ3QgdXBkYXRlIHRoZSBtZXNzYWdlcyBvbiBibHVyIHVubGVzcyB0aGUgdmFsdWUgb2YgdGhlIHRleHRhcmVhL3RleHQgaW5wdXQgaGFzIGNoYW5nZWRcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB0aGlzLmlucHV0LnZhbHVlKSB7XG4gICAgICAgICAgICBvbGRWYWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1lc3NhZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLm1heGxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDaGFyYWN0ZXIgbGltaXQgaXMgbWlzc2luZyBhdHRyaWJ1dGUgJHtNQVhfTEVOR1RIfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlS2V5VXAoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhhbmRsZUZvY3VzKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhhbmRsZUJsdXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyogSWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdGhlIHBhZ2VzaG93IGV2ZW50LCB1c2UgaXQgdG8gdXBkYXRlIHRoZSBjaGFyYWN0ZXIgbGltaXRcbiAgICAgICAgbWVzc2FnZSBhbmQgc3ItbWVzc2FnZSBvbmNlIGEgcGFnZSBoYXMgbG9hZGVkLiBTZWNvbmQgYmVzdCwgdXNlIHRoZSBET01Db250ZW50TG9hZGVkIGV2ZW50LiBcbiAgICAgICAgVGhpcyBlbnN1cmVzIHRoYXQgaWYgdGhlIHVzZXIgbmF2aWdhdGVzIHRvIGFub3RoZXIgcGFnZSBpbiB0aGUgYnJvd3NlciBhbmQgZ29lcyBiYWNrLCB0aGUgXG4gICAgICAgIG1lc3NhZ2UgYW5kIHNyLW1lc3NhZ2Ugd2lsbCBzaG93L3RlbGwgdGhlIGNvcnJlY3QgYW1vdW50IG9mIGNoYXJhY3RlcnMgbGVmdC4gKi9cbiAgICAgICAgaWYgKCdvbnBhZ2VzaG93JyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlc2hvdycsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU1lc3NhZ2VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU1lc3NhZ2VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS5jaGFyYWN0ZXJzTGVmdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgY3VycmVudF9sZW5ndGggPSB0aGlzLmlucHV0LnZhbHVlLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy5tYXhsZW5ndGggLSBjdXJyZW50X2xlbmd0aDtcbn1cblxuZnVuY3Rpb24gY2hhcmFjdGVyTGltaXRNZXNzYWdlKGZvcm1MaW1pdCkge1xuICAgIGxldCBjb3VudF9tZXNzYWdlID0gXCJcIjtcbiAgICBsZXQgY2hhcmFjdGVyc19sZWZ0ID0gZm9ybUxpbWl0LmNoYXJhY3RlcnNMZWZ0KCk7XG5cbiAgICBpZiAoY2hhcmFjdGVyc19sZWZ0ID09PSAtMSkge1xuICAgICAgICBsZXQgZXhjZWVkZWQgPSBNYXRoLmFicyhjaGFyYWN0ZXJzX2xlZnQpO1xuICAgICAgICBjb3VudF9tZXNzYWdlID0gZm9ybUxpbWl0LnRleHQuY2hhcmFjdGVyX3Rvb19tYW55LnJlcGxhY2UoL3t2YWx1ZX0vLCBleGNlZWRlZCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGNoYXJhY3RlcnNfbGVmdCA9PT0gMSkge1xuICAgICAgICBjb3VudF9tZXNzYWdlID0gZm9ybUxpbWl0LnRleHQuY2hhcmFjdGVyX3JlbWFpbmluZy5yZXBsYWNlKC97dmFsdWV9LywgY2hhcmFjdGVyc19sZWZ0KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY2hhcmFjdGVyc19sZWZ0ID49IDApIHtcbiAgICAgICAgY291bnRfbWVzc2FnZSA9IGZvcm1MaW1pdC50ZXh0LmNoYXJhY3RlcnNfcmVtYWluaW5nLnJlcGxhY2UoL3t2YWx1ZX0vLCBjaGFyYWN0ZXJzX2xlZnQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbGV0IGV4Y2VlZGVkID0gTWF0aC5hYnMoY2hhcmFjdGVyc19sZWZ0KTtcbiAgICAgICAgY291bnRfbWVzc2FnZSA9IGZvcm1MaW1pdC50ZXh0LmNoYXJhY3RlcnNfdG9vX21hbnkucmVwbGFjZSgve3ZhbHVlfS8sIGV4Y2VlZGVkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY291bnRfbWVzc2FnZTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVmlzaWJsZU1lc3NhZ2UoZm9ybUxpbWl0KSB7XG4gICAgbGV0IGNoYXJhY3RlcnNfbGVmdCA9IGZvcm1MaW1pdC5jaGFyYWN0ZXJzTGVmdCgpO1xuICAgIGxldCBjb3VudF9tZXNzYWdlID0gY2hhcmFjdGVyTGltaXRNZXNzYWdlKGZvcm1MaW1pdCk7XG4gICAgbGV0IGNoYXJhY3Rlcl9sYWJlbCA9IGZvcm1MaW1pdC5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0JylbMF07XG5cbiAgICBpZiAoY2hhcmFjdGVyc19sZWZ0IDwgMCkge1xuICAgICAgICBpZiAoIWNoYXJhY3Rlcl9sYWJlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbWl0LWV4Y2VlZGVkJykpIHtcbiAgICAgICAgICAgIGNoYXJhY3Rlcl9sYWJlbC5jbGFzc0xpc3QuYWRkKCdsaW1pdC1leGNlZWRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZm9ybUxpbWl0LmlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybS1saW1pdC1lcnJvcicpKSB7XG4gICAgICAgICAgICBmb3JtTGltaXQuaW5wdXQuY2xhc3NMaXN0LmFkZCgnZm9ybS1saW1pdC1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoY2hhcmFjdGVyX2xhYmVsLmNsYXNzTGlzdC5jb250YWlucygnbGltaXQtZXhjZWVkZWQnKSkge1xuICAgICAgICAgICAgY2hhcmFjdGVyX2xhYmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xpbWl0LWV4Y2VlZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1MaW1pdC5pbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm0tbGltaXQtZXJyb3InKSkge1xuICAgICAgICAgICAgZm9ybUxpbWl0LmlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2Zvcm0tbGltaXQtZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYXJhY3Rlcl9sYWJlbC5pbm5lckhUTUwgPSBjb3VudF9tZXNzYWdlO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTY3JlZW5SZWFkZXJNZXNzYWdlKGZvcm1MaW1pdCkge1xuICAgIGxldCBjb3VudF9tZXNzYWdlID0gY2hhcmFjdGVyTGltaXRNZXNzYWdlKGZvcm1MaW1pdCk7XG4gICAgbGV0IGNoYXJhY3Rlcl9sYWJlbCA9IGZvcm1MaW1pdC5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0LXNyLW9ubHknKVswXTtcbiAgICBjaGFyYWN0ZXJfbGFiZWwuaW5uZXJIVE1MID0gY291bnRfbWVzc2FnZTtcbn1cblxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLnVwZGF0ZU1lc3NhZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgIHVwZGF0ZVZpc2libGVNZXNzYWdlKHRoaXMpO1xuICAgIHVwZGF0ZVNjcmVlblJlYWRlck1lc3NhZ2UodGhpcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlckxpbWl0OyIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCAnLi4vcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kJztcblxuY29uc3QgVE9HR0xFX1RBUkdFVF9BVFRSSUJVVEUgPSAnZGF0YS1hcmlhLWNvbnRyb2xzJztcblxuLyoqXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gY2hlY2tib3ggY29sbGFwc2UgY29tcG9uZW50XG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBcbiAqL1xuZnVuY3Rpb24gQ2hlY2tib3hUb2dnbGVDb250ZW50KGNoZWNrYm94RWxlbWVudCl7XG4gICAgdGhpcy5jaGVja2JveEVsZW1lbnQgPSBjaGVja2JveEVsZW1lbnQ7XG4gICAgdGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcbn1cblxuLyoqXG4gKiBTZXQgZXZlbnRzIG9uIGNoZWNrYm94IHN0YXRlIGNoYW5nZVxuICovXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgIHRoaXMuY2hlY2tib3hFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMudG9nZ2xlLmJpbmQodGhpcykpO1xuICAgIHRoaXMudG9nZ2xlKCk7XG59XG5cbi8qKlxuICogVG9nZ2xlIGNoZWNrYm94IGNvbnRlbnRcbiAqL1xuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpe1xuICAgIHZhciAkbW9kdWxlID0gdGhpcztcbiAgICB2YXIgdGFyZ2V0QXR0ciA9IHRoaXMuY2hlY2tib3hFbGVtZW50LmdldEF0dHJpYnV0ZShUT0dHTEVfVEFSR0VUX0FUVFJJQlVURSlcbiAgICB2YXIgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyKTtcbiAgICBpZih0YXJnZXRFbCA9PT0gbnVsbCB8fCB0YXJnZXRFbCA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBwYW5lbCBlbGVtZW50LiBWZXJpZnkgdmFsdWUgb2YgYXR0cmlidXRlIGArIFRPR0dMRV9UQVJHRVRfQVRUUklCVVRFKTtcbiAgICB9XG4gICAgaWYodGhpcy5jaGVja2JveEVsZW1lbnQuY2hlY2tlZCl7XG4gICAgICAgICRtb2R1bGUuZXhwYW5kKHRoaXMuY2hlY2tib3hFbGVtZW50LCB0YXJnZXRFbCk7XG4gICAgfWVsc2V7XG4gICAgICAgICRtb2R1bGUuY29sbGFwc2UodGhpcy5jaGVja2JveEVsZW1lbnQsIHRhcmdldEVsKTtcbiAgICB9XG59XG5cbi8qKlxuICogRXhwYW5kIGNvbnRlbnRcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gY2hlY2tib3hFbGVtZW50IENoZWNrYm94IGlucHV0IGVsZW1lbnQgXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudCBDb250ZW50IGNvbnRhaW5lciBlbGVtZW50IFxuICovXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLmV4cGFuZCA9IGZ1bmN0aW9uKGNoZWNrYm94RWxlbWVudCwgY29udGVudEVsZW1lbnQpe1xuICAgIGlmKGNoZWNrYm94RWxlbWVudCAhPT0gbnVsbCAmJiBjaGVja2JveEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgY2hlY2tib3hFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1hcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgY29udGVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLmV4cGFuZGVkJyk7XG4gICAgICAgIGNoZWNrYm94RWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XG4gICAgfVxufVxuXG4vKipcbiAqIENvbGxhcHNlIGNvbnRlbnRcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gY2hlY2tib3hFbGVtZW50IENoZWNrYm94IGlucHV0IGVsZW1lbnQgXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudCBDb250ZW50IGNvbnRhaW5lciBlbGVtZW50IFxuICovXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLmNvbGxhcHNlID0gZnVuY3Rpb24odHJpZ2dlckVsLCB0YXJnZXRFbCl7XG4gICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICBcbiAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5jb2xsYXBzZS5jb2xsYXBzZWQnKTtcbiAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGVja2JveFRvZ2dsZUNvbnRlbnQ7XG4iLCJpbXBvcnQge2tleW1hcH0gZnJvbSAncmVjZXB0b3InO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKFwiLi4vdXRpbHMvYmVoYXZpb3JcIik7XG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKFwiLi4vdXRpbHMvc2VsZWN0XCIpO1xuY29uc3QgeyBwcmVmaXg6IFBSRUZJWCB9ID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKTtcbmNvbnN0IHsgQ0xJQ0sgfSA9IHJlcXVpcmUoXCIuLi9ldmVudHNcIik7XG5jb25zdCBhY3RpdmVFbGVtZW50ID0gcmVxdWlyZShcIi4uL3V0aWxzL2FjdGl2ZS1lbGVtZW50XCIpO1xuY29uc3QgaXNJb3NEZXZpY2UgPSByZXF1aXJlKFwiLi4vdXRpbHMvaXMtaW9zLWRldmljZVwiKTtcblxuY29uc3QgREFURV9QSUNLRVJfQ0xBU1MgPSBgZGF0ZS1waWNrZXJgO1xuY29uc3QgREFURV9QSUNLRVJfV1JBUFBFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fd3JhcHBlcmA7XG5jb25zdCBEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfS0taW5pdGlhbGl6ZWRgO1xuY29uc3QgREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9LS1hY3RpdmVgO1xuY29uc3QgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2ludGVybmFsLWlucHV0YDtcbmNvbnN0IERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19leHRlcm5hbC1pbnB1dGA7XG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2J1dHRvbmA7XG5jb25zdCBEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fY2FsZW5kYXJgO1xuY29uc3QgREFURV9QSUNLRVJfU1RBVFVTX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19zdGF0dXNgO1xuY29uc3QgREFURV9QSUNLRVJfR1VJREVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2d1aWRlYDtcbmNvbnN0IENBTEVOREFSX0RBVEVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RhdGVgO1xuXG5jb25zdCBESUFMT0dfV1JBUFBFUl9DTEFTUyA9IGBkaWFsb2ctd3JhcHBlcmA7XG5jb25zdCBEQVRFX1BJQ0tFUl9ESUFMT0dfV1JBUFBFUiA9IGAuJHtESUFMT0dfV1JBUFBFUl9DTEFTU31gO1xuXG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tZm9jdXNlZGA7XG5jb25zdCBDQUxFTkRBUl9EQVRFX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXNlbGVjdGVkYDtcbmNvbnN0IENBTEVOREFSX0RBVEVfUFJFVklPVVNfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcHJldmlvdXMtbW9udGhgO1xuY29uc3QgQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLWN1cnJlbnQtbW9udGhgO1xuY29uc3QgQ0FMRU5EQVJfREFURV9ORVhUX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLW5leHQtbW9udGhgO1xuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGVgO1xuY29uc3QgQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS10b2RheWA7XG5jb25zdCBDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfU1RBUlRfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcmFuZ2UtZGF0ZS1zdGFydGA7XG5jb25zdCBDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfRU5EX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGUtZW5kYDtcbmNvbnN0IENBTEVOREFSX0RBVEVfV0lUSElOX1JBTkdFX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXdpdGhpbi1yYW5nZWA7XG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy15ZWFyYDtcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy1tb250aGA7XG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQteWVhcmA7XG5jb25zdCBDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19uZXh0LW1vbnRoYDtcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtc2VsZWN0aW9uYDtcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyLXNlbGVjdGlvbmA7XG5jb25zdCBDQUxFTkRBUl9NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGhgO1xuY29uc3QgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX01PTlRIX0NMQVNTfS0tZm9jdXNlZGA7XG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX01PTlRIX0NMQVNTfS0tc2VsZWN0ZWRgO1xuY29uc3QgQ0FMRU5EQVJfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9feWVhcmA7XG5jb25zdCBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfS0tZm9jdXNlZGA7XG5jb25zdCBDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfWUVBUl9DTEFTU30tLXNlbGVjdGVkYDtcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTktfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLXllYXItY2h1bmtgO1xuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19uZXh0LXllYXItY2h1bmtgO1xuY29uc3QgQ0FMRU5EQVJfREFURV9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RhdGUtcGlja2VyYDtcbmNvbnN0IENBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtcGlja2VyYDtcbmNvbnN0IENBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyLXBpY2tlcmA7XG5jb25zdCBDQUxFTkRBUl9UQUJMRV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fdGFibGVgO1xuY29uc3QgQ0FMRU5EQVJfUk9XX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19yb3dgO1xuY29uc3QgQ0FMRU5EQVJfQ0VMTF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fY2VsbGA7XG5jb25zdCBDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTUyA9IGAke0NBTEVOREFSX0NFTExfQ0xBU1N9LS1jZW50ZXItaXRlbXNgO1xuY29uc3QgQ0FMRU5EQVJfTU9OVEhfTEFCRUxfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLWxhYmVsYDtcbmNvbnN0IENBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19kYXktb2Ytd2Vla2A7XG5cbmNvbnN0IERBVEVfUElDS0VSID0gYC4ke0RBVEVfUElDS0VSX0NMQVNTfWA7XG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT04gPSBgLiR7REFURV9QSUNLRVJfQlVUVE9OX0NMQVNTfWA7XG5jb25zdCBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTU31gO1xuY29uc3QgREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVQgPSBgLiR7REFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1N9YDtcbmNvbnN0IERBVEVfUElDS0VSX0NBTEVOREFSID0gYC4ke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfWA7XG5jb25zdCBEQVRFX1BJQ0tFUl9TVEFUVVMgPSBgLiR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfWA7XG5jb25zdCBEQVRFX1BJQ0tFUl9HVUlERSA9IGAuJHtEQVRFX1BJQ0tFUl9HVUlERV9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfREFURSA9IGAuJHtDQUxFTkRBUl9EQVRFX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfREFURV9GT0NVU0VEX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEggPSBgLiR7Q0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9YDtcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX01PTlRIID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVIgPSBgLiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9ORVhUX01PTlRIID0gYC4ke0NBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1N9YDtcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OID0gYC4ke0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RJT04gPSBgLiR7Q0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9NT05USCA9IGAuJHtDQUxFTkRBUl9NT05USF9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfWUVBUiA9IGAuJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTktfQ0xBU1N9YDtcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyA9IGAuJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1N9YDtcbmNvbnN0IENBTEVOREFSX0RBVEVfUElDS0VSID0gYC4ke0NBTEVOREFSX0RBVEVfUElDS0VSX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9NT05USF9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9ZRUFSX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9ZRUFSX1BJQ0tFUl9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTfWA7XG5cbmxldCB0ZXh0ID0ge1xuICBcIm9wZW5fY2FsZW5kYXJcIjogXCLDhWJuIGthbGVuZGVyXCIsXG4gIFwiY2hvb3NlX2FfZGF0ZVwiOiBcIlbDpmxnIGVuIGRhdG9cIixcbiAgXCJjaG9vc2VfYV9kYXRlX2JldHdlZW5cIjogXCJWw6ZsZyBlbiBkYXRvIG1lbGxlbSB7bWluRGF5fS4ge21pbk1vbnRoU3RyfSB7bWluWWVhcn0gb2cge21heERheX0uIHttYXhNb250aFN0cn0ge21heFllYXJ9XCIsXG4gIFwiY2hvb3NlX2FfZGF0ZV9iZWZvcmVcIjogXCJWw6ZsZyBlbiBkYXRvLiBEZXIga2FuIHbDpmxnZXMgaW5kdGlsIHttYXhEYXl9LiB7bWF4TW9udGhTdHJ9IHttYXhZZWFyfS5cIixcbiAgXCJjaG9vc2VfYV9kYXRlX2FmdGVyXCI6IFwiVsOmbGcgZW4gZGF0by4gRGVyIGthbiB2w6ZsZ2VzIGZyYSB7bWluRGF5fS4ge21pbk1vbnRoU3RyfSB7bWluWWVhcn0gb2cgZnJlbWFkLlwiLFxuICBcImFyaWFfbGFiZWxfZGF0ZVwiOiBcIntkYXlTdHJ9IGRlbiB7ZGF5fS4ge21vbnRoU3RyfSB7eWVhcn1cIixcbiAgXCJjdXJyZW50X21vbnRoX2Rpc3BsYXllZFwiOiBcIlZpc2VyIHttb250aExhYmVsfSB7Zm9jdXNlZFllYXJ9XCIsXG4gIFwiZmlyc3RfcG9zc2libGVfZGF0ZVwiOiBcIkbDuHJzdGUgdmFsZ2JhcmUgZGF0b1wiLFxuICBcImxhc3RfcG9zc2libGVfZGF0ZVwiOiBcIlNpZHN0ZSB2YWxnYmFyZSBkYXRvXCIsXG4gIFwicHJldmlvdXNfeWVhclwiOiBcIk5hdmlnw6lyIMOpdCDDpXIgdGlsYmFnZVwiLFxuICBcInByZXZpb3VzX21vbnRoXCI6IFwiTmF2aWfDqXIgw6luIG3DpW5lZCB0aWxiYWdlXCIsXG4gIFwibmV4dF9tb250aFwiOiBcIk5hdmlnw6lyIMOpbiBtw6VuZWQgZnJlbVwiLFxuICBcIm5leHRfeWVhclwiOiBcIk5hdmlnw6lyIMOpdCDDpXIgZnJlbVwiLFxuICBcInNlbGVjdF9tb250aFwiOiBcIlbDpmxnIG3DpW5lZFwiLFxuICBcInNlbGVjdF95ZWFyXCI6IFwiVsOmbGcgw6VyXCIsXG4gIFwicHJldmlvdXNfeWVhcnNcIjogXCJOYXZpZ8OpciB7eWVhcnN9IMOlciB0aWxiYWdlXCIsXG4gIFwibmV4dF95ZWFyc1wiOiBcIk5hdmlnw6lyIHt5ZWFyc30gw6VyIGZyZW1cIixcbiAgXCJndWlkZVwiOiBcIk5hdmlnZXJlciBkdSBtZWQgdGFzdGF0dXIsIGthbiBkdSBza2lmdGUgZGFnIG1lZCBow7hqcmUgb2cgdmVuc3RyZSBwaWxldGFzdGVyLCB1Z2VyIG1lZCBvcCBvZyBuZWQgcGlsZXRhc3RlciwgbcOlbmVkZXIgbWVkIHBhZ2UgdXAgb2cgcGFnZSBkb3duLXRhc3Rlcm5lIG9nIMOlciBtZWQgc2hpZnQtdGFzdGVuIHBsdXMgcGFnZSB1cCBlbGxlciBwYWdlIGRvd24uIEhvbWUgb2cgZW5kLXRhc3RlbiBuYXZpZ2VyZXIgdGlsIHN0YXJ0IGVsbGVyIHNsdXRuaW5nIGFmIGVuIHVnZS5cIixcbiAgXCJtb250aHNfZGlzcGxheWVkXCI6IFwiVsOmbGcgZW4gbcOlbmVkXCIsXG4gIFwieWVhcnNfZGlzcGxheWVkXCI6IFwiVmlzZXIgw6VyIHtzdGFydH0gdGlsIHtlbmR9LiBWw6ZsZyBldCDDpXIuXCIsXG4gIFwiamFudWFyeVwiOiBcImphbnVhclwiLFxuICBcImZlYnJ1YXJ5XCI6IFwiZmVicnVhclwiLFxuICBcIm1hcmNoXCI6IFwibWFydHNcIixcbiAgXCJhcHJpbFwiOiBcImFwcmlsXCIsXG4gIFwibWF5XCI6IFwibWFqXCIsXG4gIFwianVuZVwiOiBcImp1bmlcIixcbiAgXCJqdWx5XCI6IFwianVsaVwiLFxuICBcImF1Z3VzdFwiOiBcImF1Z3VzdFwiLFxuICBcInNlcHRlbWJlclwiOiBcInNlcHRlbWJlclwiLFxuICBcIm9jdG9iZXJcIjogXCJva3RvYmVyXCIsXG4gIFwibm92ZW1iZXJcIjogXCJub3ZlbWJlclwiLFxuICBcImRlY2VtYmVyXCI6IFwiZGVjZW1iZXJcIixcbiAgXCJtb25kYXlcIjogXCJtYW5kYWdcIixcbiAgXCJ0dWVzZGF5XCI6IFwidGlyc2RhZ1wiLFxuICBcIndlZG5lc2RheVwiOiBcIm9uc2RhZ1wiLFxuICBcInRodXJzZGF5XCI6IFwidG9yc2RhZ1wiLFxuICBcImZyaWRheVwiOiBcImZyZWRhZ1wiLFxuICBcInNhdHVyZGF5XCI6IFwibMO4cmRhZ1wiLFxuICBcInN1bmRheVwiOiBcInPDuG5kYWdcIlxufVxuXG5jb25zdCBWQUxJREFUSU9OX01FU1NBR0UgPSBcIkluZHRhc3QgdmVubGlnc3QgZW4gZ3lsZGlnIGRhdG9cIjtcblxubGV0IE1PTlRIX0xBQkVMUyA9IFtcbiAgdGV4dC5qYW51YXJ5LFxuICB0ZXh0LmZlYnJ1YXJ5LFxuICB0ZXh0Lm1hcmNoLFxuICB0ZXh0LmFwcmlsLFxuICB0ZXh0Lm1heSxcbiAgdGV4dC5qdW5lLFxuICB0ZXh0Lmp1bHksXG4gIHRleHQuYXVndXN0LFxuICB0ZXh0LnNlcHRlbWJlcixcbiAgdGV4dC5vY3RvYmVyLFxuICB0ZXh0Lm5vdmVtYmVyLFxuICB0ZXh0LmRlY2VtYmVyXG5dO1xuXG5sZXQgREFZX09GX1dFRUtfTEFCRUxTID0gW1xuICB0ZXh0Lm1vbmRheSxcbiAgdGV4dC50dWVzZGF5LFxuICB0ZXh0LndlZG5lc2RheSxcbiAgdGV4dC50aHVyc2RheSxcbiAgdGV4dC5mcmlkYXksXG4gIHRleHQuc2F0dXJkYXksXG4gIHRleHQuc3VuZGF5XG5dO1xuXG5jb25zdCBFTlRFUl9LRVlDT0RFID0gMTM7XG5cbmNvbnN0IFlFQVJfQ0hVTksgPSAxMjtcblxuY29uc3QgREVGQVVMVF9NSU5fREFURSA9IFwiMDAwMC0wMS0wMVwiO1xuY29uc3QgREFURV9GT1JNQVRfT1BUSU9OXzEgPSBcIkREL01NL1lZWVlcIjtcbmNvbnN0IERBVEVfRk9STUFUX09QVElPTl8yID0gXCJERC1NTS1ZWVlZXCI7XG5jb25zdCBEQVRFX0ZPUk1BVF9PUFRJT05fMyA9IFwiREQuTU0uWVlZWVwiO1xuY29uc3QgREFURV9GT1JNQVRfT1BUSU9OXzQgPSBcIkREIE1NIFlZWVlcIjtcbmNvbnN0IERBVEVfRk9STUFUX09QVElPTl81ID0gXCJERC9NTS1ZWVlZXCI7XG5jb25zdCBJTlRFUk5BTF9EQVRFX0ZPUk1BVCA9IFwiWVlZWS1NTS1ERFwiO1xuXG5jb25zdCBOT1RfRElTQUJMRURfU0VMRUNUT1IgPSBcIjpub3QoW2Rpc2FibGVkXSlcIjtcblxuY29uc3QgcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyA9ICguLi5zZWxlY3RvcnMpID0+XG4gIHNlbGVjdG9ycy5tYXAoKHF1ZXJ5KSA9PiBxdWVyeSArIE5PVF9ESVNBQkxFRF9TRUxFQ1RPUikuam9pbihcIiwgXCIpO1xuXG5jb25zdCBEQVRFX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSLFxuICBDQUxFTkRBUl9QUkVWSU9VU19NT05USCxcbiAgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT04sXG4gIENBTEVOREFSX01PTlRIX1NFTEVDVElPTixcbiAgQ0FMRU5EQVJfTkVYVF9ZRUFSLFxuICBDQUxFTkRBUl9ORVhUX01PTlRILFxuICBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURcbik7XG5cbmNvbnN0IE1PTlRIX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxuICBDQUxFTkRBUl9NT05USF9GT0NVU0VEXG4pO1xuXG5jb25zdCBZRUFSX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LLFxuICBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTkssXG4gIENBTEVOREFSX1lFQVJfRk9DVVNFRFxuKTtcblxuLy8gI3JlZ2lvbiBEYXRlIE1hbmlwdWxhdGlvbiBGdW5jdGlvbnNcblxuLyoqXG4gKiBLZWVwIGRhdGUgd2l0aGluIG1vbnRoLiBNb250aCB3b3VsZCBvbmx5IGJlIG92ZXIgYnkgMSB0byAzIGRheXNcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVUb0NoZWNrIHRoZSBkYXRlIG9iamVjdCB0byBjaGVja1xuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHRoZSBjb3JyZWN0IG1vbnRoXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGRhdGUsIGNvcnJlY3RlZCBpZiBuZWVkZWRcbiAqL1xuY29uc3Qga2VlcERhdGVXaXRoaW5Nb250aCA9IChkYXRlVG9DaGVjaywgbW9udGgpID0+IHtcbiAgaWYgKG1vbnRoICE9PSBkYXRlVG9DaGVjay5nZXRNb250aCgpKSB7XG4gICAgZGF0ZVRvQ2hlY2suc2V0RGF0ZSgwKTtcbiAgfVxuXG4gIHJldHVybiBkYXRlVG9DaGVjaztcbn07XG5cbi8qKlxuICogU2V0IGRhdGUgZnJvbSBtb250aCBkYXkgeWVhclxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIHRoZSB5ZWFyIHRvIHNldFxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHRoZSBtb250aCB0byBzZXQgKHplcm8taW5kZXhlZClcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIHNldFxuICogQHJldHVybnMge0RhdGV9IHRoZSBzZXQgZGF0ZVxuICovXG5jb25zdCBzZXREYXRlID0gKHllYXIsIG1vbnRoLCBkYXRlKSA9PiB7XG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcbiAgbmV3RGF0ZS5zZXRGdWxsWWVhcih5ZWFyLCBtb250aCwgZGF0ZSk7XG4gIHJldHVybiBuZXdEYXRlO1xufTtcblxuLyoqXG4gKiB0b2RheXMgZGF0ZVxuICpcbiAqIEByZXR1cm5zIHtEYXRlfSB0b2RheXMgZGF0ZVxuICovXG5jb25zdCB0b2RheSA9ICgpID0+IHtcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IGRheSA9IG5ld0RhdGUuZ2V0RGF0ZSgpO1xuICBjb25zdCBtb250aCA9IG5ld0RhdGUuZ2V0TW9udGgoKTtcbiAgY29uc3QgeWVhciA9IG5ld0RhdGUuZ2V0RnVsbFllYXIoKTtcbiAgcmV0dXJuIHNldERhdGUoeWVhciwgbW9udGgsIGRheSk7XG59O1xuXG4vKipcbiAqIFNldCBkYXRlIHRvIGZpcnN0IGRheSBvZiB0aGUgbW9udGhcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxuICovXG5jb25zdCBzdGFydE9mTW9udGggPSAoZGF0ZSkgPT4ge1xuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoMCk7XG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIDEpO1xuICByZXR1cm4gbmV3RGF0ZTtcbn07XG5cbi8qKlxuICogU2V0IGRhdGUgdG8gbGFzdCBkYXkgb2YgdGhlIG1vbnRoXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcbiAqL1xuY29uc3QgbGFzdERheU9mTW9udGggPSAoZGF0ZSkgPT4ge1xuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoMCk7XG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCkgKyAxLCAwKTtcbiAgcmV0dXJuIG5ld0RhdGU7XG59O1xuXG4vKipcbiAqIEFkZCBkYXlzIHRvIGRhdGVcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxuICogQHBhcmFtIHtudW1iZXJ9IG51bURheXMgdGhlIGRpZmZlcmVuY2UgaW4gZGF5c1xuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IGFkZERheXMgPSAoX2RhdGUsIG51bURheXMpID0+IHtcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XG4gIG5ld0RhdGUuc2V0RGF0ZShuZXdEYXRlLmdldERhdGUoKSArIG51bURheXMpO1xuICByZXR1cm4gbmV3RGF0ZTtcbn07XG5cbi8qKlxuICogU3VidHJhY3QgZGF5cyBmcm9tIGRhdGVcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxuICogQHBhcmFtIHtudW1iZXJ9IG51bURheXMgdGhlIGRpZmZlcmVuY2UgaW4gZGF5c1xuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IHN1YkRheXMgPSAoX2RhdGUsIG51bURheXMpID0+IGFkZERheXMoX2RhdGUsIC1udW1EYXlzKTtcblxuLyoqXG4gKiBBZGQgd2Vla3MgdG8gZGF0ZVxuICpcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxuICovXG5jb25zdCBhZGRXZWVrcyA9IChfZGF0ZSwgbnVtV2Vla3MpID0+IGFkZERheXMoX2RhdGUsIG51bVdlZWtzICogNyk7XG5cbi8qKlxuICogU3VidHJhY3Qgd2Vla3MgZnJvbSBkYXRlXG4gKlxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IHN1YldlZWtzID0gKF9kYXRlLCBudW1XZWVrcykgPT4gYWRkV2Vla3MoX2RhdGUsIC1udW1XZWVrcyk7XG5cbi8qKlxuICogU2V0IGRhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIChNb25kYXkpXG4gKlxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxuICovXG5jb25zdCBzdGFydE9mV2VlayA9IChfZGF0ZSkgPT4ge1xuICBsZXQgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCktMTtcbiAgaWYoZGF5T2ZXZWVrID09PSAtMSl7XG4gICAgZGF5T2ZXZWVrID0gNjtcbiAgfVxuICByZXR1cm4gc3ViRGF5cyhfZGF0ZSwgZGF5T2ZXZWVrKTtcbn07XG5cbi8qKlxuICogU2V0IGRhdGUgdG8gdGhlIGVuZCBvZiB0aGUgd2VlayAoU3VuZGF5KVxuICpcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxuICovXG5jb25zdCBlbmRPZldlZWsgPSAoX2RhdGUpID0+IHtcbiAgY29uc3QgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCk7XG4gIHJldHVybiBhZGREYXlzKF9kYXRlLCA3IC0gZGF5T2ZXZWVrKTtcbn07XG5cbi8qKlxuICogQWRkIG1vbnRocyB0byBkYXRlIGFuZCBrZWVwIGRhdGUgd2l0aGluIG1vbnRoXG4gKlxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1Nb250aHMgdGhlIGRpZmZlcmVuY2UgaW4gbW9udGhzXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcbiAqL1xuY29uc3QgYWRkTW9udGhzID0gKF9kYXRlLCBudW1Nb250aHMpID0+IHtcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XG5cbiAgY29uc3QgZGF0ZU1vbnRoID0gKG5ld0RhdGUuZ2V0TW9udGgoKSArIDEyICsgbnVtTW9udGhzKSAlIDEyO1xuICBuZXdEYXRlLnNldE1vbnRoKG5ld0RhdGUuZ2V0TW9udGgoKSArIG51bU1vbnRocyk7XG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgZGF0ZU1vbnRoKTtcblxuICByZXR1cm4gbmV3RGF0ZTtcbn07XG5cbi8qKlxuICogU3VidHJhY3QgbW9udGhzIGZyb20gZGF0ZVxuICpcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XG4gKiBAcGFyYW0ge251bWJlcn0gbnVtTW9udGhzIHRoZSBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IHN1Yk1vbnRocyA9IChfZGF0ZSwgbnVtTW9udGhzKSA9PiBhZGRNb250aHMoX2RhdGUsIC1udW1Nb250aHMpO1xuXG4vKipcbiAqIEFkZCB5ZWFycyB0byBkYXRlIGFuZCBrZWVwIGRhdGUgd2l0aGluIG1vbnRoXG4gKlxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1ZZWFycyB0aGUgZGlmZmVyZW5jZSBpbiB5ZWFyc1xuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IGFkZFllYXJzID0gKF9kYXRlLCBudW1ZZWFycykgPT4gYWRkTW9udGhzKF9kYXRlLCBudW1ZZWFycyAqIDEyKTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB5ZWFycyBmcm9tIGRhdGVcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxuICogQHBhcmFtIHtudW1iZXJ9IG51bVllYXJzIHRoZSBkaWZmZXJlbmNlIGluIHllYXJzXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcbiAqL1xuY29uc3Qgc3ViWWVhcnMgPSAoX2RhdGUsIG51bVllYXJzKSA9PiBhZGRZZWFycyhfZGF0ZSwgLW51bVllYXJzKTtcblxuLyoqXG4gKiBTZXQgbW9udGhzIG9mIGRhdGVcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHplcm8taW5kZXhlZCBtb250aCB0byBzZXRcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxuICovXG5jb25zdCBzZXRNb250aCA9IChfZGF0ZSwgbW9udGgpID0+IHtcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XG5cbiAgbmV3RGF0ZS5zZXRNb250aChtb250aCk7XG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgbW9udGgpO1xuXG4gIHJldHVybiBuZXdEYXRlO1xufTtcblxuLyoqXG4gKiBTZXQgeWVhciBvZiBkYXRlXG4gKlxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIHRoZSB5ZWFyIHRvIHNldFxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IHNldFllYXIgPSAoX2RhdGUsIHllYXIpID0+IHtcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XG5cbiAgY29uc3QgbW9udGggPSBuZXdEYXRlLmdldE1vbnRoKCk7XG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhcik7XG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgbW9udGgpO1xuXG4gIHJldHVybiBuZXdEYXRlO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGVhcmxpZXN0IGRhdGVcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZWFybGllc3QgZGF0ZVxuICovXG5jb25zdCBtaW4gPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XG4gIGxldCBuZXdEYXRlID0gZGF0ZUE7XG5cbiAgaWYgKGRhdGVCIDwgZGF0ZUEpIHtcbiAgICBuZXdEYXRlID0gZGF0ZUI7XG4gIH1cblxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxhdGVzdCBkYXRlXG4gKlxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGxhdGVzdCBkYXRlXG4gKi9cbmNvbnN0IG1heCA9IChkYXRlQSwgZGF0ZUIpID0+IHtcbiAgbGV0IG5ld0RhdGUgPSBkYXRlQTtcblxuICBpZiAoZGF0ZUIgPiBkYXRlQSkge1xuICAgIG5ld0RhdGUgPSBkYXRlQjtcbiAgfVxuXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgaW4gdGhlIHNhbWUgeWVhclxuICpcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSB5ZWFyXG4gKi9cbmNvbnN0IGlzU2FtZVllYXIgPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XG4gIHJldHVybiBkYXRlQSAmJiBkYXRlQiAmJiBkYXRlQS5nZXRGdWxsWWVhcigpID09PSBkYXRlQi5nZXRGdWxsWWVhcigpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIGluIHRoZSBzYW1lIG1vbnRoXG4gKlxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYXJlIGRhdGVzIGluIHRoZSBzYW1lIG1vbnRoXG4gKi9cbmNvbnN0IGlzU2FtZU1vbnRoID0gKGRhdGVBLCBkYXRlQikgPT4ge1xuICByZXR1cm4gaXNTYW1lWWVhcihkYXRlQSwgZGF0ZUIpICYmIGRhdGVBLmdldE1vbnRoKCkgPT09IGRhdGVCLmdldE1vbnRoKCk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgc2FtZSBkYXRlXG4gKlxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSB0aGUgZGF0ZSB0byBjb21wYXJlXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIHRoZSBkYXRlIHRvIGNvbXBhcmVcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgdGhlIHNhbWUgZGF0ZVxuICovXG5jb25zdCBpc1NhbWVEYXkgPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XG4gIHJldHVybiBpc1NhbWVNb250aChkYXRlQSwgZGF0ZUIpICYmIGRhdGVBLmdldERhdGUoKSA9PT0gZGF0ZUIuZ2V0RGF0ZSgpO1xufTtcblxuLyoqXG4gKiByZXR1cm4gYSBuZXcgZGF0ZSB3aXRoaW4gbWluaW11bSBhbmQgbWF4aW11bSBkYXRlXG4gKlxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZGF0ZSBiZXR3ZWVuIG1pbiBhbmQgbWF4XG4gKi9cbmNvbnN0IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XG4gIGxldCBuZXdEYXRlID0gZGF0ZTtcblxuICBpZiAoZGF0ZSA8IG1pbkRhdGUpIHtcbiAgICBuZXdEYXRlID0gbWluRGF0ZTtcbiAgfSBlbHNlIGlmIChtYXhEYXRlICYmIGRhdGUgPiBtYXhEYXRlKSB7XG4gICAgbmV3RGF0ZSA9IG1heERhdGU7XG4gIH1cblxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBkYXRlcyBpcyB2YWxpZC5cbiAqXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlcmUgYSBkYXkgd2l0aGluIHRoZSBtb250aCB3aXRoaW4gbWluIGFuZCBtYXggZGF0ZXNcbiAqL1xuY29uc3QgaXNEYXRlV2l0aGluTWluQW5kTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+XG4gIGRhdGUgPj0gbWluRGF0ZSAmJiAoIW1heERhdGUgfHwgZGF0ZSA8PSBtYXhEYXRlKTtcblxuLyoqXG4gKiBDaGVjayBpZiBkYXRlcyBtb250aCBpcyBpbnZhbGlkLlxuICpcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XG4gKiBAcmV0dXJuIHtib29sZWFufSBpcyB0aGUgbW9udGggb3V0c2lkZSBtaW4gb3IgbWF4IGRhdGVzXG4gKi9cbmNvbnN0IGlzRGF0ZXNNb250aE91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XG4gIHJldHVybiAoXG4gICAgbGFzdERheU9mTW9udGgoZGF0ZSkgPCBtaW5EYXRlIHx8IChtYXhEYXRlICYmIHN0YXJ0T2ZNb250aChkYXRlKSA+IG1heERhdGUpXG4gICk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGRhdGVzIHllYXIgaXMgaW52YWxpZC5cbiAqXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlIG1vbnRoIG91dHNpZGUgbWluIG9yIG1heCBkYXRlc1xuICovXG5jb25zdCBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XG4gIHJldHVybiAoXG4gICAgbGFzdERheU9mTW9udGgoc2V0TW9udGgoZGF0ZSwgMTEpKSA8IG1pbkRhdGUgfHxcbiAgICAobWF4RGF0ZSAmJiBzdGFydE9mTW9udGgoc2V0TW9udGgoZGF0ZSwgMCkpID4gbWF4RGF0ZSlcbiAgKTtcbn07XG5cbi8qKlxuICogUGFyc2UgYSBkYXRlIHdpdGggZm9ybWF0IEQtTS1ZWVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIHRoZSBkYXRlIHN0cmluZyB0byBwYXJzZVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVGb3JtYXQgdGhlIGZvcm1hdCBvZiB0aGUgZGF0ZSBzdHJpbmdcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWRqdXN0RGF0ZSBzaG91bGQgdGhlIGRhdGUgYmUgYWRqdXN0ZWRcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgcGFyc2VkIGRhdGVcbiAqL1xuY29uc3QgcGFyc2VEYXRlU3RyaW5nID0gKFxuICBkYXRlU3RyaW5nLFxuICBkYXRlRm9ybWF0ID0gSU5URVJOQUxfREFURV9GT1JNQVQsXG4gIGFkanVzdERhdGUgPSBmYWxzZVxuKSA9PiB7XG4gIGxldCBkYXRlO1xuICBsZXQgbW9udGg7XG4gIGxldCBkYXk7XG4gIGxldCB5ZWFyO1xuICBsZXQgcGFyc2VkO1xuXG4gIGlmIChkYXRlU3RyaW5nKSB7XG4gICAgbGV0IG1vbnRoU3RyLCBkYXlTdHIsIHllYXJTdHI7XG4gICAgaWYgKGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl8xIHx8IGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl8yIHx8IGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl8zIHx8IGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl80IHx8IGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl81KSB7XG4gICAgICBbZGF5U3RyLCBtb250aFN0ciwgeWVhclN0cl0gPSBkYXRlU3RyaW5nLnNwbGl0KC8tfFxcLnxcXC98XFxzLyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFt5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyXSA9IGRhdGVTdHJpbmcuc3BsaXQoXCItXCIpO1xuICAgIH1cblxuICAgIGlmICh5ZWFyU3RyKSB7XG4gICAgICBwYXJzZWQgPSBwYXJzZUludCh5ZWFyU3RyLCAxMCk7XG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XG4gICAgICAgIHllYXIgPSBwYXJzZWQ7XG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XG4gICAgICAgICAgeWVhciA9IE1hdGgubWF4KDAsIHllYXIpO1xuICAgICAgICAgIGlmICh5ZWFyU3RyLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gdG9kYXkoKS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXJTdHViID1cbiAgICAgICAgICAgICAgY3VycmVudFllYXIgLSAoY3VycmVudFllYXIgJSAxMCAqKiB5ZWFyU3RyLmxlbmd0aCk7XG4gICAgICAgICAgICB5ZWFyID0gY3VycmVudFllYXJTdHViICsgcGFyc2VkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb250aFN0cikge1xuICAgICAgcGFyc2VkID0gcGFyc2VJbnQobW9udGhTdHIsIDEwKTtcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcbiAgICAgICAgbW9udGggPSBwYXJzZWQ7XG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XG4gICAgICAgICAgbW9udGggPSBNYXRoLm1heCgxLCBtb250aCk7XG4gICAgICAgICAgbW9udGggPSBNYXRoLm1pbigxMiwgbW9udGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1vbnRoICYmIGRheVN0ciAmJiB5ZWFyICE9IG51bGwpIHtcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KGRheVN0ciwgMTApO1xuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xuICAgICAgICBkYXkgPSBwYXJzZWQ7XG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XG4gICAgICAgICAgY29uc3QgbGFzdERheU9mVGhlTW9udGggPSBzZXREYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKCk7XG4gICAgICAgICAgZGF5ID0gTWF0aC5tYXgoMSwgZGF5KTtcbiAgICAgICAgICBkYXkgPSBNYXRoLm1pbihsYXN0RGF5T2ZUaGVNb250aCwgZGF5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb250aCAmJiBkYXkgJiYgeWVhciAhPSBudWxsKSB7XG4gICAgICBkYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRhdGU7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBhIGRhdGUgdG8gZm9ybWF0IERELU1NLVlZWVlcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgdGhlIGRhdGUgdG8gZm9ybWF0XG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCB0aGUgZm9ybWF0IG9mIHRoZSBkYXRlIHN0cmluZ1xuICogQHJldHVybnMge3N0cmluZ30gdGhlIGZvcm1hdHRlZCBkYXRlIHN0cmluZ1xuICovXG5jb25zdCBmb3JtYXREYXRlID0gKGRhdGUsIGRhdGVGb3JtYXQgPSBJTlRFUk5BTF9EQVRFX0ZPUk1BVCkgPT4ge1xuICBjb25zdCBwYWRaZXJvcyA9ICh2YWx1ZSwgbGVuZ3RoKSA9PiB7XG4gICAgcmV0dXJuIGAwMDAwJHt2YWx1ZX1gLnNsaWNlKC1sZW5ndGgpO1xuICB9O1xuXG4gIGNvbnN0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG4gIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgaWYgKGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl8xKSB7XG4gICAgcmV0dXJuIFtwYWRaZXJvcyhkYXksIDIpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKHllYXIsIDQpXS5qb2luKFwiL1wiKTtcbiAgfVxuICBlbHNlIGlmIChkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fMikge1xuICAgIHJldHVybiBbcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyh5ZWFyLCA0KV0uam9pbihcIi1cIik7XG4gIH1cbiAgZWxzZSBpZiAoZGF0ZUZvcm1hdCA9PT0gREFURV9GT1JNQVRfT1BUSU9OXzMpIHtcbiAgICByZXR1cm4gW3BhZFplcm9zKGRheSwgMiksIHBhZFplcm9zKG1vbnRoLCAyKSwgcGFkWmVyb3MoeWVhciwgNCldLmpvaW4oXCIuXCIpO1xuICB9XG4gIGVsc2UgaWYgKGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl80KSB7XG4gICAgcmV0dXJuIFtwYWRaZXJvcyhkYXksIDIpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKHllYXIsIDQpXS5qb2luKFwiIFwiKTtcbiAgfVxuICBlbHNlIGlmIChkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fNSkge1xuICAgIGxldCB0ZW1wRGF5TW9udGggPSBbcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MobW9udGgsIDIpXS5qb2luKFwiL1wiKTtcbiAgICByZXR1cm4gW3RlbXBEYXlNb250aCwgcGFkWmVyb3MoeWVhciwgNCldLmpvaW4oXCItXCIpO1xuICB9XG5cbiAgcmV0dXJuIFtwYWRaZXJvcyh5ZWFyLCA0KSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyhkYXksIDIpXS5qb2luKFwiLVwiKTtcbn07XG5cbi8vICNlbmRyZWdpb24gRGF0ZSBNYW5pcHVsYXRpb24gRnVuY3Rpb25zXG5cbi8qKlxuICogQ3JlYXRlIGEgZ3JpZCBzdHJpbmcgZnJvbSBhbiBhcnJheSBvZiBodG1sIHN0cmluZ3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBodG1sQXJyYXkgdGhlIGFycmF5IG9mIGh0bWwgaXRlbXNcbiAqIEBwYXJhbSB7bnVtYmVyfSByb3dTaXplIHRoZSBsZW5ndGggb2YgYSByb3dcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBncmlkIHN0cmluZ1xuICovXG5jb25zdCBsaXN0VG9HcmlkSHRtbCA9IChodG1sQXJyYXksIHJvd1NpemUpID0+IHtcbiAgY29uc3QgZ3JpZCA9IFtdO1xuICBsZXQgcm93ID0gW107XG5cbiAgbGV0IGkgPSAwO1xuICB3aGlsZSAoaSA8IGh0bWxBcnJheS5sZW5ndGgpIHtcbiAgICByb3cgPSBbXTtcbiAgICB3aGlsZSAoaSA8IGh0bWxBcnJheS5sZW5ndGggJiYgcm93Lmxlbmd0aCA8IHJvd1NpemUpIHtcbiAgICAgIHJvdy5wdXNoKGA8dGQ+JHtodG1sQXJyYXlbaV19PC90ZD5gKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9XG4gICAgZ3JpZC5wdXNoKGA8dHI+JHtyb3cuam9pbihcIlwiKX08L3RyPmApO1xuICB9XG5cbiAgcmV0dXJuIGdyaWQuam9pbihcIlwiKTtcbn07XG5cbi8qKlxuICogc2V0IHRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudCBhbmQgZGlzcGF0Y2ggYSBjaGFuZ2UgZXZlbnRcbiAqXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGVsIFRoZSBlbGVtZW50IHRvIHVwZGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGVsZW1lbnRcbiAqL1xuY29uc3QgY2hhbmdlRWxlbWVudFZhbHVlID0gKGVsLCB2YWx1ZSA9IFwiXCIpID0+IHtcbiAgY29uc3QgZWxlbWVudFRvQ2hhbmdlID0gZWw7XG4gIGVsZW1lbnRUb0NoYW5nZS52YWx1ZSA9IHZhbHVlO1xuXG5cbiAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KCdjaGFuZ2UnKTtcbiAgZWxlbWVudFRvQ2hhbmdlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufTtcblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBhbmQgZWxlbWVudHMgd2l0aGluIHRoZSBkYXRlIHBpY2tlci5cbiAqIEB0eXBlZGVmIHtPYmplY3R9IERhdGVQaWNrZXJDb250ZXh0XG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBjYWxlbmRhckVsXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBkYXRlUGlja2VyRWxcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGRpYWxvZ0VsXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGludGVybmFsSW5wdXRFbFxuICogQHByb3BlcnR5IHtIVE1MSW5wdXRFbGVtZW50fSBleHRlcm5hbElucHV0RWxcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IHN0YXR1c0VsXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBndWlkZUVsXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBmaXJzdFllYXJDaHVua0VsXG4gKiBAcHJvcGVydHkge0RhdGV9IGNhbGVuZGFyRGF0ZVxuICogQHByb3BlcnR5IHtEYXRlfSBtaW5EYXRlXG4gKiBAcHJvcGVydHkge0RhdGV9IG1heERhdGVcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gc2VsZWN0ZWREYXRlXG4gKiBAcHJvcGVydHkge0RhdGV9IHJhbmdlRGF0ZVxuICogQHByb3BlcnR5IHtEYXRlfSBkZWZhdWx0RGF0ZVxuICovXG5cbi8qKlxuICogR2V0IGFuIG9iamVjdCBvZiB0aGUgcHJvcGVydGllcyBhbmQgZWxlbWVudHMgYmVsb25naW5nIGRpcmVjdGx5IHRvIHRoZSBnaXZlblxuICogZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRoZSBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXJcbiAqIEByZXR1cm5zIHtEYXRlUGlja2VyQ29udGV4dH0gZWxlbWVudHNcbiAqL1xuY29uc3QgZ2V0RGF0ZVBpY2tlckNvbnRleHQgPSAoZWwpID0+IHtcbiAgY29uc3QgZGF0ZVBpY2tlckVsID0gZWwuY2xvc2VzdChEQVRFX1BJQ0tFUik7XG5cbiAgaWYgKCFkYXRlUGlja2VyRWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgaXMgbWlzc2luZyBvdXRlciAke0RBVEVfUElDS0VSfWApO1xuICB9XG5cbiAgY29uc3QgaW50ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRcbiAgKTtcbiAgY29uc3QgZXh0ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoXG4gICAgREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRcbiAgKTtcbiAgY29uc3QgY2FsZW5kYXJFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX0NBTEVOREFSKTtcbiAgY29uc3QgdG9nZ2xlQnRuRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9CVVRUT04pO1xuICBjb25zdCBzdGF0dXNFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX1NUQVRVUyk7XG4gIGNvbnN0IGd1aWRlRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9HVUlERSk7XG4gIGNvbnN0IGZpcnN0WWVhckNodW5rRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSKTtcbiAgY29uc3QgZGlhbG9nRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9ESUFMT0dfV1JBUFBFUik7XG5cbiAgLy8gU2V0IGRhdGUgZm9ybWF0XG4gIGxldCBzZWxlY3RlZERhdGVGb3JtYXQgPSBEQVRFX0ZPUk1BVF9PUFRJT05fMTtcbiAgaWYgKGRhdGVQaWNrZXJFbC5oYXNBdHRyaWJ1dGUoXCJkYXRhLWRhdGVmb3JtYXRcIikpIHtcbiAgICBzd2l0Y2ggKGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRhdGVmb3JtYXQpIHtcbiAgICAgIGNhc2UgREFURV9GT1JNQVRfT1BUSU9OXzE6XG4gICAgICAgIHNlbGVjdGVkRGF0ZUZvcm1hdCA9IERBVEVfRk9STUFUX09QVElPTl8xO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgREFURV9GT1JNQVRfT1BUSU9OXzI6XG4gICAgICAgIHNlbGVjdGVkRGF0ZUZvcm1hdCA9IERBVEVfRk9STUFUX09QVElPTl8yO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgREFURV9GT1JNQVRfT1BUSU9OXzM6XG4gICAgICAgIHNlbGVjdGVkRGF0ZUZvcm1hdCA9IERBVEVfRk9STUFUX09QVElPTl8zO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgREFURV9GT1JNQVRfT1BUSU9OXzQ6XG4gICAgICAgIHNlbGVjdGVkRGF0ZUZvcm1hdCA9IERBVEVfRk9STUFUX09QVElPTl80O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgREFURV9GT1JNQVRfT1BUSU9OXzU6XG4gICAgICAgIHNlbGVjdGVkRGF0ZUZvcm1hdCA9IERBVEVfRk9STUFUX09QVElPTl81O1xuICAgIH1cbiAgfVxuICBjb25zdCBkYXRlRm9ybWF0T3B0aW9uID0gc2VsZWN0ZWREYXRlRm9ybWF0OyBcblxuICBjb25zdCBpbnB1dERhdGUgPSBwYXJzZURhdGVTdHJpbmcoXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnZhbHVlLFxuICAgIGRhdGVGb3JtYXRPcHRpb24sXG4gICAgdHJ1ZVxuICApO1xuICBjb25zdCBzZWxlY3RlZERhdGUgPSBwYXJzZURhdGVTdHJpbmcoaW50ZXJuYWxJbnB1dEVsLnZhbHVlKTtcblxuICBjb25zdCBjYWxlbmRhckRhdGUgPSBwYXJzZURhdGVTdHJpbmcoY2FsZW5kYXJFbC5kYXRhc2V0LnZhbHVlKTtcbiAgY29uc3QgbWluRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlKTtcbiAgY29uc3QgbWF4RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlKTtcbiAgY29uc3QgcmFuZ2VEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0LnJhbmdlRGF0ZSk7XG4gIGNvbnN0IGRlZmF1bHREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHREYXRlKTtcblxuICBpZiAobWluRGF0ZSAmJiBtYXhEYXRlICYmIG1pbkRhdGUgPiBtYXhEYXRlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTWluaW11bSBkYXRlIGNhbm5vdCBiZSBhZnRlciBtYXhpbXVtIGRhdGVcIik7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNhbGVuZGFyRGF0ZSxcbiAgICBtaW5EYXRlLFxuICAgIHRvZ2dsZUJ0bkVsLFxuICAgIGRpYWxvZ0VsLFxuICAgIHNlbGVjdGVkRGF0ZSxcbiAgICBtYXhEYXRlLFxuICAgIGZpcnN0WWVhckNodW5rRWwsXG4gICAgZGF0ZVBpY2tlckVsLFxuICAgIGlucHV0RGF0ZSxcbiAgICBpbnRlcm5hbElucHV0RWwsXG4gICAgZXh0ZXJuYWxJbnB1dEVsLFxuICAgIGNhbGVuZGFyRWwsXG4gICAgcmFuZ2VEYXRlLFxuICAgIGRlZmF1bHREYXRlLFxuICAgIHN0YXR1c0VsLFxuICAgIGd1aWRlRWwsXG4gICAgZGF0ZUZvcm1hdE9wdGlvblxuICB9O1xufTtcblxuLyoqXG4gKiBEaXNhYmxlIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IGRpc2FibGUgPSAoZWwpID0+IHtcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIHRvZ2dsZUJ0bkVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XG5cbiAgdG9nZ2xlQnRuRWwuZGlzYWJsZWQgPSB0cnVlO1xuICBleHRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSB0cnVlO1xufTtcblxuLyoqXG4gKiBFbmFibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgZW5hYmxlID0gKGVsKSA9PiB7XG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCB0b2dnbGVCdG5FbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xuXG4gIHRvZ2dsZUJ0bkVsLmRpc2FibGVkID0gZmFsc2U7XG4gIGV4dGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xufTtcblxuLy8gI3JlZ2lvbiBWYWxpZGF0aW9uXG5cbi8qKlxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IEQvTS9ZWVlZXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCBpc0RhdGVJbnB1dEludmFsaWQgPSAoZWwpID0+IHtcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcblxuICBjb25zdCBkYXRlU3RyaW5nID0gZXh0ZXJuYWxJbnB1dEVsLnZhbHVlO1xuICBsZXQgaXNJbnZhbGlkID0gZmFsc2U7XG5cbiAgaWYgKGRhdGVTdHJpbmcpIHtcbiAgICBpc0ludmFsaWQgPSB0cnVlO1xuXG4gICAgY29uc3QgZGF0ZVN0cmluZ1BhcnRzID0gZGF0ZVN0cmluZy5zcGxpdCgvLXxcXC58XFwvfFxccy8pO1xuICAgIGNvbnN0IFtkYXksIG1vbnRoLCB5ZWFyXSA9IGRhdGVTdHJpbmdQYXJ0cy5tYXAoKHN0cikgPT4ge1xuICAgICAgbGV0IHZhbHVlO1xuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQoc3RyLCAxMCk7XG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB2YWx1ZSA9IHBhcnNlZDtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9KTtcblxuICAgIGlmIChtb250aCAmJiBkYXkgJiYgeWVhciAhPSBudWxsKSB7XG4gICAgICBjb25zdCBjaGVja0RhdGUgPSBzZXREYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcblxuICAgICAgaWYgKFxuICAgICAgICBjaGVja0RhdGUuZ2V0TW9udGgoKSA9PT0gbW9udGggLSAxICYmXG4gICAgICAgIGNoZWNrRGF0ZS5nZXREYXRlKCkgPT09IGRheSAmJlxuICAgICAgICBjaGVja0RhdGUuZ2V0RnVsbFllYXIoKSA9PT0geWVhciAmJlxuICAgICAgICBkYXRlU3RyaW5nUGFydHNbMl0ubGVuZ3RoID09PSA0ICYmXG4gICAgICAgIGlzRGF0ZVdpdGhpbk1pbkFuZE1heChjaGVja0RhdGUsIG1pbkRhdGUsIG1heERhdGUpXG4gICAgICApIHtcbiAgICAgICAgaXNJbnZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGlzSW52YWxpZDtcbn07XG5cbi8qKlxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IE0vRC9ZWVlZXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCB2YWxpZGF0ZURhdGVJbnB1dCA9IChlbCkgPT4ge1xuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xuICBjb25zdCBpc0ludmFsaWQgPSBpc0RhdGVJbnB1dEludmFsaWQoZXh0ZXJuYWxJbnB1dEVsKTtcblxuICBpZiAoaXNJbnZhbGlkICYmICFleHRlcm5hbElucHV0RWwudmFsaWRhdGlvbk1lc3NhZ2UpIHtcbiAgICBleHRlcm5hbElucHV0RWwuc2V0Q3VzdG9tVmFsaWRpdHkoVkFMSURBVElPTl9NRVNTQUdFKTtcbiAgfVxuXG4gIGlmICghaXNJbnZhbGlkICYmIGV4dGVybmFsSW5wdXRFbC52YWxpZGF0aW9uTWVzc2FnZSA9PT0gVkFMSURBVElPTl9NRVNTQUdFKSB7XG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFwiXCIpO1xuICB9XG59O1xuXG4vLyAjZW5kcmVnaW9uIFZhbGlkYXRpb25cblxuLyoqXG4gKiBFbmFibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgcmVjb25jaWxlSW5wdXRWYWx1ZXMgPSAoZWwpID0+IHtcbiAgY29uc3QgeyBpbnRlcm5hbElucHV0RWwsIGlucHV0RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xuICBsZXQgbmV3VmFsdWUgPSBcIlwiO1xuXG4gIGlmIChpbnB1dERhdGUgJiYgIWlzRGF0ZUlucHV0SW52YWxpZChlbCkpIHtcbiAgICBuZXdWYWx1ZSA9IGZvcm1hdERhdGUoaW5wdXREYXRlKTtcbiAgfVxuXG4gIGlmIChpbnRlcm5hbElucHV0RWwudmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKGludGVybmFsSW5wdXRFbCwgbmV3VmFsdWUpO1xuICB9XG59O1xuXG4vKipcbiAqIFNlbGVjdCB0aGUgdmFsdWUgb2YgdGhlIGRhdGUgcGlja2VyIGlucHV0cy5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZVN0cmluZyBUaGUgZGF0ZSBzdHJpbmcgdG8gdXBkYXRlIGluIFlZWVktTU0tREQgZm9ybWF0XG4gKi9cbmNvbnN0IHNldENhbGVuZGFyVmFsdWUgPSAoZWwsIGRhdGVTdHJpbmcpID0+IHtcbiAgY29uc3QgcGFyc2VkRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlU3RyaW5nKTtcblxuICBpZiAocGFyc2VkRGF0ZSkge1xuICAgIFxuICAgIGNvbnN0IHtcbiAgICAgIGRhdGVQaWNrZXJFbCxcbiAgICAgIGludGVybmFsSW5wdXRFbCxcbiAgICAgIGV4dGVybmFsSW5wdXRFbCxcbiAgICAgIGRhdGVGb3JtYXRPcHRpb25cbiAgICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xuXG4gICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUocGFyc2VkRGF0ZSwgZGF0ZUZvcm1hdE9wdGlvbik7XG5cbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW50ZXJuYWxJbnB1dEVsLCBkYXRlU3RyaW5nKTtcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoZXh0ZXJuYWxJbnB1dEVsLCBmb3JtYXR0ZWREYXRlKTtcblxuICAgIHZhbGlkYXRlRGF0ZUlucHV0KGRhdGVQaWNrZXJFbCk7XG4gIH1cbn07XG5cbi8qKlxuICogRW5oYW5jZSBhbiBpbnB1dCB3aXRoIHRoZSBkYXRlIHBpY2tlciBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIFRoZSBpbml0aWFsIHdyYXBwaW5nIGVsZW1lbnQgb2YgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCBlbmhhbmNlRGF0ZVBpY2tlciA9IChlbCkgPT4ge1xuICBjb25zdCBkYXRlUGlja2VyRWwgPSBlbC5jbG9zZXN0KERBVEVfUElDS0VSKTtcbiAgY29uc3QgZGVmYXVsdFZhbHVlID0gZGF0ZVBpY2tlckVsLmRhdGFzZXQuZGVmYXVsdFZhbHVlO1xuXG4gIGNvbnN0IGludGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKGBpbnB1dGApO1xuXG4gIGlmICghaW50ZXJuYWxJbnB1dEVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke0RBVEVfUElDS0VSfSBpcyBtaXNzaW5nIGlubmVyIGlucHV0YCk7XG4gIH1cblxuICBjb25zdCBtaW5EYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxuICAgIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUgfHwgaW50ZXJuYWxJbnB1dEVsLmdldEF0dHJpYnV0ZShcIm1pblwiKVxuICApO1xuICBkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlID0gbWluRGF0ZVxuICAgID8gZm9ybWF0RGF0ZShtaW5EYXRlKVxuICAgIDogREVGQVVMVF9NSU5fREFURTtcblxuICBjb25zdCBtYXhEYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxuICAgIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUgfHwgaW50ZXJuYWxJbnB1dEVsLmdldEF0dHJpYnV0ZShcIm1heFwiKVxuICApO1xuICBpZiAobWF4RGF0ZSkge1xuICAgIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUgPSBmb3JtYXREYXRlKG1heERhdGUpO1xuICB9XG5cbiAgY29uc3QgY2FsZW5kYXJXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgY2FsZW5kYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfV1JBUFBFUl9DTEFTUyk7XG4gIGNhbGVuZGFyV3JhcHBlci50YWJJbmRleCA9IFwiLTFcIjtcblxuICBjb25zdCBleHRlcm5hbElucHV0RWwgPSBpbnRlcm5hbElucHV0RWwuY2xvbmVOb2RlKCk7XG4gIGV4dGVybmFsSW5wdXRFbC5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTKTtcbiAgZXh0ZXJuYWxJbnB1dEVsLnR5cGUgPSBcInRleHRcIjtcbiAgZXh0ZXJuYWxJbnB1dEVsLm5hbWUgPSBcIlwiO1xuXG4gIGxldCBkaWFsb2dUaXRsZSA9IHRleHQuY2hvb3NlX2FfZGF0ZTtcbiAgY29uc3QgaGFzTWluRGF0ZSA9IG1pbkRhdGUgIT09IHVuZGVmaW5lZCAmJiBtaW5EYXRlICE9PSBcIlwiO1xuICBjb25zdCBpc0RlZmF1bHRNaW5EYXRlID0gIG1pbkRhdGUgIT09IHVuZGVmaW5lZCAmJiBtaW5EYXRlICE9PSBcIlwiICYmIHBhcnNlRGF0ZVN0cmluZyhERUZBVUxUX01JTl9EQVRFKS5nZXRUaW1lKCkgPT09IG1pbkRhdGUuZ2V0VGltZSgpO1xuICBjb25zdCBoYXNNYXhEYXRlID0gbWF4RGF0ZSAhPT0gdW5kZWZpbmVkICYmIG1heERhdGUgIT09IFwiXCI7XG4gIFxuICBpZiAoaGFzTWluRGF0ZSAmJiAhaXNEZWZhdWx0TWluRGF0ZSAmJiBoYXNNYXhEYXRlKSB7XG4gICAgY29uc3QgbWluRGF5ID0gbWluRGF0ZS5nZXREYXRlKCk7XG4gICAgY29uc3QgbWluTW9udGggPSBtaW5EYXRlLmdldE1vbnRoKCk7XG4gICAgY29uc3QgbWluTW9udGhTdHIgPSBNT05USF9MQUJFTFNbbWluTW9udGhdO1xuICAgIGNvbnN0IG1pblllYXIgPSBtaW5EYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgbWF4RGF5ID0gbWF4RGF0ZS5nZXREYXRlKCk7XG4gICAgY29uc3QgbWF4TW9udGggPSBtYXhEYXRlLmdldE1vbnRoKCk7XG4gICAgY29uc3QgbWF4TW9udGhTdHIgPSBNT05USF9MQUJFTFNbbWF4TW9udGhdO1xuICAgIGNvbnN0IG1heFllYXIgPSBtYXhEYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgZGlhbG9nVGl0bGUgPSB0ZXh0LmNob29zZV9hX2RhdGVfYmV0d2Vlbi5yZXBsYWNlKC97bWluRGF5fS8sIG1pbkRheSkucmVwbGFjZSgve21pbk1vbnRoU3RyfS8sIG1pbk1vbnRoU3RyKS5yZXBsYWNlKC97bWluWWVhcn0vLCBtaW5ZZWFyKS5yZXBsYWNlKC97bWF4RGF5fS8sIG1heERheSkucmVwbGFjZSgve21heE1vbnRoU3RyfS8sIG1heE1vbnRoU3RyKS5yZXBsYWNlKC97bWF4WWVhcn0vLCBtYXhZZWFyKTtcbiAgfVxuICBlbHNlIGlmIChoYXNNaW5EYXRlICYmICFpc0RlZmF1bHRNaW5EYXRlICYmICFoYXNNYXhEYXRlKSB7XG4gICAgY29uc3QgbWluRGF5ID0gbWluRGF0ZS5nZXREYXRlKCk7XG4gICAgY29uc3QgbWluTW9udGggPSBtaW5EYXRlLmdldE1vbnRoKCk7XG4gICAgY29uc3QgbWluTW9udGhTdHIgPSBNT05USF9MQUJFTFNbbWluTW9udGhdO1xuICAgIGNvbnN0IG1pblllYXIgPSBtaW5EYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgZGlhbG9nVGl0bGUgPSB0ZXh0LmNob29zZV9hX2RhdGVfYWZ0ZXIucmVwbGFjZSgve21pbkRheX0vLCBtaW5EYXkpLnJlcGxhY2UoL3ttaW5Nb250aFN0cn0vLCBtaW5Nb250aFN0cikucmVwbGFjZSgve21pblllYXJ9LywgbWluWWVhcik7XG4gIH1cbiAgZWxzZSBpZiAoaGFzTWF4RGF0ZSkge1xuICAgIGNvbnN0IG1heERheSA9IG1heERhdGUuZ2V0RGF0ZSgpO1xuICAgIGNvbnN0IG1heE1vbnRoID0gbWF4RGF0ZS5nZXRNb250aCgpO1xuICAgIGNvbnN0IG1heE1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21heE1vbnRoXTtcbiAgICBjb25zdCBtYXhZZWFyID0gbWF4RGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIGRpYWxvZ1RpdGxlID0gdGV4dC5jaG9vc2VfYV9kYXRlX2JlZm9yZS5yZXBsYWNlKC97bWF4RGF5fS8sIG1heERheSkucmVwbGFjZSgve21heE1vbnRoU3RyfS8sIG1heE1vbnRoU3RyKS5yZXBsYWNlKC97bWF4WWVhcn0vLCBtYXhZZWFyKTtcbiAgfVxuXG4gIGNvbnN0IGd1aWRlSUQgPSBleHRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwiaWRcIikgKyBcIi1ndWlkZVwiO1xuXG4gIGNhbGVuZGFyV3JhcHBlci5hcHBlbmRDaGlsZChleHRlcm5hbElucHV0RWwpO1xuICBjYWxlbmRhcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgW1xuICAgICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1N9XCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWxhYmVsPVwiJHt0ZXh0Lm9wZW5fY2FsZW5kYXJ9XCI+Jm5ic3A7PC9idXR0b24+YCxcbiAgICAgIGA8ZGl2IGNsYXNzPVwiJHtESUFMT0dfV1JBUFBFUl9DTEFTU31cIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBhcmlhLWxhYmVsPVwiJHtkaWFsb2dUaXRsZX1cIiBhcmlhLWRlc2NyaWJlZGJ5PVwiJHtndWlkZUlEfVwiIGhpZGRlbj48ZGl2IHJvbGU9XCJhcHBsaWNhdGlvblwiPjxkaXYgY2xhc3M9XCIke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfVwiIGhpZGRlbj48L2Rpdj48L2Rpdj48L2Rpdj5gLFxuICAgICAgYDxkaXYgY2xhc3M9XCJzci1vbmx5ICR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfVwiIHJvbGU9XCJzdGF0dXNcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIj48L2Rpdj5gLFxuICAgICAgYDxkaXYgY2xhc3M9XCJzci1vbmx5ICR7REFURV9QSUNLRVJfR1VJREVfQ0xBU1N9XCIgaWQ9XCIke2d1aWRlSUR9XCIgaGlkZGVuPiR7dGV4dC5ndWlkZX08L2Rpdj5gXG4gICAgXS5qb2luKFwiXCIpXG4gICk7XG5cbiAgaW50ZXJuYWxJbnB1dEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgaW50ZXJuYWxJbnB1dEVsLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gIGludGVybmFsSW5wdXRFbC5jbGFzc0xpc3QuYWRkKFxuICAgIFwic3Itb25seVwiLFxuICAgIERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTXG4gICk7XG4gIGludGVybmFsSW5wdXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gIGludGVybmFsSW5wdXRFbC5yZXF1aXJlZCA9IGZhbHNlO1xuXG4gIGRhdGVQaWNrZXJFbC5hcHBlbmRDaGlsZChjYWxlbmRhcldyYXBwZXIpO1xuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUyk7XG5cbiAgaWYgKGRlZmF1bHRWYWx1ZSkge1xuICAgIHNldENhbGVuZGFyVmFsdWUoZGF0ZVBpY2tlckVsLCBkZWZhdWx0VmFsdWUpO1xuICB9XG5cbiAgaWYgKGludGVybmFsSW5wdXRFbC5kaXNhYmxlZCkge1xuICAgIGRpc2FibGUoZGF0ZVBpY2tlckVsKTtcbiAgICBpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxuICBcbiAgaWYgKGV4dGVybmFsSW5wdXRFbC52YWx1ZSkge1xuICAgIHZhbGlkYXRlRGF0ZUlucHV0KGV4dGVybmFsSW5wdXRFbCk7XG4gIH1cbn07XG5cbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBEYXRlIFNlbGVjdGlvbiBWaWV3XG5cbi8qKlxuICogcmVuZGVyIHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlVG9EaXNwbGF5IGEgZGF0ZSB0byByZW5kZXIgb24gdGhlIGNhbGVuZGFyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxuICovXG5jb25zdCByZW5kZXJDYWxlbmRhciA9IChlbCwgX2RhdGVUb0Rpc3BsYXkpID0+IHtcbiAgY29uc3Qge1xuICAgIGRhdGVQaWNrZXJFbCxcbiAgICBjYWxlbmRhckVsLFxuICAgIHN0YXR1c0VsLFxuICAgIHNlbGVjdGVkRGF0ZSxcbiAgICBtYXhEYXRlLFxuICAgIG1pbkRhdGUsXG4gICAgcmFuZ2VEYXRlLFxuICAgIGRpYWxvZ0VsLFxuICAgIGd1aWRlRWxcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcbiAgY29uc3QgdG9kYXlzRGF0ZSA9IHRvZGF5KCk7XG4gIGxldCBkYXRlVG9EaXNwbGF5ID0gX2RhdGVUb0Rpc3BsYXkgfHwgdG9kYXlzRGF0ZTtcblxuICBjb25zdCBjYWxlbmRhcldhc0hpZGRlbiA9IGNhbGVuZGFyRWwuaGlkZGVuO1xuXG4gIGNvbnN0IGZvY3VzZWREYXRlID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAwKTtcbiAgY29uc3QgZm9jdXNlZE1vbnRoID0gZGF0ZVRvRGlzcGxheS5nZXRNb250aCgpO1xuICBjb25zdCBmb2N1c2VkWWVhciA9IGRhdGVUb0Rpc3BsYXkuZ2V0RnVsbFllYXIoKTtcblxuICBjb25zdCBwcmV2TW9udGggPSBzdWJNb250aHMoZGF0ZVRvRGlzcGxheSwgMSk7XG4gIGNvbnN0IG5leHRNb250aCA9IGFkZE1vbnRocyhkYXRlVG9EaXNwbGF5LCAxKTtcblxuICBjb25zdCBjdXJyZW50Rm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUoZGF0ZVRvRGlzcGxheSk7XG5cbiAgY29uc3QgZmlyc3RPZk1vbnRoID0gc3RhcnRPZk1vbnRoKGRhdGVUb0Rpc3BsYXkpO1xuICBjb25zdCBwcmV2QnV0dG9uc0Rpc2FibGVkID0gaXNTYW1lTW9udGgoZGF0ZVRvRGlzcGxheSwgbWluRGF0ZSk7XG4gIGNvbnN0IG5leHRCdXR0b25zRGlzYWJsZWQgPSBpc1NhbWVNb250aChkYXRlVG9EaXNwbGF5LCBtYXhEYXRlKTtcblxuICBjb25zdCByYW5nZUNvbmNsdXNpb25EYXRlID0gc2VsZWN0ZWREYXRlIHx8IGRhdGVUb0Rpc3BsYXk7XG4gIGNvbnN0IHJhbmdlU3RhcnREYXRlID0gcmFuZ2VEYXRlICYmIG1pbihyYW5nZUNvbmNsdXNpb25EYXRlLCByYW5nZURhdGUpO1xuICBjb25zdCByYW5nZUVuZERhdGUgPSByYW5nZURhdGUgJiYgbWF4KHJhbmdlQ29uY2x1c2lvbkRhdGUsIHJhbmdlRGF0ZSk7XG5cbiAgY29uc3Qgd2l0aGluUmFuZ2VTdGFydERhdGUgPSByYW5nZURhdGUgJiYgYWRkRGF5cyhyYW5nZVN0YXJ0RGF0ZSwgMSk7XG4gIGNvbnN0IHdpdGhpblJhbmdlRW5kRGF0ZSA9IHJhbmdlRGF0ZSAmJiBzdWJEYXlzKHJhbmdlRW5kRGF0ZSwgMSk7XG5cbiAgY29uc3QgbW9udGhMYWJlbCA9IE1PTlRIX0xBQkVMU1tmb2N1c2VkTW9udGhdO1xuXG4gIGNvbnN0IGdlbmVyYXRlRGF0ZUh0bWwgPSAoZGF0ZVRvUmVuZGVyKSA9PiB7XG4gICAgY29uc3QgY2xhc3NlcyA9IFtDQUxFTkRBUl9EQVRFX0NMQVNTXTtcbiAgICBjb25zdCBkYXkgPSBkYXRlVG9SZW5kZXIuZ2V0RGF0ZSgpO1xuICAgIGNvbnN0IG1vbnRoID0gZGF0ZVRvUmVuZGVyLmdldE1vbnRoKCk7XG4gICAgY29uc3QgeWVhciA9IGRhdGVUb1JlbmRlci5nZXRGdWxsWWVhcigpO1xuICAgIGxldCBkYXlPZldlZWsgPSBkYXRlVG9SZW5kZXIuZ2V0RGF5KCkgLSAxO1xuICAgIGlmIChkYXlPZldlZWsgPT09IC0xKSB7XG4gICAgICBkYXlPZldlZWsgPSA2O1xuICAgIH1cblxuICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKGRhdGVUb1JlbmRlcik7XG5cbiAgICBsZXQgdGFiaW5kZXggPSBcIi0xXCI7XG5cbiAgICBjb25zdCBpc0Rpc2FibGVkID0gIWlzRGF0ZVdpdGhpbk1pbkFuZE1heChkYXRlVG9SZW5kZXIsIG1pbkRhdGUsIG1heERhdGUpO1xuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCBzZWxlY3RlZERhdGUpO1xuXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgcHJldk1vbnRoKSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUFJFVklPVVNfTU9OVEhfQ0xBU1MpO1xuICAgIH1cblxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIGZvY3VzZWREYXRlKSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF9DTEFTUyk7XG4gICAgfVxuXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgbmV4dE1vbnRoKSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfTkVYVF9NT05USF9DTEFTUyk7XG4gICAgfVxuXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1NFTEVDVEVEX0NMQVNTKTtcbiAgICB9XG5cbiAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgdG9kYXlzRGF0ZSkpIHtcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1RPREFZX0NMQVNTKTtcbiAgICB9XG5cbiAgICBpZiAocmFuZ2VEYXRlKSB7XG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VEYXRlKSkge1xuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0NMQVNTKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHJhbmdlU3RhcnREYXRlKSkge1xuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX1NUQVJUX0NMQVNTKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHJhbmdlRW5kRGF0ZSkpIHtcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9FTkRfQ0xBU1MpO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIGlzRGF0ZVdpdGhpbk1pbkFuZE1heChcbiAgICAgICAgICBkYXRlVG9SZW5kZXIsXG4gICAgICAgICAgd2l0aGluUmFuZ2VTdGFydERhdGUsXG4gICAgICAgICAgd2l0aGluUmFuZ2VFbmREYXRlXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9XSVRISU5fUkFOR0VfQ0xBU1MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCBmb2N1c2VkRGF0ZSkpIHtcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9GT0NVU0VEX0NMQVNTKTtcbiAgICB9XG5cbiAgICBjb25zdCBtb250aFN0ciA9IE1PTlRIX0xBQkVMU1ttb250aF07XG4gICAgY29uc3QgZGF5U3RyID0gREFZX09GX1dFRUtfTEFCRUxTW2RheU9mV2Vla107XG4gICAgY29uc3QgYXJpYUxhYmVsRGF0ZSA9IHRleHQuYXJpYV9sYWJlbF9kYXRlLnJlcGxhY2UoL3tkYXlTdHJ9LywgZGF5U3RyKS5yZXBsYWNlKC97ZGF5fS8sIGRheSkucmVwbGFjZSgve21vbnRoU3RyfS8sIG1vbnRoU3RyKS5yZXBsYWNlKC97eWVhcn0vLCB5ZWFyKTtcblxuICAgIHJldHVybiBgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcbiAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxuICAgICAgZGF0YS1kYXk9XCIke2RheX1cIiBcbiAgICAgIGRhdGEtbW9udGg9XCIke21vbnRoICsgMX1cIiBcbiAgICAgIGRhdGEteWVhcj1cIiR7eWVhcn1cIiBcbiAgICAgIGRhdGEtdmFsdWU9XCIke2Zvcm1hdHRlZERhdGV9XCJcbiAgICAgIGFyaWEtbGFiZWw9XCIke2FyaWFMYWJlbERhdGV9XCJcbiAgICAgIGFyaWEtY3VycmVudD1cIiR7aXNTZWxlY3RlZCA/IFwiZGF0ZVwiIDogXCJmYWxzZVwifVwiXG4gICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XG4gICAgPiR7ZGF5fTwvYnV0dG9uPmA7XG4gIH07XG4gIC8vIHNldCBkYXRlIHRvIGZpcnN0IHJlbmRlcmVkIGRheVxuICBkYXRlVG9EaXNwbGF5ID0gc3RhcnRPZldlZWsoZmlyc3RPZk1vbnRoKTtcblxuICBjb25zdCBkYXlzID0gW107XG5cbiAgd2hpbGUgKFxuICAgIGRheXMubGVuZ3RoIDwgMjggfHxcbiAgICBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCkgPT09IGZvY3VzZWRNb250aCB8fFxuICAgIGRheXMubGVuZ3RoICUgNyAhPT0gMFxuICApIHtcbiAgICBkYXlzLnB1c2goZ2VuZXJhdGVEYXRlSHRtbChkYXRlVG9EaXNwbGF5KSk7XG4gICAgZGF0ZVRvRGlzcGxheSA9IGFkZERheXMoZGF0ZVRvRGlzcGxheSwgMSk7ICAgIFxuICB9XG4gIGNvbnN0IGRhdGVzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKGRheXMsIDcpO1xuXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gY2FsZW5kYXJFbC5jbG9uZU5vZGUoKTtcbiAgbmV3Q2FsZW5kYXIuZGF0YXNldC52YWx1ZSA9IGN1cnJlbnRGb3JtYXR0ZWREYXRlO1xuICBuZXdDYWxlbmRhci5zdHlsZS50b3AgPSBgJHtkYXRlUGlja2VyRWwub2Zmc2V0SGVpZ2h0fXB4YDtcbiAgbmV3Q2FsZW5kYXIuaGlkZGVuID0gZmFsc2U7XG4gIGxldCBjb250ZW50ID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX1JPV19DTEFTU31cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DTEFTU31cIlxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7dGV4dC5wcmV2aW91c195ZWFyfVwiXG4gICAgICAgICAgICAke3ByZXZCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfTU9OVEhfQ0xBU1N9XCJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCIke3RleHQucHJldmlvdXNfbW9udGh9XCJcbiAgICAgICAgICAgICR7cHJldkJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cbiAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX01PTlRIX0xBQkVMX0NMQVNTfVwiPlxuICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1N9XCIgYXJpYS1sYWJlbD1cIiR7bW9udGhMYWJlbH0uICR7dGV4dC5zZWxlY3RfbW9udGh9LlwiXG4gICAgICAgICAgPiR7bW9udGhMYWJlbH08L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05fQ0xBU1N9XCIgYXJpYS1sYWJlbD1cIiR7Zm9jdXNlZFllYXJ9LiAke3RleHQuc2VsZWN0X3llYXJ9LlwiXG4gICAgICAgICAgPiR7Zm9jdXNlZFllYXJ9PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxuICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTfVwiXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiJHt0ZXh0Lm5leHRfbW9udGh9XCJcbiAgICAgICAgICAgICR7bmV4dEJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cbiAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxuICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1N9XCJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCIke3RleHQubmV4dF95ZWFyfVwiXG4gICAgICAgICAgICAke25leHRCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICA8dHI+YDtcbiAgZm9yKGxldCBkIGluIERBWV9PRl9XRUVLX0xBQkVMUyl7XG4gICAgY29udGVudCArPSBgPHRoIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTU31cIiBzY29wZT1cImNvbFwiIGFyaWEtbGFiZWw9XCIke0RBWV9PRl9XRUVLX0xBQkVMU1tkXX1cIj4ke0RBWV9PRl9XRUVLX0xBQkVMU1tkXS5jaGFyQXQoMCl9PC90aD5gO1xuICB9XG4gIGNvbnRlbnQgKz0gYDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAke2RhdGVzSHRtbH1cbiAgICAgICAgPC90Ym9keT5cbiAgICAgIDwvdGFibGU+XG4gICAgPC9kaXY+YDtcbiAgbmV3Q2FsZW5kYXIuaW5uZXJIVE1MID0gY29udGVudDtcbiAgY2FsZW5kYXJFbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdDYWxlbmRhciwgY2FsZW5kYXJFbCk7XG5cbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTKTtcbiAgaWYgKGRpYWxvZ0VsLmhpZGRlbiA9PT0gdHJ1ZSkge1xuICAgIGRpYWxvZ0VsLmhpZGRlbiA9IGZhbHNlO1xuICAgIGlmIChndWlkZUVsLmhpZGRlbikge1xuICAgICAgZ3VpZGVFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgXG4gIGNvbnN0IHN0YXR1c2VzID0gW107XG5cbiAgaWYgKGNhbGVuZGFyV2FzSGlkZGVuKSB7XG4gICAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlwiO1xuICB9IFxuICBlbHNlIGlmIChfZGF0ZVRvRGlzcGxheS5nZXRUaW1lKCkgPT09IG1pbkRhdGUuZ2V0VGltZSgpKSB7XG4gICAgc3RhdHVzZXMucHVzaCh0ZXh0LmZpcnN0X3Bvc3NpYmxlX2RhdGUpO1xuICB9XG4gIGVsc2UgaWYgKG1heERhdGUgIT09IHVuZGVmaW5lZCAmJiBtYXhEYXRlICE9PSBcIlwiICYmIF9kYXRlVG9EaXNwbGF5LmdldFRpbWUoKSA9PT0gbWF4RGF0ZS5nZXRUaW1lKCkpIHtcbiAgICBzdGF0dXNlcy5wdXNoKHRleHQubGFzdF9wb3NzaWJsZV9kYXRlKTtcbiAgfVxuICBlbHNlIHtcbiAgICBzdGF0dXNlcy5wdXNoKHRleHQuY3VycmVudF9tb250aF9kaXNwbGF5ZWQucmVwbGFjZSgve21vbnRoTGFiZWx9LywgbW9udGhMYWJlbCkucmVwbGFjZSgve2ZvY3VzZWRZZWFyfS8sIGZvY3VzZWRZZWFyKSk7XG4gIH1cblxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IHN0YXR1c2VzLmpvaW4oXCIuIFwiKTtcblxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XG59O1xuXG4vKipcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IGRpc3BsYXlQcmV2aW91c1llYXIgPSAoX2J1dHRvbkVsKSA9PiB7XG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxuICAgIF9idXR0b25FbFxuICApO1xuICBsZXQgZGF0ZSA9IHN1YlllYXJzKGNhbGVuZGFyRGF0ZSwgMSk7XG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XG5cbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9QUkVWSU9VU19ZRUFSKTtcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcbiAgfVxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xufTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgZGlzcGxheVByZXZpb3VzTW9udGggPSAoX2J1dHRvbkVsKSA9PiB7XG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxuICAgIF9idXR0b25FbFxuICApO1xuICBsZXQgZGF0ZSA9IHN1Yk1vbnRocyhjYWxlbmRhckRhdGUsIDEpO1xuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xuXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEgpO1xuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xuICB9XG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XG59O1xuXG4vKipcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCBkaXNwbGF5TmV4dE1vbnRoID0gKF9idXR0b25FbCkgPT4ge1xuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcbiAgICBfYnV0dG9uRWxcbiAgKTtcbiAgbGV0IGRhdGUgPSBhZGRNb250aHMoY2FsZW5kYXJEYXRlLCAxKTtcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcblxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfTU9OVEgpO1xuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xuICB9XG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XG59O1xuXG4vKipcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IGRpc3BsYXlOZXh0WWVhciA9IChfYnV0dG9uRWwpID0+IHtcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXG4gICAgX2J1dHRvbkVsXG4gICk7XG4gIGxldCBkYXRlID0gYWRkWWVhcnMoY2FsZW5kYXJEYXRlLCAxKTtcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcblxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfWUVBUik7XG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XG4gIH1cbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcbn07XG5cbi8qKlxuICogSGlkZSB0aGUgY2FsZW5kYXIgb2YgYSBkYXRlIHBpY2tlciBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCBoaWRlQ2FsZW5kYXIgPSAoZWwpID0+IHtcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGNhbGVuZGFyRWwsIHN0YXR1c0VsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XG5cbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5yZW1vdmUoREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTKTtcbiAgY2FsZW5kYXJFbC5oaWRkZW4gPSB0cnVlO1xuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IFwiXCI7XG59O1xuXG4vKipcbiAqIFNlbGVjdCBhIGRhdGUgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gY2FsZW5kYXJEYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3Qgc2VsZWN0RGF0ZSA9IChjYWxlbmRhckRhdGVFbCkgPT4ge1xuICBpZiAoY2FsZW5kYXJEYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcblxuICBjb25zdCB7IGRhdGVQaWNrZXJFbCwgZXh0ZXJuYWxJbnB1dEVsLCBkaWFsb2dFbCwgZ3VpZGVFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXG4gICAgY2FsZW5kYXJEYXRlRWxcbiAgKTtcbiAgc2V0Q2FsZW5kYXJWYWx1ZShjYWxlbmRhckRhdGVFbCwgY2FsZW5kYXJEYXRlRWwuZGF0YXNldC52YWx1ZSk7XG4gIGhpZGVDYWxlbmRhcihkYXRlUGlja2VyRWwpO1xuICBkaWFsb2dFbC5oaWRkZW4gPSB0cnVlO1xuICBndWlkZUVsLmhpZGRlbiA9IHRydWU7XG5cbiAgZXh0ZXJuYWxJbnB1dEVsLmZvY3VzKCk7XG59O1xuXG4vKipcbiAqIFRvZ2dsZSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCB0b2dnbGVDYWxlbmRhciA9IChlbCkgPT4ge1xuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcbiAgY29uc3Qge1xuICAgIGRpYWxvZ0VsLFxuICAgIGNhbGVuZGFyRWwsXG4gICAgaW5wdXREYXRlLFxuICAgIG1pbkRhdGUsXG4gICAgbWF4RGF0ZSxcbiAgICBkZWZhdWx0RGF0ZSxcbiAgICBndWlkZUVsXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XG5cbiAgaWYgKGNhbGVuZGFyRWwuaGlkZGVuKSB7XG4gICAgY29uc3QgZGF0ZVRvRGlzcGxheSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChcbiAgICAgIGlucHV0RGF0ZSB8fCBkZWZhdWx0RGF0ZSB8fCB0b2RheSgpLFxuICAgICAgbWluRGF0ZSxcbiAgICAgIG1heERhdGVcbiAgICApO1xuICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XG4gICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XG4gIH0gZWxzZSB7XG4gICAgaGlkZUNhbGVuZGFyKGVsKTtcbiAgICBkaWFsb2dFbC5oaWRkZW4gPSB0cnVlO1xuICAgIGd1aWRlRWwuaGlkZGVuID0gdHJ1ZTtcbiAgfVxufTtcblxuLyoqXG4gKiBVcGRhdGUgdGhlIGNhbGVuZGFyIHdoZW4gdmlzaWJsZS5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBhbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXJcbiAqL1xuY29uc3QgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUgPSAoZWwpID0+IHtcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBpbnB1dERhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcbiAgY29uc3QgY2FsZW5kYXJTaG93biA9ICFjYWxlbmRhckVsLmhpZGRlbjtcblxuICBpZiAoY2FsZW5kYXJTaG93biAmJiBpbnB1dERhdGUpIHtcbiAgICBjb25zdCBkYXRlVG9EaXNwbGF5ID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGlucHV0RGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XG4gICAgcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XG4gIH1cbn07XG5cbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBEYXRlIFNlbGVjdGlvbiBWaWV3XG5cbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBNb250aCBTZWxlY3Rpb24gVmlld1xuLyoqXG4gKiBEaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuIGluIHRoZSBkYXRlIHBpY2tlci5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxuICovXG5jb25zdCBkaXNwbGF5TW9udGhTZWxlY3Rpb24gPSAoZWwsIG1vbnRoVG9EaXNwbGF5KSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjYWxlbmRhckVsLFxuICAgIHN0YXR1c0VsLFxuICAgIGNhbGVuZGFyRGF0ZSxcbiAgICBtaW5EYXRlLFxuICAgIG1heERhdGUsXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XG5cbiAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IGNhbGVuZGFyRGF0ZS5nZXRNb250aCgpO1xuICBjb25zdCBmb2N1c2VkTW9udGggPSBtb250aFRvRGlzcGxheSA9PSBudWxsID8gc2VsZWN0ZWRNb250aCA6IG1vbnRoVG9EaXNwbGF5O1xuXG4gIGNvbnN0IG1vbnRocyA9IE1PTlRIX0xBQkVMUy5tYXAoKG1vbnRoLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IG1vbnRoVG9DaGVjayA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgaW5kZXgpO1xuXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGlzRGF0ZXNNb250aE91dHNpZGVNaW5Pck1heChcbiAgICAgIG1vbnRoVG9DaGVjayxcbiAgICAgIG1pbkRhdGUsXG4gICAgICBtYXhEYXRlXG4gICAgKTtcblxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcblxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfTU9OVEhfQ0xBU1NdO1xuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBpbmRleCA9PT0gc2VsZWN0ZWRNb250aDtcblxuICAgIGlmIChpbmRleCA9PT0gZm9jdXNlZE1vbnRoKSB7XG4gICAgICB0YWJpbmRleCA9IFwiMFwiO1xuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MpO1xuICAgIH1cblxuICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfTU9OVEhfU0VMRUNURURfQ0xBU1MpO1xuICAgIH1cblxuICAgIHJldHVybiBgPGJ1dHRvbiBcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxuICAgICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcbiAgICAgICAgZGF0YS12YWx1ZT1cIiR7aW5kZXh9XCJcbiAgICAgICAgZGF0YS1sYWJlbD1cIiR7bW9udGh9XCJcbiAgICAgICAgYXJpYS1jdXJyZW50PVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcbiAgICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxuICAgICAgPiR7bW9udGh9PC9idXR0b24+YDtcbiAgfSk7XG5cbiAgY29uc3QgbW9udGhzSHRtbCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTfVwiPlxuICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxuICAgICAgPHRib2R5PlxuICAgICAgICAke2xpc3RUb0dyaWRIdG1sKG1vbnRocywgMyl9XG4gICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG4gIDwvZGl2PmA7XG5cbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBtb250aHNIdG1sO1xuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcblxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IHRleHQubW9udGhzX2Rpc3BsYXllZDtcblxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XG59O1xuXG4vKipcbiAqIFNlbGVjdCBhIG1vbnRoIGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gbW9udGhFbCBBbiBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IHNlbGVjdE1vbnRoID0gKG1vbnRoRWwpID0+IHtcbiAgaWYgKG1vbnRoRWwuZGlzYWJsZWQpIHJldHVybjtcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxuICAgIG1vbnRoRWxcbiAgKTtcbiAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xuICBsZXQgZGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgc2VsZWN0ZWRNb250aCk7XG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xufTtcblxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIE1vbnRoIFNlbGVjdGlvbiBWaWV3XG5cbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XG5cbi8qKlxuICogRGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGluIHRoZSBkYXRlIHBpY2tlci5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKiBAcGFyYW0ge251bWJlcn0geWVhclRvRGlzcGxheSB5ZWFyIHRvIGRpc3BsYXkgaW4geWVhciBzZWxlY3Rpb25cbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBjYWxlbmRhciBlbGVtZW50XG4gKi9cbmNvbnN0IGRpc3BsYXlZZWFyU2VsZWN0aW9uID0gKGVsLCB5ZWFyVG9EaXNwbGF5KSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjYWxlbmRhckVsLFxuICAgIHN0YXR1c0VsLFxuICAgIGNhbGVuZGFyRGF0ZSxcbiAgICBtaW5EYXRlLFxuICAgIG1heERhdGUsXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XG5cbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gY2FsZW5kYXJEYXRlLmdldEZ1bGxZZWFyKCk7XG4gIGNvbnN0IGZvY3VzZWRZZWFyID0geWVhclRvRGlzcGxheSA9PSBudWxsID8gc2VsZWN0ZWRZZWFyIDogeWVhclRvRGlzcGxheTtcblxuICBsZXQgeWVhclRvQ2h1bmsgPSBmb2N1c2VkWWVhcjtcbiAgeWVhclRvQ2h1bmsgLT0geWVhclRvQ2h1bmsgJSBZRUFSX0NIVU5LO1xuICB5ZWFyVG9DaHVuayA9IE1hdGgubWF4KDAsIHllYXJUb0NodW5rKTtcblxuICBjb25zdCBwcmV2WWVhckNodW5rRGlzYWJsZWQgPSBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heChcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgLSAxKSxcbiAgICBtaW5EYXRlLFxuICAgIG1heERhdGVcbiAgKTtcblxuICBjb25zdCBuZXh0WWVhckNodW5rRGlzYWJsZWQgPSBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heChcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgKyBZRUFSX0NIVU5LKSxcbiAgICBtaW5EYXRlLFxuICAgIG1heERhdGVcbiAgKTtcblxuICBjb25zdCB5ZWFycyA9IFtdO1xuICBsZXQgeWVhckluZGV4ID0geWVhclRvQ2h1bms7XG4gIHdoaWxlICh5ZWFycy5sZW5ndGggPCBZRUFSX0NIVU5LKSB7XG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxuICAgICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJJbmRleCksXG4gICAgICBtaW5EYXRlLFxuICAgICAgbWF4RGF0ZVxuICAgICk7XG5cbiAgICBsZXQgdGFiaW5kZXggPSBcIi0xXCI7XG5cbiAgICBjb25zdCBjbGFzc2VzID0gW0NBTEVOREFSX1lFQVJfQ0xBU1NdO1xuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSB5ZWFySW5kZXggPT09IHNlbGVjdGVkWWVhcjtcblxuICAgIGlmICh5ZWFySW5kZXggPT09IGZvY3VzZWRZZWFyKSB7XG4gICAgICB0YWJpbmRleCA9IFwiMFwiO1xuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUyk7XG4gICAgfVxuXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTKTtcbiAgICB9XG5cbiAgICB5ZWFycy5wdXNoKFxuICAgICAgYDxidXR0b24gXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcbiAgICAgICAgY2xhc3M9XCIke2NsYXNzZXMuam9pbihcIiBcIil9XCIgXG4gICAgICAgIGRhdGEtdmFsdWU9XCIke3llYXJJbmRleH1cIlxuICAgICAgICBhcmlhLWN1cnJlbnQ9XCIke2lzU2VsZWN0ZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIn1cIlxuICAgICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XG4gICAgICA+JHt5ZWFySW5kZXh9PC9idXR0b24+YFxuICAgICk7XG4gICAgeWVhckluZGV4ICs9IDE7XG4gIH1cblxuICBjb25zdCB5ZWFyc0h0bWwgPSBsaXN0VG9HcmlkSHRtbCh5ZWFycywgMyk7XG4gIGNvbnN0IGFyaWFMYWJlbFByZXZpb3VzWWVhcnMgPSB0ZXh0LnByZXZpb3VzX3llYXJzLnJlcGxhY2UoL3t5ZWFyc30vLCBZRUFSX0NIVU5LKTtcbiAgY29uc3QgYXJpYUxhYmVsTmV4dFllYXJzID0gdGV4dC5uZXh0X3llYXJzLnJlcGxhY2UoL3t5ZWFyc30vLCBZRUFSX0NIVU5LKTtcbiAgY29uc3QgYW5ub3VuY2VZZWFycyA9IHRleHQueWVhcnNfZGlzcGxheWVkLnJlcGxhY2UoL3tzdGFydH0vLCB5ZWFyVG9DaHVuaykucmVwbGFjZSgve2VuZH0vLCB5ZWFyVG9DaHVuayArIFlFQVJfQ0hVTksgLSAxKTtcblxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9XCI+XG4gICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31cIiBcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiJHthcmlhTGFiZWxQcmV2aW91c1llYXJzfVwiXG4gICAgICAgICAgICAgICAgJHtwcmV2WWVhckNodW5rRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XG4gICAgICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj5cbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XG4gICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgJHt5ZWFyc0h0bWx9XG4gICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfVwiIFxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCIke2FyaWFMYWJlbE5leHRZZWFyc31cIlxuICAgICAgICAgICAgICAgICR7bmV4dFllYXJDaHVua0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxuICAgICAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XG4gICAgICAgICAgICA8L3RkPlxuICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PmA7XG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xuXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gYW5ub3VuY2VZZWFycztcblxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XG59O1xuXG4vKipcbiAqIE5hdmlnYXRlIGJhY2sgYnkgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IGRpc3BsYXlQcmV2aW91c1llYXJDaHVuayA9IChlbCkgPT4ge1xuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcblxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXG4gICAgZWxcbiAgKTtcbiAgY29uc3QgeWVhckVsID0gY2FsZW5kYXJFbC5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCk7XG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC50ZXh0Q29udGVudCwgMTApO1xuXG4gIGxldCBhZGp1c3RlZFllYXIgPSBzZWxlY3RlZFllYXIgLSBZRUFSX0NIVU5LO1xuICBhZGp1c3RlZFllYXIgPSBNYXRoLm1heCgwLCBhZGp1c3RlZFllYXIpO1xuXG4gIGNvbnN0IGRhdGUgPSBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRZZWFyKTtcbiAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcbiAgICBjYWxlbmRhckVsLFxuICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxuICApO1xuXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyk7XG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX1BJQ0tFUik7XG4gIH1cbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcbn07XG5cbi8qKlxuICogTmF2aWdhdGUgZm9yd2FyZCBieSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgZGlzcGxheU5leHRZZWFyQ2h1bmsgPSAoZWwpID0+IHtcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XG5cbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxuICAgIGVsXG4gICk7XG4gIGNvbnN0IHllYXJFbCA9IGNhbGVuZGFyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpO1xuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwudGV4dENvbnRlbnQsIDEwKTtcblxuICBsZXQgYWRqdXN0ZWRZZWFyID0gc2VsZWN0ZWRZZWFyICsgWUVBUl9DSFVOSztcbiAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcblxuICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XG4gIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheVllYXJTZWxlY3Rpb24oXG4gICAgY2FsZW5kYXJFbCxcbiAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcbiAgKTtcblxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyk7XG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX1BJQ0tFUik7XG4gIH1cbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcbn07XG5cbi8qKlxuICogU2VsZWN0IGEgeWVhciBpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHllYXJFbCBBIHllYXIgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCBzZWxlY3RZZWFyID0gKHllYXJFbCkgPT4ge1xuICBpZiAoeWVhckVsLmRpc2FibGVkKSByZXR1cm47XG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcbiAgICB5ZWFyRWxcbiAgKTtcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLmlubmVySFRNTCwgMTApO1xuICBsZXQgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcbn07XG5cbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XG5cbi8vICNyZWdpb24gQ2FsZW5kYXIgRXZlbnQgSGFuZGxpbmdcblxuLyoqXG4gKiBIaWRlIHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhciA9IChldmVudCkgPT4ge1xuICBjb25zdCB7IGRhdGVQaWNrZXJFbCwgZXh0ZXJuYWxJbnB1dEVsLCBkaWFsb2dFbCwgZ3VpZGVFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZXZlbnQudGFyZ2V0KTtcblxuICBoaWRlQ2FsZW5kYXIoZGF0ZVBpY2tlckVsKTtcbiAgZGlhbG9nRWwuaGlkZGVuID0gdHJ1ZTtcbiAgZ3VpZGVFbC5oaWRkZW4gPSB0cnVlO1xuICBleHRlcm5hbElucHV0RWwuZm9jdXMoKTtcblxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufTtcblxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBFdmVudCBIYW5kbGluZ1xuXG4vLyAjcmVnaW9uIENhbGVuZGFyIERhdGUgRXZlbnQgSGFuZGxpbmdcblxuLyoqXG4gKiBBZGp1c3QgdGhlIGRhdGUgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGlmIG5lZWRlZC5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3REYXRlRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IGFkanVzdENhbGVuZGFyID0gKGFkanVzdERhdGVGbikgPT4ge1xuICByZXR1cm4gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxuICAgICAgZXZlbnQudGFyZ2V0XG4gICAgKTtcblxuICAgIGNvbnN0IGRhdGUgPSBhZGp1c3REYXRlRm4oY2FsZW5kYXJEYXRlKTtcblxuICAgIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XG4gICAgaWYgKCFpc1NhbWVEYXkoY2FsZW5kYXJEYXRlLCBjYXBwZWREYXRlKSkge1xuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBjYXBwZWREYXRlKTtcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xuICAgIH1cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xufTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViV2Vla3MoZGF0ZSwgMSkpO1xuXG4vKipcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFdlZWtzKGRhdGUsIDEpKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBkYXkgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlTGVmdEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YkRheXMoZGF0ZSwgMSkpO1xuXG4vKipcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIGRheSBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVSaWdodEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZERheXMoZGF0ZSwgMSkpO1xuXG4vKipcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgd2VlayBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVIb21lRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3RhcnRPZldlZWsoZGF0ZSkpO1xuXG4vKipcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlRW5kRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gZW5kT2ZXZWVrKGRhdGUpKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZE1vbnRocyhkYXRlLCAxKSk7XG5cbi8qKlxuICogTmF2aWdhdGUgYmFjayBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlUGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViTW9udGhzKGRhdGUsIDEpKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRZZWFycyhkYXRlLCAxKSk7XG5cbi8qKlxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVTaGlmdFBhZ2VVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YlllYXJzKGRhdGUsIDEpKTtcblxuLyoqXG4gKiBkaXNwbGF5IHRoZSBjYWxlbmRhciBmb3IgdGhlIG1vdXNlbW92ZSBkYXRlLlxuICpcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZGF0ZUVsIEEgZGF0ZSBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IGhhbmRsZU1vdXNlbW92ZUZyb21EYXRlID0gKGRhdGVFbCkgPT4ge1xuICBpZiAoZGF0ZUVsLmRpc2FibGVkKSByZXR1cm47XG5cbiAgY29uc3QgY2FsZW5kYXJFbCA9IGRhdGVFbC5jbG9zZXN0KERBVEVfUElDS0VSX0NBTEVOREFSKTtcblxuICBjb25zdCBjdXJyZW50Q2FsZW5kYXJEYXRlID0gY2FsZW5kYXJFbC5kYXRhc2V0LnZhbHVlO1xuICBjb25zdCBob3ZlckRhdGUgPSBkYXRlRWwuZGF0YXNldC52YWx1ZTtcblxuICBpZiAoaG92ZXJEYXRlID09PSBjdXJyZW50Q2FsZW5kYXJEYXRlKSByZXR1cm47XG5cbiAgY29uc3QgZGF0ZVRvRGlzcGxheSA9IHBhcnNlRGF0ZVN0cmluZyhob3ZlckRhdGUpO1xuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGVUb0Rpc3BsYXkpO1xuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcbn07XG5cbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgRGF0ZSBFdmVudCBIYW5kbGluZ1xuXG4vLyAjcmVnaW9uIENhbGVuZGFyIE1vbnRoIEV2ZW50IEhhbmRsaW5nXG5cbi8qKlxuICogQWRqdXN0IHRoZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbiBpZiBuZWVkZWQuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0TW9udGhGbiBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGFkanVzdGVkIG1vbnRoXG4gKi9cbmNvbnN0IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdE1vbnRoRm4pID0+IHtcbiAgcmV0dXJuIChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1vbnRoRWwgPSBldmVudC50YXJnZXQ7XG4gICAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xuICAgIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcbiAgICAgIG1vbnRoRWxcbiAgICApO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZE1vbnRoKTtcblxuICAgIGxldCBhZGp1c3RlZE1vbnRoID0gYWRqdXN0TW9udGhGbihzZWxlY3RlZE1vbnRoKTtcbiAgICBhZGp1c3RlZE1vbnRoID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTEsIGFkanVzdGVkTW9udGgpKTtcblxuICAgIGNvbnN0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIGFkanVzdGVkTW9udGgpO1xuICAgIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XG4gICAgaWYgKCFpc1NhbWVNb250aChjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKFxuICAgICAgICBjYWxlbmRhckVsLFxuICAgICAgICBjYXBwZWREYXRlLmdldE1vbnRoKClcbiAgICAgICk7XG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX01PTlRIX0ZPQ1VTRUQpLmZvY3VzKCk7XG4gICAgfVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH07XG59O1xuXG4vKipcbiAqIE5hdmlnYXRlIGJhY2sgdGhyZWUgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlVXBGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoIC0gMyk7XG5cbi8qKlxuICogTmF2aWdhdGUgZm9yd2FyZCB0aHJlZSBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVEb3duRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKG1vbnRoKSA9PiBtb250aCArIDMpO1xuXG4vKipcbiAqIE5hdmlnYXRlIGJhY2sgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlTGVmdEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAxKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKG1vbnRoKSA9PiBtb250aCArIDEpO1xuXG4vKipcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZUhvbWVGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbihcbiAgKG1vbnRoKSA9PiBtb250aCAtIChtb250aCAlIDMpXG4pO1xuXG4vKipcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHJvdyBvZiBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVFbmRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbihcbiAgKG1vbnRoKSA9PiBtb250aCArIDIgLSAobW9udGggJSAzKVxuKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSB0byB0aGUgbGFzdCBtb250aCAoRGVjZW1iZXIpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlUGFnZURvd25Gcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigoKSA9PiAxMSk7XG5cbi8qKlxuICogTmF2aWdhdGUgdG8gdGhlIGZpcnN0IG1vbnRoIChKYW51YXJ5KSBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDApO1xuXG4vKipcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSBtb250aCB3aGVuIHRoZSBtb3VzZSBtb3Zlcy5cbiAqXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IFRoZSBtb3VzZW1vdmUgZXZlbnRcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQSBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IGhhbmRsZU1vdXNlbW92ZUZyb21Nb250aCA9IChtb250aEVsKSA9PiB7XG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XG4gIGlmIChtb250aEVsLmNsYXNzTGlzdC5jb250YWlucyhDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xuXG4gIGNvbnN0IGZvY3VzTW9udGggPSBwYXJzZUludChtb250aEVsLmRhdGFzZXQudmFsdWUsIDEwKTtcblxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlNb250aFNlbGVjdGlvbihtb250aEVsLCBmb2N1c01vbnRoKTtcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xufTtcblxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBNb250aCBFdmVudCBIYW5kbGluZ1xuXG4vLyAjcmVnaW9uIENhbGVuZGFyIFllYXIgRXZlbnQgSGFuZGxpbmdcblxuLyoqXG4gKiBBZGp1c3QgdGhlIHllYXIgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbiBpZiBuZWVkZWQuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0WWVhckZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgeWVhclxuICovXG5jb25zdCBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdFllYXJGbikgPT4ge1xuICByZXR1cm4gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgeWVhckVsID0gZXZlbnQudGFyZ2V0O1xuICAgIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxuICAgICAgeWVhckVsXG4gICAgKTtcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xuXG4gICAgbGV0IGFkanVzdGVkWWVhciA9IGFkanVzdFllYXJGbihzZWxlY3RlZFllYXIpO1xuICAgIGFkanVzdGVkWWVhciA9IE1hdGgubWF4KDAsIGFkanVzdGVkWWVhcik7XG5cbiAgICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcbiAgICBpZiAoIWlzU2FtZVllYXIoY3VycmVudERhdGUsIGNhcHBlZERhdGUpKSB7XG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxuICAgICAgICBjYWxlbmRhckVsLFxuICAgICAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcbiAgICAgICk7XG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcbiAgICB9XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfTtcbn07XG5cbi8qKlxuICogTmF2aWdhdGUgYmFjayB0aHJlZSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgLSAzKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMyk7XG5cbi8qKlxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlTGVmdEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbigoeWVhcikgPT4geWVhciAtIDEpO1xuXG4vKipcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMSk7XG5cbi8qKlxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZUhvbWVGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXG4gICh5ZWFyKSA9PiB5ZWFyIC0gKHllYXIgJSAzKVxuKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZUVuZEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcbiAgKHllYXIpID0+IHllYXIgKyAyIC0gKHllYXIgJSAzKVxuKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSB0byBiYWNrIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXG4gICh5ZWFyKSA9PiB5ZWFyIC0gWUVBUl9DSFVOS1xuKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcbiAgKHllYXIpID0+IHllYXIgKyBZRUFSX0NIVU5LXG4pO1xuXG4vKipcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSB5ZWFyIHdoZW4gdGhlIG1vdXNlIG1vdmVzLlxuICpcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZGF0ZUVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IGhhbmRsZU1vdXNlbW92ZUZyb21ZZWFyID0gKHllYXJFbCkgPT4ge1xuICBpZiAoeWVhckVsLmRpc2FibGVkKSByZXR1cm47XG4gIGlmICh5ZWFyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUykpIHJldHVybjtcblxuICBjb25zdCBmb2N1c1llYXIgPSBwYXJzZUludCh5ZWFyRWwuZGF0YXNldC52YWx1ZSwgMTApO1xuXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheVllYXJTZWxlY3Rpb24oeWVhckVsLCBmb2N1c1llYXIpO1xuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcbn07XG5cbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xuXG4vLyAjcmVnaW9uIEZvY3VzIEhhbmRsaW5nIEV2ZW50IEhhbmRsaW5nXG5cbmNvbnN0IHRhYkhhbmRsZXIgPSAoZm9jdXNhYmxlKSA9PiB7XG4gIGNvbnN0IGdldEZvY3VzYWJsZUNvbnRleHQgPSAoZWwpID0+IHtcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IHNlbGVjdChmb2N1c2FibGUsIGNhbGVuZGFyRWwpO1xuXG4gICAgY29uc3QgZmlyc3RUYWJJbmRleCA9IDA7XG4gICAgY29uc3QgbGFzdFRhYkluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICBjb25zdCBmaXJzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1tmaXJzdFRhYkluZGV4XTtcbiAgICBjb25zdCBsYXN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2xhc3RUYWJJbmRleF07XG4gICAgY29uc3QgZm9jdXNJbmRleCA9IGZvY3VzYWJsZUVsZW1lbnRzLmluZGV4T2YoYWN0aXZlRWxlbWVudCgpKTtcblxuICAgIGNvbnN0IGlzTGFzdFRhYiA9IGZvY3VzSW5kZXggPT09IGxhc3RUYWJJbmRleDtcbiAgICBjb25zdCBpc0ZpcnN0VGFiID0gZm9jdXNJbmRleCA9PT0gZmlyc3RUYWJJbmRleDtcbiAgICBjb25zdCBpc05vdEZvdW5kID0gZm9jdXNJbmRleCA9PT0gLTE7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZm9jdXNhYmxlRWxlbWVudHMsXG4gICAgICBpc05vdEZvdW5kLFxuICAgICAgZmlyc3RUYWJTdG9wLFxuICAgICAgaXNGaXJzdFRhYixcbiAgICAgIGxhc3RUYWJTdG9wLFxuICAgICAgaXNMYXN0VGFiLFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB0YWJBaGVhZChldmVudCkge1xuICAgICAgY29uc3QgeyBmaXJzdFRhYlN0b3AsIGlzTGFzdFRhYiwgaXNOb3RGb3VuZCB9ID0gZ2V0Rm9jdXNhYmxlQ29udGV4dChcbiAgICAgICAgZXZlbnQudGFyZ2V0XG4gICAgICApO1xuXG4gICAgICBpZiAoaXNMYXN0VGFiIHx8IGlzTm90Rm91bmQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB0YWJCYWNrKGV2ZW50KSB7XG4gICAgICBjb25zdCB7IGxhc3RUYWJTdG9wLCBpc0ZpcnN0VGFiLCBpc05vdEZvdW5kIH0gPSBnZXRGb2N1c2FibGVDb250ZXh0KFxuICAgICAgICBldmVudC50YXJnZXRcbiAgICAgICk7XG5cbiAgICAgIGlmIChpc0ZpcnN0VGFiIHx8IGlzTm90Rm91bmQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGFzdFRhYlN0b3AuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufTtcblxuY29uc3QgZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoREFURV9QSUNLRVJfRk9DVVNBQkxFKTtcbmNvbnN0IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihNT05USF9QSUNLRVJfRk9DVVNBQkxFKTtcbmNvbnN0IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKFlFQVJfUElDS0VSX0ZPQ1VTQUJMRSk7XG5cbi8vICNlbmRyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcblxuLy8gI3JlZ2lvbiBEYXRlIFBpY2tlciBFdmVudCBEZWxlZ2F0aW9uIFJlZ2lzdHJhdGlvbiAvIENvbXBvbmVudFxuXG5jb25zdCBkYXRlUGlja2VyRXZlbnRzID0ge1xuICBbQ0xJQ0tdOiB7XG4gICAgW0RBVEVfUElDS0VSX0JVVFRPTl0oKSB7XG4gICAgICB0b2dnbGVDYWxlbmRhcih0aGlzKTtcbiAgICB9LFxuICAgIFtDQUxFTkRBUl9EQVRFXSgpIHtcbiAgICAgIHNlbGVjdERhdGUodGhpcyk7XG4gICAgfSxcbiAgICBbQ0FMRU5EQVJfTU9OVEhdKCkge1xuICAgICAgc2VsZWN0TW9udGgodGhpcyk7XG4gICAgfSxcbiAgICBbQ0FMRU5EQVJfWUVBUl0oKSB7XG4gICAgICBzZWxlY3RZZWFyKHRoaXMpO1xuICAgIH0sXG4gICAgW0NBTEVOREFSX1BSRVZJT1VTX01PTlRIXSgpIHtcbiAgICAgIGRpc3BsYXlQcmV2aW91c01vbnRoKHRoaXMpO1xuICAgIH0sXG4gICAgW0NBTEVOREFSX05FWFRfTU9OVEhdKCkge1xuICAgICAgZGlzcGxheU5leHRNb250aCh0aGlzKTtcbiAgICB9LFxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSXSgpIHtcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXIodGhpcyk7XG4gICAgfSxcbiAgICBbQ0FMRU5EQVJfTkVYVF9ZRUFSXSgpIHtcbiAgICAgIGRpc3BsYXlOZXh0WWVhcih0aGlzKTtcbiAgICB9LFxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LXSgpIHtcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXJDaHVuayh0aGlzKTtcbiAgICB9LFxuICAgIFtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktdKCkge1xuICAgICAgZGlzcGxheU5leHRZZWFyQ2h1bmsodGhpcyk7XG4gICAgfSxcbiAgICBbQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OXSgpIHtcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKHRoaXMpO1xuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xuICAgIH0sXG4gICAgW0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OXSgpIHtcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheVllYXJTZWxlY3Rpb24odGhpcyk7XG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcbiAgICB9LFxuICB9LFxuICBrZXl1cDoge1xuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcbiAgICAgIGNvbnN0IGtleWRvd24gPSB0aGlzLmRhdGFzZXQua2V5ZG93bktleUNvZGU7XG4gICAgICBpZiAoYCR7ZXZlbnQua2V5Q29kZX1gICE9PSBrZXlkb3duKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSxcbiAgfSxcbiAga2V5ZG93bjoge1xuICAgIFtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF0oZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBFTlRFUl9LRVlDT0RFKSB7XG4gICAgICAgIHZhbGlkYXRlRGF0ZUlucHV0KHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW0NBTEVOREFSX0RBVEVdOiBrZXltYXAoe1xuICAgICAgVXA6IGhhbmRsZVVwRnJvbURhdGUsXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21EYXRlLFxuICAgICAgRG93bjogaGFuZGxlRG93bkZyb21EYXRlLFxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbURhdGUsXG4gICAgICBBcnJvd0xlZnQ6IGhhbmRsZUxlZnRGcm9tRGF0ZSxcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tRGF0ZSxcbiAgICAgIEhvbWU6IGhhbmRsZUhvbWVGcm9tRGF0ZSxcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbURhdGUsXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tRGF0ZSxcbiAgICAgIFBhZ2VVcDogaGFuZGxlUGFnZVVwRnJvbURhdGUsXG4gICAgICBcIlNoaWZ0K1BhZ2VEb3duXCI6IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSxcbiAgICAgIFwiU2hpZnQrUGFnZVVwXCI6IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUsXG4gICAgfSksXG4gICAgW0NBTEVOREFSX0RBVEVfUElDS0VSXToga2V5bWFwKHtcbiAgICAgIFRhYjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJBaGVhZCxcbiAgICAgIFwiU2hpZnQrVGFiXCI6IGRhdGVQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQmFjayxcbiAgICB9KSxcbiAgICBbQ0FMRU5EQVJfTU9OVEhdOiBrZXltYXAoe1xuICAgICAgVXA6IGhhbmRsZVVwRnJvbU1vbnRoLFxuICAgICAgQXJyb3dVcDogaGFuZGxlVXBGcm9tTW9udGgsXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbU1vbnRoLFxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbU1vbnRoLFxuICAgICAgTGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21Nb250aCxcbiAgICAgIEFycm93UmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21Nb250aCxcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbU1vbnRoLFxuICAgICAgUGFnZURvd246IGhhbmRsZVBhZ2VEb3duRnJvbU1vbnRoLFxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tTW9udGgsXG4gICAgfSksXG4gICAgW0NBTEVOREFSX01PTlRIX1BJQ0tFUl06IGtleW1hcCh7XG4gICAgICBUYWI6IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxuICAgICAgXCJTaGlmdCtUYWJcIjogbW9udGhQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQmFjayxcbiAgICB9KSxcbiAgICBbQ0FMRU5EQVJfWUVBUl06IGtleW1hcCh7XG4gICAgICBVcDogaGFuZGxlVXBGcm9tWWVhcixcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbVllYXIsXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbVllYXIsXG4gICAgICBBcnJvd0Rvd246IGhhbmRsZURvd25Gcm9tWWVhcixcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tWWVhcixcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21ZZWFyLFxuICAgICAgUmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbVllYXIsXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21ZZWFyLFxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21ZZWFyLFxuICAgICAgRW5kOiBoYW5kbGVFbmRGcm9tWWVhcixcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21ZZWFyLFxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tWWVhcixcbiAgICB9KSxcbiAgICBbQ0FMRU5EQVJfWUVBUl9QSUNLRVJdOiBrZXltYXAoe1xuICAgICAgVGFiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxuICAgICAgXCJTaGlmdCtUYWJcIjogeWVhclBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxuICAgIH0pLFxuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcbiAgICAgIHRoaXMuZGF0YXNldC5rZXlkb3duS2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgfSxcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XG4gICAgICBjb25zdCBrZXlNYXAgPSBrZXltYXAoe1xuICAgICAgICBFc2NhcGU6IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhcixcbiAgICAgIH0pO1xuXG4gICAgICBrZXlNYXAoZXZlbnQpO1xuICAgIH0sXG4gIH0sXG4gIGZvY3Vzb3V0OiB7XG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcbiAgICAgIHZhbGlkYXRlRGF0ZUlucHV0KHRoaXMpO1xuICAgIH0sXG4gICAgW0RBVEVfUElDS0VSXShldmVudCkge1xuICAgICAgaWYgKCF0aGlzLmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSB7XG4gICAgICAgIGhpZGVDYWxlbmRhcih0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuICBpbnB1dDoge1xuICAgIFtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF0oKSB7XG4gICAgICByZWNvbmNpbGVJbnB1dFZhbHVlcyh0aGlzKTtcbiAgICAgIHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlKHRoaXMpO1xuICAgIH0sXG4gIH0sXG59O1xuXG5pZiAoIWlzSW9zRGV2aWNlKCkpIHtcbiAgZGF0ZVBpY2tlckV2ZW50cy5tb3VzZW1vdmUgPSB7XG4gICAgW0NBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF0oKSB7XG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tRGF0ZSh0aGlzKTtcbiAgICB9LFxuICAgIFtDQUxFTkRBUl9NT05USF0oKSB7XG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tTW9udGgodGhpcyk7XG4gICAgfSxcbiAgICBbQ0FMRU5EQVJfWUVBUl0oKSB7XG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tWWVhcih0aGlzKTtcbiAgICB9LFxuICB9O1xufVxuXG5jb25zdCBkYXRlUGlja2VyID0gYmVoYXZpb3IoZGF0ZVBpY2tlckV2ZW50cywge1xuICBpbml0KHJvb3QpIHtcbiAgICBzZWxlY3QoREFURV9QSUNLRVIsIHJvb3QpLmZvckVhY2goKGRhdGVQaWNrZXJFbCkgPT4ge1xuICAgICAgaWYoIWRhdGVQaWNrZXJFbC5jbGFzc0xpc3QuY29udGFpbnMoREFURV9QSUNLRVJfSU5JVElBTElaRURfQ0xBU1MpKXtcbiAgICAgICAgZW5oYW5jZURhdGVQaWNrZXIoZGF0ZVBpY2tlckVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgc2V0TGFuZ3VhZ2Uoc3RyaW5ncykge1xuICAgIHRleHQgPSBzdHJpbmdzO1xuICAgIE1PTlRIX0xBQkVMUyA9IFtcbiAgICAgIHRleHQuamFudWFyeSxcbiAgICAgIHRleHQuZmVicnVhcnksXG4gICAgICB0ZXh0Lm1hcmNoLFxuICAgICAgdGV4dC5hcHJpbCxcbiAgICAgIHRleHQubWF5LFxuICAgICAgdGV4dC5qdW5lLFxuICAgICAgdGV4dC5qdWx5LFxuICAgICAgdGV4dC5hdWd1c3QsXG4gICAgICB0ZXh0LnNlcHRlbWJlcixcbiAgICAgIHRleHQub2N0b2JlcixcbiAgICAgIHRleHQubm92ZW1iZXIsXG4gICAgICB0ZXh0LmRlY2VtYmVyXG4gICAgXTtcbiAgICBEQVlfT0ZfV0VFS19MQUJFTFMgPSBbXG4gICAgICB0ZXh0Lm1vbmRheSxcbiAgICAgIHRleHQudHVlc2RheSxcbiAgICAgIHRleHQud2VkbmVzZGF5LFxuICAgICAgdGV4dC50aHVyc2RheSxcbiAgICAgIHRleHQuZnJpZGF5LFxuICAgICAgdGV4dC5zYXR1cmRheSxcbiAgICAgIHRleHQuc3VuZGF5XG4gICAgXTtcbiAgfSxcbiAgZ2V0RGF0ZVBpY2tlckNvbnRleHQsXG4gIGRpc2FibGUsXG4gIGVuYWJsZSxcbiAgaXNEYXRlSW5wdXRJbnZhbGlkLFxuICBzZXRDYWxlbmRhclZhbHVlLFxuICB2YWxpZGF0ZURhdGVJbnB1dCxcbiAgcmVuZGVyQ2FsZW5kYXIsXG4gIHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlXG59KTtcblxuLy8gI2VuZHJlZ2lvbiBEYXRlIFBpY2tlciBFdmVudCBEZWxlZ2F0aW9uIFJlZ2lzdHJhdGlvbiAvIENvbXBvbmVudFxuXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGVQaWNrZXI7XG4iLCIndXNlIHN0cmljdCc7XG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9kcm9wZG93bic7XG5pbXBvcnQgJy4uL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZCc7XG5cbi8qKlxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gc29ydGluZyB2YXJpYW50IG9mIE92ZXJmbG93IG1lbnUgY29tcG9uZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLm92ZXJmbG93LW1lbnUgZWxlbWVudFxuICovXG5mdW5jdGlvbiBEcm9wZG93blNvcnQgKGNvbnRhaW5lcil7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5idXR0b24gPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXTtcblxuICAgIC8vIGlmIG5vIHZhbHVlIGlzIHNlbGVjdGVkLCBjaG9vc2UgZmlyc3Qgb3B0aW9uXG4gICAgaWYoIXRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5vdmVyZmxvdy1saXN0IGxpIGJ1dHRvblthcmlhLWN1cnJlbnQ9XCJ0cnVlXCJdJykpe1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaSBidXR0b24nKVswXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcsIFwidHJ1ZVwiKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkVmFsdWUoKTtcbn1cblxuLyoqXG4gKiBBZGQgY2xpY2sgZXZlbnRzIG9uIG92ZXJmbG93IG1lbnUgYW5kIG9wdGlvbnMgaW4gbWVudVxuICovXG5Ecm9wZG93blNvcnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgIHRoaXMub3ZlcmZsb3dNZW51ID0gbmV3IERyb3Bkb3duKHRoaXMuYnV0dG9uKS5pbml0KCk7XG5cbiAgICBsZXQgc29ydGluZ09wdGlvbnMgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaSBidXR0b24nKTtcbiAgICBmb3IobGV0IHMgPSAwOyBzIDwgc29ydGluZ09wdGlvbnMubGVuZ3RoOyBzKyspe1xuICAgICAgICBsZXQgb3B0aW9uID0gc29ydGluZ09wdGlvbnNbc107XG4gICAgICAgIG9wdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25PcHRpb25DbGljay5iaW5kKHRoaXMpKTtcbiAgICB9XG59XG5cbi8qKlxuICogVXBkYXRlIGJ1dHRvbiB0ZXh0IHRvIHNlbGVjdGVkIHZhbHVlXG4gKi9cbkRyb3Bkb3duU29ydC5wcm90b3R5cGUudXBkYXRlU2VsZWN0ZWRWYWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgbGV0IHNlbGVjdGVkSXRlbSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5vdmVyZmxvdy1saXN0IGxpIGJ1dHRvblthcmlhLWN1cnJlbnQ9XCJ0cnVlXCJdJyk7XG4gICAgdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZWxlY3RlZC12YWx1ZScpWzBdLmlubmVyVGV4dCA9IHNlbGVjdGVkSXRlbS5pbm5lclRleHQ7XG59XG5cbi8qKlxuICogVHJpZ2dlcnMgd2hlbiBjaG9vc2luZyBvcHRpb24gaW4gbWVudVxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGVcbiAqL1xuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS5vbk9wdGlvbkNsaWNrID0gZnVuY3Rpb24oZSl7XG4gICAgbGV0IGxpID0gZS50YXJnZXQucGFyZW50Tm9kZTtcbiAgICBsaS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJ2xpIGJ1dHRvblthcmlhLWN1cnJlbnQ9XCJ0cnVlXCJdJykucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWN1cnJlbnQnKTtcbiAgICBsaS5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaSBidXR0b24nKVswXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcsICd0cnVlJyk7XG5cbiAgICBsZXQgYnV0dG9uID0gbGkucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXTtcbiAgICBsZXQgZXZlbnRTZWxlY3RlZCA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLnNlbGVjdGVkJyk7XG4gICAgZXZlbnRTZWxlY3RlZC5kZXRhaWwgPSB0aGlzLnRhcmdldDtcbiAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudFNlbGVjdGVkKTtcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkVmFsdWUoKTtcblxuICAgIC8vIGhpZGUgbWVudVxuICAgIGxldCBvdmVyZmxvd01lbnUgPSBuZXcgRHJvcGRvd24oYnV0dG9uKTtcbiAgICBvdmVyZmxvd01lbnUuaGlkZSgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93blNvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBicmVha3BvaW50cyA9IHJlcXVpcmUoJy4uL3V0aWxzL2JyZWFrcG9pbnRzJyk7XG5jb25zdCBCVVRUT04gPSAnLmJ1dHRvbi1vdmVyZmxvdy1tZW51JztcbmNvbnN0IGpzRHJvcGRvd25Db2xsYXBzZU1vZGlmaWVyID0gJ2pzLWRyb3Bkb3duLS1yZXNwb25zaXZlLWNvbGxhcHNlJzsgLy9vcHRpb246IG1ha2UgZHJvcGRvd24gYmVoYXZlIGFzIHRoZSBjb2xsYXBzZSBjb21wb25lbnQgd2hlbiBvbiBzbWFsbCBzY3JlZW5zICh1c2VkIGJ5IHN1Ym1lbnVzIGluIHRoZSBoZWFkZXIgYW5kIHN0ZXAtZHJvcGRvd24pLlxuY29uc3QgVEFSR0VUID0gJ2RhdGEtanMtdGFyZ2V0JztcblxuLyoqXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byBvdmVyZmxvdyBtZW51IGNvbXBvbmVudFxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uRWxlbWVudCBPdmVyZmxvdyBtZW51IGJ1dHRvblxuICovXG5mdW5jdGlvbiBEcm9wZG93biAoYnV0dG9uRWxlbWVudCkge1xuICB0aGlzLmJ1dHRvbkVsZW1lbnQgPSBidXR0b25FbGVtZW50O1xuICB0aGlzLnRhcmdldEVsID0gbnVsbDtcbiAgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IGZhbHNlO1xuXG4gIGlmKHRoaXMuYnV0dG9uRWxlbWVudCA9PT0gbnVsbCB8fHRoaXMuYnV0dG9uRWxlbWVudCA9PT0gdW5kZWZpbmVkKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGJ1dHRvbiBmb3Igb3ZlcmZsb3cgbWVudSBjb21wb25lbnQuYCk7XG4gIH1cbiAgbGV0IHRhcmdldEF0dHIgPSB0aGlzLmJ1dHRvbkVsZW1lbnQuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XG4gIGlmKHRhcmdldEF0dHIgPT09IG51bGwgfHwgdGFyZ2V0QXR0ciA9PT0gdW5kZWZpbmVkKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dHJpYnV0ZSBjb3VsZCBub3QgYmUgZm91bmQgb24gb3ZlcmZsb3cgbWVudSBjb21wb25lbnQ6ICcrVEFSR0VUKTtcbiAgfVxuICBsZXQgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJykpO1xuICBpZih0YXJnZXRFbCA9PT0gbnVsbCB8fCB0YXJnZXRFbCA9PT0gdW5kZWZpbmVkKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhbmVsIGZvciBvdmVyZmxvdyBtZW51IGNvbXBvbmVudCBjb3VsZCBub3QgYmUgZm91bmQuJyk7XG4gIH1cbiAgdGhpcy50YXJnZXRFbCA9IHRhcmdldEVsO1xufVxuXG4vKipcbiAqIFNldCBjbGljayBldmVudHNcbiAqL1xuRHJvcGRvd24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKXtcbiAgaWYodGhpcy5idXR0b25FbGVtZW50ICE9PSBudWxsICYmIHRoaXMuYnV0dG9uRWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudGFyZ2V0RWwgIT09IG51bGwgJiYgdGhpcy50YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcblxuICAgIGlmKHRoaXMuYnV0dG9uRWxlbWVudC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpIHx8IHRoaXMuYnV0dG9uRWxlbWVudC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKXtcbiAgICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vQ2xpY2tlZCBvdXRzaWRlIGRyb3Bkb3duIC0+IGNsb3NlIGl0XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsb3NlKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xuICAgIC8vQ2xpY2tlZCBvbiBkcm9wZG93biBvcGVuIGJ1dHRvbiAtLT4gdG9nZ2xlIGl0XG4gICAgdGhpcy5idXR0b25FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlRHJvcGRvd24pO1xuICAgIHRoaXMuYnV0dG9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcbiAgICBsZXQgJG1vZHVsZSA9IHRoaXM7XG4gICAgLy8gc2V0IGFyaWEtaGlkZGVuIGNvcnJlY3RseSBmb3Igc2NyZWVucmVhZGVycyAoVHJpbmd1aWRlIHJlc3BvbnNpdmUpXG4gICAgaWYodGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCkge1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmJ1dHRvbkVsZW1lbnQ7XG4gICAgICBpZiAod2luZG93LkludGVyc2VjdGlvbk9ic2VydmVyKSB7XG4gICAgICAgIC8vIHRyaWdnZXIgZXZlbnQgd2hlbiBidXR0b24gY2hhbmdlcyB2aXNpYmlsaXR5XG4gICAgICAgIGxldCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbiAoZW50cmllcykge1xuICAgICAgICAgIC8vIGJ1dHRvbiBpcyB2aXNpYmxlXG4gICAgICAgICAgaWYgKGVudHJpZXNbIDAgXS5pbnRlcnNlY3Rpb25SYXRpbykge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYnV0dG9uIGlzIG5vdCB2aXNpYmxlXG4gICAgICAgICAgICBpZiAoJG1vZHVsZS50YXJnZXRFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICByb290OiBkb2N1bWVudC5ib2R5XG4gICAgICAgIH0pO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSUU6IEludGVyc2VjdGlvbk9ic2VydmVyIGlzIG5vdCBzdXBwb3J0ZWQsIHNvIHdlIGxpc3RlbiBmb3Igd2luZG93IHJlc2l6ZSBhbmQgZ3JpZCBicmVha3BvaW50IGluc3RlYWRcbiAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKCRtb2R1bGUudHJpZ2dlckVsKSkge1xuICAgICAgICAgIC8vIHNtYWxsIHNjcmVlblxuICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgIH0gZWxzZXtcbiAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBMYXJnZSBzY3JlZW5cbiAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSgkbW9kdWxlLnRyaWdnZXJFbCkpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICB9IGVsc2V7XG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIFxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgY2xvc2VPbkVzY2FwZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBjbG9zZU9uRXNjYXBlKTtcbiAgfVxufVxuXG4vKipcbiAqIEhpZGUgb3ZlcmZsb3cgbWVudVxuICovXG5Ecm9wZG93bi5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gIHRvZ2dsZSh0aGlzLmJ1dHRvbkVsZW1lbnQpO1xufVxuXG4vKipcbiAqIFNob3cgb3ZlcmZsb3cgbWVudVxuICovXG5Ecm9wZG93bi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCl7XG4gIHRvZ2dsZSh0aGlzLmJ1dHRvbkVsZW1lbnQpO1xufVxuXG5sZXQgY2xvc2VPbkVzY2FwZSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XG4gIGlmIChrZXkgPT09IDI3KSB7XG4gICAgY2xvc2VBbGwoZXZlbnQpO1xuICB9XG59O1xuXG4vKipcbiAqIEdldCBhbiBBcnJheSBvZiBidXR0b24gZWxlbWVudHMgYmVsb25naW5nIGRpcmVjdGx5IHRvIHRoZSBnaXZlblxuICogYWNjb3JkaW9uIGVsZW1lbnQuXG4gKiBAcGFyYW0gcGFyZW50IGFjY29yZGlvbiBlbGVtZW50XG4gKiBAcmV0dXJucyB7Tm9kZUxpc3RPZjxTVkdFbGVtZW50VGFnTmFtZU1hcFtbc3RyaW5nXV0+IHwgTm9kZUxpc3RPZjxIVE1MRWxlbWVudFRhZ05hbWVNYXBbW3N0cmluZ11dPiB8IE5vZGVMaXN0T2Y8RWxlbWVudD59XG4gKi9cbmxldCBnZXRCdXR0b25zID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcbn07XG5cbi8qKlxuICogQ2xvc2UgYWxsIG92ZXJmbG93IG1lbnVzXG4gKiBAcGFyYW0ge2V2ZW50fSBldmVudCBkZWZhdWx0IGlzIG51bGxcbiAqL1xubGV0IGNsb3NlQWxsID0gZnVuY3Rpb24gKGV2ZW50ID0gbnVsbCl7XG4gIGxldCBjaGFuZ2VkID0gZmFsc2U7XG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5cbiAgbGV0IG92ZXJmbG93TWVudUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudScpO1xuICBmb3IgKGxldCBvaSA9IDA7IG9pIDwgb3ZlcmZsb3dNZW51RWwubGVuZ3RoOyBvaSsrKSB7XG4gICAgbGV0IGN1cnJlbnRPdmVyZmxvd01lbnVFTCA9IG92ZXJmbG93TWVudUVsWyBvaSBdO1xuICAgIGxldCB0cmlnZ2VyRWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwucXVlcnlTZWxlY3RvcihCVVRUT04rJ1thcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXScpO1xuICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCl7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIGxldCB0YXJnZXRFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5xdWVyeVNlbGVjdG9yKCcjJyt0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCkucmVwbGFjZSgnIycsICcnKSk7XG5cbiAgICAgICAgaWYgKHRhcmdldEVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gbnVsbCkge1xuICAgICAgICAgIGlmKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkpe1xuICAgICAgICAgICAgaWYodHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSB0cnVlKXtcbiAgICAgICAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xuICAgICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYoY2hhbmdlZCAmJiBldmVudCAhPT0gbnVsbCl7XG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gIH1cbn07XG5sZXQgb2Zmc2V0ID0gZnVuY3Rpb24gKGVsKSB7XG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgcmV0dXJuIHsgdG9wOiByZWN0LnRvcCArIHNjcm9sbFRvcCwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9O1xufTtcblxubGV0IHRvZ2dsZURyb3Bkb3duID0gZnVuY3Rpb24gKGV2ZW50LCBmb3JjZUNsb3NlID0gZmFsc2UpIHtcbiAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgdG9nZ2xlKHRoaXMsIGZvcmNlQ2xvc2UpO1xuXG59O1xuXG5sZXQgdG9nZ2xlID0gZnVuY3Rpb24oYnV0dG9uLCBmb3JjZUNsb3NlID0gZmFsc2Upe1xuICBsZXQgdHJpZ2dlckVsID0gYnV0dG9uO1xuICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xuICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xuICAgIGxldCB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpO1xuICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcbiAgICB9XG4gIH1cbiAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgIC8vY2hhbmdlIHN0YXRlXG5cbiAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gbnVsbDtcbiAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9IG51bGw7XG5cbiAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCBmb3JjZUNsb3NlKXtcbiAgICAgIC8vY2xvc2VcbiAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7ICAgICAgXG4gICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLmNsb3NlJyk7XG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcbiAgICB9ZWxzZXtcbiAgICAgIFxuICAgICAgaWYoIWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2JpbGVfbmF2LWFjdGl2ZScpKXtcbiAgICAgICAgY2xvc2VBbGwoKTtcbiAgICAgIH1cbiAgICAgIC8vb3BlblxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcbiAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5vcGVuJyk7XG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xuICAgICAgbGV0IHRhcmdldE9mZnNldCA9IG9mZnNldCh0YXJnZXRFbCk7XG5cbiAgICAgIGlmKHRhcmdldE9mZnNldC5sZWZ0IDwgMCl7XG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XG4gICAgICB9XG4gICAgICBsZXQgcmlnaHQgPSB0YXJnZXRPZmZzZXQubGVmdCArIHRhcmdldEVsLm9mZnNldFdpZHRoO1xuICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XG4gICAgICB9XG5cbiAgICAgIGxldCBvZmZzZXRBZ2FpbiA9IG9mZnNldCh0YXJnZXRFbCk7XG5cbiAgICAgIGlmKG9mZnNldEFnYWluLmxlZnQgPCAwKXtcblxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xuICAgICAgfVxuICAgICAgcmlnaHQgPSBvZmZzZXRBZ2Fpbi5sZWZ0ICsgdGFyZ2V0RWwub2Zmc2V0V2lkdGg7XG4gICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcblxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xuICAgICAgfVxuICAgIH1cblxuICB9XG59XG5cbmxldCBoYXNQYXJlbnQgPSBmdW5jdGlvbiAoY2hpbGQsIHBhcmVudFRhZ05hbWUpe1xuICBpZihjaGlsZC5wYXJlbnROb2RlLnRhZ05hbWUgPT09IHBhcmVudFRhZ05hbWUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYocGFyZW50VGFnTmFtZSAhPT0gJ0JPRFknICYmIGNoaWxkLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ0JPRFknKXtcbiAgICByZXR1cm4gaGFzUGFyZW50KGNoaWxkLnBhcmVudE5vZGUsIHBhcmVudFRhZ05hbWUpO1xuICB9ZWxzZXtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbmxldCBvdXRzaWRlQ2xvc2UgPSBmdW5jdGlvbiAoZXZ0KXtcbiAgaWYoIWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2JpbGVfbmF2LWFjdGl2ZScpKXtcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Lm1vYmlsZV9uYXYtYWN0aXZlJykgPT09IG51bGwgJiYgIWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXR0b24tbWVudS1jbG9zZScpKSB7XG4gICAgICBsZXQgb3BlbkRyb3Bkb3ducyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKydbYXJpYS1leHBhbmRlZD10cnVlXScpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcGVuRHJvcGRvd25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCB0cmlnZ2VyRWwgPSBvcGVuRHJvcGRvd25zW2ldO1xuICAgICAgICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xuICAgICAgICBsZXQgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcbiAgICAgICAgaWYgKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYodGFyZ2V0QXR0ci5pbmRleE9mKCcjJykgIT09IC0xKXtcbiAgICAgICAgICAgIHRhcmdldEF0dHIgPSB0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0cik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkgfHwgKGhhc1BhcmVudCh0cmlnZ2VyRWwsICdIRUFERVInKSAmJiAhZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJsYXknKSkpIHtcbiAgICAgICAgICAvL2Nsb3NlcyBkcm9wZG93biB3aGVuIGNsaWNrZWQgb3V0c2lkZVxuICAgICAgICAgIGlmIChldnQudGFyZ2V0ICE9PSB0cmlnZ2VyRWwpIHtcbiAgICAgICAgICAgIC8vY2xpY2tlZCBvdXRzaWRlIHRyaWdnZXIsIGZvcmNlIGNsb3NlXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxubGV0IGRvUmVzcG9uc2l2ZUNvbGxhcHNlID0gZnVuY3Rpb24gKHRyaWdnZXJFbCl7XG4gIGlmKCF0cmlnZ2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGpzRHJvcGRvd25Db2xsYXBzZU1vZGlmaWVyKSl7XG4gICAgLy8gbm90IG5hdiBvdmVyZmxvdyBtZW51XG4gICAgaWYodHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykgfHwgdHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpIHtcbiAgICAgIC8vIHRyaW5pbmRpa2F0b3Igb3ZlcmZsb3cgbWVudVxuICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IGdldFRyaW5ndWlkZUJyZWFrcG9pbnQodHJpZ2dlckVsKSkge1xuICAgICAgICAvLyBvdmVyZmxvdyBtZW51IHDDpSByZXNwb25zaXYgdHJpbmd1aWRlIGFrdGl2ZXJldFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2V7XG4gICAgICAvLyBub3JtYWwgb3ZlcmZsb3cgbWVudVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxubGV0IGdldFRyaW5ndWlkZUJyZWFrcG9pbnQgPSBmdW5jdGlvbiAoYnV0dG9uKXtcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykpe1xuICAgIHJldHVybiBicmVha3BvaW50cy5tZDtcbiAgfVxuICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSl7XG4gICAgcmV0dXJuIGJyZWFrcG9pbnRzLmxnO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93bjsiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIEhhbmRsZSBmb2N1cyBvbiBpbnB1dCBlbGVtZW50cyB1cG9uIGNsaWNraW5nIGxpbmsgaW4gZXJyb3IgbWVzc2FnZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBFcnJvciBzdW1tYXJ5IGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gRXJyb3JTdW1tYXJ5IChlbGVtZW50KSB7XG4gIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG59XG5cbi8qKlxuICogU2V0IGV2ZW50cyBvbiBsaW5rcyBpbiBlcnJvciBzdW1tYXJ5XG4gKi9cbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcbiAgICByZXR1cm5cbiAgfVxuICB0aGlzLmVsZW1lbnQuZm9jdXMoKVxuXG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKSlcbn1cblxuLyoqXG4qIENsaWNrIGV2ZW50IGhhbmRsZXJcbipcbiogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIENsaWNrIGV2ZW50XG4qL1xuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5oYW5kbGVDbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XG4gIGlmICh0aGlzLmZvY3VzVGFyZ2V0KHRhcmdldCkpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cbn1cblxuLyoqXG4gKiBGb2N1cyB0aGUgdGFyZ2V0IGVsZW1lbnRcbiAqXG4gKiBCeSBkZWZhdWx0LCB0aGUgYnJvd3NlciB3aWxsIHNjcm9sbCB0aGUgdGFyZ2V0IGludG8gdmlldy4gQmVjYXVzZSBvdXIgbGFiZWxzXG4gKiBvciBsZWdlbmRzIGFwcGVhciBhYm92ZSB0aGUgaW5wdXQsIHRoaXMgbWVhbnMgdGhlIHVzZXIgd2lsbCBiZSBwcmVzZW50ZWQgd2l0aFxuICogYW4gaW5wdXQgd2l0aG91dCBhbnkgY29udGV4dCwgYXMgdGhlIGxhYmVsIG9yIGxlZ2VuZCB3aWxsIGJlIG9mZiB0aGUgdG9wIG9mXG4gKiB0aGUgc2NyZWVuLlxuICpcbiAqIE1hbnVhbGx5IGhhbmRsaW5nIHRoZSBjbGljayBldmVudCwgc2Nyb2xsaW5nIHRoZSBxdWVzdGlvbiBpbnRvIHZpZXcgYW5kIHRoZW5cbiAqIGZvY3Vzc2luZyB0aGUgZWxlbWVudCBzb2x2ZXMgdGhpcy5cbiAqXG4gKiBUaGlzIGFsc28gcmVzdWx0cyBpbiB0aGUgbGFiZWwgYW5kL29yIGxlZ2VuZCBiZWluZyBhbm5vdW5jZWQgY29ycmVjdGx5IGluXG4gKiBOVkRBIChhcyB0ZXN0ZWQgaW4gMjAxOC4zLjIpIC0gd2l0aG91dCB0aGlzIG9ubHkgdGhlIGZpZWxkIHR5cGUgaXMgYW5ub3VuY2VkXG4gKiAoZS5nLiBcIkVkaXQsIGhhcyBhdXRvY29tcGxldGVcIikuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJHRhcmdldCAtIEV2ZW50IHRhcmdldFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHRhcmdldCB3YXMgYWJsZSB0byBiZSBmb2N1c3NlZFxuICovXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmZvY3VzVGFyZ2V0ID0gZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgLy8gSWYgdGhlIGVsZW1lbnQgdGhhdCB3YXMgY2xpY2tlZCB3YXMgbm90IGEgbGluaywgcmV0dXJuIGVhcmx5XG4gIGlmICgkdGFyZ2V0LnRhZ05hbWUgIT09ICdBJyB8fCAkdGFyZ2V0LmhyZWYgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICB2YXIgaW5wdXRJZCA9IHRoaXMuZ2V0RnJhZ21lbnRGcm9tVXJsKCR0YXJnZXQuaHJlZilcbiAgdmFyICRpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0SWQpXG4gIGlmICghJGlucHV0KSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICB2YXIgJGxlZ2VuZE9yTGFiZWwgPSB0aGlzLmdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsKCRpbnB1dClcbiAgaWYgKCEkbGVnZW5kT3JMYWJlbCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gU2Nyb2xsIHRoZSBsZWdlbmQgb3IgbGFiZWwgaW50byB2aWV3ICpiZWZvcmUqIGNhbGxpbmcgZm9jdXMgb24gdGhlIGlucHV0IHRvXG4gIC8vIGF2b2lkIGV4dHJhIHNjcm9sbGluZyBpbiBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgYHByZXZlbnRTY3JvbGxgICh3aGljaFxuICAvLyBhdCB0aW1lIG9mIHdyaXRpbmcgaXMgbW9zdCBvZiB0aGVtLi4uKVxuICAkbGVnZW5kT3JMYWJlbC5zY3JvbGxJbnRvVmlldygpXG4gICRpbnB1dC5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSlcblxuICByZXR1cm4gdHJ1ZVxufVxuXG4vKipcbiAqIEdldCBmcmFnbWVudCBmcm9tIFVSTFxuICpcbiAqIEV4dHJhY3QgdGhlIGZyYWdtZW50IChldmVyeXRoaW5nIGFmdGVyIHRoZSBoYXNoKSBmcm9tIGEgVVJMLCBidXQgbm90IGluY2x1ZGluZ1xuICogdGhlIGhhc2guXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gRnJhZ21lbnQgZnJvbSBVUkwsIHdpdGhvdXQgdGhlIGhhc2hcbiAqL1xuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5nZXRGcmFnbWVudEZyb21VcmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gIGlmICh1cmwuaW5kZXhPZignIycpID09PSAtMSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHVybC5zcGxpdCgnIycpLnBvcCgpXG59XG5cbi8qKlxuICogR2V0IGFzc29jaWF0ZWQgbGVnZW5kIG9yIGxhYmVsXG4gKlxuICogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IGV4aXN0cyBmcm9tIHRoaXMgbGlzdDpcbiAqXG4gKiAtIFRoZSBgPGxlZ2VuZD5gIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2xvc2VzdCBgPGZpZWxkc2V0PmAgYW5jZXN0b3IsIGFzIGxvbmdcbiAqICAgYXMgdGhlIHRvcCBvZiBpdCBpcyBubyBtb3JlIHRoYW4gaGFsZiBhIHZpZXdwb3J0IGhlaWdodCBhd2F5IGZyb20gdGhlXG4gKiAgIGJvdHRvbSBvZiB0aGUgaW5wdXRcbiAqIC0gVGhlIGZpcnN0IGA8bGFiZWw+YCB0aGF0IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQgdXNpbmcgZm9yPVwiaW5wdXRJZFwiXG4gKiAtIFRoZSBjbG9zZXN0IHBhcmVudCBgPGxhYmVsPmBcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkaW5wdXQgLSBUaGUgaW5wdXRcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gQXNzb2NpYXRlZCBsZWdlbmQgb3IgbGFiZWwsIG9yIG51bGwgaWYgbm8gYXNzb2NpYXRlZFxuICogICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQgb3IgbGFiZWwgY2FuIGJlIGZvdW5kXG4gKi9cbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZ2V0QXNzb2NpYXRlZExlZ2VuZE9yTGFiZWwgPSBmdW5jdGlvbiAoJGlucHV0KSB7XG4gIHZhciAkZmllbGRzZXQgPSAkaW5wdXQuY2xvc2VzdCgnZmllbGRzZXQnKVxuXG4gIGlmICgkZmllbGRzZXQpIHtcbiAgICB2YXIgbGVnZW5kcyA9ICRmaWVsZHNldC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGVnZW5kJylcblxuICAgIGlmIChsZWdlbmRzLmxlbmd0aCkge1xuICAgICAgdmFyICRjYW5kaWRhdGVMZWdlbmQgPSBsZWdlbmRzWzBdXG5cbiAgICAgIC8vIElmIHRoZSBpbnB1dCB0eXBlIGlzIHJhZGlvIG9yIGNoZWNrYm94LCBhbHdheXMgdXNlIHRoZSBsZWdlbmQgaWYgdGhlcmVcbiAgICAgIC8vIGlzIG9uZS5cbiAgICAgIGlmICgkaW5wdXQudHlwZSA9PT0gJ2NoZWNrYm94JyB8fCAkaW5wdXQudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICByZXR1cm4gJGNhbmRpZGF0ZUxlZ2VuZFxuICAgICAgfVxuXG4gICAgICAvLyBGb3Igb3RoZXIgaW5wdXQgdHlwZXMsIG9ubHkgc2Nyb2xsIHRvIHRoZSBmaWVsZHNldOKAmXMgbGVnZW5kIChpbnN0ZWFkIG9mXG4gICAgICAvLyB0aGUgbGFiZWwgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dCkgaWYgdGhlIGlucHV0IHdvdWxkIGVuZCB1cCBpbiB0aGVcbiAgICAgIC8vIHRvcCBoYWxmIG9mIHRoZSBzY3JlZW4uXG4gICAgICAvL1xuICAgICAgLy8gVGhpcyBzaG91bGQgYXZvaWQgc2l0dWF0aW9ucyB3aGVyZSB0aGUgaW5wdXQgZWl0aGVyIGVuZHMgdXAgb2ZmIHRoZVxuICAgICAgLy8gc2NyZWVuLCBvciBvYnNjdXJlZCBieSBhIHNvZnR3YXJlIGtleWJvYXJkLlxuICAgICAgdmFyIGxlZ2VuZFRvcCA9ICRjYW5kaWRhdGVMZWdlbmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG4gICAgICB2YXIgaW5wdXRSZWN0ID0gJGlucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIC8vIElmIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxuICAgICAgLy8gb3Igd2luZG93LmlubmVySGVpZ2h0IChsaWtlIElFOCksIGJhaWwgYW5kIGp1c3QgbGluayB0byB0aGUgbGFiZWwuXG4gICAgICBpZiAoaW5wdXRSZWN0LmhlaWdodCAmJiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgdmFyIGlucHV0Qm90dG9tID0gaW5wdXRSZWN0LnRvcCArIGlucHV0UmVjdC5oZWlnaHRcblxuICAgICAgICBpZiAoaW5wdXRCb3R0b20gLSBsZWdlbmRUb3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSB7XG4gICAgICAgICAgcmV0dXJuICRjYW5kaWRhdGVMZWdlbmRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibGFiZWxbZm9yPSdcIiArICRpbnB1dC5nZXRBdHRyaWJ1dGUoJ2lkJykgKyBcIiddXCIpIHx8XG4gICAgJGlucHV0LmNsb3Nlc3QoJ2xhYmVsJylcbn1cblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JTdW1tYXJ5OyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIG1vZGFsXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkbW9kYWwgTW9kYWwgZWxlbWVudFxuICovXG5mdW5jdGlvbiBNb2RhbCAoJG1vZGFsKSB7XG4gICAgdGhpcy4kbW9kYWwgPSAkbW9kYWw7XG4gICAgbGV0IGlkID0gdGhpcy4kbW9kYWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIHRoaXMudHJpZ2dlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGU9XCJtb2RhbFwiXVtkYXRhLXRhcmdldD1cIicraWQrJ1wiXScpO1xufVxuXG4vKipcbiAqIFNldCBldmVudHNcbiAqL1xuTW9kYWwucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCB0cmlnZ2VycyA9IHRoaXMudHJpZ2dlcnM7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHJpZ2dlcnMubGVuZ3RoOyBpKyspe1xuICAgIGxldCB0cmlnZ2VyID0gdHJpZ2dlcnNbIGkgXTtcbiAgICB0cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zaG93LmJpbmQodGhpcykpO1xuICB9XG4gIGxldCBjbG9zZXJzID0gdGhpcy4kbW9kYWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kYWwtY2xvc2VdJyk7XG4gIGZvciAobGV0IGMgPSAwOyBjIDwgY2xvc2Vycy5sZW5ndGg7IGMrKyl7XG4gICAgbGV0IGNsb3NlciA9IGNsb3NlcnNbIGMgXTtcbiAgICBjbG9zZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGUuYmluZCh0aGlzKSk7XG4gIH1cbn07XG5cbi8qKlxuICogSGlkZSBtb2RhbFxuICovXG5Nb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpe1xuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XG4gIGlmKG1vZGFsRWxlbWVudCAhPT0gbnVsbCl7XG4gICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgbGV0IGV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICBldmVudENsb3NlLmluaXRFdmVudCgnZmRzLm1vZGFsLmhpZGRlbicsIHRydWUsIHRydWUpO1xuICAgIG1vZGFsRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xuXG4gICAgbGV0ICRiYWNrZHJvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbC1iYWNrZHJvcCcpO1xuICAgICRiYWNrZHJvcC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCRiYWNrZHJvcCk7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcEZvY3VzLCB0cnVlKTtcblxuICAgIGlmKCFoYXNGb3JjZWRBY3Rpb24obW9kYWxFbGVtZW50KSl7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUVzY2FwZSk7XG4gICAgfVxuICAgIGxldCBkYXRhTW9kYWxPcGVuZXIgPSBtb2RhbEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLW9wZW5lcicpO1xuICAgIGlmKGRhdGFNb2RhbE9wZW5lciAhPT0gbnVsbCl7XG4gICAgICBsZXQgb3BlbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YU1vZGFsT3BlbmVyKVxuICAgICAgaWYob3BlbmVyICE9PSBudWxsKXtcbiAgICAgICAgb3BlbmVyLmZvY3VzKCk7XG4gICAgICB9XG4gICAgICBtb2RhbEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLW1vZGFsLW9wZW5lcicpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBTaG93IG1vZGFsXG4gKi9cbk1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKGUgPSBudWxsKXtcbiAgbGV0IG1vZGFsRWxlbWVudCA9IHRoaXMuJG1vZGFsO1xuICBpZihtb2RhbEVsZW1lbnQgIT09IG51bGwpe1xuICAgIGlmKGUgIT09IG51bGwpe1xuICAgICAgbGV0IG9wZW5lcklkID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgaWYob3BlbmVySWQgPT09IG51bGwpe1xuICAgICAgICBvcGVuZXJJZCA9ICdtb2RhbC1vcGVuZXItJytNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoOTk5OSAtIDEwMDAgKyAxKSArIDEwMDApO1xuICAgICAgICBlLnRhcmdldC5zZXRBdHRyaWJ1dGUoJ2lkJywgb3BlbmVySWQpXG4gICAgICB9XG4gICAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLW9wZW5lcicsIG9wZW5lcklkKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIG9wZW4gbW9kYWxzIC0gRkRTIGRvIG5vdCByZWNvbW1lbmQgbW9yZSB0aGFuIG9uZSBvcGVuIG1vZGFsIGF0IGEgdGltZVxuICAgIC8vIEBCcmFtcyAtIG92ZXJyaWRpbmcgdGhpcywgbm8gcmVhc29uIHRvIG5vdCBhbGxvdyB0aGUgZGV2ZWxvcGVyIHRvIGNvbnRyb2wgaXQgdGhlbXNlbHZlcy5cbiAgICBcbiAgICAvLyBsZXQgYWN0aXZlTW9kYWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcbiAgICAvLyBmb3IobGV0IGkgPSAwOyBpIDwgYWN0aXZlTW9kYWxzLmxlbmd0aDsgaSsrKXtcbiAgICAvLyAgIG5ldyBNb2RhbChhY3RpdmVNb2RhbHNbaV0pLmhpZGUoKTtcbiAgICAvLyB9XG5cbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG5cbiAgICBsZXQgZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLm1vZGFsLnNob3duJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbW9kYWxFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcblxuICAgIGxldCAkYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAkYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnbW9kYWwtYmFja2Ryb3AnKTtcbiAgICAkYmFja2Ryb3Auc2V0QXR0cmlidXRlKCdpZCcsIFwibW9kYWwtYmFja2Ryb3BcIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCgkYmFja2Ryb3ApO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJyk7XG5cbiAgICBtb2RhbEVsZW1lbnQuZm9jdXMoKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwRm9jdXMsIHRydWUpO1xuICAgIGlmKCFoYXNGb3JjZWRBY3Rpb24obW9kYWxFbGVtZW50KSl7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUVzY2FwZSk7XG4gICAgfVxuXG4gIH1cbn07XG5cbi8qKlxuICogQ2xvc2UgbW9kYWwgd2hlbiBoaXR0aW5nIEVTQ1xuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcbiAqL1xubGV0IGhhbmRsZUVzY2FwZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcbiAgbGV0IG1vZGFsRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJyk7XG4gIGxldCBjdXJyZW50TW9kYWwgPSBuZXcgTW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKSk7XG4gIGlmIChrZXkgPT09IDI3KXtcbiAgICBsZXQgcG9zc2libGVPdmVyZmxvd01lbnVzID0gbW9kYWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24tb3ZlcmZsb3ctbWVudVthcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXScpO1xuICAgIGlmKHBvc3NpYmxlT3ZlcmZsb3dNZW51cy5sZW5ndGggPT09IDApe1xuICAgICAgY3VycmVudE1vZGFsLmhpZGUoKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogVHJhcCBmb2N1cyBpbiBtb2RhbCB3aGVuIG9wZW5cbiAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBlXG4gKi9cbiBmdW5jdGlvbiB0cmFwRm9jdXMoZSl7XG4gIHZhciBjdXJyZW50RGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcbiAgaWYoY3VycmVudERpYWxvZyAhPT0gbnVsbCl7XG4gICAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gY3VycmVudERpYWxvZy5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWZdOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBpbnB1dDpub3QoW3R5cGU9aGlkZGVuXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBkZXRhaWxzOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKScpO1xuICAgIFxuICAgIHZhciBmaXJzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1swXTtcbiAgICB2YXIgbGFzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXTtcblxuICAgIHZhciBpc1RhYlByZXNzZWQgPSAoZS5rZXkgPT09ICdUYWInIHx8IGUua2V5Q29kZSA9PT0gOSk7XG5cbiAgICBpZiAoIWlzVGFiUHJlc3NlZCkgeyBcbiAgICAgIHJldHVybjsgXG4gICAgfVxuXG4gICAgaWYgKCBlLnNoaWZ0S2V5ICkgLyogc2hpZnQgKyB0YWIgKi8ge1xuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICBsYXN0Rm9jdXNhYmxlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgLyogdGFiICovIHtcbiAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICBmaXJzdEZvY3VzYWJsZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBoYXNGb3JjZWRBY3Rpb24gKG1vZGFsKXtcbiAgaWYobW9kYWwuZ2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLWZvcmNlZC1hY3Rpb24nKSA9PT0gbnVsbCl7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBNb2RhbDtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcblxuY29uc3QgTkFWID0gYC5uYXZgO1xuY29uc3QgTkFWX0xJTktTID0gYCR7TkFWfSBhYDtcbmNvbnN0IE9QRU5FUlMgPSBgLmpzLW1lbnUtb3BlbmA7XG5jb25zdCBDTE9TRV9CVVRUT04gPSBgLmpzLW1lbnUtY2xvc2VgO1xuY29uc3QgT1ZFUkxBWSA9IGAub3ZlcmxheWA7XG5jb25zdCBDTE9TRVJTID0gYCR7Q0xPU0VfQlVUVE9OfSwgLm92ZXJsYXlgO1xuY29uc3QgVE9HR0xFUyA9IFsgTkFWLCBPVkVSTEFZIF0uam9pbignLCAnKTtcblxuY29uc3QgQUNUSVZFX0NMQVNTID0gJ21vYmlsZV9uYXYtYWN0aXZlJztcbmNvbnN0IFZJU0lCTEVfQ0xBU1MgPSAnaXMtdmlzaWJsZSc7XG5cbi8qKlxuICogQWRkIG1vYmlsZSBtZW51IGZ1bmN0aW9uYWxpdHlcbiAqL1xuY2xhc3MgTmF2aWdhdGlvbiB7XG4gIC8qKlxuICAgKiBTZXQgZXZlbnRzXG4gICAqL1xuICBpbml0ICgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbW9iaWxlTWVudSwgZmFsc2UpO1xuICAgIG1vYmlsZU1lbnUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZXZlbnRzXG4gICAqL1xuICB0ZWFyZG93biAoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG1vYmlsZU1lbnUsIGZhbHNlKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIG1vYmlsZSBtZW51XG4gKi9cbmNvbnN0IG1vYmlsZU1lbnUgPSBmdW5jdGlvbigpIHtcbiAgbGV0IG1vYmlsZSA9IGZhbHNlO1xuICBsZXQgb3BlbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoT1BFTkVSUyk7XG4gIGZvcihsZXQgbyA9IDA7IG8gPCBvcGVuZXJzLmxlbmd0aDsgbysrKSB7XG4gICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUob3BlbmVyc1tvXSwgbnVsbCkuZGlzcGxheSAhPT0gJ25vbmUnKSB7XG4gICAgICBvcGVuZXJzW29dLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTmF2KTtcbiAgICAgIG1vYmlsZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgbW9iaWxlXG4gIGlmKG1vYmlsZSl7XG4gICAgbGV0IGNsb3NlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKENMT1NFUlMpO1xuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjbG9zZXJzLmxlbmd0aDsgYysrKSB7XG4gICAgICBjbG9zZXJzWyBjIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xuICAgIH1cblxuICAgIGxldCBuYXZMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWX0xJTktTKTtcbiAgICBmb3IobGV0IG4gPSAwOyBuIDwgbmF2TGlua3MubGVuZ3RoOyBuKyspIHtcbiAgICAgIG5hdkxpbmtzWyBuIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAvLyBBIG5hdmlnYXRpb24gbGluayBoYXMgYmVlbiBjbGlja2VkISBXZSB3YW50IHRvIGNvbGxhcHNlIGFueVxuICAgICAgICAvLyBoaWVyYXJjaGljYWwgbmF2aWdhdGlvbiBVSSBpdCdzIGEgcGFydCBvZiwgc28gdGhhdCB0aGUgdXNlclxuICAgICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxuXG4gICAgICAgIC8vIFNvbWUgbmF2aWdhdGlvbiBsaW5rcyBhcmUgaW5zaWRlIGRyb3Bkb3duczsgd2hlbiB0aGV5J3JlXG4gICAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgZHJvcGRvd25zLlxuXG5cbiAgICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXG4gICAgICAgIGlmIChpc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmFwQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWKTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdHJhcENvbnRhaW5lcnMubGVuZ3RoOyBpKyspe1xuICAgICAgZm9jdXNUcmFwID0gX2ZvY3VzVHJhcCh0cmFwQ29udGFpbmVyc1tpXSk7XG4gICAgfVxuXG4gIH1cblxuICBjb25zdCBjbG9zZXIgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcblxuICBpZiAoaXNBY3RpdmUoKSAmJiBjbG9zZXIgJiYgY2xvc2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoID09PSAwKSB7XG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgaXMgYWN0aXZlLCBidXQgdGhlIGNsb3NlIGJveCBpc24ndCB2aXNpYmxlLCB3aGljaFxuICAgIC8vIG1lYW5zIHRoZSB1c2VyJ3Mgdmlld3BvcnQgaGFzIGJlZW4gcmVzaXplZCBzbyB0aGF0IGl0IGlzIG5vIGxvbmdlclxuICAgIC8vIGluIG1vYmlsZSBtb2RlLiBMZXQncyBtYWtlIHRoZSBwYWdlIHN0YXRlIGNvbnNpc3RlbnQgYnlcbiAgICAvLyBkZWFjdGl2YXRpbmcgdGhlIG1vYmlsZSBuYXYuXG4gICAgdG9nZ2xlTmF2LmNhbGwoY2xvc2VyLCBmYWxzZSk7XG4gIH1cbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgbW9iaWxlIG1lbnUgaXMgYWN0aXZlXG4gKiBAcmV0dXJucyB0cnVlIGlmIG1vYmlsZSBtZW51IGlzIGFjdGl2ZSBhbmQgZmFsc2UgaWYgbm90IGFjdGl2ZVxuICovXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XG5cbi8qKlxuICogVHJhcCBmb2N1cyBpbiBtb2JpbGUgbWVudSBpZiBhY3RpdmVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRyYXBDb250YWluZXIgXG4gKi9cbmNvbnN0IF9mb2N1c1RyYXAgPSAodHJhcENvbnRhaW5lcikgPT4ge1xuXG4gIC8vIEZpbmQgYWxsIGZvY3VzYWJsZSBjaGlsZHJlblxuICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSc7XG4gIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IHRyYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XG4gIGxldCBmaXJzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1sgMCBdO1xuXG4gIGZ1bmN0aW9uIHRyYXBUYWJLZXkgKGUpIHtcbiAgICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcbiAgICAvLyBDaGVjayBmb3IgVEFCIGtleSBwcmVzc1xuICAgIGlmIChrZXkgPT09IDkpIHtcblxuICAgICAgbGV0IGxhc3RUYWJTdG9wID0gbnVsbDtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGxldCBudW1iZXIgPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgICBsZXQgZWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzWyBudW1iZXIgLSBpIF07XG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoID4gMCAmJiBlbGVtZW50Lm9mZnNldEhlaWdodCA+IDApIHtcbiAgICAgICAgICBsYXN0VGFiU3RvcCA9IGVsZW1lbnQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU0hJRlQgKyBUQUJcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdFRhYlN0b3ApIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgbGFzdFRhYlN0b3AuZm9jdXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAvLyBUQUJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEVTQ0FQRVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVuYWJsZSAoKSB7XG4gICAgICAgIC8vIEZvY3VzIGZpcnN0IGNoaWxkXG4gICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xuICAgICAgLy8gTGlzdGVuIGZvciBhbmQgdHJhcCB0aGUga2V5Ym9hcmRcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcbiAgICB9LFxuXG4gICAgcmVsZWFzZSAoKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XG4gICAgfSxcbiAgfTtcbn07XG5cbmxldCBmb2N1c1RyYXA7XG5cbmNvbnN0IHRvZ2dsZU5hdiA9IGZ1bmN0aW9uIChhY3RpdmUpIHtcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gIGlmICh0eXBlb2YgYWN0aXZlICE9PSAnYm9vbGVhbicpIHtcbiAgICBhY3RpdmUgPSAhaXNBY3RpdmUoKTtcbiAgfVxuICBib2R5LmNsYXNzTGlzdC50b2dnbGUoQUNUSVZFX0NMQVNTLCBhY3RpdmUpO1xuXG4gIGZvckVhY2goc2VsZWN0KFRPR0dMRVMpLCBlbCA9PiB7XG4gICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShWSVNJQkxFX0NMQVNTLCBhY3RpdmUpO1xuICB9KTtcbiAgaWYgKGFjdGl2ZSkge1xuICAgIGZvY3VzVHJhcC5lbmFibGUoKTtcbiAgfSBlbHNlIHtcbiAgICBmb2N1c1RyYXAucmVsZWFzZSgpO1xuICB9XG5cbiAgY29uc3QgY2xvc2VCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcbiAgY29uc3QgbWVudUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihPUEVORVJTKTtcblxuICBpZiAoYWN0aXZlICYmIGNsb3NlQnV0dG9uKSB7XG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgYWN0aXZhdGVkLCBzbyBmb2N1cyBvbiB0aGUgY2xvc2UgYnV0dG9uLFxuICAgIC8vIHdoaWNoIGlzIGp1c3QgYmVmb3JlIGFsbCB0aGUgbmF2IGVsZW1lbnRzIGluIHRoZSB0YWIgb3JkZXIuXG4gICAgY2xvc2VCdXR0b24uZm9jdXMoKTtcbiAgfSBlbHNlIGlmICghYWN0aXZlICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGNsb3NlQnV0dG9uICYmXG4gICAgICAgICAgICAgbWVudUJ1dHRvbikge1xuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGRlYWN0aXZhdGVkLCBhbmQgZm9jdXMgd2FzIG9uIHRoZSBjbG9zZVxuICAgIC8vIGJ1dHRvbiwgd2hpY2ggaXMgbm8gbG9uZ2VyIHZpc2libGUuIFdlIGRvbid0IHdhbnQgdGhlIGZvY3VzIHRvXG4gICAgLy8gZGlzYXBwZWFyIGludG8gdGhlIHZvaWQsIHNvIGZvY3VzIG9uIHRoZSBtZW51IGJ1dHRvbiBpZiBpdCdzXG4gICAgLy8gdmlzaWJsZSAodGhpcyBtYXkgaGF2ZSBiZWVuIHdoYXQgdGhlIHVzZXIgd2FzIGp1c3QgZm9jdXNlZCBvbixcbiAgICAvLyBpZiB0aGV5IHRyaWdnZXJlZCB0aGUgbW9iaWxlIG5hdiBieSBtaXN0YWtlKS5cbiAgICBtZW51QnV0dG9uLmZvY3VzKCk7XG4gIH1cblxuICByZXR1cm4gYWN0aXZlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTmF2aWdhdGlvbjsiLCIndXNlIHN0cmljdCc7XG5jb25zdCBUT0dHTEVfQVRUUklCVVRFID0gJ2RhdGEtY29udHJvbHMnO1xuXG4vKipcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byByYWRpb2J1dHRvbiBjb2xsYXBzZSBsaXN0XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJFbGVtZW50IFxuICovXG5mdW5jdGlvbiBSYWRpb1RvZ2dsZUdyb3VwKGNvbnRhaW5lckVsZW1lbnQpe1xuICAgIHRoaXMucmFkaW9Hcm91cCA9IGNvbnRhaW5lckVsZW1lbnQ7XG4gICAgdGhpcy5yYWRpb0VscyA9IG51bGw7XG4gICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG59XG5cbi8qKlxuICogU2V0IGV2ZW50c1xuICovXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCl7XG4gICAgdGhpcy5yYWRpb0VscyA9IHRoaXMucmFkaW9Hcm91cC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKTtcbiAgICBpZih0aGlzLnJhZGlvRWxzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcmFkaW9idXR0b25zIGZvdW5kIGluIHJhZGlvYnV0dG9uIGdyb3VwLicpO1xuICAgIH1cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5yYWRpb0Vscy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciByYWRpbyA9IHRoaXMucmFkaW9FbHNbIGkgXTtcbiAgICAgICAgXG4gICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgZm9yKGxldCBhID0gMDsgYSA8IHRoYXQucmFkaW9FbHMubGVuZ3RoOyBhKysgKXtcbiAgICAgICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LnJhZGlvRWxzWyBhIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50b2dnbGUocmFkaW8pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBUb2dnbGUgcmFkaW9idXR0b24gY29udGVudFxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSByYWRpb0lucHV0RWxlbWVudCBcbiAqL1xuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKHJhZGlvSW5wdXRFbGVtZW50KXtcbiAgICB2YXIgY29udGVudElkID0gcmFkaW9JbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFRPR0dMRV9BVFRSSUJVVEUpO1xuICAgIGlmKGNvbnRlbnRJZCAhPT0gbnVsbCAmJiBjb250ZW50SWQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50SWQgIT09IFwiXCIpe1xuICAgICAgICB2YXIgY29udGVudEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRlbnRJZCk7XG4gICAgICAgIGlmKGNvbnRlbnRFbGVtZW50ID09PSBudWxsIHx8IGNvbnRlbnRFbGVtZW50ID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBwYW5lbCBlbGVtZW50LiBWZXJpZnkgdmFsdWUgb2YgYXR0cmlidXRlIGArIFRPR0dMRV9BVFRSSUJVVEUpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHJhZGlvSW5wdXRFbGVtZW50LmNoZWNrZWQpe1xuICAgICAgICAgICAgdGhpcy5leHBhbmQocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogRXhwYW5kIHJhZGlvIGJ1dHRvbiBjb250ZW50XG4gKiBAcGFyYW0ge30gcmFkaW9JbnB1dEVsZW1lbnQgUmFkaW8gSW5wdXQgZWxlbWVudFxuICogQHBhcmFtIHsqfSBjb250ZW50RWxlbWVudCBDb250ZW50IGVsZW1lbnRcbiAqL1xuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUuZXhwYW5kID0gZnVuY3Rpb24gKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCl7XG4gICAgaWYocmFkaW9JbnB1dEVsZW1lbnQgIT09IG51bGwgJiYgcmFkaW9JbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgY29udGVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMucmFkaW8uZXhwYW5kZWQnKTtcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xuICAgIH1cbn1cbi8qKlxuICogQ29sbGFwc2UgcmFkaW8gYnV0dG9uIGNvbnRlbnRcbiAqIEBwYXJhbSB7fSByYWRpb0lucHV0RWxlbWVudCBSYWRpbyBJbnB1dCBlbGVtZW50XG4gKiBAcGFyYW0geyp9IGNvbnRlbnRFbGVtZW50IENvbnRlbnQgZWxlbWVudFxuICovXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5jb2xsYXBzZSA9IGZ1bmN0aW9uKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCl7XG4gICAgaWYocmFkaW9JbnB1dEVsZW1lbnQgIT09IG51bGwgJiYgcmFkaW9JbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLnJhZGlvLmNvbGxhcHNlZCcpO1xuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaW9Ub2dnbGVHcm91cDsiLCIndXNlIHN0cmljdCc7XG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xuICBzaGlmdDogZmFsc2UsXG4gIGFsdDogZmFsc2UsXG4gIGN0cmw6IGZhbHNlLFxuICBjb21tYW5kOiBmYWxzZVxufTtcbi8qXG4qIFByZXZlbnRzIHRoZSB1c2VyIGZyb20gaW5wdXR0aW5nIGJhc2VkIG9uIGEgcmVnZXguXG4qIERvZXMgbm90IHdvcmsgdGhlIHNhbWUgd2F5IGFmIDxpbnB1dCBwYXR0ZXJuPVwiXCI+LCB0aGlzIHBhdHRlcm4gaXMgb25seSB1c2VkIGZvciB2YWxpZGF0aW9uLCBub3QgdG8gcHJldmVudCBpbnB1dC5cbiogVXNlY2FzZTogbnVtYmVyIGlucHV0IGZvciBkYXRlLWNvbXBvbmVudC5cbiogRXhhbXBsZSAtIG51bWJlciBvbmx5OiA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWlucHV0LXJlZ2V4PVwiXlxcZCokXCI+XG4qL1xuY2xhc3MgSW5wdXRSZWdleE1hc2sge1xuICBjb25zdHJ1Y3RvciAoZWxlbWVudCl7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIHJlZ2V4TWFzayk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgcmVnZXhNYXNrKTtcbiAgfVxufVxudmFyIHJlZ2V4TWFzayA9IGZ1bmN0aW9uIChldmVudCkge1xuICBpZihtb2RpZmllclN0YXRlLmN0cmwgfHwgbW9kaWZpZXJTdGF0ZS5jb21tYW5kKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdDaGFyID0gbnVsbDtcbiAgaWYodHlwZW9mIGV2ZW50LmtleSAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgIGlmKGV2ZW50LmtleS5sZW5ndGggPT09IDEpe1xuICAgICAgbmV3Q2hhciA9IGV2ZW50LmtleTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYoIWV2ZW50LmNoYXJDb2RlKXtcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmtleUNvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5jaGFyQ29kZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHJlZ2V4U3RyID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtcmVnZXgnKTtcblxuICBpZihldmVudC50eXBlICE9PSB1bmRlZmluZWQgJiYgZXZlbnQudHlwZSA9PT0gJ3Bhc3RlJyl7XG4gICAgLy9jb25zb2xlLmxvZygncGFzdGUnKTtcbiAgfSBlbHNle1xuICAgIHZhciBlbGVtZW50ID0gbnVsbDtcbiAgICBpZihldmVudC50YXJnZXQgIT09IHVuZGVmaW5lZCl7XG4gICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICAgIH1cbiAgICBpZihuZXdDaGFyICE9PSBudWxsICYmIGVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgIGlmKG5ld0NoYXIubGVuZ3RoID4gMCl7XG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIGlmKGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcicpe1xuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQpICsgdGhpcy52YWx1ZS5zbGljZShlbGVtZW50LnNlbGVjdGlvbkVuZCkgKyBuZXdDaGFyOyAvL3JlbW92ZXMgdGhlIG51bWJlcnMgc2VsZWN0ZWQgYnkgdGhlIHVzZXIsIHRoZW4gYWRkcyBuZXcgY2hhci5cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByID0gbmV3IFJlZ0V4cChyZWdleFN0cik7XG4gICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xuICAgICAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IElucHV0UmVnZXhNYXNrOyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7SFRNTFRhYmxlRWxlbWVudH0gdGFibGUgVGFibGUgRWxlbWVudFxuICovXG5mdW5jdGlvbiBUYWJsZVNlbGVjdGFibGVSb3dzICh0YWJsZSkge1xuICB0aGlzLnRhYmxlID0gdGFibGU7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBldmVudGxpc3RlbmVycyBmb3IgY2hlY2tib3hlcyBpbiB0YWJsZVxuICovXG5UYWJsZVNlbGVjdGFibGVSb3dzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5ncm91cENoZWNrYm94ID0gdGhpcy5nZXRHcm91cENoZWNrYm94KCk7XG4gIHRoaXMudGJvZHlDaGVja2JveExpc3QgPSB0aGlzLmdldENoZWNrYm94TGlzdCgpO1xuICBpZih0aGlzLnRib2R5Q2hlY2tib3hMaXN0Lmxlbmd0aCAhPT0gMCl7XG4gICAgZm9yKGxldCBjID0gMDsgYyA8IHRoaXMudGJvZHlDaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xuICAgICAgbGV0IGNoZWNrYm94ID0gdGhpcy50Ym9keUNoZWNrYm94TGlzdFtjXTtcbiAgICAgIGNoZWNrYm94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUdyb3VwQ2hlY2spO1xuICAgICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlR3JvdXBDaGVjayk7XG4gICAgfVxuICB9XG4gIGlmKHRoaXMuZ3JvdXBDaGVja2JveCAhPT0gZmFsc2Upe1xuICAgIHRoaXMuZ3JvdXBDaGVja2JveC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVDaGVja2JveExpc3QpO1xuICAgIHRoaXMuZ3JvdXBDaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVDaGVja2JveExpc3QpO1xuICB9XG59XG4gIFxuLyoqXG4gKiBHZXQgZ3JvdXAgY2hlY2tib3ggaW4gdGFibGUgaGVhZGVyXG4gKiBAcmV0dXJucyBlbGVtZW50IG9uIHRydWUgLSBmYWxzZSBpZiBub3QgZm91bmRcbiAqL1xuVGFibGVTZWxlY3RhYmxlUm93cy5wcm90b3R5cGUuZ2V0R3JvdXBDaGVja2JveCA9IGZ1bmN0aW9uKCl7XG4gIGxldCBjaGVja2JveCA9IHRoaXMudGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoZWFkJylbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1jaGVja2JveCcpO1xuICBpZihjaGVja2JveC5sZW5ndGggPT09IDApe1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gY2hlY2tib3hbMF07XG59XG4vKipcbiAqIEdldCB0YWJsZSBib2R5IGNoZWNrYm94ZXNcbiAqIEByZXR1cm5zIEhUTUxDb2xsZWN0aW9uXG4gKi9cblRhYmxlU2VsZWN0YWJsZVJvd3MucHJvdG90eXBlLmdldENoZWNrYm94TGlzdCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0aGlzLnRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0Ym9keScpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0tY2hlY2tib3gnKTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgY2hlY2tib3hlcyBpbiB0YWJsZSBib2R5IHdoZW4gZ3JvdXAgY2hlY2tib3ggaXMgY2hhbmdlZFxuICogQHBhcmFtIHtFdmVudH0gZSBcbiAqL1xuZnVuY3Rpb24gdXBkYXRlQ2hlY2tib3hMaXN0KGUpe1xuICBsZXQgY2hlY2tib3ggPSBlLnRhcmdldDtcbiAgY2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcbiAgbGV0IHRhYmxlID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgbGV0IHRhYmxlU2VsZWN0YWJsZVJvd3MgPSBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyh0YWJsZSk7XG4gIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xuICBsZXQgY2hlY2tlZE51bWJlciA9IDA7XG4gIGlmKGNoZWNrYm94LmNoZWNrZWQpe1xuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xuICAgICAgY2hlY2tib3hMaXN0W2NdLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgY2hlY2tib3hMaXN0W2NdLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcbiAgICB9XG5cbiAgICBjaGVja2VkTnVtYmVyID0gY2hlY2tib3hMaXN0Lmxlbmd0aDtcbiAgfSBlbHNle1xuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xuICAgICAgY2hlY2tib3hMaXN0W2NdLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgndGFibGUtcm93LXNlbGVjdGVkJyk7XG4gICAgfVxuICB9XG4gIFxuICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImZkcy50YWJsZS5zZWxlY3RhYmxlLnVwZGF0ZWRcIiwge1xuICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICBkZXRhaWw6IHtjaGVja2VkTnVtYmVyfVxuICB9KTtcbiAgdGFibGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG5cbi8qKlxuICogVXBkYXRlIGdyb3VwIGNoZWNrYm94IHdoZW4gY2hlY2tib3ggaW4gdGFibGUgYm9keSBpcyBjaGFuZ2VkXG4gKiBAcGFyYW0ge0V2ZW50fSBlIFxuICovXG5mdW5jdGlvbiB1cGRhdGVHcm91cENoZWNrKGUpe1xuICAvLyB1cGRhdGUgbGFiZWwgZm9yIGV2ZW50IGNoZWNrYm94XG4gIGlmKGUudGFyZ2V0LmNoZWNrZWQpe1xuICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcbiAgfSBlbHNle1xuICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcbiAgfVxuICBsZXQgdGFibGUgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICBsZXQgdGFibGVTZWxlY3RhYmxlUm93cyA9IG5ldyBUYWJsZVNlbGVjdGFibGVSb3dzKHRhYmxlKTtcbiAgbGV0IGdyb3VwQ2hlY2tib3ggPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldEdyb3VwQ2hlY2tib3goKTtcbiAgaWYoZ3JvdXBDaGVja2JveCAhPT0gZmFsc2Upe1xuICAgIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xuXG4gICAgLy8gaG93IG1hbnkgcm93IGhhcyBiZWVuIHNlbGVjdGVkXG4gICAgbGV0IGNoZWNrZWROdW1iZXIgPSAwO1xuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xuICAgICAgbGV0IGxvb3BlZENoZWNrYm94ID0gY2hlY2tib3hMaXN0W2NdO1xuICAgICAgaWYobG9vcGVkQ2hlY2tib3guY2hlY2tlZCl7XG4gICAgICAgIGNoZWNrZWROdW1iZXIrKztcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYoY2hlY2tlZE51bWJlciA9PT0gY2hlY2tib3hMaXN0Lmxlbmd0aCl7IC8vIGlmIGFsbCByb3dzIGhhcyBiZWVuIHNlbGVjdGVkXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XG4gICAgICBncm91cENoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZihjaGVja2VkTnVtYmVyID09IDApeyAvLyBpZiBubyByb3dzIGhhcyBiZWVuIHNlbGVjdGVkXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XG4gICAgICBncm91cENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcbiAgICB9IGVsc2V7IC8vIGlmIHNvbWUgYnV0IG5vdCBhbGwgcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxuICAgICAgZ3JvdXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcsICdtaXhlZCcpO1xuICAgICAgZ3JvdXBDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZmRzLnRhYmxlLnNlbGVjdGFibGUudXBkYXRlZFwiLCB7XG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgIGRldGFpbDoge2NoZWNrZWROdW1iZXJ9XG4gICAgfSk7XG4gICAgdGFibGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGFibGVTZWxlY3RhYmxlUm93czsiLCJjb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcblxuLyoqXG4gKiBTZXQgZGF0YS10aXRsZSBvbiBjZWxscywgd2hlcmUgdGhlIGF0dHJpYnV0ZSBpcyBtaXNzaW5nXG4gKi9cbmNsYXNzIFJlc3BvbnNpdmVUYWJsZSB7XG4gICAgY29uc3RydWN0b3IodGFibGUpIHtcbiAgICAgICAgaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzKHRhYmxlKTtcbiAgICB9XG59XG5cbi8qKlxuICogQWRkIGRhdGEgYXR0cmlidXRlcyBuZWVkZWQgZm9yIHJlc3BvbnNpdmUgbW9kZS5cbiAqIEBwYXJhbSB7SFRNTFRhYmxlRWxlbWVudH0gdGFibGVFbCBUYWJsZSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZUVsKSB7XG4gICAgaWYgKCF0YWJsZUVsKSByZXR1cm47XG5cbiAgICBsZXQgaGVhZGVyID0gdGFibGVFbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKTtcbiAgICBpZiAoaGVhZGVyLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBsZXQgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGgnKTtcbiAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGhlYWRlckNlbGxFbHMgPSBoZWFkZXJbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGVhZGVyQ2VsbEVscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBib2R5Um93RWxzID0gc2VsZWN0KCd0Ym9keSB0cicsIHRhYmxlRWwpO1xuICAgICAgICAgICAgQXJyYXkuZnJvbShib2R5Um93RWxzKS5mb3JFYWNoKHJvd0VsID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbEVscyA9IHJvd0VsLmNoaWxkcmVuO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsRWxzLmxlbmd0aCA9PT0gaGVhZGVyQ2VsbEVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShoZWFkZXJDZWxsRWxzKS5mb3JFYWNoKChoZWFkZXJDZWxsRWwsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdyYWIgaGVhZGVyIGNlbGwgdGV4dCBhbmQgdXNlIGl0IGJvZHkgY2VsbCBkYXRhIHRpdGxlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjZWxsRWxzW2ldLmhhc0F0dHJpYnV0ZSgnZGF0YS10aXRsZScpICYmIGhlYWRlckNlbGxFbC50YWdOYW1lID09PSBcIlRIXCIgJiYgIWhlYWRlckNlbGxFbC5jbGFzc0xpc3QuY29udGFpbnMoXCJzci1oZWFkZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsRWxzW2ldLnNldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScsIGhlYWRlckNlbGxFbC50ZXh0Q29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zaXZlVGFibGU7XG4iLCIndXNlIHN0cmljdCc7XG5sZXQgYnJlYWtwb2ludHMgPSB7XG4gICd4cyc6IDAsXG4gICdzbSc6IDU3NixcbiAgJ21kJzogNzY4LFxuICAnbGcnOiA5OTIsXG4gICd4bCc6IDEyMDBcbn07XG5cbi8vIEZvciBlYXN5IHJlZmVyZW5jZVxudmFyIGtleXMgPSB7XG4gIGVuZDogMzUsXG4gIGhvbWU6IDM2LFxuICBsZWZ0OiAzNyxcbiAgdXA6IDM4LFxuICByaWdodDogMzksXG4gIGRvd246IDQwLFxuICBkZWxldGU6IDQ2XG59O1xuXG4vLyBBZGQgb3Igc3Vic3RyYWN0IGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxudmFyIGRpcmVjdGlvbiA9IHtcbiAgMzc6IC0xLFxuICAzODogLTEsXG4gIDM5OiAxLFxuICA0MDogMVxufTtcblxuLyoqXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byB0YWJuYXYgY29tcG9uZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YWJuYXYgVGFibmF2IGNvbnRhaW5lclxuICovXG5mdW5jdGlvbiBUYWJuYXYgKHRhYm5hdikge1xuICB0aGlzLnRhYm5hdiA9IHRhYm5hdjtcbiAgdGhpcy50YWJzID0gdGhpcy50YWJuYXYucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLnRhYm5hdi1pdGVtJyk7XG59XG5cbi8qKlxuICogU2V0IGV2ZW50IG9uIGNvbXBvbmVudFxuICovXG5UYWJuYXYucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICBpZih0aGlzLnRhYnMubGVuZ3RoID09PSAwKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRhYm5hdiBIVE1MIHNlZW1zIHRvIGJlIG1pc3NpbmcgdGFibmF2LWl0ZW0uIEFkZCB0YWJuYXYgaXRlbXMgdG8gZW5zdXJlIGVhY2ggcGFuZWwgaGFzIGEgYnV0dG9uIGluIHRoZSB0YWJuYXZzIG5hdmlnYXRpb24uYCk7XG4gIH1cblxuICAvLyBpZiBubyBoYXNoIGlzIHNldCBvbiBsb2FkLCBzZXQgYWN0aXZlIHRhYlxuICBpZiAoIXNldEFjdGl2ZUhhc2hUYWIoKSkge1xuICAgIC8vIHNldCBmaXJzdCB0YWIgYXMgYWN0aXZlXG4gICAgbGV0IHRhYiA9IHRoaXMudGFic1sgMCBdO1xuXG4gICAgLy8gY2hlY2sgbm8gb3RoZXIgdGFicyBhcyBiZWVuIHNldCBhdCBkZWZhdWx0XG4gICAgbGV0IGFscmVhZHlBY3RpdmUgPSBnZXRBY3RpdmVUYWJzKHRoaXMudGFibmF2KTtcbiAgICBpZiAoYWxyZWFkeUFjdGl2ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRhYiA9IGFscmVhZHlBY3RpdmVbIDAgXTtcbiAgICB9XG5cbiAgICAvLyBhY3RpdmF0ZSBhbmQgZGVhY3RpdmF0ZSB0YWJzXG4gICAgdGhpcy5hY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcbiAgfVxuICBsZXQgJG1vZHVsZSA9IHRoaXM7XG4gIC8vIGFkZCBldmVudGxpc3RlbmVycyBvbiBidXR0b25zXG4gIGZvcihsZXQgdCA9IDA7IHQgPCB0aGlzLnRhYnMubGVuZ3RoOyB0ICsrKXtcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7JG1vZHVsZS5hY3RpdmF0ZVRhYih0aGlzLCBmYWxzZSl9KTtcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bkV2ZW50TGlzdGVuZXIpO1xuICAgIHRoaXMudGFic1sgdCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXBFdmVudExpc3RlbmVyKTtcbiAgfVxufVxuXG4vKioqXG4gKiBTaG93IHRhYiBhbmQgaGlkZSBvdGhlcnNcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHRhYiBidXR0b24gZWxlbWVudFxuICogQHBhcmFtIHtib29sZWFufSBzZXRGb2N1cyBUcnVlIGlmIHRhYiBidXR0b24gc2hvdWxkIGJlIGZvY3VzZWRcbiAqL1xuIFRhYm5hdi5wcm90b3R5cGUuYWN0aXZhdGVUYWIgPSBmdW5jdGlvbih0YWIsIHNldEZvY3VzKSB7XG4gIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YWIpO1xuXG4gIC8vIGNsb3NlIGFsbCB0YWJzIGV4Y2VwdCBzZWxlY3RlZFxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0YWJzWyBpIF0gPT09IHRhYikge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHRhYnNbIGkgXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnKSB7XG4gICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5jbG9zZScpO1xuICAgICAgdGFic1sgaSBdLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XG4gICAgfVxuXG4gICAgdGFic1sgaSBdLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICB0YWJzWyBpIF0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XG4gICAgbGV0IHRhYnBhbmVsSUQgPSB0YWJzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XG4gICAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRClcbiAgICBpZih0YWJwYW5lbCA9PT0gbnVsbCl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHRhYnBhbmVsLmApO1xuICAgIH1cbiAgICB0YWJwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgfVxuICBcbiAgLy8gU2V0IHNlbGVjdGVkIHRhYiB0byBhY3RpdmVcbiAgbGV0IHRhYnBhbmVsSUQgPSB0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XG4gIGxldCB0YWJwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhYnBhbmVsSUQpO1xuICBpZih0YWJwYW5lbCA9PT0gbnVsbCl7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY2NvcmRpb24gcGFuZWwuYCk7XG4gIH1cblxuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcbiAgdGFicGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICB0YWIucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuXG4gIC8vIFNldCBmb2N1cyB3aGVuIHJlcXVpcmVkXG4gIGlmIChzZXRGb2N1cykge1xuICAgIHRhYi5mb2N1cygpO1xuICB9XG5cbiAgbGV0IGV2ZW50Q2hhbmdlZCA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5jaGFuZ2VkJyk7XG4gIHRhYi5wYXJlbnROb2RlLmRpc3BhdGNoRXZlbnQoZXZlbnRDaGFuZ2VkKTtcblxuICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMudGFibmF2Lm9wZW4nKTtcbiAgdGFiLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcbn1cblxuLyoqXG4gKiBBZGQga2V5ZG93biBldmVudHMgdG8gdGFibmF2IGNvbXBvbmVudFxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcbiAqL1xuZnVuY3Rpb24ga2V5ZG93bkV2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xuXG4gIHN3aXRjaCAoa2V5KSB7XG4gICAgY2FzZSBrZXlzLmVuZDpcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBBY3RpdmF0ZSBsYXN0IHRhYlxuICAgICAgZm9jdXNMYXN0VGFiKGV2ZW50LnRhcmdldCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGtleXMuaG9tZTpcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBBY3RpdmF0ZSBmaXJzdCB0YWJcbiAgICAgIGZvY3VzRmlyc3RUYWIoZXZlbnQudGFyZ2V0KTtcbiAgICAgIGJyZWFrO1xuICAgIC8vIFVwIGFuZCBkb3duIGFyZSBpbiBrZXlkb3duXG4gICAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIHByZXZlbnQgcGFnZSBzY3JvbGwgPjopXG4gICAgY2FzZSBrZXlzLnVwOlxuICAgIGNhc2Uga2V5cy5kb3duOlxuICAgICAgZGV0ZXJtaW5lT3JpZW50YXRpb24oZXZlbnQpO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGQga2V5dXAgZXZlbnRzIHRvIHRhYm5hdiBjb21wb25lbnRcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIGtleXVwRXZlbnRMaXN0ZW5lciAoZXZlbnQpIHtcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XG5cbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlIGtleXMubGVmdDpcbiAgICBjYXNlIGtleXMucmlnaHQ6XG4gICAgICBkZXRlcm1pbmVPcmllbnRhdGlvbihldmVudCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGtleXMuZGVsZXRlOlxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBrZXlzLmVudGVyOlxuICAgIGNhc2Uga2V5cy5zcGFjZTpcbiAgICAgIG5ldyBUYWJuYXYoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpLmFjdGl2YXRlVGFiKGV2ZW50LnRhcmdldCwgdHJ1ZSk7XG4gICAgICBicmVhaztcbiAgfVxufVxuXG4vKipcbiAqIFdoZW4gYSB0YWJsaXN0IGFyaWEtb3JpZW50YXRpb24gaXMgc2V0IHRvIHZlcnRpY2FsLFxuICogb25seSB1cCBhbmQgZG93biBhcnJvdyBzaG91bGQgZnVuY3Rpb24uXG4gKiBJbiBhbGwgb3RoZXIgY2FzZXMgb25seSBsZWZ0IGFuZCByaWdodCBhcnJvdyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gZGV0ZXJtaW5lT3JpZW50YXRpb24gKGV2ZW50KSB7XG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xuXG4gIGxldCB3PXdpbmRvdyxcbiAgICBkPWRvY3VtZW50LFxuICAgIGU9ZC5kb2N1bWVudEVsZW1lbnQsXG4gICAgZz1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXSxcbiAgICB4PXcuaW5uZXJXaWR0aHx8ZS5jbGllbnRXaWR0aHx8Zy5jbGllbnRXaWR0aCxcbiAgICB5PXcuaW5uZXJIZWlnaHR8fGUuY2xpZW50SGVpZ2h0fHxnLmNsaWVudEhlaWdodDtcblxuICBsZXQgdmVydGljYWwgPSB4IDwgYnJlYWtwb2ludHMubWQ7XG4gIGxldCBwcm9jZWVkID0gZmFsc2U7XG5cbiAgaWYgKHZlcnRpY2FsKSB7XG4gICAgaWYgKGtleSA9PT0ga2V5cy51cCB8fCBrZXkgPT09IGtleXMuZG93bikge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHByb2NlZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoa2V5ID09PSBrZXlzLmxlZnQgfHwga2V5ID09PSBrZXlzLnJpZ2h0KSB7XG4gICAgICBwcm9jZWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgaWYgKHByb2NlZWQpIHtcbiAgICBzd2l0Y2hUYWJPbkFycm93UHJlc3MoZXZlbnQpO1xuICB9XG59XG5cbi8qKlxuICogRWl0aGVyIGZvY3VzIHRoZSBuZXh0LCBwcmV2aW91cywgZmlyc3QsIG9yIGxhc3QgdGFiXG4gKiBkZXBlbmRpbmcgb24ga2V5IHByZXNzZWRcbiAqL1xuZnVuY3Rpb24gc3dpdGNoVGFiT25BcnJvd1ByZXNzIChldmVudCkge1xuICB2YXIgcHJlc3NlZCA9IGV2ZW50LmtleUNvZGU7XG4gIGlmIChkaXJlY3Rpb25bIHByZXNzZWQgXSkge1xuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhcmdldCk7XG4gICAgbGV0IGluZGV4ID0gZ2V0SW5kZXhPZkVsZW1lbnRJbkxpc3QodGFyZ2V0LCB0YWJzKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBpZiAodGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdKSB7XG4gICAgICAgIHRhYnNbIGluZGV4ICsgZGlyZWN0aW9uWyBwcmVzc2VkIF0gXS5mb2N1cygpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocHJlc3NlZCA9PT0ga2V5cy5sZWZ0IHx8IHByZXNzZWQgPT09IGtleXMudXApIHtcbiAgICAgICAgZm9jdXNMYXN0VGFiKHRhcmdldCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLnJpZ2h0IHx8IHByZXNzZWQgPT0ga2V5cy5kb3duKSB7XG4gICAgICAgIGZvY3VzRmlyc3RUYWIodGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgYWxsIGFjdGl2ZSB0YWJzIGluIGxpc3RcbiAqIEBwYXJhbSB0YWJuYXYgcGFyZW50IC50YWJuYXYgZWxlbWVudFxuICogQHJldHVybnMgcmV0dXJucyBsaXN0IG9mIGFjdGl2ZSB0YWJzIGlmIGFueVxuICovXG5mdW5jdGlvbiBnZXRBY3RpdmVUYWJzICh0YWJuYXYpIHtcbiAgcmV0dXJuIHRhYm5hdi5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1zZWxlY3RlZD10cnVlXScpO1xufVxuXG4vKipcbiAqIEdldCBhIGxpc3Qgb2YgYWxsIGJ1dHRvbiB0YWJzIGluIGN1cnJlbnQgdGFibGlzdFxuICogQHBhcmFtIHRhYiBCdXR0b24gdGFiIGVsZW1lbnRcbiAqIEByZXR1cm5zIHsqfSByZXR1cm4gYXJyYXkgb2YgdGFic1xuICovXG5mdW5jdGlvbiBnZXRBbGxUYWJzSW5MaXN0ICh0YWIpIHtcbiAgbGV0IHBhcmVudE5vZGUgPSB0YWIucGFyZW50Tm9kZTtcbiAgaWYgKHBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWJuYXYnKSkge1xuICAgIHJldHVybiBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xuICB9XG4gIHJldHVybiBbXTtcbn1cblxuLyoqXG4gKiBHZXQgaW5kZXggb2YgZWxlbWVudCBpbiBsaXN0XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFxuICogQHBhcmFtIHtIVE1MQ29sbGVjdGlvbn0gbGlzdCBcbiAqIEByZXR1cm5zIHtpbmRleH1cbiAqL1xuZnVuY3Rpb24gZ2V0SW5kZXhPZkVsZW1lbnRJbkxpc3QgKGVsZW1lbnQsIGxpc3Qpe1xuICBsZXQgaW5kZXggPSAtMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrICl7XG4gICAgaWYobGlzdFsgaSBdID09PSBlbGVtZW50KXtcbiAgICAgIGluZGV4ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlcmUgaXMgYSB0YWIgaGFzaCBpbiB0aGUgdXJsIGFuZCBhY3RpdmF0ZXMgdGhlIHRhYiBhY2NvcmRpbmdseVxuICogQHJldHVybnMge2Jvb2xlYW59IHJldHVybnMgdHJ1ZSBpZiB0YWIgaGFzIGJlZW4gc2V0IC0gcmV0dXJucyBmYWxzZSBpZiBubyB0YWIgaGFzIGJlZW4gc2V0IHRvIGFjdGl2ZVxuICovXG5mdW5jdGlvbiBzZXRBY3RpdmVIYXNoVGFiICgpIHtcbiAgbGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XG4gIGlmIChoYXNoICE9PSAnJykge1xuICAgIGxldCB0YWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1jb250cm9scz1cIiMnICsgaGFzaCArICdcIl0nKTtcbiAgICBpZiAodGFiICE9PSBudWxsKSB7XG4gICAgICBhY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogR2V0IGZpcnN0IHRhYiBieSB0YWIgaW4gbGlzdFxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gdGFiIFxuICovXG5mdW5jdGlvbiBmb2N1c0ZpcnN0VGFiICh0YWIpIHtcbiAgZ2V0QWxsVGFic0luTGlzdCh0YWIpWyAwIF0uZm9jdXMoKTtcbn1cblxuLyoqXG4gKiBHZXQgbGFzdCB0YWIgYnkgdGFiIGluIGxpc3RcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHRhYiBcbiAqL1xuZnVuY3Rpb24gZm9jdXNMYXN0VGFiICh0YWIpIHtcbiAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhYik7XG4gIHRhYnNbIHRhYnMubGVuZ3RoIC0gMSBdLmZvY3VzKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhYm5hdjsiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIFNob3cvaGlkZSB0b2FzdCBjb21wb25lbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgXG4gKi9cbmZ1bmN0aW9uIFRvYXN0IChlbGVtZW50KXtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xufVxuXG4vKipcbiAqIFNob3cgdG9hc3RcbiAqL1xuVG9hc3QucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3dpbmcnKTtcbiAgICB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9hc3QtY2xvc2UnKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGxldCB0b2FzdCA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBuZXcgVG9hc3QodG9hc3QpLmhpZGUoKTtcbiAgICB9KTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc2hvd1RvYXN0KTtcbn1cblxuLyoqXG4gKiBIaWRlIHRvYXN0XG4gKi9cblRvYXN0LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7ICAgICAgICAgXG59XG5cbi8qKlxuICogQWRkcyBjbGFzc2VzIHRvIG1ha2Ugc2hvdyBhbmltYXRpb25cbiAqL1xuZnVuY3Rpb24gc2hvd1RvYXN0KCl7XG4gICAgbGV0IHRvYXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b2FzdC5zaG93aW5nJyk7XG4gICAgZm9yKGxldCB0ID0gMDsgdCA8IHRvYXN0cy5sZW5ndGg7IHQrKyl7XG4gICAgICAgIGxldCB0b2FzdCA9IHRvYXN0c1t0XTtcbiAgICAgICAgdG9hc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvd2luZycpO1xuICAgICAgICB0b2FzdC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUb2FzdDsiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIFNldCB0b29sdGlwIG9uIGVsZW1lbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aGljaCBoYXMgdG9vbHRpcFxuICovXG5mdW5jdGlvbiBUb29sdGlwKGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIGlmICh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKSA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRvb2x0aXAgdGV4dCBpcyBtaXNzaW5nLiBBZGQgYXR0cmlidXRlIGRhdGEtdG9vbHRpcCBhbmQgdGhlIGNvbnRlbnQgb2YgdGhlIHRvb2x0aXAgYXMgdmFsdWUuYCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFNldCBldmVudGxpc3RlbmVyc1xuICovXG5Ub29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBtb2R1bGUgPSB0aGlzO1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBlLnRhcmdldDtcbiAgICAgICAgaWYgKHRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwLWhvdmVyJykgPT09IGZhbHNlICYmIHRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwLWZvY3VzJykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjbG9zZUFsbFRvb2x0aXBzKGUpO1xuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QuYWRkKFwidG9vbHRpcC1ob3ZlclwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0cmlnZ2VyLmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1ob3ZlcicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JykgIT09IG51bGwpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9vbHRpcChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGxldCB0cmlnZ2VyID0gZS50YXJnZXQ7XG4gICAgICAgIGlmICh0cmlnZ2VyLmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1ob3ZlcicpKSB7XG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcbiAgICAgICAgICAgIHZhciB0b29sdGlwSWQgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgICAgICAgbGV0IHRvb2x0aXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcbiAgICAgICAgICAgIGlmICh0b29sdGlwRWxlbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNsb3NlSG92ZXJUb29sdGlwKHRyaWdnZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XG4gICAgICAgIGlmIChrZXkgPT09IDI3KSB7XG4gICAgICAgICAgICB2YXIgdG9vbHRpcCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICAgICAgICBpZiAodG9vbHRpcCAhPT0gbnVsbCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtdHJpZ2dlcicpID09PSAnY2xpY2snKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgY2xvc2VBbGxUb29sdGlwcyhlKTtcbiAgICAgICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LmFkZCgndG9vbHRpcC1mb2N1cycpO1xuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XG4gICAgICAgICAgICBpZiAodHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSAhPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICAgICAgYWRkVG9vbHRpcCh0cmlnZ2VyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlQWxsVG9vbHRpcHMpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUFsbFRvb2x0aXBzKTtcbn07XG5cbi8qKlxuICogQ2xvc2UgYWxsIHRvb2x0aXBzXG4gKi9cbmZ1bmN0aW9uIGNsb3NlQWxsKCkge1xuICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy10b29sdGlwW2FyaWEtZGVzY3JpYmVkYnldJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcG9wcGVyID0gZWxlbWVudHNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICAgIGVsZW1lbnRzW2ldLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHBlcikpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkVG9vbHRpcCh0cmlnZ2VyKSB7XG4gICAgdmFyIHBvcyA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcblxuICAgIHZhciB0b29sdGlwID0gY3JlYXRlVG9vbHRpcCh0cmlnZ2VyLCBwb3MpO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b29sdGlwKTtcblxuICAgIHBvc2l0aW9uQXQodHJpZ2dlciwgdG9vbHRpcCwgcG9zKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgdG9vbHRpcCBlbGVtZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2hpY2ggdGhlIHRvb2x0aXAgaXMgYXR0YWNoZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3MgUG9zaXRpb24gb2YgdG9vbHRpcCAodG9wIHwgYm90dG9tKVxuICogQHJldHVybnMgXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXAoZWxlbWVudCwgcG9zKSB7XG4gICAgdmFyIHRvb2x0aXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9ICd0b29sdGlwLXBvcHBlcic7XG4gICAgdmFyIHBvcHBlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLXBvcHBlcicpO1xuICAgIHZhciBpZCA9ICd0b29sdGlwLScgKyBwb3BwZXJzLmxlbmd0aCArIDE7XG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnLCBwb3MpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWQpO1xuXG4gICAgdmFyIHRvb2x0aXBJbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRvb2x0aXBJbm5lci5jbGFzc05hbWUgPSAndG9vbHRpcCc7XG5cbiAgICB2YXIgdG9vbHRpcEFycm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdG9vbHRpcEFycm93LmNsYXNzTmFtZSA9ICd0b29sdGlwLWFycm93JztcbiAgICB0b29sdGlwSW5uZXIuYXBwZW5kQ2hpbGQodG9vbHRpcEFycm93KTtcblxuICAgIHZhciB0b29sdGlwQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRvb2x0aXBDb250ZW50LmNsYXNzTmFtZSA9ICd0b29sdGlwLWNvbnRlbnQnO1xuICAgIHRvb2x0aXBDb250ZW50LmlubmVySFRNTCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKTtcbiAgICB0b29sdGlwSW5uZXIuYXBwZW5kQ2hpbGQodG9vbHRpcENvbnRlbnQpO1xuICAgIHRvb2x0aXAuYXBwZW5kQ2hpbGQodG9vbHRpcElubmVyKTtcblxuICAgIHJldHVybiB0b29sdGlwO1xufVxuXG5cbi8qKlxuICogUG9zaXRpb25zIHRoZSB0b29sdGlwLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnQgLSBUaGUgdHJpZ2dlciBvZiB0aGUgdG9vbHRpcC5cbiAqIEBwYXJhbSB7b2JqZWN0fSB0b29sdGlwIC0gVGhlIHRvb2x0aXAgaXRzZWxmLlxuICogQHBhcmFtIHtzdHJpbmd9IHBvc0hvcml6b250YWwgLSBEZXNpcmVkIGhvcml6b250YWwgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgcmVsYXRpdmVseSB0byB0aGUgdHJpZ2dlciAobGVmdC9jZW50ZXIvcmlnaHQpXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9zVmVydGljYWwgLSBEZXNpcmVkIHZlcnRpY2FsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKHRvcC9jZW50ZXIvYm90dG9tKVxuICpcbiAqL1xuZnVuY3Rpb24gcG9zaXRpb25BdChwYXJlbnQsIHRvb2x0aXAsIHBvcykge1xuICAgIGxldCB0cmlnZ2VyID0gcGFyZW50O1xuICAgIGxldCBhcnJvdyA9IHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdO1xuICAgIGxldCB0cmlnZ2VyUG9zaXRpb24gPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICB2YXIgcGFyZW50Q29vcmRzID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBsZWZ0LCB0b3A7XG5cbiAgICB2YXIgdG9vbHRpcFdpZHRoID0gdG9vbHRpcC5vZmZzZXRXaWR0aDtcblxuICAgIHZhciBkaXN0ID0gMTI7XG4gICAgbGV0IGFycm93RGlyZWN0aW9uID0gXCJkb3duXCI7XG4gICAgbGVmdCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5sZWZ0KSArICgocGFyZW50Lm9mZnNldFdpZHRoIC0gdG9vbHRpcC5vZmZzZXRXaWR0aCkgLyAyKTtcblxuICAgIHN3aXRjaCAocG9zKSB7XG4gICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3Q7XG4gICAgICAgICAgICBhcnJvd0RpcmVjdGlvbiA9IFwidXBcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcbiAgICB9XG5cbiAgICAvLyBpZiB0b29sdGlwIGlzIG91dCBvZiBib3VuZHMgb24gbGVmdCBzaWRlXG4gICAgaWYgKGxlZnQgPCAwKSB7XG4gICAgICAgIGxlZnQgPSBkaXN0O1xuICAgICAgICBsZXQgZW5kUG9zaXRpb25PblBhZ2UgPSB0cmlnZ2VyUG9zaXRpb24ubGVmdCArICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XG4gICAgICAgIGxldCB0b29sdGlwQXJyb3dIYWxmV2lkdGggPSA4O1xuICAgICAgICBsZXQgYXJyb3dMZWZ0UG9zaXRpb24gPSBlbmRQb3NpdGlvbk9uUGFnZSAtIGRpc3QgLSB0b29sdGlwQXJyb3dIYWxmV2lkdGg7XG4gICAgICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLmxlZnQgPSBhcnJvd0xlZnRQb3NpdGlvbiArICdweCc7XG4gICAgfVxuXG4gICAgLy8gaWYgdG9vbHRpcCBpcyBvdXQgb2YgYm91bmRzIG9uIHRoZSBib3R0b20gb2YgdGhlIHBhZ2VcbiAgICBpZiAoKHRvcCArIHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSA+PSB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLnRvcCkgLSB0b29sdGlwLm9mZnNldEhlaWdodCAtIGRpc3Q7XG4gICAgICAgIGFycm93RGlyZWN0aW9uID0gXCJkb3duXCI7XG4gICAgfVxuXG4gICAgLy8gaWYgdG9vbHRpcCBpcyBvdXQgb2YgYm91bmRzIG9uIHRoZSB0b3Agb2YgdGhlIHBhZ2VcbiAgICBpZiAodG9wIDwgMCkge1xuICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3Q7XG4gICAgICAgIGFycm93RGlyZWN0aW9uID0gXCJ1cFwiO1xuICAgIH1cblxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IChsZWZ0ICsgdG9vbHRpcFdpZHRoKSkge1xuICAgICAgICB0b29sdGlwLnN0eWxlLnJpZ2h0ID0gZGlzdCArICdweCc7XG4gICAgICAgIGxldCBlbmRQb3NpdGlvbk9uUGFnZSA9IHRyaWdnZXJQb3NpdGlvbi5yaWdodCAtICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XG4gICAgICAgIGxldCB0b29sdGlwQXJyb3dIYWxmV2lkdGggPSA4O1xuICAgICAgICBsZXQgYXJyb3dSaWdodFBvc2l0aW9uID0gd2luZG93LmlubmVyV2lkdGggLSBlbmRQb3NpdGlvbk9uUGFnZSAtIGRpc3QgLSB0b29sdGlwQXJyb3dIYWxmV2lkdGg7XG4gICAgICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLnJpZ2h0ID0gYXJyb3dSaWdodFBvc2l0aW9uICsgJ3B4JztcbiAgICAgICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uc3R5bGUubGVmdCA9ICdhdXRvJztcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b29sdGlwLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICB9XG4gICAgdG9vbHRpcC5zdHlsZS50b3AgPSB0b3AgKyBwYWdlWU9mZnNldCArICdweCc7XG4gICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uY2xhc3NMaXN0LmFkZChhcnJvd0RpcmVjdGlvbik7XG59XG5cblxuZnVuY3Rpb24gY2xvc2VBbGxUb29sdGlwcyhldmVudCwgZm9yY2UgPSBmYWxzZSkge1xuICAgIGlmIChmb3JjZSB8fCAoIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLXRvb2x0aXAnKSAmJiAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcCcpICYmICFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwLWNvbnRlbnQnKSkpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvb2x0aXAtcG9wcGVyJyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB0cmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2FyaWEtZGVzY3JpYmVkYnk9JyArIGVsZW1lbnRzW2ldLmdldEF0dHJpYnV0ZSgnaWQnKSArICddJyk7XG4gICAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLWFjdGl2ZScpO1xuICAgICAgICAgICAgdHJpZ2dlci5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1mb2N1cycpO1xuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW1lbnRzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcikge1xuICAgIHZhciB0b29sdGlwSWQgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgIGxldCB0b29sdGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XG4gICAgdG9vbHRpcEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uVG9vbHRpcEhvdmVyKTtcbiAgICB0b29sdGlwRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25Ub29sdGlwSG92ZXIpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xuICAgICAgICBpZiAodG9vbHRpcEVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICghdHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoXCJ0b29sdGlwLWhvdmVyXCIpKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlVG9vbHRpcCh0cmlnZ2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIDMwMCk7XG59XG5cbmZ1bmN0aW9uIG9uVG9vbHRpcEhvdmVyKGUpIHtcbiAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSB0aGlzO1xuXG4gICAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nICsgdG9vbHRpcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpICsgJ10nKTtcbiAgICB0cmlnZ2VyLmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAtaG92ZXInKTtcblxuICAgIHRvb2x0aXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCB0cmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2FyaWEtZGVzY3JpYmVkYnk9JyArIHRvb2x0aXBFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSArICddJyk7XG4gICAgICAgIGlmICh0cmlnZ2VyICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcbiAgICAgICAgICAgIGNsb3NlSG92ZXJUb29sdGlwKHRyaWdnZXIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVRvb2x0aXAodHJpZ2dlcikge1xuICAgIHZhciB0b29sdGlwSWQgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgIGxldCB0b29sdGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XG5cbiAgICBpZiAodG9vbHRpcElkICE9PSBudWxsICYmIHRvb2x0aXBFbGVtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodG9vbHRpcEVsZW1lbnQpO1xuICAgIH1cbiAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1ob3ZlcicpO1xuICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1mb2N1cycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRvb2x0aXA7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHJlZml4OiAnJyxcbn07XG4iLCIndXNlIHN0cmljdCc7XG5pbXBvcnQgQWNjb3JkaW9uIGZyb20gJy4vY29tcG9uZW50cy9hY2NvcmRpb24nO1xuaW1wb3J0IEFsZXJ0IGZyb20gJy4vY29tcG9uZW50cy9hbGVydCc7XG5pbXBvcnQgQmFja1RvVG9wIGZyb20gJy4vY29tcG9uZW50cy9iYWNrLXRvLXRvcCc7XG5pbXBvcnQgQ2hhcmFjdGVyTGltaXQgZnJvbSAnLi9jb21wb25lbnRzL2NoYXJhY3Rlci1saW1pdCc7XG5pbXBvcnQgQ2hlY2tib3hUb2dnbGVDb250ZW50IGZyb20gJy4vY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudCc7XG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duJztcbmltcG9ydCBEcm9wZG93blNvcnQgZnJvbSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duLXNvcnQnO1xuaW1wb3J0IEVycm9yU3VtbWFyeSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeSc7XG5pbXBvcnQgSW5wdXRSZWdleE1hc2sgZnJvbSAnLi9jb21wb25lbnRzL3JlZ2V4LWlucHV0LW1hc2snO1xuaW1wb3J0IE1vZGFsIGZyb20gJy4vY29tcG9uZW50cy9tb2RhbCc7XG5pbXBvcnQgTmF2aWdhdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbic7XG5pbXBvcnQgUmFkaW9Ub2dnbGVHcm91cCBmcm9tICcuL2NvbXBvbmVudHMvcmFkaW8tdG9nZ2xlLWNvbnRlbnQnO1xuaW1wb3J0IFJlc3BvbnNpdmVUYWJsZSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUnO1xuaW1wb3J0IFRhYm5hdiBmcm9tICAnLi9jb21wb25lbnRzL3RhYm5hdic7XG5pbXBvcnQgVGFibGVTZWxlY3RhYmxlUm93cyBmcm9tICcuL2NvbXBvbmVudHMvc2VsZWN0YWJsZS10YWJsZSc7XG5pbXBvcnQgVG9hc3QgZnJvbSAnLi9jb21wb25lbnRzL3RvYXN0JztcbmltcG9ydCBUb29sdGlwIGZyb20gJy4vY29tcG9uZW50cy90b29sdGlwJztcbmNvbnN0IGRhdGVQaWNrZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGF0ZS1waWNrZXInKTtcbi8qKlxuICogVGhlICdwb2x5ZmlsbHMnIGRlZmluZSBrZXkgRUNNQVNjcmlwdCA1IG1ldGhvZHMgdGhhdCBtYXkgYmUgbWlzc2luZyBmcm9tXG4gKiBvbGRlciBicm93c2Vycywgc28gbXVzdCBiZSBsb2FkZWQgZmlyc3QuXG4gKi9cbnJlcXVpcmUoJy4vcG9seWZpbGxzJyk7XG5cbi8qKlxuICogSW5pdCBhbGwgY29tcG9uZW50c1xuICogQHBhcmFtIHtKU09OfSBvcHRpb25zIHtzY29wZTogSFRNTEVsZW1lbnR9IC0gSW5pdCBhbGwgY29tcG9uZW50cyB3aXRoaW4gc2NvcGUgKGRlZmF1bHQgaXMgZG9jdW1lbnQpXG4gKi9cbnZhciBpbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgLy8gU2V0IHRoZSBvcHRpb25zIHRvIGFuIGVtcHR5IG9iamVjdCBieSBkZWZhdWx0IGlmIG5vIG9wdGlvbnMgYXJlIHBhc3NlZC5cbiAgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMgOiB7fVxuXG4gIC8vIEFsbG93IHRoZSB1c2VyIHRvIGluaXRpYWxpc2UgRkRTIGluIG9ubHkgY2VydGFpbiBzZWN0aW9ucyBvZiB0aGUgcGFnZVxuICAvLyBEZWZhdWx0cyB0byB0aGUgZW50aXJlIGRvY3VtZW50IGlmIG5vdGhpbmcgaXMgc2V0LlxuICB2YXIgc2NvcGUgPSB0eXBlb2Ygb3B0aW9ucy5zY29wZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNjb3BlIDogZG9jdW1lbnRcblxuICAvKlxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgQWNjb3JkaW9uc1xuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbiA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FjY29yZGlvbicpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbi5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uWyBjIF0pLmluaXQoKTtcbiAgfVxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWQgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uLWJvcmRlcmVkOm5vdCguYWNjb3JkaW9uKScpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkLmxlbmd0aDsgYysrKXtcbiAgICBuZXcgQWNjb3JkaW9uKGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZFsgYyBdKS5pbml0KCk7XG4gIH1cblxuICAvKlxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgQWxlcnRzXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIGNvbnN0IGFsZXJ0c1dpdGhDbG9zZUJ1dHRvbiA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbGVydC5oYXMtY2xvc2UnKTtcbiAgZm9yKGxldCBjID0gMDsgYyA8IGFsZXJ0c1dpdGhDbG9zZUJ1dHRvbi5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IEFsZXJ0KGFsZXJ0c1dpdGhDbG9zZUJ1dHRvblsgYyBdKS5pbml0KCk7XG4gIH1cblxuICAvKlxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgQmFjayB0byB0b3AgYnV0dG9uXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIGNvbnN0IGJhY2tUb1RvcEJ1dHRvbnMgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrLXRvLXRvcC1idXR0b24nKTtcbiAgZm9yKGxldCBjID0gMDsgYyA8IGJhY2tUb1RvcEJ1dHRvbnMubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBCYWNrVG9Ub3AoYmFja1RvVG9wQnV0dG9uc1sgYyBdKS5pbml0KCk7XG4gIH1cblxuICAvKlxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgQ2hhcmFjdGVyIGxpbWl0XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuICBjb25zdCBqc0NoYXJhY3RlckxpbWl0ID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1saW1pdCcpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNDaGFyYWN0ZXJMaW1pdC5sZW5ndGg7IGMrKyl7XG5cbiAgICBuZXcgQ2hhcmFjdGVyTGltaXQoanNDaGFyYWN0ZXJMaW1pdFsgYyBdKS5pbml0KCk7XG4gIH1cbiAgXG4gIC8qXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBDaGVja2JveCBjb2xsYXBzZVxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cbiAgY29uc3QganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1jaGVja2JveC10b2dnbGUtY29udGVudCcpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBDaGVja2JveFRvZ2dsZUNvbnRlbnQoanNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2VbIGMgXSkuaW5pdCgpO1xuICB9XG5cbiAgLypcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIE92ZXJmbG93IG1lbnVcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93biA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWRyb3Bkb3duJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd24ubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBEcm9wZG93bihqc1NlbGVjdG9yRHJvcGRvd25bIGMgXSkuaW5pdCgpO1xuICB9XG5cbiAgXG4gIC8qXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBPdmVyZmxvdyBtZW51IHNvcnRcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93blNvcnQgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvdmVyZmxvdy1tZW51LS1zb3J0Jyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd25Tb3J0Lmxlbmd0aDsgYysrKXtcbiAgICBuZXcgRHJvcGRvd25Tb3J0KGpzU2VsZWN0b3JEcm9wZG93blNvcnRbIGMgXSkuaW5pdCgpO1xuICB9XG5cbiAgLypcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIERhdGVwaWNrZXJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG4gIGRhdGVQaWNrZXIub24oc2NvcGUpO1xuICBcbiAgLypcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIEVycm9yIHN1bW1hcnlcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG4gIHZhciAkZXJyb3JTdW1tYXJ5ID0gc2NvcGUucXVlcnlTZWxlY3RvcignW2RhdGEtbW9kdWxlPVwiZXJyb3Itc3VtbWFyeVwiXScpO1xuICBuZXcgRXJyb3JTdW1tYXJ5KCRlcnJvclN1bW1hcnkpLmluaXQoKTtcblxuICAvKlxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgSW5wdXQgUmVnZXggLSB1c2VkIG9uIGRhdGUgZmllbGRzXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuICBjb25zdCBqc1NlbGVjdG9yUmVnZXggPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtkYXRhLWlucHV0LXJlZ2V4XScpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclJlZ2V4Lmxlbmd0aDsgYysrKXtcbiAgICBuZXcgSW5wdXRSZWdleE1hc2soanNTZWxlY3RvclJlZ2V4WyBjIF0pO1xuICB9XG5cbiAgLypcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIE1vZGFsXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuICBjb25zdCBtb2RhbHMgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCcuZmRzLW1vZGFsJyk7XG4gIGZvcihsZXQgZCA9IDA7IGQgPCBtb2RhbHMubGVuZ3RoOyBkKyspIHtcbiAgICBuZXcgTW9kYWwobW9kYWxzW2RdKS5pbml0KCk7XG4gIH1cbiAgXG4gIC8qXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBOYXZpZ2F0aW9uXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuICBuZXcgTmF2aWdhdGlvbigpLmluaXQoKTtcbiAgIFxuICAvKlxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgUmFkaW9idXR0b24gZ3JvdXAgY29sbGFwc2VcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG4gIGNvbnN0IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtcmFkaW8tdG9nZ2xlLWdyb3VwJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZS5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IFJhZGlvVG9nZ2xlR3JvdXAoanNTZWxlY3RvclJhZGlvQ29sbGFwc2VbIGMgXSkuaW5pdCgpO1xuICB9XG5cbiAgLypcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIFJlc3BvbnNpdmUgdGFibGVzXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuICBjb25zdCBqc1NlbGVjdG9yVGFibGUgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZS50YWJsZS0tcmVzcG9uc2l2ZS1oZWFkZXJzLCB0YWJsZS50YWJsZS1zbS1yZXNwb25zaXZlLWhlYWRlcnMsIHRhYmxlLnRhYmxlLW1kLXJlc3BvbnNpdmUtaGVhZGVycywgdGFibGUudGFibGUtbGctcmVzcG9uc2l2ZS1oZWFkZXJzJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibGUubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBSZXNwb25zaXZlVGFibGUoanNTZWxlY3RvclRhYmxlWyBjIF0pO1xuICB9XG5cbiAgLypcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIFNlbGVjdGFibGUgcm93cyBpbiB0YWJsZVxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cbiAgY29uc3QganNTZWxlY3RhYmxlVGFibGUgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZS50YWJsZS0tc2VsZWN0YWJsZScpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RhYmxlVGFibGUubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBUYWJsZVNlbGVjdGFibGVSb3dzKGpzU2VsZWN0YWJsZVRhYmxlWyBjIF0pLmluaXQoKTtcbiAgfVxuXG4gIC8qXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBUYWJuYXZcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJuYXYgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWJuYXYnKTtcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JUYWJuYXYubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBUYWJuYXYoanNTZWxlY3RvclRhYm5hdlsgYyBdKS5pbml0KCk7XG4gIH1cblxuICAvKlxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgVG9vbHRpcFxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cbiAgY29uc3QganNTZWxlY3RvclRvb2x0aXAgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy10b29sdGlwJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVG9vbHRpcC5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IFRvb2x0aXAoanNTZWxlY3RvclRvb2x0aXBbIGMgXSkuaW5pdCgpO1xuICB9XG4gIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7IGluaXQsIEFjY29yZGlvbiwgQWxlcnQsIEJhY2tUb1RvcCwgQ2hhcmFjdGVyTGltaXQsIENoZWNrYm94VG9nZ2xlQ29udGVudCwgRHJvcGRvd24sIERyb3Bkb3duU29ydCwgZGF0ZVBpY2tlciwgRXJyb3JTdW1tYXJ5LCBJbnB1dFJlZ2V4TWFzaywgTW9kYWwsIE5hdmlnYXRpb24sIFJhZGlvVG9nZ2xlR3JvdXAsIFJlc3BvbnNpdmVUYWJsZSwgVGFibGVTZWxlY3RhYmxlUm93cywgVGFibmF2LCBUb2FzdCwgVG9vbHRpcH07IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIFRoaXMgdXNlZCB0byBiZSBjb25kaXRpb25hbGx5IGRlcGVuZGVudCBvbiB3aGV0aGVyIHRoZVxuICAvLyBicm93c2VyIHN1cHBvcnRlZCB0b3VjaCBldmVudHM7IGlmIGl0IGRpZCwgYENMSUNLYCB3YXMgc2V0IHRvXG4gIC8vIGB0b3VjaHN0YXJ0YC4gIEhvd2V2ZXIsIHRoaXMgaGFkIGRvd25zaWRlczpcbiAgLy9cbiAgLy8gKiBJdCBwcmUtZW1wdGVkIG1vYmlsZSBicm93c2VycycgZGVmYXVsdCBiZWhhdmlvciBvZiBkZXRlY3RpbmdcbiAgLy8gICB3aGV0aGVyIGEgdG91Y2ggdHVybmVkIGludG8gYSBzY3JvbGwsIHRoZXJlYnkgcHJldmVudGluZ1xuICAvLyAgIHVzZXJzIGZyb20gdXNpbmcgc29tZSBvZiBvdXIgY29tcG9uZW50cyBhcyBzY3JvbGwgc3VyZmFjZXMuXG4gIC8vXG4gIC8vICogU29tZSBkZXZpY2VzLCBzdWNoIGFzIHRoZSBNaWNyb3NvZnQgU3VyZmFjZSBQcm8sIHN1cHBvcnQgKmJvdGgqXG4gIC8vICAgdG91Y2ggYW5kIGNsaWNrcy4gVGhpcyBtZWFudCB0aGUgY29uZGl0aW9uYWwgZWZmZWN0aXZlbHkgZHJvcHBlZFxuICAvLyAgIHN1cHBvcnQgZm9yIHRoZSB1c2VyJ3MgbW91c2UsIGZydXN0cmF0aW5nIHVzZXJzIHdobyBwcmVmZXJyZWRcbiAgLy8gICBpdCBvbiB0aG9zZSBzeXN0ZW1zLlxuICBDTElDSzogJ2NsaWNrJyxcbn07XG4iLCJpbXBvcnQgJy4uLy4uL09iamVjdC9kZWZpbmVQcm9wZXJ0eSdcblxuKGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuICAvLyBEZXRlY3Rpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvYmxvYi9tYXN0ZXIvcGFja2FnZXMvcG9seWZpbGwtbGlicmFyeS9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQvZGV0ZWN0LmpzXG4gIHZhciBkZXRlY3QgPSAnYmluZCcgaW4gRnVuY3Rpb24ucHJvdG90eXBlXG5cbiAgaWYgKGRldGVjdCkgcmV0dXJuXG5cbiAgLy8gUG9seWZpbGwgZnJvbSBodHRwczovL2Nkbi5wb2x5ZmlsbC5pby92Mi9wb2x5ZmlsbC5qcz9mZWF0dXJlcz1GdW5jdGlvbi5wcm90b3R5cGUuYmluZCZmbGFncz1hbHdheXNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ2JpbmQnLCB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYmluZCh0aGF0KSB7IC8vIC5sZW5ndGggaXMgMVxuICAgICAgICAgIC8vIGFkZCBuZWNlc3NhcnkgZXM1LXNoaW0gdXRpbGl0aWVzXG4gICAgICAgICAgdmFyICRBcnJheSA9IEFycmF5O1xuICAgICAgICAgIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xuICAgICAgICAgIHZhciBPYmplY3RQcm90b3R5cGUgPSAkT2JqZWN0LnByb3RvdHlwZTtcbiAgICAgICAgICB2YXIgQXJyYXlQcm90b3R5cGUgPSAkQXJyYXkucHJvdG90eXBlO1xuICAgICAgICAgIHZhciBFbXB0eSA9IGZ1bmN0aW9uIEVtcHR5KCkge307XG4gICAgICAgICAgdmFyIHRvX3N0cmluZyA9IE9iamVjdFByb3RvdHlwZS50b1N0cmluZztcbiAgICAgICAgICB2YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xuICAgICAgICAgIHZhciBpc0NhbGxhYmxlOyAvKiBpbmxpbmVkIGZyb20gaHR0cHM6Ly9ucG1qcy5jb20vaXMtY2FsbGFibGUgKi8gdmFyIGZuVG9TdHIgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcsIHRyeUZ1bmN0aW9uT2JqZWN0ID0gZnVuY3Rpb24gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpIHsgdHJ5IHsgZm5Ub1N0ci5jYWxsKHZhbHVlKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH0sIGZuQ2xhc3MgPSAnW29iamVjdCBGdW5jdGlvbl0nLCBnZW5DbGFzcyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSc7IGlzQ2FsbGFibGUgPSBmdW5jdGlvbiBpc0NhbGxhYmxlKHZhbHVlKSB7IGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9IGlmIChoYXNUb1N0cmluZ1RhZykgeyByZXR1cm4gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpOyB9IHZhciBzdHJDbGFzcyA9IHRvX3N0cmluZy5jYWxsKHZhbHVlKTsgcmV0dXJuIHN0ckNsYXNzID09PSBmbkNsYXNzIHx8IHN0ckNsYXNzID09PSBnZW5DbGFzczsgfTtcbiAgICAgICAgICB2YXIgYXJyYXlfc2xpY2UgPSBBcnJheVByb3RvdHlwZS5zbGljZTtcbiAgICAgICAgICB2YXIgYXJyYXlfY29uY2F0ID0gQXJyYXlQcm90b3R5cGUuY29uY2F0O1xuICAgICAgICAgIHZhciBhcnJheV9wdXNoID0gQXJyYXlQcm90b3R5cGUucHVzaDtcbiAgICAgICAgICB2YXIgbWF4ID0gTWF0aC5tYXg7XG4gICAgICAgICAgLy8gL2FkZCBuZWNlc3NhcnkgZXM1LXNoaW0gdXRpbGl0aWVzXG5cbiAgICAgICAgICAvLyAxLiBMZXQgVGFyZ2V0IGJlIHRoZSB0aGlzIHZhbHVlLlxuICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzO1xuICAgICAgICAgIC8vIDIuIElmIElzQ2FsbGFibGUoVGFyZ2V0KSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICAgIGlmICghaXNDYWxsYWJsZSh0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgJyArIHRhcmdldCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIDMuIExldCBBIGJlIGEgbmV3IChwb3NzaWJseSBlbXB0eSkgaW50ZXJuYWwgbGlzdCBvZiBhbGwgb2YgdGhlXG4gICAgICAgICAgLy8gICBhcmd1bWVudCB2YWx1ZXMgcHJvdmlkZWQgYWZ0ZXIgdGhpc0FyZyAoYXJnMSwgYXJnMiBldGMpLCBpbiBvcmRlci5cbiAgICAgICAgICAvLyBYWFggc2xpY2VkQXJncyB3aWxsIHN0YW5kIGluIGZvciBcIkFcIiBpZiB1c2VkXG4gICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7IC8vIGZvciBub3JtYWwgY2FsbFxuICAgICAgICAgIC8vIDQuIExldCBGIGJlIGEgbmV3IG5hdGl2ZSBFQ01BU2NyaXB0IG9iamVjdC5cbiAgICAgICAgICAvLyAxMS4gU2V0IHRoZSBbW1Byb3RvdHlwZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdGhlIHN0YW5kYXJkXG4gICAgICAgICAgLy8gICBidWlsdC1pbiBGdW5jdGlvbiBwcm90b3R5cGUgb2JqZWN0IGFzIHNwZWNpZmllZCBpbiAxNS4zLjMuMS5cbiAgICAgICAgICAvLyAxMi4gU2V0IHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAgIC8vICAgMTUuMy40LjUuMS5cbiAgICAgICAgICAvLyAxMy4gU2V0IHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4yLlxuICAgICAgICAgIC8vIDE0LiBTZXQgdGhlIFtbSGFzSW5zdGFuY2VdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAgIC8vICAgMTUuMy40LjUuMy5cbiAgICAgICAgICB2YXIgYm91bmQ7XG4gICAgICAgICAgdmFyIGJpbmRlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAvLyAxNS4zLjQuNS4yIFtbQ29uc3RydWN0XV1cbiAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LFxuICAgICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcbiAgICAgICAgICAgICAgICAgIC8vIGxpc3Qgb2YgYXJndW1lbnRzIEV4dHJhQXJncywgdGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dXG4gICAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgLy8gMi4gSWYgdGFyZ2V0IGhhcyBubyBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCwgYVxuICAgICAgICAgICAgICAgICAgLy8gICBUeXBlRXJyb3IgZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgLy8gNC4gTGV0IGFyZ3MgYmUgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGVcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cbiAgICAgICAgICAgICAgICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGFyZ2V0LmFwcGx5KFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgYXJyYXlfY29uY2F0LmNhbGwoYXJncywgYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGlmICgkT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxuICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LCBGLFxuICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggd2FzIGNyZWF0ZWQgdXNpbmcgdGhlIGJpbmQgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYVxuICAgICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcbiAgICAgICAgICAgICAgICAgIC8vIHN0ZXBzIGFyZSB0YWtlbjpcbiAgICAgICAgICAgICAgICAgIC8vIDEuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgLy8gMi4gTGV0IGJvdW5kVGhpcyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRUaGlzXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgLy8gNC4gTGV0IGFyZ3MgYmUgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGVcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cbiAgICAgICAgICAgICAgICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cblxuICAgICAgICAgICAgICAgICAgLy8gZXF1aXY6IHRhcmdldC5jYWxsKHRoaXMsIC4uLmJvdW5kQXJncywgLi4uYXJncylcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICAgICAgICAgICAgdGhhdCxcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyAxNS4gSWYgdGhlIFtbQ2xhc3NdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBUYXJnZXQgaXMgXCJGdW5jdGlvblwiLCB0aGVuXG4gICAgICAgICAgLy8gICAgIGEuIExldCBMIGJlIHRoZSBsZW5ndGggcHJvcGVydHkgb2YgVGFyZ2V0IG1pbnVzIHRoZSBsZW5ndGggb2YgQS5cbiAgICAgICAgICAvLyAgICAgYi4gU2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gZWl0aGVyIDAgb3IgTCwgd2hpY2hldmVyIGlzXG4gICAgICAgICAgLy8gICAgICAgbGFyZ2VyLlxuICAgICAgICAgIC8vIDE2LiBFbHNlIHNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIDAuXG5cbiAgICAgICAgICB2YXIgYm91bmRMZW5ndGggPSBtYXgoMCwgdGFyZ2V0Lmxlbmd0aCAtIGFyZ3MubGVuZ3RoKTtcblxuICAgICAgICAgIC8vIDE3LiBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byB0aGUgdmFsdWVzXG4gICAgICAgICAgLy8gICBzcGVjaWZpZWQgaW4gMTUuMy41LjEuXG4gICAgICAgICAgdmFyIGJvdW5kQXJncyA9IFtdO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm91bmRMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBhcnJheV9wdXNoLmNhbGwoYm91bmRBcmdzLCAnJCcgKyBpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBYWFggQnVpbGQgYSBkeW5hbWljIGZ1bmN0aW9uIHdpdGggZGVzaXJlZCBhbW91bnQgb2YgYXJndW1lbnRzIGlzIHRoZSBvbmx5XG4gICAgICAgICAgLy8gd2F5IHRvIHNldCB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIGEgZnVuY3Rpb24uXG4gICAgICAgICAgLy8gSW4gZW52aXJvbm1lbnRzIHdoZXJlIENvbnRlbnQgU2VjdXJpdHkgUG9saWNpZXMgZW5hYmxlZCAoQ2hyb21lIGV4dGVuc2lvbnMsXG4gICAgICAgICAgLy8gZm9yIGV4LikgYWxsIHVzZSBvZiBldmFsIG9yIEZ1bmN0aW9uIGNvc3RydWN0b3IgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAgICAvLyBIb3dldmVyIGluIGFsbCBvZiB0aGVzZSBlbnZpcm9ubWVudHMgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgZXhpc3RzXG4gICAgICAgICAgLy8gYW5kIHNvIHRoaXMgY29kZSB3aWxsIG5ldmVyIGJlIGV4ZWN1dGVkLlxuICAgICAgICAgIGJvdW5kID0gRnVuY3Rpb24oJ2JpbmRlcicsICdyZXR1cm4gZnVuY3Rpb24gKCcgKyBib3VuZEFyZ3Muam9pbignLCcpICsgJyl7IHJldHVybiBiaW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfScpKGJpbmRlcik7XG5cbiAgICAgICAgICBpZiAodGFyZ2V0LnByb3RvdHlwZSkge1xuICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSB0YXJnZXQucHJvdG90eXBlO1xuICAgICAgICAgICAgICBib3VuZC5wcm90b3R5cGUgPSBuZXcgRW1wdHkoKTtcbiAgICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZGFuZ2xpbmcgcmVmZXJlbmNlcy5cbiAgICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgLy8gMTguIFNldCB0aGUgW1tFeHRlbnNpYmxlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0cnVlLlxuXG4gICAgICAgICAgLy8gVE9ET1xuICAgICAgICAgIC8vIDE5LiBMZXQgdGhyb3dlciBiZSB0aGUgW1tUaHJvd1R5cGVFcnJvcl1dIGZ1bmN0aW9uIE9iamVjdCAoMTMuMi4zKS5cbiAgICAgICAgICAvLyAyMC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcbiAgICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImNhbGxlclwiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsIFtbU2V0XV06XG4gICAgICAgICAgLy8gICB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSwgYW5kXG4gICAgICAgICAgLy8gICBmYWxzZS5cbiAgICAgICAgICAvLyAyMS4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcbiAgICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImFyZ3VtZW50c1wiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsXG4gICAgICAgICAgLy8gICBbW1NldF1dOiB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSxcbiAgICAgICAgICAvLyAgIGFuZCBmYWxzZS5cblxuICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgICAvLyBOT1RFIEZ1bmN0aW9uIG9iamVjdHMgY3JlYXRlZCB1c2luZyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBkbyBub3RcbiAgICAgICAgICAvLyBoYXZlIGEgcHJvdG90eXBlIHByb3BlcnR5IG9yIHRoZSBbW0NvZGVdXSwgW1tGb3JtYWxQYXJhbWV0ZXJzXV0sIGFuZFxuICAgICAgICAgIC8vIFtbU2NvcGVdXSBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxuICAgICAgICAgIC8vIFhYWCBjYW4ndCBkZWxldGUgcHJvdG90eXBlIGluIHB1cmUtanMuXG5cbiAgICAgICAgICAvLyAyMi4gUmV0dXJuIEYuXG4gICAgICAgICAgcmV0dXJuIGJvdW5kO1xuICAgICAgfVxuICB9KTtcbn0pXG4uY2FsbCgnb2JqZWN0JyA9PT0gdHlwZW9mIHdpbmRvdyAmJiB3aW5kb3cgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBzZWxmICYmIHNlbGYgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBnbG9iYWwgJiYgZ2xvYmFsIHx8IHt9KTtcbiIsIihmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BvbHlmaWxsLWxpYnJhcnkvcG9seWZpbGxzL09iamVjdC9kZWZpbmVQcm9wZXJ0eS9kZXRlY3QuanNcbnZhciBkZXRlY3QgPSAoXG4gIC8vIEluIElFOCwgZGVmaW5lUHJvcGVydHkgY291bGQgb25seSBhY3Qgb24gRE9NIGVsZW1lbnRzLCBzbyBmdWxsIHN1cHBvcnRcbiAgLy8gZm9yIHRoZSBmZWF0dXJlIHJlcXVpcmVzIHRoZSBhYmlsaXR5IHRvIHNldCBhIHByb3BlcnR5IG9uIGFuIGFyYml0cmFyeSBvYmplY3RcbiAgJ2RlZmluZVByb3BlcnR5JyBpbiBPYmplY3QgJiYgKGZ1bmN0aW9uKCkge1xuICBcdHRyeSB7XG4gIFx0XHR2YXIgYSA9IHt9O1xuICBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsICd0ZXN0Jywge3ZhbHVlOjQyfSk7XG4gIFx0XHRyZXR1cm4gdHJ1ZTtcbiAgXHR9IGNhdGNoKGUpIHtcbiAgXHRcdHJldHVybiBmYWxzZVxuICBcdH1cbiAgfSgpKVxuKVxuXG5pZiAoZGV0ZWN0KSByZXR1cm5cblxuLy8gUG9seWZpbGwgZnJvbSBodHRwczovL2Nkbi5wb2x5ZmlsbC5pby92Mi9wb2x5ZmlsbC5qcz9mZWF0dXJlcz1PYmplY3QuZGVmaW5lUHJvcGVydHkmZmxhZ3M9YWx3YXlzXG4oZnVuY3Rpb24gKG5hdGl2ZURlZmluZVByb3BlcnR5KSB7XG5cblx0dmFyIHN1cHBvcnRzQWNjZXNzb3JzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnX19kZWZpbmVHZXR0ZXJfXycpO1xuXHR2YXIgRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEID0gJ0dldHRlcnMgJiBzZXR0ZXJzIGNhbm5vdCBiZSBkZWZpbmVkIG9uIHRoaXMgamF2YXNjcmlwdCBlbmdpbmUnO1xuXHR2YXIgRVJSX1ZBTFVFX0FDQ0VTU09SUyA9ICdBIHByb3BlcnR5IGNhbm5vdCBib3RoIGhhdmUgYWNjZXNzb3JzIGFuZCBiZSB3cml0YWJsZSBvciBoYXZlIGEgdmFsdWUnO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IpIHtcblxuXHRcdC8vIFdoZXJlIG5hdGl2ZSBzdXBwb3J0IGV4aXN0cywgYXNzdW1lIGl0XG5cdFx0aWYgKG5hdGl2ZURlZmluZVByb3BlcnR5ICYmIChvYmplY3QgPT09IHdpbmRvdyB8fCBvYmplY3QgPT09IGRvY3VtZW50IHx8IG9iamVjdCA9PT0gRWxlbWVudC5wcm90b3R5cGUgfHwgb2JqZWN0IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcblx0XHRcdHJldHVybiBuYXRpdmVEZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcblx0XHR9XG5cblx0XHRpZiAob2JqZWN0ID09PSBudWxsIHx8ICEob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKCEoZGVzY3JpcHRvciBpbnN0YW5jZW9mIE9iamVjdCkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3BlcnR5IGRlc2NyaXB0aW9uIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0dmFyIHByb3BlcnR5U3RyaW5nID0gU3RyaW5nKHByb3BlcnR5KTtcblx0XHR2YXIgaGFzVmFsdWVPcldyaXRhYmxlID0gJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yIHx8ICd3cml0YWJsZScgaW4gZGVzY3JpcHRvcjtcblx0XHR2YXIgZ2V0dGVyVHlwZSA9ICdnZXQnIGluIGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3IuZ2V0O1xuXHRcdHZhciBzZXR0ZXJUeXBlID0gJ3NldCcgaW4gZGVzY3JpcHRvciAmJiB0eXBlb2YgZGVzY3JpcHRvci5zZXQ7XG5cblx0XHQvLyBoYW5kbGUgZGVzY3JpcHRvci5nZXRcblx0XHRpZiAoZ2V0dGVyVHlwZSkge1xuXHRcdFx0aWYgKGdldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignR2V0dGVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX1ZBTFVFX0FDQ0VTU09SUyk7XG5cdFx0XHR9XG5cdFx0XHRPYmplY3QuX19kZWZpbmVHZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3IuZ2V0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b2JqZWN0W3Byb3BlcnR5U3RyaW5nXSA9IGRlc2NyaXB0b3IudmFsdWU7XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIGRlc2NyaXB0b3Iuc2V0XG5cdFx0aWYgKHNldHRlclR5cGUpIHtcblx0XHRcdGlmIChzZXR0ZXJUeXBlICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1NldHRlciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblx0XHRcdH1cblx0XHRcdGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfQUNDRVNTT1JTX05PVF9TVVBQT1JURUQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhhc1ZhbHVlT3JXcml0YWJsZSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9WQUxVRV9BQ0NFU1NPUlMpO1xuXHRcdFx0fVxuXHRcdFx0T2JqZWN0Ll9fZGVmaW5lU2V0dGVyX18uY2FsbChvYmplY3QsIHByb3BlcnR5U3RyaW5nLCBkZXNjcmlwdG9yLnNldCk7XG5cdFx0fVxuXG5cdFx0Ly8gT0sgdG8gZGVmaW5lIHZhbHVlIHVuY29uZGl0aW9uYWxseSAtIGlmIGEgZ2V0dGVyIGhhcyBiZWVuIHNwZWNpZmllZCBhcyB3ZWxsLCBhbiBlcnJvciB3b3VsZCBiZSB0aHJvd24gYWJvdmVcblx0XHRpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSB7XG5cdFx0XHRvYmplY3RbcHJvcGVydHlTdHJpbmddID0gZGVzY3JpcHRvci52YWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9O1xufShPYmplY3QuZGVmaW5lUHJvcGVydHkpKTtcbn0pXG4uY2FsbCgnb2JqZWN0JyA9PT0gdHlwZW9mIHdpbmRvdyAmJiB3aW5kb3cgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBzZWxmICYmIHNlbGYgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBnbG9iYWwgJiYgZ2xvYmFsIHx8IHt9KTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jLW5hbWVzICovXG4oZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIF9wYXJhbXMpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBfcGFyYW1zIHx8IHtcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXG4gICAgICBkZXRhaWw6IG51bGwsXG4gICAgfTtcbiAgICBjb25zdCBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIkN1c3RvbUV2ZW50XCIpO1xuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoXG4gICAgICBldmVudCxcbiAgICAgIHBhcmFtcy5idWJibGVzLFxuICAgICAgcGFyYW1zLmNhbmNlbGFibGUsXG4gICAgICBwYXJhbXMuZGV0YWlsXG4gICAgKTtcbiAgICByZXR1cm4gZXZ0O1xuICB9XG5cbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgZWxwcm90byA9IHdpbmRvdy5IVE1MRWxlbWVudC5wcm90b3R5cGU7XG5jb25zdCBISURERU4gPSAnaGlkZGVuJztcblxuaWYgKCEoSElEREVOIGluIGVscHJvdG8pKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbHByb3RvLCBISURERU4sIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShISURERU4pO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShISURERU4sICcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKEhJRERFTik7XG4gICAgICB9XG4gICAgfSxcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG4vLyBwb2x5ZmlsbHMgSFRNTEVsZW1lbnQucHJvdG90eXBlLmNsYXNzTGlzdCBhbmQgRE9NVG9rZW5MaXN0XG5yZXF1aXJlKCdjbGFzc2xpc3QtcG9seWZpbGwnKTtcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZGVuXG5yZXF1aXJlKCcuL2VsZW1lbnQtaGlkZGVuJyk7XG5cbi8vIHBvbHlmaWxscyBOdW1iZXIuaXNOYU4oKVxucmVxdWlyZShcIi4vbnVtYmVyLWlzLW5hblwiKTtcblxuLy8gcG9seWZpbGxzIEN1c3RvbUV2ZW50XG5yZXF1aXJlKFwiLi9jdXN0b20tZXZlbnRcIik7XG5cbnJlcXVpcmUoJ2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbicpO1xucmVxdWlyZSgnY29yZS1qcy9mbi9hcnJheS9mcm9tJyk7IiwiTnVtYmVyLmlzTmFOID1cbiAgTnVtYmVyLmlzTmFOIHx8XG4gIGZ1bmN0aW9uIGlzTmFOKGlucHV0KSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09IFwibnVtYmVyXCIgJiYgaW5wdXQgIT09IGlucHV0O1xuICB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoaHRtbERvY3VtZW50ID0gZG9jdW1lbnQpID0+IGh0bWxEb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZShcIm9iamVjdC1hc3NpZ25cIik7XG5jb25zdCByZWNlcHRvciA9IHJlcXVpcmUoXCJyZWNlcHRvclwiKTtcblxuLyoqXG4gKiBAbmFtZSBzZXF1ZW5jZVxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gc2VxIGFuIGFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybiB7IGNsb3N1cmUgfSBjYWxsSG9va3NcbiAqL1xuLy8gV2UgdXNlIGEgbmFtZWQgZnVuY3Rpb24gaGVyZSBiZWNhdXNlIHdlIHdhbnQgaXQgdG8gaW5oZXJpdCBpdHMgbGV4aWNhbCBzY29wZVxuLy8gZnJvbSB0aGUgYmVoYXZpb3IgcHJvcHMgb2JqZWN0LCBub3QgZnJvbSB0aGUgbW9kdWxlXG5jb25zdCBzZXF1ZW5jZSA9ICguLi5zZXEpID0+XG4gIGZ1bmN0aW9uIGNhbGxIb29rcyh0YXJnZXQgPSBkb2N1bWVudC5ib2R5KSB7XG4gICAgc2VxLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzW21ldGhvZF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4vKipcbiAqIEBuYW1lIGJlaGF2aW9yXG4gKiBAcGFyYW0ge29iamVjdH0gZXZlbnRzXG4gKiBAcGFyYW0ge29iamVjdD99IHByb3BzXG4gKiBAcmV0dXJuIHtyZWNlcHRvci5iZWhhdmlvcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZXZlbnRzLCBwcm9wcykgPT5cbiAgcmVjZXB0b3IuYmVoYXZpb3IoXG4gICAgZXZlbnRzLFxuICAgIGFzc2lnbihcbiAgICAgIHtcbiAgICAgICAgb246IHNlcXVlbmNlKFwiaW5pdFwiLCBcImFkZFwiKSxcbiAgICAgICAgb2ZmOiBzZXF1ZW5jZShcInRlYXJkb3duXCIsIFwicmVtb3ZlXCIpLFxuICAgICAgfSxcbiAgICAgIHByb3BzXG4gICAgKVxuICApO1xuIiwiJ3VzZSBzdHJpY3QnO1xubGV0IGJyZWFrcG9pbnRzID0ge1xuICAneHMnOiAwLFxuICAnc20nOiA1NzYsXG4gICdtZCc6IDc2OCxcbiAgJ2xnJzogOTkyLFxuICAneGwnOiAxMjAwXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJyZWFrcG9pbnRzO1xuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcbmZ1bmN0aW9uIGlzRWxlbWVudEluVmlld3BvcnQgKGVsLCB3aW49d2luZG93LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jRWw9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgcmV0dXJuIChcbiAgICByZWN0LnRvcCA+PSAwICYmXG4gICAgcmVjdC5sZWZ0ID49IDAgJiZcbiAgICByZWN0LmJvdHRvbSA8PSAod2luLmlubmVySGVpZ2h0IHx8IGRvY0VsLmNsaWVudEhlaWdodCkgJiZcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcbiAgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VsZW1lbnRJblZpZXdwb3J0O1xuIiwiLy8gaU9TIGRldGVjdGlvbiBmcm9tOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85MDM5ODg1LzE3NzcxMFxuZnVuY3Rpb24gaXNJb3NEZXZpY2UoKSB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBvZHxpUGhvbmV8aVBhZCkvZykgfHxcbiAgICAgIChuYXZpZ2F0b3IucGxhdGZvcm0gPT09IFwiTWFjSW50ZWxcIiAmJiBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAxKSkgJiZcbiAgICAhd2luZG93Lk1TU3RyZWFtXG4gICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJb3NEZXZpY2U7XG4iLCIvKipcbiAqIEBuYW1lIGlzRWxlbWVudFxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNFbGVtZW50ID0gKHZhbHVlKSA9PlxuICB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XG5cbi8qKlxuICogQG5hbWUgc2VsZWN0XG4gKiBAZGVzYyBzZWxlY3RzIGVsZW1lbnRzIGZyb20gdGhlIERPTSBieSBjbGFzcyBzZWxlY3RvciBvciBJRCBzZWxlY3Rvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciAtIFRoZSBzZWxlY3RvciB0byB0cmF2ZXJzZSB0aGUgRE9NIHdpdGguXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cbiAqICAgaW4uIElmIG5vdCBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gdGhlIGRvY3VtZW50LlxuICogQHJldHVybiB7SFRNTEVsZW1lbnRbXX0gLSBBbiBhcnJheSBvZiBET00gbm9kZXMgb3IgYW4gZW1wdHkgYXJyYXkuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gKHNlbGVjdG9yLCBjb250ZXh0KSA9PiB7XG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xuICAgIGNvbnRleHQgPSB3aW5kb3cuZG9jdW1lbnQ7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChzZWxlY3Rpb24pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xuY29uc3QgQ09OVFJPTFMgPSAnYXJpYS1jb250cm9scyc7XG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChidXR0b24sIGV4cGFuZGVkKSA9PiB7XG5cbiAgaWYgKHR5cGVvZiBleHBhbmRlZCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgZXhwYW5kZWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ2ZhbHNlJztcbiAgfVxuICBidXR0b24uc2V0QXR0cmlidXRlKEVYUEFOREVELCBleHBhbmRlZCk7XG4gIGNvbnN0IGlkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShDT05UUk9MUyk7XG4gIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICBpZiAoIWNvbnRyb2xzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ05vIHRvZ2dsZSB0YXJnZXQgZm91bmQgd2l0aCBpZDogXCInICsgaWQgKyAnXCInXG4gICAgKTtcbiAgfVxuXG4gIGNvbnRyb2xzLnNldEF0dHJpYnV0ZShISURERU4sICFleHBhbmRlZCk7XG4gIHJldHVybiBleHBhbmRlZDtcbn07XG4iXX0=
