import React, { useState } from 'react';
import WriteAndSavePopup from './WriteAndSavePopup';


const ParentComponent = () => {
  const [savedText, setSavedText] = useState('');

  const handleSave = (text) => {
    setSavedText(text);
    console.log('Saved text:', text);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Main Component</h1>
      <WriteAndSavePopup onSave={handleSave} />
      {savedText && (
        <div className="mt-4 p-2 border rounded-md bg-gray-100">
          <h4 className="text-md font-semibold">Saved Text:</h4>
          <p>{savedText}</p>
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
