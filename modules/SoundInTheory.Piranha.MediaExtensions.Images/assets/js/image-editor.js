/*!
 * Cropper.js v1.5.12
 * https://fengyuanchen.github.io/cropperjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2021-06-12T08:00:17.411Z
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Cropper = factory());
}(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  var WINDOW = IS_BROWSER ? window : {};
  var IS_TOUCH_DEVICE = IS_BROWSER && WINDOW.document.documentElement ? 'ontouchstart' in WINDOW.document.documentElement : false;
  var HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;
  var NAMESPACE = 'cropper'; // Actions

  var ACTION_ALL = 'all';
  var ACTION_CROP = 'crop';
  var ACTION_MOVE = 'move';
  var ACTION_ZOOM = 'zoom';
  var ACTION_EAST = 'e';
  var ACTION_WEST = 'w';
  var ACTION_SOUTH = 's';
  var ACTION_NORTH = 'n';
  var ACTION_NORTH_EAST = 'ne';
  var ACTION_NORTH_WEST = 'nw';
  var ACTION_SOUTH_EAST = 'se';
  var ACTION_SOUTH_WEST = 'sw'; // Classes

  var CLASS_CROP = "".concat(NAMESPACE, "-crop");
  var CLASS_DISABLED = "".concat(NAMESPACE, "-disabled");
  var CLASS_HIDDEN = "".concat(NAMESPACE, "-hidden");
  var CLASS_HIDE = "".concat(NAMESPACE, "-hide");
  var CLASS_INVISIBLE = "".concat(NAMESPACE, "-invisible");
  var CLASS_MODAL = "".concat(NAMESPACE, "-modal");
  var CLASS_MOVE = "".concat(NAMESPACE, "-move"); // Data keys

  var DATA_ACTION = "".concat(NAMESPACE, "Action");
  var DATA_PREVIEW = "".concat(NAMESPACE, "Preview"); // Drag modes

  var DRAG_MODE_CROP = 'crop';
  var DRAG_MODE_MOVE = 'move';
  var DRAG_MODE_NONE = 'none'; // Events

  var EVENT_CROP = 'crop';
  var EVENT_CROP_END = 'cropend';
  var EVENT_CROP_MOVE = 'cropmove';
  var EVENT_CROP_START = 'cropstart';
  var EVENT_DBLCLICK = 'dblclick';
  var EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
  var EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
  var EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
  var EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
  var EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
  var EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup pointercancel' : EVENT_TOUCH_END;
  var EVENT_READY = 'ready';
  var EVENT_RESIZE = 'resize';
  var EVENT_WHEEL = 'wheel';
  var EVENT_ZOOM = 'zoom'; // Mime types

  var MIME_TYPE_JPEG = 'image/jpeg'; // RegExps

  var REGEXP_ACTIONS = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/;
  var REGEXP_DATA_URL = /^data:/;
  var REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;
  var REGEXP_TAG_NAME = /^img|canvas$/i; // Misc
  // Inspired by the default width and height of a canvas element.

  var MIN_CONTAINER_WIDTH = 200;
  var MIN_CONTAINER_HEIGHT = 100;

  var DEFAULTS = {
    // Define the view mode of the cropper
    viewMode: 0,
    // 0, 1, 2, 3
    // Define the dragging mode of the cropper
    dragMode: DRAG_MODE_CROP,
    // 'crop', 'move' or 'none'
    // Define the initial aspect ratio of the crop box
    initialAspectRatio: NaN,
    // Define the aspect ratio of the crop box
    aspectRatio: NaN,
    // An object with the previous cropping result data
    data: null,
    // A selector for adding extra containers to preview
    preview: '',
    // Re-render the cropper when resize the window
    responsive: true,
    // Restore the cropped area after resize the window
    restore: true,
    // Check if the current image is a cross-origin image
    checkCrossOrigin: true,
    // Check the current image's Exif Orientation information
    checkOrientation: true,
    // Show the black modal
    modal: true,
    // Show the dashed lines for guiding
    guides: true,
    // Show the center indicator for guiding
    center: true,
    // Show the white modal to highlight the crop box
    highlight: true,
    // Show the grid background
    background: true,
    // Enable to crop the image automatically when initialize
    autoCrop: true,
    // Define the percentage of automatic cropping area when initializes
    autoCropArea: 0.8,
    // Enable to move the image
    movable: true,
    // Enable to rotate the image
    rotatable: true,
    // Enable to scale the image
    scalable: true,
    // Enable to zoom the image
    zoomable: true,
    // Enable to zoom the image by dragging touch
    zoomOnTouch: true,
    // Enable to zoom the image by wheeling mouse
    zoomOnWheel: true,
    // Define zoom ratio when zoom the image by wheeling mouse
    wheelZoomRatio: 0.1,
    // Enable to move the crop box
    cropBoxMovable: true,
    // Enable to resize the crop box
    cropBoxResizable: true,
    // Toggle drag mode between "crop" and "move" when click twice on the cropper
    toggleDragModeOnDblclick: true,
    // Size limitation
    minCanvasWidth: 0,
    minCanvasHeight: 0,
    minCropBoxWidth: 0,
    minCropBoxHeight: 0,
    minContainerWidth: MIN_CONTAINER_WIDTH,
    minContainerHeight: MIN_CONTAINER_HEIGHT,
    // Shortcuts of events
    ready: null,
    cropstart: null,
    cropmove: null,
    cropend: null,
    crop: null,
    zoom: null
  };

  var TEMPLATE = '<div class="cropper-container" touch-action="none">' + '<div class="cropper-wrap-box">' + '<div class="cropper-canvas"></div>' + '</div>' + '<div class="cropper-drag-box"></div>' + '<div class="cropper-crop-box">' + '<span class="cropper-view-box"></span>' + '<span class="cropper-dashed dashed-h"></span>' + '<span class="cropper-dashed dashed-v"></span>' + '<span class="cropper-center"></span>' + '<span class="cropper-face"></span>' + '<span class="cropper-line line-e" data-cropper-action="e"></span>' + '<span class="cropper-line line-n" data-cropper-action="n"></span>' + '<span class="cropper-line line-w" data-cropper-action="w"></span>' + '<span class="cropper-line line-s" data-cropper-action="s"></span>' + '<span class="cropper-point point-e" data-cropper-action="e"></span>' + '<span class="cropper-point point-n" data-cropper-action="n"></span>' + '<span class="cropper-point point-w" data-cropper-action="w"></span>' + '<span class="cropper-point point-s" data-cropper-action="s"></span>' + '<span class="cropper-point point-ne" data-cropper-action="ne"></span>' + '<span class="cropper-point point-nw" data-cropper-action="nw"></span>' + '<span class="cropper-point point-sw" data-cropper-action="sw"></span>' + '<span class="cropper-point point-se" data-cropper-action="se"></span>' + '</div>' + '</div>';

  /**
   * Check if the given value is not a number.
   */

  var isNaN = Number.isNaN || WINDOW.isNaN;
  /**
   * Check if the given value is a number.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a number, else `false`.
   */

  function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }
  /**
   * Check if the given value is a positive number.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a positive number, else `false`.
   */

  var isPositiveNumber = function isPositiveNumber(value) {
    return value > 0 && value < Infinity;
  };
  /**
   * Check if the given value is undefined.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
   */

  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  /**
   * Check if the given value is an object.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is an object, else `false`.
   */

  function isObject(value) {
    return _typeof(value) === 'object' && value !== null;
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * Check if the given value is a plain object.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
   */

  function isPlainObject(value) {
    if (!isObject(value)) {
      return false;
    }

    try {
      var _constructor = value.constructor;
      var prototype = _constructor.prototype;
      return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
    } catch (error) {
      return false;
    }
  }
  /**
   * Check if the given value is a function.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a function, else `false`.
   */

  function isFunction(value) {
    return typeof value === 'function';
  }
  var slice = Array.prototype.slice;
  /**
   * Convert array-like or iterable object to an array.
   * @param {*} value - The value to convert.
   * @returns {Array} Returns a new array.
   */

  function toArray(value) {
    return Array.from ? Array.from(value) : slice.call(value);
  }
  /**
   * Iterate the given data.
   * @param {*} data - The data to iterate.
   * @param {Function} callback - The process function for each element.
   * @returns {*} The original data.
   */

  function forEach(data, callback) {
    if (data && isFunction(callback)) {
      if (Array.isArray(data) || isNumber(data.length)
      /* array-like */
      ) {
          toArray(data).forEach(function (value, key) {
            callback.call(data, value, key, data);
          });
        } else if (isObject(data)) {
        Object.keys(data).forEach(function (key) {
          callback.call(data, data[key], key, data);
        });
      }
    }

    return data;
  }
  /**
   * Extend the given object.
   * @param {*} target - The target object to extend.
   * @param {*} args - The rest objects for merging to the target object.
   * @returns {Object} The extended object.
   */

  var assign = Object.assign || function assign(target) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (isObject(target) && args.length > 0) {
      args.forEach(function (arg) {
        if (isObject(arg)) {
          Object.keys(arg).forEach(function (key) {
            target[key] = arg[key];
          });
        }
      });
    }

    return target;
  };
  var REGEXP_DECIMALS = /\.\d*(?:0|9){12}\d*$/;
  /**
   * Normalize decimal number.
   * Check out {@link https://0.30000000000000004.com/}
   * @param {number} value - The value to normalize.
   * @param {number} [times=100000000000] - The times for normalizing.
   * @returns {number} Returns the normalized number.
   */

  function normalizeDecimalNumber(value) {
    var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100000000000;
    return REGEXP_DECIMALS.test(value) ? Math.round(value * times) / times : value;
  }
  var REGEXP_SUFFIX = /^width|height|left|top|marginLeft|marginTop$/;
  /**
   * Apply styles to the given element.
   * @param {Element} element - The target element.
   * @param {Object} styles - The styles for applying.
   */

  function setStyle(element, styles) {
    var style = element.style;
    forEach(styles, function (value, property) {
      if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
        value = "".concat(value, "px");
      }

      style[property] = value;
    });
  }
  /**
   * Check if the given element has a special class.
   * @param {Element} element - The element to check.
   * @param {string} value - The class to search.
   * @returns {boolean} Returns `true` if the special class was found.
   */

  function hasClass(element, value) {
    return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
  }
  /**
   * Add classes to the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be added.
   */

  function addClass(element, value) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        addClass(elem, value);
      });
      return;
    }

    if (element.classList) {
      element.classList.add(value);
      return;
    }

    var className = element.className.trim();

    if (!className) {
      element.className = value;
    } else if (className.indexOf(value) < 0) {
      element.className = "".concat(className, " ").concat(value);
    }
  }
  /**
   * Remove classes from the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be removed.
   */

  function removeClass(element, value) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        removeClass(elem, value);
      });
      return;
    }

    if (element.classList) {
      element.classList.remove(value);
      return;
    }

    if (element.className.indexOf(value) >= 0) {
      element.className = element.className.replace(value, '');
    }
  }
  /**
   * Add or remove classes from the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be toggled.
   * @param {boolean} added - Add only.
   */

  function toggleClass(element, value, added) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        toggleClass(elem, value, added);
      });
      return;
    } // IE10-11 doesn't support the second parameter of `classList.toggle`


    if (added) {
      addClass(element, value);
    } else {
      removeClass(element, value);
    }
  }
  var REGEXP_CAMEL_CASE = /([a-z\d])([A-Z])/g;
  /**
   * Transform the given string from camelCase to kebab-case
   * @param {string} value - The value to transform.
   * @returns {string} The transformed value.
   */

  function toParamCase(value) {
    return value.replace(REGEXP_CAMEL_CASE, '$1-$2').toLowerCase();
  }
  /**
   * Get data from the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to get.
   * @returns {string} The data value.
   */

  function getData(element, name) {
    if (isObject(element[name])) {
      return element[name];
    }

    if (element.dataset) {
      return element.dataset[name];
    }

    return element.getAttribute("data-".concat(toParamCase(name)));
  }
  /**
   * Set data to the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to set.
   * @param {string} data - The data value.
   */

  function setData(element, name, data) {
    if (isObject(data)) {
      element[name] = data;
    } else if (element.dataset) {
      element.dataset[name] = data;
    } else {
      element.setAttribute("data-".concat(toParamCase(name)), data);
    }
  }
  /**
   * Remove data from the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to remove.
   */

  function removeData(element, name) {
    if (isObject(element[name])) {
      try {
        delete element[name];
      } catch (error) {
        element[name] = undefined;
      }
    } else if (element.dataset) {
      // #128 Safari not allows to delete dataset property
      try {
        delete element.dataset[name];
      } catch (error) {
        element.dataset[name] = undefined;
      }
    } else {
      element.removeAttribute("data-".concat(toParamCase(name)));
    }
  }
  var REGEXP_SPACES = /\s\s*/;

  var onceSupported = function () {
    var supported = false;

    if (IS_BROWSER) {
      var once = false;

      var listener = function listener() {};

      var options = Object.defineProperty({}, 'once', {
        get: function get() {
          supported = true;
          return once;
        },

        /**
         * This setter can fix a `TypeError` in strict mode
         * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
         * @param {boolean} value - The value to set
         */
        set: function set(value) {
          once = value;
        }
      });
      WINDOW.addEventListener('test', listener, options);
      WINDOW.removeEventListener('test', listener, options);
    }

    return supported;
  }();
  /**
   * Remove event listener from the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Function} listener - The event listener.
   * @param {Object} options - The event options.
   */


  function removeListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function (event) {
      if (!onceSupported) {
        var listeners = element.listeners;

        if (listeners && listeners[event] && listeners[event][listener]) {
          handler = listeners[event][listener];
          delete listeners[event][listener];

          if (Object.keys(listeners[event]).length === 0) {
            delete listeners[event];
          }

          if (Object.keys(listeners).length === 0) {
            delete element.listeners;
          }
        }
      }

      element.removeEventListener(event, handler, options);
    });
  }
  /**
   * Add event listener to the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Function} listener - The event listener.
   * @param {Object} options - The event options.
   */

  function addListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var _handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function (event) {
      if (options.once && !onceSupported) {
        var _element$listeners = element.listeners,
            listeners = _element$listeners === void 0 ? {} : _element$listeners;

        _handler = function handler() {
          delete listeners[event][listener];
          element.removeEventListener(event, _handler, options);

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          listener.apply(element, args);
        };

        if (!listeners[event]) {
          listeners[event] = {};
        }

        if (listeners[event][listener]) {
          element.removeEventListener(event, listeners[event][listener], options);
        }

        listeners[event][listener] = _handler;
        element.listeners = listeners;
      }

      element.addEventListener(event, _handler, options);
    });
  }
  /**
   * Dispatch event on the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Object} data - The additional event data.
   * @returns {boolean} Indicate if the event is default prevented or not.
   */

  function dispatchEvent(element, type, data) {
    var event; // Event and CustomEvent on IE9-11 are global objects, not constructors

    if (isFunction(Event) && isFunction(CustomEvent)) {
      event = new CustomEvent(type, {
        detail: data,
        bubbles: true,
        cancelable: true
      });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, true, true, data);
    }

    return element.dispatchEvent(event);
  }
  /**
   * Get the offset base on the document.
   * @param {Element} element - The target element.
   * @returns {Object} The offset data.
   */

  function getOffset(element) {
    var box = element.getBoundingClientRect();
    return {
      left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
      top: box.top + (window.pageYOffset - document.documentElement.clientTop)
    };
  }
  var location = WINDOW.location;
  var REGEXP_ORIGINS = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;
  /**
   * Check if the given URL is a cross origin URL.
   * @param {string} url - The target URL.
   * @returns {boolean} Returns `true` if the given URL is a cross origin URL, else `false`.
   */

  function isCrossOriginURL(url) {
    var parts = url.match(REGEXP_ORIGINS);
    return parts !== null && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
  }
  /**
   * Add timestamp to the given URL.
   * @param {string} url - The target URL.
   * @returns {string} The result URL.
   */

  function addTimestamp(url) {
    var timestamp = "timestamp=".concat(new Date().getTime());
    return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
  }
  /**
   * Get transforms base on the given object.
   * @param {Object} obj - The target object.
   * @returns {string} A string contains transform values.
   */

  function getTransforms(_ref) {
    var rotate = _ref.rotate,
        scaleX = _ref.scaleX,
        scaleY = _ref.scaleY,
        translateX = _ref.translateX,
        translateY = _ref.translateY;
    var values = [];

    if (isNumber(translateX) && translateX !== 0) {
      values.push("translateX(".concat(translateX, "px)"));
    }

    if (isNumber(translateY) && translateY !== 0) {
      values.push("translateY(".concat(translateY, "px)"));
    } // Rotate should come first before scale to match orientation transform


    if (isNumber(rotate) && rotate !== 0) {
      values.push("rotate(".concat(rotate, "deg)"));
    }

    if (isNumber(scaleX) && scaleX !== 1) {
      values.push("scaleX(".concat(scaleX, ")"));
    }

    if (isNumber(scaleY) && scaleY !== 1) {
      values.push("scaleY(".concat(scaleY, ")"));
    }

    var transform = values.length ? values.join(' ') : 'none';
    return {
      WebkitTransform: transform,
      msTransform: transform,
      transform: transform
    };
  }
  /**
   * Get the max ratio of a group of pointers.
   * @param {string} pointers - The target pointers.
   * @returns {number} The result ratio.
   */

  function getMaxZoomRatio(pointers) {
    var pointers2 = _objectSpread2({}, pointers);

    var maxRatio = 0;
    forEach(pointers, function (pointer, pointerId) {
      delete pointers2[pointerId];
      forEach(pointers2, function (pointer2) {
        var x1 = Math.abs(pointer.startX - pointer2.startX);
        var y1 = Math.abs(pointer.startY - pointer2.startY);
        var x2 = Math.abs(pointer.endX - pointer2.endX);
        var y2 = Math.abs(pointer.endY - pointer2.endY);
        var z1 = Math.sqrt(x1 * x1 + y1 * y1);
        var z2 = Math.sqrt(x2 * x2 + y2 * y2);
        var ratio = (z2 - z1) / z1;

        if (Math.abs(ratio) > Math.abs(maxRatio)) {
          maxRatio = ratio;
        }
      });
    });
    return maxRatio;
  }
  /**
   * Get a pointer from an event object.
   * @param {Object} event - The target event object.
   * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
   * @returns {Object} The result pointer contains start and/or end point coordinates.
   */

  function getPointer(_ref2, endOnly) {
    var pageX = _ref2.pageX,
        pageY = _ref2.pageY;
    var end = {
      endX: pageX,
      endY: pageY
    };
    return endOnly ? end : _objectSpread2({
      startX: pageX,
      startY: pageY
    }, end);
  }
  /**
   * Get the center point coordinate of a group of pointers.
   * @param {Object} pointers - The target pointers.
   * @returns {Object} The center point coordinate.
   */

  function getPointersCenter(pointers) {
    var pageX = 0;
    var pageY = 0;
    var count = 0;
    forEach(pointers, function (_ref3) {
      var startX = _ref3.startX,
          startY = _ref3.startY;
      pageX += startX;
      pageY += startY;
      count += 1;
    });
    pageX /= count;
    pageY /= count;
    return {
      pageX: pageX,
      pageY: pageY
    };
  }
  /**
   * Get the max sizes in a rectangle under the given aspect ratio.
   * @param {Object} data - The original sizes.
   * @param {string} [type='contain'] - The adjust type.
   * @returns {Object} The result sizes.
   */

  function getAdjustedSizes(_ref4) // or 'cover'
  {
    var aspectRatio = _ref4.aspectRatio,
        height = _ref4.height,
        width = _ref4.width;
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'contain';
    var isValidWidth = isPositiveNumber(width);
    var isValidHeight = isPositiveNumber(height);

    if (isValidWidth && isValidHeight) {
      var adjustedWidth = height * aspectRatio;

      if (type === 'contain' && adjustedWidth > width || type === 'cover' && adjustedWidth < width) {
        height = width / aspectRatio;
      } else {
        width = height * aspectRatio;
      }
    } else if (isValidWidth) {
      height = width / aspectRatio;
    } else if (isValidHeight) {
      width = height * aspectRatio;
    }

    return {
      width: width,
      height: height
    };
  }
  /**
   * Get the new sizes of a rectangle after rotated.
   * @param {Object} data - The original sizes.
   * @returns {Object} The result sizes.
   */

  function getRotatedSizes(_ref5) {
    var width = _ref5.width,
        height = _ref5.height,
        degree = _ref5.degree;
    degree = Math.abs(degree) % 180;

    if (degree === 90) {
      return {
        width: height,
        height: width
      };
    }

    var arc = degree % 90 * Math.PI / 180;
    var sinArc = Math.sin(arc);
    var cosArc = Math.cos(arc);
    var newWidth = width * cosArc + height * sinArc;
    var newHeight = width * sinArc + height * cosArc;
    return degree > 90 ? {
      width: newHeight,
      height: newWidth
    } : {
      width: newWidth,
      height: newHeight
    };
  }
  /**
   * Get a canvas which drew the given image.
   * @param {HTMLImageElement} image - The image for drawing.
   * @param {Object} imageData - The image data.
   * @param {Object} canvasData - The canvas data.
   * @param {Object} options - The options.
   * @returns {HTMLCanvasElement} The result canvas.
   */

  function getSourceCanvas(image, _ref6, _ref7, _ref8) {
    var imageAspectRatio = _ref6.aspectRatio,
        imageNaturalWidth = _ref6.naturalWidth,
        imageNaturalHeight = _ref6.naturalHeight,
        _ref6$rotate = _ref6.rotate,
        rotate = _ref6$rotate === void 0 ? 0 : _ref6$rotate,
        _ref6$scaleX = _ref6.scaleX,
        scaleX = _ref6$scaleX === void 0 ? 1 : _ref6$scaleX,
        _ref6$scaleY = _ref6.scaleY,
        scaleY = _ref6$scaleY === void 0 ? 1 : _ref6$scaleY;
    var aspectRatio = _ref7.aspectRatio,
        naturalWidth = _ref7.naturalWidth,
        naturalHeight = _ref7.naturalHeight;
    var _ref8$fillColor = _ref8.fillColor,
        fillColor = _ref8$fillColor === void 0 ? 'transparent' : _ref8$fillColor,
        _ref8$imageSmoothingE = _ref8.imageSmoothingEnabled,
        imageSmoothingEnabled = _ref8$imageSmoothingE === void 0 ? true : _ref8$imageSmoothingE,
        _ref8$imageSmoothingQ = _ref8.imageSmoothingQuality,
        imageSmoothingQuality = _ref8$imageSmoothingQ === void 0 ? 'low' : _ref8$imageSmoothingQ,
        _ref8$maxWidth = _ref8.maxWidth,
        maxWidth = _ref8$maxWidth === void 0 ? Infinity : _ref8$maxWidth,
        _ref8$maxHeight = _ref8.maxHeight,
        maxHeight = _ref8$maxHeight === void 0 ? Infinity : _ref8$maxHeight,
        _ref8$minWidth = _ref8.minWidth,
        minWidth = _ref8$minWidth === void 0 ? 0 : _ref8$minWidth,
        _ref8$minHeight = _ref8.minHeight,
        minHeight = _ref8$minHeight === void 0 ? 0 : _ref8$minHeight;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var maxSizes = getAdjustedSizes({
      aspectRatio: aspectRatio,
      width: maxWidth,
      height: maxHeight
    });
    var minSizes = getAdjustedSizes({
      aspectRatio: aspectRatio,
      width: minWidth,
      height: minHeight
    }, 'cover');
    var width = Math.min(maxSizes.width, Math.max(minSizes.width, naturalWidth));
    var height = Math.min(maxSizes.height, Math.max(minSizes.height, naturalHeight)); // Note: should always use image's natural sizes for drawing as
    // imageData.naturalWidth === canvasData.naturalHeight when rotate % 180 === 90

    var destMaxSizes = getAdjustedSizes({
      aspectRatio: imageAspectRatio,
      width: maxWidth,
      height: maxHeight
    });
    var destMinSizes = getAdjustedSizes({
      aspectRatio: imageAspectRatio,
      width: minWidth,
      height: minHeight
    }, 'cover');
    var destWidth = Math.min(destMaxSizes.width, Math.max(destMinSizes.width, imageNaturalWidth));
    var destHeight = Math.min(destMaxSizes.height, Math.max(destMinSizes.height, imageNaturalHeight));
    var params = [-destWidth / 2, -destHeight / 2, destWidth, destHeight];
    canvas.width = normalizeDecimalNumber(width);
    canvas.height = normalizeDecimalNumber(height);
    context.fillStyle = fillColor;
    context.fillRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    context.rotate(rotate * Math.PI / 180);
    context.scale(scaleX, scaleY);
    context.imageSmoothingEnabled = imageSmoothingEnabled;
    context.imageSmoothingQuality = imageSmoothingQuality;
    context.drawImage.apply(context, [image].concat(_toConsumableArray(params.map(function (param) {
      return Math.floor(normalizeDecimalNumber(param));
    }))));
    context.restore();
    return canvas;
  }
  var fromCharCode = String.fromCharCode;
  /**
   * Get string from char code in data view.
   * @param {DataView} dataView - The data view for read.
   * @param {number} start - The start index.
   * @param {number} length - The read length.
   * @returns {string} The read result.
   */

  function getStringFromCharCode(dataView, start, length) {
    var str = '';
    length += start;

    for (var i = start; i < length; i += 1) {
      str += fromCharCode(dataView.getUint8(i));
    }

    return str;
  }
  var REGEXP_DATA_URL_HEAD = /^data:.*,/;
  /**
   * Transform Data URL to array buffer.
   * @param {string} dataURL - The Data URL to transform.
   * @returns {ArrayBuffer} The result array buffer.
   */

  function dataURLToArrayBuffer(dataURL) {
    var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
    var binary = atob(base64);
    var arrayBuffer = new ArrayBuffer(binary.length);
    var uint8 = new Uint8Array(arrayBuffer);
    forEach(uint8, function (value, i) {
      uint8[i] = binary.charCodeAt(i);
    });
    return arrayBuffer;
  }
  /**
   * Transform array buffer to Data URL.
   * @param {ArrayBuffer} arrayBuffer - The array buffer to transform.
   * @param {string} mimeType - The mime type of the Data URL.
   * @returns {string} The result Data URL.
   */

  function arrayBufferToDataURL(arrayBuffer, mimeType) {
    var chunks = []; // Chunk Typed Array for better performance (#435)

    var chunkSize = 8192;
    var uint8 = new Uint8Array(arrayBuffer);

    while (uint8.length > 0) {
      // XXX: Babel's `toConsumableArray` helper will throw error in IE or Safari 9
      // eslint-disable-next-line prefer-spread
      chunks.push(fromCharCode.apply(null, toArray(uint8.subarray(0, chunkSize))));
      uint8 = uint8.subarray(chunkSize);
    }

    return "data:".concat(mimeType, ";base64,").concat(btoa(chunks.join('')));
  }
  /**
   * Get orientation value from given array buffer.
   * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
   * @returns {number} The read orientation value.
   */

  function resetAndGetOrientation(arrayBuffer) {
    var dataView = new DataView(arrayBuffer);
    var orientation; // Ignores range error when the image does not have correct Exif information

    try {
      var littleEndian;
      var app1Start;
      var ifdStart; // Only handle JPEG image (start by 0xFFD8)

      if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
        var length = dataView.byteLength;
        var offset = 2;

        while (offset + 1 < length) {
          if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
            app1Start = offset;
            break;
          }

          offset += 1;
        }
      }

      if (app1Start) {
        var exifIDCode = app1Start + 4;
        var tiffOffset = app1Start + 10;

        if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
          var endianness = dataView.getUint16(tiffOffset);
          littleEndian = endianness === 0x4949;

          if (littleEndian || endianness === 0x4D4D
          /* bigEndian */
          ) {
              if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
                var firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

                if (firstIFDOffset >= 0x00000008) {
                  ifdStart = tiffOffset + firstIFDOffset;
                }
              }
            }
        }
      }

      if (ifdStart) {
        var _length = dataView.getUint16(ifdStart, littleEndian);

        var _offset;

        var i;

        for (i = 0; i < _length; i += 1) {
          _offset = ifdStart + i * 12 + 2;

          if (dataView.getUint16(_offset, littleEndian) === 0x0112
          /* Orientation */
          ) {
              // 8 is the offset of the current tag's value
              _offset += 8; // Get the original orientation value

              orientation = dataView.getUint16(_offset, littleEndian); // Override the orientation with its default value

              dataView.setUint16(_offset, 1, littleEndian);
              break;
            }
        }
      }
    } catch (error) {
      orientation = 1;
    }

    return orientation;
  }
  /**
   * Parse Exif Orientation value.
   * @param {number} orientation - The orientation to parse.
   * @returns {Object} The parsed result.
   */

  function parseOrientation(orientation) {
    var rotate = 0;
    var scaleX = 1;
    var scaleY = 1;

    switch (orientation) {
      // Flip horizontal
      case 2:
        scaleX = -1;
        break;
      // Rotate left 180°

      case 3:
        rotate = -180;
        break;
      // Flip vertical

      case 4:
        scaleY = -1;
        break;
      // Flip vertical and rotate right 90°

      case 5:
        rotate = 90;
        scaleY = -1;
        break;
      // Rotate right 90°

      case 6:
        rotate = 90;
        break;
      // Flip horizontal and rotate right 90°

      case 7:
        rotate = 90;
        scaleX = -1;
        break;
      // Rotate left 90°

      case 8:
        rotate = -90;
        break;
    }

    return {
      rotate: rotate,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var render = {
    render: function render() {
      this.initContainer();
      this.initCanvas();
      this.initCropBox();
      this.renderCanvas();

      if (this.cropped) {
        this.renderCropBox();
      }
    },
    initContainer: function initContainer() {
      var element = this.element,
          options = this.options,
          container = this.container,
          cropper = this.cropper;
      var minWidth = Number(options.minContainerWidth);
      var minHeight = Number(options.minContainerHeight);
      addClass(cropper, CLASS_HIDDEN);
      removeClass(element, CLASS_HIDDEN);
      var containerData = {
        width: Math.max(container.offsetWidth, minWidth >= 0 ? minWidth : MIN_CONTAINER_WIDTH),
        height: Math.max(container.offsetHeight, minHeight >= 0 ? minHeight : MIN_CONTAINER_HEIGHT)
      };
      this.containerData = containerData;
      setStyle(cropper, {
        width: containerData.width,
        height: containerData.height
      });
      addClass(element, CLASS_HIDDEN);
      removeClass(cropper, CLASS_HIDDEN);
    },
    // Canvas (image wrapper)
    initCanvas: function initCanvas() {
      var containerData = this.containerData,
          imageData = this.imageData;
      var viewMode = this.options.viewMode;
      var rotated = Math.abs(imageData.rotate) % 180 === 90;
      var naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
      var naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;
      var aspectRatio = naturalWidth / naturalHeight;
      var canvasWidth = containerData.width;
      var canvasHeight = containerData.height;

      if (containerData.height * aspectRatio > containerData.width) {
        if (viewMode === 3) {
          canvasWidth = containerData.height * aspectRatio;
        } else {
          canvasHeight = containerData.width / aspectRatio;
        }
      } else if (viewMode === 3) {
        canvasHeight = containerData.width / aspectRatio;
      } else {
        canvasWidth = containerData.height * aspectRatio;
      }

      var canvasData = {
        aspectRatio: aspectRatio,
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        width: canvasWidth,
        height: canvasHeight
      };
      this.canvasData = canvasData;
      this.limited = viewMode === 1 || viewMode === 2;
      this.limitCanvas(true, true);
      canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
      canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);
      canvasData.left = (containerData.width - canvasData.width) / 2;
      canvasData.top = (containerData.height - canvasData.height) / 2;
      canvasData.oldLeft = canvasData.left;
      canvasData.oldTop = canvasData.top;
      this.initialCanvasData = assign({}, canvasData);
    },
    limitCanvas: function limitCanvas(sizeLimited, positionLimited) {
      var options = this.options,
          containerData = this.containerData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData;
      var viewMode = options.viewMode;
      var aspectRatio = canvasData.aspectRatio;
      var cropped = this.cropped && cropBoxData;

      if (sizeLimited) {
        var minCanvasWidth = Number(options.minCanvasWidth) || 0;
        var minCanvasHeight = Number(options.minCanvasHeight) || 0;

        if (viewMode > 1) {
          minCanvasWidth = Math.max(minCanvasWidth, containerData.width);
          minCanvasHeight = Math.max(minCanvasHeight, containerData.height);

          if (viewMode === 3) {
            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
              minCanvasWidth = minCanvasHeight * aspectRatio;
            } else {
              minCanvasHeight = minCanvasWidth / aspectRatio;
            }
          }
        } else if (viewMode > 0) {
          if (minCanvasWidth) {
            minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBoxData.width : 0);
          } else if (minCanvasHeight) {
            minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBoxData.height : 0);
          } else if (cropped) {
            minCanvasWidth = cropBoxData.width;
            minCanvasHeight = cropBoxData.height;

            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
              minCanvasWidth = minCanvasHeight * aspectRatio;
            } else {
              minCanvasHeight = minCanvasWidth / aspectRatio;
            }
          }
        }

        var _getAdjustedSizes = getAdjustedSizes({
          aspectRatio: aspectRatio,
          width: minCanvasWidth,
          height: minCanvasHeight
        });

        minCanvasWidth = _getAdjustedSizes.width;
        minCanvasHeight = _getAdjustedSizes.height;
        canvasData.minWidth = minCanvasWidth;
        canvasData.minHeight = minCanvasHeight;
        canvasData.maxWidth = Infinity;
        canvasData.maxHeight = Infinity;
      }

      if (positionLimited) {
        if (viewMode > (cropped ? 0 : 1)) {
          var newCanvasLeft = containerData.width - canvasData.width;
          var newCanvasTop = containerData.height - canvasData.height;
          canvasData.minLeft = Math.min(0, newCanvasLeft);
          canvasData.minTop = Math.min(0, newCanvasTop);
          canvasData.maxLeft = Math.max(0, newCanvasLeft);
          canvasData.maxTop = Math.max(0, newCanvasTop);

          if (cropped && this.limited) {
            canvasData.minLeft = Math.min(cropBoxData.left, cropBoxData.left + (cropBoxData.width - canvasData.width));
            canvasData.minTop = Math.min(cropBoxData.top, cropBoxData.top + (cropBoxData.height - canvasData.height));
            canvasData.maxLeft = cropBoxData.left;
            canvasData.maxTop = cropBoxData.top;

            if (viewMode === 2) {
              if (canvasData.width >= containerData.width) {
                canvasData.minLeft = Math.min(0, newCanvasLeft);
                canvasData.maxLeft = Math.max(0, newCanvasLeft);
              }

              if (canvasData.height >= containerData.height) {
                canvasData.minTop = Math.min(0, newCanvasTop);
                canvasData.maxTop = Math.max(0, newCanvasTop);
              }
            }
          }
        } else {
          canvasData.minLeft = -canvasData.width;
          canvasData.minTop = -canvasData.height;
          canvasData.maxLeft = containerData.width;
          canvasData.maxTop = containerData.height;
        }
      }
    },
    renderCanvas: function renderCanvas(changed, transformed) {
      var canvasData = this.canvasData,
          imageData = this.imageData;

      if (transformed) {
        var _getRotatedSizes = getRotatedSizes({
          width: imageData.naturalWidth * Math.abs(imageData.scaleX || 1),
          height: imageData.naturalHeight * Math.abs(imageData.scaleY || 1),
          degree: imageData.rotate || 0
        }),
            naturalWidth = _getRotatedSizes.width,
            naturalHeight = _getRotatedSizes.height;

        var width = canvasData.width * (naturalWidth / canvasData.naturalWidth);
        var height = canvasData.height * (naturalHeight / canvasData.naturalHeight);
        canvasData.left -= (width - canvasData.width) / 2;
        canvasData.top -= (height - canvasData.height) / 2;
        canvasData.width = width;
        canvasData.height = height;
        canvasData.aspectRatio = naturalWidth / naturalHeight;
        canvasData.naturalWidth = naturalWidth;
        canvasData.naturalHeight = naturalHeight;
        this.limitCanvas(true, false);
      }

      if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
        canvasData.left = canvasData.oldLeft;
      }

      if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
        canvasData.top = canvasData.oldTop;
      }

      canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
      canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);
      this.limitCanvas(false, true);
      canvasData.left = Math.min(Math.max(canvasData.left, canvasData.minLeft), canvasData.maxLeft);
      canvasData.top = Math.min(Math.max(canvasData.top, canvasData.minTop), canvasData.maxTop);
      canvasData.oldLeft = canvasData.left;
      canvasData.oldTop = canvasData.top;
      setStyle(this.canvas, assign({
        width: canvasData.width,
        height: canvasData.height
      }, getTransforms({
        translateX: canvasData.left,
        translateY: canvasData.top
      })));
      this.renderImage(changed);

      if (this.cropped && this.limited) {
        this.limitCropBox(true, true);
      }
    },
    renderImage: function renderImage(changed) {
      var canvasData = this.canvasData,
          imageData = this.imageData;
      var width = imageData.naturalWidth * (canvasData.width / canvasData.naturalWidth);
      var height = imageData.naturalHeight * (canvasData.height / canvasData.naturalHeight);
      assign(imageData, {
        width: width,
        height: height,
        left: (canvasData.width - width) / 2,
        top: (canvasData.height - height) / 2
      });
      setStyle(this.image, assign({
        width: imageData.width,
        height: imageData.height
      }, getTransforms(assign({
        translateX: imageData.left,
        translateY: imageData.top
      }, imageData))));

      if (changed) {
        this.output();
      }
    },
    initCropBox: function initCropBox() {
      var options = this.options,
          canvasData = this.canvasData;
      var aspectRatio = options.aspectRatio || options.initialAspectRatio;
      var autoCropArea = Number(options.autoCropArea) || 0.8;
      var cropBoxData = {
        width: canvasData.width,
        height: canvasData.height
      };

      if (aspectRatio) {
        if (canvasData.height * aspectRatio > canvasData.width) {
          cropBoxData.height = cropBoxData.width / aspectRatio;
        } else {
          cropBoxData.width = cropBoxData.height * aspectRatio;
        }
      }

      this.cropBoxData = cropBoxData;
      this.limitCropBox(true, true); // Initialize auto crop area

      cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
      cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight); // The width/height of auto crop area must large than "minWidth/Height"

      cropBoxData.width = Math.max(cropBoxData.minWidth, cropBoxData.width * autoCropArea);
      cropBoxData.height = Math.max(cropBoxData.minHeight, cropBoxData.height * autoCropArea);
      cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
      cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;
      cropBoxData.oldLeft = cropBoxData.left;
      cropBoxData.oldTop = cropBoxData.top;
      this.initialCropBoxData = assign({}, cropBoxData);
    },
    limitCropBox: function limitCropBox(sizeLimited, positionLimited) {
      var options = this.options,
          containerData = this.containerData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData,
          limited = this.limited;
      var aspectRatio = options.aspectRatio;

      if (sizeLimited) {
        var minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
        var minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
        var maxCropBoxWidth = limited ? Math.min(containerData.width, canvasData.width, canvasData.width + canvasData.left, containerData.width - canvasData.left) : containerData.width;
        var maxCropBoxHeight = limited ? Math.min(containerData.height, canvasData.height, canvasData.height + canvasData.top, containerData.height - canvasData.top) : containerData.height; // The min/maxCropBoxWidth/Height must be less than container's width/height

        minCropBoxWidth = Math.min(minCropBoxWidth, containerData.width);
        minCropBoxHeight = Math.min(minCropBoxHeight, containerData.height);

        if (aspectRatio) {
          if (minCropBoxWidth && minCropBoxHeight) {
            if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
              minCropBoxHeight = minCropBoxWidth / aspectRatio;
            } else {
              minCropBoxWidth = minCropBoxHeight * aspectRatio;
            }
          } else if (minCropBoxWidth) {
            minCropBoxHeight = minCropBoxWidth / aspectRatio;
          } else if (minCropBoxHeight) {
            minCropBoxWidth = minCropBoxHeight * aspectRatio;
          }

          if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
            maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
          } else {
            maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
          }
        } // The minWidth/Height must be less than maxWidth/Height


        cropBoxData.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
        cropBoxData.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
        cropBoxData.maxWidth = maxCropBoxWidth;
        cropBoxData.maxHeight = maxCropBoxHeight;
      }

      if (positionLimited) {
        if (limited) {
          cropBoxData.minLeft = Math.max(0, canvasData.left);
          cropBoxData.minTop = Math.max(0, canvasData.top);
          cropBoxData.maxLeft = Math.min(containerData.width, canvasData.left + canvasData.width) - cropBoxData.width;
          cropBoxData.maxTop = Math.min(containerData.height, canvasData.top + canvasData.height) - cropBoxData.height;
        } else {
          cropBoxData.minLeft = 0;
          cropBoxData.minTop = 0;
          cropBoxData.maxLeft = containerData.width - cropBoxData.width;
          cropBoxData.maxTop = containerData.height - cropBoxData.height;
        }
      }
    },
    renderCropBox: function renderCropBox() {
      var options = this.options,
          containerData = this.containerData,
          cropBoxData = this.cropBoxData;

      if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
        cropBoxData.left = cropBoxData.oldLeft;
      }

      if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
        cropBoxData.top = cropBoxData.oldTop;
      }

      cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
      cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
      this.limitCropBox(false, true);
      cropBoxData.left = Math.min(Math.max(cropBoxData.left, cropBoxData.minLeft), cropBoxData.maxLeft);
      cropBoxData.top = Math.min(Math.max(cropBoxData.top, cropBoxData.minTop), cropBoxData.maxTop);
      cropBoxData.oldLeft = cropBoxData.left;
      cropBoxData.oldTop = cropBoxData.top;

      if (options.movable && options.cropBoxMovable) {
        // Turn to move the canvas when the crop box is equal to the container
        setData(this.face, DATA_ACTION, cropBoxData.width >= containerData.width && cropBoxData.height >= containerData.height ? ACTION_MOVE : ACTION_ALL);
      }

      setStyle(this.cropBox, assign({
        width: cropBoxData.width,
        height: cropBoxData.height
      }, getTransforms({
        translateX: cropBoxData.left,
        translateY: cropBoxData.top
      })));

      if (this.cropped && this.limited) {
        this.limitCanvas(true, true);
      }

      if (!this.disabled) {
        this.output();
      }
    },
    output: function output() {
      this.preview();
      dispatchEvent(this.element, EVENT_CROP, this.getData());
    }
  };

  var preview = {
    initPreview: function initPreview() {
      var element = this.element,
          crossOrigin = this.crossOrigin;
      var preview = this.options.preview;
      var url = crossOrigin ? this.crossOriginUrl : this.url;
      var alt = element.alt || 'The image to preview';
      var image = document.createElement('img');

      if (crossOrigin) {
        image.crossOrigin = crossOrigin;
      }

      image.src = url;
      image.alt = alt;
      this.viewBox.appendChild(image);
      this.viewBoxImage = image;

      if (!preview) {
        return;
      }

      var previews = preview;

      if (typeof preview === 'string') {
        previews = element.ownerDocument.querySelectorAll(preview);
      } else if (preview.querySelector) {
        previews = [preview];
      }

      this.previews = previews;
      forEach(previews, function (el) {
        var img = document.createElement('img'); // Save the original size for recover

        setData(el, DATA_PREVIEW, {
          width: el.offsetWidth,
          height: el.offsetHeight,
          html: el.innerHTML
        });

        if (crossOrigin) {
          img.crossOrigin = crossOrigin;
        }

        img.src = url;
        img.alt = alt;
        /**
         * Override img element styles
         * Add `display:block` to avoid margin top issue
         * Add `height:auto` to override `height` attribute on IE8
         * (Occur only when margin-top <= -height)
         */

        img.style.cssText = 'display:block;' + 'width:100%;' + 'height:auto;' + 'min-width:0!important;' + 'min-height:0!important;' + 'max-width:none!important;' + 'max-height:none!important;' + 'image-orientation:0deg!important;"';
        el.innerHTML = '';
        el.appendChild(img);
      });
    },
    resetPreview: function resetPreview() {
      forEach(this.previews, function (element) {
        var data = getData(element, DATA_PREVIEW);
        setStyle(element, {
          width: data.width,
          height: data.height
        });
        element.innerHTML = data.html;
        removeData(element, DATA_PREVIEW);
      });
    },
    preview: function preview() {
      var imageData = this.imageData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData;
      var cropBoxWidth = cropBoxData.width,
          cropBoxHeight = cropBoxData.height;
      var width = imageData.width,
          height = imageData.height;
      var left = cropBoxData.left - canvasData.left - imageData.left;
      var top = cropBoxData.top - canvasData.top - imageData.top;

      if (!this.cropped || this.disabled) {
        return;
      }

      setStyle(this.viewBoxImage, assign({
        width: width,
        height: height
      }, getTransforms(assign({
        translateX: -left,
        translateY: -top
      }, imageData))));
      forEach(this.previews, function (element) {
        var data = getData(element, DATA_PREVIEW);
        var originalWidth = data.width;
        var originalHeight = data.height;
        var newWidth = originalWidth;
        var newHeight = originalHeight;
        var ratio = 1;

        if (cropBoxWidth) {
          ratio = originalWidth / cropBoxWidth;
          newHeight = cropBoxHeight * ratio;
        }

        if (cropBoxHeight && newHeight > originalHeight) {
          ratio = originalHeight / cropBoxHeight;
          newWidth = cropBoxWidth * ratio;
          newHeight = originalHeight;
        }

        setStyle(element, {
          width: newWidth,
          height: newHeight
        });
        setStyle(element.getElementsByTagName('img')[0], assign({
          width: width * ratio,
          height: height * ratio
        }, getTransforms(assign({
          translateX: -left * ratio,
          translateY: -top * ratio
        }, imageData))));
      });
    }
  };

  var events = {
    bind: function bind() {
      var element = this.element,
          options = this.options,
          cropper = this.cropper;

      if (isFunction(options.cropstart)) {
        addListener(element, EVENT_CROP_START, options.cropstart);
      }

      if (isFunction(options.cropmove)) {
        addListener(element, EVENT_CROP_MOVE, options.cropmove);
      }

      if (isFunction(options.cropend)) {
        addListener(element, EVENT_CROP_END, options.cropend);
      }

      if (isFunction(options.crop)) {
        addListener(element, EVENT_CROP, options.crop);
      }

      if (isFunction(options.zoom)) {
        addListener(element, EVENT_ZOOM, options.zoom);
      }

      addListener(cropper, EVENT_POINTER_DOWN, this.onCropStart = this.cropStart.bind(this));

      if (options.zoomable && options.zoomOnWheel) {
        addListener(cropper, EVENT_WHEEL, this.onWheel = this.wheel.bind(this), {
          passive: false,
          capture: true
        });
      }

      if (options.toggleDragModeOnDblclick) {
        addListener(cropper, EVENT_DBLCLICK, this.onDblclick = this.dblclick.bind(this));
      }

      addListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove = this.cropMove.bind(this));
      addListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd = this.cropEnd.bind(this));

      if (options.responsive) {
        addListener(window, EVENT_RESIZE, this.onResize = this.resize.bind(this));
      }
    },
    unbind: function unbind() {
      var element = this.element,
          options = this.options,
          cropper = this.cropper;

      if (isFunction(options.cropstart)) {
        removeListener(element, EVENT_CROP_START, options.cropstart);
      }

      if (isFunction(options.cropmove)) {
        removeListener(element, EVENT_CROP_MOVE, options.cropmove);
      }

      if (isFunction(options.cropend)) {
        removeListener(element, EVENT_CROP_END, options.cropend);
      }

      if (isFunction(options.crop)) {
        removeListener(element, EVENT_CROP, options.crop);
      }

      if (isFunction(options.zoom)) {
        removeListener(element, EVENT_ZOOM, options.zoom);
      }

      removeListener(cropper, EVENT_POINTER_DOWN, this.onCropStart);

      if (options.zoomable && options.zoomOnWheel) {
        removeListener(cropper, EVENT_WHEEL, this.onWheel, {
          passive: false,
          capture: true
        });
      }

      if (options.toggleDragModeOnDblclick) {
        removeListener(cropper, EVENT_DBLCLICK, this.onDblclick);
      }

      removeListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove);
      removeListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd);

      if (options.responsive) {
        removeListener(window, EVENT_RESIZE, this.onResize);
      }
    }
  };

  var handlers = {
    resize: function resize() {
      if (this.disabled) {
        return;
      }

      var options = this.options,
          container = this.container,
          containerData = this.containerData;
      var ratioX = container.offsetWidth / containerData.width;
      var ratioY = container.offsetHeight / containerData.height;
      var ratio = Math.abs(ratioX - 1) > Math.abs(ratioY - 1) ? ratioX : ratioY; // Resize when width changed or height changed

      if (ratio !== 1) {
        var canvasData;
        var cropBoxData;

        if (options.restore) {
          canvasData = this.getCanvasData();
          cropBoxData = this.getCropBoxData();
        }

        this.render();

        if (options.restore) {
          this.setCanvasData(forEach(canvasData, function (n, i) {
            canvasData[i] = n * ratio;
          }));
          this.setCropBoxData(forEach(cropBoxData, function (n, i) {
            cropBoxData[i] = n * ratio;
          }));
        }
      }
    },
    dblclick: function dblclick() {
      if (this.disabled || this.options.dragMode === DRAG_MODE_NONE) {
        return;
      }

      this.setDragMode(hasClass(this.dragBox, CLASS_CROP) ? DRAG_MODE_MOVE : DRAG_MODE_CROP);
    },
    wheel: function wheel(event) {
      var _this = this;

      var ratio = Number(this.options.wheelZoomRatio) || 0.1;
      var delta = 1;

      if (this.disabled) {
        return;
      }

      event.preventDefault(); // Limit wheel speed to prevent zoom too fast (#21)

      if (this.wheeling) {
        return;
      }

      this.wheeling = true;
      setTimeout(function () {
        _this.wheeling = false;
      }, 50);

      if (event.deltaY) {
        delta = event.deltaY > 0 ? 1 : -1;
      } else if (event.wheelDelta) {
        delta = -event.wheelDelta / 120;
      } else if (event.detail) {
        delta = event.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * ratio, event);
    },
    cropStart: function cropStart(event) {
      var buttons = event.buttons,
          button = event.button;

      if (this.disabled // Handle mouse event and pointer event and ignore touch event
      || (event.type === 'mousedown' || event.type === 'pointerdown' && event.pointerType === 'mouse') && ( // No primary button (Usually the left button)
      isNumber(buttons) && buttons !== 1 || isNumber(button) && button !== 0 // Open context menu
      || event.ctrlKey)) {
        return;
      }

      var options = this.options,
          pointers = this.pointers;
      var action;

      if (event.changedTouches) {
        // Handle touch event
        forEach(event.changedTouches, function (touch) {
          pointers[touch.identifier] = getPointer(touch);
        });
      } else {
        // Handle mouse event and pointer event
        pointers[event.pointerId || 0] = getPointer(event);
      }

      if (Object.keys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
        action = ACTION_ZOOM;
      } else {
        action = getData(event.target, DATA_ACTION);
      }

      if (!REGEXP_ACTIONS.test(action)) {
        return;
      }

      if (dispatchEvent(this.element, EVENT_CROP_START, {
        originalEvent: event,
        action: action
      }) === false) {
        return;
      } // This line is required for preventing page zooming in iOS browsers


      event.preventDefault();
      this.action = action;
      this.cropping = false;

      if (action === ACTION_CROP) {
        this.cropping = true;
        addClass(this.dragBox, CLASS_MODAL);
      }
    },
    cropMove: function cropMove(event) {
      var action = this.action;

      if (this.disabled || !action) {
        return;
      }

      var pointers = this.pointers;
      event.preventDefault();

      if (dispatchEvent(this.element, EVENT_CROP_MOVE, {
        originalEvent: event,
        action: action
      }) === false) {
        return;
      }

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          // The first parameter should not be undefined (#432)
          assign(pointers[touch.identifier] || {}, getPointer(touch, true));
        });
      } else {
        assign(pointers[event.pointerId || 0] || {}, getPointer(event, true));
      }

      this.change(event);
    },
    cropEnd: function cropEnd(event) {
      if (this.disabled) {
        return;
      }

      var action = this.action,
          pointers = this.pointers;

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          delete pointers[touch.identifier];
        });
      } else {
        delete pointers[event.pointerId || 0];
      }

      if (!action) {
        return;
      }

      event.preventDefault();

      if (!Object.keys(pointers).length) {
        this.action = '';
      }

      if (this.cropping) {
        this.cropping = false;
        toggleClass(this.dragBox, CLASS_MODAL, this.cropped && this.options.modal);
      }

      dispatchEvent(this.element, EVENT_CROP_END, {
        originalEvent: event,
        action: action
      });
    }
  };

  var change = {
    change: function change(event) {
      var options = this.options,
          canvasData = this.canvasData,
          containerData = this.containerData,
          cropBoxData = this.cropBoxData,
          pointers = this.pointers;
      var action = this.action;
      var aspectRatio = options.aspectRatio;
      var left = cropBoxData.left,
          top = cropBoxData.top,
          width = cropBoxData.width,
          height = cropBoxData.height;
      var right = left + width;
      var bottom = top + height;
      var minLeft = 0;
      var minTop = 0;
      var maxWidth = containerData.width;
      var maxHeight = containerData.height;
      var renderable = true;
      var offset; // Locking aspect ratio in "free mode" by holding shift key

      if (!aspectRatio && event.shiftKey) {
        aspectRatio = width && height ? width / height : 1;
      }

      if (this.limited) {
        minLeft = cropBoxData.minLeft;
        minTop = cropBoxData.minTop;
        maxWidth = minLeft + Math.min(containerData.width, canvasData.width, canvasData.left + canvasData.width);
        maxHeight = minTop + Math.min(containerData.height, canvasData.height, canvasData.top + canvasData.height);
      }

      var pointer = pointers[Object.keys(pointers)[0]];
      var range = {
        x: pointer.endX - pointer.startX,
        y: pointer.endY - pointer.startY
      };

      var check = function check(side) {
        switch (side) {
          case ACTION_EAST:
            if (right + range.x > maxWidth) {
              range.x = maxWidth - right;
            }

            break;

          case ACTION_WEST:
            if (left + range.x < minLeft) {
              range.x = minLeft - left;
            }

            break;

          case ACTION_NORTH:
            if (top + range.y < minTop) {
              range.y = minTop - top;
            }

            break;

          case ACTION_SOUTH:
            if (bottom + range.y > maxHeight) {
              range.y = maxHeight - bottom;
            }

            break;
        }
      };

      switch (action) {
        // Move crop box
        case ACTION_ALL:
          left += range.x;
          top += range.y;
          break;
        // Resize crop box

        case ACTION_EAST:
          if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
            renderable = false;
            break;
          }

          check(ACTION_EAST);
          width += range.x;

          if (width < 0) {
            action = ACTION_WEST;
            width = -width;
            left -= width;
          }

          if (aspectRatio) {
            height = width / aspectRatio;
            top += (cropBoxData.height - height) / 2;
          }

          break;

        case ACTION_NORTH:
          if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
            renderable = false;
            break;
          }

          check(ACTION_NORTH);
          height -= range.y;
          top += range.y;

          if (height < 0) {
            action = ACTION_SOUTH;
            height = -height;
            top -= height;
          }

          if (aspectRatio) {
            width = height * aspectRatio;
            left += (cropBoxData.width - width) / 2;
          }

          break;

        case ACTION_WEST:
          if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
            renderable = false;
            break;
          }

          check(ACTION_WEST);
          width -= range.x;
          left += range.x;

          if (width < 0) {
            action = ACTION_EAST;
            width = -width;
            left -= width;
          }

          if (aspectRatio) {
            height = width / aspectRatio;
            top += (cropBoxData.height - height) / 2;
          }

          break;

        case ACTION_SOUTH:
          if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
            renderable = false;
            break;
          }

          check(ACTION_SOUTH);
          height += range.y;

          if (height < 0) {
            action = ACTION_NORTH;
            height = -height;
            top -= height;
          }

          if (aspectRatio) {
            width = height * aspectRatio;
            left += (cropBoxData.width - width) / 2;
          }

          break;

        case ACTION_NORTH_EAST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
              renderable = false;
              break;
            }

            check(ACTION_NORTH);
            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
          } else {
            check(ACTION_NORTH);
            check(ACTION_EAST);

            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_WEST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_NORTH_WEST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_SOUTH_EAST;
            height = -height;
            top -= height;
          }

          break;

        case ACTION_NORTH_WEST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
              renderable = false;
              break;
            }

            check(ACTION_NORTH);
            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
            left += cropBoxData.width - width;
          } else {
            check(ACTION_NORTH);
            check(ACTION_WEST);

            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_EAST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_NORTH_EAST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_SOUTH_WEST;
            height = -height;
            top -= height;
          }

          break;

        case ACTION_SOUTH_WEST:
          if (aspectRatio) {
            if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            check(ACTION_WEST);
            width -= range.x;
            left += range.x;
            height = width / aspectRatio;
          } else {
            check(ACTION_SOUTH);
            check(ACTION_WEST);

            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_EAST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_SOUTH_EAST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_NORTH_WEST;
            height = -height;
            top -= height;
          }

          break;

        case ACTION_SOUTH_EAST:
          if (aspectRatio) {
            if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            check(ACTION_EAST);
            width += range.x;
            height = width / aspectRatio;
          } else {
            check(ACTION_SOUTH);
            check(ACTION_EAST);

            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_WEST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_SOUTH_WEST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_NORTH_EAST;
            height = -height;
            top -= height;
          }

          break;
        // Move canvas

        case ACTION_MOVE:
          this.move(range.x, range.y);
          renderable = false;
          break;
        // Zoom canvas

        case ACTION_ZOOM:
          this.zoom(getMaxZoomRatio(pointers), event);
          renderable = false;
          break;
        // Create crop box

        case ACTION_CROP:
          if (!range.x || !range.y) {
            renderable = false;
            break;
          }

          offset = getOffset(this.cropper);
          left = pointer.startX - offset.left;
          top = pointer.startY - offset.top;
          width = cropBoxData.minWidth;
          height = cropBoxData.minHeight;

          if (range.x > 0) {
            action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
          } else if (range.x < 0) {
            left -= width;
            action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
          }

          if (range.y < 0) {
            top -= height;
          } // Show the crop box if is hidden


          if (!this.cropped) {
            removeClass(this.cropBox, CLASS_HIDDEN);
            this.cropped = true;

            if (this.limited) {
              this.limitCropBox(true, true);
            }
          }

          break;
      }

      if (renderable) {
        cropBoxData.width = width;
        cropBoxData.height = height;
        cropBoxData.left = left;
        cropBoxData.top = top;
        this.action = action;
        this.renderCropBox();
      } // Override


      forEach(pointers, function (p) {
        p.startX = p.endX;
        p.startY = p.endY;
      });
    }
  };

  var methods = {
    // Show the crop box manually
    crop: function crop() {
      if (this.ready && !this.cropped && !this.disabled) {
        this.cropped = true;
        this.limitCropBox(true, true);

        if (this.options.modal) {
          addClass(this.dragBox, CLASS_MODAL);
        }

        removeClass(this.cropBox, CLASS_HIDDEN);
        this.setCropBoxData(this.initialCropBoxData);
      }

      return this;
    },
    // Reset the image and crop box to their initial states
    reset: function reset() {
      if (this.ready && !this.disabled) {
        this.imageData = assign({}, this.initialImageData);
        this.canvasData = assign({}, this.initialCanvasData);
        this.cropBoxData = assign({}, this.initialCropBoxData);
        this.renderCanvas();

        if (this.cropped) {
          this.renderCropBox();
        }
      }

      return this;
    },
    // Clear the crop box
    clear: function clear() {
      if (this.cropped && !this.disabled) {
        assign(this.cropBoxData, {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        });
        this.cropped = false;
        this.renderCropBox();
        this.limitCanvas(true, true); // Render canvas after crop box rendered

        this.renderCanvas();
        removeClass(this.dragBox, CLASS_MODAL);
        addClass(this.cropBox, CLASS_HIDDEN);
      }

      return this;
    },

    /**
     * Replace the image's src and rebuild the cropper
     * @param {string} url - The new URL.
     * @param {boolean} [hasSameSize] - Indicate if the new image has the same size as the old one.
     * @returns {Cropper} this
     */
    replace: function replace(url) {
      var hasSameSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!this.disabled && url) {
        if (this.isImg) {
          this.element.src = url;
        }

        if (hasSameSize) {
          this.url = url;
          this.image.src = url;

          if (this.ready) {
            this.viewBoxImage.src = url;
            forEach(this.previews, function (element) {
              element.getElementsByTagName('img')[0].src = url;
            });
          }
        } else {
          if (this.isImg) {
            this.replaced = true;
          }

          this.options.data = null;
          this.uncreate();
          this.load(url);
        }
      }

      return this;
    },
    // Enable (unfreeze) the cropper
    enable: function enable() {
      if (this.ready && this.disabled) {
        this.disabled = false;
        removeClass(this.cropper, CLASS_DISABLED);
      }

      return this;
    },
    // Disable (freeze) the cropper
    disable: function disable() {
      if (this.ready && !this.disabled) {
        this.disabled = true;
        addClass(this.cropper, CLASS_DISABLED);
      }

      return this;
    },

    /**
     * Destroy the cropper and remove the instance from the image
     * @returns {Cropper} this
     */
    destroy: function destroy() {
      var element = this.element;

      if (!element[NAMESPACE]) {
        return this;
      }

      element[NAMESPACE] = undefined;

      if (this.isImg && this.replaced) {
        element.src = this.originalUrl;
      }

      this.uncreate();
      return this;
    },

    /**
     * Move the canvas with relative offsets
     * @param {number} offsetX - The relative offset distance on the x-axis.
     * @param {number} [offsetY=offsetX] - The relative offset distance on the y-axis.
     * @returns {Cropper} this
     */
    move: function move(offsetX) {
      var offsetY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : offsetX;
      var _this$canvasData = this.canvasData,
          left = _this$canvasData.left,
          top = _this$canvasData.top;
      return this.moveTo(isUndefined(offsetX) ? offsetX : left + Number(offsetX), isUndefined(offsetY) ? offsetY : top + Number(offsetY));
    },

    /**
     * Move the canvas to an absolute point
     * @param {number} x - The x-axis coordinate.
     * @param {number} [y=x] - The y-axis coordinate.
     * @returns {Cropper} this
     */
    moveTo: function moveTo(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
      var canvasData = this.canvasData;
      var changed = false;
      x = Number(x);
      y = Number(y);

      if (this.ready && !this.disabled && this.options.movable) {
        if (isNumber(x)) {
          canvasData.left = x;
          changed = true;
        }

        if (isNumber(y)) {
          canvasData.top = y;
          changed = true;
        }

        if (changed) {
          this.renderCanvas(true);
        }
      }

      return this;
    },

    /**
     * Zoom the canvas with a relative ratio
     * @param {number} ratio - The target ratio.
     * @param {Event} _originalEvent - The original event if any.
     * @returns {Cropper} this
     */
    zoom: function zoom(ratio, _originalEvent) {
      var canvasData = this.canvasData;
      ratio = Number(ratio);

      if (ratio < 0) {
        ratio = 1 / (1 - ratio);
      } else {
        ratio = 1 + ratio;
      }

      return this.zoomTo(canvasData.width * ratio / canvasData.naturalWidth, null, _originalEvent);
    },

    /**
     * Zoom the canvas to an absolute ratio
     * @param {number} ratio - The target ratio.
     * @param {Object} pivot - The zoom pivot point coordinate.
     * @param {Event} _originalEvent - The original event if any.
     * @returns {Cropper} this
     */
    zoomTo: function zoomTo(ratio, pivot, _originalEvent) {
      var options = this.options,
          canvasData = this.canvasData;
      var width = canvasData.width,
          height = canvasData.height,
          naturalWidth = canvasData.naturalWidth,
          naturalHeight = canvasData.naturalHeight;
      ratio = Number(ratio);

      if (ratio >= 0 && this.ready && !this.disabled && options.zoomable) {
        var newWidth = naturalWidth * ratio;
        var newHeight = naturalHeight * ratio;

        if (dispatchEvent(this.element, EVENT_ZOOM, {
          ratio: ratio,
          oldRatio: width / naturalWidth,
          originalEvent: _originalEvent
        }) === false) {
          return this;
        }

        if (_originalEvent) {
          var pointers = this.pointers;
          var offset = getOffset(this.cropper);
          var center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
            pageX: _originalEvent.pageX,
            pageY: _originalEvent.pageY
          }; // Zoom from the triggering point of the event

          canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
          canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
        } else if (isPlainObject(pivot) && isNumber(pivot.x) && isNumber(pivot.y)) {
          canvasData.left -= (newWidth - width) * ((pivot.x - canvasData.left) / width);
          canvasData.top -= (newHeight - height) * ((pivot.y - canvasData.top) / height);
        } else {
          // Zoom from the center of the canvas
          canvasData.left -= (newWidth - width) / 2;
          canvasData.top -= (newHeight - height) / 2;
        }

        canvasData.width = newWidth;
        canvasData.height = newHeight;
        this.renderCanvas(true);
      }

      return this;
    },

    /**
     * Rotate the canvas with a relative degree
     * @param {number} degree - The rotate degree.
     * @returns {Cropper} this
     */
    rotate: function rotate(degree) {
      return this.rotateTo((this.imageData.rotate || 0) + Number(degree));
    },

    /**
     * Rotate the canvas to an absolute degree
     * @param {number} degree - The rotate degree.
     * @returns {Cropper} this
     */
    rotateTo: function rotateTo(degree) {
      degree = Number(degree);

      if (isNumber(degree) && this.ready && !this.disabled && this.options.rotatable) {
        this.imageData.rotate = degree % 360;
        this.renderCanvas(true, true);
      }

      return this;
    },

    /**
     * Scale the image on the x-axis.
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @returns {Cropper} this
     */
    scaleX: function scaleX(_scaleX) {
      var scaleY = this.imageData.scaleY;
      return this.scale(_scaleX, isNumber(scaleY) ? scaleY : 1);
    },

    /**
     * Scale the image on the y-axis.
     * @param {number} scaleY - The scale ratio on the y-axis.
     * @returns {Cropper} this
     */
    scaleY: function scaleY(_scaleY) {
      var scaleX = this.imageData.scaleX;
      return this.scale(isNumber(scaleX) ? scaleX : 1, _scaleY);
    },

    /**
     * Scale the image
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
     * @returns {Cropper} this
     */
    scale: function scale(scaleX) {
      var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scaleX;
      var imageData = this.imageData;
      var transformed = false;
      scaleX = Number(scaleX);
      scaleY = Number(scaleY);

      if (this.ready && !this.disabled && this.options.scalable) {
        if (isNumber(scaleX)) {
          imageData.scaleX = scaleX;
          transformed = true;
        }

        if (isNumber(scaleY)) {
          imageData.scaleY = scaleY;
          transformed = true;
        }

        if (transformed) {
          this.renderCanvas(true, true);
        }
      }

      return this;
    },

    /**
     * Get the cropped area position and size data (base on the original image)
     * @param {boolean} [rounded=false] - Indicate if round the data values or not.
     * @returns {Object} The result cropped data.
     */
    getData: function getData() {
      var rounded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var options = this.options,
          imageData = this.imageData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData;
      var data;

      if (this.ready && this.cropped) {
        data = {
          x: cropBoxData.left - canvasData.left,
          y: cropBoxData.top - canvasData.top,
          width: cropBoxData.width,
          height: cropBoxData.height
        };
        var ratio = imageData.width / imageData.naturalWidth;
        forEach(data, function (n, i) {
          data[i] = n / ratio;
        });

        if (rounded) {
          // In case rounding off leads to extra 1px in right or bottom border
          // we should round the top-left corner and the dimension (#343).
          var bottom = Math.round(data.y + data.height);
          var right = Math.round(data.x + data.width);
          data.x = Math.round(data.x);
          data.y = Math.round(data.y);
          data.width = right - data.x;
          data.height = bottom - data.y;
        }
      } else {
        data = {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        };
      }

      if (options.rotatable) {
        data.rotate = imageData.rotate || 0;
      }

      if (options.scalable) {
        data.scaleX = imageData.scaleX || 1;
        data.scaleY = imageData.scaleY || 1;
      }

      return data;
    },

    /**
     * Set the cropped area position and size with new data
     * @param {Object} data - The new data.
     * @returns {Cropper} this
     */
    setData: function setData(data) {
      var options = this.options,
          imageData = this.imageData,
          canvasData = this.canvasData;
      var cropBoxData = {};

      if (this.ready && !this.disabled && isPlainObject(data)) {
        var transformed = false;

        if (options.rotatable) {
          if (isNumber(data.rotate) && data.rotate !== imageData.rotate) {
            imageData.rotate = data.rotate;
            transformed = true;
          }
        }

        if (options.scalable) {
          if (isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
            imageData.scaleX = data.scaleX;
            transformed = true;
          }

          if (isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
            imageData.scaleY = data.scaleY;
            transformed = true;
          }
        }

        if (transformed) {
          this.renderCanvas(true, true);
        }

        var ratio = imageData.width / imageData.naturalWidth;

        if (isNumber(data.x)) {
          cropBoxData.left = data.x * ratio + canvasData.left;
        }

        if (isNumber(data.y)) {
          cropBoxData.top = data.y * ratio + canvasData.top;
        }

        if (isNumber(data.width)) {
          cropBoxData.width = data.width * ratio;
        }

        if (isNumber(data.height)) {
          cropBoxData.height = data.height * ratio;
        }

        this.setCropBoxData(cropBoxData);
      }

      return this;
    },

    /**
     * Get the container size data.
     * @returns {Object} The result container data.
     */
    getContainerData: function getContainerData() {
      return this.ready ? assign({}, this.containerData) : {};
    },

    /**
     * Get the image position and size data.
     * @returns {Object} The result image data.
     */
    getImageData: function getImageData() {
      return this.sized ? assign({}, this.imageData) : {};
    },

    /**
     * Get the canvas position and size data.
     * @returns {Object} The result canvas data.
     */
    getCanvasData: function getCanvasData() {
      var canvasData = this.canvasData;
      var data = {};

      if (this.ready) {
        forEach(['left', 'top', 'width', 'height', 'naturalWidth', 'naturalHeight'], function (n) {
          data[n] = canvasData[n];
        });
      }

      return data;
    },

    /**
     * Set the canvas position and size with new data.
     * @param {Object} data - The new canvas data.
     * @returns {Cropper} this
     */
    setCanvasData: function setCanvasData(data) {
      var canvasData = this.canvasData;
      var aspectRatio = canvasData.aspectRatio;

      if (this.ready && !this.disabled && isPlainObject(data)) {
        if (isNumber(data.left)) {
          canvasData.left = data.left;
        }

        if (isNumber(data.top)) {
          canvasData.top = data.top;
        }

        if (isNumber(data.width)) {
          canvasData.width = data.width;
          canvasData.height = data.width / aspectRatio;
        } else if (isNumber(data.height)) {
          canvasData.height = data.height;
          canvasData.width = data.height * aspectRatio;
        }

        this.renderCanvas(true);
      }

      return this;
    },

    /**
     * Get the crop box position and size data.
     * @returns {Object} The result crop box data.
     */
    getCropBoxData: function getCropBoxData() {
      var cropBoxData = this.cropBoxData;
      var data;

      if (this.ready && this.cropped) {
        data = {
          left: cropBoxData.left,
          top: cropBoxData.top,
          width: cropBoxData.width,
          height: cropBoxData.height
        };
      }

      return data || {};
    },

    /**
     * Set the crop box position and size with new data.
     * @param {Object} data - The new crop box data.
     * @returns {Cropper} this
     */
    setCropBoxData: function setCropBoxData(data) {
      var cropBoxData = this.cropBoxData;
      var aspectRatio = this.options.aspectRatio;
      var widthChanged;
      var heightChanged;

      if (this.ready && this.cropped && !this.disabled && isPlainObject(data)) {
        if (isNumber(data.left)) {
          cropBoxData.left = data.left;
        }

        if (isNumber(data.top)) {
          cropBoxData.top = data.top;
        }

        if (isNumber(data.width) && data.width !== cropBoxData.width) {
          widthChanged = true;
          cropBoxData.width = data.width;
        }

        if (isNumber(data.height) && data.height !== cropBoxData.height) {
          heightChanged = true;
          cropBoxData.height = data.height;
        }

        if (aspectRatio) {
          if (widthChanged) {
            cropBoxData.height = cropBoxData.width / aspectRatio;
          } else if (heightChanged) {
            cropBoxData.width = cropBoxData.height * aspectRatio;
          }
        }

        this.renderCropBox();
      }

      return this;
    },

    /**
     * Get a canvas drawn the cropped image.
     * @param {Object} [options={}] - The config options.
     * @returns {HTMLCanvasElement} - The result canvas.
     */
    getCroppedCanvas: function getCroppedCanvas() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this.ready || !window.HTMLCanvasElement) {
        return null;
      }

      var canvasData = this.canvasData;
      var source = getSourceCanvas(this.image, this.imageData, canvasData, options); // Returns the source canvas if it is not cropped.

      if (!this.cropped) {
        return source;
      }

      var _this$getData = this.getData(),
          initialX = _this$getData.x,
          initialY = _this$getData.y,
          initialWidth = _this$getData.width,
          initialHeight = _this$getData.height;

      var ratio = source.width / Math.floor(canvasData.naturalWidth);

      if (ratio !== 1) {
        initialX *= ratio;
        initialY *= ratio;
        initialWidth *= ratio;
        initialHeight *= ratio;
      }

      var aspectRatio = initialWidth / initialHeight;
      var maxSizes = getAdjustedSizes({
        aspectRatio: aspectRatio,
        width: options.maxWidth || Infinity,
        height: options.maxHeight || Infinity
      });
      var minSizes = getAdjustedSizes({
        aspectRatio: aspectRatio,
        width: options.minWidth || 0,
        height: options.minHeight || 0
      }, 'cover');

      var _getAdjustedSizes = getAdjustedSizes({
        aspectRatio: aspectRatio,
        width: options.width || (ratio !== 1 ? source.width : initialWidth),
        height: options.height || (ratio !== 1 ? source.height : initialHeight)
      }),
          width = _getAdjustedSizes.width,
          height = _getAdjustedSizes.height;

      width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
      height = Math.min(maxSizes.height, Math.max(minSizes.height, height));
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = normalizeDecimalNumber(width);
      canvas.height = normalizeDecimalNumber(height);
      context.fillStyle = options.fillColor || 'transparent';
      context.fillRect(0, 0, width, height);
      var _options$imageSmoothi = options.imageSmoothingEnabled,
          imageSmoothingEnabled = _options$imageSmoothi === void 0 ? true : _options$imageSmoothi,
          imageSmoothingQuality = options.imageSmoothingQuality;
      context.imageSmoothingEnabled = imageSmoothingEnabled;

      if (imageSmoothingQuality) {
        context.imageSmoothingQuality = imageSmoothingQuality;
      } // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage


      var sourceWidth = source.width;
      var sourceHeight = source.height; // Source canvas parameters

      var srcX = initialX;
      var srcY = initialY;
      var srcWidth;
      var srcHeight; // Destination canvas parameters

      var dstX;
      var dstY;
      var dstWidth;
      var dstHeight;

      if (srcX <= -initialWidth || srcX > sourceWidth) {
        srcX = 0;
        srcWidth = 0;
        dstX = 0;
        dstWidth = 0;
      } else if (srcX <= 0) {
        dstX = -srcX;
        srcX = 0;
        srcWidth = Math.min(sourceWidth, initialWidth + srcX);
        dstWidth = srcWidth;
      } else if (srcX <= sourceWidth) {
        dstX = 0;
        srcWidth = Math.min(initialWidth, sourceWidth - srcX);
        dstWidth = srcWidth;
      }

      if (srcWidth <= 0 || srcY <= -initialHeight || srcY > sourceHeight) {
        srcY = 0;
        srcHeight = 0;
        dstY = 0;
        dstHeight = 0;
      } else if (srcY <= 0) {
        dstY = -srcY;
        srcY = 0;
        srcHeight = Math.min(sourceHeight, initialHeight + srcY);
        dstHeight = srcHeight;
      } else if (srcY <= sourceHeight) {
        dstY = 0;
        srcHeight = Math.min(initialHeight, sourceHeight - srcY);
        dstHeight = srcHeight;
      }

      var params = [srcX, srcY, srcWidth, srcHeight]; // Avoid "IndexSizeError"

      if (dstWidth > 0 && dstHeight > 0) {
        var scale = width / initialWidth;
        params.push(dstX * scale, dstY * scale, dstWidth * scale, dstHeight * scale);
      } // All the numerical parameters should be integer for `drawImage`
      // https://github.com/fengyuanchen/cropper/issues/476


      context.drawImage.apply(context, [source].concat(_toConsumableArray(params.map(function (param) {
        return Math.floor(normalizeDecimalNumber(param));
      }))));
      return canvas;
    },

    /**
     * Change the aspect ratio of the crop box.
     * @param {number} aspectRatio - The new aspect ratio.
     * @returns {Cropper} this
     */
    setAspectRatio: function setAspectRatio(aspectRatio) {
      var options = this.options;

      if (!this.disabled && !isUndefined(aspectRatio)) {
        // 0 -> NaN
        options.aspectRatio = Math.max(0, aspectRatio) || NaN;

        if (this.ready) {
          this.initCropBox();

          if (this.cropped) {
            this.renderCropBox();
          }
        }
      }

      return this;
    },

    /**
     * Change the drag mode.
     * @param {string} mode - The new drag mode.
     * @returns {Cropper} this
     */
    setDragMode: function setDragMode(mode) {
      var options = this.options,
          dragBox = this.dragBox,
          face = this.face;

      if (this.ready && !this.disabled) {
        var croppable = mode === DRAG_MODE_CROP;
        var movable = options.movable && mode === DRAG_MODE_MOVE;
        mode = croppable || movable ? mode : DRAG_MODE_NONE;
        options.dragMode = mode;
        setData(dragBox, DATA_ACTION, mode);
        toggleClass(dragBox, CLASS_CROP, croppable);
        toggleClass(dragBox, CLASS_MOVE, movable);

        if (!options.cropBoxMovable) {
          // Sync drag mode to crop box when it is not movable
          setData(face, DATA_ACTION, mode);
          toggleClass(face, CLASS_CROP, croppable);
          toggleClass(face, CLASS_MOVE, movable);
        }
      }

      return this;
    }
  };

  var AnotherCropper = WINDOW.Cropper;

  var Cropper = /*#__PURE__*/function () {
    /**
     * Create a new Cropper.
     * @param {Element} element - The target element for cropping.
     * @param {Object} [options={}] - The configuration options.
     */
    function Cropper(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Cropper);

      if (!element || !REGEXP_TAG_NAME.test(element.tagName)) {
        throw new Error('The first argument is required and must be an <img> or <canvas> element.');
      }

      this.element = element;
      this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
      this.cropped = false;
      this.disabled = false;
      this.pointers = {};
      this.ready = false;
      this.reloading = false;
      this.replaced = false;
      this.sized = false;
      this.sizing = false;
      this.init();
    }

    _createClass(Cropper, [{
      key: "init",
      value: function init() {
        var element = this.element;
        var tagName = element.tagName.toLowerCase();
        var url;

        if (element[NAMESPACE]) {
          return;
        }

        element[NAMESPACE] = this;

        if (tagName === 'img') {
          this.isImg = true; // e.g.: "img/picture.jpg"

          url = element.getAttribute('src') || '';
          this.originalUrl = url; // Stop when it's a blank image

          if (!url) {
            return;
          } // e.g.: "https://example.com/img/picture.jpg"


          url = element.src;
        } else if (tagName === 'canvas' && window.HTMLCanvasElement) {
          url = element.toDataURL();
        }

        this.load(url);
      }
    }, {
      key: "load",
      value: function load(url) {
        var _this = this;

        if (!url) {
          return;
        }

        this.url = url;
        this.imageData = {};
        var element = this.element,
            options = this.options;

        if (!options.rotatable && !options.scalable) {
          options.checkOrientation = false;
        } // Only IE10+ supports Typed Arrays


        if (!options.checkOrientation || !window.ArrayBuffer) {
          this.clone();
          return;
        } // Detect the mime type of the image directly if it is a Data URL


        if (REGEXP_DATA_URL.test(url)) {
          // Read ArrayBuffer from Data URL of JPEG images directly for better performance
          if (REGEXP_DATA_URL_JPEG.test(url)) {
            this.read(dataURLToArrayBuffer(url));
          } else {
            // Only a JPEG image may contains Exif Orientation information,
            // the rest types of Data URLs are not necessary to check orientation at all.
            this.clone();
          }

          return;
        } // 1. Detect the mime type of the image by a XMLHttpRequest.
        // 2. Load the image as ArrayBuffer for reading orientation if its a JPEG image.


        var xhr = new XMLHttpRequest();
        var clone = this.clone.bind(this);
        this.reloading = true;
        this.xhr = xhr; // 1. Cross origin requests are only supported for protocol schemes:
        // http, https, data, chrome, chrome-extension.
        // 2. Access to XMLHttpRequest from a Data URL will be blocked by CORS policy
        // in some browsers as IE11 and Safari.

        xhr.onabort = clone;
        xhr.onerror = clone;
        xhr.ontimeout = clone;

        xhr.onprogress = function () {
          // Abort the request directly if it not a JPEG image for better performance
          if (xhr.getResponseHeader('content-type') !== MIME_TYPE_JPEG) {
            xhr.abort();
          }
        };

        xhr.onload = function () {
          _this.read(xhr.response);
        };

        xhr.onloadend = function () {
          _this.reloading = false;
          _this.xhr = null;
        }; // Bust cache when there is a "crossOrigin" property to avoid browser cache error


        if (options.checkCrossOrigin && isCrossOriginURL(url) && element.crossOrigin) {
          url = addTimestamp(url);
        } // The third parameter is required for avoiding side-effect (#682)


        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.withCredentials = element.crossOrigin === 'use-credentials';
        xhr.send();
      }
    }, {
      key: "read",
      value: function read(arrayBuffer) {
        var options = this.options,
            imageData = this.imageData; // Reset the orientation value to its default value 1
        // as some iOS browsers will render image with its orientation

        var orientation = resetAndGetOrientation(arrayBuffer);
        var rotate = 0;
        var scaleX = 1;
        var scaleY = 1;

        if (orientation > 1) {
          // Generate a new URL which has the default orientation value
          this.url = arrayBufferToDataURL(arrayBuffer, MIME_TYPE_JPEG);

          var _parseOrientation = parseOrientation(orientation);

          rotate = _parseOrientation.rotate;
          scaleX = _parseOrientation.scaleX;
          scaleY = _parseOrientation.scaleY;
        }

        if (options.rotatable) {
          imageData.rotate = rotate;
        }

        if (options.scalable) {
          imageData.scaleX = scaleX;
          imageData.scaleY = scaleY;
        }

        this.clone();
      }
    }, {
      key: "clone",
      value: function clone() {
        var element = this.element,
            url = this.url;
        var crossOrigin = element.crossOrigin;
        var crossOriginUrl = url;

        if (this.options.checkCrossOrigin && isCrossOriginURL(url)) {
          if (!crossOrigin) {
            crossOrigin = 'anonymous';
          } // Bust cache when there is not a "crossOrigin" property (#519)


          crossOriginUrl = addTimestamp(url);
        }

        this.crossOrigin = crossOrigin;
        this.crossOriginUrl = crossOriginUrl;
        var image = document.createElement('img');

        if (crossOrigin) {
          image.crossOrigin = crossOrigin;
        }

        image.src = crossOriginUrl || url;
        image.alt = element.alt || 'The image to crop';
        this.image = image;
        image.onload = this.start.bind(this);
        image.onerror = this.stop.bind(this);
        addClass(image, CLASS_HIDE);
        element.parentNode.insertBefore(image, element.nextSibling);
      }
    }, {
      key: "start",
      value: function start() {
        var _this2 = this;

        var image = this.image;
        image.onload = null;
        image.onerror = null;
        this.sizing = true; // Match all browsers that use WebKit as the layout engine in iOS devices,
        // such as Safari for iOS, Chrome for iOS, and in-app browsers.

        var isIOSWebKit = WINDOW.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(WINDOW.navigator.userAgent);

        var done = function done(naturalWidth, naturalHeight) {
          assign(_this2.imageData, {
            naturalWidth: naturalWidth,
            naturalHeight: naturalHeight,
            aspectRatio: naturalWidth / naturalHeight
          });
          _this2.initialImageData = assign({}, _this2.imageData);
          _this2.sizing = false;
          _this2.sized = true;

          _this2.build();
        }; // Most modern browsers (excepts iOS WebKit)


        if (image.naturalWidth && !isIOSWebKit) {
          done(image.naturalWidth, image.naturalHeight);
          return;
        }

        var sizingImage = document.createElement('img');
        var body = document.body || document.documentElement;
        this.sizingImage = sizingImage;

        sizingImage.onload = function () {
          done(sizingImage.width, sizingImage.height);

          if (!isIOSWebKit) {
            body.removeChild(sizingImage);
          }
        };

        sizingImage.src = image.src; // iOS WebKit will convert the image automatically
        // with its orientation once append it into DOM (#279)

        if (!isIOSWebKit) {
          sizingImage.style.cssText = 'left:0;' + 'max-height:none!important;' + 'max-width:none!important;' + 'min-height:0!important;' + 'min-width:0!important;' + 'opacity:0;' + 'position:absolute;' + 'top:0;' + 'z-index:-1;';
          body.appendChild(sizingImage);
        }
      }
    }, {
      key: "stop",
      value: function stop() {
        var image = this.image;
        image.onload = null;
        image.onerror = null;
        image.parentNode.removeChild(image);
        this.image = null;
      }
    }, {
      key: "build",
      value: function build() {
        if (!this.sized || this.ready) {
          return;
        }

        var element = this.element,
            options = this.options,
            image = this.image; // Create cropper elements

        var container = element.parentNode;
        var template = document.createElement('div');
        template.innerHTML = TEMPLATE;
        var cropper = template.querySelector(".".concat(NAMESPACE, "-container"));
        var canvas = cropper.querySelector(".".concat(NAMESPACE, "-canvas"));
        var dragBox = cropper.querySelector(".".concat(NAMESPACE, "-drag-box"));
        var cropBox = cropper.querySelector(".".concat(NAMESPACE, "-crop-box"));
        var face = cropBox.querySelector(".".concat(NAMESPACE, "-face"));
        this.container = container;
        this.cropper = cropper;
        this.canvas = canvas;
        this.dragBox = dragBox;
        this.cropBox = cropBox;
        this.viewBox = cropper.querySelector(".".concat(NAMESPACE, "-view-box"));
        this.face = face;
        canvas.appendChild(image); // Hide the original image

        addClass(element, CLASS_HIDDEN); // Inserts the cropper after to the current image

        container.insertBefore(cropper, element.nextSibling); // Show the image if is hidden

        if (!this.isImg) {
          removeClass(image, CLASS_HIDE);
        }

        this.initPreview();
        this.bind();
        options.initialAspectRatio = Math.max(0, options.initialAspectRatio) || NaN;
        options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
        options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;
        addClass(cropBox, CLASS_HIDDEN);

        if (!options.guides) {
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-dashed")), CLASS_HIDDEN);
        }

        if (!options.center) {
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-center")), CLASS_HIDDEN);
        }

        if (options.background) {
          addClass(cropper, "".concat(NAMESPACE, "-bg"));
        }

        if (!options.highlight) {
          addClass(face, CLASS_INVISIBLE);
        }

        if (options.cropBoxMovable) {
          addClass(face, CLASS_MOVE);
          setData(face, DATA_ACTION, ACTION_ALL);
        }

        if (!options.cropBoxResizable) {
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-line")), CLASS_HIDDEN);
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-point")), CLASS_HIDDEN);
        }

        this.render();
        this.ready = true;
        this.setDragMode(options.dragMode);

        if (options.autoCrop) {
          this.crop();
        }

        this.setData(options.data);

        if (isFunction(options.ready)) {
          addListener(element, EVENT_READY, options.ready, {
            once: true
          });
        }

        dispatchEvent(element, EVENT_READY);
      }
    }, {
      key: "unbuild",
      value: function unbuild() {
        if (!this.ready) {
          return;
        }

        this.ready = false;
        this.unbind();
        this.resetPreview();
        this.cropper.parentNode.removeChild(this.cropper);
        removeClass(this.element, CLASS_HIDDEN);
      }
    }, {
      key: "uncreate",
      value: function uncreate() {
        if (this.ready) {
          this.unbuild();
          this.ready = false;
          this.cropped = false;
        } else if (this.sizing) {
          this.sizingImage.onload = null;
          this.sizing = false;
          this.sized = false;
        } else if (this.reloading) {
          this.xhr.onabort = null;
          this.xhr.abort();
        } else if (this.image) {
          this.stop();
        }
      }
      /**
       * Get the no conflict cropper class.
       * @returns {Cropper} The cropper class.
       */

    }], [{
      key: "noConflict",
      value: function noConflict() {
        window.Cropper = AnotherCropper;
        return Cropper;
      }
      /**
       * Change the default options.
       * @param {Object} options - The new default options.
       */

    }, {
      key: "setDefaults",
      value: function setDefaults(options) {
        assign(DEFAULTS, isPlainObject(options) && options);
      }
    }]);

    return Cropper;
  }();

  assign(Cropper.prototype, render, preview, events, handlers, change, methods);

  return Cropper;

})));

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define(["vue"], factory);
	else if(typeof exports === 'object')
		exports["vue-slider-component"] = factory(require("vue"));
	else
		root["vue-slider-component"] = factory(root["Vue"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__8bbf__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "091b":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-slider-dot{position:absolute;-webkit-transition:all 0s;transition:all 0s;z-index:5}.vue-slider-dot:focus{outline:none}.vue-slider-dot-tooltip{position:absolute;visibility:hidden}.vue-slider-dot-hover:hover .vue-slider-dot-tooltip,.vue-slider-dot-tooltip-show{visibility:visible}.vue-slider-dot-tooltip-top{top:-10px;left:50%;-webkit-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}.vue-slider-dot-tooltip-bottom{bottom:-10px;left:50%;-webkit-transform:translate(-50%,100%);transform:translate(-50%,100%)}.vue-slider-dot-tooltip-left{left:-10px;top:50%;-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}.vue-slider-dot-tooltip-right{right:-10px;top:50%;-webkit-transform:translate(100%,-50%);transform:translate(100%,-50%)}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "24fb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "2638":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _extends(){return _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_extends.apply(this,arguments)}var normalMerge=["attrs","props","domProps"],toArrayMerge=["class","style","directives"],functionalMerge=["on","nativeOn"],mergeJsxProps=function(a){return a.reduce(function(c,a){for(var b in a)if(!c[b])c[b]=a[b];else if(-1!==normalMerge.indexOf(b))c[b]=_extends({},c[b],a[b]);else if(-1!==toArrayMerge.indexOf(b)){var d=c[b]instanceof Array?c[b]:[c[b]],e=a[b]instanceof Array?a[b]:[a[b]];c[b]=d.concat(e)}else if(-1!==functionalMerge.indexOf(b)){for(var f in a[b])if(c[b][f]){var g=c[b][f]instanceof Array?c[b][f]:[c[b][f]],h=a[b][f]instanceof Array?a[b][f]:[a[b][f]];c[b][f]=g.concat(h)}else c[b][f]=a[b][f];}else if("hook"==b)for(var i in a[b])c[b][i]=c[b][i]?mergeFn(c[b][i],a[b][i]):a[b][i];else c[b]=a[b];return c},{})},mergeFn=function(a,b){return function(){a&&a.apply(this,arguments),b&&b.apply(this,arguments)}};module.exports=mergeJsxProps;


/***/ }),

