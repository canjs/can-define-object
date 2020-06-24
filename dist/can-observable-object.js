"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var namespace = require("can-namespace");

var _require = require("can-observable-mixin"),
    createConstructorFunction = _require.createConstructorFunction,
    makeDefineInstanceKey = _require.makeDefineInstanceKey,
    mixins = _require.mixins,
    mixinMapProps = _require.mixinMapProps,
    mixinProxy = _require.mixinProxy,
    mixinTypeEvents = _require.mixinTypeEvents;

var ObservableObject = /*#__PURE__*/function (_mixinProxy) {
  _inherits(ObservableObject, _mixinProxy);

  var _super = _createSuper(ObservableObject);

  function ObservableObject(props) {
    var _this;

    _classCallCheck(this, ObservableObject);

    _this = _super.call(this);
    mixins.finalizeClass(_this.constructor);
    mixins.initialize(_assertThisInitialized(_this), props); // Define class fields observables 
    //and return the proxy

    var proxiedInstance = new Proxy(_assertThisInitialized(_this), {
      defineProperty: function defineProperty(target, prop, descriptor) {
        var props = target.constructor.props;
        var value = descriptor.value; // do not create expando properties for special keys set by can-observable-mixin

        if (prop === '_instanceDefinitions') {
          return Reflect.defineProperty(target, prop, descriptor);
        }

        if (value) {
          // do not create expando properties for properties that are described
          // by `static props` or `static propertyDefaults`
          if (props && props[prop] || target.constructor.propertyDefaults) {
            target.set(prop, value);
            return true;
          } // create expandos to make all other properties observable


          return mixins.expando(target, prop, value);
        } // Prevent dispatching more than one event with canReflect.setKeyValue


        return Reflect.defineProperty(target, prop, descriptor);
      }
    }); // Adding the instance to observable-mixin 
    // prevents additional event dispatching 
    // https://github.com/canjs/can-observable-object/issues/35

    _this.constructor.instances.add(proxiedInstance);

    return _possibleConstructorReturn(_this, proxiedInstance);
  }

  return ObservableObject;
}(mixinProxy(Object));

ObservableObject = mixinTypeEvents(mixinMapProps(ObservableObject));
makeDefineInstanceKey(ObservableObject); // Export a constructor function to workaround an issue where ES2015 classes
// cannot be extended in code that's transpiled by Babel.

module.exports = namespace.ObservableObject = createConstructorFunction(ObservableObject);