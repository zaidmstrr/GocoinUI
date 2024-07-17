import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { FaDownload, FaUpload } from 'react-icons/fa';

const HomeNetwork = () => {
  const [bandwidthData, setBandwidthData] = useState(null);

  const fetchBandwidthInfo = useCallback(async () => {
    try {
      const response = await axios.get('/bwidth.json');
      setBandwidthData(response.data);
    } catch (error) {
      console.error('Error fetching bandwidth info:', error);
      setTimeout(fetchBandwidthInfo, 5000); // Retry after 5 seconds
    }
  }, []);

  useEffect(() => {
    fetchBandwidthInfo();
    const intervalId = setInterval(fetchBandwidthInfo, 1000); // Refresh every second

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, [fetchBandwidthInfo]);

  const tim2str = useCallback((timestamp, detailed = false) => {
    const date = new Date(timestamp * 1000);
    return detailed ? date.toLocaleString() : date.toLocaleTimeString();
  }, []);

  const renderExternalIP = useCallback(() => {
    if (!bandwidthData || !bandwidthData.ExternalIP || bandwidthData.ExternalIP.length === 0) {
      return <span title="">?</span>;
    }

    const mainIP = bandwidthData.ExternalIP[0];
    const otherIPs = bandwidthData.ExternalIP.slice(1);

    return (
      <>
        <span title={`${mainIP.Count} times, last at ${tim2str(mainIP.Timestamp)}`}>{mainIP.Ip}</span>
        {otherIPs.length > 0 && (
          <span>
            {otherIPs.slice(0, 2).map((ip, index) => (
              <span key={index} title={`${ip.Count} times, last at ${tim2str(ip.Timestamp)}`}>
                {index > 0 && ', '}
                {ip.Ip}
              </span>
            ))}
            {otherIPs.length > 2 && <span title={`${otherIPs.length - 2} more`}>, ...</span>}
          </span>
        )}
      </>
    );
  }, [bandwidthData, tim2str]);

  const formatSpeed = useMemo(() => (speedInKB) => {
    if (speedInKB / 1024 < 1024) {
      return `${(speedInKB / 1024).toFixed(2)} KB/s`;
    } else if (speedInKB / 1024 < 1024 * 1024) {
      return `${(speedInKB / (1024 * 1024)).toFixed(2)} MB/s`;
    } else {
      return `${(speedInKB / (1024 * 1024 * 1024)).toFixed(2)} GB/s`;
    }
  }, []);

  const formatTotalData = useMemo(() => (dataInKB) => {
    if (dataInKB / 1024 < 1024) {
      return `${(dataInKB / 1024).toFixed(2)} KB`;
    } else if (dataInKB / 1024 < 1024 * 1024) {
      return `${(dataInKB / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(dataInKB / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }, []);

  if (!bandwidthData) {
    return (
      <div className='flex flex-col min-h-[135px] min-w-[550px] rounded-xl bg-gray-800 shadow-xl shadow-current p-4 mx-px'>
        <div className='font-bold text-2xl text-gray-300 pb-2'>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex flex-col min-h-[135px] min-w-[550px] rounded-xl bg-gray-800 shadow-xl shadow-current p-4 mx-px'>
        <div className='font-bold text-2xl text-gray-300 pb-2'>
          Network
        </div>
        <div className="inline-flex items-center">
          <div className='flex flex-col ml-1 mr-4 text-gray-300 font-medium'>
            <div className='flex space-x-2 pr-4'>
              <p>Connection:</p>
              <div className='flex justify-between min-w-[370px] pl-8'>
                <p>{bandwidthData.Open_conns_total}</p>
                <div className='flex space-x-1 items-center'>
                  <FaUpload /> <p>{bandwidthData.Open_conns_out ? bandwidthData.Open_conns_out : 'loading'}</p>
                </div>
                <div className='flex space-x-1 items-center'>
                  <FaDownload /> <p>{bandwidthData.Open_conns_in}</p>
                </div>
              </div>
            </div>
            <div className='flex space-x-[-7px] pr-4'>
              <p>Downloading:</p>
              <div className='flex justify-between min-w-[370px] pl-8'>
                <p>{formatSpeed(bandwidthData.Dl_speed_now)}</p>
                <div className='flex space-x-1 items-center'> <p>{formatSpeed(bandwidthData.Dl_speed_max)}</p></div>
                <div className='flex space-x-1 items-center'><p>{formatTotalData(bandwidthData.Dl_total)}</p></div>
              </div>
            </div>
            <div className='flex space-x-[14px] pr-4'>
              <p>Uploading:</p>
              <div className='flex justify-between min-w-[370px] pl-8'>
                <p>{formatSpeed(bandwidthData.Ul_speed_now)}</p>
                <div className='flex space-x-1 items-center'><p>{formatSpeed(bandwidthData.Ul_speed_max)}</p></div>
                <div className='flex space-x-1 items-center'><p>{formatTotalData(bandwidthData.Ul_total)}</p></div>
              </div>
            </div>
            <div className='flex space-x-[14px] pr-4'>
              <p>External IP:</p>
              <div className='flex justify-between min-w-[370px] pl-8'>
                <div className='flex space-x-1 items-center'><p>{renderExternalIP()}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeNetwork;