/***/ "499e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ addStylesClient; });

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "4abb":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("7a57");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("b2af7572", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "4ed8":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("091b");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("2f6bee1a", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "556c":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("eef2");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("1209fd47", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "65d9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  * vue-class-component v7.0.1
  * (c) 2015-present Evan You
  * @license MIT
  */


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(__webpack_require__("8bbf"));

// The rational behind the verbose Reflect-feature check below is the fact that there are polyfills
// which add an implementation for Reflect.defineMetadata but not for Reflect.getOwnMetadataKeys.
// Without this check consumers will encounter hard to track down runtime errors.
var reflectionIsSupported = typeof Reflect !== 'undefined' && Reflect.defineMetadata && Reflect.getOwnMetadataKeys;
function copyReflectionMetadata(to, from) {
    forwardMetadata(to, from);
    Object.getOwnPropertyNames(from.prototype).forEach(function (key) {
        forwardMetadata(to.prototype, from.prototype, key);
    });
    Object.getOwnPropertyNames(from).forEach(function (key) {
        forwardMetadata(to, from, key);
    });
}
function forwardMetadata(to, from, propertyKey) {
    var metaKeys = propertyKey
        ? Reflect.getOwnMetadataKeys(from, propertyKey)
        : Reflect.getOwnMetadataKeys(from);
    metaKeys.forEach(function (metaKey) {
        var metadata = propertyKey
            ? Reflect.getOwnMetadata(metaKey, from, propertyKey)
            : Reflect.getOwnMetadata(metaKey, from);
        if (propertyKey) {
            Reflect.defineMetadata(metaKey, metadata, to, propertyKey);
        }
        else {
            Reflect.defineMetadata(metaKey, metadata, to);
        }
    });
}

var fakeArray = { __proto__: [] };
var hasProto = fakeArray instanceof Array;
function createDecorator(factory) {
    return function (target, key, index) {
        var Ctor = typeof target === 'function'
            ? target
            : target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        if (typeof index !== 'number') {
            index = undefined;
        }
        Ctor.__decorators__.push(function (options) { return factory(options, key, index); });
    };
}
function mixins() {
    var Ctors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        Ctors[_i] = arguments[_i];
    }
    return Vue.extend({ mixins: Ctors });
}
function isPrimitive(value) {
    var type = typeof value;
    return value == null || (type !== 'object' && type !== 'function');
}
function warn(message) {
    if (typeof console !== 'undefined') {
        console.warn('[vue-class-component] ' + message);
    }
}

function collectDataFromConstructor(vm, Component) {
    // override _init to prevent to init as Vue instance
    var originalInit = Component.prototype._init;
    Component.prototype._init = function () {
        var _this = this;
        // proxy to actual vm
        var keys = Object.getOwnPropertyNames(vm);
        // 2.2.0 compat (props are no longer exposed as self properties)
        if (vm.$options.props) {
            for (var key in vm.$options.props) {
                if (!vm.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        keys.forEach(function (key) {
            if (key.charAt(0) !== '_') {
                Object.defineProperty(_this, key, {
                    get: function () { return vm[key]; },
                    set: function (value) { vm[key] = value; },
                    configurable: true
                });
            }
        });
    };
    // should be acquired class property values
    var data = new Component();
    // restore original _init to avoid memory leak (#209)
    Component.prototype._init = originalInit;
    // create plain data object
    var plainData = {};
    Object.keys(data).forEach(function (key) {
        if (data[key] !== undefined) {
            plainData[key] = data[key];
        }
    });
    if (false) {}
    return plainData;
}

var $internalHooks = [
    'data',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render',
    'errorCaptured',
    'serverPrefetch' // 2.6
];
function componentFactory(Component, options) {
    if (options === void 0) { options = {}; }
    options.name = options.name || Component._componentTag || Component.name;
    // prototype props.
    var proto = Component.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        // hooks
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor.value !== void 0) {
            // methods
            if (typeof descriptor.value === 'function') {
                (options.methods || (options.methods = {}))[key] = descriptor.value;
            }
            else {
                // typescript decorated data
                (options.mixins || (options.mixins = [])).push({
                    data: function () {
                        var _a;
                        return _a = {}, _a[key] = descriptor.value, _a;
                    }
                });
            }
        }
        else if (descriptor.get || descriptor.set) {
            // computed properties
            (options.computed || (options.computed = {}))[key] = {
                get: descriptor.get,
                set: descriptor.set
            };
        }
    });
    (options.mixins || (options.mixins = [])).push({
        data: function () {
            return collectDataFromConstructor(this, Component);
        }
    });
    // decorate options
    var decorators = Component.__decorators__;
    if (decorators) {
        decorators.forEach(function (fn) { return fn(options); });
        delete Component.__decorators__;
    }
    // find super
    var superProto = Object.getPrototypeOf(Component.prototype);
    var Super = superProto instanceof Vue
        ? superProto.constructor
        : Vue;
    var Extended = Super.extend(options);
    forwardStaticMembers(Extended, Component, Super);
    if (reflectionIsSupported) {
        copyReflectionMetadata(Extended, Component);
    }
    return Extended;
}
var reservedPropertyNames = [
    // Unique id
    'cid',
    // Super Vue constructor
    'super',
    // Component options that will be used by the component
    'options',
    'superOptions',
    'extendOptions',
    'sealedOptions',
    // Private assets
    'component',
    'directive',
    'filter'
];
function forwardStaticMembers(Extended, Original, Super) {
    // We have to use getOwnPropertyNames since Babel registers methods as non-enumerable
    Object.getOwnPropertyNames(Original).forEach(function (key) {
        // `prototype` should not be overwritten
        if (key === 'prototype') {
            return;
        }
        // Some browsers does not allow reconfigure built-in properties
        var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);
        if (extendedDescriptor && !extendedDescriptor.configurable) {
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(Original, key);
        // If the user agent does not support `__proto__` or its family (IE <= 10),
        // the sub class properties may be inherited properties from the super class in TypeScript.
        // We need to exclude such properties to prevent to overwrite
        // the component options object which stored on the extended constructor (See #192).
        // If the value is a referenced value (object or function),
        // we can check equality of them and exclude it if they have the same reference.
        // If it is a primitive value, it will be forwarded for safety.
        if (!hasProto) {
            // Only `cid` is explicitly exluded from property forwarding
            // because we cannot detect whether it is a inherited property or not
            // on the no `__proto__` environment even though the property is reserved.
            if (key === 'cid') {
                return;
            }
            var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);
            if (!isPrimitive(descriptor.value) &&
                superDescriptor &&
                superDescriptor.value === descriptor.value) {
                return;
            }
        }
        // Warn if the users manually declare reserved properties
        if (false) {}
        Object.defineProperty(Extended, key, descriptor);
    });
}

function Component(options) {
    if (typeof options === 'function') {
        return componentFactory(options);
    }
    return function (Component) {
        return componentFactory(Component, options);
    };
}
Component.registerHooks = function registerHooks(keys) {
    $internalHooks.push.apply($internalHooks, keys);
};

exports.default = Component;
exports.createDecorator = createDecorator;
exports.mixins = mixins;


/***/ }),

