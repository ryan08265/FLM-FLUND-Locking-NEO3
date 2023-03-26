using System;
using System.Numerics;
using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Services;

namespace Locking_Token_Neo
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
        public BigInteger lockTimeStamp;
    }
    [ManifestExtra("Author", "")]
    [ManifestExtra("Email", "")]
    [ManifestExtra("Description", "")]
    [ContractPermission("*", "*")]
    public partial class Locking_Token_Neo : SmartContract
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
        [InitialValue("0x799bbfcbc97b5a425e14089aeb06753cb3190560", Neo.SmartContract.ContractParameterType.Hash160)]
        private static readonly UInt160 FTokenVault = default;

        // private static readonly uint startLockingTimeStamp = 1601114400;

        //First User Deposit FLUND and Sets Locking Period and FUSDT token to receive from User2
        public static void OnNep17Payment(UInt160 fromAddress, BigInteger FLMAmount, BigInteger FUSDTAmount, BigInteger lockTermLength)
        {
            ExecutionEngine.Assert(CheckAddrValid(true, fromAddress), "OnNep17Payment: invald params");
            ExecutionEngine.Assert((FLMAmount > 0 && FUSDTAmount > 0 && lockTermLength > 0), "OnNep17Payment: invald params");
            FirstUserRecord record = FirstUserLockingStorage.Get(fromAddress);
            SecondUserRecord lockingRecord = SecondUserLockingStorage.Get(fromAddress);
            ExecutionEngine.Assert(record.fromAddress == UInt160.Zero, "OnNep17Payment: Deposit already finished");
            ExecutionEngine.Assert(lockingRecord.fromAddress == UInt160.Zero, "OnNep17Payment: Locking started already");
            FirstUserLockingStorage.Put(fromAddress, FLMAmount, FUSDTAmount, lockTermLength);            
        }
               
        // When Second User deposits specified amount of FUSDT, convert FLM to FLUND,  contract locking started. 
        public static bool Locking(UInt160 fromAddress, UInt160 secondAddress, BigInteger FUSDTAmount)
        {
            ExecutionEngine.Assert(CheckAddrValid(true, fromAddress, secondAddress), "Locking: invald params");
            FirstUserRecord record = FirstUserLockingStorage.Get(fromAddress);
            SecondUserRecord lockingRecord = SecondUserLockingStorage.Get(fromAddress);
            ExecutionEngine.Assert(record.fromAddress != UInt160.Zero, "OnNep17Payment: invailid params");
            ExecutionEngine.Assert(lockingRecord.fromAddress == UInt160.Zero, "OnNep17Payment: Locking started already");     
            ExecutionEngine.Assert(record.FUSDTAmount >= FUSDTAmount, "OnNep17Payment: Deposit amount is less than required amount");  
            
            //Transfer the FUSDT that second user deposit to first user.
            object[] @params = new object[]
            {
                Runtime.ExecutingScriptHash,
                fromAddress,
                record.FUSDTAmount,
                new byte[0]
            };

            try
            {
                var result = (bool)Contract.Call(FUSDTHash, "transfer", CallFlags.All, @params);
                ExecutionEngine.Assert(result, "Refund: FUSDT transfer failed, ".ToByteArray().ToByteString());
            }

            catch (Exception)
            {
                ExecutionEngine.Assert(false, "Refund: FUSDT transfer failed, ".ToByteArray().ToByteString());
            }

            //Converting FLM to FLUND
            
            object[] @params = new object[]
            {
                Runtime.ExecutingScriptHash,
                FLUNDHash,
                record.FLMAmount,
                new byte[0]
            };

            try
            {
                var result = (bool)Contract.Call(FLMHash, "transfer", CallFlags.All, @params);
                ExecutionEngine.Assert(result, "Refund: Converting FLM to FLUND failed, ".ToByteArray().ToByteString());
            }

            catch (Exception)
            {
                ExecutionEngine.Assert(false, "Refund: Converting FLM to FLUND failed, ".ToByteArray().ToByteString());
            }

            BigInteger currentTimestamp = GetCurrentTimeStamp();
            SecondUserLockingStorage.Put(fromAddress, secondAddress, currentTimestamp, FLUNDPrice);            

        }

        // After locking is expired, refund the locking token - FLM to first user, profit FLM of locking to second user
        public static bool Refund(UInt160 fromAddress)
        {
            Transaction tran = (Transaction)Runtime.ScriptContainer;
            ExecutionEngine.Assert(!EnteredStorage.IsSet(tran.Hash), "Re-entered");
            EnteredStorage.Set(tran.Hash);

            BigInteger currentTimestamp = GetCurrentTimestamp();
            BigInteger totalFLUNDAmount = GetCurrentTotalAmount();
            BigInteger FLUNDPrice = GetCurrentFLUNDPrice();
            FirstUserRecord record = FirstUserLockingStorage.Get(fromAddress);
            SecondUserRecord lockingRecord = SecondUserLockingStorage.Get(fromAddress);

            if ((currentTimestamp > lockingRecord.lockTimeStamp + record.lockTermLength) || totalFLUNDAmount < record.amount || !(lockingRecord.fromAddress.Equals(fromAddress)))
            {
                // EnteredStorage.Delete(tran.Hash);
                return false;
            }

            // Convert FLUND to FLM again.
            object[] @paramsForFLMToFlund = new object[]
            {
                record.FLMAmount,
                Runtime.ExecutingScriptHash
            }

            try
            {
                var result = (bool)Contract.Call(FLUNDHash, "withdraw", CallFlags.All, @params);
                ExecutionEngine.Assert(result, "Refund: Converting FLUND to FLM failed, ".ToByteArray().ToByteString());
            }

            catch (Exception)
            {
                ExecutionEngine.Assert(false, "Refund: Converting FLUND to FLM failed, ".ToByteArray().ToByteString());
            }

            //Refund Profit to second user
            BigInteger lockingProfitFLMAmount;
            if(lockingProfit != 0) 
            {
                object[] @paramsForSecondUser = new object[]
                {
                    Runtime.ExecutingScriptHash,
                    lockingRecord.secondAddress,
                    lockingProfit,
                    new byte[0]
                };

                try
                {
                    var result = (bool)Contract.Call(FUSDTHash, "transfer", CallFlags.All, @params);
                    ExecutionEngine.Assert(result, "Refund: FLUND withdraw failed, ".ToByteArray().ToByteString());
                }
                catch (Exception)
                {
                    ExecutionEngine.Assert(false, "Refund: FLUND withdraw failed, ".ToByteArray().ToByteString());
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

            FirstUserLockingStorage.Delete(fromAddress);
            SecondUserLockingStorage.Delete(fromAddress);
            EnteredStorage.Delete(tran.Hash);
            return true;
        }

        // Get the total FLM balance of this contract
        public static BigInteger GetFLMCurrentTotalAmount()
        {
            UInt160 selfAddress = Runtime.ExecutingScriptHash;
            var @params = new object[] { selfAddress };
            BigInteger totalAmount = (BigInteger)Contract.Call(FLMHash, "balanceOf", CallFlags.ReadOnly, @params);
            return totalAmount;
        }

        // Get the total FLUND balance of this contract 
        public static BigInteger GetFLUNDCurrentTotalAmount()
        {
            UInt160 selfAddress = Runtime.ExecutingScriptHash;
            var @params = new object[] { selfAddress };
            BigInteger totalAmount = (BigInteger)Contract.Call(FLUNDHash, "balanceOf", CallFlags.ReadOnly, @params);
            return totalAmount;
        }

        // Get the total FUSDT balance of this contract 
        public static BigInteger GetFUSDTCurrentTotalAmount()
        {
            UInt160 selfAddress = Runtime.ExecutingScriptHash;
            var @params = new object[] { selfAddress };
            BigInteger totalAmount = (BigInteger)Contract.Call(FUSDTHash, "balanceOf", CallFlags.ReadOnly, @params);
            return totalAmount;
        }   

        // // Get the FLUND price
        // public static BigInteger GetCurrentFLUNDPrice()
        // {
        //     BigInteger FLUNDPrice;
        //     byte decimals = 8;
        //     object[] @params = new object[]
        //     {
        //         FLUNDHash,
        //         decimals
        //     };

        //     try
        //     {
        //         FLMPrice = (BigInteger)Contract.Call(FTokenVault, "getOnChainPrice", CallFlags.All, @params);
        //         ExecutionEngine.Assert(result, "Refund: FLUND withdraw failed, ".ToByteArray().ToByteString());
        //     }
        //     catch (Exception)
        //     {
        //         ExecutionEngine.Assert(false, "Refund: FLUND withdraw failed, ".ToByteArray().ToByteString());
        //     }
        //     // var @params = new object[] {};
        //     // FLMBalncePair = (ulong)Contract.Call(FlamingoSwapPair, "", CallFlags.ReadOnly, @params);
        //     reutnr FLUNDPrice;
        // }

        // // Get the total profit after locking
        // public static BigInteger GetTotalProfit(BigInteger amount, BigInteger secondPrice, BigInteger firstPrice)
        // {
        //     if(secondPrice <= firstPrice)
        //         return 0;
        //     BigInteger totalProfit = amount * (secondPrice - firstPrice);
        //     return totalProfit;
        // }

        public static BigInteger GetLockingAmount(UInt160 fromAddress)
        {
            ExecutionEngine.Assert(CheckAddrValid(true, fromAddress), "GetLockingAmount: invald params");
            return FirstUserRecord.Get(fromAddress).FLUNDAmount;
        }

        private static BigInteger GetCurrentTimeStamp() 
        {
            return Runtime.Time / 1000;
        }

    }
}
