"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts

var web3Instance = require("web3");
var Web3 = new web3Instance('ws://localhost:9545');

var ClaimHolderRegistered = artifacts.require("ClaimHolderRegistered.sol");
var KeyHolderLibrary = artifacts.require("KeyHolderLibrary");
var ClaimHolderLibrary = artifacts.require("ClaimHolderLibrary");
var UserRegistry = artifacts.require("UserRegistry.sol");

var prvSigner1 = Web3.utils.randomHex(32);
var prvSigner2 = Web3.utils.randomHex(32);
//let pubSigner = web3.eth.accounts.privateKeyToAccount(prvSigner).address; //Code to create key for public signer
var attestation_1 = void 0,
    attestation_2 = void 0;

var data_text_1 = 'Verified OK';
var data_text_2 = 'Verified Not OK';

var dataHash_1 = Web3.utils.asciiToHex(data_text_1);
var dataHash_2 = Web3.utils.asciiToHex(data_text_2);

contract("ClaimHolderRegistered", function (accounts) {
  var claimHolderRegistered = void 0,
      userRegistry = void 0;

  beforeEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var keyLibrary, claimLibrary, claimType_1, hashed, signed, claimType_2, hashed2, signed2;
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
            return ClaimHolderRegistered.link('KeyHolderLibrary', keyLibrary.address);

          case 13:
            _context.next = 15;
            return ClaimHolderRegistered.link('ClaimHolderLibrary', claimLibrary.address);

          case 15:
            _context.next = 17;
            return ClaimHolderRegistered.new(accounts[4], accounts[5], userRegistry.address, { from: accounts[0] });

          case 17:
            claimHolderRegistered = _context.sent;
            claimType_1 = 1;
            hashed = Web3.utils.soliditySha3(claimHolderRegistered.address, claimType_1, dataHash_1);
            _context.next = 22;
            return Web3.eth.accounts.sign(hashed, prvSigner1);

          case 22:
            signed = _context.sent;
            claimType_2 = 2;
            hashed2 = Web3.utils.sha3(claimHolderRegistered.address, claimType_2, dataHash_2);
            _context.next = 27;
            return Web3.eth.accounts.sign(hashed2, prvSigner2);

          case 27:
            signed2 = _context.sent;


            attestation_1 = {
              claimType: claimType_1,
              scheme: 1,
              issuer: accounts[1],
              signature: signed.signature,
              data: dataHash_1,
              uri: ""
            };
            attestation_2 = {
              claimType: 2,
              scheme: 1,
              issuer: accounts[2],
              signature: signed2.signature,
              data: dataHash_2,
              uri: ""
            };

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));

  it("can add and get claim", _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var claimId, fetchedClaim, _fetchedClaim, claimType, scheme, issuer, signature, data, uri;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            claimId = Web3.utils.soliditySha3(attestation_1.issuer, attestation_1.claimType);
            _context2.next = 3;
            return claimHolderRegistered.addClaim(attestation_1.claimType, attestation_1.scheme, attestation_1.issuer, attestation_1.signature, attestation_1.data, attestation_1.uri, { from: accounts[0] });

          case 3:
            _context2.next = 5;
            return claimHolderRegistered.getClaim(claimId, { from: accounts[0] });

          case 5:
            fetchedClaim = _context2.sent;

            assert.ok(fetchedClaim);
            _fetchedClaim = _slicedToArray(fetchedClaim, 6), claimType = _fetchedClaim[0], scheme = _fetchedClaim[1], issuer = _fetchedClaim[2], signature = _fetchedClaim[3], data = _fetchedClaim[4], uri = _fetchedClaim[5];

            assert.equal(claimType.toNumber(), attestation_1.claimType);
            assert.equal(scheme.toNumber(), attestation_1.scheme);
            assert.equal(issuer, attestation_1.issuer);
            assert.equal(signature, attestation_1.signature);
            assert.equal(data, attestation_1.data);
            assert.equal(uri, attestation_1.uri);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));

  it("can batch add claims", _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var claimId_1, fetchedClaim_1, _fetchedClaim_, claimType_1, scheme_1, issuer_1, signature_1, data_1, uri_1, claimId_2, fetchedClaim_2, _fetchedClaim_2, claimType_2, scheme_2, issuer_2, signature_2, data_2, uri_2;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return claimHolderRegistered.addClaims([attestation_1.claimType, attestation_2.claimType], [attestation_1.issuer, attestation_2.issuer], attestation_1.signature + attestation_2.signature.slice(2), attestation_1.data + attestation_2.data.slice(2), [data_text_1.length, data_text_2.length], { from: accounts[0] });

          case 2:
            claimId_1 = Web3.utils.soliditySha3(attestation_1.issuer, attestation_1.claimType);
            _context3.next = 5;
            return claimHolderRegistered.getClaim(claimId_1, { from: accounts[0] });

          case 5:
            fetchedClaim_1 = _context3.sent;

            assert.ok(fetchedClaim_1);
            _fetchedClaim_ = _slicedToArray(fetchedClaim_1, 6), claimType_1 = _fetchedClaim_[0], scheme_1 = _fetchedClaim_[1], issuer_1 = _fetchedClaim_[2], signature_1 = _fetchedClaim_[3], data_1 = _fetchedClaim_[4], uri_1 = _fetchedClaim_[5];

            assert.equal(claimType_1.toNumber(), attestation_1.claimType);
            assert.equal(scheme_1.toNumber(), attestation_1.scheme);
            assert.equal(issuer_1, attestation_1.issuer);
            assert.equal(signature_1, attestation_1.signature);
            assert.equal(data_1, attestation_1.data);
            assert.equal(uri_1, attestation_1.uri);

            claimId_2 = Web3.utils.soliditySha3(attestation_2.issuer, attestation_2.claimType);
            _context3.next = 17;
            return claimHolderRegistered.getClaim(claimId_2, { from: accounts[0] });

          case 17:
            fetchedClaim_2 = _context3.sent;

            assert.ok(fetchedClaim_2);
            _fetchedClaim_2 = _slicedToArray(fetchedClaim_2, 6), claimType_2 = _fetchedClaim_2[0], scheme_2 = _fetchedClaim_2[1], issuer_2 = _fetchedClaim_2[2], signature_2 = _fetchedClaim_2[3], data_2 = _fetchedClaim_2[4], uri_2 = _fetchedClaim_2[5];

            assert.equal(claimType_2.toNumber(), attestation_2.claimType);
            assert.equal(scheme_2.toNumber(), attestation_2.scheme);
            assert.equal(issuer_2, attestation_2.issuer);
            assert.equal(signature_2, attestation_2.signature);
            assert.equal(data_2, attestation_2.data);
            assert.equal(uri_2, attestation_2.uri);

          case 26:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));

  it("registers the user", _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var identityAddress;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return userRegistry.users(accounts[4]);

          case 2:
            identityAddress = _context4.sent;

            assert.ok(identityAddress);
            assert.notEqual(identityAddress, "0x0000000000000000000000000000000000000000");

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
});
//# sourceMappingURL=ClaimHolderRegistered.test.js.map