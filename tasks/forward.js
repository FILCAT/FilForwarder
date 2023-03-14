const { Address } = require('@zondax/izari-tools');
const fs = require('fs');

const greenText  = '\x1b[32m%s\x1b[0m';
task("show", "Show the state of the current genie deployment")
  .setAction(async (taskArgs) => {
    //create new Wallet object from private key
    const owner = new ethers.Wallet(network.config.accounts[0], ethers.provider);
    
    const chainId = await owner.getChainId();
    const balance = await owner.provider.getBalance(owner.address);
    const gasPrice = await owner.provider.getGasPrice();

    console.log(greenText, "\n=== SIGNER INFO ===\n");
    console.log(" Signer Network Chain ID: " + chainId);
    console.log(" Signer Wallet Address: " + owner.address);
    console.log(" Signer Balance: " + ethers.utils.formatEther(balance));
    console.log(greenText, "\n=== NETWORK CONDITIONS ===\n");
    console.log( " Gas Price: " + ethers.utils.formatUnits(gasPrice, "gwei"));
  });

/**
 * forward
 * 
 * This task will use the compiled ABI and call the contracts with the parameters as documented below.
 *
 * The forwarder contract address should be an ethereum contract adddress, starting in 0x.
 *
 * The destination address can be in any address format as a string., for instance:
 *  "t3tejq3lb3szsq7spvttqohsfpsju2jof2dbive2qujgz2idqaj2etuolzgbmro3owsmpuebmoghwxgt6ricvq"
 *  "t01011"
 *
 * The amount should be in FIL units, so "1.0" would be one Filecoin..
 */
task("forward", "Use the default wallet to forward to a given address.")
  .addParam('destination', 'The filecoin address you want to send FIL')
  .addParam('amount', 'The amount of FIL to send, in FIL units.')
  .setAction(async (taskArgs) => {

  //create new Wallet object from private key
  const deployer = new ethers.Wallet(network.config.accounts[0], ethers.provider);
  
  // create an izari address from the input. If its and invalid
  // address, it will crash here.
  const destination = Address.fromString(taskArgs.destination);
  const wei = ethers.utils.parseEther(taskArgs.amount);

  // read the forwarder address from the json, although they should
  // all be the same (if deployed correctly)
  var forwarderAddress = JSON.parse(
    fs.readFileSync('fil-forwarder-' + network.config.chainId + '.json')
  ).filForwarder;

  // generate the contract from the ABI so we can call it
  var filForwarder = (await ethers.getContractFactory('FilForwarder'))
    .attach(forwarderAddress);
  
  // visibility is good
  console.log("Network Chain ID: " + network.config.chainId);
  console.log("FilForwarder contract address: " + filForwarder.address); 
  console.log("Provided source address: " + deployer.address);
  console.log("Provided destination address: " + destination);
  console.log("Message Value: " + wei);
  console.log("\nCalling now....");

  // go ahead and call the contract.
  var response = await filForwarder.connect(deployer)
    .forward(destination.toBytes(), {value: wei});

  // show the transaction hash so folks can check it out themselves.
  console.log("Looks like it succeeded!");
  console.log("Here is the transaction hash: " + response.hash);
})
