using System;
using System.Numerics;
using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Services;

namespace FLUNDLocking
{
    struct FirstUserRecord // The info of first user
    {
        public UInt160 fromAddress;
        public BigInteger FLMAmount;
        public BigInteger FUSDTAmount;
        public BigInteger lockTermLength;
    }
    struct SecondUserRecord // The info of second user
    {
        public UInt160 fromAddress;
        public UInt160 secondAddress;
        public BigInteger FLUNDAmount;
        public BigInteger lockTimeStamp;
    }

    [ManifestExtra("Author", "")]
    [ManifestExtra("Email", "")]
    [ManifestExtra("Description", "")]
    [ContractPermission("*", "*")]
    public partial class FLUNDLocking : SmartContract
    {

        // FLM Hash
        [InitialValue("0x5b53998b399d10cd25727269e865acc785ef5c1a", Neo.SmartContract.ContractParameterType.Hash160)]
        private static readonly UInt160 FLMHash = "default";
        
        //[InitialValue("0x06f12a6aa2b5689ce97f16979b179fb3e31d63d7", Neo.SmartContract.ContractParameterType.Hash160)]
        //static readonly UInt160 WhiteListContract = default;

        // FLUND Hash
        [InitialValue("0xa9603a59e21d29e37ac39cf1b5f5abf5006b22a3", Neo.SmartContract.ContractParameterType.Hash160)]
        private static readonly UInt160 FLUNDHash = default;

        // FUSDT Hash
        [InitialValue("0xcd48b160c1bbc9d74997b803b9a7ad50a4bef020", Neo.SmartContract.ContractParameterType.Hash160)]
        private static readonly UInt160 FUSDTHash = default;

        // FlamingoSwapPair FLM-FUSDT Hash
        // [InitialValue("0x59aa80468a120fe79aa5601de07746275c9ed76a", Neo.SmartContract.ContractParameterType.Hash160)]
        // private static readonly UInt160 FlamingoSwapPair = default;

        // FTokenVault Hash - To get on-chain FLUND price
        // [InitialValue("0x799bbfcbc97b5a425e14089aeb06753cb3190560", Neo.SmartContract.ContractParameterType.Hash160)]
        // private static readonly UInt160 FTokenVault = default;
        /*
            You will buy let's say 1 FLUND for 1.69 FLM and will sell later for 1.75 for example
            But because of exit fees It's like you need to wait a least 20 days (didn't make the computation) before It's profitable to withdraw
            Don't know if It's clear I'm Bad at English
            Can you share what you want to do? I'm not sure It's a good plan to automate stuff for FLUND except if you are careful about timing and exit fees
            Going in/out of FLUND can be from 0.3 to 1.5 GAS
            You often need to someone pay those fees for you if you want to optimize
            Feel free to ask question I already made a contract for interacting with FLUND but didn't deploy It ahah
        */
        /*
            Hey! What are you trying to do? 
            Better/safest way to do It should be to check your contract FLM balance before and after calling FLUND withdraw
        */
        // private static readonly uint startLockingTimeStamp = 1601114400;
        //User1 Deposit FLM and Sets Locking Period and FUSDT token to receive from User2
        public static void OnNep17Payment(UInt160 fromAddress, BigInteger FLMAmount, BigInteger FUSDTAmount, BigInteger lockTermLength)
        {
            ExecutionEngine.Assert(CheckAddrValid(true, fromAddress), "OnNep17Payment: invald params");
            ExecutionEngine.Assert((FLMAmount > 0 && FUSDTAmount > 0 && lockTermLength > 0), "OnNep17Payment: invald params");
            FirstUserRecord record = FirstUserLockingStorage.Get(fromAddress);
            SecondUserRecord lockingRecord = SecondUserLockingStorage.Get(fromAddress);
            ExecutionEngine.Assert(record.fromAddress == UInt160.Zero, "OnNep17Payment: Deposit already finished");
            ExecutionEngine.Assert(lockingRecord.fromAddress == UInt160.Zero, "OnNep17Payment: Locking started already");
            FirstUserLockingStorage.Put(fromAddress, FLMAmount, FUSDTAmount, lockTermLength);            
            TotalFLMSupplyStorage.Increase(FLMAmount);
        }
               
