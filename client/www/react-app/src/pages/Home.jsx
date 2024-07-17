import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideNavBar from '../component/SideNavBar';
import TopNavBar from '../component/TopNavBar';
import RecentBlockCard from '../component/Home/RecentBlockCard';
function Home() {
  

  return (
    <div className='flex flex-row'>
      {/* <SideNavBar /> */}
      <RecentBlockCard />
    </div>
  );
}

export default Home;