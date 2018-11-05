'use strict'

const SvandisDataFactory = artifacts.require('./SvandisDataFactory.sol');


const BigNumber = web3.BigNumber;

const should = require('chai')
	.use(require('chai-as-promised'))
	.use(require('chai-bignumber')(BigNumber))
	.should();

contract('SvandisDataFactory', function ([owner, unknown]) {

	let svandisDataFactory;
	let name, ticker, website, dataLoad, tokenGenerationEventTimestamp;

	before(async function () {

		name = "Svandis";
		ticker = 'SVN';
		website= "https://svandis.io";
		dataLoad = 0x76;
		tokenGenerationEventTimestamp = 1546300800;
	});


	it('should allow for setup of the factory', async function () {
		svandisDataFactory = await SvandisDataFactory.new().should.be.fulfilled;
	});

	it('should create a token screener', async function () {
		await svandisDataFactory.createTokenScreener(
			svandisDataFactory.address,
			name,
			ticker,
			website,
			dataLoad,
			{from: owner}).should.be.fulfilled;
	});


	it('should create an ico screener', async function () {
		await svandisDataFactory.createIcoScreener(
			svandisDataFactory.address,
			name,
			ticker,
			website,
			dataLoad,
			tokenGenerationEventTimestamp,
			{from: owner}).should.be.fulfilled;
	});
});