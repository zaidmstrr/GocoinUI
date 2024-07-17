import React, { useState } from 'react';
import { MdOutlineContentCopy } from "react-icons/md"; // Import the copy icon from react-icons

function CopyTextComponent({addr}) {
  const [copySuccess, setCopySuccess] = useState('');

  const textToCopy = addr;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => {
        setCopySuccess('');
      }, 2000); // Clear the success message after 2 seconds
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="flex flex-row ">
      
      <button onClick={copyToClipboard} className="">
        <MdOutlineContentCopy className="mr-2" />
        
      </button>
      {copySuccess && <div className=" text-blue-300">{copySuccess}</div>}
    </div>
  );
}

export default CopyTextComponent;