/***/ "7a57":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-slider{position:relative;-webkit-box-sizing:content-box;box-sizing:content-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:block;-webkit-tap-highlight-color:rgba(0,0,0,0)}.vue-slider-rail{position:relative;width:100%;height:100%;-webkit-transition-property:width,height,left,right,top,bottom;transition-property:width,height,left,right,top,bottom}.vue-slider-process{position:absolute;z-index:1}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "8875":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "eef2":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-slider-marks{position:relative;width:100%;height:100%}.vue-slider-mark{position:absolute;z-index:1}.vue-slider-ltr .vue-slider-mark,.vue-slider-rtl .vue-slider-mark{width:0;height:100%;top:50%}.vue-slider-ltr .vue-slider-mark-step,.vue-slider-rtl .vue-slider-mark-step{top:0}.vue-slider-ltr .vue-slider-mark-label,.vue-slider-rtl .vue-slider-mark-label{top:100%;margin-top:10px}.vue-slider-ltr .vue-slider-mark{-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vue-slider-ltr .vue-slider-mark-step{left:0}.vue-slider-ltr .vue-slider-mark-label{left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.vue-slider-rtl .vue-slider-mark{-webkit-transform:translate(50%,-50%);transform:translate(50%,-50%)}.vue-slider-rtl .vue-slider-mark-step{right:0}.vue-slider-rtl .vue-slider-mark-label{right:50%;-webkit-transform:translateX(50%);transform:translateX(50%)}.vue-slider-btt .vue-slider-mark,.vue-slider-ttb .vue-slider-mark{width:100%;height:0;left:50%}.vue-slider-btt .vue-slider-mark-step,.vue-slider-ttb .vue-slider-mark-step{left:0}.vue-slider-btt .vue-slider-mark-label,.vue-slider-ttb .vue-slider-mark-label{left:100%;margin-left:10px}.vue-slider-btt .vue-slider-mark{-webkit-transform:translate(-50%,50%);transform:translate(-50%,50%)}.vue-slider-btt .vue-slider-mark-step{top:0}.vue-slider-btt .vue-slider-mark-label{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-ttb .vue-slider-mark{-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vue-slider-ttb .vue-slider-mark-step{bottom:0}.vue-slider-ttb .vue-slider-mark-label{bottom:50%;-webkit-transform:translateY(50%);transform:translateY(50%)}.vue-slider-mark-label,.vue-slider-mark-step{position:absolute}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "ERROR_TYPE", function() { return /* reexport */ ERROR_TYPE; });
__webpack_require__.d(__webpack_exports__, "VueSliderMark", function() { return /* reexport */ vue_slider_mark; });
__webpack_require__.d(__webpack_exports__, "VueSliderDot", function() { return /* reexport */ vue_slider_dot; });

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("8875")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/@vue/babel-helper-vue-jsx-merge-props/dist/helper.js
var helper = __webpack_require__("2638");
var helper_default = /*#__PURE__*/__webpack_require__.n(helper);

// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue","amd":"vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_amd_vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_amd_vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_amd_vue_);

// EXTERNAL MODULE: ./node_modules/vue-class-component/dist/vue-class-component.common.js
var vue_class_component_common = __webpack_require__("65d9");
var vue_class_component_common_default = /*#__PURE__*/__webpack_require__.n(vue_class_component_common);

// CONCATENATED MODULE: ./node_modules/vue-property-decorator/lib/vue-property-decorator.js
/** vue-property-decorator verson 8.0.0 MIT LICENSE copyright 2018 kaorun343 */




/**
 * decorator of an inject
 * @param from key
 * @return PropertyDecorator
 */
function Inject(options) {
    return Object(vue_class_component_common["createDecorator"])(function (componentOptions, key) {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject[key] = options || key;
        }
    });
}
/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
function Provide(key) {
    return Object(vue_class_component_common["createDecorator"])(function (componentOptions, k) {
        var provide = componentOptions.provide;
        if (typeof provide !== 'function' || !provide.managed) {
            var original_1 = componentOptions.provide;
            provide = componentOptions.provide = function () {
                var rv = Object.create((typeof original_1 === 'function' ? original_1.call(this) : original_1) || null);
                for (var i in provide.managed)
                    rv[provide.managed[i]] = this[i];
                return rv;
            };
            provide.managed = {};
        }
        provide.managed[k] = key || k;
    });
}
/**
 * decorator of model
 * @param  event event name
 * @param options options
 * @return PropertyDecorator
 */
function Model(event, options) {
    if (options === void 0) { options = {}; }
    return Object(vue_class_component_common["createDecorator"])(function (componentOptions, k) {
        (componentOptions.props || (componentOptions.props = {}))[k] = options;
        componentOptions.model = { prop: k, event: event || k };
    });
}
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return Object(vue_class_component_common["createDecorator"])(function (componentOptions, k) {
        (componentOptions.props || (componentOptions.props = {}))[k] = options;
    });
}
/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
function Watch(path, options) {
    if (options === void 0) { options = {}; }
    var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
    return Object(vue_class_component_common["createDecorator"])(function (componentOptions, handler) {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null);
        }
        var watch = componentOptions.watch;
        if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
            watch[path] = [watch[path]];
        }
        else if (typeof watch[path] === 'undefined') {
            watch[path] = [];
        }
        watch[path].push({ handler: handler, deep: deep, immediate: immediate });
    });
}
// Code copied from Vue/src/shared/util.js
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = function (str) { return str.replace(hyphenateRE, '-$1').toLowerCase(); };
/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
function Emit(event) {
    return function (_target, key, descriptor) {
        key = hyphenate(key);
        var original = descriptor.value;
        descriptor.value = function emitter() {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var emit = function (returnValue) {
                if (returnValue !== undefined)
                    args.unshift(returnValue);
                _this.$emit.apply(_this, [event || key].concat(args));
            };
            var returnValue = original.apply(this, args);
            if (isPromise(returnValue)) {
                returnValue.then(function (returnValue) {
                    emit(returnValue);
                });
            }
            else {
                emit(returnValue);
            }
        };
    };
}
function isPromise(obj) {
    return obj instanceof Promise || (obj && typeof obj.then === 'function');
}

