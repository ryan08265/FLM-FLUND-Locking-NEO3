using Neo.SmartContract;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;
using System.ComponentModel;

namespace FLUNDLocking
{
    partial class FLUNDLocking
    {
        static readonly string PreData = "FLUNDPrice";

        public static string GetRequestData()
        {
            return Storage.Get(Storage.CurrentContext, PreData);
        }

        public static void CreateFLUNDPriceRequest(string url, string filter, string callback, byte[] userData, long gasForResponse)
        {
            Oracle.Request(url, filter, callback, userData, gasForResponse);
        }

        public static void Callback(string url, byte[] userData, int code, byte[] result)
        {
            if (Runtime.CallingScriptHash != Oracle.Hash) throw new Exception("Unauthorized!");
            Storage.Put(Storage.CurrentContext, PreData, result.ToByteString());
        }
    }
}