import React from 'react'
import { useState } from 'react';
import QRCode from 'qrcode.react';
import { BsQrCode } from "react-icons/bs";

function ShowQRCode({addr, label}) {
    // const [address, setAddress] = useState();
    // const [lab, setLab] = useState();

    const [showModal, setShowModal] = useState(false);

    // setAddress(addr);
    // setLab(label);

    const handleButtonClick = () => {
        setShowModal(true);
      };

    return (
        <div>
          <button onClick={handleButtonClick}><BsQrCode /></button>
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
                      Show QR Code
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
                  
                   
                    {/* <label for="message" className="block mb-2 text-sm font-medium text-white">QR Generated successfully</label> */}
                    <div 
                        id="message" 
                        rows="4" 
                        // value={text}
                        // onChange={handleTextareaChange} 
                        className="h-fit block p-2.5 w-full text-sm rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Write your wallet details here...">
                        <div className='flex flex-col justify-center content-center items-center'>
                            <div className=" text-center mt-12 ">
                                {/* <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1> */}
                                <QRCode  
                                    value={addr} 
                                    size={300} 
                                    bgColor="#374151" 
                                    fgColor="#e5e7eb"
                                    level="Q"
                                    includeMargin={true}
                                />
                                {/* <p className="mt-4">Scan the QR code to show: {addr}</p> */}
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className="mt-4">Scan the QR code to show: "{addr}"</p> 
                                <p>Label/Name: "{label}"</p>
                            </div>
                        </div>
                    </div>
                    
                  </div>
                  <div className="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t  rounded-b border-gray-600">
                    <button
                      type="button"
                      className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                      onClick={() => {setShowModal(false) }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
}

export default ShowQRCode