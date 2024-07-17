import React, { useState, useEffect } from 'react';
import axios from 'axios';
import gocoin from '../assets/gocoin.jpeg';
import { IoIosMusicalNotes } from "react-icons/io";
import { useSetRecoilState } from 'recoil';
import { minValAtom } from '../store/atoms/blockMinVal';
import { blockHeightAtom } from '../store/atoms/blockHeightAtom';
import { FaSync } from "react-icons/fa";
import SoundDisplay from './SoundDisplay';
import beep from '../assets/beep.mp3';

function TopNavBar() {
  let [lastBlock, setLastBlock] = useState('XXX');
  let [block, setBlock] = useState(localStorage.getItem('block'));
  const [chainInSync, setChainInSync] = useState(false);
  const [walletOn, setWalletOn] = useState(false);
  const [timeNow, setTimeNow] = useState(null);
  const [lastHeaderHeight, setLastHeaderHeight] = useState(null);

  const setMinVal = useSetRecoilState(minValAtom);
  const setBlockHeight = useSetRecoilState(blockHeightAtom);
  let soundEnabled = localStorage.getItem('soundEnabled') === 'true';

  useEffect(() => {
    const refreshBlock = async () => {
      try {
        const response = await axios.get('/status.json');
        const data = response.data;
        
        setBlockHeight(data.Height);
        setMinVal(data.MinValue);
        setLastBlock(data.Height);
        setChainInSync(data.BlockChainSynchronized);
        setWalletOn(data.WalletON);
        setTimeNow(data.Time_now);
        setLastHeaderHeight(data.LastHeaderHeight)

        setTimeout(refreshBlock, parseInt(data.Height, 10) !== lastBlock ? 2000 : 6000);
      } catch (error) {
        console.error(error);
        setTimeout(refreshBlock, 10000);
      }
    };

    refreshBlock();
  }, [lastBlock, setBlockHeight, setMinVal]);

  useEffect(() => {
    localStorage.setItem('blocks', lastBlock)
    // if (block !== lastBlock && soundEnabled) {
    //   const audio = new Audio(beep);
    //   audio.play();
    //   setBlock(lastBlock);
    //   console.log("Beep sound played");
    // }
  }, [lastBlock, soundEnabled, block]);

  let blockCheck = localStorage.getItem('block')
  if (blockCheck != lastBlock) {
    localStorage.setItem('block', lastBlock)
    // setBlock(lastBlock);
    if(soundEnabled) {
      const audio = new Audio(beep);
      audio.play();
      // setBlock(lastBlock);
      console.log("Beep sound played");
    }
  }
  const displayChainInSync = () => {
    let blocksLeft = lastHeaderHeight - lastBlock;
    return (
      <div className="relative group">
        <FaSync className={`${!chainInSync ? 'text-red-500' : 'text-green-500'} cursor-pointer`} />
        {!chainInSync && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {blocksLeft} blocks left
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-gray-900 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <div className="flex ms-2 md:me-24">
                <img src={gocoin} className="h-8 me-3" alt="GoCoin Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">GoCoin</span>
              </div>
            </div>
            <div className="flex items-center justify-center flex-1">
              <div className="flex flex-row items-center space-x-3 text-center text-gray-300 font-medium">
                <p>{lastBlock}</p>
                <SoundDisplay />
                <div>{displayChainInSync()}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="px-2 py-3 text-gray-100 hover:bg-gray-700 cursor-pointer">
                  <p>PushTx</p>
                </div>
                <div className="px-2 py-3 text-gray-100 hover:bg-gray-700 cursor-pointer">
                  <p>Counters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default TopNavBar;
