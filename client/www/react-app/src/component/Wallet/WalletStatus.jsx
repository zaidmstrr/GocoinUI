import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { minValAtom } from '../../store/atoms/blockMinVal';
import ActiveWalletPage from './ActiveWalletPage';
// import { callWalletRefresh } from '../../store/atoms/walletFuncAtom';

const WalletStatus = () => {
  // let walletRefreshValue = useRecoilValue(callWalletRefresh)

  const [walletaOnIn, setwalletaOnIn] = useState(null);
  const [walletaOn, setwalletaOn] = useState(null);
  const [lastBlock, setLastBlock] = useState(0);
  const [chainInSync, setChainInSync] = useState(true);
  const [walletProgress, setWalletProgress] = useState(null);
  const minVal = useRecoilValue(minValAtom);

  
  
  useEffect(() => {

    const fetchWalletStatus = async () => {
      try {
        const response = await axios.get('/walsta.json');
        const stat = response.data;
        setwalletaOnIn(stat.WalletOnIn)
        setWalletProgress(stat.WalletProgress)
        setwalletaOn(stat.WalletON)
      } catch (error) {
        console.error('Error fetching wallet status:', error);
        setTimeout(fetchWalletStatus, 1000);
      }
    };   
    // fetchWalletStatus()
    const intervalId = setInterval(fetchWalletStatus, 1000);
  return () => clearInterval(intervalId);
    
}, []);


const EnabledIn = () => ( 
  <div className='pl-[280px]'>
    <div className='flex items-end pr-2 pt-0 text-blue-200 italic'> Minimum output value to be included in wallet's balance <p className='font-medium ml-1 mr-1'>{satoshisToBtc(minVal)}</p> BTC</div>
    <div className='flex justify-center items-center h-screen w-screen pr-[380px] mt-[-100px] '>
        <div className='text-gray-200 flex flex-col items-center' >
          <div className='flex flex-row justify-between '>
            <div className='mb-2 text-lg '>Wallet functionality is not available at this moment.</div>
            {/* <div className='pr-2 pt-0 text-blue-200 italic'> Minimum output value to be included in wallet's balance 0.001 BTC</div> */}
          </div>
            <div className='flex flex-row text-lg mb-8'>It will auto enabled in <p className='pl-1 text-gray-50 font-bold'> { walletaOnIn}</p>...</div>
            <button className="bg-orange-700 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md cursor-not-allowed">
                Enable wallet functionality now
            </button>
        </div>
    </div>
  </div> 
)

const InProgress = () => (
  <div>
        <div className='text-gray-200'>
            <p className=''>Wallet functionality is being enabled - {(walletProgress/10).toFixed(0) + '%'}  completed.</p>
            <button>Abort enabling wallet functionality</button>
        </div>
  </div>
)

const WalletDisabled = () => {
  return (
    <div className='pl-[280px]'>
      <div className='flex items-end pr-2 pt-0 text-blue-200 italic'> Wallet Fuctionality is disabled, click on the button below to enable it</div>
    </div>
  )
}

const satoshisToBtc = (satoshis) => {
  // Convert from satoshis to Bitcoin by dividing by 100,000,000
  return (satoshis / 100000000).toFixed(3);
};

function GetCurrentStatus() {
  if(walletaOnIn != 0 ){  // && walletaOnIn != 0
    return <EnabledIn />

  } 
  else if(walletaOn == false){
      return <WalletDisabled />
  }
  else {
    return <ActiveWalletPage/>
  }
}

  return (
    <div className='m-4 ml-[20px] mt-[100px] overflow-x-hidden '>
        
        <GetCurrentStatus />
    </div>
  );
};

export default WalletStatus;
