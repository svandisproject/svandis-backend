//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts

var web3Instance = require("web3");
var Web3 = new web3Instance('ws://localhost:9545');

const ClaimHolderRegistered = artifacts.require("ClaimHolderRegistered.sol")
const KeyHolderLibrary = artifacts.require("KeyHolderLibrary")
const ClaimHolderLibrary = artifacts.require("ClaimHolderLibrary")
const UserRegistry = artifacts.require("UserRegistry.sol")

let prvSigner1 = Web3.utils.randomHex(32);
let prvSigner2 = Web3.utils.randomHex(32);
//let pubSigner = web3.eth.accounts.privateKeyToAccount(prvSigner).address; //Code to create key for public signer
let attestation_1, attestation_2;

const data_text_1 = 'Verified OK';
const data_text_2 = 'Verified Not OK';

const dataHash_1 = Web3.utils.asciiToHex(data_text_1);
const dataHash_2 = Web3.utils.asciiToHex(data_text_2);

contract("ClaimHolderRegistered", accounts => {
  let claimHolderRegistered, userRegistry

  beforeEach(async function() {
    userRegistry = await UserRegistry.new({from: accounts[0]});

	  let keyLibrary = await KeyHolderLibrary.new();
	  await ClaimHolderLibrary.link('KeyHolderLibrary', keyLibrary.address);
	  let claimLibrary = await ClaimHolderLibrary.new();
	  await ClaimHolderRegistered.link('KeyHolderLibrary', keyLibrary.address);
	  await ClaimHolderRegistered.link('ClaimHolderLibrary', claimLibrary.address);
      claimHolderRegistered = await ClaimHolderRegistered.new(accounts[4], accounts[5], userRegistry.address, { from: accounts[0] })
	  var claimType_1 = 1;
	  var hashed = Web3.utils.soliditySha3(claimHolderRegistered.address, claimType_1, dataHash_1);
	  var signed = await Web3.eth.accounts.sign(hashed, prvSigner1);
	  var claimType_2 = 2;
	  var hashed2 = Web3.utils.sha3(claimHolderRegistered.address, claimType_2, dataHash_2);
	  var signed2 = await Web3.eth.accounts.sign(hashed2, prvSigner2);

	  attestation_1 = {
		  claimType: claimType_1,
		  scheme: 1,
		  issuer: accounts[1],
		  signature: signed.signature,
		  data: dataHash_1,
		  uri: ""
	  }
	  attestation_2 = {
		  claimType: 2,
		  scheme: 1,
		  issuer: accounts[2],
		  signature: signed2.signature,
		  data: dataHash_2,
		  uri: ""
	  }
  })

  it("can add and get claim", async function() {
    let claimId = Web3.utils.soliditySha3(
      attestation_1.issuer,
      attestation_1.claimType
    )
    await claimHolderRegistered.addClaim(
      attestation_1.claimType,
      attestation_1.scheme,
      attestation_1.issuer,
      attestation_1.signature,
      attestation_1.data,
      attestation_1.uri,
      { from: accounts[0] }
    )
    let fetchedClaim = await claimHolderRegistered.getClaim(claimId, { from: accounts[0] })
    assert.ok(fetchedClaim)
    let [ claimType, scheme, issuer, signature, data, uri ] = fetchedClaim
    assert.equal(claimType.toNumber(), attestation_1.claimType)
    assert.equal(scheme.toNumber(), attestation_1.scheme)
    assert.equal(issuer, attestation_1.issuer)
    assert.equal(signature, attestation_1.signature)
    assert.equal(data, attestation_1.data)
    assert.equal(uri, attestation_1.uri)
  })

  it("can batch add claims", async function() {
    await claimHolderRegistered.addClaims(
      [ attestation_1.claimType, attestation_2.claimType ],
      [ attestation_1.issuer, attestation_2.issuer ],
      attestation_1.signature + attestation_2.signature.slice(2),
      attestation_1.data + attestation_2.data.slice(2),
      [data_text_1.length, data_text_2.length],
      { from: accounts[0] }
    );

    let claimId_1 = Web3.utils.soliditySha3(
      attestation_1.issuer,
      attestation_1.claimType
    )
    let fetchedClaim_1 = await claimHolderRegistered.getClaim(claimId_1, { from: accounts[0] })
    assert.ok(fetchedClaim_1)
    let [ claimType_1, scheme_1, issuer_1, signature_1, data_1, uri_1 ] = fetchedClaim_1
    assert.equal(claimType_1.toNumber(), attestation_1.claimType)
    assert.equal(scheme_1.toNumber(), attestation_1.scheme)
    assert.equal(issuer_1, attestation_1.issuer)
    assert.equal(signature_1, attestation_1.signature)
    assert.equal(data_1, attestation_1.data)
    assert.equal(uri_1, attestation_1.uri)

    let claimId_2 = Web3.utils.soliditySha3(
      attestation_2.issuer,
      attestation_2.claimType
    )
    let fetchedClaim_2 = await claimHolderRegistered.getClaim(claimId_2, { from: accounts[0] })
    assert.ok(fetchedClaim_2)
    let [ claimType_2, scheme_2, issuer_2, signature_2, data_2, uri_2 ] = fetchedClaim_2
    assert.equal(claimType_2.toNumber(), attestation_2.claimType)
    assert.equal(scheme_2.toNumber(), attestation_2.scheme)
    assert.equal(issuer_2, attestation_2.issuer)
    assert.equal(signature_2, attestation_2.signature)
    assert.equal(data_2, attestation_2.data)
    assert.equal(uri_2, attestation_2.uri)
  })

  it("registers the user", async function() {
    let identityAddress = await userRegistry.users(accounts[4])
    assert.ok(identityAddress)
    assert.notEqual(identityAddress, "0x0000000000000000000000000000000000000000")
  })
})
