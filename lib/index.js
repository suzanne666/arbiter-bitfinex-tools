'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _arbiterUtil = require('arbiter-util');

var _PublicChannelHandler = require('./handler/PublicChannelHandler');

var _PublicChannelHandler2 = _interopRequireDefault(_PublicChannelHandler);

var _AuthenticatedChannelHandler = require('./handler/AuthenticatedChannelHandler');

var _AuthenticatedChannelHandler2 = _interopRequireDefault(_AuthenticatedChannelHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var currencyNameMap = {
	'ETH': 'ethereum',
	'BTC': 'bitcoin',
	'LTC': 'litecoin',
	'ZEC': 'zcash',
	'BCH': 'bcash'
};

var ArbiterExchangeBitFinex = function (_EventEmitter) {
	_inherits(ArbiterExchangeBitFinex, _EventEmitter);

	function ArbiterExchangeBitFinex() {
		var wsUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'wss://api.bitfinex.com/ws/2';
		var restUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'https://api.bitfinex.com/v1';

		_classCallCheck(this, ArbiterExchangeBitFinex);

		var _this = _possibleConstructorReturn(this, (ArbiterExchangeBitFinex.__proto__ || Object.getPrototypeOf(ArbiterExchangeBitFinex)).call(this));

		_this.wallet = {};

		_this.restUrl = restUrl;

		var wsClient = _this.wsClient = new _ws2.default(wsUrl, {
			perMessageDeflate: false
		});

		var publicChannelHandler = new _PublicChannelHandler2.default(_this);

		var authenticatedChannelHandler = new _AuthenticatedChannelHandler2.default(_this);

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', function (resp) {
			var respJSON = JSON.parse(resp);
			// console.log(respJSON);

			if (respJSON.event) return publicChannelHandler.register(respJSON);

			if (publicChannelHandler.evaluate(respJSON)) return;

			if (authenticatedChannelHandler.evaluate(respJSON)) return;

			_this.emit('other', respJSON);
		});

		wsClient.on('open', function () {
			return _this.emit('open');
		});
		wsClient.on('close', function () {
			return _this.emit('close');
		});
		wsClient.on('error', function (error) {
			return _this.emit('error', error);
		});

		_this.once('balance', _this.initLocalWallet);

		_this.on('balance-update', _this.updateLocalWallet);
		return _this;
	}

	_createClass(ArbiterExchangeBitFinex, [{
		key: 'initLocalWallet',
		value: function initLocalWallet(balances) {
			var _this2 = this;

			balances.map(function (balance) {
				_this2.wallet[balance.currency] = balance;
			});
		}
	}, {
		key: 'updateLocalWallet',
		value: function updateLocalWallet(balance) {
			this.wallet[balance.currency] = balance;
		}

		/* Waiting Coroutine */

	}, {
		key: 'waitFor',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(eventName) {
				var self;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								self = this;
								return _context.abrupt('return', new Promise(function (resolve, reject) {
									self.once(eventName, resolve);
								}));

							case 2:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function waitFor(_x6) {
				return _ref.apply(this, arguments);
			}

			return waitFor;
		}()
	}, {
		key: 'waitForWalletUpdate',
		value: function (_waitForWalletUpdate) {
			function waitForWalletUpdate(_x, _x2, _x3) {
				return _waitForWalletUpdate.apply(this, arguments);
			}

			waitForWalletUpdate.toString = function () {
				return _waitForWalletUpdate.toString();
			};

			return waitForWalletUpdate;
		}(function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(currentAmount, targetDiff, currency) {
				var withdrawal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
				var updatedBalance, diff;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return this.waitFor('balance-update');

							case 2:
								updatedBalance = _context2.sent;

								if (!(updatedBalance.currency !== currency)) {
									_context2.next = 5;
									break;
								}

								return _context2.abrupt('return', waitForWalletUpdate(currentAmount, targetDiff, currency, withdrawal = true));

							case 5:
								diff = Math.abs(currentAmount - updatedBalance.available);

								if (!(diff < targetDiff)) {
									_context2.next = 8;
									break;
								}

								return _context2.abrupt('return', waitForWalletUpdate(currentAmount, targetDiff, currency, withdrawal = true));

							case 8:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			return function (_x8, _x9, _x10) {
				return _ref2.apply(this, arguments);
			};
		}())
	}, {
		key: 'open',
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								return _context3.abrupt('return', this.waitFor('open'));

							case 1:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function open() {
				return _ref3.apply(this, arguments);
			}

			return open;
		}()
	}, {
		key: 'close',
		value: function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								this.wsClient.close();
								return _context4.abrupt('return', this.waitFor('close'));

							case 2:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function close() {
				return _ref4.apply(this, arguments);
			}

			return close;
		}()
	}, {
		key: 'send',
		value: function send(socketMessage) {
			if (!socketMessage) return;
			this.wsClient.send(JSON.stringify(socketMessage));
		}
	}, {
		key: 'rest',
		value: function () {
			var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(route, data) {
				var restUrl, key, secret, nonce, body, payload, signature, headers, resp, respJSON;
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								_context5.prev = 0;
								restUrl = this.restUrl, key = this.key, secret = this.secret;
								nonce = Date.now().toString();
								body = JSON.stringify(_extends({
									request: '/v1/' + route,
									nonce: nonce
								}, data));
								payload = new Buffer(body).toString('base64');
								signature = _crypto2.default.createHmac('sha384', secret).update(payload).digest('hex');
								headers = {
									'X-BFX-APIKEY': key,
									'X-BFX-PAYLOAD': payload,
									'X-BFX-SIGNATURE': signature
								};
								_context5.next = 9;
								return (0, _nodeFetch2.default)(restUrl + '/' + route, {
									method: 'POST',
									headers: headers,
									body: body
								});

							case 9:
								resp = _context5.sent;
								_context5.next = 12;
								return resp.json();

							case 12:
								respJSON = _context5.sent;
								return _context5.abrupt('return', respJSON);

							case 16:
								_context5.prev = 16;
								_context5.t0 = _context5['catch'](0);

								this.emit('error', {
									error: _context5.t0
								});
								return _context5.abrupt('return', null);

							case 20:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this, [[0, 16]]);
			}));

			function rest(_x11, _x12) {
				return _ref5.apply(this, arguments);
			}

			return rest;
		}()
	}, {
		key: 'get',
		value: function () {
			var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(route) {
				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								return _context6.abrupt('return', this.rest(route));

							case 1:
							case 'end':
								return _context6.stop();
						}
					}
				}, _callee6, this);
			}));

			function get(_x13) {
				return _ref6.apply(this, arguments);
			}

			return get;
		}()
	}, {
		key: 'post',
		value: function () {
			var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(route, body) {
				return regeneratorRuntime.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								return _context7.abrupt('return', this.rest(route, body));

							case 1:
							case 'end':
								return _context7.stop();
						}
					}
				}, _callee7, this);
			}));

			function post(_x14, _x15) {
				return _ref7.apply(this, arguments);
			}

			return post;
		}()

		/* Streaming APIs: */

	}, {
		key: 'subscribeToReports',
		value: function subscribeToReports() {}
	}, {
		key: 'subscribeToTicker',
		value: function subscribeToTicker() {
			var pair = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['EOS', 'ETH'];

			this.send({
				event: 'subscribe',
				channel: 'ticker',
				symbol: 't' + pair.join('')
			});
		}

		/* REST-like APIs: */

	}, {
		key: 'requestDepositAddress',
		value: function () {
			var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
				var currency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ETH';
				var method, data;
				return regeneratorRuntime.wrap(function _callee8$(_context8) {
					while (1) {
						switch (_context8.prev = _context8.next) {
							case 0:
								method = currencyNameMap[currency];
								_context8.next = 3;
								return this.post('deposit/new', {
									method: currencyNameMap[currency],
									'wallet_name': 'exchange'
								});

							case 3:
								data = _context8.sent;

								if (!(!data || !data.address || data.result === 'error')) {
									_context8.next = 7;
									break;
								}

								this.emit('error', {
									error: data
								});

								return _context8.abrupt('return', null);

							case 7:
								return _context8.abrupt('return', data.address);

							case 8:
							case 'end':
								return _context8.stop();
						}
					}
				}, _callee8, this);
			}));

			function requestDepositAddress() {
				return _ref8.apply(this, arguments);
			}

			return requestDepositAddress;
		}()
	}, {
		key: 'requestWithdrawCrypto',
		value: function () {
			var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(_ref9) {
				var _ref9$currency = _ref9.currency,
				    currency = _ref9$currency === undefined ? 'ETH' : _ref9$currency,
				    _ref9$amount = _ref9.amount,
				    amount = _ref9$amount === undefined ? 0.5 : _ref9$amount,
				    _ref9$address = _ref9.address,
				    address = _ref9$address === undefined ? '0x74D5bCAF1ec7CF4BFAF4bb67D51D00dD821c5bF6' : _ref9$address,
				    _ref9$serious = _ref9.serious,
				    serious = _ref9$serious === undefined ? false : _ref9$serious;
				var data, currentAmount;
				return regeneratorRuntime.wrap(function _callee9$(_context9) {
					while (1) {
						switch (_context9.prev = _context9.next) {
							case 0:
								if (serious) {
									_context9.next = 2;
									break;
								}

								return _context9.abrupt('return', null);

							case 2:
								_context9.next = 4;
								return this.post('withdraw', {
									'withdraw_type': currencyNameMap[currency],
									'walletselected': 'exchange',
									address: address,
									amount: amount + ''
								});

							case 4:
								data = _context9.sent;

								if (!(!data || data[0].result !== 'success')) {
									_context9.next = 8;
									break;
								}

								this.emit('error', {
									error: data[0]
								});

								return _context9.abrupt('return', null);

							case 8:
								currentAmount = this.wallet[currency];
								_context9.next = 11;
								return waitForWalletUpdate(currentAmount, amount, currency);

							case 11:
								return _context9.abrupt('return', data[0]);

							case 12:
							case 'end':
								return _context9.stop();
						}
					}
				}, _callee9, this);
			}));

			function requestWithdrawCrypto(_x18) {
				return _ref10.apply(this, arguments);
			}

			return requestWithdrawCrypto;
		}()
	}, {
		key: 'requestBuyOrder',
		value: function () {
			var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(_ref11) {
				var _ref11$pair = _ref11.pair,
				    pair = _ref11$pair === undefined ? ['EOS', 'ETH'] : _ref11$pair,
				    _ref11$quantity = _ref11.quantity,
				    quantity = _ref11$quantity === undefined ? 0.04 : _ref11$quantity,
				    _ref11$price = _ref11.price,
				    price = _ref11$price === undefined ? 0 : _ref11$price;
				var symbol, params, data;
				return regeneratorRuntime.wrap(function _callee10$(_context10) {
					while (1) {
						switch (_context10.prev = _context10.next) {
							case 0:
								symbol = pair.join('');
								params = this.makeOrderParams('t' + symbol, '' + quantity, price);


								this.send([0, "on", null, params]);

								_context10.next = 5;
								return Promise.race([this.waitFor('order'), this.waitFor('error')]);

							case 5:
								data = _context10.sent;

								if (!data.error) {
									_context10.next = 8;
									break;
								}

								return _context10.abrupt('return', null);

							case 8:
								return _context10.abrupt('return', data);

							case 9:
							case 'end':
								return _context10.stop();
						}
					}
				}, _callee10, this);
			}));

			function requestBuyOrder(_x19) {
				return _ref12.apply(this, arguments);
			}

			return requestBuyOrder;
		}()
	}, {
		key: 'requestSellOrder',
		value: function () {
			var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(_ref13) {
				var _ref13$pair = _ref13.pair,
				    pair = _ref13$pair === undefined ? ['EOS', 'ETH'] : _ref13$pair,
				    _ref13$quantity = _ref13.quantity,
				    quantity = _ref13$quantity === undefined ? 2.0 : _ref13$quantity,
				    _ref13$price = _ref13.price,
				    price = _ref13$price === undefined ? 0 : _ref13$price;
				var symbol, params, data;
				return regeneratorRuntime.wrap(function _callee11$(_context11) {
					while (1) {
						switch (_context11.prev = _context11.next) {
							case 0:
								symbol = pair.join('');
								_context11.next = 3;
								return this.makeOrderParams('t' + symbol, '' + -1 * quantity, price);

							case 3:
								params = _context11.sent;


								this.send([0, "on", null, params]);

								_context11.next = 7;
								return Promise.race([this.waitFor('order'), this.waitFor('error')]);

							case 7:
								data = _context11.sent;

								if (!data.error) {
									_context11.next = 10;
									break;
								}

								return _context11.abrupt('return', null);

							case 10:
								return _context11.abrupt('return', data);

							case 11:
							case 'end':
								return _context11.stop();
						}
					}
				}, _callee11, this);
			}));

			function requestSellOrder(_x20) {
				return _ref14.apply(this, arguments);
			}

			return requestSellOrder;
		}()
	}, {
		key: 'requestCancelOrder',
		value: function requestCancelOrder(id) {
			this.send([0, 'oc', null, {
				id: id
			}]);
			return this.waitFor('order');
		}
	}, {
		key: 'requestTradingBalance',
		value: function requestTradingBalance() {}
	}, {
		key: 'authenticate',
		value: function () {
			var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(_ref15) {
				var key = _ref15.key,
				    secret = _ref15.secret;
				var event, nonce, payload, filter, signature;
				return regeneratorRuntime.wrap(function _callee12$(_context12) {
					while (1) {
						switch (_context12.prev = _context12.next) {
							case 0:
								this.key = key;
								this.secret = secret;

								event = 'auth';
								nonce = Date.now() + Math.random().toString();
								payload = 'AUTH' + nonce;
								filter = ['trading', 'wallet', 'balance'];
								signature = _crypto2.default.createHmac('sha384', secret).update(payload).digest('hex');


								this.send({
									event: event,
									filter: filter,
									apiKey: key,
									authSig: signature,
									authNonce: nonce,
									authPayload: payload
								});

								return _context12.abrupt('return', this.waitFor('auth'));

							case 9:
							case 'end':
								return _context12.stop();
						}
					}
				}, _callee12, this);
			}));

			function authenticate(_x21) {
				return _ref16.apply(this, arguments);
			}

			return authenticate;
		}()
	}, {
		key: 'makeOrderParams',
		value: function makeOrderParams(symbol, amount, price) {
			var cid = (0, _arbiterUtil.generateRandomInt)(36);

			var params = {
				cid: cid,
				symbol: symbol,
				amount: amount
			};

			if (!price) {
				params.type = 'EXCHANGE MARKET';
			} else {
				params.type = 'EXCHANGE LIMIT';
				params.price = '' + price;
			}

			return params;
		}
	}]);

	return ArbiterExchangeBitFinex;
}(_events2.default);

exports.default = ArbiterExchangeBitFinex;