// EXTERNAL MODULE: ./lib/styles/dot.scss
var dot = __webpack_require__("4ed8");

// CONCATENATED MODULE: ./lib/vue-slider-dot.tsx
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var vue_slider_dot_VueSliderDot =
/** @class */
function () {
  var VueSliderDot = /*#__PURE__*/function (_Vue) {
    _inherits(VueSliderDot, _Vue);

    var _super = _createSuper(VueSliderDot);

    function VueSliderDot() {
      _classCallCheck(this, VueSliderDot);

      return _super.apply(this, arguments);
    }

    _createClass(VueSliderDot, [{
      key: "dragStart",
      value: function dragStart(e) {
        if (this.disabled) {
          return false;
        }

        this.$emit('drag-start');
      }
    }, {
      key: "render",
      value: function render() {
        var h = arguments[0];
        return h("div", {
          "ref": "dot",
          "class": this.dotClasses,
          "attrs": {
            "aria-valuetext": this.tooltipValue ? this.tooltipValue.toString() : ''
          },
          "on": {
            "mousedown": this.dragStart,
            "touchstart": this.dragStart
          }
        }, [this.$slots.dot || h("div", {
          "class": this.handleClasses,
          "style": this.dotStyle
        }), this.tooltip !== 'none' ? h("div", {
          "class": this.tooltipClasses
        }, [this.$slots.tooltip || h("div", {
          "class": this.tooltipInnerClasses,
          "style": this.tooltipStyle
        }, [h("span", {
          "class": 'vue-slider-dot-tooltip-text'
        }, [this.tooltipValue])])]) : null]);
      }
    }, {
      key: "dotClasses",
      get: function get() {
        return ['vue-slider-dot', {
          'vue-slider-dot-hover': this.tooltip === 'hover' || this.tooltip === 'active',
          'vue-slider-dot-disabled': this.disabled,
          'vue-slider-dot-focus': this.focus
        }];
      }
    }, {
      key: "handleClasses",
      get: function get() {
        return ['vue-slider-dot-handle', {
          'vue-slider-dot-handle-disabled': this.disabled,
          'vue-slider-dot-handle-focus': this.focus
        }];
      }
    }, {
      key: "tooltipClasses",
      get: function get() {
        return ['vue-slider-dot-tooltip', ["vue-slider-dot-tooltip-".concat(this.tooltipPlacement)], {
          'vue-slider-dot-tooltip-show': this.showTooltip
        }];
      }
    }, {
      key: "tooltipInnerClasses",
      get: function get() {
        return ['vue-slider-dot-tooltip-inner', ["vue-slider-dot-tooltip-inner-".concat(this.tooltipPlacement)], {
          'vue-slider-dot-tooltip-inner-disabled': this.disabled,
          'vue-slider-dot-tooltip-inner-focus': this.focus
        }];
      }
    }, {
      key: "showTooltip",
      get: function get() {
        switch (this.tooltip) {
          case 'always':
            return true;

          case 'none':
            return false;

          case 'focus':
          case 'active':
            return !!this.focus;

          default:
            return false;
        }
      }
    }, {
      key: "tooltipValue",
      get: function get() {
        if (this.tooltipFormatter) {
          return typeof this.tooltipFormatter === 'string' ? this.tooltipFormatter.replace(/\{value\}/, String(this.value)) : this.tooltipFormatter(this.value);
        } else {
          return this.value;
        }
      }
    }]);

    return VueSliderDot;
  }(external_commonjs_vue_commonjs2_vue_root_Vue_amd_vue_default.a);

  __decorate([Prop({
    default: 0
  })], VueSliderDot.prototype, "value", void 0);

  __decorate([Prop()], VueSliderDot.prototype, "tooltip", void 0);

  __decorate([Prop()], VueSliderDot.prototype, "dotStyle", void 0);

  __decorate([Prop()], VueSliderDot.prototype, "tooltipStyle", void 0);

  __decorate([Prop({
    type: String,
    validator: function validator(val) {
      return ['top', 'right', 'bottom', 'left'].indexOf(val) > -1;
    },
    required: true
  })], VueSliderDot.prototype, "tooltipPlacement", void 0);

  __decorate([Prop({
    type: [String, Function]
  })], VueSliderDot.prototype, "tooltipFormatter", void 0);

  __decorate([Prop({
    type: Boolean,
    default: false
  })], VueSliderDot.prototype, "focus", void 0);

  __decorate([Prop({
    default: false
  })], VueSliderDot.prototype, "disabled", void 0);

  VueSliderDot = __decorate([vue_class_component_common_default()({
    name: 'VueSliderDot'
  })], VueSliderDot);
  return VueSliderDot;
}();

