'use strict'
var Web3 = require("web3");
const SvandisDataRegistry = artifacts.require('./SvandisDataRegistry.sol');
const SvandisDataFactory = artifacts.require('./SvandisDataFactory.sol');
const TokenScreenerFactory = artifacts.require('./TokenScreenerFactory.sol');
const IcoScreenerFactory = artifacts.require('./IcoScreenerFactory.sol');
const Ecosystem = artifacts.require('./SvandisEcosystem.sol');
const Token = artifacts.require('./SvandisToken.sol');
const IcoScreener = artifacts.require('./IcoScreener.sol');
const TokenScreener = artifacts.require('./TokenScreener.sol');


const ClaimHolder = artifacts.require("ClaimHolder.sol");
const UserRegistry = artifacts.require("UserRegistry.sol");
const ClaimHolderLibrary = artifacts.require("ClaimHolderLibrary.sol");
const KeyHolderLibrary = artifacts.require("KeyHolderLibrary.sol");
const ClaimHolderPresigned = artifacts.require("ClaimHolderPresigned.sol");

const BigNumber = web3.BigNumber;

const should = require('chai')
	.use(require('chai-as-promised'))
	.use(require('chai-bignumber')(BigNumber))
	.should();

const signature_1 = "0xeb6123e537e17e2c67b67bbc0b93e6b25ea9eae276c4c2ab353bd7e853ebad2446cc7e91327f3737559d7a9a90fc88529a6b72b770a612f808ab0ba57a46866e1c"
const signature_2 = "0x061ef9cdd7707d90d7a7d95b53ddbd94905cb05dfe4734f97744c7976f2776145fef298fd0e31afa43a103cd7f5b00e3b226b0d62e4c492d54bec02eb0c2a0901b"

const dataHash_1 = "0x4f32f7a7d40b4d65a917926cbfd8fd521483e7472bcc4d024179735622447dc9"
const dataHash_2 = "0xa183d4eb3552e730c2dd3df91384426eb88879869b890ad12698320d8b88cb48"

contract('SvandisEcosystem', function ([owner, unknown, newuser, backup]) {

	let svandisDataRegistry;
	let svandisDataFactory;
	let tokenScreenerFactory;
	let icoScreenerFactory;
	let name, ticker, website, dataLoad, tokenGenerationEventTimestamp;
	let newDataLoad;

	let tokenScreener;
	let icoScreener;
	let ecoSystem;
	let token;
	let userRegistry;

	before(async function () {
		tokenScreenerFactory = await TokenScreenerFactory.new();
		icoScreenerFactory = await IcoScreenerFactory.new();

		name = "Svandis";
		ticker = 'SVN';
		website= "https://svandis.io";
		//Demo for how we will change data load and create different hash on chain from them.
		dataLoad = [0x76, 0x22, 0x2a];
		newDataLoad = [0x21, 0x99, 0xdf];
		tokenGenerationEventTimestamp = 1546300800;

		svandisDataFactory = await SvandisDataFactory.new(tokenScreenerFactory.address, icoScreenerFactory.address);

		await tokenScreenerFactory.transferOwnership(svandisDataFactory.address);
		await icoScreenerFactory.transferOwnership(svandisDataFactory.address);

		svandisDataRegistry = await SvandisDataRegistry.new(svandisDataFactory.address);
		await svandisDataFactory.transferOwnership(svandisDataRegistry.address);
		token = await Token.new();
	});


	it('should setup the ecosystem', async function () {
		let keyLibrary = await KeyHolderLibrary.new();
		await ClaimHolderLibrary.link('KeyHolderLibrary', keyLibrary.address);
		let claimLibrary = await ClaimHolderLibrary.new();
		await Ecosystem.link('KeyHolderLibrary', keyLibrary.address);
		await Ecosystem.link('ClaimHolderLibrary', claimLibrary.address);
		await ClaimHolderPresigned.link('KeyHolderLibrary', keyLibrary.address);
		await ClaimHolderPresigned.link('ClaimHolderLibrary', claimLibrary.address);
        userRegistry = await UserRegistry.new();
		ecoSystem = await Ecosystem.new(token.address, svandisDataRegistry.address, userRegistry.address);
		await svandisDataRegistry.transferOwnership(ecoSystem.address).should.be.fulfilled;
	});


	it('should allow to change data registry address', async function () {
		await ecoSystem.setSvandisDataRegistry(tokenScreenerFactory.address, {from: owner}).should.be.fulfilled;
		await ecoSystem.setSvandisDataRegistry(svandisDataRegistry.address, {from: owner}).should.be.fulfilled;
	});


	it('should create a new token screener', async function () {
		assert.equal(await svandisDataRegistry.getTokenScreenerCount(), 0);
		let tokenScreenerTx = await ecoSystem.createNewTokenScreener(
			name,
			ticker,
			website,
			dataLoad,
			{from: owner});
		tokenScreener = tokenScreenerTx.logs[0].args.svandisDataLocation;
		var screener = await TokenScreener.at(tokenScreener);
		assert.equal(await screener.name(), name);
		assert.equal(await svandisDataRegistry.getTokenScreenerCount(), 1);
	});


	it('should create a new ico screener', async function () {
		assert.equal(await svandisDataRegistry.getIcoScreenerCount(), 0);
		let icoScreenerTx = await ecoSystem.createNewIcoScreener(
			name,
			ticker,
			website,
			dataLoad,
			tokenGenerationEventTimestamp,
			{from: owner});
		icoScreener = icoScreenerTx.logs[0].args.svandisDataLocation;
		var screener = await IcoScreener.at(icoScreener);
		assert.equal(await screener.name(), name);
		assert.equal(await svandisDataRegistry.getIcoScreenerCount(), 1);
	});

	it('should update a screener', async function () {
		var screener = await IcoScreener.at(icoScreener);
		let oldHash = await screener.currentDataHash();
		let updateTx = await ecoSystem.updateSvandisData(
			icoScreener,
			newDataLoad,
			{from: owner}).should.be.fulfilled;
		assert.notEqual(await screener.currentDataHash(), oldHash);
	});
/*
address indexed _userRegistryAddress,
        uint256[] _claimType,
        address[] indexed _issuer,
        bytes _signature,
        bytes _data,
        uint256[] _offsets
 */

	let attestation_1 = {
		claimType: 1,
		scheme: 1,
		issuer: owner,
		signature: signature_1,
		data: dataHash_1,
		uri: ""
	};
	let attestation_2 = {
		claimType: 2,
		scheme: 1,
		issuer: unknown,
		signature: signature_2,
		data: dataHash_2,
		uri: ""
	};

	it('should get claim holder', async function () {

		let instance = await ClaimHolderPresigned.new(
			newuser,
 			backup,
			userRegistry.address,
			[ attestation_1.claimType, attestation_2.claimType ],
			[ attestation_1.issuer, attestation_2.issuer ],
			attestation_1.signature + attestation_2.signature.slice(2),
			attestation_1.data + attestation_2.data.slice(2),
			[32, 32], {from: owner});
		let updateTx = await ecoSystem.getClaimHolderFromRegistry(
			newuser);
		let identityAddress = await userRegistry.users(newuser);
		assert.ok(identityAddress);
		assert.notEqual(identityAddress, "0x0000000000000000000000000000000000000000");
		assert.equal(identityAddress, instance.address);
	});

});