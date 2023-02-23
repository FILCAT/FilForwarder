require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { networkConfig } = require("../helper-hardhat-config")


const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    console.log("Wallet Address:", wallet.address)

    const FilForwarder = await ethers.getContractFactory('FilForwarder', wallet);
    console.log('Deploying FilForwarder...');
    const forwarder = await FilForwarder.deploy();
    await forwarder.deployed()
    console.log('Forwarder deployed to:', forwarder.address);
}
