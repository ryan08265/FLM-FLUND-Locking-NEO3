using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Services;

namespace FLUNDLocking
{
    public partial class FLUNDLocking
    {
        public static bool IsPaused()
        {
            return PauseStorage.Get();
        }

        public static bool IsLockingPaused()
        {
            return PauseLockingStorage.Get();
        }

        public static bool IsRefundPaused()
        {
            return PauseRefundStorage.Get();
        }

        public static bool Pause(UInt160 author)
        {
            ExecutionEngine.Assert(Runtime.CheckWitness(author), "Pause: CheckWitness failed, author-".ToByteArray().Concat(author).ToByteString());
            ExecutionEngine.Assert(IsAuthor(author), "Pause: not author".ToByteArray().Concat(author).ToByteString());
            PauseStorage.Put(1);
            return true;
        }

        public static bool UnPause(UInt160 author)
        {
            ExecutionEngine.Assert(Runtime.CheckWitness(author), "Unpause: CheckWitness failed, author-".ToByteArray().Concat(author).ToByteString());
            ExecutionEngine.Assert(IsAuthor(author), "Unpause: not author".ToByteArray().Concat(author).ToByteString());
            PauseStorage.Put(0);
            return true;
        }

        public static bool PauseLocking(UInt160 author)
        {
            ExecutionEngine.Assert(Runtime.CheckWitness(author), "PauseLocking: CheckWitness failed, author-".ToByteArray().Concat(author).ToByteString());
            ExecutionEngine.Assert(IsAuthor(author), "PauseLocking: not author".ToByteArray().Concat(author).ToByteString());
            PauseLockingStorage.Put(1);
            return true;
        }

        public static bool UnPauseLocking(UInt160 author)
        {
            ExecutionEngine.Assert(Runtime.CheckWitness(author), "UnPauseLocking: CheckWitness failed, author-".ToByteArray().Concat(author).ToByteString());
            ExecutionEngine.Assert(IsAuthor(author), "UnPauseLocking: not author".ToByteArray().Concat(author).ToByteString());
            PauseLockingStorage.Put(0);
            return true;
        }

        public static bool PauseRefund(UInt160 author) 
        {
            ExecutionEngine.Assert(Runtime.CheckWitness(author), "PauseRefund: CheckWitness failed, author-".ToByteArray().Concat(author).ToByteString());
            ExecutionEngine.Assert(IsAuthor(author), "PauseRefund: not author".ToByteArray().Concat(author).ToByteString());
            PauseRefundStorage.Put(1);
            return true;
        }

        public static bool UnPauseRefund(UInt160 author)
        {
            ExecutionEngine.Assert(Runtime.CheckWitness(author), "UnPauseRefund: CheckWitness failed, author-".ToByteArray().Concat(author).ToByteString());
            ExecutionEngine.Assert(IsAuthor(author), "UnPauseRefund: not author".ToByteArray().Concat(author).ToByteString());
            PauseRefundStorage.Put(0);
            return true;
        }
    }
}