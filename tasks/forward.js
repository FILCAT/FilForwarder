const { Address } = require('@zondax/izari-tools');

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
  .addParam('forwarder', 'The deployed contract address of the FilForwarder')
  .addParam('destination', 'The filecoin address you want to send FIL')
  .addParam('amount', 'The amount of FIL to send, in FIL units.')
  .setAction(async (taskArgs) => {

  //create new Wallet object from private key
  const deployer = new ethers.Wallet(network.config.accounts[0], ethers.provider);
  
  // create an izari address from the input. If its and invalid
  // address, it will crash here.
  const destination = Address.fromString(taskArgs.destination);
  const wei = ethers.utils.parseEther(taskArgs.amount);

  // generate the contract from the ABI so we can call it
  var filForwarder = (await ethers.getContractFactory('FilForwarder'))
    .attach(taskArgs.forwarder);
  
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
