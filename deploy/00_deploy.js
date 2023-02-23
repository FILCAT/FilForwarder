require("hardhat-deploy")
require("hardhat-deploy-ethers")
const fs = require('fs');

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    console.log("Wallet Address:", wallet.address)
    console.log("Chain ID: ", network.config.chainId);

    // create the filename we will store the fil forwarder address in
    const filename = "fil-forwarder-" + network.config.chainId + ".json";

    // Deploy the Forwarder
    const FilForwarder = await ethers.getContractFactory('FilForwarder', wallet);
    console.log('Deploying FilForwarder...');
    const forwarder = await FilForwarder.deploy();
    await forwarder.deployed()
    console.log('Forwarder deployed to:', forwarder.address);

    // Write it to Disk
    console.log("We are also going to write this to the file: " + filename);
    fs.writeFileSync(filename, JSON.stringify({filForwarder: forwarder.address}));
    console.log("Done!");
}