        // If no user deposit FUSDT to locking pool, then refund the FLM of locking pool to owner
        public static bool RefundUser(UInt160 fromAddress)
        {
            Transaction tran = (Transaction)Runtime.ScriptContainer;
            //检查是否存在reentered的情况
            ExecutionEngine.Assert(!EnteredStorage.IsSet(tran.Hash), "Re-entered");
            EnteredStorage.Set(tran.Hash);
            if (!Runtime.CheckWitness(fromAddress))
            {
                EnteredStorage.Delete(tran.Hash);
                return false;
            }
            FirstUserRecord record = FirstUserLockingStorage.Get(fromAddress);
            //Refund deposited amount of FLM to first user
            TransferAsset(Runtime.ExecutingScriptHash, fromAddress, record.FLMAmount, FLMHash);
            FirstUserLockingStorage.Delete(fromAddress);
            EnteredStorage.Delete(tran.Hash);
            return result;            

        }
        // When Second User deposits specified amount of FUSDT, convert FLM to FLUND,  contract locking started. 
        public static bool Locking(UInt160 fromAddress, UInt160 secondAddress)
        {
            Transaction tran = (Transaction)Runtime.ScriptContainer;
            //检查是否存在reentered的情况
            ExecutionEngine.Assert(!EnteredStorage.IsSet(tran.Hash), "Re-entered");
            EnteredStorage.Set(tran.Hash);
            if (!Runtime.CheckWitness(fromAddress))
            {
                EnteredStorage.Delete(tran.Hash);
                return false;
            }
            ExecutionEngine.Assert(CheckAddrValid(true, fromAddress, secondAddress), "Locking: invald params");
            FirstUserRecord record = FirstUserLockingStorage.Get(fromAddress);
            SecondUserRecord lockingRecord = SecondUserLockingStorage.Get(fromAddress);
            // ExecutionEngine.Assert(lockingRecord.fromAddress == UInt160.Zero, "OnNep17Payment: Locking started already");     
            // ExecutionEngine.Assert(record.FUSDTAmount >= FUSDTAmount, "OnNep17Payment: Deposit amount is less than required amount");  
            
            
            //Transfer the FUSDT that second user deposit to first user.
            TransferAsset(Runtime.ExecutingScriptHash, fromAddress, record.FUSDTAmount, FUSDTHash);

            BigInteger beforeLockingFLUNDBalance = GetCurrentTotalSupply(FLUNDHash);
            //Converting FLM to FLUND
            TransferAsset(Runtime.ExecutingScriptHash, FLUNDHash, record.FLMAmount, FLMHash);

            BigInteger afterLockingFLUNDBalance = GetCurrentTotalSupply(FLUNDHash);
            BigInteger lockingFLUNDAmount = afterLockingFLUNDBalance - beforeLockingFLUNDBalance;
            BigInteger currentTimestamp = GetCurrentTimeStamp();
            TotalFLMSupplyStorage.Reduce(record.FLMAmount);
            SecondUserLockingStorage.Put(fromAddress, secondAddress, lockingFLUNDAmount, currentTimestamp);            
            return true;
        }

        /*
            Mr.Google — Today at 6:28 AM
            Yes, to get the FLM + yield back you then withdraw the same amount of FLUND tokens
            FLUND tokens do not "grow", but the underlying FLM value of them does


            Zatouroff | 🦩 — Today at 6:37 AM
            (mind the %2 fee while selling the FLUND you've got for FLM proits) 🙂  Flamingo Finance website FLUND Sell UI includes the exit fee at bottom when you enter FLUND amount to top box. So if you've bought flund 2 days ago, you'll see that you are getting less FLM than before. It breaks even in around 20-22 days with current state.
            But as previously stated, you are already minding that %2 fee while invoking the contract by yourself. You can use the website to check those numbers with yours. You don't need to own a balance to write numbers to SELL box to see how much FLM you are going to get.
        */

        // After locking is expired, refund the locking token - FLM to first user, profit FLM of locking to second user
        // To calculate the increased amount of FLM, we should know the total amount before converting FLUND to FLM.

