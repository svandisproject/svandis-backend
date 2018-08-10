'use strict'

const SvandisDataRegistry = artifacts.require('./SvandisDataRegistry.sol');
const SvandisDataFactory = artifacts.require('./SvandisDataFactory.sol');
const TokenScreenerFactory = artifacts.require('./TokenScreenerFactory.sol');
const IcoScreenerFactory = artifacts.require('./IcoScreenerFactory.sol');
const IcoScreener = artifacts.require('./IcoScreener.sol');
const TokenScreener = artifacts.require('./TokenScreener.sol');


const BigNumber = web3.BigNumber;

const should = require('chai')
	.use(require('chai-as-promised'))
	.use(require('chai-bignumber')(BigNumber))
	.should();

contract('SvandisDataFactory', function ([owner, unknown]) {

	let svandisDataRegistry;
	let svandisDataFactory;
	let tokenScreenerFactory;
	let icoScreenerFactory;
	let name, ticker, website, dataLoad, tokenGenerationEventTimestamp;
	let newDataLoad;

	let tokenScreener;
	let icoScreener;

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
	});


	it('should setup the svandis data registry', async function () {
		svandisDataRegistry = await SvandisDataRegistry.new(svandisDataFactory.address).should.be.fulfilled;
		await svandisDataFactory.transferOwnership(svandisDataRegistry.address).should.be.fulfilled;
	});


	it('should allow to change data registry address', async function () {
		await svandisDataRegistry.setSvandisDataFactory(tokenScreenerFactory.address, {from: owner}).should.be.fulfilled;
		await svandisDataRegistry.setSvandisDataFactory(svandisDataFactory.address, {from: owner}).should.be.fulfilled;
	});


	it('should create a new token screener', async function () {
		assert.equal(await svandisDataRegistry.getTokenScreenerCount(), 0);
		let tokenScreenerTx = await svandisDataRegistry.createNewTokenScreener(
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
		let icoScreenerTx = await svandisDataRegistry.createNewIcoScreener(
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

//Here we see how a certified hash based on JSON bytes will demonstrate change
	it('should update a tokens data hash', async function() {
		var screener = await TokenScreener.at(tokenScreener);
		let oldHash = await screener.currentDataHash();
		await svandisDataRegistry.updateSvandisData(tokenScreener, newDataLoad, {from: owner}).should.be.fulfilled;
		assert.notEqual(await screener.currentDataHash(), oldHash);
	});


	it('should update an ico data hash', async function() {
		var screener = await IcoScreener.at(icoScreener);
		let oldHash = await screener.currentDataHash();
		await svandisDataRegistry.updateSvandisData(icoScreener, newDataLoad, {from: owner}).should.be.fulfilled;
		assert.notEqual(await screener.currentDataHash(), oldHash);
	});


	it('should delete a token screener from registry', async function() {
		await svandisDataRegistry.deleteTokenMappingData(tokenScreener, {from: owner}).should.be.fulfilled;
		assert.equal(await svandisDataRegistry.getTokenScreenerCount(), 0);
	});


	it('should delete an ico screener from registry', async function() {
		await svandisDataRegistry.deleteIcoMappingData(icoScreener, {from: owner}).should.be.fulfilled;
		assert.equal(await svandisDataRegistry.getIcoScreenerCount(), 0);
	});
});