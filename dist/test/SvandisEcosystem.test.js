'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var web3Instance = require("web3");
var Web3 = new web3Instance('ws://localhost:9545');
var RLP = require('rlp');
var SvandisDataRegistry = artifacts.require('./SvandisDataRegistry.sol');
var SvandisDataFactory = artifacts.require('./SvandisDataFactory.sol');
var TokenScreenerFactory = artifacts.require('./TokenScreenerFactory.sol');
var IcoScreenerFactory = artifacts.require('./IcoScreenerFactory.sol');
var Ecosystem = artifacts.require('./SvandisEcosystem.sol');
var Token = artifacts.require('./SvandisToken.sol');
var IcoScreener = artifacts.require('./IcoScreener.sol');
var TokenScreener = artifacts.require('./TokenScreener.sol');

var ClaimHolder = artifacts.require("ClaimHolder.sol");
var UserRegistry = artifacts.require("UserRegistry.sol");
var ClaimHolderLibrary = artifacts.require("ClaimHolderLibrary.sol");
var KeyHolderLibrary = artifacts.require("KeyHolderLibrary.sol");
var ClaimHolderPresigned = artifacts.require("ClaimHolderPresigned.sol");

var BigNumber = web3.BigNumber;

var should = require('chai').use(require('chai-as-promised')).use(require('chai-bignumber')(BigNumber)).should();

var signature_1 = "0xeb6123e537e17e2c67b67bbc0b93e6b25ea9eae276c4c2ab353bd7e853ebad2446cc7e91327f3737559d7a9a90fc88529a6b72b770a612f808ab0ba57a46866e1c";
var signature_2 = "0x061ef9cdd7707d90d7a7d95b53ddbd94905cb05dfe4734f97744c7976f2776145fef298fd0e31afa43a103cd7f5b00e3b226b0d62e4c492d54bec02eb0c2a0901b";

var dataHash_1 = "0x4f32f7a7d40b4d65a917926cbfd8fd521483e7472bcc4d024179735622447dc9";
var dataHash_2 = "0xa183d4eb3552e730c2dd3df91384426eb88879869b890ad12698320d8b88cb48";
var dataString = 'CREATE NEW ACCOUNT';
var nullAddress = "0x0000000000000000000000000000000000000000";

