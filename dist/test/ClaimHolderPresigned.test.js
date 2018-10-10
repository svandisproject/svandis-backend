"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts

var Web3 = require('web3');
var ClaimHolder = artifacts.require("ClaimHolder");
var ClaimHolderLibrary = artifacts.require("ClaimHolderLibrary");
var KeyHolderLibrary = artifacts.require("KeyHolderLibrary");
var ClaimHolderPresigned = artifacts.require("ClaimHolderPresigned");
var UserRegistry = artifacts.require("UserRegistry");

var signature_1 = "0xeb6123e537e17e2c67b67bbc0b93e6b25ea9eae276c4c2ab353bd7e853ebad2446cc7e91327f3737559d7a9a90fc88529a6b72b770a612f808ab0ba57a46866e1c";
var signature_2 = "0x061ef9cdd7707d90d7a7d95b53ddbd94905cb05dfe4734f97744c7976f2776145fef298fd0e31afa43a103cd7f5b00e3b226b0d62e4c492d54bec02eb0c2a0901b";

var dataHash_1 = "0x4f32f7a7d40b4d65a917926cbfd8fd521483e7472bcc4d024179735622447dc9";
var dataHash_2 = "0xa183d4eb3552e730c2dd3df91384426eb88879869b890ad12698320d8b88cb48";

contract("ClaimHolderPresigned", function (accounts) {
  var attestation_1 = {
    claimType: 1,
    scheme: 1,
    issuer: accounts[1],
    signature: signature_1,
    data: dataHash_1,
    uri: ""
  };
  var attestation_2 = {
    claimType: 2,
    scheme: 1,
    issuer: accounts[2],
    signature: signature_2,
    data: dataHash_2,
    uri: ""
  };

  it("should deploy identity with attestations", _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var userRegistry, keyLibrary, claimLibrary, instance, claimId_1, fetchedClaim_1, _fetchedClaim_, claimType_1, scheme_1, issuer_1, signature_1, data_1, uri_1, claimId_2, fetchedClaim_2, _fetchedClaim_2, claimType_2, scheme_2, issuer_2, signature_2, data_2, uri_2, identityAddress;

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
            _context.next = 17;
            return ClaimHolderPresigned.new(accounts[4], accounts[5], userRegistry.address, [attestation_1.claimType, attestation_2.claimType], [attestation_1.issuer, attestation_2.issuer], attestation_1.signature + attestation_2.signature.slice(2), attestation_1.data + attestation_2.data.slice(2), [32, 32], { from: accounts[0] });

          case 17:
            instance = _context.sent;


            // Check attestation 1
            claimId_1 = Web3.utils.soliditySha3(attestation_1.issuer, attestation_1.claimType);
            _context.next = 21;
            return instance.getClaim(claimId_1, { from: accounts[0] });

          case 21:
            fetchedClaim_1 = _context.sent;

            assert.ok(fetchedClaim_1);
            _fetchedClaim_ = _slicedToArray(fetchedClaim_1, 6), claimType_1 = _fetchedClaim_[0], scheme_1 = _fetchedClaim_[1], issuer_1 = _fetchedClaim_[2], signature_1 = _fetchedClaim_[3], data_1 = _fetchedClaim_[4], uri_1 = _fetchedClaim_[5];

            assert.equal(claimType_1.toNumber(), attestation_1.claimType);
            assert.equal(scheme_1.toNumber(), attestation_1.scheme);
            assert.equal(issuer_1, attestation_1.issuer);
            assert.equal(signature_1, attestation_1.signature);
            assert.equal(data_1, attestation_1.data);
            assert.equal(uri_1, attestation_1.uri);

            // Check attestation 2
            claimId_2 = Web3.utils.soliditySha3(attestation_2.issuer, attestation_2.claimType);
            _context.next = 33;
            return instance.getClaim(claimId_2, { from: accounts[0] });

          case 33:
            fetchedClaim_2 = _context.sent;

            assert.ok(fetchedClaim_2);
            _fetchedClaim_2 = _slicedToArray(fetchedClaim_2, 6), claimType_2 = _fetchedClaim_2[0], scheme_2 = _fetchedClaim_2[1], issuer_2 = _fetchedClaim_2[2], signature_2 = _fetchedClaim_2[3], data_2 = _fetchedClaim_2[4], uri_2 = _fetchedClaim_2[5];

            assert.equal(claimType_2.toNumber(), attestation_2.claimType);
            assert.equal(scheme_2.toNumber(), attestation_2.scheme);
            assert.equal(issuer_2, attestation_2.issuer);
            assert.equal(signature_2, attestation_2.signature);
            assert.equal(data_2, attestation_2.data);
            assert.equal(uri_2, attestation_2.uri);

            // Check user registry
            _context.next = 44;
            return userRegistry.users(accounts[4]);

          case 44:
            identityAddress = _context.sent;

            assert.ok(identityAddress);
            assert.notEqual(identityAddress, "0x0000000000000000000000000000000000000000");

          case 47:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
});
//# sourceMappingURL=ClaimHolderPresigned.test.js.map