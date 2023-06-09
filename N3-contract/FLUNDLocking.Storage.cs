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

        // The storage for owner of contract 
        public static class OwnerStorage
        {
            private static readonly byte[] ownerPrefix = new byte[] { 0x04, 0x02 };

            internal static void Put(UInt160 usr)
            {
                StorageMap map = new(Storage.CurrentContext, ownerPrefix);
                map.Put("owner", usr);
            }

            internal static UInt160 Get()
            {
                StorageMap map = new(Storage.CurrentReadOnlyContext, ownerPrefix);
                byte[] v = (byte[])map.Get("owner");
                if(v is null)
                {
                    return InitialOwner;
                }
                else if (v.Length != 20)
                {
                    return InitialOwner;
                }
                else
                {
                    return (UInt160)v;
                }
            }

            internal static void Delete()
            {
                StorageMap map = new(Storage.CurrentContext, ownerPrefix);
                map.Delete("owner");
            }
        }

        // The storage for author of this contract
        public static class AuthorStorage
        {
            private static readonly byte[] AuthorPrefix = new byte[] { 0x04, 0x01 };

            internal static void Put(UInt160 usr)
            {
                StorageMap map = new(Storage.CurrentContext, AuthorPrefix);
                map.Put(usr, 1);
            }

            internal static void Delete(UInt160 usr)
            {
                StorageMap map = new(Storage.CurrentContext, AuthorPrefix);
                map.Delete(usr);
            }

            internal static bool Get(UInt160 usr)
            {
                StorageMap map = new(Storage.CurrentReadOnlyContext, AuthorPrefix);
                return (BigInteger)map.Get(usr) == 1;
            }

            internal static BigInteger Count()
            {
                StorageMap authorMap = new(Storage.CurrentReadOnlyContext, AuthorPrefix);
                var iterator = authorMap.Find();
                BigInteger count = 0;
                while (iterator.Next())
                {
                    count++;
                }
                return count;
            }

            internal static UInt160[] Find(BigInteger count)
            {
                StorageMap authorMap = new(Storage.CurrentReadOnlyContext, AuthorPrefix);
                var iterator = authorMap.Find(FindOptions.RemovePrefix | FindOptions.KeysOnly);
                UInt160[] addrs = new UInt160[(uint)count];
                uint i = 0;
                while (iterator.Next())
                {
                    addrs[i] = (UInt160)iterator.Value;
                    i++;
                }
                return addrs;
            }
        }

        // The storage for asset that will be added in locking
        public static class AssetStorage
        {
            private static readonly byte[] AssetPrefix = new byte[] { 0x03, 0x02 };

            internal static void Put(UInt160 asset)
            {
                StorageMap map = new(Storage.CurrentContext, AssetPrefix);
                map.Put(asset, 1);
            }

            internal static void Delete(UInt160 asset)
            {
                StorageMap map = new(Storage.CurrentContext, AssetPrefix);
                map.Delete(asset);
            }

            internal static bool Get(UInt160 asset)
            {
                StorageMap map = new(Storage.CurrentReadOnlyContext, AssetPrefix);
                return (BigInteger)map.Get(asset) == 1;
            }

            internal static BigInteger Count()
            {
                StorageMap map = new(Storage.CurrentReadOnlyContext, AssetPrefix);
                var iterator = map.Find();
                BigInteger count = 0;
                while (iterator.Next())
                {
                    count++;
                }
                return count;
            }

            internal static UInt160[] Find(BigInteger count)
            {
                StorageMap map = new(Storage.CurrentReadOnlyContext, AssetPrefix);
                var iterator = map.Find(FindOptions.RemovePrefix | FindOptions.KeysOnly);
                UInt160[] addrs = new UInt160[(uint)count];
                uint i = 0;
                while (iterator.Next())
                {
                    addrs[i] = (UInt160)iterator.Value;
                    i++;
                }
                return addrs;
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
            private static readonly byte[] SecondLockingPrefix = new byte[] { 0xa0,0x02};    
            internal static void Put(UInt160 fromAddress, UInt160 secondAddress, BigInteger FLUNDAmount, BigInteger lockTimeStamp)
            {
                byte[] key = (byte[])fromAddress;
                StorageMap map = new(Storage.CurrentContext, SecondLockingPrefix);
                SecondUserRecord record = new SecondUserRecord
                {
                    fromAddress = fromAddress,
                    secondAddress = secondAddress,
                    FLUNDAmount = FLUNDAmount,
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
                        FLUNDAmount = 0,
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

        public static class TotalFLMSupplyStorage
        {
            private static readonly byte[] TotalSupplyPrefix = new byte[] { 0x07, 0x01 };
            private static readonly byte[] TotalSupplyKey = "totalSupply".ToByteArray();

            internal static void Put(BigInteger amount)
            {
                StorageMap balanceMap = new(Storage.CurrentContext, TotalSupplyPrefix);
                balanceMap.Put(TotalSupplyKey, amount);
            }

            internal static BigInteger Get()
            {
                StorageMap balanceMap = new(Storage.CurrentReadOnlyContext, TotalSupplyPrefix);
                return (BigInteger)balanceMap.Get(TotalSupplyKey);
            }

            internal static void Increase(BigInteger amount) => Put(Get() + amount);

            internal static void Reduce(BigInteger amount) => Put(Get() - amount);
        }

        public static class CurrentLockProfitStorage
        {
            private static readonly byte[] CurrentLockProfitPrefix = new byte[] { 0x07, 0x02 };

            internal static void Put(UInt160 asset, BigInteger profit)
            {
                StorageMap map = new(Storage.CurrentContext, CurrentLockProfitPrefix);
                map.Put(asset, profit);
            }

            internal static BigInteger Get(UInt160 asset)
            {
                StorageMap map = new(Storage.CurrentReadOnlyContext, CurrentLockProfitPrefix);
                return map.Get(asset) is null ? 0 : (BigInteger)map.Get(asset);
            }
        }

        public static class UpgradeTimeLockStorage
        {
            private static readonly byte[] UpgradeTimelockPrefix = new byte[] { 0x08, 0x01 };
            internal static void Put(BigInteger timestamp)
            {
                StorageMap map = new(Storage.CurrentContext, UpgradeTimelockPrefix);
                map.Put("UpgradeTimelockPrefix", timestamp);
            }

            internal static BigInteger Get()
            {
                StorageMap map = new(Storage.CurrentReadOnlyContext, UpgradeTimelockPrefix);
                return (BigInteger)map.Get("UpgradeTimelockPrefix");
            }
        }

        public static class PauseStorage
        {
            private static readonly byte[] PauseStoragePrefix = new byte[] {0x09, 0x03};
            internal static void Put(BigInteger ispause)
            {
                StorageMap map = new(Storage.CurrentContext, PauseStoragePrefix);
                map.Put("PausePrefix", ispause);
            }

            internal static bool Get()
            {
                StorageMap authorMap = new(Storage.CurrentReadOnlyContext, PauseStoragePrefix);
                return (BigInteger)authorMap.Get("PausePrefix") == 1;
            }
        }

        public static class PauseLockingStorage
        {
            private static readonly byte[] PauseLockingPrefix = new byte[] { 0x09, 0x01 };

            internal static void Put(BigInteger ispause)
            {
                StorageMap map = new(Storage.CurrentContext, PauseLockingPrefix);
                map.Put("PauseLockingPrefix", ispause);
            }

            internal static bool Get()
            {
                StorageMap map = new(Storage.CurrentReadOnlyContext, PauseLockingPrefix);
                return (BigInteger)map.Get("PauseLockingPrefix") == 1;
            }
        }

        public static class PauseRefundStorage
        {
            private static readonly byte[] PauseRefundPrefix = new byte[] { 0x09, 0x02 };

            internal static void Put(BigInteger ispause)
            {
                StorageMap map = new(Storage.CurrentContext, PauseRefundPrefix);
                map.Put("PauseRefundPrefix", ispause);
            }

            internal static bool Get()
            {
                StorageMap map = new(Storage.CurrentReadOnlyContext, PauseRefundPrefix);
                return (BigInteger)map.Get("PauseRefundPrefix") == 1;
            }
        }

        public static class CurrentShareAmountStorage
        {
            private static readonly byte[] CurrentShareAmountPrefix = new byte[] { 0x07, 0x03 };

            internal static void Put(UInt160 asset, BigInteger amount)
            {
                StorageMap map = new(Storage.CurrentContext, CurrentShareAmountPrefix);
                map.Put(asset, amount);
            }

            internal static BigInteger Get(UInt160 asset)
            {
                StorageMap map = new(Storage.CurrentReadOnlyContext, CurrentShareAmountPrefix);
                return (BigInteger)map.Get(asset);
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