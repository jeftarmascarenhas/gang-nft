const GangNFT = artifacts.require("GangNFT");

module.exports = function (deployer) {
  const BASE_URI = "ipfs://QmTD5WoGncyMk5Hi1GyPEW6v51ajoftfN99xEKk4WYcGAy/";
  deployer.deploy(GangNFT, BASE_URI);
};
