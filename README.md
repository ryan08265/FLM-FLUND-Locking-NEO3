# Pre-requisities
1. .NET SDK 6.0 - https://dotnet.microsoft.com/en-us/download/dotnet/6.0
  We’ll write the smart contract code using the C# programming language. The .NET SDK is required to compile the C# code.
2. Visual Studio Code — https://code.visualstudio.com/download
  This is a very popular code editor; the Neo Blockchain Toolkit builds on top of VS Code.
3. Neo Blockchain Toolkit Visual Studio Code extension — https://marketplace.visualstudio.com/items?itemName=ngd-seattle.neo-blockchain-toolkit
  This will add support to VS Code for visualizing Neo blockchains, running private blockchain instances and debugging Neo smart contracts.
4. C# Visual Studio Code extension — https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp
  This will add support to VS Code for editing and building C# source code.
5. Neo C# smart contract compiler — https://github.com/neo-project/neo-devpack-dotnet
  This tool allows you to convert compiled C# code into bytecode suitable for execution by the Neo virtual machine.
  
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


