var Migrations = artifacts.require("./Migrations.sol");
const TokenScreenerFactory = artifacts.require('./svandisdata/factory/TokenScreenerFactory.sol');
const IcoScreenerFactory = artifacts.require('./svandisdata/factory/IcoScreenerFactory.sol');
const SvandisDataFactory = artifacts.require('./svandisdata/factory/SvandisDataFactory.sol');
const SvandisDataRegistry = artifacts.require('./svandisdata/SvandisDataRegistry.sol');
const SvandisToken = artifacts.require('./token/SvandisToken.sol');
const KeyHolderLibrary = artifacts.require('./identity/KeyHolderLibrary.sol');
const ClaimHolderLibrary = artifacts.require('./identity/ClaimHolderLibrary.sol');
const ClaimHolderPresigned = artifacts.require('./identity/ClaimHolderPresigned.sol');
const UserRegistry = artifacts.require('./identity/UserRegistry.sol');
const SvandisEcosystem = artifacts.require('./SvandisEcosystem.sol');

module.exports = function(deployer) {
	// Create Token Screener Factory
	deployer.deploy(TokenScreenerFactory).then(function(){
		// Create Ico Screener Factory
		deployer.deploy(IcoScreenerFactory).then(function(){
			//Create Svandis Data Factory
			deployer.deploy(SvandisDataFactory, TokenScreenerFactory.address, IcoScreenerFactory.address).then(function(instance){

				// Transfer Ownership of Screener factories to Svandis Data Factory
				TokenScreenerFactory.at(TokenScreenerFactory.address).transferOwnership(instance.address);
				IcoScreenerFactory.at(IcoScreenerFactory.address).transferOwnership(instance.address);

				// Create a new Svandis Data Registry
				deployer.deploy(SvandisDataRegistry, instance.address).then(function(instance){
					// Transfer Ownership the Svandis Data Registry to the Svandis Data Factory
					instance.transferOwnership(SvandisDataFactory.address);

					//Create the Svandis Token
					deployer.deploy(SvandisToken);

					// Create the KeyHolderLibrary Contract
					deployer.deploy(KeyHolderLibrary).then(function(){
						// Link the KeyHolder Library Contract to the ClaimHolder Library ABI's
						deployer.link(KeyHolderLibrary, ClaimHolderLibrary);

						// Create the the Claim Holder Library
						deployer.deploy(ClaimHolderLibrary).then(function(){
							// Link the Ecosystem ABI to the KeyHolder Library and Claim Holder Library ABI's
							deployer.link(ClaimHolderLibrary, SvandisEcosystem);
							deployer.link(KeyHolderLibrary, SvandisEcosystem);

							// Link the ClaimHolderPresigned ABI to the KeyHolder Library and Claim Holder Library ABI's
							deployer.link(ClaimHolderLibrary, ClaimHolderPresigned);
							deployer.link(KeyHolderLibrary, ClaimHolderPresigned);

							// Create the User Registry
							deployer.deploy(UserRegistry).then(function(){

								// Create the Ecosystem
								deployer.deploy(SvandisEcosystem, SvandisToken.address, SvandisDataRegistry.address, UserRegistry.address).then(function(instance){

									// Transfer Ownership for the User Registry to the Ecosystem
									UserRegistry.at(UserRegistry.address).transferOwnership(instance.address);
								});
							});
						});
					});
				});
			});
		});
	});
};