contract('SvandisEcosystem', function (_ref) {
	var predictIdentityAddress = function () {
		var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(wallet) {
			var nonce, address;
			return regeneratorRuntime.wrap(function _callee6$(_context6) {
				while (1) {
					switch (_context6.prev = _context6.next) {
						case 0:
							_context6.next = 2;
							return new Promise(function (resolve) {
								Web3.eth.getTransactionCount(wallet, function (err, count) {
									resolve(count);
								});
							});

						case 2:
							nonce = _context6.sent;
							address = '0x' + Web3.utils.sha3(RLP.encode([wallet, nonce])).substring(26, 66);
							return _context6.abrupt('return', address.toString());

						case 5:
						case 'end':
							return _context6.stop();
					}
				}
			}, _callee6, this);
		}));

		return function predictIdentityAddress(_x) {
			return _ref8.apply(this, arguments);
		};
	}();

	var _ref2 = _slicedToArray(_ref, 5),
	    owner = _ref2[0],
	    unknown = _ref2[1],
	    newuser = _ref2[2],
	    swappeduser = _ref2[3],
	    extrauser = _ref2[4];

	var svandisDataRegistry = void 0;
	var svandisDataFactory = void 0;
	var tokenScreenerFactory = void 0;
	var icoScreenerFactory = void 0;
	var name = void 0,
	    ticker = void 0,
	    website = void 0,
	    dataLoad = void 0,
	    tokenGenerationEventTimestamp = void 0;
	var newDataLoad = void 0;

	var tokenScreener = void 0;
	var icoScreener = void 0;
	var ecoSystem = void 0;
	var token = void 0;
	var userRegistry = void 0;

	before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return TokenScreenerFactory.new();

					case 2:
						tokenScreenerFactory = _context.sent;
						_context.next = 5;
						return IcoScreenerFactory.new();

					case 5:
						icoScreenerFactory = _context.sent;


						name = "Svandis";
						ticker = 'SVN';
						website = "https://svandis.io";
						//Demo for how we will change data load and create different hash on chain from them.
						dataLoad = [0x76, 0x22, 0x2a];
						newDataLoad = [0x21, 0x99, 0xdf];
						tokenGenerationEventTimestamp = 1546300800;

						_context.next = 14;
						return SvandisDataFactory.new(tokenScreenerFactory.address, icoScreenerFactory.address);

					case 14:
						svandisDataFactory = _context.sent;
						_context.next = 17;
						return tokenScreenerFactory.transferOwnership(svandisDataFactory.address);

					case 17:
						_context.next = 19;
						return icoScreenerFactory.transferOwnership(svandisDataFactory.address);

					case 19:
						_context.next = 21;
						return SvandisDataRegistry.new(svandisDataFactory.address);

					case 21:
						svandisDataRegistry = _context.sent;
						_context.next = 24;
						return svandisDataFactory.transferOwnership(svandisDataRegistry.address);

					case 24:
						_context.next = 26;
						return Token.new();

					case 26:
						token = _context.sent;

					case 27:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	})));

	it('should setup the ecosystem', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
		var keyLibrary, claimLibrary;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return KeyHolderLibrary.new();

					case 2:
						keyLibrary = _context2.sent;
						_context2.next = 5;
						return ClaimHolderLibrary.link('KeyHolderLibrary', keyLibrary.address);

					case 5:
						_context2.next = 7;
						return ClaimHolderLibrary.new();

					case 7:
						claimLibrary = _context2.sent;
						_context2.next = 10;
						return Ecosystem.link('KeyHolderLibrary', keyLibrary.address);

					case 10:
						_context2.next = 12;
						return Ecosystem.link('ClaimHolderLibrary', claimLibrary.address);

					case 12:
						_context2.next = 14;
						return ClaimHolderPresigned.link('KeyHolderLibrary', keyLibrary.address);

					case 14:
						_context2.next = 16;
						return ClaimHolderPresigned.link('ClaimHolderLibrary', claimLibrary.address);

					case 16:
						_context2.next = 18;
						return UserRegistry.new({ from: owner });

					case 18:
						userRegistry = _context2.sent;
						_context2.next = 21;
						return Ecosystem.new(token.address, svandisDataRegistry.address, userRegistry.address, { from: owner });

					case 21:
						ecoSystem = _context2.sent;
						_context2.next = 24;
						return svandisDataRegistry.transferOwnership(ecoSystem.address).should.be.fulfilled;

					case 24:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	})));

	it('should allow to change data registry address', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return ecoSystem.setSvandisDataRegistry(tokenScreenerFactory.address, { from: owner }).should.be.fulfilled;

					case 2:
						_context3.next = 4;
						return ecoSystem.setSvandisDataRegistry(svandisDataRegistry.address, { from: owner }).should.be.fulfilled;

					case 4:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	})));

	it('should create a new token screener', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
		var tokenScreenerTx, screener;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.t0 = assert;
						_context4.next = 3;
						return svandisDataRegistry.getTokenScreenerCount();

					case 3:
						_context4.t1 = _context4.sent;

						_context4.t0.equal.call(_context4.t0, _context4.t1, 0);

						_context4.next = 7;
						return ecoSystem.createNewTokenScreener(name, ticker, website, dataLoad, { from: owner });

					case 7:
						tokenScreenerTx = _context4.sent;

						tokenScreener = tokenScreenerTx.logs[0].args.svandisDataLocation;
						_context4.next = 11;
						return TokenScreener.at(tokenScreener);

					case 11:
						screener = _context4.sent;
						_context4.t2 = assert;
						_context4.next = 15;
						return screener.name();

					case 15:
						_context4.t3 = _context4.sent;
						_context4.t4 = name;

						_context4.t2.equal.call(_context4.t2, _context4.t3, _context4.t4);

						_context4.t5 = assert;
						_context4.next = 21;
						return svandisDataRegistry.getTokenScreenerCount();

					case 21:
						_context4.t6 = _context4.sent;

						_context4.t5.equal.call(_context4.t5, _context4.t6, 1);

					case 23:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, this);
	})));

	it('should create a new ico screener', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
		var icoScreenerTx, screener;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.t0 = assert;
						_context5.next = 3;
						return svandisDataRegistry.getIcoScreenerCount();

					case 3:
						_context5.t1 = _context5.sent;

						_context5.t0.equal.call(_context5.t0, _context5.t1, 0);

						_context5.next = 7;
						return ecoSystem.createNewIcoScreener(name, ticker, website, dataLoad, tokenGenerationEventTimestamp, { from: owner });

					case 7:
						icoScreenerTx = _context5.sent;

						icoScreener = icoScreenerTx.logs[0].args.svandisDataLocation;
						_context5.next = 11;
						return IcoScreener.at(icoScreener);

					case 11:
						screener = _context5.sent;
						_context5.t2 = assert;
						_context5.next = 15;
						return screener.name();

					case 15:
						_context5.t3 = _context5.sent;
						_context5.t4 = name;

						_context5.t2.equal.call(_context5.t2, _context5.t3, _context5.t4);

						_context5.t5 = assert;
						_context5.next = 21;
						return svandisDataRegistry.getIcoScreenerCount();

					case 21:
						_context5.t6 = _context5.sent;

						_context5.t5.equal.call(_context5.t5, _context5.t6, 1);

					case 23:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, this);
	})));

	it('should get claim holder from user registry after creating user properly', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
		var predictAddress, claimType_1, hashed, prvSigner1, signed, claimType_2, prvSigner2, hashed2, signed2, attestation_1, attestation_2, instance, updateTx, identityAddress;
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						_context7.next = 2;
						return predictIdentityAddress(ecoSystem.address);

					case 2:
						predictAddress = _context7.sent;
						claimType_1 = 1;
						hashed = Web3.utils.soliditySha3(predictAddress, claimType_1, dataHash_1);
						prvSigner1 = Web3.utils.randomHex(32);
						_context7.next = 8;
						return Web3.eth.accounts.sign(hashed, prvSigner1);

					case 8:
						signed = _context7.sent;
						claimType_2 = 2;
						prvSigner2 = Web3.utils.randomHex(32);
						hashed2 = Web3.utils.sha3(predictAddress, claimType_2, dataHash_2);
						_context7.next = 14;
						return Web3.eth.accounts.sign(hashed2, prvSigner2);

					case 14:
						signed2 = _context7.sent;
						attestation_1 = {
							claimType: claimType_1,
							scheme: 1,
							issuer: owner,
							signature: signed.signature,
							data: hashed,
							uri: ""
						};
						attestation_2 = {
							claimType: claimType_2,
							scheme: 1,
							issuer: owner,
							signature: signed2.signature,
							data: hashed2,
							uri: ""
						};
						_context7.t0 = assert;
						_context7.next = 20;
						return userRegistry.users(newuser);

					case 20:
						_context7.t1 = _context7.sent;
						_context7.t2 = nullAddress;

						_context7.t0.equal.call(_context7.t0, _context7.t1, _context7.t2);

						_context7.next = 25;
						return ecoSystem.createNewCentralizedUser(newuser, [attestation_1.claimType, attestation_2.claimType], [attestation_1.issuer, attestation_2.issuer], attestation_1.signature + attestation_2.signature.slice(2), attestation_1.data + attestation_2.data.slice(2), [32, 32], { from: owner }).should.be.fulfilled;

					case 25:
						instance = _context7.sent;
						_context7.next = 28;
						return ecoSystem.getIdentityFromRegistry(newuser).should.be.fulfilled;

					case 28:
						updateTx = _context7.sent;
						_context7.next = 31;
						return userRegistry.users(newuser);

					case 31:
						identityAddress = _context7.sent;

						assert.ok(identityAddress);
						assert.notEqual(identityAddress, nullAddress);

					case 34:
					case 'end':
						return _context7.stop();
				}
			}
		}, _callee7, this);
	})));

	it('should update a screener', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
		var screener, oldHash, updateTx;
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						_context8.next = 2;
						return IcoScreener.at(icoScreener);

					case 2:
						screener = _context8.sent;
						_context8.next = 5;
						return screener.currentDataHash();

					case 5:
						oldHash = _context8.sent;
						_context8.next = 8;
						return ecoSystem.updateSvandisData(icoScreener, newDataLoad, [newuser], [10], [true], { from: owner }).should.be.fulfilled;

					case 8:
						updateTx = _context8.sent;
						_context8.t0 = assert;
						_context8.next = 12;
						return screener.currentDataHash();

					case 12:
						_context8.t1 = _context8.sent;
						_context8.t2 = oldHash;

						_context8.t0.notEqual.call(_context8.t0, _context8.t1, _context8.t2);

					case 15:
					case 'end':
						return _context8.stop();
				}
			}
		}, _callee8, this);
	})));

	it('should allow to swap key', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						_context9.next = 2;
						return ecoSystem.swapMainKeyForSvandisCentralizedUserAccounts(newuser, swappeduser, { from: owner }).should.be.fulfilled;

					case 2:
					case 'end':
						return _context9.stop();
				}
			}
		}, _callee9, this);
	})));

	it('should allow to add an extra key to svandis centralized (key managed) accounts', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						_context10.next = 2;
						return ecoSystem.addExtraKeyForSvandisCentralizedUserAccounts(swappeduser, extrauser, { from: owner }).should.be.fulfilled;

					case 2:
					case 'end':
						return _context10.stop();
				}
			}
		}, _callee10, this);
	})));

	it('should allow to delete that user', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						_context11.next = 2;
						return ecoSystem.removeUser(swappeduser, { from: owner }).should.be.fulfilled;

					case 2:
					case 'end':
						return _context11.stop();
				}
			}
		}, _callee11, this);
	})));
});
//# sourceMappingURL=SvandisEcosystem.test.js.map