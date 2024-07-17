import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import HomeLineChart from './HomeLineChart';
// import { FaDownload } from "react-icons/fa";
// import { FaUpload } from "react-icons/fa";
import HomeNetwork from './HomeNetwork';
import HomeNode from './HomeNode';

function RecentBlockCard() {

  const [lastBlock, setLastBlock] = useState(false);
  const [version, setVersion] = useState(null);
  const [hash, setHash] = useState(null);
  const [lastHeader, setLastHeader] = useState(null);
  const [received, setReceived] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [median, setMedian] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  const [selectedOption, setSelectedOption] = useState('SPB');
  const [isAvgChecked, setIsAvgChecked] = useState(false);
  const [isOrdChecked, setIsOrdChecked] = useState(false);


  useEffect(() => {
    const refreshBlock = async () => {
      try {
        const response = await axios.get('/status.json');
        const data = response.data;
        
        // lastReceived = (data.Time_now - data.received);
        
        setHash(data.Hash);
        setLastHeader(data.LastHeaderHeight);
        
        //Calculating difficulty
        function shortenNumber(num) {
            const lookup = [
              { value: 1, symbol: "" },
              { value: 1e3, symbol: " k" },
              { value: 1e6, symbol: " M" },
              { value: 1e9, symbol: " B" },
              { value: 1e12, symbol: " T" },
            ];
            const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
            const item = lookup.slice().reverse().find(function(item) {
              return num >= item.value;
            });
            return item ? (num / item.value).toFixed(1).replace(rx, "$1") + item.symbol : "0";
          }
          const shortNumber = shortenNumber(data.Diff);
            setDifficulty(shortNumber);
        
        // Calculating the last block received
        setReceived(data.Time_now - data.Received)
        // console.log("received: " + received)

        //Calculating the version
        let versionHex = data.Version.toString(16); // Convert to hex
        let paddedHex = versionHex.padStart(8, '0'); // Pad with leading zeros to ensure it's 8 characters long
        let result =  paddedHex; 
        setVersion(result);
        
        //Timestamp calulation
        // Convert UNIX timestamp (in seconds) to milliseconds
        function UNIXToReal(timestamp){
            let date = new Date(timestamp * 1000);
            let finaldate = date.toLocaleString()
            return finaldate;

        }
        // Use toLocaleString to format the date and time
        setTimestamp(UNIXToReal(data.Timestamp));

        //Median calculation
        setMedian(UNIXToReal(data.Median))
          

        setTimeout(refreshBlock, parseInt(data.Height, 10) !== lastBlock ? 1000 : 6000);
      } catch (error) {
        console.error(error);

        setTimeout(refreshBlock, 10000);
      }
    };
    refreshBlock();

  }, []);
    
const handleOptionChange = (e) => {
    // Deselect the previously selected radio button
    if(e.target.value == 'SPB' && isOrdChecked){
        setSelectedOption(selectedOption);

    }else {
        setSelectedOption(e.target.value)
    }
    let radios = document.getElementsByName(selectedOption);
    // for()
    if (radios.length > 0) {
      radios[0].checked = false;
    }
}

const handleAvgCheckboxChange = (e) => {
    setIsAvgChecked(e.target.checked);
  };

const handleOrdCheckboxChange = (e) => {
    setIsOrdChecked(e.target.checked);

    // If "Ord. %" is checked and the current radio button is "Average SPB"
    if (e.target.checked && (selectedOption === 'SPB' )) {
      // Deselect "Average SPB" and select "Weight"
      setSelectedOption('Weight');
    }
};
const averageSPBClickCheck = (e) => {
    if((selectedOption == 'Weight' || selectedOption == 'blockKB' || selectedOption == 'Transactions') && isOrdChecked == true){
        alert('Please uncheck Ord. % first!');
    }
}

  return (
    <>

    <div className='flex flex-col md:pl-[280px] pl-5'> 
        <div className='flex ml-[10px] my-[130px] md:ml-[50px] mr-[50px] pb-2'>
            <div className=' min-h-[200px] min-w-[1100px] rounded-xl bg-gray-800 shadow-xl shadow-current p-4 mx-px'> 
                <div className='font-bold text-2xl text-gray-300 pb-2'>
                   Recent Blocks 
                </div>
                <div>
                   
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    name="SPB"
                    id="chart_type_spb"
                    value="SPB"
                    className={`inline-flex items-center ${
                        selectedOption === 'SPB' ? 'text-blue-600' : 'text-gray-300'
                      }`}
                    onChange={handleOptionChange}
                    onClick={averageSPBClickCheck}
                    checked={selectedOption === 'SPB' && !isOrdChecked}
                    />
                    <span className="ml-1 mr-4 text-gray-300">Average SPB</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    name="BlocksizeKB"
                    id="chart_type_blockKB"
                    value="blockKB"
                    className="form-radio h-3 w-5 text-blue-600"
                    onChange={handleOptionChange}
                    checked={selectedOption === "blockKB"}
                    />
                    <span className="ml-1 mr-4 text-gray-300">Blockize KB</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    name="Transactions"
                    id="chart_type_trans"
                    value="Transactions"
                    className="form-radio h-3 w-5 text-blue-600"
                    onChange={handleOptionChange}
                    checked={selectedOption === 'Transactions'}
                    />
                    <span className="ml-1 mr-4 text-gray-300">Transactions</span>
                </label>
                <label  className={`inline-flex items-center ${
                    selectedOption === 'Weight' || (selectedOption === 'SPB' && isOrdChecked)
                        ? 'text-blue-600'
                        : 'text-gray-300'
                    }`}>
                    <input
                    type="radio"
                    name="Weight"
                    id="chart_type_weight"
                    value="Weight"
                    className="form-radio h-3 w-5 "
                    onChange={handleOptionChange}
                    checked={selectedOption === 'Weight' || (selectedOption === 'SPB' && isOrdChecked)}
                    />
                    <span className="ml-1 mr-4 ">Weight</span>
                </label>
                   
            <label>
                <input type="checkbox" 
                    id="chart_type_avg" 
                    className="relative peer shrink-0 appearance-none w-3 h-3 border-2 border-blue-500 rounded-sm bg-white mt-1 checked:bg-blue-800 checked:border-0" 
                    onChange={handleAvgCheckboxChange} 
                    checked={isAvgChecked}
                />
                <label className='ml-2 me-4  text-gray-300' for="chart_type_avg">6 bl. avg</label>

                <input type="checkbox"
                    id="chart_type_ord" 
                    className="relative peer shrink-0 appearance-none w-3 h-3 border-2 border-blue-500 rounded-sm bg-white mt-1 checked:bg-blue-800 checked:border-0" 
                    onChange={handleOrdCheckboxChange} 
                    checked={isOrdChecked}
                />
                <label className='ml-2 me-4 text-gray-300' for="chart_type_avg">Ord. %</label>
            </label>
                </div>
                <div className=''>
                    {/* Graph */}
                    <HomeLineChart chartType={selectedOption} isAvgChecked={isAvgChecked} isOrdChecked={isOrdChecked}/> 
                </div>
            </div>
        </div>

        
        <div className='flex ml-[10px] my-[-110px] md:ml-[50px] mr-[50px] pb-2'>
            <div className='flex flex-col min-h-[135px] min-w-[1100px] rounded-xl bg-gray-800 shadow-xl shadow-current p-4 mx-px'> 
                <div className='font-bold text-2xl text-gray-300 pb-2'>
                   Last Block 
                </div>
                <div className="inline-flex items-center pb-1"> 
                   <div className='flex space-x-2 ml-1 mr-4 text-gray-400 font-medium'> 
                    <div className='flex space-x-2 pr-4'>
                        <p>Block Hash:</p>
                        <p className='text-gray-300'>{hash}</p>
                    </div>
                    <div className='flex space-x-2'>
                        <p>Last Header:</p>
                        <p className='text-gray-300'>{lastHeader}</p>
                    </div>
                   </div> 
                </div>
                <div className="inline-flex items-center">
                    <div className='flex space-x-2 ml-1 mr-4 text-gray-400 font-medium'>
                        <div className='flex space-x-2 pr-4'>
                            <p>Version:</p>
                            <p className='text-gray-300'>0x{version}</p>
                        </div>
                        <div className='flex space-x-2 pr-4'>
                            <p>Received:</p>
                            <p className='text-gray-300'>{received<120 ? received + 'sec ago': (received/60.0).toFixed(1) +  "min ago"}</p>
                        </div>
                        <div className='flex space-x-2 pr-4'>
                            <p>Timestamp:</p>
                            <p className='text-gray-300'>{timestamp}</p>
                        </div>
                        <div className='flex space-x-2 pr-4'>
                            <p>Median:</p>
                            <p className='text-gray-300'>{median}</p>
                        </div>
                        <div className='flex space-x-2 pr-4'>
                            <p>Difficulty:</p>
                            <p className='text-gray-300'>{difficulty}</p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

        <div className='flex ml-[10px] my-[130px] md:ml-[50px] mr-[50px] pb-21 space-x-5'>
            <HomeNetwork />
            

            <div className='flex flex-col min-h-[135px] min-w-[580px] rounded-xl bg-gray-800 shadow-xl shadow-current p-4 mx-px'>
                <HomeNode />
            </div>
        </div>

    </div>


    </>
  )
}

export default RecentBlockCard