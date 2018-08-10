'use strict'

const SvandisDataFactory = artifacts.require('./SvandisDataFactory.sol');
const TokenScreenerFactory = artifacts.require('./TokenScreenerFactory.sol');
const IcoScreenerFactory = artifacts.require('./IcoScreenerFactory.sol');


const BigNumber = web3.BigNumber;

const should = require('chai')
	.use(require('chai-as-promised'))
	.use(require('chai-bignumber')(BigNumber))
	.should();

contract('SvandisDataFactory', function ([owner, unknown]) {

	let svandisDataFactory;
	let tokenScreenerFactory;
	let icoScreenerFactory;
	let name, ticker, website, dataLoad, tokenGenerationEventTimestamp;

	before(async function () {
		tokenScreenerFactory = await TokenScreenerFactory.new();
		icoScreenerFactory = await IcoScreenerFactory.new();

		name = "Svandis";
		ticker = 'SVN';
		website= "https://svandis.io";
		dataLoad = 0x76;
		tokenGenerationEventTimestamp = 1546300800;
	});


	it('should allow for setup of the factory', async function () {
		svandisDataFactory = await SvandisDataFactory.new(tokenScreenerFactory.address, icoScreenerFactory.address).should.be.fulfilled;

		await tokenScreenerFactory.transferOwnership(svandisDataFactory.address).should.be.fulfilled;
		await icoScreenerFactory.transferOwnership(svandisDataFactory.address).should.be.fulfilled;
	});


	it('should allow to change token screener factories', async function () {
		await svandisDataFactory.setTokenScreenerFactoryAddress(icoScreenerFactory.address, {from: owner}).should.be.fulfilled;
		await svandisDataFactory.setTokenScreenerFactoryAddress(tokenScreenerFactory.address, {from: owner}).should.be.fulfilled;
	});


	it('should allow to change ico screener factories', async function () {
		await svandisDataFactory.setIcoScreenerFactoryAddress(tokenScreenerFactory.address, {from: owner}).should.be.fulfilled;
		await svandisDataFactory.setIcoScreenerFactoryAddress(icoScreenerFactory.address, {from: owner}).should.be.fulfilled;
	});


	it('should create a token screener', async function () {
		await svandisDataFactory.newTokenScreener(
			svandisDataFactory.address,
			name,
			ticker,
			website,
			dataLoad,
			{from: owner}).should.be.fulfilled;
	});


	it('should create an ico screener', async function () {
		await svandisDataFactory.newIcoScreener(
			svandisDataFactory.address,
			name,
			ticker,
			website,
			dataLoad,
			tokenGenerationEventTimestamp,
			{from: owner}).should.be.fulfilled;
	});
});