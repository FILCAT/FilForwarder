require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("./tasks")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000000,
            }
        }
    },
    defaultNetwork: "hyperspace",
    networks: {
        hyperspace: {
            chainId: 3141,
            url: "https://api.hyperspace.node.glif.io/rpc/v1",
            accounts: [PRIVATE_KEY],
        },
        calibration: {
            chainId: 314159,
            url: 'https://api.calibration.node.glif.io/rpc/v1',
            accounts: [PRIVATE_KEY],
        }
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
}
