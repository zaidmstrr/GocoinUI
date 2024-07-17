import React, { useState, useEffect } from 'react';
import { IoIosMusicalNotes } from "react-icons/io";

function SoundDisplay() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const storedValue = localStorage.getItem('soundEnabled');
    return storedValue === 'true'; // Parse the stored string value to boolean
  });

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled);
  }, [soundEnabled]);

  const handleSoundToggle = () => {
    setSoundEnabled((sound) => !sound);
  };

  return (
    <div>
      <div className='flex pl-16 w-full items-center content-center justify-center space-x-1'>
        <input
        //   onClick={handleSoundToggle}
          onChange={handleSoundToggle}
          type="checkbox"
          className="form-checkbox h-3 w-3 text-blue-600 bg-gray-600 border-gray-500"
          checked={soundEnabled} // Bind the checkbox state to the soundEnabled state
        />
        <IoIosMusicalNotes size={20} />
      </div>
    </div>
  );
}

export default SoundDisplay;
