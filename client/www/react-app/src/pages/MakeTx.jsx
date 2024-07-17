import React from 'react'
import DisplayWallet from '../component/MakeTx/DisplayWallet'
import TopNavBar from '../component/TopNavBar'
import SideNavBar from '../component/SideNavBar'
function MakeTx() {
  return (
    <div>
        <TopNavBar />
        <SideNavBar />
        <DisplayWallet />
    </div>
  )
}

export default MakeTx