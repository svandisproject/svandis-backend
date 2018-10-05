'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts
var BigNumber = web3.BigNumber;
var RLP = require('rlp');
var should = require('chai').use(require('chai-as-promised')).use(require('chai-bignumber')(BigNumber)).should();
var web3Instance = require("web3");
var Web3 = new web3Instance('ws://localhost:9545');

var ClaimHolderPresigned = artifacts.require("ClaimHolderPresigned.sol");
var KeyHolderLibrary = artifacts.require("KeyHolderLibrary");
var ClaimHolderLibrary = artifacts.require("ClaimHolderLibrary");
var UserRegistry = artifacts.require("UserRegistry.sol");

var prvSigner1 = Web3.utils.randomHex(32);
//let pubSigner = web3.eth.accounts.privateKeyToAccount(prvSigner).address; //Code to create key for public signer
var attestation_1 = void 0;

var data_text_1 = 'Verified OK';

var dataHash_1 = Web3.utils.asciiToHex(data_text_1);

contract("Identity integration", function (accounts) {
	var predictIdentityAddress = function () {
		var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(wallet) {
			var nonce, address;
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.next = 2;
							return new Promise(function (resolve) {
								Web3.eth.getTransactionCount(wallet, function (err, count) {
									resolve(count);
								});
							});

						case 2:
							nonce = _context2.sent;
							address = '0x' + Web3.utils.sha3(RLP.encode([wallet, nonce])).substring(26, 66);
							return _context2.abrupt('return', address.toString());

						case 5:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, this);
		}));

		return function predictIdentityAddress(_x) {
			return _ref2.apply(this, arguments);
		};
	}();

	var claimHolder = void 0,
	    userRegistry = void 0;

	beforeEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
		var keyLibrary, claimLibrary;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return UserRegistry.new({ from: accounts[0] });

					case 2:
						userRegistry = _context.sent;
						_context.next = 5;
						return KeyHolderLibrary.new();

					case 5:
						keyLibrary = _context.sent;
						_context.next = 8;
						return ClaimHolderLibrary.link('KeyHolderLibrary', keyLibrary.address);

					case 8:
						_context.next = 10;
						return ClaimHolderLibrary.new();

					case 10:
						claimLibrary = _context.sent;
						_context.next = 13;
						return ClaimHolderPresigned.link('KeyHolderLibrary', keyLibrary.address);

					case 13:
						_context.next = 15;
						return ClaimHolderPresigned.link('ClaimHolderLibrary', claimLibrary.address);

					case 15:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	})));

	it("can create presigned", _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
		var claimType_1, predictAddress, hashed, signed, claimId, fetchedClaim, _fetchedClaim, claimType, scheme, issuer, signature, data, uri;

		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						claimType_1 = 1;
						_context3.next = 3;
						return predictIdentityAddress(accounts[0]);

					case 3:
						predictAddress = _context3.sent;
						hashed = Web3.utils.soliditySha3(predictAddress, claimType_1, dataHash_1);
						_context3.next = 7;
						return Web3.eth.accounts.sign(hashed, prvSigner1);

					case 7:
						signed = _context3.sent;


						attestation_1 = {
							claimType: claimType_1,
							scheme: 1,
							issuer: accounts[1],
							signature: signed.signature,
							data: dataHash_1,
							uri: ""
						};
						claimId = Web3.utils.soliditySha3(attestation_1.issuer, attestation_1.claimType);
						_context3.next = 12;
						return ClaimHolderPresigned.new(accounts[4], accounts[5], userRegistry.address, [attestation_1.claimType], [attestation_1.issuer], attestation_1.signature, attestation_1.data, [data_text_1.length], { from: accounts[0] });

					case 12:
						claimHolder = _context3.sent;


						assert.equal(predictAddress, claimHolder.address);
						_context3.next = 16;
						return claimHolder.getClaim(claimId, { from: accounts[0] });

					case 16:
						fetchedClaim = _context3.sent;

						assert.ok(fetchedClaim);
						_fetchedClaim = _slicedToArray(fetchedClaim, 6), claimType = _fetchedClaim[0], scheme = _fetchedClaim[1], issuer = _fetchedClaim[2], signature = _fetchedClaim[3], data = _fetchedClaim[4], uri = _fetchedClaim[5];

						assert.equal(claimType.toNumber(), attestation_1.claimType);
						assert.equal(scheme.toNumber(), attestation_1.scheme);
						assert.equal(issuer, attestation_1.issuer);
						assert.equal(signature, attestation_1.signature);
						assert.equal(data, attestation_1.data);
						assert.equal(uri, attestation_1.uri);
						assert.equal(predictAddress, claimHolder.address);

					case 26:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	})));

	it("should have set management key", _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
		var acctSha3, res;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						acctSha3 = Web3.utils.keccak256(accounts[4]);
						_context4.next = 3;
						return claimHolder.getKey(acctSha3);

					case 3:
						res = _context4.sent;

						assert.equal(new BigNumber(res[0]), '1');
						assert.equal(new BigNumber(res[1]), '1');
						assert.equal(res[2], acctSha3);

					case 7:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, this);
	})));
});
//# sourceMappingURL=Identity.test.js.map