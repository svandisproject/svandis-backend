//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts
const BigNumber = web3.BigNumber;
var RLP = require('rlp');
const should = require('chai')
	.use(require('chai-as-promised'))
	.use(require('chai-bignumber')(BigNumber))
	.should();
var web3Instance = require("web3");
var Web3 = new web3Instance('ws://localhost:9545');

const ClaimHolderPresigned = artifacts.require("ClaimHolderPresigned.sol")
const KeyHolderLibrary = artifacts.require("KeyHolderLibrary")
const ClaimHolderLibrary = artifacts.require("ClaimHolderLibrary")
const UserRegistry = artifacts.require("UserRegistry.sol")

let prvSigner1 = Web3.utils.randomHex(32);
//let pubSigner = web3.eth.accounts.privateKeyToAccount(prvSigner).address; //Code to create key for public signer
let attestation_1;

const data_text_1 = 'Verified OK';

const dataHash_1 = Web3.utils.asciiToHex(data_text_1);

contract("Identity integration", accounts => {
  let claimHolder, userRegistry

  beforeEach(async function() {
    userRegistry = await UserRegistry.new({from: accounts[0]});

	  let keyLibrary = await KeyHolderLibrary.new();
	  await ClaimHolderLibrary.link('KeyHolderLibrary', keyLibrary.address);
	  let claimLibrary = await ClaimHolderLibrary.new();
	  await ClaimHolderPresigned.link('KeyHolderLibrary', keyLibrary.address);
	  await ClaimHolderPresigned.link('ClaimHolderLibrary', claimLibrary.address);
  })

	async function predictIdentityAddress(wallet) {
  	console.log(wallet);
		const nonce = await new Promise(resolve => {
			Web3.eth.getTransactionCount(wallet, (err, count) => {
				resolve(count)
			})
		})
		const address =
			'0x' + Web3.utils.sha3(RLP.encode([wallet, nonce])).substring(26, 66)
		return address.toString()
	}

	it("can create presigned", async function() {
		var claimType_1 = 1;
		let predictAddress = await predictIdentityAddress(accounts[0]);
		console.log("Predicted: " + predictAddress);
		var hashed = Web3.utils.soliditySha3(predictAddress, claimType_1, dataHash_1);
		var signed = await Web3.eth.accounts.sign(hashed, prvSigner1);

		attestation_1 = {
			claimType: claimType_1,
			scheme: 1,
			issuer: accounts[1],
			signature: signed.signature,
			data: dataHash_1,
			uri: ""
		}
		let claimId = Web3.utils.soliditySha3(
			attestation_1.issuer,
			attestation_1.claimType
		)
		claimHolder = await ClaimHolderPresigned.new(
			accounts[4],
			accounts[5],
			userRegistry.address,
			[attestation_1.claimType],
			[attestation_1.issuer],
			attestation_1.signature,
			attestation_1.data,
			[data_text_1.length], { from: accounts[0] });

		assert.equal(predictAddress, claimHolder.address);
		let fetchedClaim = await claimHolder.getClaim(claimId, { from: accounts[0] })
		assert.ok(fetchedClaim)
		let [ claimType, scheme, issuer, signature, data, uri ] = fetchedClaim
		assert.equal(claimType.toNumber(), attestation_1.claimType)
		assert.equal(scheme.toNumber(), attestation_1.scheme)
		assert.equal(issuer, attestation_1.issuer)
		assert.equal(signature, attestation_1.signature)
		assert.equal(data, attestation_1.data)
		assert.equal(uri, attestation_1.uri)
		assert.equal(predictAddress, claimHolder.address);
	})

	it("should have set management key", async function() {
		let acctSha3 = Web3.utils.keccak256(accounts[4]);
		var res = await claimHolder.getKey(acctSha3);
		assert.equal(new BigNumber(res[0]), '1');
		assert.equal(new BigNumber(res[1]), '1');
		assert.equal(res[2], acctSha3);
	})
})
