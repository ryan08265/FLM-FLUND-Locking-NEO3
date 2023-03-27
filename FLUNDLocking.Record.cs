using System;
using System.Numerics;
using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Services;

name FLUNDLocking
{
    public partial class FLUNDLocking : SmartContract
    {
        private static BigInteger GetCurrentTimeStamp() 
        {
            return Runtime.Time / 1000;
        }

        // Get the total asset balance of the contract
        public static BigInteger GetCurrentTotalSupply(UInt160 asset)
        {
            UInt160 selfAddress = Runtime.ExecutingScriptHash;
            var @params = new object[] { selfAddress };
            BigInteger totalAmount = (BigInteger)Contract.Call(asset, "balanceOf", CallFlags.ReadOnly, @params);
            return totalAmount;
        }

    }
}