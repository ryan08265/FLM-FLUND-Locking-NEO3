using System;
using System.ComponentModel;
using Neo;
using Neo.SmartContract.Framework;

namespace FLUNDLocking
{
    partial class FLUNDLocking
    {
        // Check validation of address - token hash, user wallet address
        static bool CheckAddrValid(bool checkZero, params UInt160[] addrs)
        {
            foreach (UInt160 addr in addrs)
            {
                if (!addr.IsValid || (checkZero && addr.IsZero)) return false;
            }
            return true;
        }
    }
}
