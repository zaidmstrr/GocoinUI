import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

const HomeNode = () => {
  const [systemData, setSystemData] = useState(null);
  const [txData, setTxData] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [systemResponse, txResponse] = await Promise.all([
        axios.get('system.json'),
        axios.get('txstat.json'),
      ]);
      setSystemData(systemResponse.data);
      setTxData(txResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTimeout(fetchData, 5000); // Retry after 5 seconds
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Refresh every second

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, [fetchData]);

  const formatSize = useMemo(() => (bytes) => {
    const mb = (bytes / 0x100000).toFixed(0);
    return `${mb} MB`;
  }, []);

  const getRightTime = useMemo(() => (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const daysStr = days > 0 ? `${days}D ` : '';
    const hoursStr = hours > 0 ? `${hours}H ` : '';
    const minutesStr = minutes > 0 ? `${minutes}M ` : '';
    const secondsStr = remainingSeconds > 0 ? `${remainingSeconds}S` : '';

    return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.trim() || '0 seconds';
  }, []);

  const bignum = useMemo(() => (value) => {
    if (value === undefined || value === null) {
      return '0';
    }
    const suffixes = ['', ' kB', ' MB', ' GB', ' TB', ' PB', ' EB'];
    const base = 1024;
    let suffixIndex = 0;
    let num = value;

    while (num >= base && suffixIndex < suffixes.length - 1) {
      num /= base;
      suffixIndex++;
    }

    return `${num.toFixed(2)}${suffixes[suffixIndex]}`;
  }, []);

  if (!systemData) {
    return (
      <div className='flex flex-col min-h-[135px] min-w-[580px] rounded-xl bg-gray-800 shadow-xl shadow-current p-4 mx-px'>
        <div className='font-bold text-2xl text-gray-300 pb-2'>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      {systemData && (
        <>
          <div className='font-bold text-2xl text-gray-300 pb-2'>
            Node
          </div>
          <div className="inline-flex items-center">
            <div className='flex flex-col ml-1 mr-4 text-gray-300 font-medium'>
              <div className='flex space-x-2 pr-4'>
                <p>Uptime:</p>
                <div className='flex justify-between min-w-[370px] pl-[73px]'>
                  <div className='flex space-x-1 items-center mr-2'>
                    <p>{getRightTime(systemData.Node_uptime)}</p>
                  </div>
                  <p>-</p>
                  <div className='flex space-x-1 items-center mr-2 ml-2'>
                    <p>{systemData.Known_peers} peers</p>
                  </div>
                  <p>-</p>
                  <div className='flex space-x-1 items-center ml-2'>
                    <p>{systemData.Ecdsa_verify_cnt} ECs</p>
                  </div>
                </div>
              </div>
              <div className='flex space-x-2 pr-4'>
                <p>Mem Used MB:</p>
                <div className='flex justify-between min-w-[370px] pl-5'>
                  <div className='flex space-x-1 items-center'>
                    <p>
                      <span title={"Total Memory Used"}>{formatSize(systemData.Heap_size + systemData.Qdb_extramem)}</span>
                      <span title='Native Go Heap'> ({formatSize(systemData.Heap_size)}</span>
                      +
                      <span title='QDB UTXO Records'> {formatSize(systemData.Qdb_extramem)})</span>
                      <span className='text-blue-400' title={formatSize(systemData.Heap_sysmem)}> [FREE]</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex space-x-2 pr-4'>
                <p>TX Mempool:</p>
                <div className='flex justify-between min-w-[370px] pl-8'>
                  <div className='flex min-w-[370px] justify-between items-center'>
                    <p>
                      <span title={`${txData.t2s_cnt} transaction accepted`}>{bignum(txData.t2s_size)}</span>
                    </p>
                    <p>
                      <span title={`${txData.tre_cnt} transaction accepted`}>{bignum(txData.tre_size)}</span>
                    </p>
                    <p>
                      <span title={"UTXOs spent in memory"}>{(txData.spent_outs_cnt)}</span>
                    </p>
                    <p>
                      <span title={"Minimum SPB"}>{(txData.min_fee_per_kb / 1000.0).toFixed(1)} spb</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeNode;
