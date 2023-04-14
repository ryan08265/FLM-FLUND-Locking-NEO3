# Pre-requisities
1. .NET SDK 6.0 - https://dotnet.microsoft.com/en-us/download/dotnet/6.0
  We’ll write the smart contract code using the C# programming language. The .NET SDK is required to compile the C# code.
2. Visual Studio Code — https://code.visualstudio.com/download
  This is a very popular code editor; the Neo Blockchain Toolkit builds on top of VS Code.
3. Neo Blockchain Toolkit Visual Studio Code extension — https://marketplace.visualstudio.com/items?itemName=ngd-seattle.neo-blockchain-toolkit
  This will add support to VS Code for visualizing Neo blockchains, running private blockchain instances and debugging Neo smart contracts.
4. C# Visual Studio Code extension — https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp
  This will add support to VS Code for editing and building C# source code.
  
# Create a private blockchain
The first thing we will do is use Neo Express to create a private blockchain. This will allow us to deploy and invoke our contract while we are developing it without spending any real GAS.
Click the N3 icon in the tool bar to open the N3 Visual DevTracker.
Next, use the button in the Quick Start panel to create a new Neo Express Instance.
(Alternatively, you could select the “Create private blockchain” menu option from the context menu in the Blockchains panel.)
You’ll be asked how many consensus nodes that you want your private blockchain to have. For this example, one node is sufficient and will enable us to get the most out of Neo Express (some functionality—such as creating checkpoints—is disabled for multi-node blockchains).
When asked for a filename for the Neo Express configuration, we’ll use the name registrar.neo-express and save the file in the empty registrar folder.
Your screen should now look like this.
You can dismiss the message about the node being created (take note of the security warning, your registrar.neo-express file will contain private keys, but those keys should only be used for local testing as they are not securely stored). You can also close the Terminal panel showing Neo Express output if you wish—your blockchain will continue to run in the background and you’ll see new blocks appear in the Block Explorer panel about once every 15 seconds.
You can also check the “Hide empty blocks” checkbox so that only blocks containing transactions are shown. Initially you’ll only see the very first block but this will make it easier to identify our transactions later.

# Contract deployment
Right click on registrar.neo-express in the Blockchains panel and click on the “Deploy contract” menu option. When asked which account to use, select the “owner” wallet that you created earlier. When asked which contract to deploy, select RegistrationContract.nef (this file contains the Neo Virtual Machine bytecode for your contract). You’ll see a message confirming that the deployment transaction was submitted:

Deployment success message
Shortly after you’ll see a new non-empty block appear in your Block Explorer panel. You can click on that block to see a list of transactions in the block (there will only be one). You can click on the transaction to see the details.
You’ll notice that this transaction is somewhat larger than the transactions that we created earlier (when transferring GAS between accounts), that’s because this transaction contains the entire bytecode for your contract and all of its associated metadata! You can actually see the metadata in text format within the Block Explorer panel.

Your contract has now been deployed to your own private Neo blockchain.
# FLM-FLUND-Locking-NEO3
This is the NEO3 smart contract for locking FLUND tokens.
The Flamingo Flund is a DEX-Traded Fund (DTF), similar to an Exchange-Traded Fund (ETF). Investors can invest FLM into the Flund to earn FLM yield.

What we would like to do in this contract is take the variable returns and make them into a steady fixed return in a Flamingo token - FLM(native token of Flamingo Finance).

The flow is here:
There are several locking pools. And each pool has 2 users.

Step1:
User1 deposits some FLM to the contract.
And user1 sets FUSDT amount and locking time period.

Step2:
User2 deposits FUSDT that amount is specified in step1.
In the same transaction,
- Transfer FUSDT to first user.
- Convert deposited FLM to FLUND.
- Locking FLUND started.

Step3:
During the locking time, FLUND gains value over time.

Step4:
Lock time ends.
Convert FLUND to FLM again. At this time, FLM amount increases.

Step5:
Refund the increased FLM amount to user2, original FLM amount to user1.


