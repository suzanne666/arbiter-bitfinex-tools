'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Order = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _arbiterModel = require('arbiter-model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OrderTypeMap = {
	'EXCHANGE LIMIT': _arbiterModel.OrderType.LIMIT,
	'EXCHANGE MARKET': _arbiterModel.OrderType.MARKET
};

var OrderStatusMap = _extends({}, _arbiterModel.OrderStatus, {
	EXECUTED: _arbiterModel.OrderStatus.FILLED

	/*
 	bitfinex order
 */
});
var Order = exports.Order = function (_DefaultOrder) {
	_inherits(Order, _DefaultOrder);

	/*
 [
 	3159460078, null, 24680610010, "tIOTUSD", 1500965481000, 1500965480000,
 	-200, -200, "EXCHANGE LIMIT", null, null, null,
 	0, "EXECUTED @ 190(50)", null, null, 50, 0,
 	null, null, null, null, null, 0, 0, 0
 ]
 px === place holder
 */
	function Order(_ref) {
		var _ref2 = _slicedToArray(_ref, 18),
		    id = _ref2[0],
		    gid = _ref2[1],
		    cid = _ref2[2],
		    rawSymbol = _ref2[3],
		    creation = _ref2[4],
		    updateTime = _ref2[5],
		    quantity = _ref2[6],
		    originalQuantity = _ref2[7],
		    rawType = _ref2[8],
		    previousType = _ref2[9],
		    p1 = _ref2[10],
		    p2 = _ref2[11],
		    flags = _ref2[12],
		    rawStatus = _ref2[13],
		    p3 = _ref2[14],
		    p4 = _ref2[15],
		    price = _ref2[16],
		    averagePrice = _ref2[17];

		_classCallCheck(this, Order);

		var side = quantity[0] !== '-' ? _arbiterModel.OrderSide.BUY : _arbiterModel.OrderSide.SELL;

		var type = OrderTypeMap[rawType];

		// Grabbing just the first part of the status
		var status = OrderStatusMap[rawStatus.split(' @')[0]] || _arbiterModel.OrderStatus.OTHER;

		var timestamp = Number(updateTime);

		var symbol = rawSymbol.slice(1);

		return _possibleConstructorReturn(this, (Order.__proto__ || Object.getPrototypeOf(Order)).call(this, {
			id: id,
			symbol: symbol,
			type: type,
			side: side,
			status: status,
			quantity: quantity,
			price: price,
			timestamp: timestamp
		}));
	}

	return Order;
}(_arbiterModel.Order);