import React from 'react'
import WalletStatus from '../component/Wallet/WalletStatus'
import TopNavBar from '../component/TopNavBar';
import SideNavBar from '../component/SideNavBar';
function Wallet() {
  return (
    <div className='flex flex-row'>
        {/* <SideNavBar /> */}
        <WalletStatus />
    </div>
  )
}

export default Wallet;