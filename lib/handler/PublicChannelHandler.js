'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = require('../model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PublicChannelHandler = function () {
	function PublicChannelHandler(event) {
		_classCallCheck(this, PublicChannelHandler);

		this.event = event;

		this.channelMap = {};
	}

	_createClass(PublicChannelHandler, [{
		key: 'register',
		value: function register(data) {
			switch (data.event) {
				case 'error':
					this.event.emit('error', data);
					break;
				case 'subscribed':
					this.channelMap[data.chanId] = _extends({}, data);
				default:
					this.event.emit('other', data);
			}
		}
	}, {
		key: 'ticker',
		value: function ticker(pair, data) {
			this.event.emit('ticker', new _model.Ticker(pair, data));
		}
	}, {
		key: 'evaluate',
		value: function evaluate(_ref) {
			var _ref2 = _slicedToArray(_ref, 2),
			    chanId = _ref2[0],
			    data = _ref2[1];

			if (typeof data === 'string' || data.length < 2) {
				return false;
			}

			var _channelMap$chanId = this.channelMap[chanId],
			    channel = _channelMap$chanId.channel,
			    pair = _channelMap$chanId.pair;


			if (!this[channel]) {
				return false;
			}

			this[channel](pair, data);

			return true;
		}
	}]);

	return PublicChannelHandler;
}();

exports.default = PublicChannelHandler;