# FLM-FLUND-Locking-NEO3
This is the NEO3 smart contract for locking FLUND tokens.
What we would like to do in this contract is take the variable returns and make them into a steady fixed return in a stablecoin, like FUSDT(stable coin on NEO3).


The flow is here:
There are several locking pools. And each pool has 2 users.

Step1:
User1 deposits some FLM to the contract.
And user1 sets FUSDT amount and locking time period.

Step2:
Second user deposits FUSDT that amount is specified in step1
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

