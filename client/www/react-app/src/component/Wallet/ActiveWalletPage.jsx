import React from 'react'
import axios from 'axios';
import ShowQRCode from './ShowQRCode';
import { useState, useEffect } from 'react';
import { BsQrCode } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { ImCross } from "react-icons/im";
import DisplayTransPopup from './ShowModal';
import WriteAndSavePopup from './WriteAndSavePopup';
import { blockHeightAtom } from '../../store/atoms/blockHeightAtom';
import { callFunctionAtom } from '../../store/atoms/walletFuncAtom';
import { callWalletRefresh } from '../../store/atoms/walletFuncAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { satToBtc, parse_wallet } from '../Functions';
import CopyTextComponent from './CopyText';


function ActiveWalletPage() {
    const blockHeight = useRecoilValue(blockHeightAtom);
    const setFunction = useSetRecoilState(callFunctionAtom);

    const [walletDeleteMark, setWalletDeleteMark] = useState(0)


    let currBlockHeight = 0;

    const [selectedOptionsForBaseAdd, setSelectedOptionsForBaseAdd] = useState('New/P2TAP');
    const [selectedOptionsForSegwit, setSelectedOptionsForSegwit] = useState('P2WPKH');

    const [balances, setBalances] = useState([]);
    const [walletDataFromAPI, setWalletDataFromAPI] = useState([]);
    const [localWalletData, setLocalWalletData] = useState([]);
    const [storedNames, setStoredNames] = useState([]);
    
    
    // const [walletData, setWalletData] = useState(localStorage.getItem('textareaValue'));
   
    
    const storedName = localStorage.getItem('names');
    // let tempNames 
    // if (storedName) {
    let    tempNames = (JSON.parse(storedName))
    // }
    console.log(storedName)
    const [walletData, setWalletData] = useState('Default');
    const [walletName, setWalletName] = useState('Default');

    
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mempool, setMempool] = useState(true);


    let setWalletRefresh = useSetRecoilState(callWalletRefresh)
    // console.log(walletRefreshValue)

    // console.log(walletName)

    // const walletData = localStorage.getItem('textareaValue')

    const callToRefresh = (name) => {
        setWalletName(localStorage.getItem(`walletName${name}`));
        setWalletData(localStorage.getItem(`textareaValue${name}`));
    };
    
    const fetchWalletBalance = async () => {

        

        const storedName = localStorage.getItem('names');
        if (storedName) {
            setStoredNames(JSON.parse(storedName))
        console.log(JSON.parse(storedName));
        }

        console.log(storedNames)
        // setWalletName(localStorage.getItem(`walletName${storedNames[0]}`));

        // setWalletData(localStorage.getItem(`textareaValue${storedNames[0]}`))
        let name  = "MyWallet"
      const  wallet = parse_wallet(walletData)
      setLocalWalletData(wallet);
      const walletAddresses = wallet.map(w => w.addr);

      try {
          const response = await axios.post(`/balance.json?${mempool ? "&mempool" : ""}`, walletAddresses);
          console.log(response.data);
          setWalletDataFromAPI(response.data);
          setBalances(response.data);
          
        // Update the UI and handle other states
      } catch (error) {
        // setError(error);
        console.error("Error fetching wallet balance", error);
      } finally {
        // setLoading(false);
      }
    };

    
    useEffect(() => {
        setWalletRefresh(() => callToRefresh)
        setFunction(() => fetchWalletBalance);
        fetchWalletBalance();
    }, [mempool, walletData, blockHeight, walletName, walletDeleteMark]);
     
    if(true){
        if(currBlockHeight == 0){
            currBlockHeight = blockHeight;
        }
        else if(currBlockHeight != blockHeight){
            currBlockHeight = blockHeight
            fetchWalletBalance();
        }
    }

    const populateTable = () => {
        return localWalletData.map((wallet, index) => {
          const walletData = walletDataFromAPI[wallet.addr] || {};
          const walletValue = walletData.Value ? satToBtc(walletData.Value) : 0; // Provide a fallback value if `Value` is undefined
          let addr = wallet.addr
          if(!walletData.SegWitAddr) {
            return 
          }
          return (
            <tr key={wallet.addr} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
              <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                <div className='flex items-center space-x-1'>
                  <div><ShowQRCode addr={wallet.addr} label={wallet.label}/></div>
                  <p>{wallet.addr}</p>
                  <div><CopyTextComponent  addr={wallet.addr}/></div>
                </div>
              </th>
              <td className="px-6 py-4">
                {wallet.label}
              </td>
              <td className="px-6 py-4">
                {walletValue}
              </td>
              <td className="px-6 py-4 text-blue-200">
                {addSelection(wallet.addr)}
              </td>
              <td className="px-6 py-4 text-right">
                {outSelection(wallet.addr)}
              </td>
            </tr>
          );
        });
      }
    
      const populateTable2 = () => {
          return TransIdArray.map((wallet, index) => {
      
            return (
              <tr key={index} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                  <div className='flex items-center space-x-1'>
                    <p>{wallet}</p>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <DisplayTransPopup txid={wallet}/>
                </td>
              </tr>
            );
          });
        }

    // Showing the Outs 
    const outSelection = (add) => {
            const walletData = walletDataFromAPI[add] || {};
            if(walletData.OutCnt == 0){
                return (
                    <div>
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                            <ImCross />
                        </a>
                    </div>
                )
            }else {
                return (
                    <div className='flex '>
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                            {walletData.OutCnt}
                        </a>
                    </div>
                )
            }
    }

    // Showing the Addresses in a table
    const addSelection = (address) => {
        const walletData = walletDataFromAPI[address] || {};
        if(selectedOptionsForSegwit == 'P2WPKH') {
            return (
                <div className='flex items-center space-x-1'>
                    <p ><BsQrCode /></p>
                    <p>{walletData.SegWitNativeAddr}</p>
                    <p><MdOutlineContentCopy style={{ fontSize: 15 }} /></p>
                </div>
            )
        }
        else if (selectedOptionsForSegwit == 'P2SH-P2WPKH'){
            return (
                <div className='flex items-center space-x-1'>
                    <p ><BsQrCode /></p>
                    <p>{walletDataFromAPI[address].SegWitAddr}</p>
                    <p><MdOutlineContentCopy style={{ fontSize: 15 }} /></p>
                </div>
            )
        }
    }

    // Method for finding the unique Transaction IDs to show in Table2
    let TransIdArray = [];
    const getPendingOuts = () => {
        localWalletData.map((wallet, index) => {
            const walletdata  = walletDataFromAPI[wallet.addr] || {};
            if(walletdata.PendingOuts != null){
                walletdata.PendingOuts.forEach(ele => {
                    // TransIdArray.push(ele.TxId)
                    if(!TransIdArray.includes(ele.TxId)){
                        TransIdArray.push(ele.TxId)
                    }
                });
            }
        })
    }
    getPendingOuts();

    
    const calculateTotalAmount = () => {
        let totalAmount = 0.0;
        
        localWalletData.forEach((wallet) => {
            const walletData = walletDataFromAPI[wallet.addr];
            if (walletData && walletData.Value) {
                const walletValue = satToBtc(walletData.Value);
                totalAmount += parseFloat(walletValue);
            }
        });
    
        return <div>{totalAmount.toFixed(8)}</div>;
    }
    

    const calculateTotalOuts = () => {
        let totalOuts = 0;
    
        localWalletData.forEach((wallet) => {
            const walletData = walletDataFromAPI[wallet.addr];
            if (walletData && walletData.OutCnt) {
                totalOuts += parseInt(walletData.OutCnt, 10); // Ensure base 10 is used for parsing
            }
        });
    
        return <div>{totalOuts}</div>;
    }
    
