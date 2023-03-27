using System;
using System.Numerics;
using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Services;

namespace FLUNDLocking
{
    public partial class FLUNDLocking
    {
        public static bool UpgradeStart()
        {
            if (!Runtime.CheckWitness(GetOwner())) return false;
            var t = UpgradeTimeLockStorage.Get();
            if (t != 0) return false;
            return true;
        }

        public static void update(ByteString nefFile, string manifest)
        {
        }
    }
}