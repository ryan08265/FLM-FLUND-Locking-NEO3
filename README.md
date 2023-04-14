# Pre-requisities
1. .NET SDK 6.0 - https://dotnet.microsoft.com/en-us/download/dotnet/6.0
  We’ll write the smart contract code using the C# programming language. The .NET SDK is required to compile the C# code.
2. Visual Studio Code — https://code.visualstudio.com/download
  This is a very popular code editor; the Neo Blockchain Toolkit builds on top of VS Code.
3. Neo Blockchain Toolkit Visual Studio Code extension — https://marketplace.visualstudio.com/items?itemName=ngd-seattle.neo-blockchain-toolkit
  This will add support to VS Code for visualizing Neo blockchains, running private blockchain instances and debugging Neo smart contracts.
4. C# Visual Studio Code extension — https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp
  This will add support to VS Code for editing and building C# source code.

After all installation, you can build this smart contract by using command-"dotnet build" on visual studio code.
If the bulid succeed, it produces FLUNDLocking.manifest.json file and FLUNDLocking.nef file on bin/sc folder.
You need to keep those 2 files and move to Neo-cli folder. You can check what Neo-CLI is on next content.

# Contract deployment to private net (Don't use if you are not developer)

Right click on registrar.neo-express in the Blockchains panel and click on the “Deploy contract” menu option. When asked which account to use, select the “owner” wallet that you created earlier. When asked which contract to deploy, select RegistrationContract.nef (this file contains the Neo Virtual Machine bytecode for your contract). You’ll see a message confirming that the deployment transaction was submitted:

Deployment success message
Shortly after you’ll see a new non-empty block appear in your Block Explorer panel. You can click on that block to see a list of transactions in the block (there will only be one). You can click on the transaction to see the details.
You’ll notice that this transaction is somewhat larger than the transactions that we created earlier (when transferring GAS between accounts), that’s because this transaction contains the entire bytecode for your contract and all of its associated metadata! You can actually see the metadata in text format within the Block Explorer panel.

Your contract has now been deployed to your own private Neo blockchain.

# Contract deployment to NEO3 test net by using NEO-CLI
After build 

- Installing Neo-CLI
You need to install Neo-CLI, which provides a command-line interface and a set of RPC API for developers. It also helps other nodes achieve consensus with the network and is involved in generating new blocks.
You can download Neo-CLI on https://github.com/neo-project/neo-cli/releases
Please refer this: https://docs.neo.org/docs/en-us/node/cli/setup.html
After download, staring the neo-cli.exe in neo-cli folder.

In Neo-CLI, input the deploy command deploy <nefFilePath> [manifestFile] , (You need to move build nef and manifest file to this Neo-CLI directory)
for example: deploy NEP17.nef Or deploy NEP17.nef NEP17.manifest.json

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


