'use strict'

const SvandisDataRegistry = artifacts.require('./SvandisDataRegistry.sol');
const SvandisDataFactory = artifacts.require('./SvandisDataFactory.sol');
const TokenScreenerFactory = artifacts.require('./TokenScreenerFactory.sol');
const IcoScreenerFactory = artifacts.require('./IcoScreenerFactory.sol');
const Ecosystem = artifacts.require('./SvandisEcosystem.sol');
const Token = artifacts.require('./SvandisToken.sol');
const IcoScreener = artifacts.require('./IcoScreener.sol');
const TokenScreener = artifacts.require('./TokenScreener.sol');


const BigNumber = web3.BigNumber;

const should = require('chai')
	.use(require('chai-as-promised'))
	.use(require('chai-bignumber')(BigNumber))
	.should();

contract('SvandisEcosystem', function ([owner, unknown]) {

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
		ecoSystem = await Ecosystem.new(token.address, svandisDataRegistry.address);
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

});