/* harmony default export */ var vue_slider_dot = (vue_slider_dot_VueSliderDot);
// EXTERNAL MODULE: ./lib/styles/mark.scss
var mark = __webpack_require__("556c");

// CONCATENATED MODULE: ./lib/vue-slider-mark.tsx
function vue_slider_mark_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { vue_slider_mark_typeof = function _typeof(obj) { return typeof obj; }; } else { vue_slider_mark_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return vue_slider_mark_typeof(obj); }

function vue_slider_mark_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function vue_slider_mark_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function vue_slider_mark_createClass(Constructor, protoProps, staticProps) { if (protoProps) vue_slider_mark_defineProperties(Constructor.prototype, protoProps); if (staticProps) vue_slider_mark_defineProperties(Constructor, staticProps); return Constructor; }

function vue_slider_mark_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) vue_slider_mark_setPrototypeOf(subClass, superClass); }

function vue_slider_mark_setPrototypeOf(o, p) { vue_slider_mark_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return vue_slider_mark_setPrototypeOf(o, p); }

function vue_slider_mark_createSuper(Derived) { var hasNativeReflectConstruct = vue_slider_mark_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = vue_slider_mark_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = vue_slider_mark_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return vue_slider_mark_possibleConstructorReturn(this, result); }; }

function vue_slider_mark_possibleConstructorReturn(self, call) { if (call && (vue_slider_mark_typeof(call) === "object" || typeof call === "function")) { return call; } return vue_slider_mark_assertThisInitialized(self); }