        // I am going to invoke the transfer method of FLM contract for buying FLUND tokens.
        // After a while, to receive FLM, I should keep the amount of FLUND I bought?
        // Why I am asking is that there is amount parameter in withdraw method of FLUND contract.
        public static bool Refund(UInt160 fromAddress)
        {
            Transaction tran = (Transaction)Runtime.ScriptContainer;
            ExecutionEngine.Assert(!EnteredStorage.IsSet(tran.Hash), "Re-entered");
            EnteredStorage.Set(tran.Hash);

            BigInteger currentTimestamp = GetCurrentTimestamp();
            // BigInteger FLUNDPrice = GetCurrentFLUNDPrice();
            FirstUserRecord record = FirstUserLockingStorage.Get(fromAddress);
            SecondUserRecord lockingRecord = SecondUserLockingStorage.Get(fromAddress);

            if ((currentTimestamp > lockingRecord.lockTimeStamp + record.lockTermLength) || !(lockingRecord.fromAddress.Equals(fromAddress)))
            {
                // EnteredStorage.Delete(tran.Hash);
                return false;
            }

            // Before invoking withdraw of FLUND, keep the FLM balance of this contract
            BigInteger beforeWithdrowFLMBalance = GetCurrentTotalSupply(FLMHash);

            // Convert FLUND to FLM again.
            object[] @paramsForFLMToFlund = new object[]
            {
                lockingRecord.FLUNDAmount,
                Runtime.ExecutingScriptHash
            };

            try
            {
                var result = (bool)Contract.Call(FLUNDHash, "withdraw", CallFlags.All, @params);
                ExecutionEngine.Assert(result, "Refund: Converting FLUND to FLM failed, ".ToByteArray().ToByteString());
            }

            catch (Exception)
            {
                ExecutionEngine.Assert(false, "Refund: Converting FLUND to FLM failed, ".ToByteArray().ToByteString());
            }

            // Calculate the profit amount of FLM after converting FLUND to FLM.
            BigInteger afterWithdrawFLMBalance = GetCurrentTotalSupply(FLMHash);
            BigInteger FLMWithdrawAmount = afterWithdrawFLMBalance - beforeWithdrowFLMBalance;
            BigInteger FLMLockingProfit = FLMWithdrawAmount - record.FLMAmount;

            //Refund Profit FLM Amount to second user
            if(FLMLockingProfit > 0) 
            {
                object[] @paramsForSecondUser = new object[]
                {
                    Runtime.ExecutingScriptHash,
                    lockingRecord.secondAddress,
                    FLMLockingProfit,
                    new byte[0]
                };

                try
                {
                    var result = (bool)Contract.Call(FLMHash, "transfer", CallFlags.All, @params);
                    ExecutionEngine.Assert(result, "Refund: Transferring profit FLM to second user failed, ".ToByteArray().ToByteString());
                }
                catch (Exception)
                {
                    ExecutionEngine.Assert(false, "Refund: Transferring profit FLM to second user failed, ".ToByteArray().ToByteString());
                }
            }

            //Refund deposited amount of FLM to first user

            object[] @params = new object[]
            {
                Runtime.ExecutingScriptHash,
                fromAddress,
                record.FLMAmount,
                new byte[0]
            };

            try
            {
                var result = (bool)Contract.Call(FLMHash, "transfer", CallFlags.All, @params);
                ExecutionEngine.Assert(result, "Refund: FLM refund to first user failed, ".ToByteArray().ToByteString());
            }
            catch (Exception)
            {
                ExecutionEngine.Assert(false, "Refund: FLM refund to first user failed, ".ToByteArray().ToByteString());
            }

            TotalFLMSupplyStorage.Reduce(FLMWithdrawAmount);
            FirstUserLockingStorage.Delete(fromAddress);
            SecondUserLockingStorage.Delete(fromAddress);
            EnteredStorage.Delete(tran.Hash);
            return true;
        }

        // Transfer method for specified asset
        public static void TransferAsset(UInt160 fromAddress, UInt160 toAddress, BigInteger amount, UInt160 asset)
        {
            object[] @params = new object[]
            {
                fromAddress,
                toAddress,
                amount,
                new byte[0]
            };

            try 
            {
                var result = (bool)Contract.Call(asset, "transfer", CallFlags.All, @params);
                ExecutionEngine.Assert(result, "Refund: transfer failed, ".ToByteArray().ToByteString());
            }

            catch (Exception)
            {
                ExecutionEngine.Assert(false, "Refund: transfer failed, ".ToByteArray().ToByteString());
            }
        }

        // Get the FLUND price
        public static BigInteger GetCurrentFLUNDPrice()
        {
            BigInteger FLUNDPrice;
            byte decimals = 8;
            object[] @params = new object[]
            {
                FLUNDHash,
                decimals
            };

            try
            {
                FLMPrice = (BigInteger)Contract.Call(FTokenVault, "getOnChainPrice", CallFlags.All, @params);
                ExecutionEngine.Assert(result, "Refund: FLUND withdraw failed, ".ToByteArray().ToByteString());
            }
            catch (Exception)
            {
                ExecutionEngine.Assert(false, "Refund: FLUND withdraw failed, ".ToByteArray().ToByteString());
            }
            // var @params = new object[] {};
            // FLMBalncePair = (ulong)Contract.Call(FlamingoSwapPair, "", CallFlags.ReadOnly, @params);
            reutnr FLUNDPrice;
        }

        // Get the total profit after locking
        public static BigInteger GetTotalProfit(BigInteger amount, BigInteger secondPrice, BigInteger firstPrice)
        {
            if(secondPrice <= firstPrice)
                return 0;
            BigInteger totalProfit = amount * (secondPrice - firstPrice);
            return totalProfit;
        }

        // public static BigInteger GetLockingAmount(UInt160 fromAddress)
        // {
        //     ExecutionEngine.Assert(CheckAddrValid(true, fromAddress), "GetLockingAmount: invald params");
        //     return FirstUserRecord.Get(fromAddress).FLMAmount;
        // }
    }
}

