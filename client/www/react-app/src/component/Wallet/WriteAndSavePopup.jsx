import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { callFunctionAtom } from '../../store/atoms/walletFuncAtom';
import { callWalletRefresh } from '../../store/atoms/walletFuncAtom';

const WriteAndSavePopup = ({name}) => {

  const callFunc = useRecoilValue(callFunctionAtom);
  const myWalletRefresh = useRecoilValue(callWalletRefresh)

//   const storedName = localStorage.getItem('walletName');
  const [showModal, setShowModal] = useState(false);
  const [walletNamesArray, setWalletNamesArray] = useState([])
//   const [walletName, setWalletName] = useState('Default');

  const [walletName, setWalletName] = useState(name);
  const [walletNameToShow, setwalletNameToShow] = useState(name);
  const [walletTextToShow, setwalletTextToShow] = useState(localStorage.getItem(`textareaValue${name}`));


  const [text, setText] = useState(
    localStorage.getItem(`textareaValue${name}`));

    useEffect(() => {
      // setText(localStorage.getItem(`textareaValue${name}`))
      // const firstName = 'Default'
      // const storedNamesFirst = JSON.parse(localStorage.getItem('names')) || [];
      // if(storedNamesFirst.length == 0) {
      //   setWalletNamesArray((prevNames) => [...prevNames, firstName]);
      //   localStorage.setItem('names', JSON.stringify([...storedNamesFirst, firstName]));
      // }

      setwalletNameToShow(name);
      setwalletTextToShow(localStorage.getItem(`textareaValue${name}`))
      const storedNames = localStorage.getItem('names');
      if (storedNames) {
        setWalletNamesArray(JSON.parse(storedNames));
      }
    }, [name,text,callFunc]);

  const handleButtonClick = () => {
    setShowModal(true);
  }; 

  const handleWalletNameChange = (e) => {
    const newValue = e.target.value;
    setWalletName(newValue);
    // localStorage.setItem('walletName', newValue);

    if (callFunc) {
      callFunc();
    } else {
      console.log('Function not set');
    }
  };
  
  const handleNameSubmit = () => {
    let newValue = walletName;
    localStorage.setItem(`walletName${walletName}`, newValue);
  }

  const handleTextareaChange = (e) => {
    const newValue = e.target.value
    setText(newValue);
    // localStorage.setItem('textareaValue' + walletName, newValue);   abhi nhi baad meai submit ke time

    if (callFunc) {
      callFunc();
    } else {
      console.log('Function not set');
    }
  }

  const handleSubmit = () => {
    let newValue = text;
    localStorage.setItem(`textareaValue${walletName}`, newValue);
    localStorage.setItem(`walletName${walletName}`, walletName);
    storeWalletNames(walletName)

    if (callFunc) {
      callFunc();
    } else {
      console.log('Function not set');
    }

    if(myWalletRefresh){
      myWalletRefresh(walletName)
    }
    setShowModal(false)
  }

  const storeWalletNames = (newName) => {
    const storedNames = JSON.parse(localStorage.getItem('names')) || [];
    if (!storedNames.includes(newName)) {
      setWalletNamesArray((prevNames) => [...prevNames, newName]);
      localStorage.setItem('names', JSON.stringify([...storedNames, newName]));
    } else {
      console.log(`Name "${newName}" is already present in the list.`);
    }
    
  }


  return (
    <div>
      <button
        onClick={handleButtonClick}
        className=" text-white focus:ring-2 font-medium rounded-lg text-sm px-4 py-1 me-2 mb-2 bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-amber-800 border-solid border-2 border-orange-900"
      >
        Edit
      </button>
      {showModal && (
        <div
          className="mt-30 ml-96 fixed top-0 left-10 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full "
          role="dialog"
          aria-modal="true"
        >
         {/* Backdrop element */}
         <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 "
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-4xl max-h-full">
            <div className=" rounded-lg shadow bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600">
                <h3 className="text-xl font-medium text-white">
                  Edit Wallet Details
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                  onClick={() => setShowModal(false)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
              <div className="max-w-sm p-0 pt-2 flex items-center">
                    <p className='text-sm mr-2'>Edit Wallet name: </p>
                    <input
                        type="text"
                        value={walletName}
                        onChange={handleWalletNameChange}
                        placeholder={walletNameToShow}
                        className="p-1 pl-1 rounded-md text-sm text-gray-600"
                    />
                    <button 
                      className='text-sm bg-blue-500 rounded-2xl px-2 py-1 ml-2'
                      onClick={handleNameSubmit}
                      >Submit
                    </button>
                    {/* <p className="text-gray-600 text-xs">{inputValue}</p> */}
                </div>
               
                <label for="message" className="block mb-2 text-sm font-medium text-white">Add details like (Type, Addresses, Label)</label>
                <textarea 
                    id="message" 
                    rows="4" 
                    value={text}
                    onChange={handleTextareaChange} 
                    className="h-screen block p-2.5 w-full text-sm rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Write your wallet details here...">
                </textarea>
                
              </div>
              <div className="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t  rounded-b border-gray-600">
                <button
                  type="button"
                  className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                  onClick={handleSubmit}
                >
                  Save and Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WriteAndSavePopup;