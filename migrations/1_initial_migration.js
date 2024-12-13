const AccessControl = artifacts.require("AccessControl");
const LandRegistry = artifacts.require("LandRegistry");

module.exports = async function (deployer) {
  // Deploy AccessControl first
  await deployer.deploy(AccessControl);
  const accessControl = await AccessControl.deployed();

  // Deploy LandRegistry with AccessControl address
  await deployer.deploy(LandRegistry, accessControl.address);
  const landRegistry = await LandRegistry.deployed();

  // Set up initial roles
  const accounts = await web3.eth.getAccounts();
  await accessControl.addAdmin(accounts[0]);
  await accessControl.addInspector(accounts[1]);
  await accessControl.addVerifier(accounts[2]);
};
