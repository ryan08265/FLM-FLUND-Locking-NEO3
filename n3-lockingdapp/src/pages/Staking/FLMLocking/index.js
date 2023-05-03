
import React, { useState } from 'react';
import {
  refreshAccount,
  sendTransactions,
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';
import {
  Address,
  AddressValue,
  AbiRegistry,
  SmartContractAbi,
  SmartContract,
  ProxyProvider,
  TypedValue,
  BytesValue,
  Egld,
  BigUIntValue,
  ArgSerializer,
  GasLimit,
  DefaultSmartContractController,
  U64Value,
} from '@elrondnetwork/erdjs';
import axios from 'axios';
import Modal from 'react-modal';
import arrow from 'assets/img/arrow.png';
import btxLogo from 'assets/img/BTX logo.png';
import coin from 'assets/img/coin.png';
import elrondLogo from 'assets/img/Elrond logo.png';
import AlertModal from 'components/AlertModal';

import {
  BTX2BTX_CONTRACT_ADDRESS,
  BTX2BTX_CONTRACT_ABI,
  BTX2BTX_CONTRACT_NAME,
  BTX_TOKEN_TICKER,
  BTX_TOKEN_ID,
  BTX_TOKEN_DECIMALS,
} from 'config';
import {
  SECOND_IN_MILLI,
  TIMEOUT,
  convertWeiToEsdt,
  convertTimestampToDateTime,
  convertTimestampToDays,
  convertAPR2APY,
  IContractInteractor,
  getBalanceOfToken,
} from 'utils';
import { version } from 'react-dom';

const Btx2BtxStakingCard = () => {
  const { account, address } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const provider = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

  const [showModal, setShowModal] = useState(false);
  const [isStakeModal, setIsStakeModal] = useState(true);
  const [modalInputAmount, setModalInputAmount] = useState(0);


  const [stakeContractInteractor, setStakeContractInteractor] = React.useState<IContractInteractor | undefined>();
  const [stakeSetting, setStakeSetting] = React.useState<any>();
  const [stakeAccount, setStakeAccount] = React.useState<any>();

  const [balance, setBalance] = React.useState<any>(undefined);

  const [modalInfoMesssage, setModalInfoMesssage] = React.useState<string>('');
  const [modalButtonDisabled, setModalButtonDisabled] = React.useState<boolean>(true);

  const [alertModalShow, setAlertModalShow] = React.useState<boolean>(false);
  const [alertModalText, setAlertModalText] = React.useState<string>('');

  // load smart contract abi and parse it to SmartContract object for tx
  React.useEffect(() => {
    (async () => {
      const registry = await AbiRegistry.load({ urls: [BTX2BTX_CONTRACT_ABI] });
      const abi = new SmartContractAbi(registry, [BTX2BTX_CONTRACT_NAME]);
      const contract = new SmartContract({ address: new Address(BTX2BTX_CONTRACT_ADDRESS), abi: abi });
      const controller = new DefaultSmartContractController(abi, provider);

      setStakeContractInteractor({
        contract,
        controller,
      });
    })();
  }, []); // [] makes useEffect run once


  React.useEffect(() => {
    (async () => {
      if (!stakeContractInteractor) return;

      const interaction = stakeContractInteractor.contract.methods.viewStakeSetting();
      const res = await stakeContractInteractor.controller.query(interaction);

      if (!res || !res.returnCode.isSuccess()) return;
      const value = res.firstValue.valueOf();

      const token_id = value.token_id.toString();
      const min_stake_limit = convertWeiToEsdt(value.min_stake_limit, BTX_TOKEN_DECIMALS);
      const max_stake_limit = convertWeiToEsdt(value.max_stake_limit, BTX_TOKEN_DECIMALS);
      const lock_period = value.lock_period.toNumber() * SECOND_IN_MILLI;
      const undelegation_period = value.undelegation_period.toNumber() * SECOND_IN_MILLI;
      const claim_lock_period = value.claim_lock_period.toNumber() * SECOND_IN_MILLI;
      const apr = value.apr.toNumber() / 100;
      const total_staked_amount = convertWeiToEsdt(value.total_staked_amount, BTX_TOKEN_DECIMALS);
      const number_of_stakers = value.number_of_stakers.toNumber();

      const result = {
        token_id,
        min_stake_limit,
        max_stake_limit,
        lock_period,
        undelegation_period,
        claim_lock_period,
        apr,
        total_staked_amount,
        number_of_stakers,
      };

      // console.log('BTX viewStakeSetting', result);

      setStakeSetting(result);
    })();
  }, [stakeContractInteractor]);


  React.useEffect(() => {
    (async () => {
      if (!stakeContractInteractor || !account.address) return;
      const args = [new AddressValue(new Address(account.address))];
      const interaction = stakeContractInteractor.contract.methods.viewStakeAccount(args);
      const res = await stakeContractInteractor.controller.query(interaction);

      if (!res || !res.returnCode.isSuccess()) return;
      const value = res.firstValue.valueOf();

      const address = value.address.toString();
      const staked_amount = convertWeiToEsdt(value.staked_amount, BTX_TOKEN_DECIMALS);
      const last_stake_timestamp = value.last_stake_timestamp.toNumber() * SECOND_IN_MILLI;
      const unstaked_amount = convertWeiToEsdt(value.unstaked_amount, BTX_TOKEN_DECIMALS);
      const last_unstake_timestamp = value.last_unstake_timestamp.toNumber() * SECOND_IN_MILLI;
      const collectable_amount = convertWeiToEsdt(value.collectable_amount, BTX_TOKEN_DECIMALS);
      const reward_amount = convertWeiToEsdt(value.reward_amount, BTX_TOKEN_DECIMALS);
      const last_claim_timestamp = value.last_claim_timestamp.toNumber() * SECOND_IN_MILLI;

      const result = {
        address,
        staked_amount,
        last_stake_timestamp,
        unstaked_amount,
        last_unstake_timestamp,
        collectable_amount,
        reward_amount,
        last_claim_timestamp,
      };

      // console.log('BTX viewStakeAccount', result);
      setStakeAccount(result);
    })();
  }, [account, stakeContractInteractor, hasPendingTransactions]);


  React.useEffect(() => {
    if (!address) return;
    getBalanceOfToken(network.apiAddress, account, BTX_TOKEN_ID).then((v) => setBalance(v));
  }, [address, hasPendingTransactions]);

  function onShowStakeModal() {
    if (!account.address) {
      onShowAlertModal('You should connect your wallet first!');
      return;
    }

    setModalInputAmount(0);
    setModalInfoMesssage('');
    setModalButtonDisabled(true);
    setIsStakeModal(true);
    setShowModal(true);
  }

  function onShowUnstakeModal() {
    if (!account.address) {
      onShowAlertModal('You should connect your wallet first!');
      return;
    }

    setModalInputAmount(0);
    setModalInfoMesssage('');
    setModalButtonDisabled(true);
    setIsStakeModal(false);
    setShowModal(true);
  }

  function onModalInputAmountChange(v: any) {
    if (!account.address || !stakeSetting || !stakeAccount) return;

    const value = Number(v);
    let _modalInfoMesssage = '';
    let _modalButtonDisabled = true;
    const currentTimestamp = (new Date()).getTime();

    if (isStakeModal) { // stake
      if (value <= 0) {
        _modalInfoMesssage = 'Invalid amount.';
      } else if (value > balance) {
        _modalInfoMesssage = 'Not enough tokens in your wallet.';
      } else if (value < stakeSetting.min_stake_limit) {
        _modalInfoMesssage = `Cannot stake less than ${stakeSetting.min_stake_limit} ${BTX_TOKEN_TICKER}.`;
      } else if (stakeSetting.max_stake_limit > 0 && stakeAccount.staked_amount + value > stakeSetting.max_stake_limit) {
        _modalInfoMesssage = `Cannot stake more than ${Math.max(stakeSetting.max_stake_limit - stakeAccount.staked_amount, 0)} ${BTX_TOKEN_TICKER}.`;
      } else {
        _modalButtonDisabled = false;
      }
    } else {  // unstake
      if (value <= 0 || value > 100) {
        _modalInfoMesssage = 'Invalid amount.';
      } else if (currentTimestamp < stakeAccount.last_stake_timestamp + stakeSetting.lock_period) {
        _modalInfoMesssage = `Cannot unstake before ${convertTimestampToDateTime(stakeAccount.last_stake_timestamp + stakeSetting.lock_period)}`;
      } else {
        _modalButtonDisabled = false;
      }
    }

    setModalInfoMesssage(_modalInfoMesssage);
    setModalButtonDisabled(_modalButtonDisabled);
    setModalInputAmount(v);
  }

  function onModalMaximize() {
    const value = isStakeModal ? balance : 100;
    onModalInputAmountChange(value);
  }

  function onShowAlertModal(text: string) {
    setAlertModalText(text);
    setAlertModalShow(true);
  }
  async function stake() {
    const args: TypedValue[] = [
      BytesValue.fromUTF8(BTX_TOKEN_ID),
      new BigUIntValue(Egld(modalInputAmount).valueOf()),
      BytesValue.fromUTF8('stake'),
    ];
    const { argumentsString } = new ArgSerializer().valuesToString(args);
    const data = `ESDTTransfer@${argumentsString}`;

    const tx = {
      receiver: BTX2BTX_CONTRACT_ADDRESS,
      gasLimit: new GasLimit(10000000),
      data: data,
    };

    await refreshAccount();
    sendTransactions({
      transactions: tx,
    });

    setShowModal(false);
  }

  async function unstake() {
    const args: TypedValue[] = [
      new U64Value(Math.floor(modalInputAmount * 100)),
    ];
    const { argumentsString } = new ArgSerializer().valuesToString(args);
    const data = `unstake@${argumentsString}`;

    const tx = {
      receiver: BTX2BTX_CONTRACT_ADDRESS,
      data: data,
      gasLimit: new GasLimit(6000000),
    };
    await refreshAccount();
    await sendTransactions({
      transactions: tx,
    });

    setShowModal(false);
  }

  async function claim() {
    if (!account.address) {
      onShowAlertModal('You should connect your wallet first!');
      return;
    }

    if (stakeAccount.reward_amount == 0 && stakeAccount.collectable_amount == 0) {
      onShowAlertModal('You don\'t have rewards or collectables to be claimed.');
      return;
    }

    const currentTimestamp = (new Date()).getTime();
    if (currentTimestamp < stakeAccount.last_claim_timestamp + stakeSetting.claim_lock_period) {
      onShowAlertModal(`Cannot claim before ${convertTimestampToDateTime(stakeAccount.last_claim_timestamp + stakeSetting.claim_lock_period)}`);
      return;
    }

    const tx = {
      receiver: BTX2BTX_CONTRACT_ADDRESS,
      data: 'claim',
      gasLimit: new GasLimit(6000000),
    };
    await refreshAccount();
    await sendTransactions({
      transactions: tx,
    });
  }

  async function reinvest() {
    if (!account.address) {
      onShowAlertModal('You should connect your wallet first!');
      return;
    }

    if (stakeAccount.reward_amount == 0) {
      onShowAlertModal('You don\'t have rewards for reinvest.');
      return;
    }

    const currentTimestamp = (new Date()).getTime();
    if (currentTimestamp < stakeAccount.last_claim_timestamp + stakeSetting.claim_lock_period) {
      onShowAlertModal(`Cannot reinvest before ${convertTimestampToDateTime(stakeAccount.last_claim_timestamp + stakeSetting.claim_lock_period)}`);
      return;
    }

    const tx = {
      receiver: BTX2BTX_CONTRACT_ADDRESS,
      data: 'restake',
      gasLimit: new GasLimit(6000000),
    };
    await refreshAccount();
    await sendTransactions({
      transactions: tx,
    });
  }

  return (
    <div className='card'>
      <div className='stake_earn'>
        <div>
          <img src={btxLogo} />
          <p>Stake $BTX</p>
        </div>
        <img src={arrow} />
        <div>
          <img src={btxLogo} />
          <p>Earn $BTX</p>
        </div>
      </div>

      {/* <p className='description'>
                BitX Finance is a decentralized social economic platform that is making private aviation accessible to anyone
            </p> */}
      {/* <hr className='hr'/> */}
      <div className='info' style={{ marginTop: "8px" }}>
        <div>
          <p className='heading'>APR</p>
          <p className='data'>{stakeSetting ? stakeSetting.apr : '-'} %</p>
        </div>
        <div>
          <p className='heading'>APY</p>
          <p className='data'>{stakeSetting ? convertAPR2APY(stakeSetting.apr) : '-'} %</p>
        </div>
        <div>
          <p className='heading'>Total Staked</p>
          <p className='data'>{stakeSetting ? stakeSetting.total_staked_amount : '-'} {BTX_TOKEN_TICKER}</p>
        </div>
        <div>
          <p className='heading'>Total Stakers</p>
          <p className='data'>{stakeSetting ? stakeSetting.number_of_stakers : '-'}</p>
        </div>
      </div>

      <div className='staking-info'>
        <div className='info'>
          <div>
            <p className='heading'>Lock</p>
            <p className='data'>{stakeSetting && convertTimestampToDays(stakeSetting.lock_period)}{" Days"}</p>
          </div>
          <div>
            <p className='heading'>Undelegation</p>
            <p className='data'>{stakeSetting && convertTimestampToDays(stakeSetting.undelegation_period)}{" Days"}</p>
          </div>
        </div>
      </div>

      <div className='buttonDiv'>
        <button className='stake_button' onClick={onShowStakeModal}>
          <p>Stake</p>
        </button>
        <button className='unstake_button' onClick={onShowUnstakeModal}>
          <p>Unstake</p>
        </button>
      </div>

      <div className='info'>
        <div>
          <p className='heading'>My Staked</p>
          <p className='data'>{stakeAccount ? stakeAccount.staked_amount : '-'} BTX</p>
        </div>
        <div>
          <p className='heading'>My Unstaked</p>
          <p className='data'>{stakeAccount ? stakeAccount.unstaked_amount : '-'} BTX</p>
        </div>
        <div>
          <p className='heading'>My Reward</p>
          <p className='data'>{stakeAccount ? stakeAccount.reward_amount : '-'} BTX</p>
        </div>
        <div>
          <p className='heading'>My Collectable</p>
          <p className='data'>{stakeAccount ? stakeAccount.collectable_amount : '-'} BTX</p>
        </div>
      </div>

      <img className="elrond" src={elrondLogo} />
      <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: '20px' }}>
        <button className='claimReward_button' onClick={reinvest}>
          <p>Reinvest</p>
        </button>
        <button className='claimReward_button' onClick={claim}>
          <p>Claim</p>
        </button>
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
        ariaHideApp={false}
        className='modalcard box-shadow'
      >
        <img className={"coin"} src={coin} />
        <div className='modaldiv'>
          <h3 className='modalHeader'>
            {isStakeModal ? 'Stake' : 'Unstake'}
          </h3>
        </div>
        <p className='modal-description'>
          {
            showModal && stakeSetting && (isStakeModal ?
              `Your tokens will be locked for ${convertTimestampToDays(stakeSetting.lock_period)} days after deposit (even the tokens that are already staked)`
              : `Your tokens will be undelegated for ${convertTimestampToDays(stakeSetting.undelegation_period)} days after unstake (even the tokens that are already unstaked)`)
          }
        </p>
        <div className='modal-divider'></div>
        <div
          style={{
            marginTop: '15px'
          }}
          className='font-24'
        >
          <span>{isStakeModal ? 'Balance' : 'Staked'}:&nbsp;&nbsp;</span>
          <span style={{ color: '#FEE277', fontWeight: 600, fontSize: '1rem' }}>
            {showModal && (isStakeModal ? balance : stakeAccount.staked_amount)}
          </span>
          <span>&nbsp;{BTX_TOKEN_TICKER}</span>
        </div>
        <h6 className='modal-info-1'>
          {isStakeModal ? 'Amount to Stake' : 'Percentage to Unstake'}
        </h6>
        <div className='modal-div-1'>
          <input className='modal-input-1'
            placeholder={isStakeModal ? 'Amount' : 'Percentage'}
            type='number'
            step={0.01}
            value={modalInputAmount}
            onChange={(e) => onModalInputAmountChange(e.target.value)}
          />
          {
            !isStakeModal && (<span className='stake-modal-input-percentage'>%</span>)
          }
          <button className='maximize-button'
            onClick={onModalMaximize}
          >
            MAX
          </button>
        </div>
        <div className='modal-divider' style={{ paddingTop: "20px" }}></div>
        <div className='modal-info-message'>
          {modalInfoMesssage}
        </div>
        {
          isStakeModal ? (
            <button
              className='modal-submit-button'
              onClick={stake}
              disabled={modalButtonDisabled}
            >
              Stake
            </button>
          ) : (
            <button
              className='modal-submit-button'
              onClick={unstake}
              disabled={modalButtonDisabled}
            >
              Unstake
            </button>
          )
        }
      </Modal>
      <AlertModal
        show={alertModalShow}
        onHide={() => setAlertModalShow(false)}
        alertmodaltext={alertModalText}
      />
    </div>
  );
};

export default Btx2BtxStakingCard;