const handleChangeForBaseAdd = (event) => {
    setSelectedOptionsForBaseAdd(event.target.value);
};

const handleChangeForSegwitAdd = (event) => {
    setSelectedOptionsForSegwit(event.target.value);
};


const AvailWalletDisplay = () => {
    // if(walletName == 'Default'){
    //     return (
    //         <p>There is no wallet to display!</p>
    //     )
    // }
    if(true) {
        return (
            <div>
              {storedNames.map((ele, index) => (
                <button
                  key={index}
                  type="button"
                  value={ele}
                  onClick={() => handleWalletChange(ele)}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-[5px] text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {ele}
                </button>
              ))}
            </div>
          );
        
        
    }
}
const handleWalletChange = (name) => {
    // if(storedNames ) {}
    setWalletName(localStorage.getItem(`walletName${name}`));
    setWalletData(localStorage.getItem(`textareaValue${name}`))

}

const handleDelete = () => {


    const storedAllNames = localStorage.getItem('names');
    const namesArray = JSON.parse(storedAllNames);
    if(namesArray.length > 1){
        localStorage.removeItem(`walletName${walletName}`)
        localStorage.removeItem(`textareaValue${walletName}`)
    }
    namesArray.pop();
    let lastName = namesArray[namesArray.length -1]
    setWalletName(localStorage.getItem(`walletName${lastName}`));
    setWalletData(localStorage.getItem(`textareaValue${lastName}`))
    const updatedNames = JSON.stringify(namesArray);
    localStorage.setItem('names', updatedNames);
    console.log("Wallet deleted successfully")
    setWalletDeleteMark((mark) => !mark)

}

