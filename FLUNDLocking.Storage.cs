using System.Numerics;
using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;

namespace FLUNDLocking
{
    partial class FLUNDLocking
    {

        // The contract storage for hash of transaction
        public static class EnteredStorage
        {   
            public static readonly string mapName = "entered";

            public static void Set(UInt256 txid) => new StorageMap(Storage.CurrentContext, mapName).Put(txid, 1);

            public static bool IsSet(UInt256 txid)
            {
                var value = new StorageMap(Storage.CurrentContext, mapName).Get(txid);
                return value is not null;
            }

            public static void Delete(UInt256 txid)
            {
                var map = new StorageMap(Storage.CurrentContext, mapName);
                map.Delete(txid);
            }
        }

        // The contract storage for data of first user - User Wallet Address, FLUND/FUSDT amount, Locking Perid
        public static class FirstUserLockingStorage
        {
            private static readonly byte[] FirstLockingPrefix = new byte[] { 0xa0,0x01};    
            internal static void Put(UInt160 fromAddress, BigInteger FLMAmount, BigInteger FUSDTAmount, BigInteger lockTermLength)
            {
                byte[] key = (byte[])fromAddress;
                StorageMap map = new(Storage.CurrentContext, FirstLockingPrefix);
                FirstUserRecord record = new FirstUserRecord
                {
                    fromAddress = fromAddress,
                    FLMAmount = FLMAmount,
                    FUSDTAmount = FUSDTAmount,
                    lockTermLength = lockTermLength,
                };
                map.Put(key, StdLib.Serialize(record));
            }

            internal static FirstUserRecord Get(UInt160 fromAddress)
            {
                byte[] key = (byte[])fromAddress;
                StorageMap map = new(Storage.CurrentReadOnlyContext, FirstLockingPrefix);
                var r = map.Get(key);
                if(r is null)
                {
                    return new FirstUserRecord
                    {
                        fromAddress = UInt160.Zero,
                        FLMAmount = 0,
                        FUSDTAmount = 0,
                        lockTermLength = 0
                    };
                }
                return (FirstUserRecord)StdLib.Deserialize(r);
            }

            internal static void Delete(UInt160 fromAddress)
            {
                byte[] key = (byte[])fromAddress;
                StorageMap map = new(Storage.CurrentContext, FirstLockingPrefix);
                map.Delete(key);
            }
        }


        // The contract storage for data of second user - Second User Wallet Address, LockingTimeStamp
        public static class SecondUserLockingStorage
        {
            private static readonly byte[] SecondLockingPrefix = new byte[] { 0x03,0x01};    
            internal static void Put(UInt160 fromAddress, UInt160 secondAddress, BigInteger lockTimeStamp)
            {
                byte[] key = (byte[])fromAddress;
                StorageMap map = new(Storage.CurrentContext, SecondLockingPrefix);
                SecondUserRecord record = new SecondUserRecord
                {
                    fromAddress = fromAddress,
                    secondAddress = secondAddress,
                    lockTimeStamp = lockTimeStamp
                };
                map.Put(key, StdLib.Serialize(record));
            }

            internal static SecondUserRecord Get(UInt160 fromAddress)
            {
                byte[] key = (byte[])fromAddress;
                StorageMap map = new(Storage.CurrentReadOnlyContext, SecondLockingPrefix);
                var r = map.Get(key);
                if(r is null)
                {
                    return new SecondUserRecord
                    {
                        fromAddress = UInt160.Zero,
                        secondAddress = UInt160.Zero,
                        lockTimeStamp = 0
                    };
                }
                return (SecondUserRecord)StdLib.Deserialize(r);
            }

            internal static void Delete(UInt160 fromAddress)
            {
                byte[] key = (byte[])fromAddress;
                StorageMap map = new(Storage.CurrentContext, SecondLockingPrefix);
                map.Delete(key);
            }
        }

        // // The contract storage for data of FLM Amount
        // public static class FLMAmountStorage
        // {
        //     private static readonly byte[] FLMAmountStoragePrefix = new byte[] { 0xb0,0x01};    
        //     internal static void Put(BigInteger fromAddress, BigInteger previousFLMAmount, BigInteger profitFLMAmount)
        //     {
        //         byte[] key = (byte[])fromAddress;
        //         StorageMap map = new(Storage.CurrentContext, FLMAmountStoragePrefix);
        //     }
        // }

        public static class HistoryStackProfitSumStorage
        {
            private static readonly byte[] HistoryUintStackProfitSumPrefix = new byte[] { 0x02, 0x01 };

            internal static void Put(UInt160 asset, BigInteger timestamp, BigInteger amount)
            {
                StorageMap map = new(Storage.CurrentContext, HistoryUintStackProfitSumPrefix);
                byte[] key = ((byte[])asset).Concat(timestamp.ToByteArray());
                map.Put(key, amount);
            }

            internal static BigInteger Get(UInt160 asset, BigInteger timestamp)
            {
                StorageMap map = new(Storage.CurrentReadOnlyContext, HistoryUintStackProfitSumPrefix);
                byte[] key = ((byte[])asset).Concat(timestamp.ToByteArray());
                return (BigInteger)map.Get(key);
            }
        }

    }
}