function vue_slider_mark_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function vue_slider_mark_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function vue_slider_mark_getPrototypeOf(o) { vue_slider_mark_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return vue_slider_mark_getPrototypeOf(o); }





var vue_slider_mark_VueSlideMark =
/** @class */
function () {
  var VueSlideMark = /*#__PURE__*/function (_Vue) {
    vue_slider_mark_inherits(VueSlideMark, _Vue);

    var _super = vue_slider_mark_createSuper(VueSlideMark);

    function VueSlideMark() {
      vue_slider_mark_classCallCheck(this, VueSlideMark);

      return _super.apply(this, arguments);
    }

    vue_slider_mark_createClass(VueSlideMark, [{
      key: "labelClickHandle",
      value: function labelClickHandle(e) {
        e.stopPropagation();
        this.$emit('pressLabel', this.mark.pos);
      }
    }, {
      key: "render",
      value: function render() {
        var h = arguments[0];
        var mark = this.mark;
        return h("div", {
          "class": this.marksClasses
        }, [this.$slots.step || h("div", {
          "class": this.stepClasses,
          "style": [this.stepStyle || {}, mark.style || {}, mark.active ? this.stepActiveStyle || {} : {}, mark.active ? mark.activeStyle || {} : {}]
        }), !this.hideLabel ? this.$slots.label || h("div", {
          "class": this.labelClasses,
          "style": [this.labelStyle || {}, mark.labelStyle || {}, mark.active ? this.labelActiveStyle || {} : {}, mark.active ? mark.labelActiveStyle || {} : {}],
          "on": {
            "click": this.labelClickHandle
          }
        }, [mark.label]) : null]);
      }
    }, {
      key: "marksClasses",
      get: function get() {
        return ['vue-slider-mark', {
          'vue-slider-mark-active': this.mark.active
        }];
      }
    }, {
      key: "stepClasses",
      get: function get() {
        return ['vue-slider-mark-step', {
          'vue-slider-mark-step-active': this.mark.active
        }];
      }
    }, {
      key: "labelClasses",
      get: function get() {
        return ['vue-slider-mark-label', {
          'vue-slider-mark-label-active': this.mark.active
        }];
      }
    }]);

    return VueSlideMark;
  }(external_commonjs_vue_commonjs2_vue_root_Vue_amd_vue_default.a);

  __decorate([Prop({
    required: true
  })], VueSlideMark.prototype, "mark", void 0);

  __decorate([Prop(Boolean)], VueSlideMark.prototype, "hideLabel", void 0);

  __decorate([Prop()], VueSlideMark.prototype, "stepStyle", void 0);

  __decorate([Prop()], VueSlideMark.prototype, "stepActiveStyle", void 0);

  __decorate([Prop()], VueSlideMark.prototype, "labelStyle", void 0);

  __decorate([Prop()], VueSlideMark.prototype, "labelActiveStyle", void 0);

  VueSlideMark = __decorate([vue_class_component_common_default()({
    name: 'VueSlideMark'
  })], VueSlideMark);
  return VueSlideMark;
}();

/* harmony default export */ var vue_slider_mark = (vue_slider_mark_VueSlideMark);
// CONCATENATED MODULE: ./lib/utils/index.ts
var getSize = function getSize(value) {
  return typeof value === 'number' ? "".concat(value, "px") : value;
};
/** Get the distance of the element from the top/left of the page */

var getOffset = function getOffset(elem) {
  var doc = document.documentElement;
  var body = document.body;
  var rect = elem.getBoundingClientRect();
  var offset = {
    y: rect.top + (window.pageYOffset || doc.scrollTop) - (doc.clientTop || body.clientTop || 0),
    x: rect.left + (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || body.clientLeft || 0)
  };
  return offset;
};
/**
 * Get the position of the mouse/finger in the element
 * @param e Trigger event
 * @param elem Container element
 * @param isReverse From the right/bottom
 */

var getPos = function getPos(e, elem, isReverse) {
  var zoom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var event = 'targetTouches' in e ? e.targetTouches[0] : e;
  var offset = getOffset(elem);
  var posObj = {
    x: event.pageX - offset.x,
    y: event.pageY - offset.y
  };
  return {
    x: isReverse ? elem.offsetWidth * zoom - posObj.x : posObj.x,
    y: isReverse ? elem.offsetHeight * zoom - posObj.y : posObj.y
  };
};
var KEY_CODE;

(function (KEY_CODE) {
  KEY_CODE[KEY_CODE["PAGE_UP"] = 33] = "PAGE_UP";
  KEY_CODE[KEY_CODE["PAGE_DOWN"] = 34] = "PAGE_DOWN";
  KEY_CODE[KEY_CODE["END"] = 35] = "END";
  KEY_CODE[KEY_CODE["HOME"] = 36] = "HOME";
  KEY_CODE[KEY_CODE["LEFT"] = 37] = "LEFT";
  KEY_CODE[KEY_CODE["UP"] = 38] = "UP";
  KEY_CODE[KEY_CODE["RIGHT"] = 39] = "RIGHT";
  KEY_CODE[KEY_CODE["DOWN"] = 40] = "DOWN";
})(KEY_CODE || (KEY_CODE = {}));

var getKeyboardHandleFunc = function getKeyboardHandleFunc(e, params) {
  if (params.hook) {
    var result = params.hook(e);
    if (typeof result === 'function') return result;
    if (!result) return null;
  }

  switch (e.keyCode) {
    case KEY_CODE.UP:
      return function (i) {
        return params.direction === 'ttb' ? i - 1 : i + 1;
      };

    case KEY_CODE.RIGHT:
      return function (i) {
        return params.direction === 'rtl' ? i - 1 : i + 1;
      };

    case KEY_CODE.DOWN:
      return function (i) {
        return params.direction === 'ttb' ? i + 1 : i - 1;
      };

    case KEY_CODE.LEFT:
      return function (i) {
        return params.direction === 'rtl' ? i + 1 : i - 1;
      };

    case KEY_CODE.END:
      return function () {
        return params.max;
      };

    case KEY_CODE.HOME:
      return function () {
        return params.min;
      };

    case KEY_CODE.PAGE_UP:
      return function (i) {
        return i + 10;
      };

    case KEY_CODE.PAGE_DOWN:
      return function (i) {
        return i - 10;
      };

    default:
      return null;
  }
};
// CONCATENATED MODULE: ./lib/utils/decimal.ts
function decimal_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function decimal_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function decimal_createClass(Constructor, protoProps, staticProps) { if (protoProps) decimal_defineProperties(Constructor.prototype, protoProps); if (staticProps) decimal_defineProperties(Constructor, staticProps); return Constructor; }

/**
 * For any precise floating point calculation
 *
 * @export
 * @class Decimal
 */
var Decimal = /*#__PURE__*/function () {
  function Decimal(num) {
    decimal_classCallCheck(this, Decimal);

    this.num = num;
  }

  decimal_createClass(Decimal, [{
    key: "decimal",
    value: function decimal(num2, operator) {
      var num1 = this.num;
      var len1 = this.getDecimalLen(num1);
      var len2 = this.getDecimalLen(num2);
      var base = 0;

      switch (operator) {
        case '+':
          base = this.getExponent(len1, len2);
          this.num = (this.safeRoundUp(num1, base) + this.safeRoundUp(num2, base)) / base;
          break;

        case '-':
          base = this.getExponent(len1, len2);
          this.num = (this.safeRoundUp(num1, base) - this.safeRoundUp(num2, base)) / base;
          break;

        case '*':
          this.num = this.safeRoundUp(this.safeRoundUp(num1, this.getExponent(len1)), this.safeRoundUp(num2, this.getExponent(len2))) / this.getExponent(len1 + len2);
          break;

        case '/':
          base = this.getExponent(len1, len2);
          this.num = this.safeRoundUp(num1, base) / this.safeRoundUp(num2, base);
          break;

        case '%':
          base = this.getExponent(len1, len2);
          this.num = this.safeRoundUp(num1, base) % this.safeRoundUp(num2, base) / base;
          break;
      }

      return this;
    }
  }, {
    key: "plus",
    value: function plus(num2) {
      return this.decimal(num2, '+');
    }
  }, {
    key: "minus",
    value: function minus(num2) {
      return this.decimal(num2, '-');
    }
  }, {
    key: "multiply",
    value: function multiply(num2) {
      return this.decimal(num2, '*');
    }
  }, {
    key: "divide",
    value: function divide(num2) {
      return this.decimal(num2, '/');
    }
  }, {
    key: "remainder",
    value: function remainder(num2) {
      return this.decimal(num2, '%');
    }
  }, {
    key: "toNumber",
    value: function toNumber() {
      return this.num;
    }
  }, {
    key: "getDecimalLen",
    value: function getDecimalLen(num) {
      var strArr = "".concat(num).split('e');
      return ("".concat(strArr[0]).split('.')[1] || '').length - (strArr[1] ? +strArr[1] : 0);
    }
  }, {
    key: "getExponent",
    value: function getExponent(num1, num2) {
      return Math.pow(10, num2 !== void 0 ? Math.max(num1, num2) : num1);
    } // fix: 9999999.99995 * 100000 = 999999999994.9999

  }, {
    key: "safeRoundUp",
    value: function safeRoundUp(num, exponent) {
      return Math.round(num * exponent);
    }
  }]);

  return Decimal;
}();


// CONCATENATED MODULE: ./lib/utils/control.ts
var _ERROR_MSG;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function control_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function control_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function control_createClass(Constructor, protoProps, staticProps) { if (protoProps) control_defineProperties(Constructor.prototype, protoProps); if (staticProps) control_defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var ERROR_TYPE;

(function (ERROR_TYPE) {
  ERROR_TYPE[ERROR_TYPE["VALUE"] = 1] = "VALUE";
  ERROR_TYPE[ERROR_TYPE["INTERVAL"] = 2] = "INTERVAL";
  ERROR_TYPE[ERROR_TYPE["MIN"] = 3] = "MIN";
  ERROR_TYPE[ERROR_TYPE["MAX"] = 4] = "MAX";
  ERROR_TYPE[ERROR_TYPE["ORDER"] = 5] = "ORDER";
})(ERROR_TYPE || (ERROR_TYPE = {}));

var ERROR_MSG = (_ERROR_MSG = {}, _defineProperty(_ERROR_MSG, ERROR_TYPE.VALUE, 'The type of the "value" is illegal'), _defineProperty(_ERROR_MSG, ERROR_TYPE.INTERVAL, 'The prop "interval" is invalid, "(max - min)" must be divisible by "interval"'), _defineProperty(_ERROR_MSG, ERROR_TYPE.MIN, 'The "value" must be greater than or equal to the "min".'), _defineProperty(_ERROR_MSG, ERROR_TYPE.MAX, 'The "value" must be less than or equal to the "max".'), _defineProperty(_ERROR_MSG, ERROR_TYPE.ORDER, 'When "order" is false, the parameters "minRange", "maxRange", "fixed", "enabled" are invalid.'), _ERROR_MSG);
/**
 * Slider logic control center
 *
 * @export
 * @class Control
 */

var control_Control = /*#__PURE__*/function () {
  function Control(options) {
    control_classCallCheck(this, Control);

    this.dotsPos = []; // The position of each slider

    this.dotsValue = []; // The value of each slider

    this.cacheRangeDir = {};
    this.data = options.data;
    this.max = options.max;
    this.min = options.min;
    this.interval = options.interval;
    this.order = options.order;
    this.marks = options.marks;
    this.included = options.included;
    this.process = options.process;
    this.adsorb = options.adsorb;
    this.dotOptions = options.dotOptions;
    this.onError = options.onError;

    if (this.order) {
      this.minRange = options.minRange || 0;
      this.maxRange = options.maxRange || 0;
      this.enableCross = options.enableCross;
      this.fixed = options.fixed;
    } else {
      if (options.minRange || options.maxRange || !options.enableCross || options.fixed) {
        this.emitError(ERROR_TYPE.ORDER);
      }

      this.minRange = 0;
      this.maxRange = 0;
      this.enableCross = true;
      this.fixed = false;
    }

    this.setValue(options.value);
  }

  control_createClass(Control, [{
    key: "setValue",
    value: function setValue(value) {
      var _this = this;

      this.setDotsValue(Array.isArray(value) ? this.order ? _toConsumableArray(value).sort(function (a, b) {
        return _this.getIndexByValue(a) - _this.getIndexByValue(b);
      }) : _toConsumableArray(value) : [value], true);
    }
  }, {
    key: "setDotsValue",
    value: function setDotsValue(value, syncPos) {
      this.dotsValue = value;

      if (syncPos) {
        this.syncDotsPos();
      }
    } // Set the slider position

  }, {
    key: "setDotsPos",
    value: function setDotsPos(dotsPos) {
      var _this2 = this;

      var list = this.order ? _toConsumableArray(dotsPos).sort(function (a, b) {
        return a - b;
      }) : dotsPos;
      this.dotsPos = list;
      this.setDotsValue(list.map(function (dotPos) {
        return _this2.getValueByPos(dotPos);
      }), this.adsorb);
    } // Get value by position

  }, {
    key: "getValueByPos",
    value: function getValueByPos(pos) {
      var value = this.parsePos(pos); // When included is true, the return value is the value of the nearest mark

      if (this.included) {
        var dir = 100;
        this.markList.forEach(function (mark) {
          var curDir = Math.abs(mark.pos - pos);

          if (curDir < dir) {
            dir = curDir;
            value = mark.value;
          }
        });
      }

      return value;
    } // Sync slider position

  }, {
    key: "syncDotsPos",
    value: function syncDotsPos() {
      var _this3 = this;

      this.dotsPos = this.dotsValue.map(function (v) {
        return _this3.parseValue(v);
      });
    }
    /**
     * Get all the marks
     *
     * @readonly
     * @type {Mark[]}
     * @memberof Control
     */

  }, {
    key: "getRecentDot",

    /**
     * Get the most recent slider index by position
     *
     * @param {number} pos
     * @returns {number}
     * @memberof Control
     */
    value: function getRecentDot(pos) {
      var _this4 = this;

      var arr = this.dotsPos.filter(function (dotPos, index) {
        return !(_this4.getDotOption(index) && _this4.getDotOption(index).disabled);
      }).map(function (dotPos) {
        return Math.abs(dotPos - pos);
      });
      return arr.indexOf(Math.min.apply(Math, _toConsumableArray(arr)));
    }
    /**
     * Get index by value
     *
     * @param {Value} value
     * @returns {number}
     * @memberof Control
     */

  }, {
    key: "getIndexByValue",
    value: function getIndexByValue(value) {
      if (this.data) {
        return this.data.indexOf(value);
      }

      return new Decimal(+value).minus(this.min).divide(this.interval).toNumber();
    }
    /**
     * Get value by index
     *
     * @param {index} number
     * @returns {Value}
     * @memberof Control
     */

  }, {
    key: "getValueByIndex",
    value: function getValueByIndex(index) {
      if (index < 0) {
        index = 0;
      } else if (index > this.total) {
        index = this.total;
      }

      return this.data ? this.data[index] : new Decimal(index).multiply(this.interval).plus(this.min).toNumber();
    }
    /**
     * Set the position of a single slider
     *
     * @param {number} pos
     * @param {number} index
     */

  }, {
    key: "setDotPos",
    value: function setDotPos(pos, index) {
      pos = this.getValidPos(pos, index).pos;
      var changePos = pos - this.dotsPos[index];

      if (!changePos) {
        return;
      }

      var changePosArr = new Array(this.dotsPos.length);

      if (this.fixed) {
        changePosArr = this.getFixedChangePosArr(changePos, index);
      } else if (this.minRange || this.maxRange) {
        changePosArr = this.getLimitRangeChangePosArr(pos, changePos, index);
      } else {
        changePosArr[index] = changePos;
      }

      this.setDotsPos(this.dotsPos.map(function (curPos, i) {
        return curPos + (changePosArr[i] || 0);
      }));
    }
    /**
     * In fixed mode, get the position of all slider changes
     *
     * @param {number} changePos Change distance of a single slider
     * @param {number} index slider index
     * @returns {DotsPosChangeArray}
     * @memberof Control
     */

  }, {
    key: "getFixedChangePosArr",
    value: function getFixedChangePosArr(changePos, index) {
      var _this5 = this;

      this.dotsPos.forEach(function (originPos, i) {
        if (i !== index) {
          var _this5$getValidPos = _this5.getValidPos(originPos + changePos, i),
              lastPos = _this5$getValidPos.pos,
              inRange = _this5$getValidPos.inRange;

          if (!inRange) {
            changePos = Math.min(Math.abs(lastPos - originPos), Math.abs(changePos)) * (changePos < 0 ? -1 : 1);
          }
        }
      });
      return this.dotsPos.map(function (_) {
        return changePos;
      });
    }
    /**
     * In minRange/maxRange mode, get the position of all slider changes
     *
     * @param {number} pos position of a single slider
     * @param {number} changePos Change distance of a single slider
     * @param {number} index slider index
     * @returns {DotsPosChangeArray}
     * @memberof Control
     */

  }, {
    key: "getLimitRangeChangePosArr",
    value: function getLimitRangeChangePosArr(pos, changePos, index) {
      var _this6 = this;

      var changeDots = [{
        index: index,
        changePos: changePos
      }];
      var newChangePos = changePos;
      [this.minRange, this.maxRange].forEach(function (isLimitRange, rangeIndex) {
        if (!isLimitRange) {
          return false;
        }

        var isMinRange = rangeIndex === 0;
        var isForward = changePos > 0;
        var next = 0;

        if (isMinRange) {
          next = isForward ? 1 : -1;
        } else {
          next = isForward ? -1 : 1;
        } // Determine if the two positions are within the legal interval


        var inLimitRange = function inLimitRange(pos2, pos1) {
          var diff = Math.abs(pos2 - pos1);
          return isMinRange ? diff < _this6.minRangeDir : diff > _this6.maxRangeDir;
        };

        var i = index + next;
        var nextPos = _this6.dotsPos[i];
        var curPos = pos;

        while (_this6.isPos(nextPos) && inLimitRange(nextPos, curPos)) {
          var _this6$getValidPos = _this6.getValidPos(nextPos + newChangePos, i),
              lastPos = _this6$getValidPos.pos;

          changeDots.push({
            index: i,
            changePos: lastPos - nextPos
          });
          i = i + next;
          curPos = lastPos;
          nextPos = _this6.dotsPos[i];
        }
      });
      return this.dotsPos.map(function (_, i) {
        var changeDot = changeDots.filter(function (dot) {
          return dot.index === i;
        });
        return changeDot.length ? changeDot[0].changePos : 0;
      });
    }
  }, {
    key: "isPos",
    value: function isPos(pos) {
      return typeof pos === 'number';
    }
    /**
     * Get a valid position by pos
     *
     * @param {number} pos
     * @param {number} index
     * @returns {{ pos: number, inRange: boolean }}
     */

  }, {
    key: "getValidPos",
    value: function getValidPos(pos, index) {
      var range = this.valuePosRange[index];
      var inRange = true;

      if (pos < range[0]) {
        pos = range[0];
        inRange = false;
      } else if (pos > range[1]) {
        pos = range[1];
        inRange = false;
      }

      return {
        pos: pos,
        inRange: inRange
      };
    }
    /**
     * Calculate the position of the slider by value
     *
     * @param {Value} val
     * @returns {number}
     */

  }, {
    key: "parseValue",
    value: function parseValue(val) {
      if (this.data) {
        val = this.data.indexOf(val);
      } else if (typeof val === 'number' || typeof val === 'string') {
        val = +val;

        if (val < this.min) {
          this.emitError(ERROR_TYPE.MIN);
          return 0;
        }

        if (val > this.max) {
          this.emitError(ERROR_TYPE.MAX);
          return 0;
        }

        if (typeof val !== 'number' || val !== val) {
          this.emitError(ERROR_TYPE.VALUE);
          return 0;
        }

        val = new Decimal(val).minus(this.min).divide(this.interval).toNumber();
      }

      var pos = new Decimal(val).multiply(this.gap).toNumber();
      return pos < 0 ? 0 : pos > 100 ? 100 : pos;
    }
    /**
     * Calculate the value by position
     *
     * @param {number} pos
     * @returns {Value}
     * @memberof Control
     */

  }, {
    key: "parsePos",
    value: function parsePos(pos) {
      var index = Math.round(pos / this.gap);
      return this.getValueByIndex(index);
    }
    /**
     * Determine if the location is active
     *
     * @param {number} pos
     * @returns {boolean}
     * @memberof Control
     */

  }, {
    key: "isActiveByPos",
    value: function isActiveByPos(pos) {
      return this.processArray.some(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            start = _ref2[0],
            end = _ref2[1];

        return pos >= start && pos <= end;
      });
    }
    /**
     * Get each value
     *
     * @returns {Value[]}
     * @memberof Control
     */

  }, {
    key: "getValues",
    value: function getValues() {
      if (this.data) {
        return this.data;
      } else {
        var values = [];

        for (var i = 0; i <= this.total; i++) {
          values.push(new Decimal(i).multiply(this.interval).plus(this.min).toNumber());
        }

        return values;
      }
    }
    /**
     * Calculate the distance of the range
     * @param range number
     */

  }, {
    key: "getRangeDir",
    value: function getRangeDir(range) {
      return range ? new Decimal(range).divide(new Decimal(this.data ? this.data.length - 1 : this.max).minus(this.data ? 0 : this.min).toNumber()).multiply(100).toNumber() : 100;
    }
  }, {
    key: "emitError",
    value: function emitError(type) {
      if (this.onError) {
        this.onError(type, ERROR_MSG[type]);
      }
    }
  }, {
    key: "getDotOption",
    value: function getDotOption(index) {
      return Array.isArray(this.dotOptions) ? this.dotOptions[index] : this.dotOptions;
    }
  }, {
    key: "getDotRange",
    value: function getDotRange(index, key, defaultValue) {
      if (!this.dotOptions) {
        return defaultValue;
      }

      var option = this.getDotOption(index);
      return option && option[key] !== void 0 ? this.parseValue(option[key]) : defaultValue;
    }
    /**
     * Sliding range of each slider
     *
     * @type {Array<[number, number]>}
     * @memberof Control
     */

  }, {
    key: "markList",
    get: function get() {
      var _this7 = this;

      if (!this.marks) {
        return [];
      }

      var getMarkByValue = function getMarkByValue(value, mark) {
        var pos = _this7.parseValue(value);

        return _objectSpread({
          pos: pos,
          value: value,
          label: value,
          active: _this7.isActiveByPos(pos)
        }, mark);
      };

      if (this.marks === true) {
        return this.getValues().map(function (value) {
          return getMarkByValue(value);
        });
      } else if (Object.prototype.toString.call(this.marks) === '[object Object]') {
        return Object.keys(this.marks).sort(function (a, b) {
          return +a - +b;
        }).map(function (value) {
          var item = _this7.marks[value];
          return getMarkByValue(value, typeof item !== 'string' ? item : {
            label: item
          });
        });
      } else if (Array.isArray(this.marks)) {
        return this.marks.map(function (value) {
          return getMarkByValue(value);
        });
      } else if (typeof this.marks === 'function') {
        return this.getValues().map(function (value) {
          return {
            value: value,
            result: _this7.marks(value)
          };
        }).filter(function (_ref3) {
          var result = _ref3.result;
          return !!result;
        }).map(function (_ref4) {
          var value = _ref4.value,
              result = _ref4.result;
          return getMarkByValue(value, result);
        });
      } else {
        return [];
      }
    }
  }, {
    key: "processArray",
    get: function get() {
      if (this.process) {
        if (typeof this.process === 'function') {
          return this.process(this.dotsPos);
        } else if (this.dotsPos.length === 1) {
          return [[0, this.dotsPos[0]]];
        } else if (this.dotsPos.length > 1) {
          return [[Math.min.apply(Math, _toConsumableArray(this.dotsPos)), Math.max.apply(Math, _toConsumableArray(this.dotsPos))]];
        }
      }

      return [];
    }
    /**
     * The total number of values
     *
     * @type {number}
     * @memberof Control
     */

  }, {
    key: "total",
    get: function get() {
      var total = 0;

      if (this.data) {
        total = this.data.length - 1;
      } else {
        total = new Decimal(this.max).minus(this.min).divide(this.interval).toNumber();
      }

      if (total - Math.floor(total) !== 0) {
        this.emitError(ERROR_TYPE.INTERVAL);
        return 0;
      }

      return total;
    } // Distance between each value

  }, {
    key: "gap",
    get: function get() {
      return 100 / this.total;
    } // The minimum distance between the two sliders

  }, {
    key: "minRangeDir",
    get: function get() {
      if (this.cacheRangeDir[this.minRange]) {
        return this.cacheRangeDir[this.minRange];
      }

      return this.cacheRangeDir[this.minRange] = this.getRangeDir(this.minRange);
    } // Maximum distance between the two sliders

  }, {
    key: "maxRangeDir",
    get: function get() {
      if (this.cacheRangeDir[this.maxRange]) return this.cacheRangeDir[this.maxRange];
      return this.cacheRangeDir[this.maxRange] = this.getRangeDir(this.maxRange);
    }
  }, {
    key: "valuePosRange",
    get: function get() {
      var _this8 = this;

      var dotsPos = this.dotsPos;
      var valuePosRange = [];
      dotsPos.forEach(function (pos, i) {
        valuePosRange.push([Math.max(_this8.minRange ? _this8.minRangeDir * i : 0, !_this8.enableCross ? dotsPos[i - 1] || 0 : 0, _this8.getDotRange(i, 'min', 0)), Math.min(_this8.minRange ? 100 - _this8.minRangeDir * (dotsPos.length - 1 - i) : 100, !_this8.enableCross ? dotsPos[i + 1] || 100 : 100, _this8.getDotRange(i, 'max', 100))]);
      });
      return valuePosRange;
    }
  }, {
    key: "dotsIndex",
    get: function get() {
      var _this9 = this;

      return this.dotsValue.map(function (val) {
        return _this9.getIndexByValue(val);
      });
    }
  }]);

  return Control;
}();