const CurrentWalletDisplay = () => {
    // if(walletName == 'Default'){
    //     return (
    //         <p>None</p>
    //     )
    // }
    if(true) {
        return (
            <p className='text-blue-200'>{walletName}</p>
        )
    }
}

  return (
    <div className='md:pl-[290px] pl-4 overflow-x-auto'>
        <div className='flex w-[79vw] justify-end space-x-1 pt-2 pr-4'>
            <div>
                <button disabled={true} type="button" className="text-white focus:ring-2 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-amber-800 border-solid border-2 border-orange-900" >Move Left</button>
            </div>
            <div>
                <button disabled={true}  type="button" className="text-white focus:ring-2 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-amber-800 border-solid border-2 border-orange-900">Move Right</button>
            </div>
            <div>
                <button 
                    type="button" 
                    className="text-white focus:ring-2 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-amber-800 border-solid border-2 border-orange-900"
                    onClick={handleDelete}
                    >
                    Delete this Wallet
                    </button>
            </div>
        </div>
        <div className='mb-2'>
            <p className='text-3xl text-white font-medium pt-2 pb-4'>Your Wallets</p>
            <div className='flex text-gray-300 space-x-2 '>
                <p className=''>Available Wallets:</p>
                <AvailWalletDisplay />
            </div>
        </div>
        <div>
            <div className='flex space-x-2 text-white font-medium text-2xl mb-2'>
                <div className='flex flex-row w-full space-x-1'> 
                    <p>Current Wallet:</p>
                    <CurrentWalletDisplay />
                </div> 
                <div className='flex content-end pr-2'>
                <div type="" className=""><WriteAndSavePopup key={walletName} name={walletName}/></div>  {/* Edit */}
                </div>
            </div>
            <div className='flex text-gray-300 space-x-3 pb-5'>
                <div className='flex '>Balance: 
                    <div className='mx-1 font-bold text-white'>{calculateTotalAmount()}</div>
                    BTC in 
                    <div className='mx-1 font-bold text-white'>
                        {calculateTotalOuts()}
                    </div> 
                    outputs 
                    <p className='mx-1 text-blue-300 hover:text-blue-300'> (balance.zip)</p>  
                </div>
            </div>

            {/* Table  */}
            
            <div className=" overflow-x-auto oshadow-md rounded-lg mr-11">
                <table className="w-full text-sm text-left  text-gray-400">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 ">
                                <select className="appearance-none bg-gray-700  border-gray-300 text-gray-200 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-grey-700"
                                    value={selectedOptionsForBaseAdd}
                                    onChange={handleChangeForBaseAdd}
                                >
                                    <option value="New/P2TAP">Base Address (New / P2TAP)</option>
                                    <option value="Old/P2KH">Base Address (Old / P2KH)</option>
                                </select>
                                <div className="absolute top-0 right-0 mt-2 mr-2">
                                <svg className="fill-current h-4 w-4 text-gray-700"  viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.657 6.586 4.293 8z"/></svg>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Label
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Balance BTC
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <select className="appearance-none bg-gray-700  border-gray-300 text-gray-200 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-grey-700"
                                    value={selectedOptionsForSegwit}
                                    onChange={handleChangeForSegwitAdd}
                                >
                                    <option value="P2WPKH">Version 0 Segwit Address (P2WPKH)</option>
                                    <option value="P2SH-P2WPKH">Version 0 Segwit Address (P2SH-P2WPKH)</option>
                                </select>
                               
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Outs
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {populateTable()}
                    </tbody>
                </table>
            </div>

            <div>
                
            </div>
            {/* Table for outgoing and incoming transaction */}
            <div>
                <div className='flex space-x-2 text-white font-medium text-2xl mb-2 mt-4' >
                    <div className='flex flex-row w-full'> 
                        <p>Incoming/Outgoing Transactions</p>
                    </div> 
                
                </div>
            
            <div className=" overflow-x-auto oshadow-md rounded-lg mr-11 mt-4 mb-4">
                <table className="w-full text-sm text-left  text-gray-400">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 ">
                               Transaction ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                View
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {populateTable2()}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    </div>
  )
  totAmountRef.current = 0
}

export default ActiveWalletPage