// CONCATENATED MODULE: ./lib/utils/state.ts
function state_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function state_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function state_createClass(Constructor, protoProps, staticProps) { if (protoProps) state_defineProperties(Constructor.prototype, protoProps); if (staticProps) state_defineProperties(Constructor, staticProps); return Constructor; }

var State = /*#__PURE__*/function () {
  function State(map) {
    state_classCallCheck(this, State);

    this.states = 0;
    this.map = map;
  }

  state_createClass(State, [{
    key: "add",
    value: function add(state) {
      this.states |= state;
    }
  }, {
    key: "delete",
    value: function _delete(state) {
      this.states &= ~state;
    }
  }, {
    key: "toggle",
    value: function toggle(state) {
      if (this.has(state)) {
        this.delete(state);
      } else {
        this.add(state);
      }
    }
  }, {
    key: "has",
    value: function has(state) {
      return !!(this.states & state);
    }
  }]);

  return State;
}();


// EXTERNAL MODULE: ./lib/styles/slider.scss
var slider = __webpack_require__("4abb");

// CONCATENATED MODULE: ./lib/vue-slider.tsx


function vue_slider_slicedToArray(arr, i) { return vue_slider_arrayWithHoles(arr) || vue_slider_iterableToArrayLimit(arr, i) || vue_slider_unsupportedIterableToArray(arr, i) || vue_slider_nonIterableRest(); }

function vue_slider_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function vue_slider_iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function vue_slider_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function vue_slider_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function vue_slider_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { vue_slider_ownKeys(Object(source), true).forEach(function (key) { vue_slider_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { vue_slider_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function vue_slider_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function vue_slider_toConsumableArray(arr) { return vue_slider_arrayWithoutHoles(arr) || vue_slider_iterableToArray(arr) || vue_slider_unsupportedIterableToArray(arr) || vue_slider_nonIterableSpread(); }

function vue_slider_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function vue_slider_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return vue_slider_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return vue_slider_arrayLikeToArray(o, minLen); }

function vue_slider_iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function vue_slider_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return vue_slider_arrayLikeToArray(arr); }

function vue_slider_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function vue_slider_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { vue_slider_typeof = function _typeof(obj) { return typeof obj; }; } else { vue_slider_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return vue_slider_typeof(obj); }

function vue_slider_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function vue_slider_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function vue_slider_createClass(Constructor, protoProps, staticProps) { if (protoProps) vue_slider_defineProperties(Constructor.prototype, protoProps); if (staticProps) vue_slider_defineProperties(Constructor, staticProps); return Constructor; }

function vue_slider_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) vue_slider_setPrototypeOf(subClass, superClass); }

function vue_slider_setPrototypeOf(o, p) { vue_slider_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return vue_slider_setPrototypeOf(o, p); }

function vue_slider_createSuper(Derived) { var hasNativeReflectConstruct = vue_slider_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = vue_slider_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = vue_slider_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return vue_slider_possibleConstructorReturn(this, result); }; }

function vue_slider_possibleConstructorReturn(self, call) { if (call && (vue_slider_typeof(call) === "object" || typeof call === "function")) { return call; } return vue_slider_assertThisInitialized(self); }

function vue_slider_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function vue_slider_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function vue_slider_getPrototypeOf(o) { vue_slider_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return vue_slider_getPrototypeOf(o); }










var SliderState = {
  None: 0,
  Drag: 1 << 1,
  Focus: 1 << 2
};
var DEFAULT_SLIDER_SIZE = 4;

var vue_slider_VueSlider =
/** @class */
function () {
  var VueSlider = /*#__PURE__*/function (_Vue) {
    vue_slider_inherits(VueSlider, _Vue);

    var _super = vue_slider_createSuper(VueSlider);

    function VueSlider() {
      var _this;

      vue_slider_classCallCheck(this, VueSlider);

      _this = _super.apply(this, arguments);
      _this.states = new State(SliderState); // The width of the component is divided into one hundred, the width of each one.

      _this.scale = 1; // Currently dragged slider index

      _this.focusDotIndex = 0;
      return _this;
    }

    vue_slider_createClass(VueSlider, [{
      key: "isObjectData",
      value: function isObjectData(data) {
        return !!data && Object.prototype.toString.call(data) === '[object Object]';
      }
    }, {
      key: "isObjectArrayData",
      value: function isObjectArrayData(data) {
        return !!data && Array.isArray(data) && data.length > 0 && vue_slider_typeof(data[0]) === 'object';
      }
    }, {
      key: "onValueChanged",
      value: function onValueChanged() {
        if (this.control && !this.states.has(SliderState.Drag) && this.isNotSync) {
          this.control.setValue(this.value);
          this.syncValueByPos();
        }
      }
    }, {
      key: "created",
      value: function created() {
        this.initControl();
      }
    }, {
      key: "mounted",
      value: function mounted() {
        this.bindEvent();
      }
    }, {
      key: "beforeDestroy",
      value: function beforeDestroy() {
        this.unbindEvent();
      }
    }, {
      key: "bindEvent",
      value: function bindEvent() {
        document.addEventListener('touchmove', this.dragMove, {
          passive: false
        });
        document.addEventListener('touchend', this.dragEnd, {
          passive: false
        });
        document.addEventListener('mousedown', this.blurHandle);
        document.addEventListener('mousemove', this.dragMove, {
          passive: false
        });
        document.addEventListener('mouseup', this.dragEnd);
        document.addEventListener('mouseleave', this.dragEnd);
        document.addEventListener('keydown', this.keydownHandle);
      }
    }, {
      key: "unbindEvent",
      value: function unbindEvent() {
        document.removeEventListener('touchmove', this.dragMove);
        document.removeEventListener('touchend', this.dragEnd);
        document.removeEventListener('mousedown', this.blurHandle);
        document.removeEventListener('mousemove', this.dragMove);
        document.removeEventListener('mouseup', this.dragEnd);
        document.removeEventListener('mouseleave', this.dragEnd);
        document.removeEventListener('keydown', this.keydownHandle);
      }
    }, {
      key: "setScale",
      value: function setScale() {
        var decimal = new Decimal(Math.floor(this.isHorizontal ? this.$refs.rail.offsetWidth : this.$refs.rail.offsetHeight));

        if (this.zoom !== void 0) {
          decimal.multiply(this.zoom);
        }

        decimal.divide(100);
        this.scale = decimal.toNumber();
      }
    }, {
      key: "initControl",
      value: function initControl() {
        var _this2 = this;

        this.control = new control_Control({
          value: this.value,
          data: this.sliderData,
          enableCross: this.enableCross,
          fixed: this.fixed,
          max: this.max,
          min: this.min,
          interval: this.interval,
          minRange: this.minRange,
          maxRange: this.maxRange,
          order: this.order,
          marks: this.sliderMarks,
          included: this.included,
          process: this.process,
          adsorb: this.adsorb,
          dotOptions: this.dotOptions,
          onError: this.emitError
        });
        this.syncValueByPos();
        ['data', 'enableCross', 'fixed', 'max', 'min', 'interval', 'minRange', 'maxRange', 'order', 'marks', 'process', 'adsorb', 'included', 'dotOptions'].forEach(function (name) {
          _this2.$watch(name, function (val) {
            if (name === 'data' && Array.isArray(_this2.control.data) && Array.isArray(val) && _this2.control.data.length === val.length && val.every(function (item, index) {
              return item === _this2.control.data[index];
            })) {
              return false;
            }

            switch (name) {
              case 'data':
              case 'dataLabel':
              case 'dataValue':
                _this2.control.data = _this2.sliderData;
                break;

              case 'mark':
                _this2.control.marks = _this2.sliderMarks;
                break;

              default:
                ;
                _this2.control[name] = val;
            }

            if (['data', 'max', 'min', 'interval'].indexOf(name) > -1) {
              _this2.control.syncDotsPos();
            }
          });
        });
      }
    }, {
      key: "syncValueByPos",
      value: function syncValueByPos() {
        var values = this.control.dotsValue;

        if (this.isDiff(values, Array.isArray(this.value) ? this.value : [this.value])) {
          this.$emit('change', values.length === 1 ? values[0] : vue_slider_toConsumableArray(values), this.focusDotIndex);
        }
      } // Slider value and component internal value are inconsistent

    }, {
      key: "isDiff",
      value: function isDiff(value1, value2) {
        return value1.length !== value2.length || value1.some(function (val, index) {
          return val !== value2[index];
        });
      }
    }, {
      key: "emitError",
      value: function emitError(type, message) {
        if (!this.silent) {
          console.error("[VueSlider error]: ".concat(message));
        }

        this.$emit('error', type, message);
      }
      /**
       * Get the drag range of the slider
       *
       * @private
       * @param {number} index slider index
       * @returns {[number, number]} range [start, end]
       * @memberof VueSlider
       */

    }, {
      key: "dragStartOnProcess",
      value: function dragStartOnProcess(e) {
        if (this.dragOnClick) {
          this.setScale();
          var pos = this.getPosByEvent(e);
          var index = this.control.getRecentDot(pos);

          if (this.dots[index].disabled) {
            return;
          }

          this.dragStart(index);
          this.control.setDotPos(pos, this.focusDotIndex);

          if (!this.lazy) {
            this.syncValueByPos();
          }
        }
      }
    }, {
      key: "dragStart",
      value: function dragStart(index) {
        this.focusDotIndex = index;
        this.setScale();
        this.states.add(SliderState.Drag);
        this.states.add(SliderState.Focus);
        this.$emit('drag-start', this.focusDotIndex);
      }
    }, {
      key: "dragMove",
      value: function dragMove(e) {
        if (!this.states.has(SliderState.Drag)) {
          return false;
        }

        e.preventDefault();
        var pos = this.getPosByEvent(e);
        this.isCrossDot(pos);
        this.control.setDotPos(pos, this.focusDotIndex);

        if (!this.lazy) {
          this.syncValueByPos();
        }

        var value = this.control.dotsValue;
        this.$emit('dragging', value.length === 1 ? value[0] : vue_slider_toConsumableArray(value), this.focusDotIndex);
      } // If the component is sorted, then when the slider crosses, toggle the currently selected slider index

    }, {
      key: "isCrossDot",
      value: function isCrossDot(pos) {
        if (this.canSort) {
          var curIndex = this.focusDotIndex;
          var curPos = pos;

          if (curPos > this.dragRange[1]) {
            curPos = this.dragRange[1];
            this.focusDotIndex++;
          } else if (curPos < this.dragRange[0]) {
            curPos = this.dragRange[0];
            this.focusDotIndex--;
          }

          if (curIndex !== this.focusDotIndex) {
            var dotVm = this.$refs["dot-".concat(this.focusDotIndex)];

            if (dotVm && dotVm.$el) {
              dotVm.$el.focus();
            }

            this.control.setDotPos(curPos, curIndex);
          }
        }
      }
    }, {
      key: "dragEnd",
      value: function dragEnd(e) {
        var _this3 = this;

        if (!this.states.has(SliderState.Drag)) {
          return false;
        }

        setTimeout(function () {
          if (_this3.lazy) {
            _this3.syncValueByPos();
          }

          if (_this3.included && _this3.isNotSync) {
            _this3.control.setValue(_this3.value);
          } else {
            // Sync slider position
            _this3.control.syncDotsPos();
          }

          _this3.states.delete(SliderState.Drag); // If useKeyboard is true, keep focus status after dragging


          if (!_this3.useKeyboard || 'targetTouches' in e) {
            _this3.states.delete(SliderState.Focus);
          }

          _this3.$emit('drag-end', _this3.focusDotIndex);
        });
      }
    }, {
      key: "blurHandle",
      value: function blurHandle(e) {
        if (!this.states.has(SliderState.Focus) || !this.$refs.container || this.$refs.container.contains(e.target)) {
          return false;
        }

        this.states.delete(SliderState.Focus);
      }
    }, {
      key: "clickHandle",
      value: function clickHandle(e) {
        if (!this.clickable || this.disabled) {
          return false;
        }

        if (this.states.has(SliderState.Drag)) {
          return;
        }

        this.setScale();
        var pos = this.getPosByEvent(e);
        this.setValueByPos(pos);
      }
    }, {
      key: "focus",
      value: function focus() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this.states.add(SliderState.Focus);
        this.focusDotIndex = index;
      }
    }, {
      key: "blur",
      value: function blur() {
        this.states.delete(SliderState.Focus);
      }
    }, {
      key: "getValue",
      value: function getValue() {
        var values = this.control.dotsValue;
        return values.length === 1 ? values[0] : values;
      }
    }, {
      key: "getIndex",
      value: function getIndex() {
        var indexes = this.control.dotsIndex;
        return indexes.length === 1 ? indexes[0] : indexes;
      }
    }, {
      key: "setValue",
      value: function setValue(value) {
        this.control.setValue(Array.isArray(value) ? vue_slider_toConsumableArray(value) : [value]);
        this.syncValueByPos();
      }
    }, {
      key: "setIndex",
      value: function setIndex(index) {
        var _this4 = this;

        var value = Array.isArray(index) ? index.map(function (n) {
          return _this4.control.getValueByIndex(n);
        }) : this.control.getValueByIndex(index);
        this.setValue(value);
      }
    }, {
      key: "setValueByPos",
      value: function setValueByPos(pos) {
        var _this5 = this;

        var index = this.control.getRecentDot(pos);

        if (this.disabled || this.dots[index].disabled) {
          return false;
        }

        this.focusDotIndex = index;
        this.control.setDotPos(pos, index);
        this.syncValueByPos();

        if (this.useKeyboard) {
          this.states.add(SliderState.Focus);
        }

        setTimeout(function () {
          if (_this5.included && _this5.isNotSync) {
            _this5.control.setValue(_this5.value);
          } else {
            _this5.control.syncDotsPos();
          }
        });
      }
    }, {
      key: "keydownHandle",
      value: function keydownHandle(e) {
        var _this6 = this;

        if (!this.useKeyboard || !this.states.has(SliderState.Focus)) {
          return false;
        }

        var isInclude = this.included && this.marks;
        var handleFunc = getKeyboardHandleFunc(e, {
          direction: this.direction,
          max: isInclude ? this.control.markList.length - 1 : this.control.total,
          min: 0,
          hook: this.keydownHook
        });

        if (handleFunc) {
          e.preventDefault();
          var newIndex = -1;
          var pos = 0;

          if (isInclude) {
            this.control.markList.some(function (mark, index) {
              if (mark.value === _this6.control.dotsValue[_this6.focusDotIndex]) {
                newIndex = handleFunc(index);
                return true;
              }

              return false;
            });

            if (newIndex < 0) {
              newIndex = 0;
            } else if (newIndex > this.control.markList.length - 1) {
              newIndex = this.control.markList.length - 1;
            }

            pos = this.control.markList[newIndex].pos;
          } else {
            newIndex = handleFunc(this.control.getIndexByValue(this.control.dotsValue[this.focusDotIndex]));
            pos = this.control.parseValue(this.control.getValueByIndex(newIndex));
          }

          this.isCrossDot(pos);
          this.control.setDotPos(pos, this.focusDotIndex);
          this.syncValueByPos();
        }
      }
    }, {
      key: "getPosByEvent",
      value: function getPosByEvent(e) {
        return getPos(e, this.$refs.rail, this.isReverse, this.zoom)[this.isHorizontal ? 'x' : 'y'] / this.scale;
      }
    }, {
      key: "renderSlot",
      value: function renderSlot(name, data, defaultSlot, isDefault) {
        var h = this.$createElement;
        var scopedSlot = this.$scopedSlots[name];
        return scopedSlot ? isDefault ? scopedSlot(data) : h("template", {
          "slot": name
        }, [scopedSlot(data)]) : defaultSlot;
      }
    }, {
      key: "render",
      value: function render() {
        var _this7 = this;

        var h = arguments[0];
        return h("div", helper_default()([{
          "ref": "container",
          "class": this.containerClasses,
          "style": this.containerStyles,
          "on": {
            "click": this.clickHandle,
            "touchstart": this.dragStartOnProcess,
            "mousedown": this.dragStartOnProcess
          }
        }, this.$attrs]), [h("div", {
          "ref": "rail",
          "class": "vue-slider-rail",
          "style": this.railStyle
        }, [this.processArray.map(function (item, index) {
          return _this7.renderSlot('process', item, h("div", {
            "class": "vue-slider-process",
            "key": "process-".concat(index),
            "style": item.style
          }), true);
        }), this.sliderMarks ? h("div", {
          "class": "vue-slider-marks"
        }, [this.control.markList.map(function (mark, index) {
          var _style;

          return _this7.renderSlot('mark', mark, h("vue-slider-mark", {
            "key": "mark-".concat(index),
            "attrs": {
              "mark": mark,
              "hideLabel": _this7.hideLabel,
              "stepStyle": _this7.stepStyle,
              "stepActiveStyle": _this7.stepActiveStyle,
              "labelStyle": _this7.labelStyle,
              "labelActiveStyle": _this7.labelActiveStyle
            },
            "style": (_style = {}, vue_slider_defineProperty(_style, _this7.isHorizontal ? 'height' : 'width', '100%'), vue_slider_defineProperty(_style, _this7.isHorizontal ? 'width' : 'height', _this7.tailSize), vue_slider_defineProperty(_style, _this7.mainDirection, "".concat(mark.pos, "%")), _style),
            "on": {
              "pressLabel": function pressLabel(pos) {
                return _this7.clickable && _this7.setValueByPos(pos);
              }
            }
          }, [_this7.renderSlot('step', mark, null), _this7.renderSlot('label', mark, null)]), true);
        })]) : null, this.dots.map(function (dot, index) {
          var _ref;

          return h("vue-slider-dot", {
            "ref": "dot-".concat(index),
            "key": "dot-".concat(index),
            "attrs": vue_slider_objectSpread({
              "value": dot.value,
              "disabled": dot.disabled,
              "focus": dot.focus,
              "dot-style": [dot.style, dot.disabled ? dot.disabledStyle : null, dot.focus ? dot.focusStyle : null],
              "tooltip": dot.tooltip || _this7.tooltip,
              "tooltip-style": [_this7.tooltipStyle, dot.tooltipStyle, dot.disabled ? dot.tooltipDisabledStyle : null, dot.focus ? dot.tooltipFocusStyle : null],
              "tooltip-formatter": Array.isArray(_this7.sliderTooltipFormatter) ? _this7.sliderTooltipFormatter[index] : _this7.sliderTooltipFormatter,
              "tooltip-placement": _this7.tooltipDirections[index],
              "role": "slider",
              "aria-valuenow": dot.value,
              "aria-valuemin": _this7.min,
              "aria-valuemax": _this7.max,
              "aria-orientation": _this7.isHorizontal ? 'horizontal' : 'vertical',
              "tabindex": "0"
            }, _this7.dotAttrs),
            "style": [_this7.dotBaseStyle, (_ref = {}, vue_slider_defineProperty(_ref, _this7.mainDirection, "".concat(dot.pos, "%")), vue_slider_defineProperty(_ref, "transition", "".concat(_this7.mainDirection, " ").concat(_this7.animateTime, "s")), _ref)],
            "on": {
              "drag-start": function dragStart() {
                return _this7.dragStart(index);
              }
            },
            "nativeOn": {
              "focus": function focus() {
                return !dot.disabled && _this7.focus(index);
              },
              "blur": function blur() {
                return _this7.blur();
              }
            }
          }, [_this7.renderSlot('dot', dot, null), _this7.renderSlot('tooltip', dot, null)]);
        }), this.renderSlot('default', {
          value: this.getValue()
        }, null, true)])]);
      }
    }, {
      key: "tailSize",
      get: function get() {
        return getSize((this.isHorizontal ? this.height : this.width) || DEFAULT_SLIDER_SIZE);
      }
    }, {
      key: "containerClasses",
      get: function get() {
        return ['vue-slider', ["vue-slider-".concat(this.direction)], {
          'vue-slider-disabled': this.disabled
        }];
      }
    }, {
      key: "containerStyles",
      get: function get() {
        var _ref2 = Array.isArray(this.dotSize) ? this.dotSize : [this.dotSize, this.dotSize],
            _ref3 = vue_slider_slicedToArray(_ref2, 2),
            dotWidth = _ref3[0],
            dotHeight = _ref3[1];

        var containerWidth = this.width ? getSize(this.width) : this.isHorizontal ? 'auto' : getSize(DEFAULT_SLIDER_SIZE);
        var containerHeight = this.height ? getSize(this.height) : this.isHorizontal ? getSize(DEFAULT_SLIDER_SIZE) : 'auto';
        return {
          padding: this.contained ? "".concat(dotHeight / 2, "px ").concat(dotWidth / 2, "px") : this.isHorizontal ? "".concat(dotHeight / 2, "px 0") : "0 ".concat(dotWidth / 2, "px"),
          width: containerWidth,
          height: containerHeight
        };
      }
    }, {
      key: "processArray",
      get: function get() {
        var _this8 = this;

        return this.control.processArray.map(function (_ref4, index) {
          var _objectSpread2;

          var _ref5 = vue_slider_slicedToArray(_ref4, 3),
              start = _ref5[0],
              end = _ref5[1],
              style = _ref5[2];

          if (start > end) {
            /* tslint:disable:semicolon */
            ;
            var _ref6 = [end, start];
            start = _ref6[0];
            end = _ref6[1];
          }

          var sizeStyleKey = _this8.isHorizontal ? 'width' : 'height';
          return {
            start: start,
            end: end,
            index: index,
            style: vue_slider_objectSpread(vue_slider_objectSpread((_objectSpread2 = {}, vue_slider_defineProperty(_objectSpread2, _this8.isHorizontal ? 'height' : 'width', '100%'), vue_slider_defineProperty(_objectSpread2, _this8.isHorizontal ? 'top' : 'left', 0), vue_slider_defineProperty(_objectSpread2, _this8.mainDirection, "".concat(start, "%")), vue_slider_defineProperty(_objectSpread2, sizeStyleKey, "".concat(end - start, "%")), vue_slider_defineProperty(_objectSpread2, "transitionProperty", "".concat(sizeStyleKey, ",").concat(_this8.mainDirection)), vue_slider_defineProperty(_objectSpread2, "transitionDuration", "".concat(_this8.animateTime, "s")), _objectSpread2), _this8.processStyle), style)
          };
        });
      }
    }, {
      key: "dotBaseStyle",
      get: function get() {
        var _ref7 = Array.isArray(this.dotSize) ? this.dotSize : [this.dotSize, this.dotSize],
            _ref8 = vue_slider_slicedToArray(_ref7, 2),
            dotWidth = _ref8[0],
            dotHeight = _ref8[1];

        var dotPos;

        if (this.isHorizontal) {
          dotPos = vue_slider_defineProperty({
            transform: "translate(".concat(this.isReverse ? '50%' : '-50%', ", -50%)"),
            '-WebkitTransform': "translate(".concat(this.isReverse ? '50%' : '-50%', ", -50%)"),
            top: '50%'
          }, this.direction === 'ltr' ? 'left' : 'right', '0');
        } else {
          dotPos = vue_slider_defineProperty({
            transform: "translate(-50%, ".concat(this.isReverse ? '50%' : '-50%', ")"),
            '-WebkitTransform': "translate(-50%, ".concat(this.isReverse ? '50%' : '-50%', ")"),
            left: '50%'
          }, this.direction === 'btt' ? 'bottom' : 'top', '0');
        }

        return vue_slider_objectSpread({
          width: "".concat(dotWidth, "px"),
          height: "".concat(dotHeight, "px")
        }, dotPos);
      }
    }, {
      key: "mainDirection",
      get: function get() {
        switch (this.direction) {
          case 'ltr':
            return 'left';

          case 'rtl':
            return 'right';

          case 'btt':
            return 'bottom';

          case 'ttb':
            return 'top';
        }
      }
    }, {
      key: "isHorizontal",
      get: function get() {
        return this.direction === 'ltr' || this.direction === 'rtl';
      }
    }, {
      key: "isReverse",
      get: function get() {
        return this.direction === 'rtl' || this.direction === 'btt';
      }
    }, {
      key: "tooltipDirections",
      get: function get() {
        var dir = this.tooltipPlacement || (this.isHorizontal ? 'top' : 'left');

        if (Array.isArray(dir)) {
          return dir;
        } else {
          return this.dots.map(function () {
            return dir;
          });
        }
      }
    }, {
      key: "dots",
      get: function get() {
        var _this9 = this;

        return this.control.dotsPos.map(function (pos, index) {
          return vue_slider_objectSpread({
            pos: pos,
            index: index,
            value: _this9.control.dotsValue[index],
            focus: _this9.states.has(SliderState.Focus) && _this9.focusDotIndex === index,
            disabled: _this9.disabled,
            style: _this9.dotStyle
          }, (Array.isArray(_this9.dotOptions) ? _this9.dotOptions[index] : _this9.dotOptions) || {});
        });
      }
    }, {
      key: "animateTime",
      get: function get() {
        if (this.states.has(SliderState.Drag)) {
          return 0;
        }

        return this.duration;
      }
    }, {
      key: "canSort",
      get: function get() {
        return this.order && !this.minRange && !this.maxRange && !this.fixed && this.enableCross;
      }
    }, {
      key: "sliderData",
      get: function get() {
        var _this10 = this;

        if (this.isObjectArrayData(this.data)) {
          return this.data.map(function (obj) {
            return obj[_this10.dataValue];
          });
        } else if (this.isObjectData(this.data)) {
          return Object.keys(this.data);
        } else {
          return this.data;
        }
      }
    }, {
      key: "sliderMarks",
      get: function get() {
        var _this11 = this;

        if (this.marks) {
          return this.marks;
        } else if (this.isObjectArrayData(this.data)) {
          return function (val) {
            var mark = {
              label: val
            };

            _this11.data.some(function (obj) {
              if (obj[_this11.dataValue] === val) {
                mark.label = obj[_this11.dataLabel];
                return true;
              }

              return false;
            });

            return mark;
          };
        } else if (this.isObjectData(this.data)) {
          return this.data;
        }
      }
    }, {
      key: "sliderTooltipFormatter",
      get: function get() {
        var _this12 = this;

        if (this.tooltipFormatter) {
          return this.tooltipFormatter;
        } else if (this.isObjectArrayData(this.data)) {
          return function (val) {
            var tooltipText = '' + val;

            _this12.data.some(function (obj) {
              if (obj[_this12.dataValue] === val) {
                tooltipText = obj[_this12.dataLabel];
                return true;
              }

              return false;
            });

            return tooltipText;
          };
        } else if (this.isObjectData(this.data)) {
          var data = this.data;
          return function (val) {
            return data[val];
          };
        }
      }
    }, {
      key: "isNotSync",
      get: function get() {
        var values = this.control.dotsValue;
        return Array.isArray(this.value) ? this.value.length !== values.length || this.value.some(function (val, index) {
          return val !== values[index];
        }) : this.value !== values[0];
      }
    }, {
      key: "dragRange",
      get: function get() {
        var prevDot = this.dots[this.focusDotIndex - 1];
        var nextDot = this.dots[this.focusDotIndex + 1];
        return [prevDot ? prevDot.pos : -Infinity, nextDot ? nextDot.pos : Infinity];
      }
    }]);

    return VueSlider;
  }(external_commonjs_vue_commonjs2_vue_root_Vue_amd_vue_default.a);

  __decorate([Model('change', {
    default: 0
  })], VueSlider.prototype, "value", void 0);

  __decorate([Prop({
    type: Boolean,
    default: false
  })], VueSlider.prototype, "silent", void 0);

  __decorate([Prop({
    default: 'ltr',
    validator: function validator(dir) {
      return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(dir) > -1;
    }
  })], VueSlider.prototype, "direction", void 0);

  __decorate([Prop({
    type: [Number, String]
  })], VueSlider.prototype, "width", void 0);

  __decorate([Prop({
    type: [Number, String]
  })], VueSlider.prototype, "height", void 0);

  __decorate([Prop({
    default: 14
  })], VueSlider.prototype, "dotSize", void 0);

  __decorate([Prop({
    default: false
  })], VueSlider.prototype, "contained", void 0);

  __decorate([Prop({
    type: Number,
    default: 0
  })], VueSlider.prototype, "min", void 0);

  __decorate([Prop({
    type: Number,
    default: 100
  })], VueSlider.prototype, "max", void 0);

  __decorate([Prop({
    type: Number,
    default: 1
  })], VueSlider.prototype, "interval", void 0);

  __decorate([Prop({
    type: Boolean,
    default: false
  })], VueSlider.prototype, "disabled", void 0);

  __decorate([Prop({
    type: Boolean,
    default: true
  })], VueSlider.prototype, "clickable", void 0);

  __decorate([Prop({
    type: Boolean,
    default: false
  })], VueSlider.prototype, "dragOnClick", void 0);

  __decorate([Prop({
    type: Number,
    default: 0.5
  })], VueSlider.prototype, "duration", void 0);

  __decorate([Prop({
    type: [Object, Array]
  })], VueSlider.prototype, "data", void 0);

  __decorate([Prop({
    type: String,
    default: 'value'
  })], VueSlider.prototype, "dataValue", void 0);

  __decorate([Prop({
    type: String,
    default: 'label'
  })], VueSlider.prototype, "dataLabel", void 0);

  __decorate([Prop({
    type: Boolean,
    default: false
  })], VueSlider.prototype, "lazy", void 0);

  __decorate([Prop({
    type: String,
    validator: function validator(val) {
      return ['none', 'always', 'focus', 'hover', 'active'].indexOf(val) > -1;
    },
    default: 'active'
  })], VueSlider.prototype, "tooltip", void 0);

  __decorate([Prop({
    type: [String, Array],
    validator: function validator(data) {
      return (Array.isArray(data) ? data : [data]).every(function (val) {
        return ['top', 'right', 'bottom', 'left'].indexOf(val) > -1;
      });
    }
  })], VueSlider.prototype, "tooltipPlacement", void 0);

  __decorate([Prop({
    type: [String, Array, Function]
  })], VueSlider.prototype, "tooltipFormatter", void 0);

  __decorate([Prop({
    type: Boolean,
    default: true
  })], VueSlider.prototype, "useKeyboard", void 0);

  __decorate([Prop(Function)], VueSlider.prototype, "keydownHook", void 0);

  __decorate([Prop({
    type: Boolean,
    default: true
  })], VueSlider.prototype, "enableCross", void 0);

  __decorate([Prop({
    type: Boolean,
    default: false
  })], VueSlider.prototype, "fixed", void 0);

  __decorate([Prop({
    type: Boolean,
    default: true
  })], VueSlider.prototype, "order", void 0);

  __decorate([Prop(Number)], VueSlider.prototype, "minRange", void 0);

  __decorate([Prop(Number)], VueSlider.prototype, "maxRange", void 0);

  __decorate([Prop({
    type: [Boolean, Object, Array, Function],
    default: false
  })], VueSlider.prototype, "marks", void 0);

  __decorate([Prop({
    type: [Boolean, Function],
    default: true
  })], VueSlider.prototype, "process", void 0);

  __decorate([Prop({
    type: [Number]
  })], VueSlider.prototype, "zoom", void 0);

  __decorate([Prop(Boolean)], VueSlider.prototype, "included", void 0);

  __decorate([Prop(Boolean)], VueSlider.prototype, "adsorb", void 0);

  __decorate([Prop(Boolean)], VueSlider.prototype, "hideLabel", void 0);

  __decorate([Prop()], VueSlider.prototype, "dotOptions", void 0);

  __decorate([Prop()], VueSlider.prototype, "dotAttrs", void 0);

  __decorate([Prop()], VueSlider.prototype, "railStyle", void 0);

  __decorate([Prop()], VueSlider.prototype, "processStyle", void 0);

  __decorate([Prop()], VueSlider.prototype, "dotStyle", void 0);

  __decorate([Prop()], VueSlider.prototype, "tooltipStyle", void 0);

  __decorate([Prop()], VueSlider.prototype, "stepStyle", void 0);

  __decorate([Prop()], VueSlider.prototype, "stepActiveStyle", void 0);

  __decorate([Prop()], VueSlider.prototype, "labelStyle", void 0);

  __decorate([Prop()], VueSlider.prototype, "labelActiveStyle", void 0);

  __decorate([Watch('value')], VueSlider.prototype, "onValueChanged", null);

  VueSlider = __decorate([vue_class_component_common_default()({
    name: 'VueSlider',
    data: function data() {
      return {
        control: null
      };
    },
    components: {
      VueSliderDot: vue_slider_dot,
      VueSliderMark: vue_slider_mark
    }
  })], VueSlider);
  return VueSlider;
}();

/* harmony default export */ var vue_slider = (vue_slider_VueSlider);
// CONCATENATED MODULE: ./lib/index.ts
/* tslint:disable:import-spacing */




vue_slider.VueSliderMark = vue_slider_mark;
vue_slider.VueSliderDot = vue_slider_dot;
/* harmony default export */ var lib = (vue_slider);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (lib);



/***/ })

/******/ })["default"];
});
//# sourceMappingURL=vue-slider-component.umd.js.map
Vue.component("image-editor", {
  props: ["uid", "model"],
  components: {
    VueSlider: window['vue-slider-component']
  },
  data: function () {
    return {
      isReady: false,
      cropper: null,
      zoom: 1,
      shown: false,
      supportedContentTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
      cropTypes: ["Default"],
      selectedCropType: "Default"
    };
  },
  mounted: function () {
    this.$modal = $('#previewModal');
    this.$pane = this.$modal.find('#' + this.uid);
    this.$navLink = this.$modal.find('.nav-link[href="#' + this.uid + '"]');
    this.$navItem = this.$navLink.parent().addClass('image-editor-nav-item');
    this.$navItem.on("shown.bs.tab", () => {
      this.elementIsShowing() && this.onShown();
    });
    this.$modal.on("shown.bs.modal", () => {
      this.elementIsShowing() && this.onShown();
    });
    this.$modal.on("hidden.bs.modal", () => {
      this.onHide();
    });
  },
  watch: {
    zoom: function (newValue) {
      if (this.isReady) {
        this.updateZoom(newValue);
      }
    },
    isSupported: function (newValue, oldValue) {
      this.$modal.toggleClass('has-image-editor', newValue);
      // Show the editor by default if supported
      if (newValue && !oldValue) {
        if (this.elementIsShowing()) {
          this.reloadCropper();
        } else {
          this.$navLink.tab('show');
        }
      }
    }
  },
  computed: {
    fieldValue: function () {
      var model = this.model && this.model.field ? this.model.field.model : {};
      if (!model.cropData) {
        return null;
      }
      return model.cropData[this.selectedCropType];
    },
    hasCropData: function () {
      var value = this.fieldValue;
      return value && value.width && value.height;
    },
    isSupported: function () {
      if (this.model && this.model.media && this.model.field) {
        return this.supportedContentTypes.indexOf(this.model.media.contentType) > -1;
      }
      return false;
    }
  },
  methods: {
    onShown: function () {
      this.shown = true;
      this.reloadCropper();
    },
    onHide: function () {
      this.shown = false;
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
      this.isReady = false;
    },
    setCropData: function (data) {
      var model = this.model && this.model.field ? this.model.field.model : {};
      if (!model.cropData) {
        model.cropData = {};
      }
      model.cropData[this.selectedCropType] = data;
    },
    updateZoom: function (value) {
      if (this.cropper) {
        var imageData = this.cropper.getImageData();
        var containerData = this.cropper.getContainerData();
        if (imageData.aspectRatio >= 1) {
          this.cropper.zoomTo(containerData.width / imageData.naturalWidth - (1 - value));
        } else {
          this.cropper.zoomTo(containerData.height / imageData.naturalHeight - (1 - value));
        }
      }
    },
    getFieldSettings: function () {
      return this.model && this.model.field && this.model.field.meta ? this.model.field.meta.settings : {};
    },
    initCropper: function () {
      if (!this.isSupported || this.cropper) {
        return;
      }
      this.isReady = false;
      var fieldSettings = this.getFieldSettings();
      var fieldValue = this.fieldValue;
      var hasCropData = this.hasCropData;
      clearTimeout(this.initCropperTimeout);
      this.initCropperTimeout = setTimeout(() => {
        var opts = {
          background: false,
          guides: false,
          autoCrop: false,
          scalable: false,
          rotatable: false,
          zoomOnWheel: false,
          toggleDragModeOnDblclick: false,
          ready: () => {
            this.updateZoom(this.zoom);
            if (hasCropData) {
              this.cropper.setData(fieldValue);
            }
            this.isReady = true;
          },
          crop: event => {
            this.setCropData(Object.assign(this.cropper.getData(true), {
              zoom: this.zoom
            }));
          }
        };
        if (hasCropData) {
          this.zoom = fieldValue.zoom || 1;
          opts.autoCrop = true;
        } else {
          this.zoom = 1;
        }

        //handle aspect ratio
        if (fieldSettings.AspectRatios && fieldSettings.AspectRatios.length === fieldSettings.Crops.length) {
          opts.aspectRatio = fieldSettings.AspectRatios.$values[this.cropTypes.indexOf(this.selectedCropType)];
        } else if (fieldSettings.AspectRatio) {
          opts.aspectRatio = fieldSettings.AspectRatio;
        }
        if (fieldSettings.MinWidth) {
          opts.minCropBoxWidth = fieldSettings.MinWidth;
        }
        if (fieldSettings.MinHeight) {
          opts.minCropBoxHeight = fieldSettings.MinHeight;
        }
        this.cropper = new Cropper(this.$refs.image, opts);
      });
    },
    reloadCropper: function () {
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      } else {
        if (this.getFieldSettings().Crops !== null && this.getFieldSettings().Crops !== undefined) {
          this.cropTypes = this.getFieldSettings().Crops.$values.length === 0 ? ["Default"] : this.getFieldSettings().Crops.$values;
          this.selectedCropType = this.cropTypes[0];
        } else {
          this.cropTypes = ["Default"], this.selectedCropType = "Default";
        }
      }
      this.initCropper();
    },
    elementIsShowing: function () {
      return this.$modal.hasClass('show') && this.$pane.hasClass('active') && this.$pane.hasClass('show');
    },
    reset: function () {
      if (this.cropper) {
        this.cropper.reset();
      }
    },
    clear: function () {
      if (this.cropper) {
        this.cropper.clear();
      }
      this.zoom = 1;
    }
  },
  template: "\n<div class=\"image-editor\" :class=\"{ ready: isReady }\">\n    <div class=\"image img-container\" >\n        <template v-if=\"isSupported\">\n            <img class=\"d-block mx-auto mw-100\" :src=\"model.media.publicUrl\" ref=\"image\" />\n        </template>\n    </div>\n    <div class=\"controls\">\n        <div class=\"row align-items-center\">\n            <div class=\"col-sm-6\">\n                <vue-slider \n                    v-model=\"zoom\" \n                    contained=\"true\" \n                    :min=\".2\" \n                    :max=\"1\" \n                    :interval=\".01\" \n                    :tooltip-formatter=\"(val) => Math.round(val * 100) + '%'\"\n                ></vue-slider>\n            </div>\n            <div class=\"col-sm-4\">\n                <div class=\"input-group\">\n                    <label class=\"form-label mt-2 mr-2\">Select Crop</label>\n                    <select class=\"form-control\" name=\"crop\"  v-model=\"selectedCropType\" @change=\"reloadCropper()\">\n                        <option v-for=\"crop in cropTypes\" :value=\"crop\">{{crop}}</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"col-sm-2 text-right\">\n                <button class=\"btn btn-info btn-sm\" title=\"Clear crop\" @click.prevent=\"clear()\"><i class=\"fas fa-sync-alt\"></i></button>\n            </div>\n        </div>\n    </div>\n</div>\n"
});